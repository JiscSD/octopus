import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    let publication: Interfaces.Publication | null = null;
    let error: string | null = null;

    try {
        const response = await api.get(`${Config.endpoints.publications}/${requestedId}`, undefined);
        publication = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!publication || error) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            publication
        }
    };
};

type RenderLinksProps = {
    to: Interfaces.LinkTo[];
    from: Interfaces.LinkFrom[];
};

const RenderLinks: React.FC<RenderLinksProps> = (props): React.ReactElement => {
    const cache: Types.PublicationType[] = [];
    const links: { id: string; ref: Interfaces.PublicationRef }[] = [];

    props.to.map((item) => links.push({ id: item.id, ref: item.publicationToRef }));
    props.from.map((item) => links.push({ id: item.id, ref: item.publicationFromRef }));

    return (
        <Components.List ordered={true}>
            {links.map((link) => {
                let show = false;
                if (!cache.includes(link.ref.type)) {
                    cache.push(link.ref.type);
                    show = true;
                }

                return (
                    <Components.ListItem
                        key={link.id}
                        className="flex items-center font-semibold leading-3 text-pink-500"
                    >
                        <Components.PublicationLink publicationRef={link.ref} showType={show} />
                    </Components.ListItem>
                );
            })}
        </Components.List>
    );
};

type Props = {
    publication: Interfaces.Publication;
};

const Publication: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();

    const linkedPublicationsTo = props.publication.linkedTo;
    const linkedPublicationsFrom = props.publication.linkedFrom.filter(
        (link) => link.publicationFromRef.type !== 'PROBLEM' && link.publicationFromRef.type !== 'PEER_REVIEW'
    );

    const peerReviews = props.publication.linkedFrom.filter((link) => link.publicationFromRef.type === 'PEER_REVIEW');
    const problems = props.publication.linkedFrom.filter((link) => link.publicationFromRef.type === 'PROBLEM');

    const list = [];

    const showProblems = problems.length && props.publication.type !== 'PEER_REVIEW';
    const showPeerReviews = peerReviews.length && props.publication.type !== 'PEER_REVIEW';

    if (showProblems) list.push({ title: 'Problems', href: 'problems' });

    if (showPeerReviews) list.push({ title: 'Peer reviews', href: 'peer-reviews' });

    const sectionList = [
        { title: 'Authors', href: 'authors' },
        { title: 'Linked publications', href: 'linked-publications' },
        ...list,
        { title: 'Full text', href: 'full-text' },
        { title: 'Licence', href: 'licence' },
        { title: 'Conflict of interest', href: 'coi' }
    ];

    return (
        <>
            <Head>
                <meta name="description" content={props.publication.description || ''} />
                <meta name="keywords" content={props.publication.keywords.join(', ') || ''} />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${props.publication.url_slug}`} />
                <title>{`${props.publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto grid grid-cols-1 px-8 py-8 lg:grid-cols-12 lg:gap-4 lg:pt-16 lg:pb-8">
                    <div className="lg:col-span-8 xl:col-span-10">
                        <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                            {Helpers.formatPublicationType(props.publication.type)}
                        </span>
                        <h1 className="mb-12 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:w-4/5 xl:text-4xl xl:leading-normal">
                            {props.publication.title}
                        </h1>

                        {props.publication.type !== 'PEER_REVIEW' && (
                            <Components.PublicationVisualChain highlighted={props.publication.type} />
                        )}

                        <div className="mt-12 print:hidden lg:flex">
                            <Components.Button
                                title="Download as PDF"
                                onClick={() => window.print()}
                                className="mr-6 mb-4 lg:mb-0"
                                iconPosition="RIGHT"
                                icon={
                                    <OutlineIcons.DocumentDownloadIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                }
                            />
                            {props.publication.type !== 'PEER_REVIEW' && (
                                <Components.Button
                                    title="Write a review"
                                    onClick={() => {
                                        router.push({
                                            pathname: `${Config.urls.createPublication.path}`,
                                            query: {
                                                for: props.publication.id,
                                                type: 'PEER_REVIEW'
                                            }
                                        });
                                    }}
                                    className="mr-6 mb-4 lg:mb-0"
                                    iconPosition="RIGHT"
                                    icon={
                                        <OutlineIcons.PencilIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <aside className="relative mb-8 mt-8 flex items-center justify-end print:hidden lg:col-span-4 lg:mt-0 lg:mb-0 xl:col-span-2">
                        <Components.PublicationRatings publication={props.publication} />
                    </aside>
                </header>

                <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                    <aside className="col-span-2 hidden pt-12 print:hidden lg:block">
                        <Components.PublicationSidebar jumpToList={sectionList} />
                    </aside>
                    <article className="lg:col-span-6">
                        {/** Authors */}
                        <Components.PublicationContentSection id="authors" title="Authors">
                            <Components.Link
                                href={`${Config.urls.viewUser.path}/${props.publication.user.id}`}
                                className="block w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400 "
                            >
                                <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    {props.publication.user.firstName[0]}. {props.publication.user.lastName}
                                </p>
                            </Components.Link>
                        </Components.PublicationContentSection>

                        {/* Linked publications */}
                        <Components.PublicationContentSection id="linked-publications" title="Linked publications">
                            <>
                                {linkedPublicationsTo.length || linkedPublicationsFrom.length ? (
                                    <RenderLinks to={linkedPublicationsTo} from={linkedPublicationsFrom} />
                                ) : (
                                    <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                        {`This ${Helpers.formatPublicationType(
                                            props.publication.type
                                        )} does not have any linked to publications.`}
                                    </p>
                                )}
                            </>
                        </Components.PublicationContentSection>

                        {/* Linked from problems */}
                        {!!showProblems && (
                            <Components.PublicationContentSection
                                id="problems"
                                title={`Problems created from this ${Helpers.formatPublicationType(
                                    props.publication.type
                                )}`}
                            >
                                <Components.List ordered={false}>
                                    {problems.map((link) => (
                                        <Components.ListItem
                                            key={link.id}
                                            className="flex items-center font-semibold leading-3 text-pink-500"
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
                                title={`Peer reviews created from this ${Helpers.formatPublicationType(
                                    props.publication.type
                                )}`}
                            >
                                <Components.List ordered={false}>
                                    {peerReviews.map((link) => (
                                        <Components.ListItem
                                            key={link.id}
                                            className="flex items-center font-semibold leading-3 text-pink-500"
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

                        {/** Full text */}
                        <Components.PublicationContentSection id="full-text" title="Full text">
                            <Components.ParseHTML content={props.publication.content ?? ''} />
                        </Components.PublicationContentSection>

                        {/** Licence */}
                        <Components.PublicationContentSection id="licence" title="Licence">
                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                {
                                    Config.values.licenceTypes.find(
                                        (licence) => licence.value === props.publication.licence
                                    )?.nicename
                                }
                            </p>
                        </Components.PublicationContentSection>

                        {/** Conflict of interest */}
                        <Components.PublicationContentSection id="coi" title="Conflict of interest">
                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                {props.publication.conflictOfInterestStatus
                                    ? props.publication.conflictOfInterestText
                                    : `This ${Helpers.formatPublicationType(
                                          props.publication.type
                                      )} does not have any specified conflicts of interest.`}
                            </p>
                        </Components.PublicationContentSection>
                    </article>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
