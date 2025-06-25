import * as client from 'lib/client';
import * as coAuthorService from 'coAuthor/service';
import * as config from 'config';
import * as email from 'email';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as topicMappingService from 'topicMapping/service';
import * as userMappingService from 'userMapping/service';
import * as userService from 'user/service';

import axios from 'axios';
import * as fs from 'fs/promises';
import { Prisma } from '@prisma/client';

const parseAriTextField = (value: string): string => {
    // Sometimes ARI text fields are enclosed in quotes and we don't want to show those in a publication body.
    const noQuotes = Helpers.stripEnclosingQuotes(value);

    // Convert \n line breaks to <br>s for displaying in HTML.
    return Helpers.replaceHTMLLineBreaks(noQuotes);
};

export const mapAriQuestionToPublicationVersion = async (
    questionData: I.ARIQuestion
): Promise<
    | {
          success: true;
          mappedData: I.MappedARIQuestion;
          message: string | null;
          unrecognisedTopics?: string[];
      }
    | {
          success: false;
          mappedData: null;
          message: string;
          unrecognisedDepartment?: string;
          unrecognisedTopics?: string[];
      }
> => {
    if (questionData.isArchived) {
        return {
            success: false,
            mappedData: null,
            message: 'This ARI is archived so has not been mapped.'
        };
    }

    const {
        backgroundInformation,
        contactDetails,
        department,
        fieldsOfResearch,
        question,
        questionGroup,
        questionId,
        relatedUKRIProjects,
        tags,
        topics: ariTopics
    } = questionData;
    const title = question;
    // Compose content.
    const questionGroupHTML = questionGroup ? `<p><strong>${questionGroup}</strong></p>` : '';
    const commonBoilerplateHTML =
        "<p><em>This problem is a UK government area of research interest (ARI) that was originally posted at <a target='_blank' href='https://ari.org.uk/'>https://ari.org.uk/</a> by a UK government organisation to indicate that they are keen to see research related to this area.</em></p>";
    const titleHTML = `<p>${question}</p>`;
    const backgroundInformationHTML = backgroundInformation
        ? `<p><strong>Background</strong></p><p>${parseAriTextField(backgroundInformation)}</p>`
        : '';
    const contactDetailsHTML = contactDetails
        ? `<p><strong>Contact details</strong></p><p>${parseAriTextField(contactDetails)}</p>`
        : '';
    const relatedUKRIProjectsHTML = relatedUKRIProjects.length
        ? '<p><strong>Related UKRI Projects</strong></p><ul>' +
          relatedUKRIProjects
              .map((relatedProject) => `<li><a href='${relatedProject.url}'>${relatedProject.title}</a></li>`)
              .join('') +
          '</ul>'
        : '';
    const content =
        Helpers.getSafeHTML(questionGroupHTML) +
        // Don't run getSafeHTML on this because sanitize() removes the target attribute from the link.
        commonBoilerplateHTML +
        Helpers.getSafeHTML(
            [titleHTML, backgroundInformationHTML, contactDetailsHTML, relatedUKRIProjectsHTML].join('')
        );
    // Ensure uniqueness.
    const keywords = [...new Set(fieldsOfResearch.concat(tags))];

    // Map ARI topics to octopus topics.
    const unrecognisedTopics: string[] = [];
    type TopicMappingResult = Prisma.PromiseReturnType<typeof topicMappingService.get>;
    const topicMappings: TopicMappingResult[] = [];

    for await (const ariTopic of ariTopics) {
        const mapping = await topicMappingService.get(ariTopic, 'ARI');

        if (mapping) {
            topicMappings.push(mapping);
        } else {
            unrecognisedTopics.push(ariTopic);
        }
    }

    // We intentionally don't map some ARI topics, so filter those out.
    const octopusTopicIds = topicMappings.flatMap((topicMapping) =>
        topicMapping && topicMapping.isMapped && topicMapping.topic ? [topicMapping.topic.id] : []
    );

    // Find user by department title.
    const userMapping = await userMappingService.get(department, 'ARI');

    if (!userMapping) {
        return {
            success: false,
            mappedData: null,
            message: 'User not found for department: ' + department + '.',
            unrecognisedDepartment: department
        };
    }

    const user = userMapping.user;

    // If no topics listed in ARI, fall back to default topic for the department (user).
    // Otherwise use the mapped topics, in a Set to ensure uniqueness.
    const finalTopicIds = octopusTopicIds.length
        ? [...new Set(octopusTopicIds)]
        : user.defaultTopicId
        ? [user.defaultTopicId]
        : [];

    const unrecognisedTopicsFound = unrecognisedTopics.length;

    return {
        success: true,
        mappedData: {
            title,
            content,
            description:
                questionGroup && questionGroup.length <= config.constants.publication.description.maxLength
                    ? questionGroup
                    : '',
            keywords,
            topicIds: finalTopicIds,
            externalSource: 'ARI',
            externalId: questionId.toString(),
            userId: user.id
        },
        message: unrecognisedTopicsFound ? 'Found unrecognised topic(s).' : null,
        ...(unrecognisedTopicsFound ? { unrecognisedTopics } : {})
    };
};

type FieldDiff<T> = { old: T | null; new: T | null };

export const detectChangesToARIPublication = (
    ari: I.MappedARIQuestion,
    publicationVersion: I.PublicationVersion
):
    | false
    | {
          title?: FieldDiff<string>;
          content?: FieldDiff<string>;
          description?: FieldDiff<string>;
          keywords?: FieldDiff<string[]>;
          topics?: FieldDiff<string[]>;
          userId?: FieldDiff<string>;
      } => {
    const titleMatch = ari.title === publicationVersion.title;
    const contentMatch = ari.content === publicationVersion.content;
    const descriptionMatch = ari.description === publicationVersion.description;
    const keywordsMatch = Helpers.compareArrays(ari.keywords, publicationVersion.keywords);
    const publicationVersionTopicIds = publicationVersion.topics.map((topic) => topic.id);
    const topicsMatch = Helpers.compareArrays(ari.topicIds, publicationVersionTopicIds);
    const userMatch = ari.userId === publicationVersion.user.id;

    const changes = {
        ...(!titleMatch ? { title: { new: ari.title, old: publicationVersion.title } } : {}),
        ...(!contentMatch ? { content: { new: ari.content, old: publicationVersion.content } } : {}),
        ...(!descriptionMatch ? { description: { new: ari.description, old: publicationVersion.description } } : {}),
        ...(!keywordsMatch ? { keywords: { new: ari.keywords, old: publicationVersion.keywords } } : {}),
        ...(!topicsMatch ? { topics: { new: ari.topicIds, old: publicationVersionTopicIds } } : {}),
        ...(!userMatch ? { userId: { new: ari.userId, old: publicationVersion.user.id } } : {})
    };

    const somethingChanged = Object.keys(changes).length;

    return somethingChanged ? changes : false;
};

export const handleIncomingARI = async (question: I.ARIQuestion, dryRun?: boolean): Promise<I.HandledARI> => {
    // Validate question ID.
    // Quite random criteria for now - value is typed as a number which
    // stops us checking the type. May be revisited later.
    if (question.questionId > 999999999 || question.questionId < 1) {
        return {
            actionTaken: 'none',
            success: false,
            message: 'Invalid question ID format.'
        };
    }

    // Reject if question is archived. Success is true because this isn't really an error.
    if (question.isArchived) {
        return {
            actionTaken: 'none',
            success: true,
            message: 'Skipped because question is archived.'
        };
    }

    // Map ARI data to octopus data.
    const mappingAttempt = await mapAriQuestionToPublicationVersion(question);

    if (!mappingAttempt.success) {
        const feedback =
            'Failed to map ARI data to octopus data.' + (mappingAttempt.message ? ' ' + mappingAttempt.message : '');

        const { unrecognisedDepartment, unrecognisedTopics } = mappingAttempt;

        return {
            actionTaken: 'none',
            success: false,
            message: feedback,
            ...(unrecognisedDepartment ? { unrecognisedDepartment } : {}),
            ...(unrecognisedTopics ? { unrecognisedTopics } : {})
        };
    }

    const { mappedData, unrecognisedTopics } = mappingAttempt;
    const baseReturnObject = {
        ...(unrecognisedTopics ? { unrecognisedTopics } : {})
    };

    const user = await userService.get(mappedData.userId);

    if (!user) {
        return {
            ...baseReturnObject,
            actionTaken: 'none',
            success: false,
            message: `Failed to get user with ID from mapping: ${mappedData.userId}.`
        };
    }

    // Check existence of publication for this ARI Question.
    const existingPublication = await client.prisma.publication.findFirst({
        where: {
            externalId: question.questionId.toString(),
            externalSource: 'ARI'
        }
    });

    // If the ARI has not been ingested previously, a new research problem is created.
    if (!existingPublication) {
        if (dryRun) {
            return {
                ...baseReturnObject,
                actionTaken: 'create',
                success: true
            };
        }

        try {
            const newPublication = await publicationService.create(
                { ...mappedData, type: 'PROBLEM', conflictOfInterestStatus: false },
                user,
                true
            );

            if (!newPublication) {
                return {
                    ...baseReturnObject,
                    actionTaken: 'create',
                    success: false,
                    message: `Failed to create a publication for ARI question: ${question.questionId}.`
                };
            }

            const newVersion = await publicationVersionService.get(newPublication.id, 'latestLive');

            if (newVersion) {
                return {
                    ...baseReturnObject,
                    actionTaken: 'create',
                    success: true,
                    publicationVersion: newVersion
                };
            } else {
                return {
                    ...baseReturnObject,
                    actionTaken: 'create',
                    success: false,
                    message: `Created a publication for ARI question: ${question.questionId}, but couldn't retrieve the latest live version.`
                };
            }
        } catch (error) {
            console.log(error);

            return {
                ...baseReturnObject,
                actionTaken: 'create',
                success: false,
                message: `Failed to create a publication for ARI question: ${question.questionId}. Encountered error: ${error}`
            };
        }
    }

    // Detect whether the incoming ARI has changed since it was last imported.
    const existingVersion = await publicationVersionService.get(existingPublication.id, 'latestLive');

    if (!existingVersion) {
        return {
            ...baseReturnObject,
            actionTaken: 'none',
            success: false,
            message: 'Found a publication matching this ARI, but unable to get a latest live version.'
        };
    }

    const changes = detectChangesToARIPublication(mappedData, existingVersion);

    if (changes) {
        console.log(`Changes found when handling ARI ${question.questionId}`, changes);

        if (dryRun) {
            return {
                ...baseReturnObject,
                actionTaken: 'update',
                success: true
            };
        }

        // Data differs from what is in octopus, so update the publication.
        // Unlike manually created publications, these just have 1 version that
        // updates in-place so that we don't pollute datacite with lots of version DOIs.
        const now = new Date().toISOString();

        try {
            let updatedVersion = await publicationVersionService.update(existingVersion.id, {
                ...(changes.title && { title: mappedData.title }),
                ...(changes.content && { content: mappedData.content }),
                ...(changes.description && { description: mappedData.description }),
                ...(changes.keywords && { keywords: mappedData.keywords }),
                ...(changes.topics && { topics: { set: mappedData.topicIds.map((topicId) => ({ id: topicId })) } }),
                ...(changes.userId && { user: { connect: { id: mappedData.userId } } }),
                publishedDate: now,
                updatedAt: now
            });

            // If user changed, update coAuthors.
            if (changes.userId) {
                // Create a coAuthor based on the userId of the publicationVersion.
                // Get private version for compatibility with createCorrespondingCoAuthor.
                const privateVersion = await publicationVersionService.privateGetById(updatedVersion.id);

                if (privateVersion) {
                    // Delete old coAuthor.
                    // There should only be one coAuthor but since this is an array, loop through to make it clean.
                    await Promise.all(
                        existingVersion.coAuthors.map((coAuthor) => coAuthorService.deleteCoAuthor(coAuthor.id))
                    );
                    await coAuthorService.createCorrespondingCoAuthor(privateVersion);
                    const versionWithUpdatedCoAuthors = await publicationVersionService.getById(updatedVersion.id);

                    if (versionWithUpdatedCoAuthors) {
                        updatedVersion = versionWithUpdatedCoAuthors;
                    }
                }
            }

            // Everything is good, so ensure changes hit datacite and opensearch.
            await publicationVersionService.postPublishHook(updatedVersion, true);

            return {
                ...baseReturnObject,
                actionTaken: 'update',
                success: true,
                publicationVersion: updatedVersion
            };
        } catch (error) {
            console.log(error);

            return {
                ...baseReturnObject,
                actionTaken: 'update',
                success: false,
                message: `Failed to update publication for ARI question: ${question.questionId}. Encountered error: ${error}`
            };
        }
    } else {
        // No change found, so take no action.
        return {
            ...baseReturnObject,
            actionTaken: 'none',
            success: true,
            publicationVersion: existingVersion
        };
    }
};

export const ariEndpoint = 'https://ari.org.uk/api/questions?order_by=dateUpdated';

// Returns the mapped ARI department names for a given set of octopus organisational user IDs.
export const getParticipatingDepartmentNames = async (): Promise<string[]> => {
    const participatingDepartmentIds = process.env.PARTICIPATING_ARI_USER_IDS?.split(',') ?? [];
    const queryResults = await Promise.all(
        participatingDepartmentIds.map((userId) => client.prisma.userMapping.findMany({ where: { userId } }))
    );

    return queryResults.flatMap((userMappings) => userMappings.map((userMapping) => userMapping.value));
};

export const ingestReport = async (
    format: I.IngestReportFormat,
    ingestDetails: {
        checkedCount: number;
        durationSeconds: number;
        createdCount: number;
        updatedCount: number;
        unrecognisedDepartments: string[];
        unrecognisedTopics: string[];
        dryRun: boolean;
        full: boolean;
    }
): Promise<void> => {
    const {
        checkedCount,
        durationSeconds,
        createdCount,
        updatedCount,
        unrecognisedDepartments,
        unrecognisedTopics,
        dryRun,
        full
    } = ingestDetails;
    const intro = `${full ? 'Full' : 'Incremental'} ARI import ${dryRun ? 'dry ' : ''}run completed.`;
    const timingInfo =
        `Duration: ${durationSeconds} seconds.` +
        (dryRun && (createdCount || updatedCount)
            ? ` A real run would have taken a minimum of ${
                  createdCount + updatedCount / 2
              } additional seconds due to datacite API rate limits while creating/updating publications.`
            : '');
    const detailsPrefix = `The ${dryRun ? 'simulated ' : ''}results of this run are as follows.`;
    const text = `
${intro}
${timingInfo}
${detailsPrefix} 
ARIs checked: ${checkedCount}.
Publications created: ${createdCount}.
Publications updated: ${updatedCount}.
${unrecognisedDepartments.length ? 'Unrecognised departments: "' + unrecognisedDepartments.join('", "') + '".' : ''}
${unrecognisedTopics.length ? 'Unrecognised topics: "' + unrecognisedTopics.join('", "') + '".' : ''}`;

    if (format === 'file') {
        const fileName = 'ari-import-report.txt';
        await fs.writeFile(fileName, text);
        console.log(`Report file written to ${fileName}.`);

        return;
    }

    if (format === 'email') {
        const cleanDepartments = unrecognisedDepartments.map((department) => Helpers.getSafeHTML(department));
        const cleanTopics = unrecognisedTopics.map((topic) => Helpers.getSafeHTML(topic));
        const html = `
        <html>
            <body>
                <p>${intro}</p>
                <p>${timingInfo}</p>
                <p>${detailsPrefix}</p>
                <ul>
                    <li>ARIs checked: ${checkedCount}</li>
                    <li>Publications created: ${createdCount}</li>
                    <li>Publications updated: ${updatedCount}</li>
                    ${
                        cleanDepartments.length
                            ? '<li>Unrecognised departments: <ul><li>' +
                              cleanDepartments.join('</li><li>') +
                              '</li></ul></li>'
                            : ''
                    }
                    ${
                        cleanTopics.length
                            ? '<li>Unrecognised topics: <ul><li>' + cleanTopics.join('</li><li>') + '</li></ul></li>'
                            : ''
                    }
                </ul>
            </body>
        </html>
    `;
        await email.ariReport(html, text, 'ingest');

        return;
    }
};

export const getAllARIs = async (): Promise<I.ARIQuestion[]> => {
    // Collect all ARIs in a variable.
    const allAris: I.ARIQuestion[] = [];

    // After a page has been retrieved, add the data to the aris variable,
    // get the next page and repeat until reaching the last page.
    let pageUrl = ariEndpoint;
    // Updates with each loop. Contains total count which we need outside the loop.
    let paginationInfo;

    do {
        // Get page.
        const response = await axios.get(pageUrl);
        const pageAris = response.data.data;

        // Add page's ARIs to our variable.
        allAris.push(...pageAris);

        // Get the next page URL.
        // On the last run this will be undefined but that's fine because we won't need to repeat the loop.
        paginationInfo = response.data.meta.pagination;
        pageUrl = paginationInfo.links.next;
    } while (pageUrl);

    // In case something has caused this process to fail, perhaps the API changed, etc...
    if (allAris.length !== paginationInfo.total) {
        throw new Error('Number of ARIs retrieved does not match reported total. Stopping.');
    }

    return allAris;
};

export const archivedCheckReport = async (
    format: I.IngestReportFormat,
    details: {
        durationSeconds: number;
        updatedCount: number;
        dryRun: boolean;
        notFound: number[];
    }
): Promise<void> => {
    const { durationSeconds, updatedCount, dryRun, notFound } = details;
    const intro = `ARI archived check ${dryRun ? 'dry ' : ''}run completed.`;
    const timingInfo =
        `Duration: ${durationSeconds} seconds.` +
        (dryRun && updatedCount
            ? ` A real run would have taken a minimum of ${
                  updatedCount / 2
              } additional seconds due to datacite API rate limits while creating/updating publications.`
            : '');
    const detailsPrefix = `The ${dryRun ? 'simulated ' : ''}results of this run are as follows.`;
    const text = `
${intro}
${timingInfo}
${detailsPrefix} 
Publications updated: ${updatedCount}.
${notFound.length ? 'Publications not found: ' + notFound.join(', ') + '.' : ''}`;

    if (format === 'file') {
        const fileName = 'ari-archived-check-report.txt';
        await fs.writeFile(fileName, text);
        console.log(`Report file written to ${fileName}.`);

        return;
    }

    if (format === 'email') {
        const html = `
        <html>
            <body>
                <p>${intro}</p>
                <p>${timingInfo}</p>
                <p>${detailsPrefix}</p>
                <ul>
                    <li>Publications updated: ${updatedCount}</li>
                    ${
                        notFound.length
                            ? '<li>ARI questions not found in octopus: <ul><li>' +
                              notFound.join('</li><li>') +
                              '</li></ul></li>'
                            : ''
                    }
                </ul>
            </body>
        </html>
    `;
        await email.ariReport(html, text, 'archived-check');

        return;
    }
};
