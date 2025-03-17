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

        expect(payload).toMatchObject({
            data: {
                attributes: {
                    url: Helpers.getPublicationUrl(version.versionOf)
                }
            }
        });
    });

    test('Version DOI URL points to the version', async () => {
        if (!version) {
            fail('Could not find publication version');
        }

        const payload = await doi.createFullDOIPayload({
            doiType: 'version',
            publicationVersion: version
        });

        expect(payload).toMatchObject({
            data: {
                attributes: {
                    url: `${Helpers.getPublicationUrl(version.versionOf)}/versions/${version.versionNumber}`
                }
            }
        });
    });
});
