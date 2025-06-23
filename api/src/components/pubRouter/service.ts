import * as email from 'lib/email';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as s3 from 'lib/s3';

const pubRouterPublicationTypePrefix = 'Octopus article; ';

const getPubRouterMetadata = (publicationVersion: I.PublicationVersion) => {
    const formatCoAuthor = (coAuthor: I.PublicationVersion['coAuthors'][0]) => {
        if (!coAuthor.user) return null;

        return {
            type: coAuthor.linkedUser === publicationVersion.user.id ? 'corresp' : 'author',
            name: {
                firstname: coAuthor.user.firstName,
                surname: coAuthor.user.lastName || '',
                fullname: `${coAuthor.user.lastName && coAuthor.user.lastName + ', '}${coAuthor.user.firstName}`
            },
            identifier: [
                {
                    type: 'orcid',
                    id: coAuthor.user.orcid
                }
            ],
            affiliations: coAuthor.affiliations?.map((untypedAffiliation) => {
                const affiliation = untypedAffiliation as unknown as I.MappedOrcidAffiliation;

                return {
                    identifier: [
                        ...(affiliation.organization['disambiguated-organization'] &&
                        affiliation.organization['disambiguated-organization']['disambiguation-source'] === 'ROR'
                            ? [
                                  {
                                      type: 'ROR',
                                      id: affiliation.organization['disambiguated-organization'][
                                          'disambiguated-organization-identifier'
                                      ]
                                  }
                              ]
                            : []),
                        ...(affiliation.url
                            ? [
                                  {
                                      type: 'Link',
                                      id: affiliation.url
                                  }
                              ]
                            : [])
                    ],
                    org: affiliation.organization.name,
                    city: affiliation.organization.address.city,
                    country: affiliation.organization.address.country
                };
            })
        };
    };

    const formattedPublicationDate = publicationVersion.createdAt.toISOString().split('T')[0];
    const publication = publicationVersion.publication;
    const formattedCoAuthors = publicationVersion.coAuthors?.map((coAuthor) => formatCoAuthor(coAuthor));
    const pdfUrl = s3.getPDFURL(publication.id);

    return {
        provider: {
            agent: 'Octopus'
        },
        links: [
            {
                format: 'application/pdf',
                url: pdfUrl
            }
        ],
        metadata: {
            journal: {
                title: 'Octopus',
                publisher: ['Octopus'],
                identifier: [
                    {
                        type: 'doi',
                        id: 'https://doi.org/10.57874/OCTOPUS'
                    }
                ]
            },
            article: {
                title: publicationVersion.title,
                abstract: publicationVersion.description,
                type: `${pubRouterPublicationTypePrefix}${publicationVersion.publication.type}`,
                version: 'SMUR',
                language: [publicationVersion.language],
                identifier: [
                    {
                        type: 'doi',
                        id: publication.doi
                    }
                ],
                e_num: publication.id // DOI suffix e.g. "abcd-efgh"
            },
            author: formattedCoAuthors,
            publication_date: {
                date: formattedPublicationDate,
                year: formattedPublicationDate.slice(0, 4),
                month: formattedPublicationDate.slice(5, 7),
                day: formattedPublicationDate.slice(8, 10)
            },
            accepted_date: formattedPublicationDate,
            publication_status: 'Published',
            funding: publicationVersion.funders?.map((funder) => ({
                name: funder.name,
                ...(funder.ror && {
                    identifier: [
                        {
                            type: 'ror',
                            id: funder.ror
                        }
                    ]
                }),
                ...(funder.grantId && { grant_numbers: [funder.grantId] })
            })),
            license_ref: [
                {
                    title: 'CC-BY 4.0',
                    type: 'CC-BY 4.0',
                    url: 'https://creativecommons.org/licenses/by/4.0/'
                }
            ],
            peer_reviewed: false
        }
    };
};

const postToPubRouter = (pdfMetadata: ReturnType<typeof getPubRouterMetadata>, endpoint: string) =>
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pdfMetadata)
    });

export const notifyPubRouter = async (
    publicationVersion: I.PublicationVersion
): Promise<{ code: number; message: string }> => {
    const pdfMetadata = getPubRouterMetadata(publicationVersion);
    console.log('PDF metadata: ', JSON.stringify(pdfMetadata));

    // Send to PubRouter.
    const publicationType = pdfMetadata.metadata.article.type.replace(pubRouterPublicationTypePrefix, '');
    // We use a different API key per publication type.
    const apiKeys = JSON.parse(Helpers.checkEnvVariable('PUBROUTER_API_KEYS'));

    if (!Object.keys(apiKeys).includes(publicationType)) {
        throw new Error(`Publication type "${publicationType}" not found in API keys object`);
    } else {
        const apiKey = apiKeys[publicationType];
        // Hit UAT endpoint if not running on prod.
        const apiEndpoint = `https://${
            process.env.STAGE !== 'prod' ? 'uat.' : ''
        }pubrouter.jisc.ac.uk/api/v4/notification?api_key=${apiKey}`;

        try {
            const response = await postToPubRouter(pdfMetadata, apiEndpoint);
            // Check the API response and handle failures
            const successResponse = { code: 200, message: 'Successfully submitted to publications router' };

            if (response.ok) {
                return successResponse;
            } else {
                // Retry once
                // Wait 2 seconds
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log('First attempt failed; retrying');
                const retry = await postToPubRouter(pdfMetadata, apiEndpoint);

                if (retry.ok) {
                    return successResponse;
                } else {
                    const retryJSON = await retry.json();
                    await email.pubRouterFailure(publicationVersion.versionOf, JSON.stringify(retryJSON));

                    return { code: 500, message: 'Failed to submit to publications router' };
                }
            }
        } catch (error) {
            const errorString = error.toString();
            await email.pubRouterFailure(publicationVersion.versionOf, errorString);

            return { code: 500, message: errorString };
        }
    }
};
