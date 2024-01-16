import * as api from '@/api';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Layouts from '@/layouts';
import * as Types from '@/types';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let email: string | null = null;
    let code: string | undefined | null = null;
    let approve = null;
    let publicationId: string | null = null;
    let versionId: string | null = null;

    if (!context.query.email || !context.query.approve || !context.query.publicationId || !context.query.versionId) {
        return {
            props: {
                message: 'Invalid link.'
            }
        };
    }

    email = Array.isArray(context.query.email) ? context.query.email[0] : context.query.email;
    code = Array.isArray(context.query.code) ? context.query.code[0] : context.query.code;
    approve = Array.isArray(context.query.approve) ? context.query.approve[0] : context.query.approve;
    publicationId = Array.isArray(context.query.publicationId)
        ? context.query.publicationId[0]
        : context.query.publicationId;
    versionId = Array.isArray(context.query.versionId) ? context.query.versionId[0] : context.query.versionId;

    if (!['true', 'false'].includes(approve)) {
        return {
            redirect: { permanent: true, destination: Config.urls.home.path }
        };
    }

    // check user credentials
    if (approve === 'true') {
        // user must be logged in and have a verified email address in order to accept invitation
        return Helpers.withServerSession(async (context) => {
            try {
                await api.patch(
                    `/publication-versions/${versionId}/link-coauthor`,
                    {
                        email,
                        code,
                        approve: true
                    },
                    Helpers.getJWT(context)
                );
            } catch (err: unknown | Types.AxiosError) {
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
                redirect: { permanent: true, destination: `${Config.urls.viewPublication.path}/${publicationId}` }
            };
        })(context);
    }

    try {
        await api.patch(`/publication-versions/${versionId}/link-coauthor`, {
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
    } catch (err: unknown | Types.AxiosError) {
        if (axios.isAxiosError(err)) {
            return {
                props: {
                    title: 'There was an error denying this request.',
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
