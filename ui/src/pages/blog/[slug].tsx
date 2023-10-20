import React from 'react';
import Head from 'next/head';
import client from '@contentfulClient';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Block, Inline } from '@contentful/rich-text-types';
import { Entry, EntrySkeletonType } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as Helpers from '@helpers';
import * as OutlineIcons from '@heroicons/react/24/outline';

/**
 * rich text render options
 */

const renderOptions: Options = {
    renderText: (text) => (text ? text : <br />),
    renderMark: {
        [MARKS.BOLD]: (text) => {
            return (
                <b className="font-bold" key={`${text}-key`}>
                    {text}
                </b>
            );
        },
        [MARKS.CODE]: (text) => <code className="text-sm">{text}</code>
    },
    renderNode: {
        [INLINES.EMBEDDED_ENTRY]: (node) => {
            const { title, slug } = node.data.target.fields as Types.BlogFields;

            return (
                <Components.Link
                    className="font-medium text-teal-600 decoration-2 hover:underline dark:text-teal-400"
                    href={`${Config.urls.blog.path}/${slug}?canGoBack=true`}
                    as={`${Config.urls.blog.path}/${slug}`}
                >
                    {title}
                </Components.Link>
            );
        },
        [INLINES.HYPERLINK]: (node, children) => {
            const isExternalLink = !node.data.uri.startsWith(Config.urls.base.host);

            return (
                <Components.Link
                    className="font-medium text-teal-600 decoration-2 hover:underline dark:text-teal-400"
                    href={node.data.uri}
                    target={isExternalLink ? '_blank' : '_self'}
                    rel={isExternalLink ? 'noopener noreferrer' : ''}
                >
                    {children}
                </Components.Link>
            );
        },
        [BLOCKS.HEADING_1]: (node, children) => (
            <h1 className="mb-4 font-montserrat text-[30px] font-semibold">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (node, children) => (
            <h2 className="mb-4 font-montserrat text-[25px] font-semibold">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node, children) => (
            <h3 className="mb-4 font-montserrat text-[22px] font-semibold">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node, children) => (
            <h4 className="mb-4 font-montserrat text-[20px] font-semibold">{children}</h4>
        ),
        [BLOCKS.HEADING_5]: (node, children) => (
            <h5 className="mb-4 font-montserrat text-[18px] font-semibold">{children}</h5>
        ),
        [BLOCKS.HEADING_6]: (node, children) => (
            <h6 className="mb-4 font-montserrat text-[16px] font-semibold">{children}</h6>
        ),
        [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6 leading-6">{children}</p>,
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
            // render the EMBEDDED_ASSET
            return (
                <img
                    src={`https://${node.data.target.fields.file.url}`}
                    alt={node.data.target.fields.description}
                    className="w-full py-4"
                    loading="lazy"
                />
            );
        },
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const { title, slug, author, content, publishedDate } = node.data.target.fields as Types.BlogFields;

            return (
                <Components.Link
                    href={`${Config.urls.blog.path}/${slug}?canGoBack=true`}
                    as={`${Config.urls.blog.path}/${slug}`}
                    className="flex"
                >
                    <Components.BlogCard
                        title={title}
                        content={content}
                        author={author}
                        publishedDate={publishedDate}
                    />
                </Components.Link>
            );
        },
        [BLOCKS.TABLE]: (node, children) => (
            <table className="w-full table-fixed border-collapse overflow-hidden rounded-lg border border-grey-100 ring-1 ring-grey-100 dark:bg-grey-600 dark:ring-teal-300">
                <tbody>{children}</tbody>
            </table>
        ),
        [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
            <th className="border border-grey-100 bg-grey-50 p-3 text-left children:m-0 dark:border-teal-300 dark:bg-grey-700">
                {children}
            </th>
        ),
        [BLOCKS.TABLE_ROW]: (node, children) => <tr>{children}</tr>,
        [BLOCKS.TABLE_CELL]: (node, children) => (
            <td className="border border-grey-100 p-3 align-baseline dark:border-teal-300">{children}</td>
        ),
        [BLOCKS.HR]: () => <hr className="mb-6 h-2 border-grey-100" />,
        [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-6">{children}</ul>,
        [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-6">{children}</ol>,
        [BLOCKS.LIST_ITEM]: (node, children) => <li className="children:mb-4">{children}</li>,
        [BLOCKS.QUOTE]: (node, children) => (
            <blockquote className="border-l-4 border-l-teal-300 pl-4">{children}</blockquote>
        )
    }
};

export const getStaticPaths: Types.GetStaticPaths = async () => {
    const blogs = await client.getEntries();
    const paths = blogs.items.map((blog) => ({ params: { slug: blog.fields.slug as string } }));

    return {
        paths,
        fallback: 'blocking'
    };
};

const trimDescription = (content: Block | Inline): string => {
    const descriptionMaxLength = 155;
    const text = documentToPlainTextString(content).trim();
    return text.length > descriptionMaxLength ? `${text.slice(0, descriptionMaxLength).trim()}...` : text;
};

export const getStaticProps: Types.GetStaticProps = async ({ params }) => {
    const { slug } = params as { slug: string };

    try {
        const blog = (await client.getEntries({ content_type: Config.values.blogContentType, 'fields.slug': slug }))
            .items[0];

        return {
            props: {
                blog
            },
            // - attempt to re-generate the page every 10 seconds when a request comes in
            // - useful to show blog updates while writing it
            revalidate: 10
        };
    } catch (error) {
        console.log(error);

        return {
            notFound: true
        };
    }
};

type Props = {
    blog: Entry<EntrySkeletonType<Types.BlogFields>, undefined, string>;
};

const IndividualBlogPage: NextPage<Props> = (props) => {
    const router = useRouter();
    const { title, author, content, publishedDate } = props.blog.fields;

    const { canGoBack } = router.query as { canGoBack: string };

    const description = React.useMemo(() => {
        return trimDescription(content);
    }, [content]);

    const pageTitle = `${title} - ${Config.urls.base.title}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <meta name="og:title" content={Helpers.truncateString(pageTitle, 70)} />
                <meta name="og:description" content={Helpers.truncateString(description, 200)} />
                <meta name="keywords" content={Config.urls.blog.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.base.host + router.asPath} />
            </Head>

            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 pb-10 pt-4">
                    <div className="dark:shadow-none sm:p-4 sm:shadow">
                        <Components.Button
                            className="children:border-0"
                            startIcon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                            title="Back"
                            onClick={() => (canGoBack === 'true' ? router.back() : router.push(Config.urls.blog.path))}
                        />
                        <div className="mx-auto w-full max-w-5xl py-10">
                            <Components.PageTitle text={title} className="!mb-4" />
                            <Components.PageSubTitle
                                className="text-base font-medium"
                                text={`Written by ${author} on ${Helpers.formatDate(publishedDate)}`}
                                suppressHydrationWarning
                            />
                            <div className="dark:text-white-50">
                                {documentToReactComponents(content, renderOptions)}
                            </div>
                        </div>
                    </div>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default IndividualBlogPage;
