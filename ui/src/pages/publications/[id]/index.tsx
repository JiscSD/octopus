import React, { useMemo } from 'react';
import parse from 'html-react-parser';
import Head from 'next/head';
import useSWR from 'swr';

import * as OutlineIcons from '@heroicons/react/outline';
import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Types from '@types';
import * as Assets from '@assets';

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
    let bookmark: boolean = false;
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

    return {
        props: {
            fallback: {
                [`${Config.endpoints.publications}/${requestedId}`]: publication
            },
            userToken: token || '',
            bookmark,
            publicationId: publication.id
        }
    };
};

type Props = {
    publication: Interfaces.Publication;
    publicationId: string;
    bookmark: boolean;
    userToken: string;
};

const Publication: Types.NextPage<Props> = (props): React.ReactElement => {
    const { data: publicationData, mutate } = useSWR<Interfaces.Publication>(
        `${Config.endpoints.publications}/${props.publicationId}`,
        (url) => api.get(url, props.userToken || '').then((data) => data.data)
    );

    const { data: references = [] } = useSWR<Interfaces.Reference[]>(
        `${Config.endpoints.publications}/${props.publicationId}/reference`,
        (url) => api.get(url, props.userToken).then(({ data }) => data)
    );

    const [coAuthorModalState, setCoAuthorModalState] = React.useState(false);
    const [isBookmarked, setIsBookmarked] = React.useState(props.bookmark ? true : false);

    const peerReviews =
        publicationData?.linkedFrom?.filter((link) => link.publicationFromRef.type === 'PEER_REVIEW') || [];

    // problems this publication is linked to
    const parentProblems = publicationData?.linkedTo?.filter((link) => link.publicationToRef.type === 'PROBLEM') || [];

    // problems linked from this publication
    const childProblems =
        publicationData?.linkedFrom?.filter((link) => link.publicationFromRef.type === 'PROBLEM') || [];

    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const isBookmarkVisible = useMemo(() => {
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

    const list = [];

    const showReferences = Boolean(references?.length);
    const showChildProblems = Boolean(childProblems?.length);
    const showParentProblems = Boolean(parentProblems?.length);
    const showPeerReviews = Boolean(peerReviews?.length);
    const showEthicalStatement = publicationData?.type === 'DATA';
    const showRedFlags = !!publicationData?.publicationFlags?.length;

    if (showReferences) list.push({ title: 'References', href: 'references' });
    if (showChildProblems || showParentProblems) list.push({ title: 'Linked problems', href: 'problems' });
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
            await api.patch(
                `/publications/${publicationData?.id}/coauthor-confirmation`,
                {
                    confirm
                },
                user?.token
            );
        },
        [publicationData?.id, user?.token]
    );

    const onBookmarkHandler = async () => {
        if (isBookmarked) {
            //delete the bookmark
            try {
                await api.destroy(`publications/${publicationData?.id}/bookmark`, user?.token);
                setIsBookmarked(false);
            } catch (err) {
                console.log(err);
            }
        } else {
            //create the bookmark
            try {
                await api.post(`publications/${publicationData?.id}/bookmark`, {}, user?.token);
                setIsBookmarked(true);
            } catch (err) {
                console.log(err);
            }
        }
    };

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

    return publicationData ? (
        <>
            <Head>
                <meta name="description" content={publicationData.description || ''} />
                <meta name="keywords" content={publicationData.keywords?.join(', ') || ''} />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${publicationData.id}`} />
                <title>{`${publicationData.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Components.Modal
                open={coAuthorModalState}
                setOpen={setCoAuthorModalState}
                positiveActionCallback={async () => {
                    await updateCoAuthor(true);
                    await mutate();
                    setCoAuthorModalState(false);
                }}
                negativeActionCallback={async () => {
                    await updateCoAuthor(false);
                    await mutate();
                    setCoAuthorModalState(false);
                }}
                positiveButtonText="Yes, this is ready to publish"
                cancelButtonText="No, changes are needed"
                title="Do you approve this publication?"
            />

            <Layouts.Publication
                fixedHeader={false}
                publicationId={publicationData.type !== 'PEER_REVIEW' ? publicationData.id : undefined}
            >
                <section className="col-span-12 lg:col-span-8 xl:col-span-9">
                    {publicationData.currentStatus === 'DRAFT' && (
                        <Components.Alert
                            className="mb-4"
                            severity={alertSeverity}
                            title="This is a draft publication only visible to authors. "
                        >
                            {publicationData.user.id === user?.id ? (
                                <Components.Link
                                    openNew={false}
                                    title="Edit publication"
                                    href={`${Config.urls.viewPublication.path}/${publicationData.id}/edit?step=4`}
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
                            {isBookmarkVisible && (
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
                            <div className="flex w-fit items-center">
                                <Components.Link
                                    href={`${Config.urls.viewUser.path}/${publicationData.user?.id}`}
                                    className="w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                >
                                    <>
                                        {publicationData.user?.firstName[0]}. {publicationData.user?.lastName}
                                    </>
                                </Components.Link>
                                {publicationData.user.id !== 'octopus' && (
                                    <Components.Link
                                        className="ml-2 flex w-fit items-center"
                                        href={`https://orcid.org/${publicationData?.user?.orcid}`}
                                        openNew={true}
                                    >
                                        <Assets.OrcidLogoIcon width={24} />
                                    </Components.Link>
                                )}
                                {publicationData.coAuthors?.length > 0 && (
                                    <span className="leading-relaxed text-teal-600 transition-colors duration-500 dark:text-teal-400">
                                        ,
                                    </span>
                                )}
                            </div>
                            {publicationData.coAuthors
                                ?.filter((coAuthor) => coAuthor?.user)
                                .map((coAuthor, index) => (
                                    <div key={coAuthor.id} className="flex w-fit items-center">
                                        <Components.Link
                                            href={`${Config.urls.viewUser.path}/${coAuthor?.linkedUser}`}
                                            className="w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                        >
                                            <>
                                                {coAuthor?.user?.firstName[0]}. {coAuthor?.user?.lastName}
                                            </>
                                        </Components.Link>
                                        <Components.Link
                                            className="ml-2 flex w-fit items-center"
                                            href={`https://orcid.org/${coAuthor?.user?.orcid}`}
                                            openNew={true}
                                        >
                                            <Assets.OrcidLogoIcon width={24} />
                                        </Components.Link>
                                        {index < publicationData.coAuthors?.length - 1 && (
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
                    <Components.PublicationContentSection id="main-text" hasBreak isMainText>
                        <div>
                            <Components.ParseHTML content={publicationData.content ?? ''} />
                        </div>
                    </Components.PublicationContentSection>

                    {/* References */}
                    {showReferences && (
                        <Components.PublicationContentSection id="references" title="References" hasBreak>
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
                        </Components.PublicationContentSection>
                    )}

                    {(showParentProblems || showChildProblems) && (
                        <div id="problems">
                            {/* Parent problems */}
                            {showParentProblems && (
                                <Components.PublicationContentSection
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
                                </Components.PublicationContentSection>
                            )}

                            {/* Child problems */}
                            {showChildProblems && (
                                <Components.PublicationContentSection
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
                                </Components.PublicationContentSection>
                            )}
                        </div>
                    )}

                    {/* Linked peer reviews */}
                    {!!showPeerReviews && (
                        <Components.PublicationContentSection
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
                        </Components.PublicationContentSection>
                    )}

                    {/* Ethical statement */}
                    {!!showEthicalStatement && (
                        <Components.PublicationContentSection id="ethical-statement" title="Ethical statement" hasBreak>
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
                        </Components.PublicationContentSection>
                    )}

                    {/* Data permissions statement */}
                    {!!publicationData.dataPermissionsStatement && (
                        <Components.PublicationContentSection
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
                        </Components.PublicationContentSection>
                    )}

                    {/* Data access statement */}
                    {!!publicationData.dataAccessStatement && (
                        <Components.PublicationContentSection
                            id="data-access-statement"
                            title="Data access statement"
                            hasBreak
                        >
                            <p className="block text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {parse(publicationData.dataAccessStatement)}
                            </p>
                        </Components.PublicationContentSection>
                    )}

                    {/* Self declaration */}
                    {publicationData.selfDeclaration && (
                        <Components.PublicationContentSection id="self-declaration" title="Self declaration" hasBreak>
                            <p className="mt-4 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                {publicationData.type === 'PROTOCOL' &&
                                    'Data has not yet been collected according to this method/protocol.'}
                                {publicationData.type === 'HYPOTHESIS' &&
                                    'Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)'}
                            </p>
                        </Components.PublicationContentSection>
                    )}

                    {/* Red flags */}
                    {showRedFlags && (
                        <Components.PublicationContentSection id="red-flags" title="Red flags" hasBreak>
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
                        </Components.PublicationContentSection>
                    )}
                    {/* Publication funders section */}
                    <Components.PublicationContentSection id="funders" title="Funders" hasBreak>
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
                    </Components.PublicationContentSection>

                    {/** Conflict of interest */}
                    <Components.PublicationContentSection id="coi" title="Conflict of interest">
                        <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                            {publicationData.conflictOfInterestStatus
                                ? publicationData.conflictOfInterestText
                                : `This ${Helpers.formatPublicationType(
                                      publicationData.type
                                  )} does not have any specified conflicts of interest.`}
                        </p>
                    </Components.PublicationContentSection>
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
