import React from 'react';
import * as Next from 'next';
import Head from 'next/head';
import useSWR from 'swr';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as Router from 'next/router';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let error: string | null = null;
    let flag: Interfaces.FlagWithComments | null = null;
    let publicationVersion: Interfaces.PublicationVersion | null = null;
    let isResolvable = false;
    let isCommentable = false;
    const token = Helpers.getJWT(context);
    const decodedToken = token ? await Helpers.getDecodedUserToken(token) : null;
    const flagUrl = `${Config.endpoints.flag}/${context.query.flagId}`;

    try {
        const flagResponse = await api.get(flagUrl, token);
        flag = flagResponse.data;

        const response = await api.get(
            `${Config.endpoints.publications}/${flag?.publicationId}/versions/latest`,
            token
        );
        publicationVersion = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!flag || !publicationVersion) {
        return {
            notFound: true
        };
    }

    if (decodedToken) {
        // Only the flag creator & publisher can comment
        if (decodedToken.id === flag.user.id || decodedToken.id === publicationVersion.user.id) isCommentable = true;
        // Only resolvable if the user is the flag creator
        if (decodedToken.id === flag.user.id && !flag.resolved) isResolvable = true;
    }

    return {
        props: {
            flagId: context.query.flagId,
            publicationVersion,
            error,
            isCommentable,
            isResolvable,
            flagUrl,
            fallback: {
                [flagUrl]: flag
            }
        }
    };
};

type Props = {
    flagId: string;
    publicationVersion: Interfaces.PublicationVersion;
    error: string | null;
    isCommentable: boolean;
    isResolvable: boolean;
    flagUrl: string;
    fallback: {
        data: Interfaces.FlagWithComments;
    };
};

const FlagThread: Next.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const { data, isValidating, error, mutate } = useSWR<Interfaces.FlagWithComments>(props.flagUrl, {
        fallback: props.fallback
    });

    const user = Stores.useAuthStore((state) => state.user);
    const setToast = Stores.useToastStore((state) => state.setToast);

    const [comment, setComment] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [showResolveModal, setShowResolveModal] = React.useState(false);

    const submitComment = async () => {
        setSubmitError(null);
        setSubmitting(true);

        if (comment.length) {
            try {
                // Post off the comment to the thread
                await api.post(
                    `${Config.endpoints.flag}/${props.flagId}/comment`,
                    {
                        comment
                    },
                    user?.token
                );

                // Reset the comment
                setComment('');

                // Inform swr this endpoint has had a mutation, so revalidate
                mutate();

                // Provide a user feedback toast
                setToast({
                    visible: true,
                    dismiss: true,
                    title: 'Comment saved',
                    icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                    message: 'Your comment has now been saved.'
                });
            } catch (err) {
                const { message } = err as Interfaces.JSONResponseError;
                setSubmitError(message);
            }
        } else {
            setSubmitError('You must provide a comment');
        }

        setSubmitting(false);
    };

    const resolve = async () => {
        setSubmitError(null);
        setSubmitting(true);

        try {
            // Post off to the resolve endpoint
            await api.post(`${Config.endpoints.flag}/${props.flagId}/resolve`, {}, user?.token);

            // Inform swr this endpoint has had a mutation, so revalidate
            mutate();

            // Close the modal
            setShowResolveModal(false);

            // Take the user to the publication in question
            router.push(`${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`);

            // Provide a user feedback toast
            setToast({
                visible: true,
                dismiss: true,
                title: 'Red flag resolved',
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: 'This red flag has now been resolved.'
            });
        } catch (err) {}

        setSubmitting(false);
    };

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.viewFlagThread.description} />
                <link
                    rel="canonical"
                    href={`${Config.urls.viewFlagThread.canonical}/${props.publicationVersion.versionOf}/flag/${props.flagId}`}
                />
                <title>{`Red flag comment thread - ${props.publicationVersion.title}`}</title>
            </Head>

            <Layouts.Standard fixedHeader={false}>
                {!!error && (
                    <>
                        <section className="container mx-auto px-8">
                            <p>There was a problem loading this comment thread.</p>
                        </section>
                    </>
                )}
                {!!data && (
                    <>
                        {props.isResolvable && (
                            <Components.Modal
                                open={showResolveModal}
                                setOpen={setShowResolveModal}
                                title="Are you sure you want to resolve this red flag?"
                                disableButtons={submitting}
                                positiveButtonText="Resolve"
                                positiveActionCallback={resolve}
                                cancelButtonText="Cancel"
                            >
                                <p className="mb-8 mt-4 text-xs text-grey-700">
                                    The flag will be marked as resolved across the site, and you will no longer be able
                                    to comment on this thread. Users can still view the flag and its comment history
                                    from the publication page.
                                </p>
                            </Components.Modal>
                        )}
                        <section className="container mx-auto px-8 pt-10 lg:gap-4 lg:pb-10 lg:pt-20 xl:px-44">
                            <div className="mb-4 grid grid-cols-12 items-start">
                                {data.resolved ? (
                                    <OutlineIcons.FlagIcon className="col-span-1 hidden h-14 w-14 text-red-500 lg:block" />
                                ) : (
                                    <SolidIcons.FlagIcon className="col-span-1 hidden h-14 w-14 text-red-500 lg:block" />
                                )}
                                <div className="col-span-11 space-y-2">
                                    <Components.PageTitle
                                        text={`${
                                            Config.values.octopusInformation.redFlagReasons[data.category].nicename
                                        }${data.resolved ? ' - (Resolved)' : ''}`}
                                        className="!mb-0"
                                    />
                                    <h2>
                                        <Components.Link
                                            href={`${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`}
                                            className="text-teal-500 underline"
                                        >
                                            <>Publication: {props.publicationVersion.title}</>
                                        </Components.Link>
                                    </h2>

                                    <p className="text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                        This publication was red flagged on{' '}
                                        <span className="italic">{Helpers.formatDate(data.createdAt)}</span>, by{' '}
                                        <Components.Link
                                            href={`${Config.urls.viewUser.path}/${data.user.id}`}
                                            className="text-teal-500 underline"
                                        >
                                            <>
                                                {data.user.firstName} {data.user.lastName}
                                            </>
                                        </Components.Link>
                                    </p>

                                    <p className="text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                        All comments on this thread are public.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {!!data.flagComments.length && (
                            <section
                                className={`container mx-auto px-8 lg:space-y-6 xl:px-44 ${
                                    data.resolved ? 'opacity-75' : ''
                                }`}
                            >
                                {data.flagComments.map((flagComment) => (
                                    <Components.FlagComment key={flagComment.id} flagComment={flagComment} />
                                ))}
                            </section>
                        )}

                        {!!user && props.isCommentable && !data.resolved && (
                            <section className="container mx-auto mt-12 px-8 xl:px-44">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-12 mb-2 lg:col-span-2 lg:mb-0">
                                        <Components.Avatar user={user} className="hidden lg:flex" />
                                        <span className="text-xs text-grey-500 transition-colors duration-500 dark:text-white-100">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </div>
                                    <div className="col-span-12 lg:col-span-10">
                                        {!!submitError && (
                                            <Components.Alert title={submitError} severity="WARNING" className="mb-4" />
                                        )}
                                        <div className={submitting ? 'cursor-not-allowed select-none opacity-50' : ''}>
                                            <Components.FlagNewComment
                                                value={comment}
                                                onChange={(value) => setComment(value)}
                                            />
                                            <div className="ml-auto mt-2 flex w-fit space-x-4">
                                                {props.isResolvable && (
                                                    <Components.Button
                                                        title="Resolve flag"
                                                        onClick={() => setShowResolveModal(true)}
                                                        disabled={isValidating || submitting}
                                                        endIcon={
                                                            <OutlineIcons.ClipboardDocumentCheckIcon className="h-6 w-6 text-teal-400" />
                                                        }
                                                    />
                                                )}
                                                <Components.Button
                                                    title="Save comment"
                                                    onClick={submitComment}
                                                    disabled={isValidating || submitting}
                                                    endIcon={
                                                        <OutlineIcons.ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-teal-400" />
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </Layouts.Standard>
        </>
    );
};

export default FlagThread;
