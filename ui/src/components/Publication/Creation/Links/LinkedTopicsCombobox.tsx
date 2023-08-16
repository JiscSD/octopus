import React from 'react';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import useSWR, { useSWRConfig } from 'swr';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Types from '@types';

import * as api from '@api';

type LinkedPublicationsComboboxProps = {
    fetchAndSetLinks: (token: string, entityType: Types.LinkedEntityType) => void;
    setError: (error: string | undefined) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    topics: Interfaces.BaseTopic[];
}

const LinkedTopicsCombobox: React.FC<LinkedPublicationsComboboxProps> = (props): React.ReactElement => {
    const SWRConfig = useSWRConfig();

    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.id);
    const user = Stores.useAuthStore((state) => state.user);

    const [search, setSearch] = React.useState('');
    const [selectedTopic, setSelectedTopic] = React.useState<Interfaces.Publication | null>(null);

    const currentTopicIds = [...props.topics.map((topic) => topic.id)];

    const swrKey = `/topics?&limit=10${
        search.length > 2 ? `&search=${search}` : ''
    }&exclude=${currentTopicIds.join(',')}`;

    const {
        data: data = {
            results: [],
            limit: 10,
            offset: 0,
            total: 0
        },
        error,
        isValidating
    } = useSWR(swrKey, null, {
        fallback: {
            '/topics': []
        }
    });

    console.log(data.results);

    if (error) {
        props.setError(error.message);
    }

    const addTopic = async () => {
        props.setError(undefined);
        props.setLoading(true);
        if (selectedTopic && user) {
            try {
                setSearch('');
                setSelectedTopic(null);
                await api.patch(
                    '/publications/' + currentPublicationId,
                    {
                        topics: [
                            ...currentTopicIds,
                            selectedTopic.id
                        ]
                    },
                    user.token
                );
            } catch (err) {
                props.setError('There was a problem adding the topic.');
            }
            props.fetchAndSetLinks(user.token, 'TOPIC');
            SWRConfig.mutate(swrKey);
        }
        props.setLoading(false);
    };

    return (
        <HeadlessUI.Combobox value={selectedTopic} onChange={setSelectedTopic}>
            <div className="flex flex-wrap sm:flex-nowrap items-center sm:space-x-4">
                <HeadlessUI.Combobox.Input
                    className="w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 mr-4 sm:mr-0 mt-4"
                    autoComplete="off"
                    displayValue={(topic: Interfaces.BaseTopic) => {
                        return topic?.title || '';
                    }}
                    placeholder="Search for topics"
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Components.Button
                    title="Add link"
                    className="mt-4"
                    disabled={isValidating || props.loading || !selectedTopic}
                    onClick={addTopic}
                    endIcon={
                        props.loading ? (
                            <OutlineIcons.ArrowPathIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
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
                <HeadlessUI.Combobox.Options className="absolute z-10 mt-2 max-h-96 w-2/3 overflow-scroll rounded bg-white-50 shadow-xl">
                    {!isValidating &&
                        data.results.map((topic: Interfaces.BaseTopic, index: number) => (
                            <HeadlessUI.Combobox.Option
                                key={topic.id}
                                className={({ active }) =>
                                    `relative cursor-default select-none p-2 text-teal-900 ${
                                        active && 'ring-2 ring-inset ring-yellow-400'
                                    } ${index === 0 && 'rounded-t'} ${
                                        index === data.results.length - 1 && 'rounded-b'
                                    }`
                                }
                                value={topic}
                            >
                                <div className="space-y-2">
                                    <span className="font-montserrat text-sm font-medium text-teal-600">
                                        Research Topic
                                    </span>
                                    <p className="text-grey-800">{topic.title}</p>
                                </div>
                            </HeadlessUI.Combobox.Option>
                        ))}
                </HeadlessUI.Combobox.Options>
            </HeadlessUI.Transition>
        </HeadlessUI.Combobox>
    )
};

export default LinkedTopicsCombobox;