import React from 'react';
import Head from 'next/head';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    Helpers.guardPrivateRoute(context);

    let publicationFor: string | string[] | null = null;
    let publicationType: string | string[] | null = null;

    if (context.query.for) publicationFor = context.query.for;
    if (context.query.type) publicationType = context.query.type;

    if (Array.isArray(publicationFor)) publicationFor = publicationFor[0];
    if (Array.isArray(publicationType)) publicationType = publicationType[0];

    return {
        props: {
            publicationFor,
            publicationType
        }
    };
};

type Props = {
    publicationFor: string | null;
    publicationType: Types.PublicationType | null;
};

const Create: Types.NextPage<Props> = (props): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords} />
                <link rel="canonical" href={`${Config.urls.createPublication.canonical}`} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={false}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <h1>Create a new publication</h1>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Create;
