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
        context.res.writeHead(302, {
            Location: Config.urls.home.path
        });
        context.res.end();
        return { props: {} };
    }

    email = Array.isArray(context.query.email) ? context.query.email[0] : context.query.email;
    code = Array.isArray(context.query.code) ? context.query.code[0] : context.query.code;
    approve = Array.isArray(context.query.approve) ? context.query.approve[0] : context.query.approve;
    publication = Array.isArray(context.query.publication) ? context.query.publication[0] : context.query.publication;

    if (approve !== 'true' && approve !== 'false') {
        context.res.writeHead(302, {
            Location: Config.urls.home.path
        });
        context.res.end();
        return { props: {} };
    }

    // check user credentials
    if (approve === 'true') {
        const token = Helpers.guardPrivateRoute(context);

        try {
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
            console.log(err);
            return { props: {} };
        }

        context.res.writeHead(302, {
            Location: `${Config.urls.viewPublication.path}/${publication}`
        });
        context.res.end();
        return { props: {} };
    }

    try {
        await api.patch(`/publications/${publication}/link-coauthor`, {
            email,
            code,
            approve: false
        });
    } catch (err) {
        console.log(err);
        return { props: {} };
    }

    context.res.writeHead(302, {
        Location: `${Config.urls.viewPublication.path}/${publication}`
    });
    context.res.end();
    return { props: {} };
};

const AuthorLink: Types.NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
    </>
);

export default AuthorLink;
