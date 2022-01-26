import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Mocks from '@mocks';
import * as Helpers from '@helpers';

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Get featured publications
    const featured: Interfaces.Publication[] = [
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication
    ];

    // Get latest publications
    const latest: Interfaces.Publication[] = [
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication
    ];

    // Get publication types
    const types: string[] = Mocks.testData.testPublicationTypes;

    // Get publication topics
    const topics: string[] = Mocks.testData.testPublicationTopics;

    // Get publication sciences
    const sciences: string[] = Mocks.testData.testPublicationSciences;

    return {
        props: {
            featured,
            latest,
            types,
            topics,
            sciences
        }
    };
};

type Props = {
    featured: Interfaces.Publication[];
    latest: Interfaces.Publication[];
    types: string[];
    topics: string[];
    sciences: string[];
};

const Browse: NextPage<Props> = (props): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.browsePublications.canonical}`} />
                <title>{Config.urls.browsePublications.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                        <h1 className="mb-8 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-4xl xl:leading-normal">
                            Browse all publications
                        </h1>
                    </section>
                    <section id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        <aside className="relative col-span-2 hidden lg:block">
                            <div className="sticky top-28">
                                <h2 className="mb-2 block font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Publication type
                                </h2>
                                {/** All option, no idea where thats supposed to... maybe to search with type empty, todo. */}
                                {props.types.map((type) => (
                                    <Components.Link
                                        key={type}
                                        href={`${Config.urls.search.path}?type=${type}`}
                                        className="group mb-2 block w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <span className="text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                            {Helpers.formatPublicationType(type)}
                                        </span>
                                    </Components.Link>
                                ))}
                            </div>
                        </aside>
                        <article className="lg:col-span-6">
                            <div className="mb-16">
                                <Components.FeaturedCollection publications={props.featured} limit={2} />
                            </div>

                            <div className="mb-16">
                                <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white">
                                    Latest publications
                                </h2>
                                <h3 className="mb-6 block font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 ">
                                    See the latest publications that have been uploaded to Octopus
                                </h3>

                                <Components.PublicationCarousel publications={props.latest} />
                            </div>
                        </article>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Browse;
