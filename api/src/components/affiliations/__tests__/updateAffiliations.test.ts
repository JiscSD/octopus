import * as testUtils from 'lib/testUtils';

const orcidTestAffiliations = [
    {
        id: 54320,
        affiliationType: 'membership',
        title: 'Membership type 1',
        departmentName: 'Department 1 TEEEEEEEST',
        startDate: {
            year: '2024',
            month: null,
            day: null
        },
        endDate: null,
        organization: {
            name: 'Universidad Carlos III de Madrid',
            address: {
                city: 'Getafe',
                region: 'Madrid',
                country: 'ES'
            },
            'disambiguated-organization': {
                'disambiguated-organization-identifier': '16726',
                'disambiguation-source': 'RINGGOLD'
            }
        },
        createdAt: 1682427304185,
        updatedAt: 1683123177752,
        source: {
            name: 'Octopus User',
            orcid: '0000-0002-4204-5106'
        },
        url: null
    },
    {
        id: 54321,
        affiliationType: 'service',
        title: 'Role 1',
        departmentName: 'Department 1',
        startDate: null,
        endDate: null,
        organization: {
            name: 'W&W AFCO STEEL',
            address: {
                city: 'Oklahoma City',
                region: 'OK',
                country: 'US'
            },
            'disambiguated-organization': {
                'disambiguated-organization-identifier': '578155',
                'disambiguation-source': 'RINGGOLD'
            }
        },
        createdAt: 1682427331129,
        updatedAt: 1683031998943,
        source: {
            name: 'Octopus User',
            orcid: '0000-0002-4204-5106'
        },
        url: null
    }
];

describe('update coAuthor affiliations per publication', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Corresponding author can add an affiliation to their DRAFT publication', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: true
            });

        expect(updateAffiliationsResponse.status).toEqual(200);
        expect(updateAffiliationsResponse.body.message).toEqual('Successfully updated affiliations.');
    });

    test('Corresponding author needs to add affiliations if not independent before locking the publication', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: [],
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(200);

        const updateStatusResponse = await testUtils.agent
            .put('/publications/publication-problem-draft/status/LOCKED')
            .query({ apiKey: '000000005' })
            .send();

        expect(updateStatusResponse.status).toEqual(403);
        expect(updateStatusResponse.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
    });

    test('Author needs to fill out affiliations if the publication is LOCKED', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-locked-v1/my-affiliations')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: [],
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(403);
        expect(updateAffiliationsResponse.body.message).toEqual('Please fill out your affiliation information.');
    });

    test('User cannot add affiliations if they are not part of the publication', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '123456789' })
            .send({
                affiliations: [],
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(403);
        expect(updateAffiliationsResponse.body.message).toEqual(
            'You do not have permissions to add an affiliation to this publication.'
        );
    });

    test('User cannot add affiliations if the publication is LIVE', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-live-v1/my-affiliations')
            .query({ apiKey: '123456789' })
            .send({
                affiliations: [],
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(403);
        expect(updateAffiliationsResponse.body.message).toEqual('You cannot add affiliations to a LIVE publication.');
    });

    test('Only corresponding author can update his affiliations while the publication is DRAFT', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(200);
        expect(updateAffiliationsResponse.body.message).toEqual('Successfully updated affiliations.');

        const updateAffiliationsResponse2 = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '000000006' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateAffiliationsResponse2.status).toEqual(403);
        expect(updateAffiliationsResponse2.body.message).toEqual(
            'You cannot add affiliations while the publication is being edited.'
        );
    });

    test('Cannot add duplicate affiliations', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/my-affiliations')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations.concat(orcidTestAffiliations),
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(403);
        expect(updateAffiliationsResponse.body.message).toEqual('Duplicate affiliations found.');
    });
});
