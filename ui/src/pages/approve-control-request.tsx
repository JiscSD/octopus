import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import * as api from '@/api';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Layouts from '@/layouts';
import * as Types from '@/types';

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
    const token = Helpers.getJWT(context);
    const versionOf = context.query.versionOf;
    const versionId = context.query.versionId;
    const approve = context.query.approve as string;
    const eventId = context.query.eventId as string;
    const isApproved = approve === 'true';

    if (['true', 'false'].includes(approve)) {
        try {
            await api.post(
                `${Config.endpoints.publications}/${versionOf}/publication-versions/${versionId}/approve-control-request`,
                {
                    approve: isApproved ? true : false,
                    eventId
                },
                token
            );
        } catch (error) {
            console.log(error);

            return {
                props: {
                    title: `An error has ocurred while ${isApproved ? 'approving' : 'rejecting'} the control request.`,
                    statusCode: axios.isAxiosError(error) ? error.response?.status : 500,
                    message: axios.isAxiosError(error) ? error.response?.data.message : (error as Error).message
                }
            };
        }

        return {
            redirect: {
                destination: `/publications/${versionOf}/versions/${versionId}`,
                permanent: true
            }
        };
    }

    return {
        props: {
            title: 'An error has ocurred while processing the control request.',
            statusCode: 500,
            message: 'Unknown server error.'
        }
    };
});

type Props = {
    title: string;
    message: string;
    statusCode: number;
};

const AuthorLink: Types.NextPage<Props> = (props): React.ReactElement => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Layouts.Error
            title={props.title}
            windowTitle={`${props.statusCode} - Octopus | Built for Researchers`}
            content={props.message}
            statusCode={props.statusCode}
        />
    </>
);

export default AuthorLink;
