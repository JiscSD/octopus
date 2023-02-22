import React, { useMemo } from 'react';
import cuid from 'cuid';

import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as OutlineIcons from '@heroicons/react/outline';
import * as FaIcons from 'react-icons/fa';
import * as Components from '@components';
import * as Contexts from '@contexts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as api from '@api';

import { KeyedMutator } from 'swr';

type Props = {
    publication: Interfaces.Publication;
    isPublishing: boolean;
    onPublish: () => void;
    onError: (message: string) => void;
    refreshPublicationData: KeyedMutator<Interfaces.Publication>;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    const { user } = Stores.useAuthStore();
    const [selectedAuthor, setSelectedAuthor] = React.useState<null | Interfaces.CoAuthor>(null);
    const [authorEmailError, setAuthorEmailError] = React.useState('');
    const confirmation = Contexts.useConfirmationModal();
    const authorEmailRef = React.useRef<null | HTMLInputElement>(null);

    const handleCloseModal = React.useCallback(() => {
        setSelectedAuthor(null);
        setAuthorEmailError('');
    }, []);

    const handleAuthorEmailChange = React.useCallback(async () => {
        if (!selectedAuthor) {
            return;
        }

        const email = authorEmailRef.current?.value?.trim().toLowerCase() || '';
        const isValidEmail = Helpers.validateEmail(email);

        if (!isValidEmail) {
            return setAuthorEmailError('Please enter a valid email address');
        }

        if (props.publication.coAuthors.some((author) => author.email.toLowerCase() === email)) {
            return setAuthorEmailError('Email already added as an author');
        }

        // close author email edit modal
        setSelectedAuthor(null);

        setTimeout(async () => {
            // open confirmation modal
            const confirmed = await confirmation(
                "Are you sure you want to change this author's email?",
                <p>
                    A new invitation email will be dispatched to <span className="font-semibold">{email}</span>.
                </p>,
                <FaIcons.FaEdit className="h-8 w-8 text-grey-600" />,
                'Yes, change email',
                'Cancel'
            );

            if (confirmed) {
                const newAuthor = {
                    id: cuid(),
                    email,
                    publicationId: props.publication.id,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                };

                const newAuthorsArray = props.publication.coAuthors.map((author) => {
                    return author.email === selectedAuthor.email ? newAuthor : author;
                });

                try {
                    // update publication authors
                    await api.put(
                        `${Config.endpoints.publications}/${props.publication.id}/coauthor`,
                        newAuthorsArray,
                        Helpers.getJWT()
                    );

                    // request approval again
                    // this will trigger an invitation email for the new author
                    await api.put(
                        `${Config.endpoints.publications}/${props.publication.id}/coauthors/request-approval`,
                        {},
                        Helpers.getJWT()
                    );

                    // get updated publication data
                    await props.refreshPublicationData();

                    // clear out any errors
                    setAuthorEmailError('');
                    props.onError('');
                } catch (error) {
                    props.onError((error as Interfaces.JSONResponseError).response?.data?.message);
                }
            }
        }, 300); // wait for the other modal to close
    }, [confirmation, props, selectedAuthor]);

    const remainingApprovalsCount = useMemo(
        () => props.publication.coAuthors.filter((author) => !author.confirmedCoAuthor).length,
        [props.publication.coAuthors]
    );

    return (
        <div className="children:transition-colors">
            <h4 className="mt-8 text-lg dark:text-white-50">
                Your role on this publication:{' '}
                <span className="font-semibold">
                    {props.publication.createdBy === user?.id ? 'Corresponding author' : 'Author'}
                </span>
            </h4>
            <div className="my-2 overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                <table
                    data-testid="approval-tracker-table"
                    className="min-w-full divide-y divide-grey-100 dark:divide-teal-300"
                >
                    <thead className="bg-grey-50 duration-500 dark:bg-grey-700">
                        <tr>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50">
                                Author
                            </th>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                Status
                            </th>
                            {user?.id === props.publication.createdBy && (
                                <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                    Edit
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {props.publication.coAuthors.map((author) => (
                            <tr key={author.id}>
                                <td className="whitespace-nowrap py-4 px-6 text-sm text-grey-900 duration-500 dark:text-white-50">
                                    {author.linkedUser ? (
                                        <>
                                            <Components.Link
                                                href={`/authors/${author.linkedUser}`}
                                                className="rounded border-transparent underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-white-50"
                                            >
                                                {author.user?.firstName} {author.user?.lastName}
                                            </Components.Link>{' '}
                                            {author.linkedUser === user?.id && <span className="text-xs">(You)</span>}
                                        </>
                                    ) : (
                                        <>Unconfirmed Author</>
                                    )}
                                    {user?.id === props.publication.createdBy && (
                                        <p className="mt-1 text-xs">{author.email}</p>
                                    )}
                                </td>
                                <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                    {author.linkedUser === props.publication.createdBy ? (
                                        <>Corresponding author</>
                                    ) : author.confirmedCoAuthor ? (
                                        <span className="text-green-500 dark:text-green-300">Approved</span>
                                    ) : author.linkedUser ? (
                                        <>Approval Pending</>
                                    ) : (
                                        <>Unconfirmed</>
                                    )}
                                </td>
                                {user?.id === props.publication.createdBy && (
                                    <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                        {!author.linkedUser && (
                                            <Components.IconButton
                                                className="p-2"
                                                title="Edit"
                                                icon={
                                                    <FaIcons.FaEdit
                                                        className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                        aria-hidden="true"
                                                    />
                                                }
                                                onClick={() => setSelectedAuthor(author)}
                                            />
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    {user?.id === props.publication.createdBy && (
                        <tfoot className="bg-grey-50 duration-500 dark:bg-grey-700">
                            <tr>
                                <td
                                    colSpan={3}
                                    className="whitespace-nowrap py-4 px-6 text-sm text-grey-900 duration-500 dark:text-white-50"
                                >
                                    {remainingApprovalsCount > 0 ? (
                                        <div className="text-center">
                                            <h4 className="text-lg dark:text-white-50">
                                                <span className="font-semibold">{remainingApprovalsCount}</span> more
                                                author {remainingApprovalsCount === 1 ? 'approval is' : 'approvals are'}{' '}
                                                required before publishing
                                            </h4>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <OutlineIcons.BadgeCheckIcon className="w-6 text-green-500 duration-500 dark:text-green-300" />
                                                <h4 className="text-lg dark:text-white-50">
                                                    All authors have <span className="font-semibold">approved</span>{' '}
                                                    this publication
                                                </h4>
                                            </div>
                                            <Components.Button
                                                disabled={props.isPublishing}
                                                className="inline-flex items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                                                endIcon={<OutlineIcons.CloudUploadIcon className="w-5 text-white-50" />}
                                                title="Publish"
                                                onClick={props.onPublish}
                                            >
                                                Publish
                                            </Components.Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
            {user?.id === props.publication.createdBy && (
                <Components.Modal
                    open={Boolean(selectedAuthor)}
                    icon={<FaIcons.FaEdit className="h-8 w-8 text-grey-600" />}
                    setOpen={handleCloseModal}
                    positiveActionCallback={handleAuthorEmailChange}
                    negativeActionCallback={handleCloseModal}
                    positiveButtonText="Change Email"
                    cancelButtonText="Cancel"
                    title="Change author's email"
                >
                    <input
                        autoComplete="off"
                        className="my-4 w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow outline-none focus:ring-2 focus:ring-yellow-400"
                        defaultValue={selectedAuthor?.email}
                        name="authorEmail"
                        placeholder="Email of author"
                        ref={authorEmailRef}
                    />
                    {authorEmailError && <Components.Alert severity="ERROR" title={authorEmailError} />}
                </Components.Modal>
            )}
        </div>
    );
};

export default ApprovalsTracker;
