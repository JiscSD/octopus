import axios, { AxiosResponse } from 'axios';

import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';

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

export const createDOIPayload = async (
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

export const createPublicationVersionDOI = async (
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

export const updateDOI = (doi: string, payload: Record<string, unknown>): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.put<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}/${doi}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

export const updateCanonicalDOI = async (
    doi: string,
    latestPublicationVersion: I.PublicationVersion
): Promise<I.DOIResponse> => {
    if (!latestPublicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    // Unless this is exempt from reversioning (so doesn't get versioned DOIs),
    // we need to have the DOI of the version so we can reference it in the canonical DOI's metadata.
    if (
        !latestPublicationVersion.doi &&
        !Helpers.isPublicationExemptFromReversioning(latestPublicationVersion.publication)
    ) {
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
