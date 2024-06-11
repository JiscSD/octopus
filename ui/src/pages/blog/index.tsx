import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import useSWR from 'swr';
import client from '@/contentfulClient';

import * as Framer from 'framer-motion';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';
import * as Assets from '@/assets';
import * as Helpers from '@/helpers';

const Blog: NextPage = (): JSX.Element => {
    const router = useRouter();
    const skip = Number(router.query.skip) || 0;
    const { data, error, isLoading } = useSWR(
        `${skip}`,
        () => client.getEntries({ limit: 18, skip, order: ['-fields.publishedDate'], content_type: 'octopusBlog' }) // the content_type is required when ordering by custom fields
    );

    const handleGoNext = async () => {
        if (!data) {
            return;
        }

        await router.push({
            pathname: router.pathname,
            query: { skip: skip + data.limit }
        });
        Helpers.scrollTopSmooth();
    };

    const handleGoBack = async () => {
        if (!data) {
            return;
        }

        const newSkip = skip - data.limit < 0 ? 0 : skip - data.limit;
        await router.push({
            pathname: router.pathname,
            query: newSkip ? { skip: newSkip } : undefined
        });

        Helpers.scrollTopSmooth();
    };

    const upperPageBound = data ? (data.limit + data.skip > data.total ? data.total : data.limit + data.skip) : null;

    return (
        <>
            <Head>
                <title>{Config.urls.blog.documentTitle}</title>
                <meta name="description" content={Config.urls.blog.description} />
                <meta name="og:title" content={Config.urls.blog.documentTitle} />
                <meta name="og:description" content={Config.urls.blog.description} />
                <meta name="keywords" content={Config.urls.blog.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.blog.canonical} />
            </Head>

            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                    <Components.PageTitle text={Config.urls.blog.title} className="mb-8" />
                    <div className="flex flex-col justify-between border-b border-grey-100 lg:flex-row lg:gap-4">
                        <Components.PageSubTitle
                            text={Config.urls.blog.description}
                            className="!mx-0 font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50"
                        />
                        <Components.Link
                            href="https://twitter.com/octopus_ac"
                            openNew={true}
                            ariaLabel="Twitter"
                            className="mb-8 w-fit text-grey-700 transition-colors duration-500 dark:text-grey-50"
                        >
                            Follow Octopus on Twitter{' '}
                            <Assets.Twitter
                                width={25}
                                height={25}
                                className="inline transition-colors dark:fill-white-50"
                            />
                        </Components.Link>
                    </div>
                </section>

                <section className="container mx-auto px-8 pb-10">
                    {!isLoading && !error && !data?.items.length && (
                        <Components.Alert severity="INFO" title="No results found" />
                    )}
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {data?.items.map((blog) => {
                            const blogFields = blog.fields as Types.BlogFields;

                            return (
                                <Components.Link
                                    key={blog.sys.id}
                                    href={`${router.pathname}/${blogFields.slug}?canGoBack=true`}
                                    as={`${router.pathname}/${blogFields.slug}`}
                                >
                                    <Components.BlogCard
                                        title={blogFields.title}
                                        content={blogFields.content}
                                        author={blogFields.author}
                                        publishedDate={blogFields.publishedDate}
                                    />
                                </Components.Link>
                            );
                        })}
                    </div>

                    {!isLoading && !!data?.items.length && (
                        <Framer.motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'tween', duration: 0.75 }}
                            className="mt-8 w-full items-center justify-between lg:flex lg:flex-row-reverse"
                        >
                            <div className="flex justify-between">
                                <button
                                    onClick={handleGoBack}
                                    disabled={skip === 0}
                                    className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={handleGoNext}
                                    className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                    disabled={data.limit + skip >= data.total}
                                >
                                    Next
                                </button>
                            </div>
                            <span
                                id="pagination-info"
                                className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                            >
                                Showing {data.skip + 1} - {upperPageBound} of {data.total}
                            </span>
                        </Framer.motion.div>
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Blog;
