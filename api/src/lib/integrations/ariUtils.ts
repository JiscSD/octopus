import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as topicMappingService from 'topicMapping/service';

export const mapAriQuestionToPublicationVersion = async (questionData: I.ARIQuestion): Promise<I.MappedARIQuestion> => {
    const {
        backgroundInformation,
        contactDetails,
        fieldsOfResearch,
        question,
        relatedUKRIProjects,
        tags,
        topics: ariTopics
    } = questionData;
    const title = question;
    // Compose content.
    const commonBoilerplateHTML =
        "<p>This problem is a UK government area of research interest (ARI) that was originally posted at <a href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</p>";
    const titleHTML = `<p>${question}</p>`;
    const backgroundInformationHTML = backgroundInformation
        ? `<p>${Helpers.replaceHTMLLineBreaks(backgroundInformation)}</p>`
        : '';
    const contactDetailsHTML = contactDetails
        ? `<p>Contact details: ${Helpers.replaceHTMLLineBreaks(contactDetails)}`
        : '';
    const relatedUKRIProjectsHTML = relatedUKRIProjects
        ? '<p>Related UKRI Projects:</p><ul>' +
          relatedUKRIProjects
              .map((relatedProject) => `<li><a href='${relatedProject.url}'>${relatedProject.title}</a></li>`)
              .join('') +
          '</ul>'
        : '';
    const content = [
        commonBoilerplateHTML,
        titleHTML,
        backgroundInformationHTML,
        contactDetailsHTML,
        relatedUKRIProjectsHTML
    ].join('');
    const keywords = fieldsOfResearch.concat(tags);
    // Map ARI topics to octopus topics.
    const topicMappings = await Promise.all(ariTopics.map((ariTopic) => topicMappingService.get(ariTopic, 'ARI')));
    // We intentionally don't map some ARI topics, so filter those out.
    const octopusTopics = topicMappings.flatMap((topicMapping) =>
        topicMapping && topicMapping.isMapped && topicMapping.topic ? [topicMapping.topic] : []
    );

    return {
        title,
        content,
        keywords,
        topics: octopusTopics
    };
};
