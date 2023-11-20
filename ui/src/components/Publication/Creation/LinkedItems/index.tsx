import React, { useCallback } from 'react';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';
import * as Config from '@config';
import axios from 'axios';

/**
 * @description Edit links
 */
const Links: React.FC = (): React.ReactElement => {
    const [entityType, setEntityType] = React.useState<Types.LinkedEntityType>('PUBLICATION');
    const { publicationVersionId, topics, updateTopics, linkedTo, updateLinkedTo, error, setError } =
        Stores.usePublicationCreationStore((state) => ({
            publicationVersionId: state.publicationVersion.id,
            topics: state.publicationVersion.topics,
            updateTopics: state.updateTopics,
            linkedTo: state.linkedTo,
            updateLinkedTo: state.updateLinkedTo,
            error: state.error,
            setError: state.setError
        }));

    const user = Stores.useAuthStore((state) => state.user);

    const type = Stores.usePublicationCreationStore((state) => state.publicationVersion.publication.type);
    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);

    const [loading, setLoading] = React.useState<boolean>(false);

    const deletePublicationLink = useCallback(
        async (linkId: string) => {
            setError(null);
            if (user) {
                try {
                    await api.destroy(`/links/${linkId}`, user.token);

                    // update linked publications in the UI
                    updateLinkedTo(linkedTo.filter((link) => link.linkId !== linkId));
                } catch (err) {
                    setError('There was a problem removing the link.');
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
                } catch (err) {
                    setError(
                        axios.isAxiosError(err) ? err.response?.data.message : 'There was a problem removing the topic.'
                    );
                }
            }
        },
        [publicationVersionId, setError, topics, updateTopics, user]
    );

    // When making a research problem, we refer to "items" to link to (because it could be a topic), and not just "publications"
    const isProblem = type === 'PROBLEM';
    const linkableEntityLabel = isProblem ? 'item' : 'publication';

    return (
        <div className="space-y-6 lg:space-y-10 2xl:w-10/12">
            <div>
                <Components.PublicationCreationStepTitle
                    text={`What ${linkableEntityLabel}s should this publication be linked from?`}
                    required
                />
                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    All publications in Octopus are linked to each other to form research chains, branching down from
                    research problems to real world implementations.{' '}
                    {isProblem &&
                        ' For research problems, if there is no existing publication on the system that yours relates to, you can link to a research topic instead.'}
                </p>

                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    Your {Helpers.formatPublicationType(type)} must be linked from at least one other{' '}
                    {linkableEntityLabel} on Octopus. {Helpers.formatPublicationType(type)} can be linked from{' '}
                    {availableLinkTypes.map((type, index) => {
                        return `${Helpers.formatPublicationType(type)}${
                            index !== availableLinkTypes.length - 1 ? ', ' : isProblem ? ' and Research Topic. ' : '. '
                        }`;
                    })}
                    For more information on publication types, please see the{' '}
                    <Components.Link href="/faq#pub_type_octopus">FAQ</Components.Link>. The search box below has been
                    filtered to only show {linkableEntityLabel}s that can be linked to your publication type.{' '}
                    {isProblem && ' Use the dropdown to switch between searching for publications or research topics.'}
                </p>

                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    This approach structures the content of the platform and makes your work more discoverable. It also
                    helps you avoid repeating work, as there is no need to keep re-writing descriptions of well-known
                    Research Problems, or Methods etc.
                </p>
            </div>

            <div className="relative">
                <Components.PublicationCreationStepTitle text="Add links" required />
                <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center">
                    {isProblem && (
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
                            <option value="PUBLICATION">Publications</option>
                            <option value="TOPIC">Research topics</option>
                        </select>
                    )}
                    <div className="flex-1">
                        {entityType === 'TOPIC' ? (
                            <Components.LinkedTopicsCombobox
                                setError={setError}
                                loading={loading}
                                setLoading={setLoading}
                                topics={topics}
                            />
                        ) : (
                            <Components.LinkedPublicationsCombobox
                                setError={setError}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        )}
                    </div>
                </div>
            </div>

            {!!linkedTo.length && (
                <Components.LinkedItemTable
                    deleteLink={deletePublicationLink}
                    entities={linkedTo}
                    entityType="PUBLICATION"
                />
            )}
            {!!topics?.length && (
                <Components.LinkedItemTable deleteLink={deleteTopicLink} entities={topics} entityType="TOPIC" />
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
