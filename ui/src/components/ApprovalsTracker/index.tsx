import React, { useMemo, useState } from 'react';
import cuid from 'cuid';

import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as OutlineIcons from '@heroicons/react/outline';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io5';
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
    // const [authorEmail, setAuthorEmail] = React.useState<null | string>(null);
    const [selectedAuthorEmail, setSelectedAuthorEmail] = React.useState<null | Interfaces.CoAuthor>(null);
    const [selectedAuthorAffiliations, setSelectedAuthorAffiliations] = React.useState<null | Interfaces.CoAuthor>(
        null
    );
    const [authorEmailError, setAuthorEmailError] = React.useState('');
    const [isSendingReminder, setSendingReminder] = React.useState(false);
    const [isEditingAffiliations, setIsEditingAffiliations] = React.useState(false);
    const confirmation = Contexts.useConfirmationModal();
    const authorEmailRef = React.useRef<null | HTMLInputElement>(null);

    const handleCloseEditAffiliationsModal = React.useCallback(
        (revalidate?: boolean) => {
            if (revalidate) {
                props.refreshPublicationData();
            }
            setIsEditingAffiliations(false);
        },
        [props]
    );

    const handleCloseChangeEmailModal = React.useCallback(() => {
        setSelectedAuthorEmail(null);
        setAuthorEmailError('');
    }, []);

    const handleAuthorEmailChange = React.useCallback(async () => {
        if (!selectedAuthorEmail) {
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
        setSelectedAuthorEmail(null);

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

                const newAuthorsArray = props.publication.coAuthors.map((author) =>
                    author.email === selectedAuthorEmail.email ? newAuthor : author
                );

                try {
                    // update publication authors
                    await api.put(
                        `${Config.endpoints.publications}/${props.publication.id}/coauthors`,
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
    }, [confirmation, props, selectedAuthorEmail]);

    const handleApprovalReminder = async (author: Interfaces.CoAuthor) => {
        const confirmed = await confirmation(
            'Re-Send author invite',
            <p>
                Are you sure you want to re-send the invitation email to{' '}
                <span className="font-semibold">{author.email}</span>?
            </p>,
            <IoIcons.IoReload className="h-8 w-8 text-grey-600" aria-hidden="true" />,
            'Confirm'
        );

        if (confirmed) {
            props.onError(''); // clear shown error if any
            setSendingReminder(true);
            try {
                await api.post(
                    `${Config.endpoints.publications}/${props.publication.id}/coauthors/${author.id}/approval-reminder`,
                    {},
                    Helpers.getJWT()
                );
                await props.refreshPublicationData();
            } catch (error) {
                props.onError((error as Interfaces.JSONResponseError).response?.data?.message);
            }
            setSendingReminder(false);
        }
    };

    const remainingApprovalsCount = useMemo(
        () => props.publication.coAuthors.filter((author) => !author.confirmedCoAuthor).length,
        [props.publication.coAuthors]
    );

    const isCorrespondingUser = useMemo(
        () => props.publication.createdBy === user?.id,
        [props.publication.createdBy, user?.id]
    );

    const author = useMemo(
        () => props.publication.coAuthors.find((author) => author.linkedUser === user?.id),
        [props.publication.coAuthors, user?.id]
    );

    const displayArrayOfAffiliations = (affiliations: Interfaces.MappedOrcidAffiliation[]) => {
        const sortedAffiliations = Helpers.getSortedAffiliations(affiliations);

        if (sortedAffiliations.length <= 2) {
            const names = sortedAffiliations.map((affiliation) => affiliation.organization.name);
            return names.join(', ');
        } else {
            const firstTwo = sortedAffiliations
                .map((affiliation) => affiliation.organization.name)
                .slice(0, 2)
                .join(', ');
            return firstTwo + ', + ' + (sortedAffiliations.length - 2) + ' more';
        }
    };

    return (
        <div className="children:transition-colors">
            <h4 className="mt-8 text-lg dark:text-white-50">
                Your role on this publication:{' '}
                <span className="font-semibold">{isCorrespondingUser ? 'Corresponding author' : 'Author'}</span>
            </h4>
            <div
                className={`sm:scrollbar mt-2 overflow-x-auto sm:dark:bg-grey-500 ${
                    isCorrespondingUser ? 'rounded-t-lg' : 'rounded-lg'
                } shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent`}
            >
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
                            {isCorrespondingUser && (
                                <>
                                    <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                        Edit email
                                    </th>
                                    <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                        Send Reminder
                                    </th>
                                </>
                            )}
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                Affiliations
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {props.publication.coAuthors.map((author) => {
                            const affiliations = Helpers.getSortedAffiliations(author.affiliations).map(
                                (affiliation) => affiliation.organization.name
                            );

                            return (
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
                                                {author.linkedUser === user?.id && (
                                                    <span className="text-xs">(You)</span>
                                                )}
                                            </>
                                        ) : (
                                            <>Unconfirmed Author</>
                                        )}
                                        {isCorrespondingUser && <p className="mt-1 text-xs">{author.email}</p>}
                                    </td>
                                    <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                        {isCorrespondingUser && !author.linkedUser && author.reminderDate ? (
                                            <>Reminder sent at {Helpers.formatDateTime(author.reminderDate, 'short')}</>
                                        ) : author.linkedUser === props.publication.createdBy ? (
                                            <>Corresponding author</>
                                        ) : author.confirmedCoAuthor ? (
                                            <span className="text-green-500 dark:text-green-300">Approved</span>
                                        ) : author.linkedUser ? (
                                            <>Approval Pending</>
                                        ) : (
                                            <>Unconfirmed</>
                                        )}
                                    </td>
                                    {isCorrespondingUser && (
                                        <>
                                            <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                                {!author.linkedUser && (
                                                    <Components.IconButton
                                                        className="p-2"
                                                        title={`Edit email for ${author.email}`}
                                                        icon={
                                                            <FaIcons.FaEdit
                                                                className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                                aria-hidden="true"
                                                            />
                                                        }
                                                        onClick={() => setSelectedAuthorEmail(author)}
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                                {!author.linkedUser && !author.reminderDate && (
                                                    <Components.IconButton
                                                        className="p-2"
                                                        disabled={isSendingReminder}
                                                        title={`Resend email to ${author.email}`}
                                                        icon={
                                                            <IoIcons.IoReload
                                                                className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                                aria-hidden="true"
                                                            />
                                                        }
                                                        onClick={() => handleApprovalReminder(author)}
                                                    />
                                                )}
                                            </td>
                                        </>
                                    )}
                                    <td className="whitespace-nowrap py-4 px-6 text-sm text-grey-900 duration-500 dark:text-white-50">
                                        <div className="flex cursor-default items-center gap-4">
                                            {author.isIndependent ? (
                                                <p>Unaffiliated</p>
                                            ) : !author.isIndependent && !affiliations.length ? (
                                                <p>Affiliations not entered</p>
                                            ) : (
                                                displayArrayOfAffiliations(author.affiliations)
                                            )}
                                            {author.linkedUser === user?.id ? (
                                                <Components.IconButton
                                                    className="p-2"
                                                    title="Edit affiliations"
                                                    icon={
                                                        <FaIcons.FaEdit
                                                            className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                    onClick={() => setIsEditingAffiliations(true)}
                                                />
                                            ) : (
                                                !author.isIndependent ||
                                                (author.affiliations.length > 0 && (
                                                    <Components.IconButton
                                                        className="p-2"
                                                        title="Display all affiliations"
                                                        icon={
                                                            <FaIcons.FaRegEye
                                                                className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                                aria-hidden="true"
                                                            />
                                                        }
                                                        onClick={() => setSelectedAuthorAffiliations(author)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {isCorrespondingUser && (
                <div className="rounded-b-lg bg-grey-50 py-4 px-6 text-left text-sm text-grey-900 dark:bg-grey-700 dark:text-white-50 sm:text-center">
                    {remainingApprovalsCount > 0 ? (
                        <h4 className="text-lg dark:text-white-50">
                            <span className="font-semibold">{remainingApprovalsCount}</span> more author{' '}
                            {remainingApprovalsCount === 1 ? 'approval is' : 'approvals are'} required before publishing
                        </h4>
                    ) : (
                        <div className="flex items-center gap-4 sm:justify-center">
                            <OutlineIcons.BadgeCheckIcon className="w-6 flex-shrink-0 text-green-500 dark:text-green-300" />
                            <h4 className="text-lg dark:text-white-50">
                                All authors have <span className="font-semibold">approved</span> this publication
                            </h4>
                        </div>
                    )}
                </div>
            )}
            {isCorrespondingUser && (
                <Components.Modal
                    open={Boolean(selectedAuthorEmail)}
                    icon={<FaIcons.FaEdit className="h-8 w-8 text-grey-600" />}
                    setOpen={handleCloseChangeEmailModal}
                    positiveActionCallback={handleAuthorEmailChange}
                    negativeActionCallback={handleCloseChangeEmailModal}
                    positiveButtonText="Change Email"
                    cancelButtonText="Cancel"
                    title="Change author's email"
                >
                    <input
                        autoComplete="off"
                        className="my-4 w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow outline-none focus:ring-2 focus:ring-yellow-400"
                        defaultValue={selectedAuthorEmail?.email}
                        name="authorEmail"
                        placeholder="Email of author"
                        ref={authorEmailRef}
                    />
                    {authorEmailError && <Components.Alert severity="ERROR" title={authorEmailError} />}
                </Components.Modal>
            )}
            {author && (
                <Components.EditAffiliationsModal
                    open={isEditingAffiliations}
                    author={author}
                    onClose={handleCloseEditAffiliationsModal}
                />
            )}
            <Components.SimpleModal
                open={Boolean(selectedAuthorAffiliations)}
                negativeActionCallback={() => setSelectedAuthorAffiliations(null)}
                cancelButtonText="Close"
                title={`${selectedAuthorAffiliations?.user?.firstName} ${selectedAuthorAffiliations?.user?.lastName}'s affiliation(s) for this publication`}
                subTitle="Selected Affiliations"
            >
                <ul>
                    {selectedAuthorAffiliations?.affiliations.map((affiliation) => (
                        <li className="my-6" key={affiliation.id}>
                            <Components.AffiliationCard affiliation={affiliation} disableSelection={true} />
                        </li>
                    ))}
                </ul>
            </Components.SimpleModal>
        </div>
    );
};

export default ApprovalsTracker;
