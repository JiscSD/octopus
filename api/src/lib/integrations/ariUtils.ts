import * as client from 'lib/client';
import * as coAuthorService from 'coAuthor/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as topicMappingService from 'topicMapping/service';
import * as userService from 'user/service';

export const mapAriQuestionToPublicationVersion = async (
    questionData: I.ARIQuestion
): Promise<
    | {
          success: true;
          mappedData: I.MappedARIQuestion;
          message: null;
      }
    | { success: false; mappedData: null; message: string }
> => {
    const {
        backgroundInformation,
        contactDetails,
        department,
        fieldsOfResearch,
        question,
        questionId,
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
    const content = Helpers.getSafeHTML(
        [commonBoilerplateHTML, titleHTML, backgroundInformationHTML, contactDetailsHTML, relatedUKRIProjectsHTML].join(
            ''
        )
    );
    const keywords = fieldsOfResearch.concat(tags);
    // Find user by department title.
    // All ARI accounts are given a firstname of the department name appended with " (GB)".
    const user = await client.prisma.user.findFirst({
        where: {
            firstName: {
                mode: 'insensitive',
                equals: department + ' (GB)'
            },
            role: 'ORGANISATION'
        },
        select: {
            id: true,
            defaultTopic: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });

    if (!user) {
        return {
            success: false,
            mappedData: null,
            message: 'User not found for department: ' + department
        };
    }

    // Map ARI topics to octopus topics.
    const topicMappings = await Promise.all(ariTopics.map((ariTopic) => topicMappingService.get(ariTopic, 'ARI')));
    // We intentionally don't map some ARI topics, so filter those out.
    const octopusTopics = topicMappings.flatMap((topicMapping) =>
        topicMapping && topicMapping.isMapped && topicMapping.topic ? [topicMapping.topic] : []
    );
    // If no topics listed in ARI, fall back to default topic for the department (user).
    const finalTopics = octopusTopics.length ? octopusTopics : user.defaultTopic ? [user.defaultTopic] : [];

    return {
        success: true,
        mappedData: {
            title,
            content,
            keywords,
            topics: finalTopics,
            externalSource: 'ARI',
            externalId: questionId.toString(),
            userId: user.id
        },
        message: null
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
          keywords?: FieldDiff<string[]>;
          topics?: FieldDiff<string[]>;
          userId?: FieldDiff<string>;
      } => {
    const titleMatch = ari.title === publicationVersion.title;
    const contentMatch = ari.content === publicationVersion.content;
    const keywordsMatch = Helpers.compareArrays(ari.keywords, publicationVersion.keywords);
    const ariTopicIds = ari.topics.map((topic) => topic.id);
    const publicationVersionTopicIds = publicationVersion.topics.map((topic) => topic.id);
    const topicsMatch = Helpers.compareArrays(ariTopicIds, publicationVersionTopicIds);
    const userMatch = ari.userId === publicationVersion.user.id;

    const changes = {
        ...(!titleMatch ? { title: { old: ari.title, new: publicationVersion.title } } : {}),
        ...(!contentMatch ? { content: { old: ari.content, new: publicationVersion.content } } : {}),
        ...(!keywordsMatch ? { keywords: { old: ari.keywords, new: publicationVersion.keywords } } : {}),
        ...(!topicsMatch ? { topics: { old: ariTopicIds, new: publicationVersionTopicIds } } : {}),
        ...(!userMatch ? { user: { old: ari.userId, new: publicationVersion.user.id } } : {})
    };

    const somethingChanged = !(titleMatch && contentMatch && keywordsMatch && topicsMatch && userMatch);

    return somethingChanged ? changes : false;
};

export const handleIncomingARI = async (question: I.ARIQuestion): Promise<I.HandledARI> => {
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

    // Check existence of publication for this ARI Question.
    const existingPublication = await client.prisma.publication.findFirst({
        where: {
            externalId: question.questionId.toString(),
            externalSource: 'ARI'
        }
    });

    // Map ARI data to octopus data.
    const mappingAttempt = await mapAriQuestionToPublicationVersion(question);

    if (!mappingAttempt.success) {
        const feedback =
            'Failed to map ARI data to octopus data.' + (mappingAttempt.message ? ' ' + mappingAttempt.message : '');

        return {
            actionTaken: 'none',
            success: false,
            message: feedback
        };
    }

    const { mappedData } = mappingAttempt;
    const user = await userService.get(mappedData.userId);

    if (!user) {
        return {
            actionTaken: 'none',
            success: false,
            message: `Failed to get user with ID from mapping: ${mappedData.userId}.`
        };
    }

    // If the ARI has not been ingested previously, a new research problem is created.
    if (!existingPublication) {
        const newPublication = await publicationService.create(
            { ...mappedData, type: 'PROBLEM', conflictOfInterestStatus: false },
            user,
            true
        );

        if (!newPublication) {
            return {
                actionTaken: 'create',
                success: false,
                message: `Failed to create a publication for ARI question: ${question.questionId}.`
            };
        }

        const newVersion = await publicationVersionService.get(newPublication.id, 'latestLive');

        if (newVersion) {
            return {
                actionTaken: 'create',
                success: true,
                publicationVersion: newVersion
            };
        } else {
            return {
                actionTaken: 'create',
                success: false,
                message: `Created a publication for ARI question: ${question.questionId}, but couldn't retrieve the latest live version.`
            };
        }
    }

    // Detect whether the incoming ARI has changed since it was last imported.
    const existingVersion = await publicationVersionService.get(existingPublication.id, 'latestLive');

    if (!existingVersion) {
        return {
            actionTaken: 'none',
            success: false,
            message: 'Found a publication matching this ARI, but unable to get a latest live version.'
        };
    }

    // Compare all mapped fields.
    const changes = detectChangesToARIPublication(mappedData, existingVersion);

    if (changes) {
        // Data differs from what is in octopus, so attempt to re-version the publication.

        // If the user (ARI department) changes, the create() call handles that.
        // As such, we don't need to deal with it in the update() call.
        const newVersion = await publicationVersionService.create(existingVersion, user);
        // Mock coauthor workflow process of stating affiliations.
        // Treat organisational account as an independent (unaffiliated) coauthor.
        await coAuthorService.update(newVersion.coAuthors[0].id, { isIndependent: true });

        const updatedVersion = await publicationVersionService.update(newVersion.id, {
            ...(changes.title && { title: mappedData.title }),
            ...(changes.content && { content: mappedData.content }),
            ...(changes.keywords && { keywords: mappedData.keywords }),
            ...(changes.topics && { topics: { set: mappedData.topics.map((topic) => ({ id: topic.id })) } })
        });
        const isReadyToPublish = await publicationVersionService.checkIsReadyToPublish(updatedVersion);

        if (isReadyToPublish) {
            await publicationVersionService.generateNewVersionDOI(updatedVersion, existingVersion);
            const publishedNewVersion = await publicationVersionService.updateStatus(newVersion.id, 'LIVE');

            if (publishedNewVersion) {
                return {
                    actionTaken: 'update',
                    success: true,
                    publicationVersion: publishedNewVersion
                };
            } else {
                return {
                    actionTaken: 'update',
                    success: false,
                    message: `Created a new version (id: ${newVersion.id}) of the existing publication for ARI question: ${question.questionId}, but failed to update its status to LIVE.`
                };
            }
        } else {
            return {
                actionTaken: 'update',
                success: false,
                message: `Created a new version (id: ${newVersion.id}) of the existing publication for ARI question: ${question.questionId}, but its data was not ready to be made LIVE.`
            };
        }
    } else {
        // No change found, so take no action.
        return {
            actionTaken: 'none',
            success: true,
            publicationVersion: existingVersion
        };
    }
};
