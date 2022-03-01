import React from 'react';
import Head from 'next/head';

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
    const [step, setStep] = React.useState(0);
    const [publication, setPublication] = React.useState({});

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords} />
                <link rel="canonical" href={`${Config.urls.createPublication.canonical}`} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.BuildPublication currentStep={step} setStep={setStep} publication={publication}>
                <h1>Create a new publication</h1>
            </Layouts.BuildPublication>
        </>
    );
};

export default Create;
