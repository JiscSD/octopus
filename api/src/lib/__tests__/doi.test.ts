import * as doi from 'lib/doi';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';
import * as testUtils from 'lib/testUtils';

describe('Create creator object', () => {
    const creator1 = {
        firstName: 'John',
        lastName: 'Doe',
        orcid: '0000-0000-0000-0000',
        affiliations: [
            {
                id: 1,
                affiliationType: 'education',
                organization: {
                    name: 'Test University',
                    address: {
                        city: 'Somewhere',
                        country: 'Someland'
                    },
                    'disambiguated-organization': {
                        'disambiguated-organization-identifier': 'test-uni',
                        'disambiguation-source': 'some-source'
                    }
                },
                createdAt: 123,
                updatedAt: 234,
                source: {
                    name: 'Test Source',
                    orcid: '0000-0000-0000-0001'
                }
            } as I.MappedOrcidAffiliation
        ],
        role: 'USER' as I.Role
    };

    test('Name is abbreviated user name', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.name).toEqual(Helpers.abbreviateUserName(creator1));
    });

    test('Given name is first name', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.givenName).toEqual(creator1.firstName);
    });

    test('Family name is last name', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.familyName).toEqual(creator1.lastName);
    });

    test('Name type is personal if role is not organisation', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.nameType).toEqual('Personal');
    });

    test('Name type is organizational if role is organisation', () => {
        const creator = doi.createCreatorObject({ ...creator1, role: 'ORGANISATION' });
        expect(creator.nameType).toEqual('Organizational');
    });

    test('Name identifier uses orcid', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.nameIdentifiers).toEqual([
            {
                nameIdentifier: creator1.orcid,
                nameIdentifierScheme: 'ORCID',
                schemeUri: 'https://orcid.org/'
            }
        ]);
    });

    test('Name identifier notes when no orcid is present', () => {
        const creator = doi.createCreatorObject({ ...creator1, orcid: null });
        expect(creator.nameIdentifiers[0].nameIdentifier).toEqual('ORCID ID not provided');
    });

    test('Affiliations are listed', () => {
        const creator = doi.createCreatorObject(creator1);
        expect(creator.affiliation).toEqual([
            {
                name: 'Test University',
                nameType: 'Organizational',
                affiliationIdentifier: 'test-uni',
                affiliationIdentifierScheme: 'some-source'
            }
        ]);
    });
});

describe('Create full DOI payload', () => {
    let version: I.PublicationVersion | null;

    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
        version = await publicationVersionService.get('publication-problem-live', 'latestLive');
    });

    // Static fields that are the same for every case.
    test('Universal fields check', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload).toMatchObject({
            data: {
                attributes: {
                    prefix: process.env.DOI_PREFIX,
                    event: 'publish',
                    publisher: 'Octopus'
                }
            }
        });
    });

    test('Canonical DOI URL points to the publication', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.url).toEqual(Helpers.getPublicationUrl(version.versionOf));
    });

    test('Version DOI URL points to the version', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'version',
            publicationVersion: version
        });

        expect(payload.data.attributes.url).toEqual(
            `${Helpers.getPublicationUrl(version.versionOf)}/versions/${version.versionNumber}`
        );
    });

    test('A creator exists for each coAuthor', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'version',
            publicationVersion: version
        });

        const creators = version.coAuthors.flatMap((coAuthor) =>
            coAuthor.user
                ? [
                      doi.createCreatorObject({
                          firstName: coAuthor.user.firstName,
                          lastName: coAuthor.user.lastName,
                          orcid: coAuthor.user.orcid,
                          affiliations: coAuthor.affiliations as unknown as I.MappedOrcidAffiliation[],
                          role: coAuthor.user.role
                      })
                  ]
                : []
        );

        expect(payload.data.attributes.creators).toEqual(creators);
    });

    test('Title is publication version title, with language', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.titles).toEqual([{ title: version.title, lang: version.language }]);
    });

    test('Publication year is year of published date', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.publicationYear).toEqual(version.publishedDate?.getFullYear());
    });

    test('Contributor exists for corresponding author', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.contributors).toEqual([
            {
                name: Helpers.abbreviateUserName(version.user),
                contributorType: 'ContactPerson',
                nameType: 'Personal',
                givenName: version.user.firstName,
                familyName: version.user.lastName,
                nameIdentifiers: [
                    {
                        nameIdentifier: version.user.orcid,
                        nameIdentifierScheme: 'ORCID',
                        schemeUri: 'https://orcid.org/'
                    }
                ]
            }
        ]);
    });

    test('Contributor nameType is Organizational if corresponding author has ORGANISATION role', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: {
                ...version,
                user: { ...version.user, role: 'ORGANISATION' }
            }
        });

        expect(payload.data.attributes.contributors).toMatchObject([
            {
                nameType: 'Organizational'
            }
        ]);
    });

    test('Language is publication language', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.language).toEqual(version.language);
    });

    test('Publications of type peer review reflect this in the types object', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: {
                ...version,
                publication: {
                    ...version.publication,
                    type: 'PEER_REVIEW'
                }
            }
        });

        expect(payload.data.attributes.types).toEqual({
            resourceTypeGeneral: 'PeerReview',
            resourceType: 'PEER_REVIEW'
        });
    });

    test('Non peer-review publications have resourceTypeGeneral set to Other', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.types).toEqual({
            resourceTypeGeneral: 'Other',
            resourceType: 'PROBLEM'
        });
    });

    test('A relatedItem exists for each reference that is not of type "DOI"', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        // References are retrieved from the DB by the function.
        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.relatedItems).toMatchObject([
            {
                titles: [{ title: 'text reference' }],
                relationType: 'References',
                relatedItemType: 'Other'
            },
            {
                titles: [{ title: 'URL reference' }],
                relationType: 'References',
                relatedItemType: 'Other',
                relatedItemIdentifier: {
                    relatedItemIdentifier: 'https://example.url',
                    relatedItemIdentifierType: 'URL'
                }
            }
        ]);
    });

    test('A relatedItem exists for each piece of additional information', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: {
                ...version,
                additionalInformation: [
                    {
                        id: 'test-1',
                        title: 'test additional info',
                        url: 'https://additional.info',
                        description: 'test description'
                    }
                ]
            }
        });

        // Expect this to be the third additional item after the 2 references.
        expect(payload.data.attributes.relatedItems).toHaveLength(3);
        const relatedItems = payload.data.attributes.relatedItems as Record<string, unknown>[];
        expect(relatedItems[2]).toMatchObject({
            titles: [{ title: 'test additional info' }],
            relationType: 'HasPart',
            relatedItemType: 'Other',
            relatedItemIdentifier: {
                relatedItemIdentifier: 'https://additional.info',
                relatedItemIdentifierType: 'URL'
            }
        });
    });

    test('A fundingReference exists for each funder', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: {
                ...version,
                funders: [
                    {
                        id: 'test-1',
                        name: 'Test Funder',
                        link: 'https://test.funder',
                        ror: 'test-ror',
                        city: 'Test City',
                        country: 'Test Country',
                        grantId: 'test-grant-id'
                    },
                    {
                        id: 'test-2',
                        name: 'Test Funder 2',
                        link: 'https://second-test.funder',
                        ror: '',
                        city: 'Test City 2',
                        country: 'Test Country 2',
                        grantId: 'test-grant-id-2'
                    }
                ]
            }
        });

        expect(payload.data.attributes.fundingReferences).toMatchObject([
            {
                funderName: 'Test Funder',
                funderIdentifier: 'test-ror', // ROR is preferred if available
                funderIdentifierType: 'ROR'
            },
            {
                funderName: 'Test Funder 2',
                funderIdentifier: 'https://second-test.funder', // Falls back to link
                funderIdentifierType: 'Other' // Fallback if not ROR
            }
        ]);
    });

    test('doi and identifiers are set if doi is provided in data parameter', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doi: '10.82259/ver2-2g03',
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.doi).toEqual('10.82259/ver2-2g03');
        expect(payload.data.attributes.identifiers).toEqual([
            {
                identifier: 'https://doi.org/10.82259/ver2-2g03',
                identifierType: 'DOI'
            }
        ]);
    });

    test('doi and identifiers are not set if doi is not provided in data parameter', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes).not.toHaveProperty('doi');
        expect(payload.data.attributes).not.toHaveProperty('identifiers');
    });
});
