import React from 'react';
import Head from 'next/head';
import JWT from 'jsonwebtoken';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

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

            await api.patch(
                `/publications/${publication}/link-coauthor`,
                {
                    email,
                    code,
                    approve: true
                },
                token
            );
        } catch (err) {
            return {
                props: {
                    message: 'There was an error linking you as a co-author.'
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
    } catch (err) {
        return {
            props: {
                message: 'There was an error denying this request.'
            }
        };
    }

    return {
        props: {},
        redirect: { permanent: true, destination: Config.urls.home.path }
    };
};

type Props = {
    message: string;
};

const AuthorLink: Types.NextPage<Props> = (props): React.ReactElement => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Layouts.Error
            title="Page not found."
            windowTitle={Config.urls[404].title}
            content={props.message}
            statusCode={404}
        />
    </>
);

export default AuthorLink;
