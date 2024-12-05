import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Helpers from '@/helpers';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';
import * as Interfaces from '@/interfaces';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const swrKey = `/publication-versions?limit=5&orderBy=publishedDate&orderDirection=desc`;

    let latest: unknown = [];
    let metadata: unknown = {};
    try {
        const latestResponse = await api.get(swrKey);
        latest = latestResponse.data.data;
        metadata = latestResponse.data.metadata;
    } catch (error) {
        // couldn't load the latest publication versions
    }

    return {
        props: {
            swrKey,
            fallback: {
                [swrKey]: {
                    data: {
                        data: latest,
                        metadata
                    }
                }
            }
        }
    };
};

type Props = {
    swrKey: string;
};

const Browse: Types.NextPage<Props> = (props): React.ReactElement => {
    const { data: results, error } = useSWR<Interfaces.SearchResults<Interfaces.PublicationVersion>>(props.swrKey);

    return (
        <>
            <Head>
                <title>{Config.urls.browsePublications.title}</title>
                <meta name="description" content={Config.urls.browsePublications.description} />
                <meta name="og:title" content={Config.urls.browsePublications.title} />
                <meta name="og:description" content={Config.urls.browsePublications.description} />
                <meta name="keywords" content={Config.urls.browsePublications.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.browsePublications.canonical} />
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-16">
                    <Components.PageTitle text="Browse all publications" />
                </section>
                <section id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                    <aside className="relative col-span-2 hidden lg:block">
                        <div className="sticky top-16">
                            {/* view all publication & authors buttons */}
                            <div className="grid-row-2 mb-6 grid">
                                <Components.Button
                                    href={Config.urls.searchPublications.path}
                                    title="View all publications"
                                    endIcon={
                                        <OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                    }
                                />
                                <Components.Button
                                    href={Config.urls.searchAuthors.path}
                                    title="View all authors"
                                    endIcon={
                                        <OutlineIcons.UserIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                    }
                                />
                            </div>
                            <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white-50">
                                Publication type
                            </h2>
                            {Config.values.publicationTypes.map((type) => (
                                <Components.Link
                                    key={type}
                                    href={`${Config.urls.searchPublications.path}?type=${type}`}
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
                            {!error && results && <Components.LatestPublications publicationVersions={results.data} />}
                        </div>
                    </article>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Browse;
