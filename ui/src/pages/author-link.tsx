import * as api from '@api';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Types from '@types';
import JWT from 'jsonwebtoken';
import Head from 'next/head';
import React from 'react';
import axios, { AxiosError } from 'axios';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let email = null;
    let code = null;
    let approve = null;
    let publication = null;

    if (!context.query.code || !context.query.email || !context.query.approve || !context.query.publication) {
        return {
            props: {
                message: 'Invalid link.'
            }
        };
    }

    email = Array.isArray(context.query.email) ? context.query.email[0] : context.query.email;
    code = Array.isArray(context.query.code) ? context.query.code[0] : context.query.code;
    approve = Array.isArray(context.query.approve) ? context.query.approve[0] : context.query.approve;
    publication = Array.isArray(context.query.publication) ? context.query.publication[0] : context.query.publication;

    if (approve !== 'true' && approve !== 'false') {
        return {
            redirect: { permanent: true, destination: Config.urls.home.path }
        };
    }

    // check user credentials
    if (approve === 'true') {
        try {
            const token = Helpers.guardPrivateRoute(context);
            // Only attempt to link if user has an email in their token
            if ((JWT.decode(token) as Types.UserType).email) {
                await api.patch(
                    `/publications/${publication}/link-coauthor`,
                    {
                        email,
                        code,
                        approve: true
                    },
                    token
                );
            }
        } catch (err: unknown | AxiosError) {
            if (axios.isAxiosError(err)) {
                return {
                    props: {
                        title: 'Error linking you as a co-author.',
                        statusCode: err.response?.status,
                        message: err.response?.data.message
                    }
                };
            }

            return {
                props: {
                    status: 500,
                    message: 'Unknown server error'
                }
            };
        }

        return {
            redirect: { permanent: true, destination: `${Config.urls.viewPublication.path}/${publication}` }
        };
    }

    try {
        await api.patch(`/publications/${publication}/link-coauthor`, {
            email,
            code,
            approve: false
        });

        return {
            props: {
                title: 'You have indicated that you are not a co-author.',
                message: 'Thank you for responding. You have now been removed from this draft publication.',
                statusCode: 200
            }
        };
    } catch (err) {
        return {
            props: {
                message: 'There was an error denying this request.'
            }
        };
    }
};

type Props = {
    title?: string;
    message: string;
    statusCode?: number;
};

const AuthorLink: Types.NextPage<Props> = (props): React.ReactElement => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
        {props.statusCode == 200 ? (
            <Layouts.InformationLanding
                title={props.title ? `${props.title}` : ''}
                windowTitle={props.title || ''}
                content={props.message}
                statusCode={props.statusCode || 200}
            />
        ) : (
            <Layouts.Error
                title={props.title ? `${props.title}` : 'Error.'}
                windowTitle={
                    props.statusCode
                        ? `${props.statusCode} - Octopus | Built for Researchers`
                        : `${Config.urls[500].title}`
                }
                content={props.message}
                statusCode={props.statusCode || 500}
            />
        )}
    </>
);

export default AuthorLink;
