import axios from 'axios';
import parse from 'html-react-parser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Contexts from '@/contexts';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

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
    const suggestedFromPublicationId = context.query.suggestedFrom || null;
    const token = Helpers.getJWT(context);

    // fetch data concurrently
    const promises: [
        Promise<
            | { publicationVersion: Interfaces.PublicationVersion; versionRequestError: null }
            | { publicationVersion: null; versionRequestError: { status: number; message: string } }
        >,
        Promise<Interfaces.BookmarkedEntityData[] | void>,
        Promise<Interfaces.PublicationWithLinks | void>,
        Promise<Interfaces.Flag[] | void>,
        Promise<Interfaces.GetPublicationMixedCrosslinksResponse | void>,
        Promise<Interfaces.Crosslink | void>
    ] = [
        api
            .get(`${Config.endpoints.publications}/${requestedId}/publication-versions/${versionId}`, token)
            .then((res) => ({ publicationVersion: res.data, versionRequestError: null }))
            .catch((error) => {
                console.log(error);

                // check if the api responded with an error
                // if the api is not reachable, trying to access error.response.status will throw an error
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status as number;
                    const message = error.response?.data.message as string;

                    return { publicationVersion: null, versionRequestError: { status, message } };
                }

                return {
                    publicationVersion: null,
                    versionRequestError: { status: 500, message: 'Unknown Server error' }
                };
            }),
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
            .get(`${Config.endpoints.publications}/${requestedId}/crosslinks?order=mix`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        suggestedFromPublicationId
            ? api
                  .get(`${Config.endpoints.crosslinks}/${suggestedFromPublicationId},${requestedId}`, token)
                  .then((res) => res.data)
                  .catch((error) => console.log(error))
            : Promise.resolve()
    ];

    const [{ publicationVersion, versionRequestError }, bookmarks, directLinks, flags, crosslinks, activeCrosslink] =
        await Promise.all(promises);

    let activeCrosslinkVote: Interfaces.CrosslinkVote | null = null;
    if (suggestedFromPublicationId && activeCrosslink && token) {
        try {
            activeCrosslinkVote = (await api.get(`${Config.endpoints.crosslinks}/${activeCrosslink.id}/vote`, token))
                .data;
        } catch (error) {
            // Users who haven't voted will get a 404 back from this request, which is expected.
            if (axios.isAxiosError(error) && error.response?.status !== 404) {
                console.error('Error fetching crosslink vote:', error);
            }
        }
    }

    if (versionRequestError) {
        const status = versionRequestError.status;
        if (status === 404 || (token && status === 403)) {
            return {
                notFound: true
            };
        } else if (status === 403) {
            return {
                redirect: {
                    destination: `${Config.urls.orcidLogin.path}&state=${encodeURIComponent(context.resolvedUrl)}`,
                    permanent: false
                }
            };
        }
    }

    if (publicationVersion) {
        return {
            props: {
                publicationVersion,
                bookmarkId: bookmarks?.length ? bookmarks[0].id : null,
                publicationId: publicationVersion.publication.id,
                protectedPage: ['LOCKED', 'DRAFT'].includes(publicationVersion.currentStatus),
                directLinks,
                flags,
                crosslinks,
                suggestedFromPublicationId,
                activeCrosslink: activeCrosslink || null,
                activeCrosslinkVote
            }
        };
    } else {
        return {
            notFound: true
        };
    }
};

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    publicationId: string;
    bookmarkId: string | null;
    directLinks: Interfaces.PublicationWithLinks;
    flags: Interfaces.Flag[];
    crosslinks: Interfaces.GetPublicationMixedCrosslinksResponse;
    suggestedFromPublicationId: string | null;
    activeCrosslink: Interfaces.Crosslink | null;
    activeCrosslinkVote: Interfaces.CrosslinkVote | null;
};

const Publication: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const confirmation = Contexts.useConfirmationModal();
    const [bookmarkId, setBookmarkId] = React.useState(props.bookmarkId);
    const isBookmarked = bookmarkId ? true : false;
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [serverError, setServerError] = React.useState('');
    const [isEditingAffiliations, setIsEditingAffiliations] = React.useState(false);
    const [isUnlocking, setIsUnlocking] = React.useState(false);

    const isVerifiedWithName = user?.email && (user.firstName || user.lastName);

    useEffect(() => {
        setBookmarkId(props.bookmarkId);
    }, [props.bookmarkId, props.publicationId]);

    const { data: publicationVersion, mutate: mutatePublicationVersion } = useSWR<Interfaces.PublicationVersion>(
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

    const { data: publication } = useSWR<
        Pick<Interfaces.Publication, 'id' | 'type' | 'externalSource'> & {
            versions: Types.PartialPublicationVersion[];
        }
    >(
        `${Config.endpoints.publications}/${props.publicationId}?fields=id,type,externalSource,versions(id,doi,currentStatus,versionOf,versionNumber,createdBy,publishedDate,isLatestLiveVersion,isLatestVersion,coAuthors)`
    );

    const { data: controlRequests = [], isLoading: isLoadingControlRequests } = useSWR<Interfaces.ControlRequest[]>(
        // Only bother fetching if user is verified
        isVerifiedWithName ? `${Config.endpoints.users}/me/control-requests` : null
    );

    const {
        data: crosslinks = { data: { recent: [], relevant: [] }, metadata: { total: 0, limit: 0, offset: 0 } },
        mutate: mutateCrosslinks
    } = useSWR<Interfaces.GetPublicationMixedCrosslinksResponse>(
        `${Config.endpoints.publications}/${props.publicationId}/crosslinks?order=mix`,
        null,
        { fallbackData: props.crosslinks }
    );

    const hasAlreadyRequestedControl = controlRequests.some(
        (request) => request.data.publicationVersion.versionOf === props.publicationId
    );

    const thisVersionPeerReviews =
        linkedFrom.filter(
            (link) => link.type === 'PEER_REVIEW' && link.parentVersionId === props.publicationVersion.id
        ) || [];

    // Publications this publication is linked to (only shown on problems)
    const parentPublications = publicationVersion?.publication.type === 'PROBLEM' ? linkedTo : [];

    // Problems linked from this publication (shown on any type)
    const childProblems = linkedFrom.filter((link) => link.type === 'PROBLEM');

    const isBookmarkButtonVisible = isVerifiedWithName && publicationVersion?.currentStatus === 'LIVE';

    const list = [];

    const showAdditionalInformation = Boolean(publicationVersion?.additionalInformation.length);
    const showReferences = Boolean(references?.length);
    const showChildProblems = Boolean(childProblems.length);
    const showParentPublications = Boolean(parentPublications.length);
    const showTopics = Boolean(publicationVersion?.topics?.length);
    const showPeerReviews = Boolean(thisVersionPeerReviews.length);
    const showEthicalStatement =
        publicationVersion?.publication.type === 'DATA' && Boolean(publicationVersion.ethicalStatement);
    const showRedFlags = !!flags.length;
    const isExemptFromReversioning =
        publicationVersion && Helpers.isPublicationVersionExemptFromReversioning(publicationVersion);
    const showVersionsAccordion = publication && !isExemptFromReversioning && !isLoadingControlRequests;

    if (showReferences) list.push({ title: 'References', href: 'references' });
    if (showChildProblems || showParentPublications)
        list.push({ title: 'Linked publications', href: 'linked-publications' });
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

    const languageIfNotEnglish = React.useMemo(
        () => (publicationVersion?.language ? Helpers.languageIfNotEnglish(publicationVersion.language) : undefined),
        [publicationVersion?.language]
    );

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

    const updateApproval = React.useCallback(
        async (confirm: boolean) => {
            setServerError('');
            try {
                await api.patch(
                    `/publication-versions/${publicationVersion?.id}/coauthors/${currentCoAuthor?.id}`,
                    {
                        confirm
                    },
                    user?.token
                );
            } catch (err) {
                setServerError(axios.isAxiosError(err) ? err.response?.data?.message : (err as Error).message);
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
            setIsLoading(true);

            try {
                await api.put(
                    `${Config.endpoints.publicationVersions}/${publicationVersion?.id}/status/LIVE`,
                    {},
                    Helpers.getJWT()
                );

                router.reload();
            } catch (err) {
                const errorMessage = axios.isAxiosError(err)
                    ? err.response?.data.message
                    : (err as Interfaces.JSONResponseError).message;
                setServerError(errorMessage);
                setIsLoading(false);
            }
        }
    }, [confirmation, publicationVersion?.id, router]);

    const handleUnlock = async () => {
        if (isUnlocking) {
            return;
        }

        const confirmed = await confirmation(
            'Are you sure you want to cancel and unlock?',
            'Unlocking this publication for editing will invalidate all existing author approvals. Authors will be invited to approve your new changes once you have finished editing',
            <OutlineIcons.LockOpenIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />,
            'Unlock',
            'Cancel'
        );

        if (confirmed) {
            setIsUnlocking(true);

            try {
                await api.put(
                    `${Config.endpoints.publicationVersions}/${publicationVersion?.id}/status/DRAFT`,
                    {},
                    Helpers.getJWT()
                );

                await router.push(
                    `${Config.urls.viewPublication.path}/${publicationVersion?.publication.id}/edit?step=0`
                );
            } catch (err) {
                const unlockError = err as Interfaces.JSONResponseError;
                setServerError(unlockError.message);
            }

            setIsUnlocking(false);
        }
    };

    const handleCancelApproval = async () => {
        const confirmed = await confirmation('Change your mind?', undefined, undefined, 'Yes, changes are needed');

        if (confirmed) {
            await updateApproval(false);
            await mutatePublicationVersion();
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
            await updateApproval(true);
            await mutatePublicationVersion();
        }
    };

    const handleOpenAffiliationsModal = React.useCallback(() => setIsEditingAffiliations(true), []);

    const handleCloseAffiliationsModal = React.useCallback(
        async (revalidate?: boolean) => {
            if (revalidate) {
                await mutatePublicationVersion();
            }
            setIsEditingAffiliations(false);
        },
        [mutatePublicationVersion]
    );

    const activeFlags = React.useMemo(() => flags.filter((flag) => !flag.resolved), [flags]);

    const inactiveFlags = React.useMemo(() => flags.filter((flag) => !!flag.resolved), [flags]);

    const uniqueRedFlagCategoryList = React.useMemo(
        () => Array.from(new Set(activeFlags?.map((flag) => flag.category))),
        [activeFlags]
    );

    const authors = publicationVersion?.coAuthors || [];

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

    const processedContent = useMemo(
        () => Helpers.renderLatexInHTMLString(publicationVersion?.content || ''),
        [publicationVersion?.content]
    );

    const pageTitle = publicationVersion ? `${publicationVersion.title} - ${Config.urls.viewPublication.title}` : '';
    const contentText = publicationVersion?.content ? Helpers.htmlToText(publicationVersion.content) : '';

    const suggestedFromPublication = props.activeCrosslink
        ? props.activeCrosslink.publications.find((pub) => pub.id === props.suggestedFromPublicationId)
        : null;

    // Collate all alerts that might be shown.
    const generateAlertComponents = (): React.ReactElement[] | null => {
        if (!publicationVersion) {
            return null;
        }
        let alerts: React.ReactElement[] = [];

        // Provide info about DRAFT publication status.
        if (publicationVersion.currentStatus === 'DRAFT') {
            const draftBanner = isCorrespondingAuthor ? (
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
                        href={`${Config.urls.viewPublication.path}/${publicationVersion.publication.id}/edit?step=0`}
                        className="mt-2 flex w-fit items-center space-x-2 text-sm text-white-50 underline"
                    >
                        <OutlineIcons.PencilSquareIcon className="w-4" />
                        <span>Edit Draft Publication</span>
                    </Components.Link>
                </Components.Alert>
            ) : (
                <Components.Alert
                    className="mb-4"
                    severity={alertSeverity}
                    title="This publication is currently being edited."
                >
                    <p className="mt-2 text-sm text-grey-800">
                        Once the corresponding author has made their changes, you will be notified to approve the draft
                        before it is published.
                    </p>
                </Components.Alert>
            );
            alerts.push(draftBanner);
        }

        // Indicate where control has been requested.
        if (hasAlreadyRequestedControl) {
            alerts.push(
                <Components.Alert
                    severity="INFO"
                    title="You have requested control over this publication version."
                    className="mb-4"
                />
            );
        }

        // For Peer Reviews, show details of the reviewed publication (there must only be one).
        if (publication?.type === 'PEER_REVIEW' && linkedTo.length === 1) {
            // Peer review is of current live version.
            if (linkedTo[0].parentVersionIsLatestLive) {
                alerts.push(
                    <Components.Alert severity="INFO" className="mb-4 text-white-100  dark:text-grey-50">
                        This is a peer review of the latest version of the following publication:{' '}
                        <Components.Link
                            href={`/publications/${linkedTo[0].id}`}
                            className="underline decoration-white-100 dark:decoration-grey-50"
                        >
                            {linkedTo[0].title}
                        </Components.Link>
                        .
                    </Components.Alert>
                );
            }
            // Peer review is of outdated version - render alert if we have all details.
            else if (linkedTo[0].parentVersionNumber && linkedTo[0].parentVersionId) {
                alerts.push(
                    <Components.Alert
                        severity="INFO"
                        className="mb-4 text-white-100  dark:text-grey-50"
                        details={[
                            'This peer review covers content that has been replaced by a newer version, and is therefore potentially outdated.'
                        ]}
                    >
                        This is a peer review of version {linkedTo[0].parentVersionNumber} of the following publication:{' '}
                        <Components.Link
                            href={`/publications/${linkedTo[0].id}/versions/${linkedTo[0].parentVersionId}`}
                            className="underline decoration-white-100 dark:decoration-grey-50"
                        >
                            {linkedTo[0].title}
                        </Components.Link>
                        .
                    </Components.Alert>
                );
            }
        }

        // General API error.
        if (serverError) {
            alerts.push(<Components.Alert severity="ERROR" className="mb-4" title={serverError} />);
        }

        // If user navigated here from a crosslinked page (defined by query param), show info and voting controls.
        if (props.activeCrosslink && suggestedFromPublication) {
            alerts.push(
                <Components.RelatedPublicationsVotingArea
                    key="related-publications-voting-area"
                    suggestedFromPublication={suggestedFromPublication}
                    crosslink={props.activeCrosslink}
                    vote={props.activeCrosslinkVote === null ? null : props.activeCrosslinkVote.vote}
                />
            );
        }

        return alerts;
    };

    const alerts = generateAlertComponents();

    return publication && publicationVersion ? (
        <>
            <Head>
                <title lang={languageIfNotEnglish}>{pageTitle}</title>
                <meta
                    name="description"
                    lang={languageIfNotEnglish}
                    content={props.publicationVersion.description || ''}
                />
                <meta name="og:title" lang={languageIfNotEnglish} content={Helpers.truncateString(pageTitle, 70)} />
                <meta
                    name="og:description"
                    lang={languageIfNotEnglish}
                    content={Helpers.truncateString(contentText, 200)}
                />
                <meta
                    name="keywords"
                    lang={languageIfNotEnglish}
                    content={props.publicationVersion.keywords?.join(', ') || ''}
                />
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
                <section
                    id={
                        publicationVersion.user.role === 'ORGANISATION'
                            ? `organisation-${publicationVersion.user.id}-publication`
                            : undefined
                    }
                    className="col-span-12 lg:col-span-8 xl:col-span-9"
                >
                    {alerts}
                    {showApprovalsTracker && (
                        <>
                            <Components.PublicationPageCoAuthoringActions
                                publicationVersion={publicationVersion}
                                isCorrespondingAuthor={isCorrespondingAuthor}
                                isReadyForPublish={isReadyForPublish}
                                isLoading={isLoading}
                                onUnlockPublication={handleUnlock}
                                onApprove={handleApproval}
                                onCancelApproval={handleCancelApproval}
                                onPublish={handlePublish}
                                onEditAffiliations={handleOpenAffiliationsModal}
                                setServerError={setServerError}
                            />
                            <div className="pb-16">
                                <Components.ApprovalsTracker
                                    publicationVersion={publicationVersion}
                                    onError={setServerError}
                                    onEditAffiliations={handleOpenAffiliationsModal}
                                    refreshPublicationVersionData={mutatePublicationVersion}
                                />
                            </div>
                            {author && (
                                <Components.EditAffiliationsModal
                                    author={author}
                                    autoUpdate={isCorrespondingAuthor || !author.confirmedCoAuthor}
                                    open={isEditingAffiliations}
                                    onClose={handleCloseAffiliationsModal}
                                />
                            )}
                        </>
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
                            {publicationVersion.isLatestLiveVersion && (
                                <Components.PublicationPageHeaderActions
                                    authorIds={authors.flatMap((coAuthor) =>
                                        coAuthor.linkedUser ? [coAuthor.linkedUser] : []
                                    )}
                                    publicationId={publication.id}
                                    publicationType={publication.type}
                                />
                            )}
                            <h1
                                lang={languageIfNotEnglish}
                                className="col-span-7 mb-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-normal"
                            >
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

                        <Components.AuthorList className="mb-4" authors={confirmedAuthors} />

                        <Framer.AnimatePresence>
                            {/** API will only return versions that the current user has permission to see */}
                            {publication && publication.versions.length !== publicationVersion.versionNumber && (
                                <Framer.motion.p
                                    className="mb-4 text-sm leading-relaxed dark:text-white-50"
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                >
                                    <OutlineIcons.ExclamationCircleIcon className="inline w-6 stroke-2 align-bottom text-red-600 dark:text-red-500" />{' '}
                                    A newer version of this publication exists
                                </Framer.motion.p>
                            )}
                        </Framer.AnimatePresence>

                        <div className="block space-y-8 lg:hidden">
                            {showVersionsAccordion && (
                                <Components.VersionsAccordion
                                    id="mobile-versions-accordion"
                                    versions={publication.versions}
                                    selectedVersion={publicationVersion}
                                    controlRequests={controlRequests}
                                    onServerError={setServerError}
                                    onUnlockPublication={handleUnlock}
                                />
                            )}

                            {publicationVersion && (
                                <SidebarCard
                                    publicationVersion={publicationVersion}
                                    linkedFrom={linkedFrom}
                                    sectionList={sectionList}
                                    flags={flags}
                                />
                            )}

                            <Components.RelatedPublications
                                id="mobile-related-publications"
                                publicationId={props.publicationId}
                                type={publication.type}
                                crosslinks={crosslinks}
                                refreshCrosslinks={mutateCrosslinks}
                            />
                        </div>
                    </header>

                    {/** Full text */}
                    <Components.ContentSection id="main-text" hasBreak isMainText>
                        <div lang={languageIfNotEnglish}>
                            <Components.ParseHTML content={processedContent} />
                        </div>
                    </Components.ContentSection>

                    {/** Additional information */}
                    {showAdditionalInformation && (
                        <Components.ContentSection
                            id="additional-information"
                            title="Additional parts of this work hosted elsewhere"
                            hasBreak
                        >
                            <div className="flex flex-col space-y-8">
                                {publicationVersion.additionalInformation.map((additionalInfoEntry) => (
                                    <Components.AdditionalInformationCard
                                        key={additionalInfoEntry.id}
                                        additionalInformation={additionalInfoEntry}
                                        publicationLanguage={languageIfNotEnglish}
                                    />
                                ))}
                            </div>
                        </Components.ContentSection>
                    )}

                    {/* References */}
                    {showReferences && (
                        <Components.ContentSection id="references" title="References" hasBreak>
                            {references.map((reference) => (
                                <div lang={languageIfNotEnglish} key={reference.id} className="py-2 break-anywhere">
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

                    {(showParentPublications || showChildProblems) && (
                        <div id="linked-publications">
                            {/* Parent publications */}
                            {showParentPublications && (
                                <Components.ContentSection
                                    id="publications-linked-to"
                                    title="Publications above this in the hierarchy"
                                    hasBreak
                                >
                                    <Components.List ordered={false}>
                                        {parentPublications.map((link) => (
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
                                {publicationVersion.topics.map((topic) => (
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
                            title={`Peer reviews created from this version of this ${Helpers.formatPublicationType(
                                publicationVersion.publication.type
                            )}`}
                            hasBreak
                        >
                            <Components.List ordered={false}>
                                {thisVersionPeerReviews.map((link) => (
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
                                <p
                                    lang={languageIfNotEnglish}
                                    className="block text-grey-800 transition-colors duration-500 dark:text-white-50"
                                >
                                    {publicationVersion.ethicalStatement && parse(publicationVersion.ethicalStatement)}
                                </p>
                                {!!publicationVersion.ethicalStatementFreeText && (
                                    <p
                                        lang={languageIfNotEnglish}
                                        className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100"
                                    >
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
                                <p
                                    lang={languageIfNotEnglish}
                                    className="mb-2 block text-grey-800 transition-colors duration-500 dark:text-white-50"
                                >
                                    {parse(publicationVersion.dataPermissionsStatement)}
                                </p>
                                {publicationVersion.dataPermissionsStatementProvidedBy?.length && (
                                    <p
                                        lang={languageIfNotEnglish}
                                        className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100"
                                    >
                                        {parse(publicationVersion.dataPermissionsStatementProvidedBy)}
                                    </p>
                                )}
                            </>
                        </Components.ContentSection>
                    )}

                    {/* Data access statement */}
                    {!!publicationVersion.dataAccessStatement && (
                        <Components.ContentSection id="data-access-statement" title="Data access statement" hasBreak>
                            <p
                                lang={languageIfNotEnglish}
                                className="block text-grey-800 transition-colors duration-500 dark:text-white-50"
                            >
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
                                    <p
                                        lang={languageIfNotEnglish}
                                        className="block pt-2 leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100"
                                    >
                                        {parse(publicationVersion.fundersStatement)}
                                    </p>
                                ) : null}
                            </>
                        )}
                    </Components.ContentSection>

                    {/** Conflict of interest */}
                    <Components.ContentSection id="coi" title="Conflict of interest">
                        <p
                            lang={publicationVersion.conflictOfInterestText ? languageIfNotEnglish : undefined}
                            className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100"
                        >
                            {publicationVersion.conflictOfInterestStatus
                                ? publicationVersion.conflictOfInterestText
                                : `This ${Helpers.formatPublicationType(
                                      publicationVersion.publication.type
                                  )} does not have any specified conflicts of interest.`}
                        </p>
                    </Components.ContentSection>
                </section>
                <aside className="relative hidden lg:col-span-4 lg:block xl:col-span-3">
                    <div className="space-y-8">
                        {showVersionsAccordion && (
                            <Components.VersionsAccordion
                                id="desktop-versions-accordion"
                                versions={publication.versions}
                                selectedVersion={publicationVersion}
                                controlRequests={controlRequests}
                                onServerError={setServerError}
                                onUnlockPublication={handleUnlock}
                            />
                        )}
                        <SidebarCard
                            publicationVersion={publicationVersion}
                            linkedFrom={linkedFrom}
                            sectionList={sectionList}
                            flags={flags}
                        />
                        <Components.RelatedPublications
                            id="desktop-related-publications"
                            publicationId={props.publicationId}
                            crosslinks={crosslinks}
                            type={publication.type}
                            refreshCrosslinks={mutateCrosslinks}
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
