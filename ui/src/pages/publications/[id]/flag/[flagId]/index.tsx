import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import jwt from 'jsonwebtoken';
import useSWR, * as SWR from 'swr';
import * as Axios from 'axios';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let error: string | null = null;
    let flag: Interfaces.FlagWithComments | null = null;
    let publication: Interfaces.Publication | null = null;
    let isResolvable = false;
    let isCommentable = false;
    const token = context.req.cookies[Config.keys.cookieStorage.token];
    const decodedToken = jwt.decode(token) as Interfaces.CoreUser;
    const swrKey = `${Config.endpoints.flag}/${context.query.flagId}`;

    try {
        const flagResponse = await api.get(swrKey, token);
        flag = flagResponse.data;

        const publicationResponse = await api.get(`${Config.endpoints.publications}/${flag?.publicationId}`, token);
        publication = publicationResponse.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!flag || !publication) {
        return {
            notFound: true
        };
    }

    if (decodedToken) {
        // Only the flag creator & publisher can comment
        if (decodedToken.id === flag.user.id || decodedToken.id === publication.user.id) isCommentable = true;
        // Only resolvable if the user is the flag creator
        if (decodedToken.id === flag.user.id && !flag.resolved) isResolvable = true;
    }

    return {
        props: {
            publicationId: context.query.id,
            isCommentable,
            isResolvable,
            swrKey,
            fallback: {
                [swrKey]: {
                    data: flag
                }
            }
        }
    };
};

type Props = {
    publicationId: string;
    isCommentable: boolean;
    isResolvable: boolean;
    swrKey: string;
    fallback: {
        data: Interfaces.FlagWithComments;
    };
};

const FlagThread: NextPage<Props> = (props): JSX.Element => {
    const { data, isValidating, error } = useSWR<Axios.AxiosResponse<Interfaces.FlagWithComments>>(props.swrKey, {
        fallback: props.fallback
    });

    const user = Stores.useAuthStore((state) => state.user);

    console.log({
        data,
        isValidating,
        error
    });

    if (data?.data) {
        return (
            <>
                <Head>
                    <meta name="description" content={Config.urls.viewFlagThread.description} />
                    <link
                        rel="canonical"
                        href={`${Config.urls.viewFlagThread.canonical}/${props.publicationId}/flag/${data?.data.id}`}
                    />
                    <title>{`${Config.values.octopusInformation.redFlagReasons[data.data.category].nicename} - ${
                        props.publicationId
                    }`}</title>
                </Head>

                <Layouts.Standard fixedHeader={false}>
                    <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                        <Components.PageTitle
                            text={`${Config.values.octopusInformation.redFlagReasons[data.data.category].nicename} - ${
                                props.publicationId
                            }`}
                        />
                    </section>

                    {!!data.data.flagComments.length && (
                        <section className="container mx-auto px-8">
                            {data.data.flagComments.map((flagComment) => (
                                <Components.FlagComment key={flagComment.id} flagComment={flagComment} />
                            ))}
                        </section>
                    )}

                    {!!user && props.isCommentable && (
                        <section className="container mx-auto mt-12 px-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-12 mb-2 lg:col-span-2 lg:mb-0">
                                    <Components.Avatar user={user} className="hidden lg:flex" />
                                    <span className="text-xs text-grey-500">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>
                                <div className="col-span-12 lg:col-span-10">
                                    <Components.FlagNewComment value="" onChange={(val) => console.log(val)} />
                                    <Components.Button
                                        title="Save comment"
                                        onClick={() => console.log('lol')}
                                        className="ml-auto mt-2 !flex"
                                    />
                                </div>
                            </div>
                        </section>
                    )}
                </Layouts.Standard>
            </>
        );
    }

    return <></>;
};

export default FlagThread;
