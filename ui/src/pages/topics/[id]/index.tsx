import React from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@api';
import * as Assets from '@assets';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const id = context.query.id;
    let topic: Interfaces.Topic | null = null;
    let error: string | null = null;

    const token = Helpers.getJWT(context);

    try {
        const response = await api.get(`${Config.endpoints.topics}/${id}`, token);
        topic = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!topic || error) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            topic
        }
    };
};

type Props = {
    topic: Interfaces.Topic;
};

const Topic: Types.NextPage<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);

    const topic = props.topic;
    const showChildren = Boolean(topic.children.length);
    const showParents = Boolean(topic.parents.length);
    const showPublications = Boolean(topic.publications.length);

    return (
        <>
            <Head>
                <meta name="description" content={Config.values.topicDescription} />
                <link rel="canonical" href={`${Config.urls.viewTopic.canonical}/${topic.id}`} />
                <title>{`${topic.title} - ${Config.urls.viewTopic.title}`}</title>
            </Head>
            <Layouts.Topic fixedHeader={false}>
                <section className="col-span-9 text-grey-800 dark:text-grey-100">
                    <header className="border-b border-grey-200">
                        <h1 className="mb-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-normal">
                            {topic.title}
                        </h1>
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
                                    {topic.publications.map((publication) => (
                                        <Components.ListItem key={publication.id}>
                                            <Components.Link
                                                href={`${Config.urls.viewPublication.path}/${publication.id}`}
                                                className="mb-2 text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                                            >
                                                {publication.title}
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
