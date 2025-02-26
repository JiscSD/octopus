import React from 'react';
import Image from 'next/image';
import * as SWR from 'swr';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Stores from '@/stores';
import * as Config from '@/config';
import * as Assets from '@/assets';
import * as Types from '@/types';
import * as api from '@/api';

import axios from 'axios';

type ActionProps = {
    publicationVersion: Interfaces.PublicationVersion;
};

const Actions: React.FC<ActionProps> = (props): React.ReactElement => {
    const SWRConfig = SWR.useSWRConfig();
    // Store
    const user = Stores.useAuthStore((state) => state.user);
    const setToast = Stores.useToastStore((state) => state.setToast);

    // Modals
    const [showRedFlagModal, setShowRedFlagModal] = React.useState(false);

    // State
    const [redFlagReason, setRedFlagReason] = React.useState<Types.RedFlagTypes>('PLAGIARISM');
    const [redFlagComment, setRedFlagComment] = React.useState('');

    // Misc state
    const [error, setError] = React.useState<string | undefined>();
    const [submitting, setSubmitting] = React.useState(false);

    const authorIds = props.publicationVersion.coAuthors.flatMap((coAuthor) =>
        coAuthor.linkedUser ? [coAuthor.linkedUser] : []
    );

    const saveRedFlag = async () => {
        setError(undefined);
        setSubmitting(true);
        try {
            if (redFlagComment.length) {
                const createFlagEndpoint = `${Config.endpoints.publications}/${props.publicationVersion.publication.id}/flags`;
                await api.post(
                    createFlagEndpoint,
                    {
                        category: redFlagReason,
                        comment: redFlagComment
                    },
                    user?.token
                );

                // Close the modal
                setShowRedFlagModal(false);

                // Mount a new toast for successful response
                setToast({
                    visible: true,
                    dismiss: true,
                    title: 'Red flag saved',
                    icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                    message: 'Your red flag has now been saved.'
                });

                // refetch publication flags
                await SWRConfig.mutate(createFlagEndpoint);
            } else {
                setError('You must provide a comment for this red flag.');
            }
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setError(
                axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : message
            );
        }
        setSubmitting(false);
    };

    // Adds a small delay so the error just instantly jump off the screen
    React.useEffect(() => {
        if (!showRedFlagModal) {
            setTimeout(() => {
                setError(undefined);
                setRedFlagComment('');
            }, 500);
        }
    }, [showRedFlagModal]);

    const onCloseRedFlagModal = () => {
        setShowRedFlagModal(false);
    };

    return (
        <>
            <Components.Modal
                open={showRedFlagModal}
                onClose={onCloseRedFlagModal}
                positiveCallback={saveRedFlag}
                loading={submitting}
                positiveButtonText="Submit"
                cancelButtonText="Cancel"
                title="Red flag publication"
            >
                <>
                    <p className="mb-8 mt-4 text-left text-xs text-grey-700">
                        Flag any potential research integrity issues with this publication.
                        <br className="hidden xl:block" />
                        The author(s) will receive a notification of this flag, and will have the opportunity to respond
                        to your comment. You can mark the flag as resolved if your concern is addressed.
                        <br className="hidden xl:block" />
                        Note that the flag, and your comments, will be visible on the publication page and your public
                        user profile.
                    </p>
                    <div className="mb-20">
                        {!!error && <Components.Alert severity="ERROR" title={error} className="my-4 text-left" />}
                        <div className="space-y-8">
                            <label htmlFor="red-flag-reason" className="block">
                                <span className="mb-2 block text-left text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                    Reason for flagging this publication? <Components.RequiredIndicator />
                                </span>
                                <select
                                    name="red-flag-reason"
                                    id="red-flag-reason"
                                    className="mb-4 block w-fit rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400 lg:mb-0"
                                    onChange={(e) => setRedFlagReason(e.target.value as Types.RedFlagTypes)}
                                    required
                                >
                                    {Object.values(Config.values.octopusInformation.redFlagReasons).map(
                                        (flagReason) => (
                                            <option key={flagReason.value} value={flagReason.value}>
                                                {flagReason.nicename}
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>
                            <label htmlFor="red-flag-comment" className="block">
                                <span className="mb-2 block text-left text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                    Please provide a comment about this flag. <Components.RequiredIndicator />
                                </span>
                                <Components.FlagNewComment
                                    value={redFlagComment}
                                    placeholder="Detail your reasons for flagging this issue:"
                                    onChange={(value) => setRedFlagComment(value)}
                                />
                            </label>
                        </div>
                    </div>
                </>
            </Components.Modal>

            {props.publicationVersion.currentStatus === 'LIVE' && (
                <>
                    <Components.SectionBreak name="Actions" />
                    {/** Download options */}
                    <div className="flex">
                        <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-50">
                            Download:
                        </span>
                        <button
                            aria-label="Download PDF"
                            onClick={() => {
                                window.open(
                                    `${Config.endpoints.publications}/${props.publicationVersion.versionOf}/pdf?redirectToPreview=true`,
                                    '_blank'
                                );
                            }}
                            className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                        >
                            <Image src="/images/pdf.svg" alt="PDF Icon" width={18} height={18} />
                            <span className="ml-1">pdf</span>
                        </button>
                        <button
                            aria-label="Download JSON"
                            onClick={() =>
                                Helpers.blobFileDownload(
                                    `${Config.endpoints.publications}/${props.publicationVersion.versionOf}`,
                                    `${props.publicationVersion.versionOf}.json`
                                )
                            }
                            className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                        >
                            <Image src="/images/json.svg" alt="PDF Icon" width={18} height={18} />
                            <span className="ml-1">json</span>
                        </button>
                    </div>
                    {props.publicationVersion.isLatestLiveVersion ? (
                        user && !user.email ? (
                            <>
                                <Components.Link
                                    href={`${Config.urls.verify.path}?state=${encodeURIComponent(
                                        `${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`
                                    )}`}
                                    className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                >
                                    Verify your email for more actions
                                </Components.Link>
                            </>
                        ) : user && !(user.firstName || user.lastName) ? (
                            <Components.Link
                                href={Config.urls.orcidAccountPage.path}
                                className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                openNew={true}
                            >
                                Make your name visible on your ORCiD profile for more actions
                            </Components.Link>
                        ) : user && user.email ? (
                            !authorIds.includes(user.id) && (
                                <Components.PublicationSidebarCardActionsButton
                                    label="Flag a concern with this publication"
                                    onClick={() => setShowRedFlagModal(true)}
                                />
                            )
                        ) : (
                            <>
                                <Components.Link
                                    href={`${Config.urls.orcidLogin.path}&state=${encodeURIComponent(
                                        `${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`
                                    )}`}
                                    className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                >
                                    <Assets.ORCID
                                        width={25}
                                        height={25}
                                        className="mr-2 rounded-md bg-orcid fill-white-50 p-1"
                                    />
                                    <span> Sign in for more actions</span>
                                </Components.Link>
                            </>
                        )
                    ) : (
                        <p className="pt-5 text-center text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-50">
                            Actions are not available on older publication versions
                        </p>
                    )}
                </>
            )}
        </>
    );
};

export default Actions;
