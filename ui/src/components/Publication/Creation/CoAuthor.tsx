import * as OutlineIcons from '@heroicons/react/outline';
import * as Framer from 'framer-motion';
import React from 'react';

import * as api from '@api';
import * as Components from '@components';
import * as Stores from '@stores';

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

    const refreshCoAuthors = React.useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get(`/publications/${publicationId}`, user?.token);
            updateCoAuthors(response.data.coAuthors);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    }, [user, publicationId]);

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Co-authors" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Add the email addresses of any co-authors involved in this publication. Note that they will
                    immediately receive an email asking them to confirm their involvement and preview the publication.{' '}
                    <span className="font-bold">
                        Only add their emails when you are ready for the draft to be viewed.
                    </span>
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Please note that in line with the smaller publication types on Octopus, we encourage you to list
                    only those authors that were directly involved in this stage of the research process.
                </span>
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
                <Components.Button
                    title="Send co-author invite"
                    disabled={!coAuthor}
                    onClick={addCoAuthorToPublication}
                    iconPosition="RIGHT"
                    icon={
                        loading ? (
                            <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                        ) : (
                            <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        )
                    }
                />
            </div>
            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
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
                        <div className="flex min-w-full justify-end">
                            <Components.Button
                                title="Refresh"
                                onClick={refreshCoAuthors}
                                iconPosition="LEFT"
                                icon={
                                    <OutlineIcons.RefreshIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                }
                                textSize="sm"
                                className="py-2 px-1"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            </Framer.motion.div>

            {!coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor) && (
                <Components.Alert
                    severity="INFO"
                    title="All co-authors must be verified before making a publication live."
                    className="w-fit"
                />
            )}
        </div>
    );
};

export default CoAuthor;
