import axios, { AxiosResponse } from 'axios';

import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';

// DOIs are created for an entire publication (canonical) or for a specific version of a publication.
type DOIPayload = {
    data: {
        type: 'dois';
        attributes: Record<string, unknown>;
    };
};
type DOIType = 'canonical' | 'version';
type ResourceTypeGeneral = 'PeerReview' | 'Other';
type RelatedIdentifier = {
    relatedIdentifier: string;
    relatedIdentifierType: string;
    relationType: string;
    resourceTypeGeneral?: ResourceTypeGeneral;
};

export const createCreatorObject = (user: I.DataCiteUser): I.DataCiteCreator => {
    return {
        name: Helpers.abbreviateUserName(user), // datacite expects full name in lastname, firstname order
        givenName: user?.firstName,
        familyName: user?.lastName,
        nameType: user.role === 'ORGANISATION' ? 'Organizational' : 'Personal',
        nameIdentifiers: [
            {
                nameIdentifier: user?.orcid ? user?.orcid : 'ORCID ID not provided',
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

const getDOIFromString = (text: string): string | undefined => {
    const matches = text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi //eslint-disable-line
    );

    return matches ? matches[0] : undefined;
};

const getResourceTypeGeneral = (publicationType: I.PublicationType): ResourceTypeGeneral => {
    return publicationType === 'PEER_REVIEW' ? 'PeerReview' : 'Other';
};

const getDOIPayload = (attributes: Record<string, unknown>): DOIPayload => ({
    data: {
        type: 'dois',
        attributes
    }
});

export const getRelatedIdentifiers = async (
    doiType: DOIType,
    linkedFrom: I.LinkedFromPublication[],
    linkedTo: I.LinkedToPublication[],
    publicationVersion: I.PublicationVersion,
    references: I.Reference[]
): Promise<RelatedIdentifier[]> => {
    const publication = await publicationService.get(publicationVersion.versionOf);

    if (!publication) {
        throw Error('Publication not found with id ' + publicationVersion.versionOf);
    }

    // Related identifiers for all DOIs.

    // A publication "Continues" what it is linked to, unless it's a peer review. Then it "Reviews" it.
    const linkedPublicationEntries = linkedTo.map((link) => ({
        relatedIdentifier: link.doi,
        relatedIdentifierType: 'DOI',
        relationType: publicationVersion.publication.type === 'PEER_REVIEW' ? 'Reviews' : 'Continues'
    }));

    // If peer reviews have been linked to this publication, add them with relationType "ReviewedBy".
    const peerReviewEntries = linkedFrom.flatMap((link) =>
        link.type === 'PEER_REVIEW'
            ? [
                  {
                      relatedIdentifier: link.doi,
                      relatedIdentifierType: 'DOI',
                      relationType: 'IsReviewedBy'
                  }
              ]
            : []
    );

    // For each reference that is a DOI type, add it with relationType "References".
    const referenceEntries = references
        .filter((reference) => reference.type === 'DOI' && reference.location)
        .flatMap((reference) => {
            const doi = getDOIFromString(reference.location ?? '');

            return doi
                ? [
                      {
                          relatedIdentifier: doi,
                          relatedIdentifierType: 'DOI',
                          relationType: 'References'
                      }
                  ]
                : [];
        });

    const relatedIdentifiers: RelatedIdentifier[] = [
        ...linkedPublicationEntries,
        ...peerReviewEntries,
        ...referenceEntries
    ];

    const resourceTypeGeneral = getResourceTypeGeneral(publicationVersion.publication.type);

    // Related identifiers specific to versioned DOIs.

    if (doiType === 'version') {
        // All version DOIs have a "IsVersionOf" relationship to the canonical DOI.
        relatedIdentifiers.push({
            relatedIdentifier: publicationVersion.publication.doi,
            relatedIdentifierType: 'DOI',
            relationType: 'IsVersionOf',
            resourceTypeGeneral
        });

        // If this is not the first version, it has an "IsNewVersionOf" relationship to the previous version.
        if (publicationVersion.versionNumber > 1) {
            const previousVersionDOI = publication.versions.find(
                (version) => version.versionNumber === publicationVersion.versionNumber - 1
            )?.doi;

            if (!previousVersionDOI) {
                throw Error('Previous version DOI not found for version ' + publicationVersion.id);
            }

            relatedIdentifiers.push({
                relatedIdentifier: previousVersionDOI,
                relatedIdentifierType: 'DOI',
                relationType: 'IsNewVersionOf',
                resourceTypeGeneral
            });
        }

        // If there is a newer live version, this has a "IsPreviousVersionOf" relationship to it.
        if (!publicationVersion.isLatestLiveVersion) {
            const nextVersionDOI = publication.versions.find(
                (version) => version.versionNumber === publicationVersion.versionNumber + 1
            )?.doi;

            if (!nextVersionDOI) {
                throw Error('Next version DOI not found for version ' + publicationVersion.id);
            }

            relatedIdentifiers.push({
                relatedIdentifier: nextVersionDOI,
                relatedIdentifierType: 'DOI',
                relationType: 'IsPreviousVersionOf',
                resourceTypeGeneral
            });
        }
    } else {
        // Related identifiers specific to canonical DOIs.

        if (!Helpers.isPublicationExemptFromReversioning(publication)) {
            // Add "HasVersion" relationship to all version DOIs.
            for (const version of publication.versions) {
                if (version.currentStatus === 'LIVE' && version.doi) {
                    relatedIdentifiers.push({
                        relatedIdentifier: version.doi,
                        relatedIdentifierType: 'DOI',
                        relationType: 'HasVersion',
                        resourceTypeGeneral
                    });
                }
            }
        }
    }

    return relatedIdentifiers;
};

/*
 * Create a full DOI payload for a publication or publication version.
 * - doi: Optional. If undefined, a new DOI will be generated.
 * - doiType: 'canonical' (for a publication as a whole) or 'version' (for a specific version).
 * - publicationVersion: the version (latest live version if updating a canonical DOI), to populate the metadata with.
 */
export const createFullDOIPayload = async (data: {
    doi?: string;
    doiType: DOIType;
    publicationVersion: I.PublicationVersion;
}): Promise<DOIPayload> => {
    const { doi, doiType, publicationVersion } = data;
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedFrom, linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );

    // Create a creator object for each CoAuthor.
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

    const relatedIdentifiers = await getRelatedIdentifiers(
        doiType,
        linkedFrom,
        linkedTo,
        publicationVersion,
        references
    );

    // Create a relatedItem for each reference that isn't a DOI (those go to relatedIdentifiers).
    const referenceRelatedItems = references
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

    // Create a relatedItem for each additional information entry.
    const additionalInformationRelatedItems = publicationVersion.additionalInformation.map((additionalInfoEntry) => ({
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

    const relatedItems = [...referenceRelatedItems, ...additionalInformationRelatedItems];

    const attributes = {
        prefix: process.env.DOI_PREFIX,
        event: 'publish',
        url:
            doiType === 'canonical'
                ? Helpers.getPublicationUrl(publicationVersion.versionOf)
                : `${Helpers.getPublicationUrl(publicationVersion.versionOf)}/versions/${
                      publicationVersion.versionNumber
                  }`,
        creators,
        titles: [
            {
                title: publicationVersion.title,
                lang: publicationVersion.language
            }
        ],
        publisher: 'Octopus',
        publicationYear: publicationVersion.publishedDate?.getFullYear(),
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
        language: publicationVersion.language,
        types: {
            resourceTypeGeneral: publicationVersion.publication.type === 'PEER_REVIEW' ? 'PeerReview' : 'Other',
            resourceType: publicationVersion.publication.type
        },
        relatedIdentifiers,
        relatedItems,
        fundingReferences: publicationVersion.funders.map((funder) => ({
            funderName: funder.name,
            funderIdentifier: funder.ror || funder.link,
            funderIdentifierType: funder.ror ? 'ROR' : 'Other'
        }))
    };

    if (doiType === 'version') {
        Object.assign(attributes, {
            version: publicationVersion.versionNumber
        });
    }

    // If DOI is supplied, add it to the payload.
    // It can be omitted, in which case an automatically generated one will be returned in the response.
    if (doi) {
        Object.assign(attributes, {
            doi: publicationVersion.doi,
            identifiers: [
                {
                    identifier: `https://doi.org/${publicationVersion.doi}`,
                    identifierType: 'DOI'
                }
            ]
        });
    }

    return getDOIPayload(attributes);
};

const createDOI = (payload: DOIPayload): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.post<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

export const createEmptyDOI = (): Promise<AxiosResponse<I.DOIResponse>> =>
    createDOI(getDOIPayload({ prefix: process.env.DOI_PREFIX }));

export const createPublicationVersionDOI = async (
    publicationVersion: I.PublicationVersion
): Promise<I.DOIResponse | undefined> => {
    if (!publicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    const payload = await createFullDOIPayload({
        doiType: 'version',
        publicationVersion
    });

    const response = await createDOI(payload);

    return response.data;
};

const updateDOI = (doi: string, payload: DOIPayload): Promise<AxiosResponse<I.DOIResponse>> =>
    axios.put<I.DOIResponse>(`${process.env.DATACITE_ENDPOINT}/${doi}`, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });

export const updatePublicationVersionDOI = async (publicationVersion: I.PublicationVersion): Promise<I.DOIResponse> => {
    if (!publicationVersion.doi) {
        throw Error("Supplied version doesn't have a valid DOI");
    }

    const payload = await createFullDOIPayload({
        doi: publicationVersion.doi,
        doiType: 'version',
        publicationVersion: publicationVersion
    });

    const response = await updateDOI(publicationVersion.doi, payload);

    return response.data;
};

export const updateCanonicalDOI = async (
    doi: string,
    latestPublicationVersion: I.PublicationVersion
): Promise<I.DOIResponse> => {
    if (!latestPublicationVersion.isLatestVersion) {
        throw Error('Supplied version is not current');
    }

    const payload = await createFullDOIPayload({
        doi,
        doiType: 'canonical',
        publicationVersion: latestPublicationVersion
    });

    const response = await updateDOI(doi, payload);

    return response.data;
};

// Even if we only want to update one related identifier, we have to supply the whole list, which involves getting
// linked publications and references.
export const updateRelatedIdentifiers = async (
    doiType: DOIType,
    doi: string,
    publicationVersion: I.PublicationVersion
): Promise<AxiosResponse<I.DOIResponse>> => {
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedFrom, linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );
    const relatedIdentifiers = await getRelatedIdentifiers(
        doiType,
        linkedFrom,
        linkedTo,
        publicationVersion,
        references
    );

    return updateDOI(doi, getDOIPayload({ relatedIdentifiers }));
};
