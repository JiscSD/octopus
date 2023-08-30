import React from 'react';

import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Types from '@types';

import * as api from '@api';

/**
 * @description Edit links
 */
const Links: React.FC = (): React.ReactElement => {
    const [entityType, setEntityType] = React.useState<Types.LinkedEntityType>('PUBLICATION');
    const linkTos = Stores.usePublicationCreationStore((state) => state.linkTo);
    const updateLinkTo = Stores.usePublicationCreationStore((state) => state.updateLinkTo);
    const topics = Stores.usePublicationCreationStore((state) => state.topics);
    const updateTopics = Stores.usePublicationCreationStore((state) => state.updateTopics);
    const user = Stores.useAuthStore((state) => state.user);

    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.id);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);

    const [error, setError] = React.useState<string | undefined>();
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchAndSetLinks = async (token: string, entityType: Types.LinkedEntityType) => {
        try {
            const response = await api.get(`/publications/${currentPublicationId}`, token);
            if (entityType === 'PUBLICATION') {
                updateLinkTo(response.data.linkedTo);
            } else {
                updateTopics(response.data.topics);
            }
        } catch (err) {
            setError('There was a problem fetching this publication.');
        }
    };

    const deletePublicationLink = async (linkID: string) => {
        setError(undefined);
        if (user) {
            try {
                await api.destroy(`/links/${linkID}`, user.token);
            } catch (err) {
                setError('There was a problem removing the link.');
            }
            fetchAndSetLinks(user.token, 'PUBLICATION');
        }
    };

    const deleteTopicLink = async (topicId: string) => {
        setError(undefined);
        if (user) {
            try {
                // Update publication's topic IDs with current list minus ID to delete
                await api.patch(
                    '/publications/' + currentPublicationId,
                    {
                        topics: [...topics.map((topic) => topic.id).filter((id) => id !== topicId)]
                    },
                    user.token
                );
            } catch (err) {
                setError('There was a problem removing the topic.');
            }
            fetchAndSetLinks(user.token, 'TOPIC');
        }
    };

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
                    {!!isProblem && (
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
                        {entityType === 'TOPIC' && !!isProblem ? (
                            <Components.LinkedTopicsCombobox
                                fetchAndSetLinks={fetchAndSetLinks}
                                setError={setError}
                                loading={loading}
                                setLoading={setLoading}
                                topics={topics}
                            />
                        ) : (
                            <Components.LinkedPublicationsCombobox
                                fetchAndSetLinks={fetchAndSetLinks}
                                setError={setError}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        )}
                    </div>
                </div>
            </div>

            {error && !loading && <Components.Alert severity="ERROR" title={error} allowDismiss />}

            {!error && !!linkTos.length && (
                <Components.LinkedItemTable
                    deleteLink={deletePublicationLink}
                    entities={linkTos}
                    entityType="PUBLICATION"
                />
            )}
            {!error && !!topics.length && !!isProblem && (
                <Components.LinkedItemTable deleteLink={deleteTopicLink} entities={topics} entityType="TOPIC" />
            )}
            {!error && !linkTos.length && !topics.length && (
                <Components.Alert
                    severity="INFO"
                    title="This publication does not have any linked items."
                    className="w-fit"
                />
            )}
        </div>
    );
};

export default Links;
