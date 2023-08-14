import React, { useEffect, useMemo } from 'react';
import parse from 'html-react-parser';
import Head from 'next/head';
import useSWR from 'swr';
import axios from 'axios';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Types from '@types';
import * as Assets from '@assets';
import * as Contexts from '@contexts';

import { useRouter } from 'next/router';

type SidebarCardProps = {
    publication: Interfaces.Publication;
    sectionList: {
        title: string;
        href: string;
    }[];
};

const SidebarCard: React.FC<SidebarCardProps> = (props): React.ReactElement => (
    <div className="w-full space-y-2 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 dark:bg-grey-900">
        <Components.PublicationSidebarCardGeneral publication={props.publication} />
        <Components.PublicationSidebarCardActions publication={props.publication} />
        <Components.PublicationSidebarCardSections sectionList={props.sectionList} />
    </div>
);

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    let publication: Interfaces.Publication | null = null;
    let bookmarkId: string | null = null;
    let error: string | null = null;

    const token = Helpers.getJWT(context);

    try {
        const response = await api.get(`${Config.endpoints.publications}/${requestedId}`, token);
        publication = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    try {
        const response = await api.get(`${Config.endpoints.bookmarks}?type=PUBLICATION&entityId=${requestedId}`, token);
        bookmarkId = response.data && response.data.length === 1 ? response.data[0].id : null;
    } catch (err) {
        console.log(err);
    }

    if (!publication || error) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            publication,
            userToken: token || '',
            bookmarkId,
            publicationId: publication.id,
            protectedPage: ['LOCKED', 'DRAFT'].includes(publication.currentStatus)
        }
    };
};

type Props = {
    publication: Interfaces.Publication;
    publicationId: string;
    bookmarkId: string | null;
    userToken: string;
};

const Publication: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const confirmation = Contexts.useConfirmationModal();
    const [bookmarkId, setBookmarkId] = React.useState(props.bookmarkId);
    const isBookmarked = bookmarkId ? true : false;
    const [isPublishing, setPublishing] = React.useState<boolean>(false);
    const [approvalError, setApprovalError] = React.useState('');
    const [serverError, setServerError] = React.useState('');
    const [isEditingAffiliations, setIsEditingAffiliations] = React.useState(false);

    useEffect(() => {
        setBookmarkId(props.bookmarkId);
    }, [props.bookmarkId, props.publicationId]);

    const { data: publicationData, mutate } = useSWR<Interfaces.Publication>(
        `${Config.endpoints.publications}/${props.publicationId}`,
        (url) => api.get(url, props.userToken).then((data) => data.data),
        { fallbackData: props.publication }
    );

    const { data: references = [] } = useSWR<Interfaces.Reference[]>(
        `${Config.endpoints.publications}/${props.publicationId}/reference`,
        (url) => api.get(url, props.userToken).then(({ data }) => data),
        {
            fallbackData: []
        }
    );

    const peerReviews =
        publicationData?.linkedFrom?.filter((link) => link.publicationFromRef.type === 'PEER_REVIEW') || [];

    // problems this publication is linked to
    const parentProblems = publicationData?.linkedTo?.filter((link) => link.publicationToRef.type === 'PROBLEM') || [];

    // problems linked from this publication
    const childProblems =
        publicationData?.linkedFrom?.filter((link) => link.publicationFromRef.type === 'PROBLEM') || [];

    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const isBookmarkButtonVisible = useMemo(() => {
        if (!user || !publicationData) {
            return false;
        }

        const isCoAuthor = publicationData.coAuthors.some((author) => author.id == user.id);
        const isOwner = user.id === publicationData.createdBy;

        if (!isCoAuthor && !isOwner) {
            return true;
        }

        return false;
    }, [publicationData, user]);
    const topics = publicationData?.topics || [];

    const list = [];

    const showReferences = Boolean(references?.length);
    const showChildProblems = Boolean(childProblems?.length);
    const showParentProblems = Boolean(parentProblems?.length);
    const showTopics = Boolean(topics?.length);
    const showPeerReviews = Boolean(peerReviews?.length);
    const showEthicalStatement = publicationData?.type === 'DATA' && Boolean(publicationData.ethicalStatement);
    const showRedFlags = !!publicationData?.publicationFlags?.length;

    if (showReferences) list.push({ title: 'References', href: 'references' });
    if (showChildProblems || showParentProblems) list.push({ title: 'Linked problems', href: 'problems' });
    if (showTopics) list.push({ title: 'Linked topics', href: 'topics' });
    if (showPeerReviews) list.push({ title: 'Peer reviews', href: 'peer-reviews' });
    if (showEthicalStatement) list.push({ title: 'Ethical statement', href: 'ethical-statement' });
    if (publicationData?.dataPermissionsStatement)
        list.push({ title: 'Data permissions statement', href: 'data-permissions-statement' });
    if (publicationData?.dataAccessStatement)
        list.push({ title: 'Data access statement', href: 'data-access-statement' });
    if (publicationData?.selfDeclaration) list.push({ title: 'Self-declaration', href: 'self-declaration' });
    if (showRedFlags) list.push({ title: 'Red flags', href: 'red-flags' });

    const sectionList = [
        { title: 'Main text', href: 'main-text' },
        ...list,
        { title: 'Funders', href: 'funders' },
        { title: 'Conflict of interest', href: 'coi' }
    ];

    const currentCoAuthor = React.useMemo(
        () => publicationData?.coAuthors?.find((coAuthor) => coAuthor.linkedUser === user?.id),
        [publicationData, user?.id]
    );

    const alertSeverity = React.useMemo(() => {
        if (publicationData?.user?.id === user?.id) {
            return 'INFO';
        }
        if (publicationData?.currentStatus === 'DRAFT') {
            return 'WARNING';
        }
        if (currentCoAuthor?.confirmedCoAuthor) {
            return 'SUCCESS';
        }
        if (!currentCoAuthor?.confirmedCoAuthor) {
            return 'WARNING';
        }
        return 'INFO';
    }, [publicationData, user?.id, currentCoAuthor?.confirmedCoAuthor]);

    const updateCoAuthor = React.useCallback(
        async (confirm: boolean) => {
            setApprovalError('');
            try {
                await api.patch(
                    `/publications/${publicationData?.id}/coauthor-confirmation`,
                    {
                        confirm
                    },
                    user?.token
                );
            } catch (err) {
                setApprovalError(axios.isAxiosError(err) ? err.response?.data?.message : (err as Error).message);
            }
        },
        [publicationData?.id, user?.token]
    );

    const onBookmarkHandler = async () => {
        if (isBookmarked) {
            //delete the bookmark
            try {
                await api.destroy(`bookmarks/${bookmarkId}`, user?.token);
                setBookmarkId(null);
            } catch (err) {
                console.log(err);
            }
        } else {
            //create the bookmark
            try {
                const newBookmarkResponse = await api.post<{
                    id: string;
                    type: string;
                    entityId: string;
                    userId: string;
                }>(
                    `bookmarks`,
                    {
                        type: 'PUBLICATION',
                        entityId: publicationData?.id
                    },
                    user?.token
                );

                setBookmarkId(newBookmarkResponse.data?.id);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handlePublish = React.useCallback(async () => {
        const confirmed = await confirmation(
            'Are you sure you want to publish?',
            'It is not possible to make any changes post-publication.',
            <OutlineIcons.CloudArrowUpIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />,
            'Yes',
            'No'
        );

        if (confirmed) {
            setServerError('');
            setPublishing(true);

            try {
                await api.put(
                    `${Config.endpoints.publications}/${publicationData?.id}/status/LIVE`,
                    {},
                    Helpers.getJWT()
                );

                router.reload();
            } catch (err) {
                const publishError = err as Interfaces.JSONResponseError;
                setServerError(publishError.message);
                setPublishing(false);
            }
        }
    }, [confirmation, publicationData?.id, router]);

    const handleUnlock = async () => {
        const confirmed = await confirmation(
            'Are you sure you want to cancel and unlock?',
            'Unlocking this publication for editing will invalidate all existing author approvals. Authors will be invited to approve your new changes once you have finished editing',
            <OutlineIcons.LockOpenIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />,
            'Unlock',
            'Cancel'
        );

        if (confirmed) {
            try {
                await api.put(
                    `${Config.endpoints.publications}/${publicationData?.id}/status/DRAFT`,
                    {},
                    Helpers.getJWT()
                );

                router.push(`${Config.urls.viewPublication.path}/${publicationData?.id}/edit?step=4`);
            } catch (err) {
                const unlockError = err as Interfaces.JSONResponseError;
                setServerError(unlockError.message);
            }
        }
    };

    const handleCancelApproval = async () => {
        const confirmed = await confirmation('Change your mind?', undefined, undefined, 'Yes, changes are needed');

        if (confirmed) {
            await updateCoAuthor(false);
            await mutate();
        }
    };

    const handleApproval = async () => {
        const confirmed = await confirmation(
            'Do you approve this publication?',
            undefined,
            undefined,
            'Yes, this is ready to publish'
        );

        if (confirmed) {
            await updateCoAuthor(true);
            await mutate();
        }
    };

    const handleOpenAffiliationsModal = React.useCallback(() => setIsEditingAffiliations(true), []);

    const handleCloseAffiliationsModal = React.useCallback(
        (revalidate?: boolean) => {
            if (revalidate) {
                mutate();
            }
            setIsEditingAffiliations(false);
        },
        [mutate]
    );

    const activeFlags = React.useMemo(
        () => publicationData?.publicationFlags?.filter((flag) => !flag.resolved),
        [publicationData]
    );

    const inactiveFlags = React.useMemo(
        () => publicationData?.publicationFlags?.filter((flag) => !!flag.resolved),
        [publicationData]
    );

    const uniqueRedFlagCategoryList = React.useMemo(
        () => Array.from(new Set(activeFlags?.map((flag) => flag.category))),
        [activeFlags]
    );

    const authors = React.useMemo(() => {
        if (!publicationData) {
            return [];
        }

        const authors = [...publicationData.coAuthors];

        // make sure authors list include the corresponding author
        const correspondingUser = publicationData.user;
        if (!authors.find((author) => author.linkedUser === correspondingUser.id)) {
            authors.unshift({
                id: correspondingUser.id,
                approvalRequested: false,
                confirmedCoAuthor: true,
                email: correspondingUser.email || '',
                publicationId: publicationData.id,
                linkedUser: correspondingUser.id,
                isIndependent: true,
                affiliations: [],
                user: {
                    orcid: correspondingUser.orcid,
                    firstName: correspondingUser.firstName,
                    lastName: correspondingUser.lastName
                }
            });
        }

        return authors;
    }, [publicationData]);

    const confirmedAuthors = useMemo(
        () => authors.filter((author) => author.confirmedCoAuthor && author.user),
        [authors]
    );

    const showApprovalsTracker = useMemo(
        () => publicationData?.currentStatus === 'LOCKED' && authors.some((author) => author.approvalRequested),
        [authors, publicationData?.currentStatus]
    );

    const isReadyForPublish = useMemo(
        () => showApprovalsTracker && authors.every((author) => author.confirmedCoAuthor),
        [authors, showApprovalsTracker]
    );

    const author = useMemo(
        () => publicationData?.coAuthors.find((author) => author.linkedUser === user?.id),
        [publicationData?.coAuthors, user?.id]
    );

    const isCorrespondingAuthor = useMemo(
        () => author?.linkedUser === publicationData?.createdBy,
        [author?.linkedUser, publicationData?.createdBy]
    );

    return publicationData ? (
        <>
            <Head>
                <meta name="description" content={publicationData.description || ''} />
                <meta name="keywords" content={publicationData.keywords?.join(', ') || ''} />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${publicationData.id}`} />
                <title>{`${publicationData.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>

            <Layouts.Publication
                fixedHeader={false}
                publicationId={publicationData.type !== 'PEER_REVIEW' ? publicationData.id : undefined}
            >
                <section className="col-span-12 lg:col-span-8 xl:col-span-9">
                    {approvalError && <Components.Alert className="mb-4" severity="ERROR" title={approvalError} />}
                    {publicationData.currentStatus === 'DRAFT' && (
                        <>
                            {!isCorrespondingAuthor && (
                                <Components.Alert
                                    className="mb-4"
                                    severity={alertSeverity}
                                    title="This publication is currently being edited."
                                >
                                    <p className="mt-2 text-sm text-grey-800">
                                        Once the corresponding author has made their changes, you will be notified to
                                        approve the draft before it is published.
                                    </p>
                                </Components.Alert>
                            )}
                            {isCorrespondingAuthor && (
                                <Components.Alert
                                    className="mb-4"
                                    severity={alertSeverity}
                                    title={`This is a draft publication only visible to authors. ${
                                        showApprovalsTracker
                                            ? isReadyForPublish
                                                ? 'All authors have approved this publication.'
                                                : 'All authors must approve this draft before it can be published.'
                                            : ''
                                    }`}
                                >
                                    <Components.Link
                                        openNew={false}
                                        title="Edit publication"
                                        href={`${Config.urls.viewPublication.path}/${publicationData.id}/edit?step=4`}
                                        className="mt-2 flex w-fit items-center space-x-2 text-sm text-white-50 underline"
                                    >
                                        <OutlineIcons.PencilSquareIcon className="w-4" />
                                        <span>Edit Draft Publication</span>
                                    </Components.Link>
                                </Components.Alert>
                            )}
                        </>
                    )}

                    {showApprovalsTracker && (
                        <Components.ActionBar
                            publication={publicationData}
                            isCorrespondingAuthor={isCorrespondingAuthor}
                            isReadyForPublish={isReadyForPublish}
                            isPublishing={isPublishing}
                            onUnlockPublication={handleUnlock}
                            onApprove={handleApproval}
                            onCancelApproval={handleCancelApproval}
                            onPublish={handlePublish}
                            onEditAffiliations={handleOpenAffiliationsModal}
                        />
                    )}

                    {serverError && <Components.Alert severity="ERROR" title={serverError} />}

                    {showApprovalsTracker && (
                        <div className="pb-16">
                            <Components.ApprovalsTracker
                                publication={publicationData}
                                isPublishing={isPublishing}
                                onPublish={handlePublish}
                                onError={setServerError}
                                onEditAffiliations={handleOpenAffiliationsModal}
                                refreshPublicationData={mutate}
                            />
                        </div>
                    )}

                    {showApprovalsTracker && author && (
                        <Components.EditAffiliationsModal
                            author={author}
                            autoUpdate={isCorrespondingAuthor || !author.confirmedCoAuthor}
                            open={isEditingAffiliations}
                            onClose={handleCloseAffiliationsModal}
                        />
                    )}

                    {!!uniqueRedFlagCategoryList.length && (
                        <Components.Alert
                            title="This publication has active red flags for:"
                            severity="RED_FLAG"
                            className="mb-4"
                        >
                            <ul className="mb-4 mt-3">
                                {uniqueRedFlagCategoryList.map((category) => (
                                    <li key={category} className="text-sm text-red-700">
                                        - {Config.values.octopusInformation.redFlagReasons[category].nicename}
                                    </li>
                                ))}
                            </ul>

                            <button
                                aria-label="View red flags"
                                title="View red flags"
                                onClick={() =>
                                    document.getElementById('red-flags')?.scrollIntoView({ behavior: 'smooth' })
                                }
                                className="mt-2 block rounded border-transparent text-sm font-medium text-red-700 underline outline-0 hover:text-red-800 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                            >
                                View flags
                            </button>
                        </Components.Alert>
                    )}
                    <header>
                        <div className="grid w-full grid-cols-8">
                            <h1 className="col-span-7 mb-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-normal">
                                {publicationData.title}
                            </h1>
                            {isBookmarkButtonVisible && (
                                <div className="col-span-1 grid justify-items-end">
                                    <button
                                        className="h-8 hover:cursor-pointer focus:outline-none focus:ring focus:ring-yellow-200 focus:ring-offset-2 dark:outline-none dark:focus:ring dark:focus:ring-yellow-600 dark:focus:ring-offset-1"
                                        onClick={onBookmarkHandler}
                                        aria-label="toggle-bookmark"
                                        title={`${isBookmarked ? 'Remove bookmark' : 'Bookmark this publication'}`}
                                    >
                                        <OutlineIcons.BookmarkIcon
                                            className={`h-8 w-8 ${
                                                isBookmarked ? 'fill-blue-700 dark:fill-blue-50' : 'fill-transparent'
                                            } text-blue-700 transition duration-150 dark:text-blue-50`}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {confirmedAuthors.map((author, index) => (
                                <div key={author.id} className="flex w-fit items-center">
                                    <Components.Link
                                        href={`${Config.urls.viewUser.path}/${author.linkedUser}`}
                                        className="w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                    >
                                        <span className="author-name">
                                            {author.user?.firstName[0]}. {author.user?.lastName}
                                        </span>
                                    </Components.Link>
                                    <Components.Link
                                        className="ml-2 flex w-fit items-center"
                                        href={`https://${
                                            process.env.NEXT_PUBLIC_STAGE === 'local' ? 'sandbox.' : ''
                                        }orcid.org/${author.user?.orcid}`}
                                        openNew={true}
                                    >
                                        <Assets.OrcidLogoIcon width={24} />
                                    </Components.Link>
                                    {index < confirmedAuthors.length - 1 && (
                                        <span className="leading-relaxed text-teal-600 transition-colors duration-500 dark:text-teal-400">
                                            ,
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="block lg:hidden">
                            {publicationData && <SidebarCard publication={publicationData} sectionList={sectionList} />}
                        </div>
                    </header>

                    {/** Full text */}
                    <Components.ContentSection id="main-text" hasBreak isMainText>
                        <div>
                            <Components.ParseHTML content={publicationData.content ?? ''} />
                        </div>
                    </Components.ContentSection>

                    {/* References */}
                    {showReferences && (
                        <Components.ContentSection id="references" title="References" hasBreak>
                            {references.map((reference) => (
                                <div key={reference.id} className="py-2 break-anywhere">
                                    <Components.ParseHTML content={reference.text} />
                                    {reference.location && (
                                        <div className="break-all underline dark:text-white-50">
                                            <Components.Link href={reference.location} openNew>
                                                {reference.location}
                                            </Components.Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Components.ContentSection>
                    )}

                    {(showParentProblems || showChildProblems) && (
                        <div id="problems">
                            {/* Parent problems */}
                            {showParentProblems && (
                                <Components.ContentSection
                                    id="problems-linked-to"
                                    title="Research problems above this in the hierarchy"
                                    hasBreak
                                >
                                    <Components.List ordered={false}>
                                        {parentProblems.map((link) => (
                                            <Components.ListItem
                                                key={link.id}
                                                className="flex items-center font-semibold leading-3"
                                            >
                                                <Components.PublicationLink
                                                    publicationRef={link.publicationToRef}
                                                    showType={false}
                                                />
                                            </Components.ListItem>
                                        ))}
                                    </Components.List>
                                </Components.ContentSection>
                            )}

                            {/* Child problems */}
                            {showChildProblems && (
                                <Components.ContentSection
                                    id="problems-linked-from"
                                    title="Research problems below this in the hierarchy"
                                    hasBreak
                                >
                                    <Components.List ordered={false}>
                                        {childProblems.map((link) => (
                                            <Components.ListItem
                                                key={link.id}
                                                className="flex items-center font-semibold leading-3"
                                            >
                                                <Components.PublicationLink
                                                    publicationRef={link.publicationFromRef}
                                                    showType={false}
                                                />
                                            </Components.ListItem>
                                        ))}
                                    </Components.List>
                                </Components.ContentSection>
                            )}
                        </div>
                    )}
                    {showTopics && (
                        <Components.ContentSection
                            id="topics"
                            title="Research topics above this in the hierarchy"
                            hasBreak
                        >
                            <Components.List ordered={false}>
                                {topics.map((topic) => (
                                    <Components.ListItem key={topic.id}>
                                        <Components.Link
                                            href={`${Config.urls.viewTopic.path}/${topic.id}`}
                                            className="mb-2 text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                        >
                                            {topic.title}
                                        </Components.Link>
                                    </Components.ListItem>
                                ))}
                            </Components.List>
                        </Components.ContentSection>
                    )}

                    {/* Linked peer reviews */}
                    {!!showPeerReviews && (
                        <Components.ContentSection
                            id="peer-reviews"
                            title={`Peer reviews created from this ${Helpers.formatPublicationType(
                                publicationData.type
                            )}`}
                            hasBreak
                        >
                            <Components.List ordered={false}>
                                {peerReviews.map((link) => (
                                    <Components.ListItem
                                        key={link.id}
                                        className="flex items-center font-semibold leading-3"
                                    >
                                        <Components.PublicationLink
                                            publicationRef={link.publicationFromRef}
                                            showType={false}
                                        />
                                    </Components.ListItem>
                                ))}
                            </Components.List>
                        </Components.ContentSection>
                    )}

                    {/* Ethical statement */}
                    {showEthicalStatement && (
                        <Components.ContentSection id="ethical-statement" title="Ethical statement" hasBreak>
                            <>
                                <p className="block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    {parse(publicationData.ethicalStatement)}
                                </p>
                                {!!publicationData.ethicalStatementFreeText && (
                                    <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                        {parse(publicationData.ethicalStatementFreeText)}
                                    </p>
                                )}
                            </>
                        </Components.ContentSection>
                    )}

                    {/* Data permissions statement */}
                    {!!publicationData.dataPermissionsStatement && (
                        <Components.ContentSection
                            id="data-permissions-statement"
                            title="Data permissions statement"
                            hasBreak
                        >
                            <>
                                <p className="mb-2 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    {parse(publicationData.dataPermissionsStatement)}
                                </p>
                                {publicationData.dataPermissionsStatementProvidedBy?.length && (
                                    <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                        {parse(publicationData.dataPermissionsStatementProvidedBy)}
                                    </p>
                                )}
                            </>
                        </Components.ContentSection>
                    )}

                    {/* Data access statement */}
                    {!!publicationData.dataAccessStatement && (
                        <Components.ContentSection id="data-access-statement" title="Data access statement" hasBreak>
                            <p className="block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {parse(publicationData.dataAccessStatement)}
                            </p>
                        </Components.ContentSection>
                    )}

                    {/* Self declaration */}
                    {publicationData.selfDeclaration && (
                        <Components.ContentSection id="self-declaration" title="Self declaration" hasBreak>
                            <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                {publicationData.type === 'PROTOCOL' &&
                                    'Data has not yet been collected according to this method/protocol.'}
                                {publicationData.type === 'HYPOTHESIS' &&
                                    'Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)'}
                            </p>
                        </Components.ContentSection>
                    )}

                    {/* Red flags */}
                    {showRedFlags && (
                        <Components.ContentSection id="red-flags" title="Red flags" hasBreak>
                            <div className="mt-6 space-y-8">
                                {activeFlags && !!activeFlags.length ? (
                                    <div>
                                        <h2 className="mb-1 font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 ">
                                            Active
                                        </h2>
                                        <div className="space-y-4">
                                            {activeFlags.map((flag) => (
                                                <Components.FlagPreview
                                                    key={flag.id}
                                                    publicationId={publicationData.id}
                                                    flag={flag}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {inactiveFlags && !!inactiveFlags.length ? (
                                    <div>
                                        <h2 className="mb-1 font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 ">
                                            Resolved
                                        </h2>
                                        <div className="space-y-4">
                                            {inactiveFlags.map((flag) => (
                                                <Components.FlagPreview
                                                    key={flag.id}
                                                    publicationId={publicationData.id}
                                                    flag={flag}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </Components.ContentSection>
                    )}
                    {/* Publication funders section */}
                    <Components.ContentSection id="funders" title="Funders" hasBreak>
                        {!publicationData.funders?.length && !publicationData.fundersStatement ? (
                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                No sources of funding have been specified for this{' '}
                                {Helpers.formatPublicationType(publicationData.type)}.
                            </p>
                        ) : (
                            <>
                                {publicationData.funders?.length ? (
                                    <>
                                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                            This {Helpers.formatPublicationType(publicationData.type)} has the following
                                            sources of funding:
                                        </p>
                                        <ul className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                            {publicationData.funders?.map((funder) => {
                                                return (
                                                    <li key={funder.id} className="ml-7 mt-1 list-disc">
                                                        <a
                                                            href={funder.link}
                                                            className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                                        >
                                                            {funder.name}
                                                        </a>{' '}
                                                        - {funder.city}, {funder.country}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                ) : null}
                                {publicationData.fundersStatement ? (
                                    <p className="block pt-2 leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                        {parse(publicationData.fundersStatement)}
                                    </p>
                                ) : null}
                            </>
                        )}
                    </Components.ContentSection>

                    {/** Conflict of interest */}
                    <Components.ContentSection id="coi" title="Conflict of interest">
                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                            {publicationData.conflictOfInterestStatus
                                ? publicationData.conflictOfInterestText
                                : `This ${Helpers.formatPublicationType(
                                      publicationData.type
                                  )} does not have any specified conflicts of interest.`}
                        </p>
                    </Components.ContentSection>
                </section>
                <aside className="relative hidden lg:col-span-4 lg:block xl:col-span-3">
                    <div className="sticky top-12 space-y-8">
                        <SidebarCard publication={publicationData} sectionList={sectionList} />
                    </div>
                </aside>
            </Layouts.Publication>
        </>
    ) : (
        <></>
    );
};

export default Publication;
