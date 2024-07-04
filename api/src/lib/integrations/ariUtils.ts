import * as Helpers from 'lib/helpers';
import * as I from 'interface';

export const mapAriQuestionToPublicationVersion = (questionData: I.ARIQuestion): I.MappedARIQuestion => {
    const { backgroundInformation, contactDetails, fieldsOfResearch, question, relatedUKRIProjects, tags } =
        questionData;
    // TODO: map topics - waiting until that is in main and script has been run
    const title = question;
    // Compose content
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

    return {
        title,
        content,
        keywords
    };
};
