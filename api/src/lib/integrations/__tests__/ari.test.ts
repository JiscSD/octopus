import * as ariUtils from 'lib/integrations/ariUtils';
import * as I from 'interface';
import * as testUtils from 'lib/testUtils';

// This ARI will match a publication in the seed data via the questionId.
const sampleARIQuestion: I.ARIQuestion = {
    questionId: 123456,
    postDate: '2024-04-15 17:37:00',
    dateUpdated: '2024-04-17 17:52:09',
    url: '',
    question: 'ARI Publication 1',
    isArchived: false,
    department: 'Test ARI Department',
    questionGroup: '',
    backgroundInformation: 'Sample background information.',
    publicationDate: '2024-02-26 00:00:00',
    expiryDate: null,
    contactDetails: 'Sample contact details.',
    topics: ['ari test'],
    fieldsOfResearch: ['field of research 1', 'field of research 2'],
    tags: ['tag 1', 'tag 2'],
    relatedQuestions: [],
    relatedUKRIProjects: [
        {
            projectId: 'B8573536-7F38-4823-AA9D-F7C729F18BF4',
            title: 'Urban Big Data Centre',
            url: 'https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1'
        },
        {
            projectId: '9FFFDEFF-7669-4424-B122-44F46CBED0C3',
            title: 'Urban Big Data',
            url: 'https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1'
        }
    ]
};

describe('ARI Mapping', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Title comes from ARI question field', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: { title: 'ARI Publication 1' }
        });
    });

    test('All expected ARI fields are in content in expected format', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: {
                content:
                    // Static placeholder text added to each mapped ARI's content
                    '<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a href="https://ari.org.uk/">https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>' +
                    // ARI Question title
                    '<p>ARI Publication 1</p>' +
                    // Background information
                    '<p>Sample background information.</p>' +
                    // Contact details
                    '<p><strong>Contact details</strong></p><p>Sample contact details.</p>' +
                    // Related UKRI projects
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1">Urban Big Data Centre</a></li><li><a href="https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1">Urban Big Data</a></li></ul>'
            }
        });
    });

    test('Newlines are converted in backgroundInformation and contactDetails', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            backgroundInformation:
                'Background information line 1.\nBackground information line 2.\n\nBackground information line 3.',
            contactDetails: 'Contact details line 1.\nContact details line 2.\n\nContact details line 3.'
        });
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: {
                content:
                    '<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a href="https://ari.org.uk/">https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p><p>ARI Publication 1</p>' +
                    // Background information
                    '<p>Background information line 1.<br>Background information line 2.<br><br>Background information line 3.</p>' +
                    // Contact details
                    '<p><strong>Contact details</strong></p><p>Contact details line 1.<br>Contact details line 2.<br><br>Contact details line 3.</p>' +
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1">Urban Big Data Centre</a></li><li><a href="https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1">Urban Big Data</a></li></ul>'
            }
        });
    });

    test('Keywords are composed of fieldsOfResearch and tags', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: { keywords: ['field of research 1', 'field of research 2', 'tag 1', 'tag 2'] }
        });
    });

    test('Mapped ARI topics are converted to octopus topics', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: {
                topicIds: ['test-topic-1a']
            }
        });
    });

    test('Recognised (but unmapped) ARI topics are ignored', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            topics: ['ari test (unmapped)']
        });
        expect(mappingAttempt).toMatchObject({
            success: true,
            mappedData: {
                topicIds: ['test-topic-1']
            }
        });
    });

    test('Department is matched to existing user', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappingAttempt).toMatchObject({
            mappedData: { userId: 'test-organisational-account-1' }
        });
    });

    test('Publication is not mapped if department user is not found', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            department: 'unrecognised department'
        });
        expect(mappingAttempt).toMatchObject({
            success: false,
            mappedData: null,
            message: 'User not found for department: unrecognised department.'
        });
    });

    test('ARI is not mapped if it is archived', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            isArchived: true
        });
        expect(mappingAttempt).toMatchObject({
            success: false,
            mappedData: null,
            message: 'This ARI is archived so has not been mapped.'
        });
    });
});

describe('ARI handling', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Existing ARI publication with no changes is skipped', async () => {
        const handleARI = await ariUtils.handleIncomingARI(sampleARIQuestion);

        // This test expects a seeded publication to exist in the unitTesting seed data matching sampleARIQuestion
        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: true,
            publicationVersion: {
                id: 'ari-publication-1-v1',
                versionNumber: 1,
                isLatestLiveVersion: true,
                title: 'ARI Publication 1'
            }
        });
    });

    test('ARI with unrecognised department is skipped', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            department: 'Unrecognised Department name'
        });

        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: false,
            message:
                'Failed to map ARI data to octopus data. User not found for department: Unrecognised Department name.'
        });
    });

    test('Existing ARI publication with changes is re-versioned', async () => {
        await testUtils.openSearchSeed();
        const handleARI = await ariUtils.handleIncomingARI({ ...sampleARIQuestion, question: 'ARI Publication 1 v2' });

        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                // These fields should be different to v1.
                id: 'ari-publication-1-v2',
                versionNumber: 2,
                isLatestLiveVersion: true,
                title: 'ARI Publication 1 v2',
                // Content has changed because it includes the title on line 2.
                content:
                    '<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a href="https://ari.org.uk/">https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>' +
                    '<p>ARI Publication 1 v2</p>' +
                    '<p>Sample background information.</p>' +
                    '<p><strong>Contact details</strong></p><p>Sample contact details.</p>' +
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1">Urban Big Data Centre</a></li><li><a href="https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1">Urban Big Data</a></li></ul>',
                // These fields should not have changed from v1.
                keywords: ['field of research 1', 'field of research 2', 'tag 1', 'tag 2'],
                topics: [
                    {
                        id: 'test-topic-1a'
                    }
                ],
                user: {
                    id: 'test-organisational-account-1'
                }
            }
        });
    });

    test('ARI with no existing publication has a publication created', async () => {
        const handleARI = await ariUtils.handleIncomingARI({ ...sampleARIQuestion, questionId: 123457 });

        // Ensure all the fields that are mapped have been set.
        expect(handleARI).toMatchObject({
            actionTaken: 'create',
            success: true,
            publicationVersion: {
                versionNumber: 1,
                isLatestLiveVersion: true,
                title: 'ARI Publication 1',
                content:
                    // Mapped content - see ARI mapping tests for explanation.
                    '<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a href="https://ari.org.uk/">https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>' +
                    '<p>ARI Publication 1</p>' +
                    '<p>Sample background information.</p>' +
                    '<p><strong>Contact details</strong></p><p>Sample contact details.</p>' +
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1">Urban Big Data Centre</a></li><li><a href="https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1">Urban Big Data</a></li></ul>',
                keywords: ['field of research 1', 'field of research 2', 'tag 1', 'tag 2'],
                publication: {
                    externalId: '123457',
                    externalSource: 'ARI',
                    type: 'PROBLEM'
                },
                topics: [
                    {
                        id: 'test-topic-1a'
                    }
                ],
                user: {
                    id: 'test-organisational-account-1'
                }
            }
        });
    });

    test('Invalid questionID is rejected', async () => {
        const handleARI = await ariUtils.handleIncomingARI({ ...sampleARIQuestion, questionId: 1000000000 });

        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: false,
            message: 'Invalid question ID format.'
        });
    });

    test('Archived questions are rejected', async () => {
        const handleARI = await ariUtils.handleIncomingARI({ ...sampleARIQuestion, isArchived: true });

        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: true,
            message: 'Skipped because question is archived.'
        });
    });
});
