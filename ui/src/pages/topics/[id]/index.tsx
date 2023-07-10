import React from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
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
    const topic = props.topic;
    const showChildren = Boolean(topic.children.length);
    const showParents = Boolean(topic.parents.length);
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
                        <Components.Link
                            href="#"
                            openNew={true}
                            className="flex pb-10 text-teal-600 dark:text-teal-400"
                        >
                            Write a linked Research Problem
                            <OutlineIcons.PencilIcon className="ml-2 h-5 w-5" />
                        </Components.Link>
                    </header>
                    <p className="border-b border-grey-200 py-10">{Config.values.topicDescription}</p>
                    {showChildren && (
                        <Components.ContentSection
                            id="children"
                            title="Research topics below this in the hierarchy"
                            hasBreak
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
                    )}
                    {showParents && (
                        <Components.ContentSection
                            id="parents"
                            title="Research topics above this in the hierarchy"
                            hasBreak
                        >
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
                    )}
                </section>
            </Layouts.Topic>
        </>
    );
};

export default Topic;
