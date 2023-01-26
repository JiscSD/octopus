import * as OutlineIcons from '@heroicons/react/outline';
import * as Framer from 'framer-motion';
import React from 'react';

import * as api from '@api';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Helpers from '@helpers';

import cuid from 'cuid';

const CoAuthor: React.FC = (): React.ReactElement => {
    const coAuthors = Stores.usePublicationCreationStore((state) => state.coAuthors);
    const updateCoAuthors = Stores.usePublicationCreationStore((state) => state.updateCoAuthors);

    const publicationId = Stores.usePublicationCreationStore((state) => state.id);
    const user = Stores.useAuthStore((state) => state.user);

    const [loading, setLoading] = React.useState(false);
    const [coAuthor, setCoAuthor] = React.useState('');
    const [emailValidated, setEmailValidated] = React.useState(true);
    const [emailDuplicated, SetEmailDuplicated] = React.useState(true);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmailValidated(true);
        SetEmailDuplicated(true);
        setCoAuthor(event.target.value);
    };

    // Validate email for co author regex to use -
    const addCoAuthorToPublication = React.useCallback(async () => {
        setLoading(true);

        const authorsArray = coAuthors || [];

        // check to ensure co-author email is not already in the store/database
        const emailDuplicate = authorsArray.some((author) => author.email === coAuthor);
        if (emailDuplicate) {
            SetEmailDuplicated(false);
            setLoading(false);
            return;
        }

        const validEmail = Helpers.validateEmail(coAuthor);

        if (!validEmail) {
            setEmailValidated(false);
            setLoading(false);
            return;
        }

        setCoAuthor('');

        const newAuthor = {
            id: cuid(),
            publicationId: publicationId,
            email: coAuthor,
            linkedUser: null,
            approvalRequested: false,
            confirmedCoAuthor: false
        };

        authorsArray.push(newAuthor);
        updateCoAuthors(authorsArray);
        setLoading(false);
    }, [coAuthor, user, publicationId]);

    const deleteCoAuthor = async (coAuthorId: string) => {
        updateCoAuthors(coAuthors.filter((item) => item.id !== coAuthorId));
    };

    const refreshCoAuthors = React.useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get(`/publications/${publicationId}/coauthors`, user?.token);
            updateCoAuthors(response.data);
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
                    Add the email addresses of any co-authors involved in this publication. Note that they will only
                    receive an email asking them to confirm their involvement and preview the publication once you have
                    requested approval from the “Review and Publish” section.
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Please note that in line with the smaller publication types on Octopus, we encourage you to list
                    only those authors that were directly involved in this stage of the research process.
                </span>
            </div>

            <div data-testid="co-author-invite">
                <div className="flex items-center space-x-4">
                    <input
                        data-testid="co-author-email-input"
                        className="w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                        autoComplete="off"
                        placeholder="Email of co-author"
                        value={coAuthor}
                        type="email"
                        onChange={handleEmailChange}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') addCoAuthorToPublication();
                        }}
                    />
                    <Components.Button
                        title="Add Co-author"
                        disabled={!coAuthor}
                        onClick={addCoAuthorToPublication}
                        endIcon={
                            loading ? (
                                <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                            ) : (
                                <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                            )
                        }
                    />
                </div>
                {!emailValidated && (
                    <Components.Alert
                        data-testid="email-error"
                        severity="ERROR"
                        title="Please enter a valid email address"
                        className="mt-3 w-2/3"
                    />
                )}
                {!emailDuplicated && (
                    <Components.Alert
                        data-testid="email-error"
                        severity="ERROR"
                        title="Email already added as an author"
                        className="mt-3 w-2/3"
                    />
                )}
            </div>
            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                            <table
                                data-testid="coauthor-table"
                                className="min-w-full divide-y divide-grey-100 dark:divide-teal-300"
                            >
                                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                    <tr>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Status
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Approval Requested
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Email
                                        </th>
                                        <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                            User
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Delete
                                        </th>
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
                                startIcon={
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
