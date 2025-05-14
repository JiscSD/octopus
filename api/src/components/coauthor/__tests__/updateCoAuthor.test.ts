import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

const orcidTestAffiliations = [
    {
        id: 54320,
        affiliationType: 'membership',
        title: 'Membership type 1',
        departmentName: 'Department 1 TEEEEEEEST',
        startDate: {
            year: '2024',
            month: '',
            day: ''
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

describe('Update co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Co-author can approve a publication version', async () => {
        const setApproval = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                confirm: true
            });

        expect(setApproval.status).toEqual(200);

        const coAuthor = await client.prisma.coAuthors.findFirst({
            where: {
                publicationVersionId: 'publication-problem-locked-1-v1',
                linkedUser: 'test-user-6'
            }
        });
        expect(coAuthor?.confirmedCoAuthor).toEqual(true);
    });

    test('Co-author can reject a publication version', async () => {
        const setApproval = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                confirm: false
            });

        expect(setApproval.status).toEqual(200);

        const coAuthor = await client.prisma.coAuthors.findFirst({
            where: {
                publicationVersionId: 'publication-problem-locked-1-v1',
                linkedUser: 'test-user-6'
            }
        });
        expect(coAuthor?.confirmedCoAuthor).toEqual(false);
    });

    test('Cannot update co-author if you are not that co-author', async () => {
        const coAuthor = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '123456789' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(403);
        expect(coAuthor.body.message).toEqual("You cannot update another co-author's information.");
    });

    test('Cannot update a non-existent co-author', async () => {
        const coAuthor = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-1-problem-locked-1'
            )
            .query({ apiKey: '123456789' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(404);
        expect(coAuthor.body.message).toEqual('Co-author not found.');
    });

    test('Cannot update co-author on a non-existent publication version', async () => {
        const coAuthor = await testUtils.agent
            .patch(
                '/publication-versions/non-existent-publication-version-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(404);
        expect(coAuthor.body.message).toEqual('This publication version does not exist.');
    });

    test('Cannot update co-author on a live publication version', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .patch('/publication-versions/publication-problem-live-v1/coauthors/coauthor-test-user-1-problem-live')
            .query({ apiKey: '123456789' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(400);
        expect(updateAffiliationsResponse.body.message).toEqual(
            'Co-authors on a live publication version cannot be updated.'
        );
    });

    test('Corresponding author can be updated while the publication is DRAFT', async () => {
        const updateCorrespondingAffiliations = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateCorrespondingAffiliations.status).toEqual(200);
    });

    test('Affiliations are saved as expected', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(200);

        const coAuthor = await client.prisma.coAuthors.findFirst({
            where: {
                publicationVersionId: 'publication-problem-draft-v1',
                linkedUser: 'test-user-5'
            }
        });
        expect(coAuthor?.affiliations).toEqual(orcidTestAffiliations);
    });

    test('Non-corresponding author cannot be updated while the publication is DRAFT', async () => {
        const updateCoAuthorAffiliations = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-6-problem-draft')
            .query({ apiKey: '000000006' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: false
            });

        expect(updateCoAuthorAffiliations.status).toEqual(400);
        expect(updateCoAuthorAffiliations.body.message).toEqual(
            'This publication version is being edited, so you cannot update your information.'
        );
    });

    test('Co-author can choose whether their approval is retained', async () => {
        const confirmation = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                confirm: true,
                retainApproval: false
            });

        expect(confirmation.status).toEqual(200);
        const coAuthor = await client.prisma.coAuthors.findFirst({
            where: {
                publicationVersionId: 'publication-problem-locked-1-v1',
                linkedUser: 'test-user-6'
            }
        });
        expect(coAuthor?.retainApproval).toEqual(false);
    });

    test('Cannot be independent and have affiliations at the same time', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations,
                isIndependent: true
            });

        expect(updateAffiliationsResponse.status).toEqual(400);
        expect(updateAffiliationsResponse.body.message).toEqual(
            'You cannot be independent and also have affiliations.'
        );
    });

    test('Cannot unset affiliation status when publication is locked', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-5-problem-locked-1'
            )
            .query({ apiKey: '000000005' })
            .send({
                affiliations: [],
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(400);
        expect(updateAffiliationsResponse.body.message).toEqual(
            'Please either provide affiliations or declare your independence.'
        );
    });

    test('Cannot add duplicate affiliations', async () => {
        const updateAffiliationsResponse = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '000000005' })
            .send({
                affiliations: orcidTestAffiliations.concat(orcidTestAffiliations),
                isIndependent: false
            });

        expect(updateAffiliationsResponse.status).toEqual(400);
        expect(updateAffiliationsResponse.body.message).toEqual('Duplicate affiliations found.');
    });

    test('Non-corresponding author cannot change affiliation status after approving', async () => {
        const updateAffiliation = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                isIndependent: false,
                affiliations: orcidTestAffiliations
            });

        expect(updateAffiliation.status).toEqual(400);
        expect(updateAffiliation.body.message).toEqual(
            'You cannot change your affiliation information after approving the publication.'
        );
    });

    test('Co-author cannot invalidate their affiliation status while setting their approval', async () => {
        const updateCoAuthor = await testUtils.agent
            .patch(
                '/publication-versions/publication-problem-locked-1-v1/coauthors/coauthor-test-user-6-problem-locked-1'
            )
            .query({ apiKey: '000000006' })
            .send({
                confirm: true,
                isIndependent: false
            });

        expect(updateCoAuthor.status).toEqual(400);
        expect(updateCoAuthor.body.message).toEqual(
            'This change would unset your affiliation information, which is needed to set your approval.'
        );
    });
});
