import React from 'react';
import * as Framer from 'framer-motion';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

const CoAuthor: React.FC = (): React.ReactElement => {
    const coAuthors = Stores.usePublicationCreationStore((state) => state.coAuthors);
    const updateCoAuthors = Stores.usePublicationCreationStore((state) => state.updateCoAuthors);

    const publicationId = Stores.usePublicationCreationStore((state) => state.id);
    const user = Stores.useAuthStore((state) => state.user);

    const [loading, setLoading] = React.useState(false);
    const [coAuthor, setCoAuthor] = React.useState('');

    const addCoAuthorToPublication = React.useCallback(async () => {
        setLoading(true);
        setCoAuthor('');
        try {
            await api.post(
                `/publications/${publicationId}/coauthor`,
                {
                    email: coAuthor
                },
                user?.token
            );

            const response = await api.get(`/publications/${publicationId}`, user?.token);
            updateCoAuthors(response.data.coAuthors);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }, [coAuthor, user, publicationId]);

    const deleteCoAuthor = React.useCallback(
        async (coAuthorId: string) => {
            await api.destroy(`/publications/${publicationId}/coauthor/${coAuthorId}`, user?.token);

            const response = await api.get(`/publications/${publicationId}`, user?.token);
            updateCoAuthors(response.data.coAuthors);
        },
        [user, publicationId]
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Co-authors" />
            </div>
            <div className="flex items-center space-x-4">
                <input
                    className="w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                    autoComplete="off"
                    placeholder="Email of co-author"
                    value={coAuthor}
                    type="email"
                    onChange={(event) => setCoAuthor(event.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter') addCoAuthorToPublication();
                    }}
                />
                <button
                    className="ml-px rounded-full outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    onClick={addCoAuthorToPublication}
                    disabled={!coAuthor}
                >
                    {loading ? (
                        <OutlineIcons.RefreshIcon className="h-8 w-8 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                    ) : (
                        <OutlineIcons.PlusCircleIcon className="h-8 w-8 text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                    )}{' '}
                </button>
            </div>
            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                            <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                    <tr>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 " />

                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Email
                                        </th>
                                        <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                            User
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 "></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                    {coAuthors.map((coAuthor) => (
                                        <Components.PublicationCreationCoAuthorEntry
                                            key={coAuthor.id}
                                            coAuthor={coAuthor}
                                            deleteCoAuthor={deleteCoAuthor}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Framer.motion.div>
        </div>
    );
};

export default CoAuthor;
