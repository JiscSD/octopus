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

describe('Get related identifiers', () => {
    let version: I.PublicationVersion | null;
    const testLinkedPublication: I.LinkedToPublication = {
        linkId: 'test',
        draft: true,
        childPublicationId: 'some-other-id',
        childPublicationType: 'PROBLEM',
        externalSource: null,
        id: 'test',
        type: 'PROBLEM',
        doi: 'test-doi',
        title: 'test',
        publishedDate: '2022-01-01T00:00:00.000Z',
        currentStatus: 'LIVE',
        createdBy: 'test-user',
        authorFirstName: 'test',
        authorLastName: 'user',
        authors: [],
        flagCount: 0,
        peerReviewCount: 0
    };
    const testLinkedToPublication: I.LinkedToPublication = {
        ...testLinkedPublication,
        linkId: 'link-to',
        draft: false,
        childPublicationId: 'publication-problem-live',
        childPublicationType: 'PROBLEM',
        externalSource: null
    };
    const testLinkedFromPublication: I.LinkedFromPublication = {
        ...testLinkedPublication,
        linkId: 'link-from',
        parentPublicationId: 'publication-problem-live',
        parentPublicationType: 'PROBLEM'
    };

    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
        version = await publicationVersionService.get('publication-problem-live', 'latestLive');
    });

    test('Non-peer review publications have a "Continues" relationship to other publications they have linked to', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers(
            'canonical',
            [],
            // One linked publication, a problem.
            [testLinkedToPublication],
            version,
            []
        );

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: 'test-doi',
                    relatedIdentifierType: 'DOI',
                    relationType: 'Continues'
                }
            ])
        );
    });

    test('Peer review publications have a "Reviews" relationship to other publications they have linked to', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers(
            'canonical',
            [],
            // One linked publication, a peer review.
            [{ ...testLinkedToPublication, childPublicationType: 'PEER_REVIEW' }],
            {
                ...version,
                publication: {
                    ...version.publication,
                    type: 'PEER_REVIEW'
                }
            },
            []
        );

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: 'test-doi',
                    relatedIdentifierType: 'DOI',
                    relationType: 'Reviews'
                }
            ])
        );
    });

    test('Publications with a peer review linked to them have a "IsReviewedBy" relationship to the peer review', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers(
            'canonical',
            // One publication has linked to this one: a peer review.
            [
                {
                    ...testLinkedFromPublication,
                    type: 'PEER_REVIEW'
                }
            ],
            [],
            version,
            []
        );

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: 'test-doi',
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsReviewedBy'
                }
            ])
        );
    });

    test('References are included when they have type "DOI", a location and a doi string in the location', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers(
            'canonical',
            [],
            [],
            version,
            // Sample reference
            [
                {
                    id: 'publication-problem-live-reference-1',
                    type: 'DOI',
                    text: 'doi reference',
                    location: '10.123/abcd-1234',
                    publicationVersionId: 'publication-problem-live-v2'
                }
            ]
        );

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: '10.123/abcd-1234',
                    relatedIdentifierType: 'DOI',
                    relationType: 'References'
                }
            ])
        );
    });

    test('References are not included when they do not have type "DOI" or a DOI string in the location field', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers(
            'canonical',
            [],
            [],
            version,
            // Sample references - only one should get a relatedIdentifier.
            [
                {
                    id: 'publication-problem-live-reference-1',
                    type: 'TEXT', // Wrong type.
                    text: 'text reference',
                    location: '10.123/abcd-1234', // Valid DOI string but should still be ignored.
                    publicationVersionId: 'publication-problem-live-v2'
                },
                {
                    id: 'publication-problem-live-reference-2',
                    type: 'DOI', // Right type.
                    text: 'text reference',
                    location: 'not a doi', // Does not contain a DOI.
                    publicationVersionId: 'publication-problem-live-v2'
                }
            ]
        );

        expect(
            relatedIdentifiers.filter((relatedIdentifier) => relatedIdentifier.relationType === 'References')
        ).toHaveLength(0);
    });

    test("Canonical non-peer review DOIs have a 'HasVersion' relationship to each live version's DOI", async () => {
        // This version has 1 live and 1 non-live version, so we expect one relatedIdentifier.
        const version = await publicationVersionService.get('publication-problem-live-2', 'latestLive');

        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers('canonical', [], [], version, []);

        expect(relatedIdentifiers).toEqual([
            {
                relatedIdentifier: '10.82259/ver1-2g04',
                relatedIdentifierType: 'DOI',
                relationType: 'HasVersion',
                resourceTypeGeneral: 'Other'
            }
        ]);
    });

    // Peer reviews are exempt from reversioning so they should have no version DOIs, nor relations indicating any.
    test('Canonical peer review DOIs have no "HasVersion" relatedIdentifiers', async () => {
        const version = await publicationVersionService.get('publication-peer-review-live', 'latestLive');

        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers('canonical', [], [], version, []);

        expect(
            relatedIdentifiers.filter((relatedIdentifier) => relatedIdentifier.relationType === 'HasVersion')
        ).toHaveLength(0);
    });

    test('Version DOIs have a "IsVersionOf" relationship to the canonical DOI', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers('version', [], [], version, []);

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: '10.82259/cty5-2g03',
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsVersionOf',
                    resourceTypeGeneral: 'Other'
                }
            ])
        );
    });

    test('Version DOIs at version 2 or above have a "IsNewVersionOf" relationship to the previous version DOI', async () => {
        // Version is the second of 2 live versions.
        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers('version', [], [], version, []);

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: '10.82259/ver1-2g03',
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsNewVersionOf',
                    resourceTypeGeneral: 'Other'
                }
            ])
        );
    });

    test('Version DOIs have a "IsPreviousVersionOf" relationship a subsequent live version DOI if it exists', async () => {
        // First version of 2
        const version = await publicationVersionService.get('publication-problem-live', '1');

        if (!version) {
            fail('Could not find publication version');
        }

        const relatedIdentifiers = await doi.getRelatedIdentifiers('version', [], [], version, []);

        expect(relatedIdentifiers).toEqual(
            expect.arrayContaining([
                {
                    relatedIdentifier: '10.82259/ver2-2g03',
                    relatedIdentifierType: 'DOI',
                    relationType: 'IsPreviousVersionOf',
                    resourceTypeGeneral: 'Other'
                }
            ])
        );
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

    // The permutations for the identifiers returned are covered in other tests.
    test('Related identifiers are set as expected', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'canonical',
            publicationVersion: version
        });

        expect(payload.data.attributes.relatedIdentifiers).toMatchObject([
            {
                relatedIdentifier: '10.82259/ver1-2g03',
                relatedIdentifierType: 'DOI',
                relationType: 'HasVersion',
                resourceTypeGeneral: 'Other'
            },
            {
                relatedIdentifier: '10.82259/ver2-2g03',
                relatedIdentifierType: 'DOI',
                relationType: 'HasVersion',
                resourceTypeGeneral: 'Other'
            }
        ]);
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
