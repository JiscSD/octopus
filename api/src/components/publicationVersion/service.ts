import axios, { AxiosResponse } from 'axios';
import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as email from 'lib/email';
import * as eventService from 'event/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';
import * as sqs from 'lib/sqs';

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

type PrivatePublicationVersionInclude = typeof defaultPublicationVersionInclude & {
    user: {
        select: {
            email?: true;
        };
    };
    coAuthors: {
        select: {
            email?: true;
        };
    };
};
const privatePublicationVersionInclude: PrivatePublicationVersionInclude = structuredClone(
    defaultPublicationVersionInclude
);
privatePublicationVersionInclude.user.select.email = true;
privatePublicationVersionInclude.coAuthors.select.email = true;

export const getById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: defaultPublicationVersionInclude
    });

export const privateGetById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: privatePublicationVersionInclude
    });

const getVersionFilter = (versionFilter: string) => ({
    ...(typeof versionFilter === 'number' || Number(versionFilter)
        ? { versionNumber: Number(versionFilter) }
        : versionFilter === 'latest'
        ? { isLatestVersion: true }
        : versionFilter === 'latestLive'
        ? {
              isLatestLiveVersion: true
          }
        : { id: versionFilter })
});

export const get = (publicationId: string, versionFilter: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...getVersionFilter(versionFilter)
        },
        include: defaultPublicationVersionInclude
    });

// Get a publication version including fields that shouldn't be exposed in an API response.
export const privateGet = (publicationId: string, versionFilter: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...getVersionFilter(versionFilter)
        },
        include: privatePublicationVersionInclude
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

export const getAllForReporting = async (options: I.GetPublicationVersionsReportingOptions) => {
    const where: Prisma.PublicationVersionWhereInput = {
        currentStatus: 'LIVE',
        user: {
            NOT: {
                id: 'octopus'
            }
        },
        ...(options.dateFrom && options.dateTo
            ? {
                  AND: [
                      {
                          publishedDate: {
                              gte: new Date(options.dateFrom)
                          }
                      },
                      {
                          publishedDate: {
                              lte: new Date(options.dateTo)
                          }
                      }
                  ]
              }
            : options.dateTo
            ? {
                  publishedDate: {
                      lte: new Date(options.dateTo)
                  }
              }
            : options.dateFrom
            ? {
                  publishedDate: {
                      gte: new Date(options.dateFrom)
                  }
              }
            : {}),
        ...(options.authorType === 'individual' && {
            user: {
                role: 'USER'
            }
        }),
        ...(options.authorType === 'organisational' && {
            user: {
                role: 'ORGANISATION'
            }
        })
    };

    const [publicationVersions, total] = await Promise.all([
        client.prisma.publicationVersion.findMany({
            where,
            select: {
                doi: true,
                publishedDate: true,
                versionNumber: true,
                publication: {
                    select: {
                        doi: true,
                        type: true
                    }
                }
            },
            skip: options.offset,
            take: options.limit
        }),
        client.prisma.publicationVersion.count({ where })
    ]);

    return {
        data: publicationVersions,
        metadata: {
            total,
            limit: options.limit,
            offset: options.offset
        }
    };
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

    const { linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );

    const hasLiveLinks =
        linkedTo.length !== 0 && linkedTo.every((linkedPublication) => linkedPublication.currentStatus === 'LIVE');
    const hasLinkedTopic = publicationVersion.publication.type === 'PROBLEM' && publicationVersion.topics.length !== 0;
    const isLinkedToLivePublicationsOrTopic = hasLiveLinks || hasLinkedTopic;
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
        isLinkedToLivePublicationsOrTopic &&
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

    const { linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );

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

export const create = async (previousVersion: I.PrivatePublicationVersion, user: I.User) => {
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

// DOI functions
const createCreatorObject = (user: I.DataCiteUser): I.DataCiteCreator => {
    return {
        name: Helpers.abbreviateUserName(user), // datacite expects full name in lastname, firstname order
        givenName: user?.firstName,
        familyName: user?.lastName,
        nameType: user.role === 'ORGANISATION' ? 'Organizational' : 'Personal',
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
    const { linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        false
    );

    const creators: I.DataCiteCreator[] = [];
    publicationVersion.coAuthors.forEach((author) => {
        if (author.user) {
            creators.push(
                createCreatorObject({
                    firstName: author.user.firstName,
                    lastName: author.user.lastName,
                    orcid: author.user.orcid,
                    affiliations: author.affiliations as unknown as I.MappedOrcidAffiliation[],
                    role: author.user.role
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
                affiliations: [],
                role: publicationVersion.user.role
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
                        ? Helpers.getPublicationUrl(publicationVersion.versionOf)
                        : `${Helpers.getPublicationUrl(publicationVersion.versionOf)}/versions/${
                              publicationVersion.versionNumber
                          }`,
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
                        nameType: publicationVersion.user.role === 'ORGANISATION' ? 'Organizational' : 'Personal',
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
            // Some types of publication only get a canonical DOI. In this case, skip this part.
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
            (previousPublicationVersion.versionNumber - 1).toString()
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

const isExemptFromReversioning = (publicationVersion: I.PublicationVersion) => {
    const isPeerReview = publicationVersion.publication.type === 'PEER_REVIEW';
    const isARI = publicationVersion.publication.externalSource === 'ARI';

    return isPeerReview || isARI;
};

// Create a separate DOI for a specific publication version.
// Returns the updated version with a DOI, or null if this publication doesn't use reversioning,
// and thus doesn't have versioned DOIs.
export const generateNewVersionDOI = async (
    publicationVersion: I.PublicationVersion,
    previousPublicationVersion?: I.PublicationVersion | null
) => {
    if (isExemptFromReversioning(publicationVersion)) {
        return null;
    } else {
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

    // Unless this is exempt from reversioning (so doesn't get versioned DOIs),
    // we need to have the DOI of the version so we can reference it in the canonical DOI's metadata.
    if (!latestPublicationVersion.doi && !isExemptFromReversioning(latestPublicationVersion)) {
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
export const postPublishHook = async (publicationVersion: I.PublicationVersion, skipPdfGeneration?: boolean) => {
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

        let previousVersion: I.PublicationVersion | null = null;

        if (publicationVersion.versionNumber > 1) {
            // Update previous version's "isLatestLiveVersion" flag.
            await client.prisma.publicationVersion.updateMany({
                where: {
                    versionOf: publicationVersion.versionOf,
                    versionNumber: publicationVersion.versionNumber - 1
                },
                data: {
                    isLatestLiveVersion: false
                }
            });

            // Get previous version to feed into DOI updates.
            previousVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: publicationVersion.versionOf,
                    versionNumber: publicationVersion.versionNumber - 1
                },
                include: defaultPublicationVersionInclude
            });
        }

        let versionWithDOI: I.PublicationVersion | null = null;

        if (!isExemptFromReversioning(publicationVersion)) {
            versionWithDOI = await generateNewVersionDOI(publicationVersion, previousVersion);
        }

        // Update the canonical DOI with the latest details from this version.
        // If we have a version with a DOI, pass that, but if not just pass one without.
        await updateCanonicalDOI(publicationVersion.publication.doi, versionWithDOI || publicationVersion);

        // (Re)index publication in opensearch.
        // TODO: remove this extra logging if we don't observe ARI imports stalling here for some time.
        console.log(`Indexing publication ${publicationVersion.versionOf} in opensearch.`);
        await publicationService.upsertOpenSearchRecord({
            id: publicationVersion.versionOf,
            type: publicationVersion.publication.type,
            title: publicationVersion.title,
            organisationalAuthor: publicationVersion.user.role === 'ORGANISATION',
            description: publicationVersion.description,
            keywords: publicationVersion.keywords,
            content: publicationVersion.content,
            publishedDate: publicationVersion.publishedDate,
            cleanContent: convert(publicationVersion.content)
        });
        console.log(`Indexing complete.`);

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

const notifyLinkedAriOwners = async (publicationVersion: I.PrivatePublicationVersion): Promise<void> => {
    // Gather up ARI publications that have been newly linked from this publicationVersion.
    const newlyLinkedARIs = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true,
            publication: {
                externalSource: 'ARI',
                linkedFrom: {
                    some: {
                        publicationFromId: publicationVersion.versionOf,
                        draft: true
                    }
                }
            }
        },
        select: {
            title: true,
            user: {
                select: {
                    email: true,
                    firstName: true
                }
            },

            versionOf: true
        }
    });

    const emailPromises: Promise<nodemailer.SentMessageInfo>[] = [];

    for (const ari of newlyLinkedARIs) {
        if (ari.user.email && publicationVersion.user.email) {
            emailPromises.push(
                email.newAriChildPublication({
                    ariPublication: {
                        author: {
                            email: ari.user.email,
                            name: ari.user.firstName
                        },
                        name: ari.title,
                        url: Helpers.getPublicationUrl(ari.versionOf)
                    },
                    childPublication: {
                        author: {
                            email: publicationVersion.user.email,
                            fullName: Helpers.getUserFullName(publicationVersion.user)
                        },
                        type: publicationVersion.publication.type,
                        url: Helpers.getPublicationUrl(publicationVersion.versionOf)
                    }
                })
            );
        }
    }

    await Promise.all(emailPromises);
};

export const updateStatus = async (id: string, status: I.PublicationStatusEnum, ariContactConsent?: boolean) => {
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
        // Important for this to come before postPublishHook because it needs to know which links are new
        // by looking at the draft field. The post publish hook will set "draft: false" on all new links.
        if (ariContactConsent) {
            // Author email is excluded from the return value of "update", and we need to include it in the email that is sent.
            const publicationWithEmail = await privateGet(updatedVersion.versionOf, 'latest');

            if (publicationWithEmail) {
                await notifyLinkedAriOwners(publicationWithEmail);
            }
        }

        await postPublishHook(updatedVersion);
    }

    return updatedVersion;
};
