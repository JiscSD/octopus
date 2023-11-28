import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as api from '@/api';
import * as Assets from '@/assets';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const id = context.query.id;
    let topic: Interfaces.Topic | null = null;
    let bookmarkId: string | null = null;
    let error: string | null = null;

    const token = Helpers.getJWT(context);

    try {
        const response = await api.get(`${Config.endpoints.topics}/${id}`, token);
        topic = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    try {
        const response = await api.get(`${Config.endpoints.bookmarks}?type=TOPIC&entityId=${id}`, token);
        bookmarkId = response.data && response.data.length === 1 ? response.data[0].id : null;
    } catch (err) {
        console.log(err);
    }

    if (!topic || error) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            topic,
            bookmarkId
        }
    };
};

type Props = {
    topic: Interfaces.Topic;
    bookmarkId: string | null;
};

const Topic: Types.NextPage<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);

    const [bookmarkId, setBookmarkId] = React.useState(props.bookmarkId);
    const isBookmarked = bookmarkId ? true : false;

    const topic = props.topic;
    const showChildren = Boolean(topic.children.length);
    const showParents = Boolean(topic.parents.length);
    const showPublications = Boolean(topic.publicationVersions.length);

    useEffect(() => {
        setBookmarkId(props.bookmarkId);
    }, [props.bookmarkId, props.topic.id]);

    const isBookmarkButtonVisible = useMemo(() => {
        if (user && topic) {
            return true;
        } else {
            return false;
        }
    }, [topic, user]);

    const onBookmarkHandler = async () => {
        if (isBookmarked) {
            // Delete the bookmark
            try {
                await api.destroy(`bookmarks/${bookmarkId}`, user?.token);
                setBookmarkId(null);
            } catch (err) {
                console.log(err);
            }
        } else {
            // Create the bookmark
            try {
                const newBookmarkResponse = await api.post<{
                    id: string;
                    type: string;
                    entityId: string;
                    userId: string;
                }>(
                    `bookmarks`,
                    {
                        type: 'TOPIC',
                        entityId: topic.id
                    },
                    user?.token
                );
                setBookmarkId(newBookmarkResponse.data.id);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const pageTitle = `${topic.title} - ${Config.urls.viewTopic.title}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={Config.values.topicDescription} />
                <meta name="og:title" content={Helpers.truncateString(pageTitle, 70)} />
                <meta name="og:description" content={Config.values.topicDescription} />
                <link rel="canonical" href={`${Config.urls.viewTopic.canonical}/${topic.id}`} />
            </Head>
            <Layouts.Topic fixedHeader={false}>
                <section className="col-span-9 text-grey-800 dark:text-grey-100">
                    <header className="border-b border-grey-200">
                        <div className="grid w-full grid-cols-8">
                            <h1 className="col-span-7 mb-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-normal">
                                {topic.title}
                            </h1>
                            {isBookmarkButtonVisible && (
                                <div className="col-span-1 grid justify-items-end">
                                    <button
                                        className="h-8 hover:cursor-pointer focus:outline-none focus:ring focus:ring-yellow-200 focus:ring-offset-2 dark:outline-none dark:focus:ring dark:focus:ring-yellow-600 dark:focus:ring-offset-1"
                                        onClick={onBookmarkHandler}
                                        aria-label="toggle-bookmark"
                                        title={`${isBookmarked ? 'Remove bookmark' : 'Bookmark this topic'}`}
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
                        <p className="mb-4">
                            <em>Research Topic</em>
                        </p>
                        <p className="mb-4">
                            Language:{' '}
                            {Config.values.octopusInformation.languages.find((l) => l.code === topic.language)?.name}
                        </p>
                        {user && user.email ? (
                            <div className="pb-10">
                                <Components.Link
                                    href={`${Config.urls.createPublication.path}?topic=${topic.id}&type=PROBLEM`}
                                    className="flex w-fit text-teal-600 dark:text-teal-400"
                                >
                                    Write a linked Research Problem
                                    <OutlineIcons.PencilIcon className="ml-2 h-5 w-5" />
                                </Components.Link>
                            </div>
                        ) : user && !user.email ? (
                            <div className="pb-10">
                                <Components.Link
                                    href={`${Config.urls.verify.path}?state=${encodeURIComponent(
                                        `${Config.urls.viewTopic.path}/${topic.id}`
                                    )}`}
                                    className="flex w-fit items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                >
                                    Verify your email for more actions
                                </Components.Link>
                            </div>
                        ) : (
                            <div className="pb-10">
                                <Components.Link
                                    href={`${Config.urls.orcidLogin.path}&state=${encodeURIComponent(
                                        `${Config.urls.viewTopic.path}/${topic.id}`
                                    )}`}
                                    className="flex w-fit items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                >
                                    <Assets.ORCID
                                        width={25}
                                        height={25}
                                        className="mr-2 rounded-md bg-orcid fill-white-50 p-1"
                                    />
                                    <span> Sign in for more actions</span>
                                </Components.Link>
                            </div>
                        )}
                    </header>
                    <p className="py-10">{Config.values.topicDescription}</p>

                    {showChildren && (
                        <div className="border-t border-grey-200">
                            <Components.ContentSection
                                id="children"
                                title="Research topics below this in the hierarchy"
                            >
                                <Components.List ordered={false}>
                                    {topic.children.map((child) => (
                                        <Components.ListItem key={child.id}>
                                            <Components.Link
                                                href={`${Config.urls.viewTopic.path}/${child.id}`}
                                                className="mb-2 text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                            >
                                                {child.title}
                                            </Components.Link>
                                        </Components.ListItem>
                                    ))}
                                </Components.List>
                            </Components.ContentSection>
                        </div>
                    )}

                    {showParents && (
                        <div className="border-t border-grey-200">
                            <Components.ContentSection id="parents" title="Research topics above this in the hierarchy">
                                <Components.List ordered={false}>
                                    {topic.parents.map((parent) => (
                                        <Components.ListItem key={parent.id}>
                                            <Components.Link
                                                href={`${Config.urls.viewTopic.path}/${parent.id}`}
                                                className="mb-2 text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                            >
                                                {parent.title}
                                            </Components.Link>
                                        </Components.ListItem>
                                    ))}
                                </Components.List>
                            </Components.ContentSection>
                        </div>
                    )}

                    {showPublications && (
                        <div className="border-t border-grey-200">
                            <Components.ContentSection id="publications" title="Research problems linked to this topic">
                                <Components.List ordered={false}>
                                    {topic.publicationVersions.map((publicationVersion) => (
                                        <Components.ListItem key={publicationVersion.versionOf}>
                                            <Components.Link
                                                href={`${Config.urls.viewPublication.path}/${publicationVersion.versionOf}`}
                                                className="mb-2 text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                            >
                                                {publicationVersion.title}
                                            </Components.Link>
                                        </Components.ListItem>
                                    ))}
                                </Components.List>
                            </Components.ContentSection>
                        </div>
                    )}
                </section>
            </Layouts.Topic>
        </>
    );
};

export default Topic;
