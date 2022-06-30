import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as api from '@api';

/**
 * @description Edit links
 */
const LinkedPublications: React.FC = (): React.ReactElement => {
    const SWRConfig = useSWRConfig();
    const user = Stores.useAuthStore((state) => state.user);
    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.id);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const linkTos = Stores.usePublicationCreationStore((state) => state.linkTo);
    const updateLinkTo = Stores.usePublicationCreationStore((state) => state.updateLinkTo);

    const [search, setSearch] = React.useState('');
    const [selectedPublication, setSelectedPublication] = React.useState<Interfaces.Publication | null>(null);
    const [mutateError, setMutateError] = React.useState<string | undefined>();
    const [createMutateLoading, setCreateMutateLoading] = React.useState(false);

    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);
    const formattedAsString = availableLinkTypes.join(',');

    const excludedIds = [currentPublicationId, ...linkTos.map((link) => link.publicationToRef.id)];

    const swrKey = `/publications?type=${formattedAsString}&limit=10${
        search.length > 2 ? `&search=${search}` : ''
    }&exclude=${excludedIds.join(',')}`;

    const {
        data: { data: results = { data: [], metadata: { limit: 10, offset: 0, total: 0 } } } = {},
        error,
        isValidating
    } = useSWR(swrKey, null, {
        fallback: {
            '/publications': []
        }
    });

    const fetchAndSetLinkTos = async (token: string) => {
        try {
            const response = await api.get(`/publications/${currentPublicationId}`, token);
            updateLinkTo(response.data.linkedTo);
            SWRConfig.mutate(swrKey);
        } catch (err) {
            setMutateError('There was a problem fetching this publication.');
        }
    };

    const createLink = async () => {
        setMutateError(undefined);
        setCreateMutateLoading(true);
        if (selectedPublication && user) {
            try {
                setSearch('');
                setSelectedPublication(null);
                await api.post(
                    '/links',
                    {
                        to: selectedPublication.id,
                        from: currentPublicationId
                    },
                    user.token
                );
            } catch (err: any) {
                setMutateError(err.response.data.message);
            }
            fetchAndSetLinkTos(user.token);
        }
        setCreateMutateLoading(false);
    };

    const deleteLink = async (linkID: string) => {
        setMutateError(undefined);
        if (user) {
            try {
                await api.destroy(`/links/${linkID}`, user.token);
            } catch (err) {
                setMutateError('There was a problem removing the link.');
            }
            fetchAndSetLinkTos(user.token);
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10 2xl:w-10/12">
            <div>
                <Components.PublicationCreationStepTitle text="What publications do you want to linked to?" required />
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
                <HeadlessUI.Combobox value={selectedPublication} onChange={setSelectedPublication}>
                    <div className="flex items-center space-x-4">
                        <HeadlessUI.Combobox.Input
                            className="w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                            autoComplete="off"
                            displayValue={(publication: Interfaces.Publication) => {
                                return publication?.title || '';
                            }}
                            placeholder="Search for publications"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <Components.Button
                            title="Add link"
                            disabled={isValidating || createMutateLoading || !selectedPublication}
                            onClick={createLink}
                            iconPosition="RIGHT"
                            icon={
                                createMutateLoading ? (
                                    <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                ) : (
                                    <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                )
                            }
                        />
                    </div>
                    <HeadlessUI.Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setSearch('')}
                    >
                        <HeadlessUI.Combobox.Options className="absolute mt-2 max-h-96 w-2/3 overflow-scroll rounded bg-white-50 shadow-xl">
                            {!isValidating &&
                                results.data.map((publication: Interfaces.Publication, index: number) => (
                                    <HeadlessUI.Combobox.Option
                                        key={publication.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none p-2 text-teal-900 ${
                                                active && 'ring-2 ring-inset ring-yellow-400'
                                            } ${index === 0 && 'rounded-t'} ${
                                                index === results.length - 1 && 'rounded-b'
                                            }`
                                        }
                                        value={publication}
                                    >
                                        <div className="space-y-2">
                                            <span className="font-montserrat text-sm font-medium text-teal-600">
                                                {Helpers.formatPublicationType(publication.type)}
                                            </span>
                                            <p className="text-grey-800">{publication.title}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-grey-700">
                                                    {Helpers.formatDate(publication.publishedDate)},
                                                </span>
                                                <span className="text-sm text-grey-700">
                                                    {publication.user.firstName[0]}. {publication.user.lastName}
                                                </span>
                                            </div>
                                        </div>
                                    </HeadlessUI.Combobox.Option>
                                ))}
                        </HeadlessUI.Combobox.Options>
                    </HeadlessUI.Transition>
                </HeadlessUI.Combobox>
            </div>

            {error && !isValidating && <Components.Alert severity="ERROR" title={error.message} />}
            {mutateError && !createMutateLoading && (
                <Components.Alert severity="ERROR" title={mutateError} allowDismiss />
            )}

            {!error && !!linkTos.length ? (
                <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                                <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                        <tr>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                                Publication
                                            </th>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 " />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                        {linkTos.map((link) => (
                                            <Components.PublicationCreationLinkToEntry
                                                key={link.id}
                                                link={link}
                                                deleteLink={deleteLink}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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

export default LinkedPublications;
