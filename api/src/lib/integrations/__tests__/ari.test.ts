import * as ariUtils from 'lib/integrations/ariUtils';
import * as I from 'interface';
import * as testUtils from 'lib/testUtils';

const sampleARIQuestion: I.ARIQuestion = {
    questionId: 1,
    postDate: '2024-04-15 17:37:00',
    dateUpdated: '2024-04-17 17:52:09',
    url: '',
    question: 'Title',
    isArchived: false,
    department: '',
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
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappedARIQuestion).toHaveProperty('title', 'Title');
    });

    test('All expected ARI fields are in content in expected format', async () => {
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappedARIQuestion).toHaveProperty(
            'content',
            // Static placeholder text added to each mapped ARI's content
            "<p>This problem is a UK government area of research interest (ARI) that was originally posted at <a href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</p>" +
                // ARI Question title
                '<p>Title</p>' +
                // Background information
                '<p>Sample background information.</p>' +
                // Contact details
                '<p>Contact details: Sample contact details.' +
                // Related UKRI projects
                "<p>Related UKRI Projects:</p><ul><li><a href='https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1'>Urban Big Data Centre</a></li><li><a href='https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1'>Urban Big Data</a></li></ul>"
        );
    });

    test('Newlines are converted in backgroundInformation and contactDetails', async () => {
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            backgroundInformation:
                'Background information line 1.\nBackground information line 2.\n\nBackground information line 3.',
            contactDetails: 'Contact details line 1.\nContact details line 2.\n\nContact details line 3.'
        });
        expect(mappedARIQuestion).toHaveProperty(
            'content',
            "<p>This problem is a UK government area of research interest (ARI) that was originally posted at <a href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</p><p>Title</p>" +
                // Background information
                '<p>Background information line 1.<br>Background information line 2.<br><br>Background information line 3.</p>' +
                // Contact details
                '<p>Contact details: Contact details line 1.<br>Contact details line 2.<br><br>Contact details line 3.' +
                "<p>Related UKRI Projects:</p><ul><li><a href='https://gtr.ukri.org/projects?ref=ES%2FS007105%2F1'>Urban Big Data Centre</a></li><li><a href='https://gtr.ukri.org/projects?ref=ES%2FL011921%2F1'>Urban Big Data</a></li></ul>"
        );
    });

    test('Keywords are composed of fieldsOfResearch and tags', async () => {
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappedARIQuestion).toHaveProperty('keywords', [
            'field of research 1',
            'field of research 2',
            'tag 1',
            'tag 2'
        ]);
    });

    test('Mapped ARI topics are converted to octopus topics', async () => {
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion(sampleARIQuestion);
        expect(mappedARIQuestion).toHaveProperty('topics', [
            {
                id: 'test-topic-1',
                title: 'Test topic'
            }
        ]);
    });

    test('Recognised (but unmapped) ARI topics are ignored', async () => {
        const mappedARIQuestion = await ariUtils.mapAriQuestionToPublicationVersion({
            ...sampleARIQuestion,
            topics: ['ari test (unmapped)']
        });
        expect(mappedARIQuestion).toHaveProperty('topics', []);
    });
});
