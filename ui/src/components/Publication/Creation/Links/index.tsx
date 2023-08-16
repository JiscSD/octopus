import React from 'react';
import * as Framer from 'framer-motion';

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
    const user = Stores.useAuthStore((state) => state.user);

    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.id);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);
    
    const [error, setError] = React.useState<string | undefined>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [topics, setTopics] = React.useState<Interfaces.BaseTopic[]>([]);

    const fetchAndSetLinks = async (token: string, entityType: Types.LinkedEntityType) => {
        try {
            const response = await api.get(`/publications/${currentPublicationId}`, token);
            if (entityType === 'PUBLICATION') {
                updateLinkTo(response.data.linkedTo);
            } else {
                setTopics(response.data.topics);
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

    return (
        <div className="space-y-6 lg:space-y-10 2xl:w-10/12">
            <div>
                <Components.PublicationCreationStepTitle
                    text="What publications should this publication be linked from?"
                    required
                />
                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    All publications in Octopus are linked to each other to form research chains, branching down from
                    research problems to real world implementations.
                </p>

                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    Your {Helpers.formatPublicationType(type)} must be linked from at least one other publication on
                    Octopus. {Helpers.formatPublicationType(type)} can be linked from{' '}
                    {availableLinkTypes.map((type, index) => (
                        <span key={type}>
                            <Components.Link
                                href={`${Config.urls.about.path}#${type}`}
                                openNew={true}
                                className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                            >
                                <span>{Helpers.formatPublicationType(type)}</span>
                            </Components.Link>
                            {index !== availableLinkTypes.length - 1 ? ', ' : '.'}
                        </span>
                    ))}{' '}
                    The search box below has been filtered to only show publications that can be linked to your
                    publication type.
                </p>

                <p className="mb-6 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    This approach structures the content of the platform and makes your work more discoverable. It also
                    helps you avoid repeating work, as there is no need to keep re-writing descriptions of well-known
                    Research Problems, or Methods etc.
                </p>
            </div>

            <div className="relative">
                <Components.PublicationCreationStepTitle text="Add links" required />
                <select
                    name="linked-entity-type"
                    id="linked-entity-type"
                    onChange={(e) => {
                        const value: Types.LinkedEntityType = e.target.value as Types.LinkedEntityType;
                        setEntityType(value);
                    }}
                    value={entityType}
                    className="!mt-0 block rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500 mr-4 sm:mr-0"
                >
                    <option value="PUBLICATION">Publications</option>
                    <option value="TOPIC">Research topics</option>
                </select>
                { entityType === "PUBLICATION" ?
                    <Components.LinkedPublicationsCombobox
                        fetchAndSetLinks={fetchAndSetLinks}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                    /> :
                    <Components.LinkedTopicsCombobox
                        fetchAndSetLinks={fetchAndSetLinks}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                        topics={topics}
                    />
                }
            </div>

            {error && !loading && (
                <Components.Alert severity="ERROR" title={error} allowDismiss />
            )}

            {!error && !!linkTos.length ? (
                <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                            <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                    <tr>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Publication
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="my-4 divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                    {linkTos.map((link) => (
                                        <Components.PublicationCreationLinkedPublicationRow
                                            key={link.id}
                                            link={link}
                                            deleteLink={deletePublicationLink}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Framer.motion.div>
            ) : (
                <Components.Alert
                    severity="INFO"
                    title="This publication does not have any linked publications."
                    className="w-fit"
                />
            )}
        </div>
    );
};

export default Links;
