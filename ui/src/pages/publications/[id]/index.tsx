import React from 'react';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';
import jwt from 'jsonwebtoken';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

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
        <Components.PublicationSidebarCardRatings id={props.publication.id} type={props.publication.type} />
        <Components.PublicationSidebarCardActions publication={props.publication} />
        <Components.PublicationSidebarCardSections sectionList={props.sectionList} />
    </div>
);

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    let publication: Interfaces.Publication | null = null;
    let bookmark: boolean = false;
    let error: string | null = null;

    const cookies = context.req.cookies;
    const token = cookies[Config.keys.cookieStorage.token];

    try {
        const response = await api.get(`${Config.endpoints.publications}/${requestedId}`, token);
        publication = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    try {
        const response = await api.get(`${Config.endpoints.publications}/${requestedId}/bookmark`, token);
        bookmark = response.data;
    } catch (err) {
        console.log(err);
    }

    if (!publication || error) {
        return {
            notFound: true
        };
    }

    let isBookmarkVisible = false;

    if (token) {
        //check if user is author / co author. if so the bookmark icon won't display
        const currentUser = jwt.decode(token) as any;

        if (currentUser.id) {
            const isCoAuthor = publication?.coAuthors.some((author) => author.id == currentUser.id);
            const isOwner = currentUser.id === publication.createdBy;

            if (!isCoAuthor && !isOwner) {
                isBookmarkVisible = true;
            }
        }
    }

    return {
        props: {
            publication,
            bookmark,
            isBookmarkVisible
        }
    };
};

type Props = {
    publication: Interfaces.Publication;
    bookmark: boolean;
    isBookmarkVisible: boolean;
};

const Publication: Types.NextPage<Props> = (props): React.ReactElement => {
    // TODO: This i causing a bug when switching between publications.
    // We either only use props publication, or inform swr when mutation occur.
    const [publication, setPublication] = React.useState(props.publication);

    const [coAuthorModalState, setCoAuthorModalState] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(props.bookmark ? true : false);

    const linkedPublicationsTo = publication.linkedTo;
    const linkedPublicationsFrom = publication.linkedFrom.filter(
        (link) => link.publicationFromRef.type !== 'PROBLEM' && link.publicationFromRef.type !== 'PEER_REVIEW'
    );

    const peerReviews = publication.linkedFrom.filter((link) => link.publicationFromRef.type === 'PEER_REVIEW');
    const problems = publication.linkedFrom.filter((link) => link.publicationFromRef.type === 'PROBLEM');

    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);

    const list = [];

    const showProblems = problems.length && props.publication.type !== 'PEER_REVIEW';
    const showPeerReviews = peerReviews.length && props.publication.type !== 'PEER_REVIEW';
    const showEthicalStatement = props.publication.type === 'DATA';
    const showRedFlags = !!props.publication.publicationFlags.length;

    if (showProblems) list.push({ title: 'Linked problems', href: 'problems' });
    if (showPeerReviews) list.push({ title: 'Peer reviews', href: 'peer-reviews' });
    if (showEthicalStatement) list.push({ title: 'Ethical statement', href: 'ethical-statement' });
    if (showRedFlags) list.push({ title: 'Red flags', href: 'red-flags' });

    const sectionList = [
        { title: 'Publication chain', href: 'publication-chain' },
        { title: 'Main text', href: 'main-text' },
        ...list,
        { title: 'Funders', href: 'funders' },
        { title: 'Conflict of interest', href: 'coi' }
    ];

    const currentCoAuthor = React.useMemo(
        () => publication.coAuthors.find((coAuthor) => coAuthor.linkedUser === user?.id),
        [publication, user?.id]
    );

    const alertSeverity = React.useMemo(() => {
        if (publication.user.id === user?.id) {
            return 'INFO';
        }
        if (currentCoAuthor?.confirmedCoAuthor) {
            return 'SUCCESS';
        }
        if (!currentCoAuthor?.confirmedCoAuthor) {
            return 'WARNING';
        }
        return 'INFO';
    }, [publication, user?.id, currentCoAuthor?.confirmedCoAuthor]);

    const getPublication = async () => {
        const result = await api.get(`/publications/${publication.id}`, user?.token);
        setPublication(result.data);
    };

    const updateCoAuthor = React.useCallback(
        async (confirm: boolean) => {
            await api.patch(
                `/publications/${publication.id}/coauthor`,
                {
                    confirm
                },
                user?.token
            );
        },
        [publication.id, user?.token]
    );

    const onBookmarkHandler = async () => {
        if (isBookmarked) {
            //delete the bookmark
            try {
                await api.destroy(`publications/${publication.id}/bookmark`, user?.token);
                setIsBookmarked(false);
            } catch (err) {
                console.log(err);
            }
        } else {
            //create the bookmark
            try {
                await api.post(`publications/${publication.id}/bookmark`, {}, user?.token);
                setIsBookmarked(true);
            } catch (err) {
                console.log(err);
            }
        }
    };

    // TODO This is not reactive as it replies on props, so switching page is fine, but when mutations occur, then no.
    //      This need to rely on some state which can revalidated, so when a flag is created it is instantly shown,
    //      not after refresh.
    const activeFlags = React.useMemo(
        () => props.publication.publicationFlags.filter((flag) => !flag.resolved),
        [props.publication]
    );

    // TODO Same as above.
    const inactiveFlags = React.useMemo(
        () => publication.publicationFlags.filter((flag) => !!flag.resolved),
        [props.publication]
    );

    // TODO Same as above.
    const uniqueRedFlagCategoryList = React.useMemo(
        () => Array.from(new Set(activeFlags.map((flag) => flag.category))),
        [activeFlags]
    );

    return (
        <>
            <Head>
                <meta name="description" content={publication.description || ''} />
                <meta name="keywords" content={publication.keywords.join(', ') || ''} />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${publication.url_slug}`} />
                <title>{`${publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Components.Modal
                open={coAuthorModalState}
                setOpen={setCoAuthorModalState}
                positiveActionCallback={async () => {
                    await updateCoAuthor(true);
                    await getPublication();
                    setCoAuthorModalState(false);
                }}
                negativeActionCallback={async () => {
                    await updateCoAuthor(false);
                    await getPublication();
                    setCoAuthorModalState(false);
                }}
                positiveButtonText="Yes, this is ready to publish"
                cancelButtonText="No, changes are needed"
                title="Do you approve this publication?"
            />
            <Layouts.Publication fixedHeader={false}>
                <section className="col-span-9">
                    {publication.currentStatus === 'DRAFT' && (
                        <Components.Alert
                            className="mb-4"
                            severity={alertSeverity}
                            title="This is a draft publication only visible to authors. "
                        >
                            {publication.user.id === user?.id ? (
                                <Components.Link
                                    openNew={false}
                                    title="Edit publication"
                                    href={`${Config.urls.viewPublication.path}/${publication.id}/edit?step=4`}
                                    className="mt-2 flex w-fit items-center space-x-2 text-sm text-white-50 underline"
                                >
                                    <OutlineIcons.PencilAltIcon className="h-4 w-4" />
                                    <span>Edit or publish draft publication</span>
                                </Components.Link>
                            ) : (
                                <>
                                    {currentCoAuthor?.confirmedCoAuthor ? (
                                        <p className="mt-2 text-sm text-white-50">
                                            You have approved this publication. Would you like to{' '}
                                            <button
                                                onClick={() => {
                                                    setCoAuthorModalState(true);
                                                }}
                                                className="inline-block font-bold underline"
                                            >
                                                change your mind
                                            </button>
                                            ?
                                        </p>
                                    ) : (
                                        <>
                                            <p className="mt-2 text-sm text-grey-800">
                                                You have not yet approved this publication. Would you like to{' '}
                                                <button
                                                    onClick={() => {
                                                        setCoAuthorModalState(true);
                                                    }}
                                                    className="inline-block font-bold underline"
                                                >
                                                    approve
                                                </button>
                                                ?
                                            </p>
                                            <p className="mt-2 text-sm text-grey-800">
                                                If any changes are required, please discuss with the submitting author.
                                            </p>
                                        </>
                                    )}
                                </>
                            )}
                        </Components.Alert>
                    )}
                    {!!uniqueRedFlagCategoryList.length && (
                        <Components.Alert
                            title="This publication has active red flags for:"
                            severity="RED_FLAG"
                            className="mb-4"
                        >
                            <ul className="mt-3 mb-4">
                                {uniqueRedFlagCategoryList.map((category) => (
                                    <li key={category} className="text-sm text-white-100">
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
                                className="mt-2 block rounded border-transparent text-sm font-medium text-white-100 underline outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                            >
                                View flags
                            </button>
                        </Components.Alert>
                    )}
                    <header>
                        <div className="grid w-full grid-cols-8">
                            <h1 className="col-span-7 mb-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-normal">
                                {publication.title}
                            </h1>
                            {props.isBookmarkVisible && (
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

                        <p className="mb-8">
                            <Components.Link
                                href={`${Config.urls.viewUser.path}/${publication.user.id}`}
                                className="2 text-normal w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                            >
                                <>
                                    {publication.user.firstName[0]}. {publication.user.lastName}
                                </>
                            </Components.Link>
                            {publication.coAuthors.map(
                                (coAuthor) =>
                                    coAuthor.user && (
                                        <>
                                            <Components.Link
                                                href={`${Config.urls.viewUser.path}/${coAuthor.user.orcid}`}
                                                className="2 text-normal mb-8 w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                            >
                                                <>
                                                    , {coAuthor.user.firstName[0]}. {coAuthor.user.lastName}
                                                </>
                                            </Components.Link>
                                        </>
                                    )
                            )}
                        </p>

                        {publication.type !== 'PEER_REVIEW' && (
                            <div className="hidden xl:block">
                                <Components.PublicationVisualChain highlighted={publication.type} />
                            </div>
                        )}

                        <div className="block xl:hidden">
                            <SidebarCard publication={props.publication} sectionList={sectionList} />
                        </div>
                    </header>

                    <Components.PublicationContentSection id="publication-chain" title="Publication chain" hasBreak>
                        <>
                            <p className="mb-8 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                All Octopus publications are linked in a chain aligned with the stages of the research
                                process. Since this publication is a{' '}
                                <Components.Link
                                    href="#"
                                    className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                >
                                    <>{Helpers.formatPublicationType(publication.type)}</>
                                </Components.Link>
                                .{' '}
                                {publication.type !== 'PROBLEM' && (
                                    <>
                                        The publications preceeding this are{' '}
                                        <Components.Link
                                            href="#"
                                            className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                        >
                                            <>
                                                {Helpers.formatPublicationType(
                                                    Helpers.findPreviousPublicationType(publication.type)
                                                )}
                                            </>
                                        </Components.Link>
                                        .
                                    </>
                                )}{' '}
                                {publication.type !== 'PEER_REVIEW' && publication.type !== 'REAL_WORLD_APPLICATION' && (
                                    <>
                                        The publications following this are{' '}
                                        <Components.Link
                                            href="#"
                                            className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                        >
                                            <>
                                                {Helpers.formatPublicationType(
                                                    Helpers.findNextPublicationType(publication.type)
                                                )}
                                            </>
                                        </Components.Link>
                                        .
                                    </>
                                )}
                            </p>
                            {linkedPublicationsTo.length || linkedPublicationsFrom.length ? (
                                <Components.RenderLinks to={linkedPublicationsTo} from={linkedPublicationsFrom} />
                            ) : (
                                <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    {`This ${Helpers.formatPublicationType(
                                        publication.type
                                    )} does not have any linked to publications.`}
                                </p>
                            )}
                        </>
                    </Components.PublicationContentSection>

                    {/** Full text */}
                    <Components.PublicationContentSection id="main-text" hasBreak>
                        <div className="mb-4">
                            <Components.ParseHTML content={publication.content ?? ''} />
                        </div>
                    </Components.PublicationContentSection>

                    {/* Linked from problems */}
                    {!!showProblems && (
                        <Components.PublicationContentSection
                            id="problems"
                            title={`Problems created from this ${Helpers.formatPublicationType(publication.type)}`}
                            hasBreak
                        >
                            <Components.List ordered={false}>
                                {problems.map((link) => (
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
                        </Components.PublicationContentSection>
                    )}

                    {/* Linked peer reviews */}
                    {!!showPeerReviews && (
                        <Components.PublicationContentSection
                            id="peer-reviews"
                            title={`Peer reviews created from this ${Helpers.formatPublicationType(publication.type)}`}
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
                        </Components.PublicationContentSection>
                    )}

                    {/* Ethical statement */}
                    {!!showEthicalStatement && (
                        <Components.PublicationContentSection id="ethical-statement" title="Ethical statement" hasBreak>
                            <>
                                <p className="block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    {props.publication.ethicalStatement
                                        ? 'The results and data in this publication involved human or animal subjects.'
                                        : 'The results and data in this publication does not involve human or animal subjects.'}
                                </p>
                                {!!props.publication.ethicalStatementFreeText && (
                                    <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                        {props.publication.ethicalStatementFreeText}
                                    </p>
                                )}
                            </>
                        </Components.PublicationContentSection>
                    )}

                    {/* Red flags */}
                    {showRedFlags && (
                        <Components.PublicationContentSection id="red-flags" title="Red flags" hasBreak>
                            <div className="mt-6 space-y-8">
                                {!!activeFlags.length && (
                                    <div>
                                        <h2 className="mb-1 font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 ">
                                            Active
                                        </h2>
                                        <div className="space-y-4">
                                            {activeFlags.map((flag) => (
                                                <Components.FlagPreview
                                                    key={flag.id}
                                                    publicationId={props.publication.id}
                                                    flag={flag}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!!inactiveFlags.length && (
                                    <div>
                                        <h2 className="mb-1 font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 ">
                                            Resolved
                                        </h2>
                                        <div className="space-y-4">
                                            {inactiveFlags.map((flag) => (
                                                <Components.FlagPreview
                                                    key={flag.id}
                                                    publicationId={props.publication.id}
                                                    flag={flag}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Components.PublicationContentSection>
                    )}
                    {/* Publication funders section */}
                    <Components.PublicationContentSection id="funders" title="Funders" hasBreak>
                        {publication.funders.length ? (
                            <>
                                <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    This {Helpers.formatPublicationType(publication.type)} has the following funder
                                    {publication.funders.length > 1 && 's'}:
                                </p>
                                <ul>
                                    {publication.funders.map((funder) => {
                                        return (
                                            <li key={funder.id} className="ml-7 mt-1 list-disc">
                                                <a href={funder.link} className=" text-teal-600 hover:underline">
                                                    {funder.name}
                                                </a>{' '}
                                                - {funder.city}, {funder.country}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </>
                        ) : (
                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                This {Helpers.formatPublicationType(publication.type)} has no funders.
                            </p>
                        )}
                    </Components.PublicationContentSection>

                    {/** Conflict of interest */}
                    <Components.PublicationContentSection id="coi" title="Conflict of interest">
                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                            {publication.conflictOfInterestStatus
                                ? publication.conflictOfInterestText
                                : `This ${Helpers.formatPublicationType(
                                      publication.type
                                  )} does not have any specified conflicts of interest.`}
                        </p>
                    </Components.PublicationContentSection>
                </section>

                <aside className="relative col-span-3 hidden xl:block">
                    <div className="sticky top-12 space-y-8">
                        <SidebarCard publication={props.publication} sectionList={sectionList} />
                    </div>
                </aside>
            </Layouts.Publication>
        </>
    );
};

export default Publication;
