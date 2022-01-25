import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PencilIcon } from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as API from '@api';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const requestedSlug = context.query.slug;
    const response = await API.get(`${Config.endpoints.publications}/${requestedSlug}`);
    const publication: Interfaces.Publication = response.data;

    if (!publication || response.status !== 200) {
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

const Publication: NextPage<Props> = (props): JSX.Element => {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${props.publication.url_slug}`} />
                <title>{`${props.publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    <header className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <div className="lg:col-span-2">
                            <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                                {Helpers.formatPublicationType(props.publication.type)}
                            </span>
                            <h1 className="mb-8 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-4xl xl:leading-normal">
                                {props.publication.title}
                            </h1>
                            <span className="mb-8 block tracking-wider text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                DOI: <span className="font-medium text-teal-500">{props.publication.doi}</span>
                            </span>
                            <div className="mb-12 print:hidden lg:flex">
                                <Components.ActionButton
                                    title="Write a review"
                                    icon={
                                        <PencilIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                    }
                                    callback={(e) => {
                                        e.preventDefault();
                                        router.push(
                                            `${Config.urls.createPublication.path}?for=${props.publication.id}&type=review`
                                        );
                                    }}
                                    className="mr-6 mb-4 lg:mb-0"
                                />
                            </div>
                            {/* <Components.Link
                                href={`${Config.urls.createFlag.path}?for=${props.publication.id}`}
                                className="flex w-fit items-center rounded border-transparent text-xs font-bold text-pink-500 outline-0 focus:ring-2 focus:ring-yellow-400 print:hidden"
                            >
                                <span>Report this publication</span>
                                <FlagIcon className="ml-2 h-3 w-3" />
                            </Components.Link> */}
                        </div>
                        <aside className="relative mb-8 mt-8 flex items-center justify-center print:hidden lg:mt-0 lg:mb-0 lg:justify-end">
                            <Components.PublicationRatings publication={props.publication} />
                        </aside>
                    </header>
                </Components.SectionTwo>

                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        <aside className="col-span-2 hidden pt-24 lg:block">
                            <Components.PublicationSidebar
                                actions={[
                                    { title: 'Authors', href: 'authors' },
                                    { title: 'Full text', href: 'full-text' }
                                ]}
                            />
                        </aside>
                        <div className="lg:col-span-6">
                            {/** Authors */}
                            <Components.PublicationContentSection id="authors" title="Authors">
                                <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    {props.publication.user.firstName} {props.publication.user.lastName}
                                </p>
                            </Components.PublicationContentSection>

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
