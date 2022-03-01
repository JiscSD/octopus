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
        const response = await API.get(`${Config.endpoints.publications}/${requestedId}`, undefined);
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

    const to = React.useMemo(() => {
        return {
            title: `Linked ${Helpers.formatPublicationType(
                Helpers.findPreviousPublicationType(props.publication.type)
            )}(s)`,
            href: 'linked-to'
        };
    }, [props.publication.type]);

    const from = React.useMemo(() => {
        return {
            title: `Linked ${Helpers.formatPublicationType(
                Helpers.findNextPublicationType(props.publication.type)
            )}(s)`,
            href: 'linked-from'
        };
    }, [props.publication.type]);

    const sectionList = React.useMemo(() => {
        let list = [{ title: 'Authors', href: 'authors' }];

        switch (props.publication.type) {
            case 'PROBLEM':
                list = [...list, from];
                break;
            case 'PEER_REVIEW':
                list = [...list, to];
                break;
            default:
                list = [...list, to, from];
        }

        return [
            ...list,
            ...[
                { title: 'Full text', href: 'full-text' },
                { title: 'Conflict of interest', href: 'coi' }
            ]
        ];
    }, [props.publication.type, to, from]);

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
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <header className="container mx-auto grid grid-cols-1 px-8 py-8 lg:grid-cols-12 lg:gap-4 lg:pt-16 lg:pb-8">
                        <div className="lg:col-span-8 xl:col-span-9">
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
                                                    type: 'PEER_REVIEW'
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
                        <aside className="col-span-2 hidden pt-12 lg:block">
                            <Components.PublicationSidebar jumpToList={sectionList} />
                        </aside>
                        <div className="lg:col-span-6">
                            {/** Authors */}
                            <Components.PublicationContentSection id="authors" title="Authors">
                                <Components.Link
                                    href={`${Config.urls.viewUser.path}/${props.publication.user.id}`}
                                    className="block w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400 "
                                >
                                    <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                        {props.publication.user.firstName} {props.publication.user.lastName}
                                    </p>
                                </Components.Link>
                            </Components.PublicationContentSection>

                            {/** Linked to publications TODO: improve logic */}
                            {props.publication.type !== 'PROBLEM' && (
                                <Components.PublicationContentSection id="linked-to" title={to.title}>
                                    <>
                                        {props.publication.linkedTo.length ? (
                                            <Components.List ordered={false}>
                                                {props.publication.linkedTo.map((link) => (
                                                    <Components.ListItem key={link.id}>
                                                        <Components.Link
                                                            href={`${Config.urls.viewPublication.path}/${link.publicationToRef.id}`}
                                                            className="block w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                                                        >
                                                            <span className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                                {link.publicationToRef.title}
                                                            </span>
                                                        </Components.Link>
                                                    </Components.ListItem>
                                                ))}
                                            </Components.List>
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

                            {/** Linked from publications  - should not include problems or peer reviews, as they have their own section*/}
                            {props.publication.type !== 'PEER_REVIEW' && (
                                <Components.PublicationContentSection id="linked-from" title={from.title}>
                                    <>
                                        {props.publication.linkedFrom.length ? (
                                            <Components.List ordered={false}>
                                                {props.publication.linkedFrom.map((link) => (
                                                    <Components.ListItem key={link.id}>
                                                        <Components.Link
                                                            href={`${Config.urls.viewPublication.path}/${link.publicationFromRef.id}`}
                                                            className="block w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                                                        >
                                                            <span className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                                                {link.publicationFromRef.title}{' '}
                                                            </span>
                                                        </Components.Link>
                                                    </Components.ListItem>
                                                ))}
                                            </Components.List>
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

                            {/* TODO: PEER REVIEWS - loop through linksFrom */}

                            {/* TODO: PROBLEMS - loop through linksFrom */}

                            {/** Full text */}
                            <Components.PublicationContentSection id="full-text" title="Full text">
                                <Components.ParseHTML content={props.publication.content} />
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
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
