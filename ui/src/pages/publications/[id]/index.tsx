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
import * as API from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    let publication: Interfaces.Publication | null = null;
    let error: string | null = null;

    try {
        const response = await API.get(`${Config.endpoints.publications}/${requestedId}`);
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

type Props = {
    publication: Interfaces.Publication;
};

const Publication: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();

    const sectionList = React.useMemo(() => {
        let list = [
            { title: 'Authors', href: 'authors' },
            { title: 'Conflict of interest', href: 'coi' },
            { title: 'Full text', href: 'full-text' }
        ];
        switch (props.publication.type) {
            case 'PROBLEM':
                list = [...list, { title: 'Linked from', href: 'linked-from' }];
                break;
            case 'PEER_REVIEW':
                list = [...list, { title: 'Linked to', href: 'linked-to' }];
                break;
            default:
                list = [
                    ...list,
                    { title: 'Linked from', href: 'linked-from' },
                    { title: 'Linked to', href: 'linked-to' }
                ];
        }

        return list;
    }, [props.publication.type]);

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${props.publication.url_slug}`} />
                <title>{`${props.publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <Components.SectionTwo
                    className="bg-white-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <header className="container mx-auto grid grid-cols-1 px-8 py-8 lg:grid-cols-12 lg:gap-4 lg:pb-24 lg:pt-16">
                        <div className="lg:col-span-8 xl:col-span-9">
                            <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                                {Helpers.formatPublicationType(props.publication.type)}
                            </span>
                            <h1 className="mb-12 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-3xl xl:leading-tight">
                                {props.publication.title}
                            </h1>

                            {props.publication.type !== 'PEER_REVIEW' && (
                                <Components.PublicationVisualChain highlighted={props.publication.type} />
                            )}

                            <div className="mt-12 print:hidden lg:flex">
                                <span className="mr-16 flex self-center font-bold tracking-wider text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    DOI
                                    <span className="ml-2 block font-medium text-teal-500">
                                        {props.publication.doi}
                                    </span>
                                </span>
                                {props.publication.type !== 'PEER_REVIEW' && (
                                    <Components.ActionButton
                                        title="Write a review"
                                        icon={
                                            <OutlineIcons.PencilIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                        }
                                        callback={() => {
                                            router.push({
                                                pathname: `${Config.urls.createPublication.path}`,
                                                query: {
                                                    for: props.publication.id,
                                                    type: 'review'
                                                }
                                            });
                                        }}
                                        className="mr-6 mb-4 lg:mb-0"
                                    />
                                )}
                            </div>
                        </div>
                        <aside className="relative mb-8 mt-8 flex items-center justify-center print:hidden lg:col-span-4 lg:mt-0 lg:mb-0 xl:col-span-3">
                            <Components.PublicationRatings publication={props.publication} />
                        </aside>
                    </header>

                    <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        <aside className="col-span-2 hidden lg:block">
                            <Components.PublicationSidebar jumpToList={sectionList} />
                        </aside>
                        <div className="lg:col-span-6">
                            {/** Authors */}
                            <Components.PublicationContentSection id="authors" title="Authors">
                                <Components.Link
                                    href={`${Config.urls.viewUser.path}/${props.publication.user.id}`}
                                    className="block w-fit rounded outline-0 focus:ring-2 focus:ring-yellow-400"
                                >
                                    <p className="block leading-relaxed text-grey-800 underline decoration-teal-500 decoration-2 transition-colors duration-500 hover:decoration-teal-700 dark:text-grey-100">
                                        {props.publication.user.firstName} {props.publication.user.lastName}
                                    </p>
                                </Components.Link>
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

                            {/** Linked from publications */}
                            {props.publication.type !== 'PEER_REVIEW' && (
                                <Components.PublicationContentSection id="linked-from" title="Linked from">
                                    <>
                                        {props.publication.linkedFrom.length ? (
                                            props.publication.linkedFrom.map((publication) => (
                                                <Components.Link
                                                    key={publication.id}
                                                    href={`${Config.urls.viewPublication.path}/${publication.id}`}
                                                >
                                                    {/** The content of a linkedFrom from the api seem off? Only have the link ID and publicationID */}
                                                    <span className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                        {publication.id}
                                                    </span>
                                                </Components.Link>
                                            ))
                                        ) : (
                                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                {`This ${Helpers.formatPublicationType(
                                                    props.publication.type
                                                )} does not have any linked from publications.`}
                                            </p>
                                        )}
                                    </>
                                </Components.PublicationContentSection>
                            )}

                            {/** Linked to publications */}
                            {props.publication.type !== 'PROBLEM' && (
                                <Components.PublicationContentSection id="linked-to" title="Linked to">
                                    <>
                                        {props.publication.linkedTo.length ? (
                                            props.publication.linkedTo.map((publication) => (
                                                <Components.Link
                                                    key={publication.id}
                                                    href={`${Config.urls.viewPublication.path}/${publication.id}`}
                                                >
                                                    {/** The content of a linkedTo from the api seem off? Only have the link ID and publicationID */}
                                                    <span className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                        {publication.id}
                                                    </span>
                                                </Components.Link>
                                            ))
                                        ) : (
                                            <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                {`This ${Helpers.formatPublicationType(
                                                    props.publication.type
                                                )} does not have any linked to publications.`}
                                            </p>
                                        )}
                                    </>
                                </Components.PublicationContentSection>
                            )}

                            {/** Full text */}
                            <Components.PublicationContentSection id="full-text" title="Full text">
                                <Components.ParseHTML content={props.publication.content} />
                            </Components.PublicationContentSection>
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
