import React, { useCallback } from 'react';
import axios from 'axios';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Stores from '@/stores';
import * as Types from '@/types';

/**
 * @description Edit links
 */
const Links: React.FC = (): React.ReactElement => {
    // State
    const [deletionUpdate, setDeletionUpdate] = React.useState('');
    const [entityType, setEntityType] = React.useState<Types.LinkedEntityType>('LIVE_PUBLICATION');
    // Store
    const {
        error,
        linkedTo,
        publicationId,
        publicationVersionId,
        setError,
        topics,
        type,
        updateLinkedTo,
        updateTopics
    } = Stores.usePublicationCreationStore((state) => ({
        error: state.error,
        linkedTo: state.linkedTo,
        publicationId: state.publicationVersion.versionOf,
        publicationVersionId: state.publicationVersion.id,
        setError: state.setError,
        topics: state.publicationVersion.topics,
        type: state.publicationVersion.publication.type,
        updateLinkedTo: state.updateLinkedTo,
        updateTopics: state.updateTopics
    }));
    const user = Stores.useAuthStore((state) => state.user);

    const linkablePublicationTypes = Helpers.publicationsAvailabletoPublication(type);

    const createPublicationLink = async (targetPublicationId: string) => {
        setError(null);
        if (targetPublicationId && user) {
            try {
                await api.post(
                    '/links',
                    {
                        to: targetPublicationId,
                        from: publicationId
                    },
                    user.token
                );

                // refetch direct links
                const response = await api.get(
                    `${Config.endpoints.publications}/${publicationId}/links?direct=true`,
                    user.token
                );

                updateLinkedTo(response.data.linkedTo);
            } catch (err) {
                setError('There was a problem creating the link.');
            }
        }
    };

    const deletePublicationLink = useCallback(
        async (linkId: string) => {
            setError(null);
            if (user) {
                try {
                    setDeletionUpdate('Deleting linked publication');
                    await api.destroy(`/links/${linkId}`, user.token);

                    // update linked publications in the UI
                    updateLinkedTo(linkedTo.filter((link) => link.linkId !== linkId));
                    setDeletionUpdate('Linked publication deleted');
                } catch (err) {
                    setError('There was a problem removing the link.');
                }
            }
        },
        [linkedTo, setDeletionUpdate, setError, updateLinkedTo, user]
    );

    const markPublicationLinkForDeletion = useCallback(
        async (linkId: string, toDelete: boolean) => {
            setError(null);
            if (user) {
                try {
                    await api.post(`/links/${linkId}/mark-for-deletion`, { toDelete }, user.token);

                    // update linked publications in the UI
                    const newLinkedTo = structuredClone(linkedTo);
                    const changedLinkIndex = newLinkedTo.findIndex(
                        (linkedPublication) => linkedPublication.linkId === linkId
                    );
                    newLinkedTo[changedLinkIndex].pendingDeletion = toDelete;
                    updateLinkedTo(newLinkedTo);
                } catch (err) {
                    setError('There was a problem marking the link for deletion.');
                }
            }
        },
        [linkedTo, setError, updateLinkedTo, user]
    );

    const deleteTopicLink = useCallback(
        async (topicId: string) => {
            setError(null);

            if (user) {
                try {
                    setDeletionUpdate('Deleting linked topic');
                    // Update publication's topic IDs with current list minus ID to delete
                    await api.patch(
                        `${Config.endpoints.publicationVersions}/${publicationVersionId}`,
                        {
                            topics: topics.filter((topic) => topic.id !== topicId).map((topic) => topic.id)
                        },
                        user.token
                    );

                    // update topics in the UI
                    updateTopics(topics.filter((topic) => topic.id !== topicId));
                    setDeletionUpdate('Linked topic deleted');
                } catch (err) {
                    setError(
                        axios.isAxiosError(err) ? err.response?.data.message : 'There was a problem removing the topic.'
                    );
                }
            }
        },
        [publicationVersionId, setDeletionUpdate, setError, topics, updateTopics, user]
    );

    // When making a research problem, we refer to "items" to link to (because it could be a topic), and not just "publications"
    const isProblem = type === 'PROBLEM';
    const linkableEntityLabel = isProblem ? 'item' : 'publication';
    let linkableEntityTypes: Types.LinkedEntityType[];

    // Problems can link to all entity types.
    if (isProblem) {
        linkableEntityTypes = ['DRAFT_PUBLICATION', 'LIVE_PUBLICATION', 'TOPIC'];
    } else {
        // Peer reviews can't link to drafts.
        if (type === 'PEER_REVIEW') {
            linkableEntityTypes = ['LIVE_PUBLICATION'];
        } else {
            linkableEntityTypes = ['LIVE_PUBLICATION', 'DRAFT_PUBLICATION'];
        }
    }

    const inheritedLinkRows: React.ReactNode[] = [];
    const newLinkRows: React.ReactNode[] = [];

    for (const linkedPublication of linkedTo) {
        const row = (
            <Components.LinkedPublicationRow
                key={linkedPublication.id}
                deleteLink={deletePublicationLink}
                linkedPublication={linkedPublication}
                markLinkForDeletion={markPublicationLinkForDeletion}
            />
        );
        if (linkedPublication.draft) {
            newLinkRows.push(row);
        } else {
            inheritedLinkRows.push(row);
        }
    }

    const inheritedTopicRows: React.ReactNode[] = [];
    const newTopicRows: React.ReactNode[] = [];

    for (const topic of topics) {
        const row = <Components.LinkedTopicRow key={topic.id} topic={topic} deleteTopic={deleteTopicLink} />;
        if (topic.draft) {
            newTopicRows.push(row);
        } else {
            inheritedTopicRows.push(row);
        }
    }

    const h3Classes =
        'mb-4 font-montserrat text-lg font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100';
    const paragraphClasses = 'text-sm text-grey-800 transition-colors duration-500 dark:text-white-50';

    const linkedEntityTypeLabels: Record<Types.LinkedEntityType, string> = {
        LIVE_PUBLICATION: 'Publications',
        TOPIC: 'Research topics',
        DRAFT_PUBLICATION: 'Drafts'
    };

    return (
        <div className="space-y-6 lg:space-y-10 2xl:w-10/12">
            <div>
                <Components.PublicationCreationStepTitle
                    text={`What ${linkableEntityLabel}s should this publication be linked from?`}
                    required
                />
                <p className={`mb-6 ${paragraphClasses}`}>
                    All publications in Octopus are linked to each other to form research chains, branching down from
                    research problems to applications/implications.{' '}
                    {isProblem &&
                        ' For research problems, if there is no existing publication on the system that yours relates to, you can link to a research topic instead.'}
                </p>

                <p className={`mb-6 ${paragraphClasses}`}>
                    Your {Helpers.formatPublicationType(type, true)} must be linked from at least one other{' '}
                    {linkableEntityLabel} on Octopus. {Helpers.formatPublicationType(type, true)} can be linked from{' '}
                    {linkablePublicationTypes.map((type, index) => {
                        return `${Helpers.formatPublicationType(type, true)}${
                            index !== linkablePublicationTypes.length - 1
                                ? ', '
                                : isProblem
                                  ? ' and Research Topic. '
                                  : '. '
                        }`;
                    })}
                    For more information on publication types, please see the{' '}
                    <Components.Link href="/faq#pub_type_octopus">FAQ</Components.Link>. The search box below has been
                    filtered to only show {linkableEntityLabel}s that can be linked to your publication type.{' '}
                    {isProblem && ' Use the dropdown to switch between searching for publications or research topics.'}
                </p>

                <p className={paragraphClasses}>
                    This approach structures the content of the platform and makes your work more discoverable. It also
                    helps you avoid repeating work, as there is no need to keep re-writing descriptions of well-known
                    Research Problems, or Methods etc.
                </p>
            </div>

            <div className="relative">
                <Components.PublicationCreationStepTitle text="Add new links" required />
                <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center">
                    {type !== 'PEER_REVIEW' && (
                        <select
                            name="linked-entity-type"
                            id="linked-entity-type"
                            onChange={(e) => {
                                const value: Types.LinkedEntityType = e.target.value as Types.LinkedEntityType;
                                setEntityType(value);
                            }}
                            value={entityType}
                            className="block rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500 sm:mr-0"
                        >
                            {linkableEntityTypes.map((type) => (
                                <option key={type} value={type}>
                                    {linkedEntityTypeLabels[type]}
                                </option>
                            ))}
                        </select>
                    )}
                    <div className="flex-1">
                        {entityType === 'TOPIC' ? (
                            <Components.LinkedTopicsCombobox setError={setError} topics={topics} />
                        ) : (
                            <Components.PublicationCombobox
                                buttonCallback={createPublicationLink}
                                buttonText="Add link"
                                draftsOnly={entityType === 'DRAFT_PUBLICATION'}
                                excludedIds={[publicationId, ...linkedTo.map((link) => link.id)]}
                                setError={setError}
                                targetTypes={linkablePublicationTypes}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="sr-only" aria-live="polite">
                {deletionUpdate}
            </div>
            {(!!inheritedLinkRows.length || !!inheritedTopicRows.length) && (
                <div>
                    <h3 className={h3Classes}>Links on published version</h3>
                    {!!inheritedLinkRows.length && (
                        <>
                            <p className={paragraphClasses}>
                                Links that were added on the previously published version can be marked to be deleted
                                when this new version is published.
                            </p>
                            <Components.LinkedItemTable
                                entityType="PUBLICATION"
                                inherited={true}
                                rows={inheritedLinkRows}
                            />
                        </>
                    )}
                    {!!inheritedTopicRows.length && (
                        <Components.LinkedItemTable entityType="TOPIC" inherited={true} rows={inheritedTopicRows} />
                    )}
                </div>
            )}
            {(!!newLinkRows.length || !!newTopicRows.length) && (
                <div>
                    <h3 className={h3Classes}>Links added in this version</h3>
                    {!!newLinkRows.length && (
                        <Components.LinkedItemTable entityType="PUBLICATION" inherited={false} rows={newLinkRows} />
                    )}
                    {!!newTopicRows.length && (
                        <Components.LinkedItemTable entityType="TOPIC" inherited={false} rows={newTopicRows} />
                    )}
                </div>
            )}
            {!error && !linkedTo.length && !topics?.length && (
                <Components.Alert
                    severity="INFO"
                    title="This publication does not have any linked items."
                    className="w-fit"
                />
            )}
        </div>
    );
};

export default React.memo(Links);
