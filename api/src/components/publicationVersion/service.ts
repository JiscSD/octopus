import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import { Browser, launch } from 'puppeteer-core';
import { convert } from 'html-to-text';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import * as client from 'lib/client';
import * as eventService from 'event/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';
import * as s3 from 'lib/s3';
import * as sqs from 'lib/sqs';
import { licences } from 'lib/enum';

export const defaultPublicationVersionInclude = {
    publication: {
        select: {
            id: true,
            type: true,
            doi: true,
            url_slug: true,
            externalId: true,
            externalSource: true
        }
    },
    publicationStatus: {
        select: {
            status: true,
            createdAt: true,
            id: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    },
    funders: {
        select: {
            id: true,
            city: true,
            country: true,
            name: true,
            link: true,
            ror: true,
            grantId: true
        }
    },
    coAuthors: {
        select: {
            id: true,
            email: true,
            linkedUser: true,
            publicationVersionId: true,
            confirmedCoAuthor: true,
            approvalRequested: true,
            createdAt: true,
            reminderDate: true,
            isIndependent: true,
            affiliations: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    orcid: true,
                    role: true,
                    url: true
                }
            }
        },
        orderBy: {
            position: 'asc'
        }
    },
    user: {
        select: {
            id: true,
            orcid: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            url: true
        }
    },
    topics: {
        select: {
            id: true,
            title: true,
            createdAt: true
        }
    },
    additionalInformation: {
        select: {
            id: true,
            title: true,
            url: true,
            description: true
        }
    }
} satisfies Prisma.PublicationVersionInclude;

export const getById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: defaultPublicationVersionInclude
    });

export const get = (publicationId: string, version: string | number) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...(typeof version === 'number' || Number(version)
                ? { versionNumber: Number(version) }
                : version === 'latest'
                ? { isLatestVersion: true }
                : version === 'latestLive'
                ? {
                      isLatestLiveVersion: true
                  }
                : { id: version })
        },
        include: defaultPublicationVersionInclude
    });

export const getAllByPublicationIds = async (ids: string[]) => {
    // Get latest versions of these publications
    const latestVersions = await client.prisma.publicationVersion.findMany({
        where: {
            versionOf: {
                in: ids
            },
            isLatestLiveVersion: true
        },
        include: {
            publication: {
                select: {
                    id: true,
                    type: true,
                    doi: true,
                    url_slug: true,
                    linkedFrom: {
                        where: {
                            publicationFrom: {
                                type: 'PEER_REVIEW',
                                versions: {
                                    some: {
                                        isLatestLiveVersion: true
                                    }
                                }
                            }
                        }
                    },
                    publicationFlags: {
                        where: {
                            resolved: false
                        }
                    }
                }
            },
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    id: true,
                    orcid: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    user: {
                        select: {
                            orcid: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

    if (ids.length !== latestVersions.length) {
        throw Error('Unable to find all latest versions for all requested publications.');
    }

    // Provide counts
    const mappedResults = latestVersions.map((version) => {
        // Remove linkedFrom and flags from return
        const { linkedFrom, publicationFlags, ...rest } = version.publication;

        return {
            ...version,
            publication: {
                ...rest,
                flagCount: version.publication.publicationFlags.length,
                peerReviewCount: version.publication.linkedFrom.length
            }
        };
    });

    return mappedResults;
};

export const update = (id: string, data: Prisma.PublicationVersionUpdateInput) =>
    client.prisma.publicationVersion.update({
        where: {
            id
        },
        // Make sure updatedAt changes - only changing relations will not cause this otherwise.
        data: { ...data, updatedAt: new Date().toISOString() },
        include: defaultPublicationVersionInclude
    });

export const validateConflictOfInterest = <
    // Use generic so this can be run on incoming request bodies for validation as well.
    T extends { conflictOfInterestStatus?: boolean | null; conflictOfInterestText?: string | null }
>(
    version: T
) => {
    if (version.conflictOfInterestStatus) {
        if (!version.conflictOfInterestText?.length) return false;
    } else if (version.conflictOfInterestStatus === null) {
        return false;
    }

    return true;
};

export const checkIsReadyToPublish = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const hasAtLeastOneLinkOrTopic =
        linkedTo.length !== 0 ||
        (publicationVersion.publication.type === 'PROBLEM' && publicationVersion.topics.length !== 0);
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publicationVersion[field]) &&
        !Helpers.isEmptyContent(publicationVersion.content || '');
    const conflictOfInterest = validateConflictOfInterest(publicationVersion);
    const hasPublishDate = Boolean(publicationVersion.publishedDate);
    const isDataAndHasEthicalStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.dataPermissionsStatement !== null : true;

    const coAuthorsAreVerified = !!publicationVersion.coAuthors.every(
        (coAuthor) => coAuthor.confirmedCoAuthor && (coAuthor.isIndependent || coAuthor.affiliations.length)
    );

    return (
        hasAtLeastOneLinkOrTopic &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        !hasPublishDate &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        coAuthorsAreVerified &&
        publicationVersion.isLatestVersion
    );
};

export const checkIsReadyToRequestApprovals = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    if (!publicationVersion.isLatestVersion || publicationVersion.currentStatus !== 'DRAFT') {
        return false;
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const hasAtLeastOneLinkOrTopic =
        linkedTo.length !== 0 ||
        (publicationVersion.publication.type === 'PROBLEM' && publicationVersion.topics.length !== 0);
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publicationVersion[field]) &&
        !Helpers.isEmptyContent(publicationVersion.content || '');
    const conflictOfInterest = validateConflictOfInterest(publicationVersion);
    const isDataAndHasEthicalStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.dataPermissionsStatement !== null : true;
    const hasConfirmedAffiliations = !!publicationVersion.coAuthors.some(
        (author) =>
            author.linkedUser === publicationVersion.createdBy && (author.isIndependent || author.affiliations.length)
    );

    return (
        hasAtLeastOneLinkOrTopic &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        hasConfirmedAffiliations &&
        publicationVersion.isLatestVersion
    );
};

export const checkIsReadyToLock = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    if (publicationVersion.currentStatus !== 'DRAFT') {
        return false;
    }

    const isReadyToRequestApprovals = await checkIsReadyToRequestApprovals(publicationVersion);
    const hasRequestedApprovals = !!publicationVersion.coAuthors.some((author) => author.approvalRequested);

    return isReadyToRequestApprovals && hasRequestedApprovals;
};

export const deleteVersion = async (publicationVersion: I.PublicationVersion) => {
    if (
        publicationVersion.isLatestVersion &&
        publicationVersion.versionNumber === 1 &&
        publicationVersion.currentStatus !== 'LIVE'
    ) {
        // if there's only one DRAFT version and that's the latest one, we can safely delete the entire publication
        await publicationService.deletePublication(publicationVersion.versionOf);
    } else {
        // delete this version
        await client.prisma.publicationVersion.delete({
            where: {
                id: publicationVersion.id
            }
        });

        // delete draft links for this version
        await client.prisma.links.deleteMany({
            where: {
                publicationFromId: publicationVersion.versionOf,
                draft: true
            }
        });

        // get previous version
        const previousVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: publicationVersion.versionOf,
                versionNumber: publicationVersion.versionNumber - 1
            },
            select: {
                id: true
            }
        });

        if (previousVersion) {
            // make the previous version "isLatestVersion=true"
            await client.prisma.publicationVersion.update({
                where: {
                    id: previousVersion.id
                },
                data: {
                    isLatestVersion: true
                }
            });
        }
    }
};

export const create = async (previousVersion: I.PublicationVersion, user: I.User) => {
    const newVersionNumber = previousVersion.versionNumber + 1;
    const previousVersionReferences = await referenceService.getAllByPublicationVersion(previousVersion.id);
    const previousVersionCoAuthors = previousVersion.coAuthors.map((coAuthor, index) =>
        coAuthor.linkedUser === user.id
            ? {
                  email: user.email ?? '',
                  linkedUser: user.id,
                  confirmedCoAuthor: true,
                  approvalRequested: false,
                  affiliations: coAuthor.affiliations as unknown[] as Prisma.InputJsonValue[],
                  isIndependent: coAuthor.isIndependent,
                  position: index
              }
            : {
                  email: coAuthor.email,
                  position: index
              }
    );

    if (!previousVersionCoAuthors.find((coAuthor) => coAuthor.linkedUser === user.id)) {
        // enforce adding the new corresponding author to coAuthors list - mainly used for seed data eg. tests..
        previousVersionCoAuthors.unshift({
            email: user.email ?? '',
            linkedUser: user.id,
            confirmedCoAuthor: true,
            approvalRequested: false,
            affiliations: [],
            isIndependent: false,
            position: 0
        });
    }

    // create new version based on the previous one
    const newPublicationVersion = await client.prisma.publicationVersion.create({
        data: {
            id: `${previousVersion.versionOf}-v${newVersionNumber}`,
            versionOf: previousVersion.versionOf,
            versionNumber: newVersionNumber,
            title: previousVersion.title,
            licence: previousVersion.licence,
            description: previousVersion.description,
            keywords: previousVersion.keywords,
            content: previousVersion.content,
            language: previousVersion.language,
            ethicalStatement: previousVersion.ethicalStatement,
            ethicalStatementFreeText: previousVersion.ethicalStatementFreeText,
            dataPermissionsStatement: previousVersion.dataPermissionsStatement,
            dataPermissionsStatementProvidedBy: previousVersion.dataPermissionsStatementProvidedBy,
            dataAccessStatement: previousVersion.dataAccessStatement,
            selfDeclaration: previousVersion.selfDeclaration,
            fundersStatement: previousVersion.fundersStatement,
            conflictOfInterestStatus: previousVersion.conflictOfInterestStatus,
            conflictOfInterestText: previousVersion.conflictOfInterestText,
            createdBy: user.id,
            publicationStatus: {
                create: {
                    status: 'DRAFT'
                }
            },
            coAuthors: {
                // add co authors from the previous version
                createMany: {
                    data: previousVersionCoAuthors
                }
            },
            // add topics from previous version
            topics: previousVersion.topics.length
                ? {
                      connect: previousVersion.topics.map((topic) => ({ id: topic.id }))
                  }
                : undefined,
            // add references from the previous version
            References: {
                createMany: {
                    data: previousVersionReferences.map((reference) => ({
                        id: createId(),
                        text: reference.text,
                        type: reference.type,
                        location: reference.location
                    }))
                }
            },
            // add funders from previous version
            funders: {
                createMany: {
                    data: previousVersion.funders.map((funder) => ({
                        ror: funder.ror,
                        city: funder.city,
                        country: funder.country,
                        link: funder.link,
                        name: funder.name,
                        grantId: funder.grantId
                    }))
                }
            },
            additionalInformation: {
                createMany: {
                    data: previousVersion.additionalInformation.map((additionalInformation) => ({
                        title: additionalInformation.title,
                        url: additionalInformation.url,
                        description: additionalInformation.description
                    }))
                }
            }
        },
        include: defaultPublicationVersionInclude
    });

    // change previous version "isLatestVersion" to false
    await client.prisma.publicationVersion.update({
        where: {
            id: previousVersion.id
        },
        data: {
            isLatestVersion: false
        }
    });

    return newPublicationVersion;
};

export const transferOwnership = (publicationVersionId: string, requesterId: string, requesterEmail: string) =>
    update(publicationVersionId, {
        user: {
            connect: {
                id: requesterId
            }
        },
        coAuthors: {
            // create/update the new corresponding author
            upsert: {
                create: {
                    email: requesterEmail,
                    confirmedCoAuthor: true,
                    linkedUser: requesterId
                },
                update: {
                    confirmedCoAuthor: true,
                    linkedUser: requesterId
                },
                where: {
                    publicationVersionId_email: {
                        email: requesterEmail,
                        publicationVersionId: publicationVersionId
                    }
                }
            }
        }
    });

// PDF generation

const formatPDFDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const nthNumber = day > 0 ? ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10] : '';

    return `${day}<sup>${nthNumber}</sup> ${month} ${year}`;
};

const doiLinkBase = `https://${process.env.STAGE === 'prod' ? 'doi.org' : 'handle.test.datacite.org'}/`;

const createPublicationHTMLTemplate = (
    publicationVersion: I.PublicationVersion,
    references: I.Reference[],
    linkedTo: I.LinkedToPublication[]
): string => {
    const {
        title,
        content,
        coAuthors,
        funders,
        conflictOfInterestText,
        language,
        licence,
        ethicalStatement,
        ethicalStatementFreeText,
        dataPermissionsStatement,
        dataPermissionsStatementProvidedBy,
        dataAccessStatement,
        selfDeclaration,
        additionalInformation
    } = publicationVersion;

    // cheerio uses htmlparser2
    // parsing the publication content can sometimes help with unpaired opening/closing tags
    const mainText = content ? cheerio.load(content).html() : '';

    const authors = coAuthors.filter((author) => Boolean(author.confirmedCoAuthor && author.linkedUser));

    // If corresponding author is not found in coauthors list, and we have the necessary fields, mock them up
    if (!authors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        authors.unshift({
            id: publicationVersion.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publicationVersion.user.email || '',
            linkedUser: publicationVersion.createdBy,
            publicationVersionId: publicationVersion.id,
            user: publicationVersion.user,
            reminderDate: null,
            isIndependent: true,
            affiliations: []
        });
    }

    // Get array of all affiliations from all authors
    const allAffiliations = authors
        .map((author) => author.affiliations)
        .flat() as unknown as I.MappedOrcidAffiliation[];
    const allAffiliationsWithNames = allAffiliations.map((affiliation) => ({
        ...affiliation,
        name: Helpers.formatAffiliationName(affiliation)
    })) as I.AffiliationWithFormattedName[];

    // De-duplicate affiliations based on their name
    const seen = new Set();
    const uniqueAffiliations = allAffiliationsWithNames.filter((affiliation) => {
        const duplicate = seen.has(affiliation.name);
        seen.add(affiliation.name);

        return !duplicate;
    });
    // Sort affiliations by name
    const affiliations = uniqueAffiliations.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    // Store the numbers (their index in the ordered "affiliations" array) of an author's affiliations
    // with the author. Then, we can write them alongside the author's name in superscript.
    const authorsWithAffiliationNumbers = authors.map((author) => {
        const authorAffiliations = author.affiliations as unknown as I.MappedOrcidAffiliation[];
        const affiliationNumbers = authorAffiliations
            .map(
                (affiliation) =>
                    affiliations.findIndex((orderedAffiliation) => orderedAffiliation.id === affiliation.id) + 1
            )
            .sort()
            // Remove any zeros. These would arise when the number of the affiliation can't be found.
            .filter((number) => number !== 0)
            .join(', ');

        return {
            ...author,
            affiliationNumbers
        };
    });

    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64InterSemiBold = fs.readFileSync('assets/fonts/Inter-SemiBold.ttf', { encoding: 'base64' });
    const base64InterBold = fs.readFileSync('assets/fonts/Inter-Bold.ttf', { encoding: 'base64' });
    const base64MontserratMedium = fs.readFileSync('assets/fonts/Montserrat-Medium.ttf', { encoding: 'base64' });

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    @font-face {
                        font-family: 'Montserrat';
                        src: url(data:font/ttf;base64,${base64MontserratMedium});
                        font-weight: 500;
                        font-style: normal;
                    }
                    
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterRegular});
                        font-weight: normal;
                        font-style: normal;
                    }
    
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterSemiBold});
                        font-weight: 600;
                        font-style: normal;
                    }
                
                    @font-face {
                        font-family: 'Inter';
                        src: url(data:font/ttf;base64,${base64InterBold});
                        font-weight: 700;
                        font-style: normal;
                    }
    
                    @page {
                        margin: 2.5cm 2.5cm 3cm 2.5cm;
                    }
    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
    
                    html {
                        font-size: 10pt;
                    }
    
                    body {
                        font-family: "Inter", Arial, sans-serif;
                        line-height: 1.6;
                        overflow: hidden;
                    }
    
                    img, svg, video, canvas, audio, iframe, embed, object {
                        display: block;
                        max-width: 100%;
                    }
    
                    table, th, td {
                        border: 1px solid #000;
                    }
    
                    table {
                        table-layout: fixed;
                        width: 100%;
                        border-collapse: collapse;
                        margin: 2rem 0rem;
                    }
    
                    th {
                        text-align: unset;
                        background-color: #eee;
                        font-weight: bold;
                    }
    
                    th, td {
                        padding: 5px;
                        word-wrap: break-word;
                    }
    
                    tr {
                        break-inside: avoid;
                    }
    
                    .section {
                        break-inside: avoid;
                    }
    
                    .section-title {
                        margin-top: 5rem;
                        margin-bottom: 1rem;
                        font-weight: 600;
                        font-size: 12pt;
                    }
    
                    .section-subtitle {
                        font-size: 10pt;
                    }
    
                    #title {
                        font-family: 'Montserrat', sans-serif;
                        text-align: center;
                        max-width: 90%;
                        margin: 0 auto;
                        padding-bottom: 2rem;
                        font-weight: 500;
                    }
    
                    h1 {
                        margin-top: 3rem;
                        font-size: 20pt;
                    }
    
                    h2 {
                        margin-top: 3rem;
                        font-size: 18pt;
                    }
    
                    h3 {
                        margin-top: 2rem;
                        font-size: 16pt;
                    }
    
                    h4 {
                        margin-top: 2rem;
                        font-size: 14pt;
                    }
    
                    h5 {
                        margin-top: 1rem;
                        font-size: 12pt;
                    }
    
                    h6 {
                        margin-top: 1rem;
                        font-size: 10pt;
                    }
    
                    #main-text {
                        margin-top: 4rem;
                        text-align: justify;
                    }
    
                    ul, ol {
                        padding-left: 2rem;
                        margin: 1rem 0rem;
                    }
    
                    li {
                        margin: 0.5rem 0rem;
                    }
    
                    p {
                        margin: 0.5rem 0rem;
                    }
    
                    a {
                        color: #296D89;
                        text-decoration-color: #296D89;
                        text-underline-offset: 2px;
                    }
    
                    .metadata {
                        font-size: 11pt;
                        margin-bottom: 10px;
                    }
    
                    pre {
                        margin: 1rem 0rem;
                        border: 1px solid #121212;
                        background-color: #eee;
                        padding: 1rem;
                        border-radius: 5px;
                    }
                    
                    code {
                        white-space: pre-wrap;
                    }
    
                    sup {
                        font-size: 10px;
                    }
    
                    .reference-location {
                        position: relative;
                        top: -0.5rem;
                        margin-bottom: 1rem;
                    }
                </style>
            </head>
            <body>
            <h1 id="title">${title}</h1>
                <p class="metadata">
                    <strong>Authors:</strong> ${authorsWithAffiliationNumbers
                        .map(
                            (author) =>
                                `<a href="${process.env.BASE_URL}/authors/${author.linkedUser}">${
                                    author.user?.firstName
                                }${author.user?.lastName ? ' ' + author.user.lastName : ''}` +
                                (author.affiliationNumbers.length ? `<sup>${author.affiliationNumbers}</sup>` : '') +
                                '</a>'
                        )
                        .join(', ')}
                </p>
                <p class="metadata">
                    <strong>Publication Type:</strong> ${Helpers.formatPublicationType(
                        publicationVersion.publication.type
                    )}
                </p>
                <p class="metadata">
                    <strong>Publication Date:</strong> ${
                        publicationVersion.publishedDate
                            ? formatPDFDate(publicationVersion.publishedDate)
                            : formatPDFDate(new Date())
                    }
                </p>
                <p class="metadata">
                    <strong>Language:</strong> ${language.toUpperCase()}
                </p>
                <p class="metadata">
                    <strong>License Type:</strong> ${licences[licence]?.niceName}
                </p>
                <p class="metadata">
                    <strong>DOI:</strong> 
                    <a href="${doiLinkBase + publicationVersion.publication.doi}">
                        ${publicationVersion.publication.doi}
                    </a>
                </p>
    
                <div id="main-text">
                    ${mainText}
                </div>
    
                ${
                    additionalInformation.length
                        ? `<div class="section">
                        <h2 class="section-title">Additional parts of this work hosted elsewhere</h2>
                        <ul>
                        ${additionalInformation
                            .map(
                                (additionalInfoEntry) =>
                                    `<li>
                                        <h3 class="section-subtitle"><b>${additionalInfoEntry.title}</b></h3>
                                        ${
                                            additionalInfoEntry.description &&
                                            `<p>${additionalInfoEntry.description}</p>`
                                        }
                                        <p><a href="${additionalInfoEntry.url}" aria-label="${
                                        additionalInfoEntry.title
                                    }">
                                            Link to ${additionalInfoEntry.title}
                                        </a></p>
                                    </li>`
                            )
                            .join('')}
                        </ul>
                    </div>`
                        : ''
                }
    
                <div class="section affiliations">
                    <h2 class="section-title">Affiliations</h2>
                    ${
                        affiliations.length
                            ? '<ol>' +
                              affiliations
                                  .map(
                                      (affiliation) =>
                                          '<li>' +
                                          (affiliation.url
                                              ? `<a href="${affiliation.url}">${affiliation.name}</a>`
                                              : affiliation.name) +
                                          '</li>'
                                  )
                                  .join('') +
                              '</ol>'
                            : '<p>No affiliations have been specified for this publication.</p>'
                    }
                </div>
    
                <div class="section references">
                    <h2 class="section-title">References</h2>
                    ${
                        references.length
                            ? references
                                  .map(
                                      (reference) =>
                                          `${reference.text}${
                                              reference.location
                                                  ? `<p class="reference-location"><a href="${reference.location}">${reference.location}</a></p>`
                                                  : ''
                                          }`
                                  )
                                  .join('')
                            : '<p>No references have been specified for this publication.</p>'
                    }
                </div>
    
                ${
                    linkedTo.length
                        ? ` <div class="section">
                                <h2 class="section-title">Parent publications</h2>
                                ${linkedTo
                                    .map(
                                        (link) =>
                                            `<p style="margin-bottom: 1rem"><a href="${doiLinkBase + link.doi}">${
                                                link.title
                                            }</a></p>`
                                    )
                                    .join('')}
                            </div>`
                        : ''
                }
    
                ${
                    selfDeclaration && ['PROTOCOL', 'HYPOTHESIS'].includes(publicationVersion.publication.type)
                        ? ` <div class="section">
                                <h2 class="section-title">Data access statement</h2>
                                ${
                                    publicationVersion.publication.type === 'PROTOCOL'
                                        ? '<p>Data has not yet been collected according to this method/protocol.</p>'
                                        : '<p>Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)</p>'
                                }
                            </div>`
                        : ''
                }
                
                ${
                    ethicalStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Ethical statement</h2>
                                <p>${ethicalStatement}</p>
                                ${ethicalStatementFreeText ? `<p>${ethicalStatementFreeText}</p>` : ''}
                            </div>`
                        : ''
                }
    
                ${
                    dataPermissionsStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Data permissions statement</h2>
                                <p>${dataPermissionsStatement}</p>
                                ${
                                    dataPermissionsStatementProvidedBy
                                        ? `<p>${dataPermissionsStatementProvidedBy}</p>`
                                        : ''
                                }
                            </div>`
                        : ''
                }
               
                ${
                    dataAccessStatement
                        ? ` <div class="section">
                                <h2 class="section-title">Data access statement</h2>
                                <p>${dataAccessStatement}</p>
                            </div>`
                        : ''
                }
    
                <div class="section">
                    <h2 class="section-title">Funders</h2>
                    ${
                        funders.length
                            ? ` <div>
                        <p>This Research Problem has the following sources of funding:</p>
                        <ul class="funders-list">
                        ${funders
                            .map(
                                (funder) =>
                                    `<li><a href="${funder.link}">${funder.name}</a> - ${funder.city}, ${funder.country}</li>`
                            )
                            .join('')}
                                </ul>
                                </div>`
                            : '<p>No sources of funding have been specified for this publication.</p>'
                    }
                </div>
                <div class="section">
                    <h2 class="section-title">Conflict of interest</h2>
                    ${
                        conflictOfInterestText
                            ? `<p>${conflictOfInterestText}</p>`
                            : '<p>This publication does not have any specified conflicts of interest.</p>'
                    }
                </div>   
            </body>
        </html>`
        .split('\n')
        .join('');

    return htmlTemplate;
};

const createPublicationHeaderTemplate = (publicationVersion: I.PublicationVersion): string => {
    const authors = publicationVersion.coAuthors.filter((author) => author.confirmedCoAuthor && author.linkedUser);

    if (!authors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        authors.unshift({
            id: publicationVersion.createdBy,
            approvalRequested: false,
            confirmedCoAuthor: true,
            createdAt: new Date(),
            email: publicationVersion.user.email || '',
            linkedUser: publicationVersion.createdBy,
            publicationVersionId: publicationVersion.id,
            user: publicationVersion.user,
            reminderDate: null,
            isIndependent: true,
            affiliations: []
        });
    }

    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .header {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: flex;
            justify-content: space-between;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
        }

        .header a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 2px;
        }

        .header sup {
            font-size: 7px;
        }
    </style>
    <div class="header">
        <span>
            ${`${authors[0]?.user?.firstName}${authors[0]?.user?.lastName ? ' ' + authors[0].user.lastName : ''}${
                authors.length > 1 ? ' et al.' : ''
            }`}
        </span>
        <span>
            Published ${
                publicationVersion.publishedDate
                    ? formatPDFDate(publicationVersion.publishedDate)
                    : formatPDFDate(new Date())
            }
        </span>
    </div>`;
};

const createPublicationFooterTemplate = (publicationVersion: I.PublicationVersion): string => {
    const base64InterRegular = fs.readFileSync('assets/fonts/Inter-Regular.ttf', { encoding: 'base64' });
    const base64OctopusLogo = fs.readFileSync('assets/img/OCTOPUS_LOGO_ILLUSTRATION_WHITE_500PX.svg', {
        encoding: 'base64'
    });

    return `
    <style>
        @font-face {
            font-family: 'Inter';
            src: url(data:font/ttf;base64,${base64InterRegular});
            font-weight: normal;
            font-style: normal;
        }

        .footer {
            width: 100%;
            padding: 0.5cm 1.86cm;
            display: grid;
            grid-template-columns: 1fr 0.7fr 1fr;
            align-items: start;
            font-family: "Inter", Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.5;
        }

        .footer > div:nth-of-type(2) {
            text-align: center;
        }

        .footer > div:nth-of-type(3) {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 3px;
        }

        .footer a {
            color: #296D89;
            text-decoration-color: #296D89;
            text-underline-offset: 1px;
            word-break: break-all;
        }

        #octopus-logo {
            width: 24px;
            vertical-align: middle;
            position: relative;
            bottom: 6px;
            text-decoration: none;
        }
    </style>
    <div class="footer">            
        <div>
            <span>DOI: <a href="${doiLinkBase + publicationVersion.publication.doi}">${
        publicationVersion.publication.doi
    }</a></span>
        </div>
        <div>
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>        
        <div>
            Published on <a href="${process.env.BASE_URL}">Octopus.ac</a>
            <a href="${
                process.env.BASE_URL
            }"><img id="octopus-logo" src="data:image/svg+xml;base64,${base64OctopusLogo}"/></a>
        </div>
    </div>`;
};

// AWS Lambda + Puppeteer walkthrough -  https://medium.com/@keshavkumaresan/generating-pdf-documents-within-aws-lambda-with-nodejs-and-puppeteer-46ac7ca299bf
export const generatePDF = async (publicationVersion: I.PublicationVersion): Promise<string | null> => {
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf);
    const htmlTemplate = createPublicationHTMLTemplate(publicationVersion, references, linkedTo);
    const isLocal = process.env.STAGE === 'local';

    let browser: Browser | null = null;

    try {
        chromium.setGraphicsMode = false;

        browser = await launch({
            args: [...chromium.args, '--font-render-hinting=none'],
            executablePath: isLocal ? (await import('puppeteer')).executablePath() : await chromium.executablePath(),
            headless: !!chromium.headless
        });

        console.log('Browser opened!');

        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        console.log('Page viewport set');
        await page.setContent(htmlTemplate, {
            waitUntil: htmlTemplate.includes('<img') ? ['load', 'networkidle0'] : undefined
        });
        console.log('Page content set');

        const pdf = await page.pdf({
            format: 'a4',
            preferCSSPageSize: true,
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: createPublicationHeaderTemplate(publicationVersion),
            footerTemplate: createPublicationFooterTemplate(publicationVersion)
        });
        console.log('Page exported to PDF');

        // upload pdf to S3
        await s3.client.send(
            new PutObjectCommand({
                Bucket: s3.buckets.pdfs,
                Key: `${publicationVersion.versionOf}.pdf`,
                ContentType: 'application/pdf',
                Body: pdf
            })
        );

        console.log('Successfully generated PDF for publicationId: ', publicationVersion.versionOf);

        return `${s3.endpoint}/${s3.buckets.pdfs}/${publicationVersion.versionOf}.pdf`;
    } catch (err) {
        console.error(err);

        return null;
    } finally {
        if (browser) {
            // close all pages
            for (const page of await browser.pages()) {
                await page.close();
            }

            // close browser
            await browser.close();
            console.log('Browser closed!');
        }
    }
};

// DOI functions
const createCreatorObject = (user: I.DataCiteUser): I.DataCiteCreator => {
    return {
        name: Helpers.abbreviateUserName(user), // datacite expects full name in lastname, firstname order
        givenName: user?.firstName,
        familyName: user?.lastName,
        nameType: 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: user?.orcid ? user?.orcid : 'ORCID iD not provided',
                nameIdentifierScheme: 'ORCID',
                schemeUri: 'https://orcid.org/'
            }
        ],
        affiliation: user.affiliations.map((affiliation) => ({
            name: affiliation.organization.name,
            nameType: 'Organizational',
            affiliationIdentifier:
                affiliation.organization['disambiguated-organization']?.['disambiguated-organization-identifier'] || '',
            affiliationIdentifierScheme:
                affiliation.organization['disambiguated-organization']?.['disambiguation-source'] || ''
        }))
    };
};

const getFullDOIsStrings = (text: string): [] | RegExpMatchArray =>
    text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi //eslint-disable-line
    ) || [];

const createDOIPayload = async (
    data:
        | {
              payloadType: 'canonical';
              doi: string;
              publicationVersion: I.PublicationVersion;
              oldPublicationVersionDOIs: string[];
          }
        | {
              payloadType: 'newVersion';
              publicationVersion: I.PublicationVersion;
              previousPublicationVersionDOI?: string;
          }
        | {
              payloadType: 'previousVersion';
              publicationVersion: I.PublicationVersion;
              newPublicationVersionDOI: string;
              previousPublicationVersionDOI?: string;
          }
): Promise<Record<string, unknown>> => {
    const { payloadType, publicationVersion } = data;

    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const creators: I.DataCiteCreator[] = [];
    publicationVersion.coAuthors.forEach((author) => {
        if (author.user) {
            creators.push(
                createCreatorObject({
                    firstName: author.user.firstName,
                    lastName: author.user.lastName,
                    orcid: author.user.orcid,
                    affiliations: author.affiliations as unknown as I.MappedOrcidAffiliation[]
                })
            );
        }
    });

    // check if the creator of this version of the publication is not listed as an author
    if (!publicationVersion.coAuthors.find((author) => author.linkedUser === publicationVersion.createdBy)) {
        // add creator to authors list as first author
        creators?.unshift(
            createCreatorObject({
                firstName: publicationVersion.user.firstName,
                lastName: publicationVersion.user.lastName,
                orcid: publicationVersion.user.orcid,
                affiliations: []
            })
        );
    }

    const linkedPublicationDOIs = linkedTo.map((link) => ({
        relatedIdentifier: link.doi,
        relatedIdentifierType: 'DOI',
        relationType: link.type === 'PEER_REVIEW' ? 'Reviews' : 'Continues'
    }));

    const referenceDOIs = references
        .filter((reference) => reference.type === 'DOI' && reference.location)
        .map((reference) => {
            const doi = getFullDOIsStrings(reference.location as string);

            return {
                relatedIdentifier: doi[0],
                relatedIdentifierType: 'DOI',
                relationType: 'References'
            };
        });

    const otherReferences = references
        .filter((reference) => reference.type !== 'DOI')
        .map((reference) => {
            const mutatedReference = {
                titles: [
                    {
                        title: reference.text.replace(/(<([^>]+)>)/gi, '')
                    }
                ],
                relationType: 'References',
                relatedItemType: 'Other'
            };

            return reference.location
                ? {
                      ...mutatedReference,
                      relatedItemIdentifier: {
                          relatedItemIdentifier: reference.location,
                          relatedItemIdentifierType: 'URL'
                      }
                  }
                : mutatedReference;
        });

    const additionalInformation = publicationVersion.additionalInformation.map((additionalInfoEntry) => ({
        titles: [
            {
                title: additionalInfoEntry.title
            }
        ],
        relationType: 'HasPart',
        relatedItemType: 'Other',
        relatedItemIdentifier: {
            relatedItemIdentifier: additionalInfoEntry.url,
            relatedItemIdentifierType: 'URL'
        }
    }));

    const payload = {
        data: {
            type: 'dois',
            attributes: {
                event: 'publish',
                url:
                    payloadType === 'canonical'
                        ? `${process.env.BASE_URL}/publications/${publicationVersion.versionOf}`
                        : `${process.env.BASE_URL}/publications/${publicationVersion.versionOf}/versions/${publicationVersion.versionNumber}`,
                creators,
                titles: [
                    {
                        title: publicationVersion.title,
                        lang: 'en'
                    }
                ],
                publisher: 'Octopus',
                publicationYear: publicationVersion.createdAt.getFullYear(),
                contributors: [
                    {
                        name: Helpers.abbreviateUserName(publicationVersion.user),
                        contributorType: 'ContactPerson',
                        nameType: 'Personal',
                        givenName: publicationVersion.user.firstName,
                        familyName: publicationVersion.user.lastName,
                        nameIdentifiers: [
                            {
                                nameIdentifier: publicationVersion.user.orcid,
                                nameIdentifierScheme: 'ORCID',
                                schemeUri: 'https://orcid.org/'
                            }
                        ]
                    }
                ],
                language: 'en',
                types: {
                    resourceTypeGeneral: publicationVersion.publication.type === 'PEER_REVIEW' ? 'PeerReview' : 'Other',
                    resourceType: publicationVersion.publication.type
                },
                relatedIdentifiers: [...linkedPublicationDOIs, ...referenceDOIs],
                relatedItems: [...otherReferences, ...additionalInformation],
                fundingReferences: publicationVersion.funders.map((funder) => ({
                    funderName: funder.name,
                    funderIdentifier: funder.ror || funder.link,
                    funderIdentifierType: funder.ror ? 'ROR' : 'Other'
                }))
            }
        }
    };

    switch (payloadType) {
        case 'newVersion': {
            const { previousPublicationVersionDOI } = data;

            const publicationVersionDOIs = [
                {
                    relatedIdentifier: publicationVersion.publication.doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }
            ];

            if (previousPublicationVersionDOI) {
                publicationVersionDOIs.push({
                    relatedIdentifier: previousPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsNewVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                });
            }

            Object.assign(payload.data.attributes, {
                prefix: process.env.DOI_PREFIX,
                relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs],
                version: publicationVersion.versionNumber
            });

            break;
        }

        case 'previousVersion': {
            const { newPublicationVersionDOI, previousPublicationVersionDOI } = data;

            const publicationVersionDOIs = [
                {
                    relatedIdentifier: publicationVersion.publication.doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                },
                {
                    relatedIdentifier: newPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsPreviousVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }
            ];

            if (previousPublicationVersionDOI) {
                publicationVersionDOIs.push({
                    relatedIdentifier: previousPublicationVersionDOI,
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsNewVersionOf',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                });
            }

            Object.assign(payload.data.attributes, {
                relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs],
                version: publicationVersion.versionNumber
            });

            break;
        }

        default: {
            // canonical
            const { oldPublicationVersionDOIs } = data;

            // It's possible there will be no versioned DOIs at all.
            // Peer reviews only get a canonical DOI. In this case, skip this part.
            if (oldPublicationVersionDOIs.length || publicationVersion.doi) {
                const publicationVersionDOIs = [...oldPublicationVersionDOIs, publicationVersion.doi].map((doi) => ({
                    relatedIdentifier: doi,
                    relatedIdentifierType: 'DOI',
                    relationType: 'HasVersion',
                    resourceTypeGeneral: payload.data.attributes.types.resourceTypeGeneral
                }));

                Object.assign(payload.data.attributes, {
                    doi: data.doi,
                    identifiers: [
                        {
                            identifier: `https://doi.org/${data.doi}`,
                            identifierType: 'DOI'
                        }
                    ],
                    relatedIdentifiers: [...payload.data.attributes.relatedIdentifiers, ...publicationVersionDOIs]
                });
            }
        }
    }

    return payload;
};

const createDOI = (payload: Record<string, unknown>): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.post<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

const createPublicationVersionDOI = async (
    publicationVersion: I.PublicationVersion,
    previousPublicationVersionDOI?: string
): Promise<I.DOIResponse> => {
    if (!publicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    const payload = await createDOIPayload({
        payloadType: 'newVersion',
        publicationVersion,
        previousPublicationVersionDOI
    });

    const response = await createDOI(payload);

    return response.data;
};

const updateDOI = (doi: string, payload: Record<string, unknown>): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.put<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}/${doi}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

const updatePreviousPublicationVersionDOI = async (
    previousPublicationVersion: I.PublicationVersion,
    newPublicationVersionDOI: string
): Promise<I.DOIResponse> => {
    if (!previousPublicationVersion.doi) {
        throw Error("Supplied version doesn't have a valid DOI");
    }

    let previousVersionDoi: string | undefined;

    // check if there's a previous version of this previous version
    if (previousPublicationVersion.versionNumber > 1) {
        // get the previous version DOI of this previous version
        const previousVersion = await get(
            previousPublicationVersion.versionOf,
            previousPublicationVersion.versionNumber - 1
        );

        if (previousVersion?.doi) {
            previousVersionDoi = previousVersion.doi;
        }
    }

    const payload = await createDOIPayload({
        payloadType: 'previousVersion',
        newPublicationVersionDOI,
        publicationVersion: previousPublicationVersion,
        previousPublicationVersionDOI: previousVersionDoi
    });

    const response = await updateDOI(previousPublicationVersion.doi, payload);

    return response.data;
};

// Create a separate DOI for a specific publication version.
// Returns the updated version.
export const generateNewVersionDOI = async (
    publicationVersion: I.PublicationVersion,
    previousPublicationVersion?: I.PublicationVersion | null
) => {
    // Peer Reviews do not need this as they can only have 1 version
    if (publicationVersion.publication.type !== 'PEER_REVIEW') {
        const newPublicationVersionDOI = await createPublicationVersionDOI(
            publicationVersion,
            previousPublicationVersion?.doi as string
        );

        if (previousPublicationVersion && previousPublicationVersion.doi) {
            // Update previous version DOI
            // This will indicate that the new version follows the previous one
            await updatePreviousPublicationVersionDOI(
                previousPublicationVersion,
                newPublicationVersionDOI.data.attributes.doi
            );
        }

        // Save the DOI to the database
        return await update(publicationVersion.id, {
            doi: newPublicationVersionDOI.data.attributes.doi
        });
    }
};

export const updateCanonicalDOI = async (
    doi: string,
    latestPublicationVersion: I.PublicationVersion
): Promise<I.DOIResponse> => {
    if (!latestPublicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    // Unless this is a peer review (which doesn't get versioned DOIs, as they only have 1 version)
    // we need to have the DOI of the version so we can reference it in the canonical DOI's metadata.
    if (!latestPublicationVersion.doi && latestPublicationVersion.publication.type !== 'PEER_REVIEW') {
        throw Error("Supplied version doesn't have a valid DOI.");
    }

    const oldPublicationVersionDOIs: string[] = [];

    if (latestPublicationVersion.versionNumber > 1) {
        // get all the other versions DOIs for this publication
        const publication = await publicationService.get(latestPublicationVersion.versionOf);

        if (publication) {
            publication.versions
                .filter((version) => version.id !== latestPublicationVersion.id)
                .forEach((version) => {
                    if (version.doi) {
                        oldPublicationVersionDOIs.push(version.doi);
                    }
                });
        }
    }

    const payload = await createDOIPayload({
        payloadType: 'canonical',
        doi,
        publicationVersion: latestPublicationVersion,
        oldPublicationVersionDOIs
    });

    const response = await updateDOI(doi, payload);

    return response.data;
};

// Actions that run after a version is published (changes status to LIVE).
// Pulled out to a separate function because things may need to run when something is
// published immediately (i.e. not going through full drafting workflow) and bypasses the updateStatus function.
export const postPublishHook = async (
    publicationVersion: I.PublicationVersion,
    skipPdfGeneration?: boolean,
    forceReindex?: boolean
) => {
    try {
        // Ensure links made from a PEER_REVIEW version point to the latest live version of the target publication.
        if (publicationVersion.publication.type === 'PEER_REVIEW') {
            const outdatedDraftLinks = await client.prisma.links.findMany({
                where: {
                    publicationFromId: publicationVersion.versionOf,
                    draft: true,
                    versionTo: {
                        isLatestLiveVersion: false
                    }
                }
            });

            for (const outdatedDraftLink of outdatedDraftLinks) {
                const latestVersionTo = await client.prisma.publicationVersion.findFirst({
                    where: {
                        versionOf: outdatedDraftLink.publicationToId,
                        isLatestLiveVersion: true
                    }
                });

                if (latestVersionTo) {
                    await client.prisma.links.update({
                        where: {
                            id: outdatedDraftLink.id
                        },
                        data: {
                            versionToId: latestVersionTo.id
                        }
                    });
                }
            }
        }

        // Update "draft" links.
        await client.prisma.links.updateMany({
            where: {
                publicationFromId: publicationVersion.versionOf,
                draft: true
            },
            data: {
                draft: false
            }
        });

        // Update previous version's "isLatestLiveVersion" flag.
        if (publicationVersion.versionNumber > 1) {
            await client.prisma.publicationVersion.updateMany({
                where: {
                    versionOf: publicationVersion.versionOf,
                    versionNumber: publicationVersion.versionNumber - 1
                },
                data: {
                    isLatestLiveVersion: false
                }
            });
        }

        // Update the canonical DOI with the latest details from this version.
        await updateCanonicalDOI(publicationVersion.publication.doi, publicationVersion);

        // (Re)index publication in opensearch.
        if (publicationVersion.versionNumber > 1 || forceReindex) {
            // Delete old OpenSearch record.
            await publicationService.deleteOpenSearchRecord(publicationVersion.versionOf);
        }

        await publicationService.createOpenSearchRecord({
            id: publicationVersion.versionOf,
            type: publicationVersion.publication.type,
            title: publicationVersion.title,
            licence: publicationVersion.licence,
            description: publicationVersion.description,
            keywords: publicationVersion.keywords,
            content: publicationVersion.content,
            publishedDate: publicationVersion.publishedDate,
            cleanContent: convert(publicationVersion.content)
        });

        // Delete all pending request control events for this publication version.
        await eventService.deleteMany({
            type: 'REQUEST_CONTROL',
            data: {
                path: ['publicationVersion', 'id'],
                equals: publicationVersion.id
            }
        });

        // Send message to the pdf generation queue.
        // Skipped locally, as there is not an SQS que in localstack.
        // Option to skip, e.g. in bulk import scripts, where instant pdf generation is not a priority.
        // In both cases, the pdf will still be generated the first time it's requested.
        if (process.env.STAGE !== 'local' && !skipPdfGeneration) {
            await sqs.sendMessage(publicationVersion.versionOf);
        }
    } catch (err) {
        console.log('Error in post-publish hook: ', err);
    }
};

export const updateStatus = async (id: string, status: I.PublicationStatusEnum) => {
    const updatedVersion = await client.prisma.publicationVersion.update({
        where: {
            id
        },
        data: {
            currentStatus: status,
            publicationStatus: {
                create: {
                    status
                }
            },
            ...(status === 'LIVE' && {
                publishedDate: new Date().toISOString(),
                isLatestLiveVersion: true
            })
        },
        include: defaultPublicationVersionInclude
    });

    if (status === 'LIVE') {
        await postPublishHook(updatedVersion);
    }

    return updatedVersion;
};
