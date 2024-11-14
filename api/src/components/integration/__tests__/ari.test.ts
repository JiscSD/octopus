import * as ariUtils from 'integration/ariUtils';
import * as I from 'interface';
import * as ingestLogService from 'ingestLog/service';
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
    questionGroup: 'Question group',
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
                    // Question group
                    '<p><strong>Question group</strong></p>' +
                    // Static placeholder text added to each mapped ARI's content
                    "<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>" +
                    // ARI Question title
                    '<p>ARI Publication 1</p>' +
                    // Background information
                    '<p><strong>Background</strong></p><p>Sample background information.</p>' +
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
                    "<p><strong>Question group</strong></p><p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p><p>ARI Publication 1</p>" +
                    // Background information
                    '<p><strong>Background</strong></p><p>Background information line 1.<br>Background information line 2.<br><br>Background information line 3.</p>' +
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

    test('Unrecognised topics are reported', async () => {
        const mappingAttempt = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            topics: ['unrecognised topic']
        });
        expect(mappingAttempt).toMatchObject({
            success: true,
            message: 'Found unrecognised topic(s).',
            unrecognisedTopics: ['unrecognised topic']
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
            message: 'User not found for department: unrecognised department.',
            unrecognisedDepartment: 'unrecognised department'
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

    test('Changed title updates publication without reversioning', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            question: 'ARI Publication 1 v2'
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                // Publication has not been reversioned.
                id: 'ari-publication-1-v1',
                versionNumber: 1,
                isLatestLiveVersion: true,
                // Title has changed.
                title: 'ARI Publication 1 v2'
            }
        });
        // Published date should have changed.
        const publishedDate = handleARI.publicationVersion?.publishedDate;

        if (publishedDate) {
            expect(new Date(publishedDate).toISOString()).not.toEqual('2024-07-16T14:06:00.000Z');
        }
    });

    test('Changed department updates user and coauthor', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            department: 'Test organisation 2'
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                createdBy: 'test-organisational-account-2',
                user: {
                    id: 'test-organisational-account-2'
                },
                coAuthors: [
                    {
                        linkedUser: 'test-organisational-account-2'
                    }
                ]
            }
        });
    });

    test('ARI with unrecognised department is skipped and dept name is reported in a field', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            department: 'Unrecognised Department name'
        });

        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: false,
            message:
                'Failed to map ARI data to octopus data. User not found for department: Unrecognised Department name.',
            unrecognisedDepartment: 'Unrecognised Department name'
        });
    });

    test('Content updates when mapped fields have changed', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            questionGroup: 'New question group',
            backgroundInformation: 'New background information.',
            contactDetails: 'New contact details.',
            relatedUKRIProjects: [
                {
                    projectId: '123',
                    title: 'Test',
                    url: 'https://jisc.ac.uk'
                }
            ]
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                content:
                    '<p><strong>New question group</strong></p>' +
                    "<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>" +
                    '<p>ARI Publication 1</p>' +
                    '<p><strong>Background</strong></p><p>New background information.</p>' +
                    '<p><strong>Contact details</strong></p><p>New contact details.</p>' +
                    '<p><strong>Related UKRI Projects</strong></p><ul><li><a href="https://jisc.ac.uk">Test</a></li></ul>'
            }
        });
    });

    test('Description updates when questionGroup is changed', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            questionGroup: 'New question group'
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                description: 'New question group'
            }
        });
    });

    test('Topics update when changed', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            topics: ['ari test (unmapped)']
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                // Falls back to default topic.
                topics: [
                    {
                        id: 'test-topic-1'
                    }
                ]
            }
        });
    });

    test('Unrecognised topics are reported', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            topics: [...sampleARIQuestion.topics, 'unrecognised topic']
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'none',
            success: true,
            publicationVersion: {
                topics: [
                    {
                        id: 'test-topic-1a'
                    }
                ]
            },
            unrecognisedTopics: ['unrecognised topic']
        });
    });

    test('Keywords update when fieldsOfResearch/tags change', async () => {
        const handleARI = await ariUtils.handleIncomingARI({
            ...sampleARIQuestion,
            fieldsOfResearch: ['foo', 'bar'],
            tags: ['baz']
        });
        expect(handleARI).toMatchObject({
            actionTaken: 'update',
            success: true,
            publicationVersion: {
                keywords: ['foo', 'bar', 'baz']
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
                    '<p><strong>Question group</strong></p>' +
                    "<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>" +
                    '<p>ARI Publication 1</p>' +
                    '<p><strong>Background</strong></p><p>Sample background information.</p>' +
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

describe('ARI import processes', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Incremental import endpoint requires API key', async () => {
        const triggerImport = await testUtils.agent.post('/integrations/ari/incremental');

        expect(triggerImport.status).toEqual(400);
        expect(triggerImport.body).toMatchObject({
            message: [
                {
                    keyword: 'required',
                    params: {
                        missingProperty: 'apiKey'
                    }
                }
            ]
        });
    });

    test('Incremental ingest cancels if already in progress', async () => {
        // Create an open ended log first.
        await ingestLogService.create('ARI');
        const triggerImport = await testUtils.agent
            .post('/integrations/ari/incremental')
            .query({ apiKey: process.env.TRIGGER_ARI_INGEST_API_KEY });

        expect(triggerImport.status).toEqual(202);
        expect(triggerImport.body).toMatchObject({
            message: 'Cancelling ingest. Either an import is already in progress or the last import failed.'
        });
    });
});
