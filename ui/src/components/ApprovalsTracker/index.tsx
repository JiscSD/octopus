import React, { useMemo } from 'react';
import axios from 'axios';

import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io5';
import * as Components from '@/components';
import * as Contexts from '@/contexts';
import * as Helpers from '@/helpers';
import * as Config from '@/config';
import * as api from '@/api';

import { KeyedMutator } from 'swr';
import { createId } from '@paralleldrive/cuid2';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    isPublishing: boolean;
    onPublish: () => void;
    onError: (message: string) => void;
    onEditAffiliations: () => void;
    refreshPublicationVersionData: KeyedMutator<Interfaces.PublicationVersion>;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    const { user } = Stores.useAuthStore();
    const [selectedAuthorEmail, setSelectedAuthorEmail] = React.useState<string | null>(null);
    const [selectedAuthorAffiliations, setSelectedAuthorAffiliations] = React.useState<null | Interfaces.CoAuthor>(
        null
    );
    const [authorEmailError, setAuthorEmailError] = React.useState('');
    const [isSendingReminder, setSendingReminder] = React.useState(false);

    const confirmation = Contexts.useConfirmationModal();
    const authorEmailRef = React.useRef<null | HTMLInputElement>(null);

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

        if (props.publicationVersion.coAuthors.some((author) => author.email.toLowerCase() === email)) {
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
                    id: createId(),
                    email,
                    publicationId: props.publicationVersion.publication.id,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                };

                const newAuthorsArray = props.publicationVersion.coAuthors.map((author) =>
                    author.email === selectedAuthorEmail ? newAuthor : author
                );

                try {
                    // update publication authors
                    await api.put(
                        `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors`,
                        newAuthorsArray,
                        Helpers.getJWT()
                    );

                    // request approval again
                    // this will trigger an invitation email for the new author
                    await api.put(
                        `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors/request-approval`,
                        {},
                        Helpers.getJWT()
                    );

                    // get updated publication data
                    await props.refreshPublicationVersionData();

                    // clear out any errors
                    setAuthorEmailError('');
                    props.onError('');
                } catch (error) {
                    props.onError(axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message);
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
                    `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors/${author.id}/approval-reminder`,
                    {},
                    Helpers.getJWT()
                );
                await props.refreshPublicationVersionData();
            } catch (error) {
                props.onError(axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message);
            }
            setSendingReminder(false);
        }
    };

    const remainingApprovalsCount = useMemo(
        () => props.publicationVersion.coAuthors.filter((author) => !author.confirmedCoAuthor).length,
        [props.publicationVersion.coAuthors]
    );

    const isCorrespondingUser = useMemo(
        () => props.publicationVersion.createdBy === user?.id,
        [props.publicationVersion.createdBy, user?.id]
    );

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
                            <th className="whitespace-pre px-6 py-3.5  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50">
                                Author
                            </th>
                            <th className="whitespace-pre px-6 py-3.5  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                Status
                            </th>
                            {isCorrespondingUser && (
                                <>
                                    <th className="whitespace-pre px-6 py-3.5  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                        Edit email
                                    </th>
                                    <th className="whitespace-pre px-6 py-3.5  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                        Send Reminder
                                    </th>
                                </>
                            )}
                            <th className="whitespace-pre px-6 py-3.5  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                Affiliations
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {props.publicationVersion.coAuthors.map((author) => {
                            const affiliations = Helpers.getSortedAffiliations(author.affiliations).map(
                                (affiliation) => affiliation.organization.name
                            );

                            return (
                                <tr key={author.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-grey-900 duration-500 dark:text-white-50">
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
                                    <td className="whitespace-nowrap px-6 py-4  text-sm text-grey-900 duration-500 dark:text-white-50">
                                        {isCorrespondingUser && !author.linkedUser && author.reminderDate ? (
                                            <>
                                                Reminder sent at{' '}
                                                <time suppressHydrationWarning>
                                                    {Helpers.formatDateTime(author.reminderDate, 'short')}
                                                </time>
                                            </>
                                        ) : author.linkedUser === props.publicationVersion.createdBy ? (
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
                                            <td className="whitespace-nowrap px-6 py-4  text-sm text-grey-900 duration-500 dark:text-white-50">
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
                                                        onClick={() => setSelectedAuthorEmail(author.email)}
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4  text-sm text-grey-900 duration-500 dark:text-white-50">
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
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-grey-900 duration-500 dark:text-white-50">
                                        <div className="flex cursor-default items-center gap-4">
                                            {author.isIndependent ? (
                                                <p>Unaffiliated</p>
                                            ) : !author.isIndependent && !affiliations.length ? (
                                                <p>Affiliations not entered</p>
                                            ) : (
                                                <div title={affiliations.join(', ')}>
                                                    {affiliations.length > 3
                                                        ? affiliations
                                                              .slice(0, 2)
                                                              .concat(`+${affiliations.length - 2} more`)
                                                              .map((affiliationName, index) => (
                                                                  <p key={`affiliation-${index}`}>
                                                                      {affiliationName}
                                                                      {index < 2 ? ',' : ''}
                                                                  </p>
                                                              ))
                                                        : affiliations.map((affiliationName, index) => (
                                                              <p key={`affiliation-${index}`}>
                                                                  {affiliationName}
                                                                  {index < affiliations.length - 1
                                                                      ? ','
                                                                      : index > 0
                                                                        ? '.'
                                                                        : ''}
                                                              </p>
                                                          ))}
                                                </div>
                                            )}
                                            {(isCorrespondingUser || !author.confirmedCoAuthor) &&
                                            author.linkedUser === user?.id ? (
                                                <Components.IconButton
                                                    className="p-2"
                                                    title={
                                                        !(author.isIndependent || author.affiliations.length)
                                                            ? 'Select your affiliations'
                                                            : 'Edit your affiliations'
                                                    }
                                                    icon={
                                                        <FaIcons.FaEdit
                                                            className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                    onClick={props.onEditAffiliations}
                                                />
                                            ) : (
                                                !author.isIndependent &&
                                                author.affiliations.length > 0 && (
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
                                                )
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
                <div className="rounded-b-lg bg-grey-50 px-6 py-4 text-left text-sm text-grey-900 dark:bg-grey-700 dark:text-white-50 sm:text-center">
                    {remainingApprovalsCount > 0 ? (
                        <h4 className="text-lg dark:text-white-50">
                            <span className="font-semibold">{remainingApprovalsCount}</span> more author{' '}
                            {remainingApprovalsCount === 1 ? 'approval is' : 'approvals are'} required before publishing
                        </h4>
                    ) : (
                        <div className="flex items-center gap-4 sm:justify-center">
                            <OutlineIcons.CheckBadgeIcon className="w-6 flex-shrink-0 text-green-500 dark:text-green-300" />
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
                    onClose={handleCloseChangeEmailModal}
                    positiveActionCallback={handleAuthorEmailChange}
                    negativeActionCallback={handleCloseChangeEmailModal}
                    positiveButtonText="Change Email"
                    cancelButtonText="Cancel"
                    title="Change author's email"
                >
                    <input
                        autoComplete="off"
                        className="my-4 w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow outline-none focus:ring-2 focus:ring-yellow-400"
                        defaultValue={selectedAuthorEmail || ''}
                        name="authorEmail"
                        placeholder="Email of author"
                        ref={authorEmailRef}
                    />
                    {authorEmailError && <Components.Alert severity="ERROR" title={authorEmailError} />}
                </Components.Modal>
            )}
            <Components.Modal
                open={Boolean(selectedAuthorAffiliations)}
                onClose={() => setSelectedAuthorAffiliations(null)}
                cancelButtonText="Close"
                title={`${selectedAuthorAffiliations?.user?.firstName} ${selectedAuthorAffiliations?.user?.lastName}'s affiliation(s) for this publication`}
                subtitle="Selected Affiliations"
            >
                <ul>
                    {selectedAuthorAffiliations?.affiliations.map((affiliation) => (
                        <li className="my-6" key={affiliation.id}>
                            <Components.AffiliationCard
                                affiliation={affiliation}
                                bordered={true}
                                disableSelection={true}
                            />
                        </li>
                    ))}
                </ul>
            </Components.Modal>
        </div>
    );
};

export default ApprovalsTracker;
