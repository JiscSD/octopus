/**
 * This page is a temporary copy of /publications/[id] page and will be only available on local and int stages until we release versioning work on prod
 * If trying to access this page on prod, the user will be redirected back to the /publications/[id]
 */
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
    publicationVersion: Interfaces.PublicationVersion;
    linkedFrom: Interfaces.LinkedFromPublication[];
    flags: Interfaces.Flag[];
    sectionList: {
        title: string;
        href: string;
    }[];
};

const SidebarCard: React.FC<SidebarCardProps> = (props): React.ReactElement => (
    <div className="w-full space-y-2 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 dark:bg-grey-900">
        <Components.PublicationSidebarCardGeneral
            publicationVersion={props.publicationVersion}
            linkedFrom={props.linkedFrom}
            flags={props.flags}
        />
        <Components.PublicationSidebarCardActions publicationVersion={props.publicationVersion} />
        <Components.PublicationSidebarCardSections sectionList={props.sectionList} />
    </div>
);

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    const versionId = context.query.versionId;

    /**
     * TODO - remove this when we decide to deploy versioned DOIs & creating new versions on prod
     */
    if (!['local', 'int'].includes(process.env.NEXT_PUBLIC_STAGE!)) {
        return {
            redirect: {
                destination: `/publications/${requestedId}`,
                permanent: false
            }
        };
    }

    const token = Helpers.getJWT(context);

    // fetch data concurrently
    const promises: [
        Promise<Interfaces.PublicationVersion | void>,
        Promise<Interfaces.BookmarkedEntityData[] | void>,
        Promise<Interfaces.PublicationWithLinks | void>,
        Promise<Interfaces.Flag[] | void>,
        Promise<Interfaces.BaseTopic[] | void>
    ] = [
        api
            .get(`${Config.endpoints.publications}/${requestedId}/publication-versions/${versionId}`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        api
            .get(`${Config.endpoints.bookmarks}?type=PUBLICATION&entityId=${requestedId}`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        api
            .get(`${Config.endpoints.publications}/${requestedId}/links?direct=true`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        api
            .get(`${Config.endpoints.publications}/${requestedId}/flags`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        api
            .get(`${Config.endpoints.publications}/${requestedId}/topics`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error))
    ];

    const [
        publicationVersion,
        bookmarks = [],
        directLinks = { publication: null, linkedTo: [], linkedFrom: [] },
        flags = [],
        topics = []
    ] = await Promise.all(promises);

    if (!publicationVersion) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            publicationVersion,
            userToken: token || '',
            bookmarkId: bookmarks.length ? bookmarks[0].id : null,
            publicationId: publicationVersion.publication.id,
            protectedPage: ['LOCKED', 'DRAFT'].includes(publicationVersion.currentStatus),
            directLinks,
            flags,
            topics
        }
    };
};

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    publicationId: string;
    bookmarkId: string | null;
    userToken: string;
    directLinks: Interfaces.PublicationWithLinks;
    flags: Interfaces.Flag[];
    topics: Interfaces.BaseTopic[];
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

    const { data: publicationVersion, mutate } = useSWR<Interfaces.PublicationVersion>(
        `${Config.endpoints.publications}/${props.publicationId}/publication-versions/${props.publicationVersion.id}`,
        null,
        { fallbackData: props.publicationVersion }
    );

    const { data: references = [] } = useSWR<Interfaces.Reference[]>(
        `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/references`,
        null,
        {
            fallbackData: []
        }
    );

    const { data: { linkedTo = [], linkedFrom = [] } = {} } = useSWR<Interfaces.PublicationWithLinks>(
        `${Config.endpoints.publications}/${props.publicationVersion.publication.id}/links?direct=true`,
        null,
        {
            fallbackData: props.directLinks
        }
    );

    const { data: flags = [] } = useSWR<Interfaces.Flag[]>(
        `${Config.endpoints.publications}/${props.publicationId}/flags`,
        null,
        { fallbackData: props.flags }
    );

    const { data: topics = [] } = useSWR<Interfaces.BaseTopic[]>(
        `${Config.endpoints.publications}/${props.publicationId}/topics`,
        null,
        {
            fallbackData: props.topics
        }
    );

    const peerReviews = linkedFrom.filter((link) => link.type === 'PEER_REVIEW') || [];

    // problems this publication is linked to
    const parentProblems = linkedTo.filter((link) => link.type === 'PROBLEM') || [];

    // problems linked from this publication
    const childProblems = linkedFrom.filter((link) => link.type === 'PROBLEM') || [];

    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const isBookmarkButtonVisible = useMemo(() => {
        if (!user || !publicationVersion) {
            return false;
        } else {
            return true;
        }
    }, [publicationVersion, user]);

    const list = [];

    const showReferences = Boolean(references?.length);
    const showChildProblems = Boolean(childProblems?.length);
    const showParentProblems = Boolean(parentProblems?.length);
    const showTopics = Boolean(topics?.length);
    const showPeerReviews = Boolean(peerReviews?.length);
    const showEthicalStatement =
        publicationVersion?.publication.type === 'DATA' && Boolean(publicationVersion.ethicalStatement);
    const showRedFlags = !!flags.length;

    if (showReferences) list.push({ title: 'References', href: 'references' });
    if (showChildProblems || showParentProblems) list.push({ title: 'Linked problems', href: 'problems' });
    if (showTopics) list.push({ title: 'Linked topics', href: 'topics' });
    if (showPeerReviews) list.push({ title: 'Peer reviews', href: 'peer-reviews' });
    if (showEthicalStatement) list.push({ title: 'Ethical statement', href: 'ethical-statement' });
    if (publicationVersion?.dataPermissionsStatement)
        list.push({ title: 'Data permissions statement', href: 'data-permissions-statement' });
    if (publicationVersion?.dataAccessStatement)
        list.push({ title: 'Data access statement', href: 'data-access-statement' });
    if (publicationVersion?.selfDeclaration) list.push({ title: 'Self-declaration', href: 'self-declaration' });
    if (showRedFlags) list.push({ title: 'Red flags', href: 'red-flags' });

    const sectionList = [
        { title: 'Main text', href: 'main-text' },
        ...list,
        { title: 'Funders', href: 'funders' },
        { title: 'Conflict of interest', href: 'coi' }
    ];

    const currentCoAuthor = React.useMemo(
        () => publicationVersion?.coAuthors?.find((coAuthor) => coAuthor.linkedUser === user?.id),
        [publicationVersion, user?.id]
    );

    const alertSeverity = React.useMemo(() => {
        if (publicationVersion?.user?.id === user?.id) {
            return 'INFO';
        }
        if (publicationVersion?.currentStatus === 'DRAFT') {
            return 'WARNING';
        }
        if (currentCoAuthor?.confirmedCoAuthor) {
            return 'SUCCESS';
        }
        if (!currentCoAuthor?.confirmedCoAuthor) {
            return 'WARNING';
        }
        return 'INFO';
    }, [publicationVersion, user?.id, currentCoAuthor?.confirmedCoAuthor]);

    const updateCoAuthor = React.useCallback(
        async (confirm: boolean) => {
            setApprovalError('');
            try {
                await api.patch(
                    `/publication-versions/${publicationVersion?.id}/coauthor-confirmation`,
                    {
                        confirm
                    },
                    user?.token
                );
            } catch (err) {
                setApprovalError(axios.isAxiosError(err) ? err.response?.data?.message : (err as Error).message);
            }
        },
        [publicationVersion?.id, user?.token]
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
                        entityId: publicationVersion?.versionOf
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
                    `${Config.endpoints.publicationVersions}/${publicationVersion?.id}/status/LIVE`,
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
    }, [confirmation, publicationVersion?.id, router]);

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
                    `${Config.endpoints.publicationVersions}/${publicationVersion?.id}/status/DRAFT`,
                    {},
                    Helpers.getJWT()
                );

                router.push(`${Config.urls.viewPublication.path}/${publicationVersion?.publication.id}/edit?step=4`);
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

    const activeFlags = React.useMemo(() => flags.filter((flag) => !flag.resolved), [flags]);

    const inactiveFlags = React.useMemo(() => flags.filter((flag) => !!flag.resolved), [flags]);

    const uniqueRedFlagCategoryList = React.useMemo(
        () => Array.from(new Set(activeFlags?.map((flag) => flag.category))),
        [activeFlags]
    );

    const authors = React.useMemo(() => {
        if (!publicationVersion) {
            return [];
        }

        const authors = [...publicationVersion.coAuthors];

        // make sure authors list include the corresponding author
        const correspondingUser = publicationVersion.user;
        if (!authors.find((author) => author.linkedUser === correspondingUser.id)) {
            authors.unshift({
                id: correspondingUser.id,
                approvalRequested: false,
                confirmedCoAuthor: true,
                email: correspondingUser.email || '',
                publicationVersionId: publicationVersion.id,
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
    }, [publicationVersion]);

    const confirmedAuthors = useMemo(
        () => authors.filter((author) => author.confirmedCoAuthor && author.user),
        [authors]
    );

    const showApprovalsTracker = useMemo(
        () => publicationVersion?.currentStatus === 'LOCKED' && authors.some((author) => author.approvalRequested),
        [authors, publicationVersion?.currentStatus]
    );

    const isReadyForPublish = useMemo(
        () => showApprovalsTracker && authors.every((author) => author.confirmedCoAuthor),
        [authors, showApprovalsTracker]
    );

    const author = useMemo(
        () => publicationVersion?.coAuthors.find((author) => author.linkedUser === user?.id),
        [publicationVersion?.coAuthors, user?.id]
    );

    const isCorrespondingAuthor = useMemo(
        () => author?.linkedUser === publicationVersion?.createdBy,
        [author?.linkedUser, publicationVersion?.createdBy]
    );

    const pageTitle = publicationVersion ? `${publicationVersion.title} - ${Config.urls.viewPublication.title}` : '';
    const contentText = publicationVersion?.content ? Helpers.htmlToText(publicationVersion.content) : '';

    return publicationVersion ? (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={props.publicationVersion.description || ''} />
                <meta name="og:title" content={Helpers.truncateString(pageTitle, 70)} />
                <meta name="og:description" content={Helpers.truncateString(contentText, 200)} />
                <meta name="keywords" content={props.publicationVersion.keywords?.join(', ') || ''} />
                <link
                    rel="canonical"
                    href={`${Config.urls.viewPublication.canonical}/${props.publicationVersion.versionOf}`}
                />
            </Head>

            <Layouts.Publication
                fixedHeader={false}
                publicationId={
                    publicationVersion.publication.type !== 'PEER_REVIEW'
                        ? publicationVersion.publication.id
                        : undefined
                }
            >
                <section className="col-span-12 lg:col-span-8 xl:col-span-9">
                    {approvalError && <Components.Alert className="mb-4" severity="ERROR" title={approvalError} />}
                    {publicationVersion.currentStatus === 'DRAFT' && (
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
                                        href={`${Config.urls.viewPublication.path}/${publicationVersion.publication.id}/edit?step=4`}
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
                            publicationVersion={publicationVersion}
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
                                publicationVersion={publicationVersion}
                                isPublishing={isPublishing}
                                onPublish={handlePublish}
                                onError={setServerError}
                                onEditAffiliations={handleOpenAffiliationsModal}
                                refreshPublicationVersionData={mutate}
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
                                {publicationVersion.title}
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
                            {publicationVersion && (
                                <SidebarCard
                                    publicationVersion={publicationVersion}
                                    linkedFrom={linkedFrom}
                                    sectionList={sectionList}
                                    flags={flags}
                                />
                            )}
                        </div>
                    </header>

                    {/** Full text */}
                    <Components.ContentSection id="main-text" hasBreak isMainText>
                        <div>
                            <Components.ParseHTML content={publicationVersion.content ?? ''} />
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
                                                <Components.PublicationLink link={link} showType={false} />
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
                                                <Components.PublicationLink link={link} showType={false} />
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
                                publicationVersion.publication.type
                            )}`}
                            hasBreak
                        >
                            <Components.List ordered={false}>
                                {peerReviews.map((link) => (
                                    <Components.ListItem
                                        key={link.id}
                                        className="flex items-center font-semibold leading-3"
                                    >
                                        <Components.PublicationLink link={link} showType={false} />
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
                                    {publicationVersion.ethicalStatement && parse(publicationVersion.ethicalStatement)}
                                </p>
                                {!!publicationVersion.ethicalStatementFreeText && (
                                    <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                        {parse(publicationVersion.ethicalStatementFreeText)}
                                    </p>
                                )}
                            </>
                        </Components.ContentSection>
                    )}

                    {/* Data permissions statement */}
                    {!!publicationVersion.dataPermissionsStatement && (
                        <Components.ContentSection
                            id="data-permissions-statement"
                            title="Data permissions statement"
                            hasBreak
                        >
                            <>
                                <p className="mb-2 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    {parse(publicationVersion.dataPermissionsStatement)}
                                </p>
                                {publicationVersion.dataPermissionsStatementProvidedBy?.length && (
                                    <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                        {parse(publicationVersion.dataPermissionsStatementProvidedBy)}
                                    </p>
                                )}
                            </>
                        </Components.ContentSection>
                    )}

                    {/* Data access statement */}
                    {!!publicationVersion.dataAccessStatement && (
                        <Components.ContentSection id="data-access-statement" title="Data access statement" hasBreak>
                            <p className="block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {parse(publicationVersion.dataAccessStatement)}
                            </p>
                        </Components.ContentSection>
                    )}

                    {/* Self declaration */}
                    {publicationVersion.selfDeclaration && (
                        <Components.ContentSection id="self-declaration" title="Self declaration" hasBreak>
                            <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                {publicationVersion.publication.type === 'PROTOCOL' &&
                                    'Data has not yet been collected according to this method/protocol.'}
                                {publicationVersion.publication.type === 'HYPOTHESIS' &&
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
                                                    publicationId={publicationVersion.publication.id}
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
                                                    publicationId={publicationVersion.publication.id}
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
                        {!publicationVersion.funders?.length && !publicationVersion.fundersStatement ? (
                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                No sources of funding have been specified for this{' '}
                                {Helpers.formatPublicationType(publicationVersion.publication.type)}.
                            </p>
                        ) : (
                            <>
                                {publicationVersion.funders?.length ? (
                                    <>
                                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                            This {Helpers.formatPublicationType(publicationVersion.publication.type)}{' '}
                                            has the following sources of funding:
                                        </p>
                                        <ul className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                            {publicationVersion.funders?.map((funder) => {
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
                                {publicationVersion.fundersStatement ? (
                                    <p className="block pt-2 leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                        {parse(publicationVersion.fundersStatement)}
                                    </p>
                                ) : null}
                            </>
                        )}
                    </Components.ContentSection>

                    {/** Conflict of interest */}
                    <Components.ContentSection id="coi" title="Conflict of interest">
                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                            {publicationVersion.conflictOfInterestStatus
                                ? publicationVersion.conflictOfInterestText
                                : `This ${Helpers.formatPublicationType(
                                      publicationVersion.publication.type
                                  )} does not have any specified conflicts of interest.`}
                        </p>
                    </Components.ContentSection>
                </section>
                <aside className="relative hidden lg:col-span-4 lg:block xl:col-span-3">
                    <div className="sticky top-12 space-y-8">
                        <SidebarCard
                            publicationVersion={publicationVersion}
                            linkedFrom={linkedFrom}
                            sectionList={sectionList}
                            flags={flags}
                        />
                    </div>
                </aside>
            </Layouts.Publication>
        </>
    ) : (
        <></>
    );
};

export default Publication;
