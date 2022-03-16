import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

const steps: Interfaces.PublicationBuildingStep[] = [
    {
        title: 'Publication title',
        subTitle: 'Publication title & type information',
        component: <Components.PublicationCreationStepOne />
    },
    {
        title: 'Manage links',
        subTitle: 'Manage links',
        component: <Components.PublicationCreationStepTwo />
    },
    {
        title: 'Additional information',
        subTitle: 'Additional information',
        component: <Components.PublicationCreationStepThree />
    },
    {
        title: 'Full text',
        subTitle: 'Full text',
        component: <Components.PublicationCreationStepFour />
    },
    {
        title: 'Review & Publish',
        subTitle: 'Review your publications content',
        component: <Components.PublicationCreationStepFive />
    }
];

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    let draftedPublicationID: string | string[] | null = null;
    let draftedPublication: Interfaces.Publication | null = null;
    let forPublicationID: string | string[] | null = null;
    let step: string | string[] | null = null;
    let error: string | null = null;

    if (context.query.id) draftedPublicationID = context.query.id;
    if (context.query.for) forPublicationID = context.query.for;
    if (context.query.step) step = context.query.step;
    if (Array.isArray(draftedPublicationID)) draftedPublicationID = draftedPublicationID[0];
    if (Array.isArray(draftedPublicationID)) draftedPublicationID = draftedPublicationID[0];
    if (Array.isArray(step)) step = step[0];

    if (draftedPublicationID) {
        try {
            const response = await api.get(`${Config.endpoints.publications}/${draftedPublicationID}`, token);
            draftedPublication = response.data;
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            error = message;
        }
    } else {
        return {
            notFound: true
        };
    }

    return {
        props: {
            draftedPublication,
            forPublicationID,
            step,
            token,
            error
        }
    };
};

type Props = {
    draftedPublication: Interfaces.Publication;
    forPublicationID: string | null;
    step: string;
    token: string;
    error: string | null;
};

const Edit: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    let defaultStep = props.step ? parseInt(props.step) : 0;
    defaultStep = defaultStep <= steps.length - 1 && defaultStep >= 0 ? defaultStep : 0;

    const [currentStep, setCurrentStep] = React.useState(defaultStep);
    const [publication] = React.useState(props.draftedPublication);

    const updateTitle = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateTitle
    );
    const updateType = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateType
    );
    const updateContent = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateContent
    );
    const updateLicence = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateLicence
    );
    const updateConflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateConflictOfInterestStatus
    );
    const updateConflictOfInterestText = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateConflictOfInterestText
    );
    const updateForPublicationsID = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateForPublicationsID
    );
    const updateDraftedPublication = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateDraftedPublication
    );

    React.useEffect(() => {
        updateDraftedPublication(props.draftedPublication);
        if (props.draftedPublication?.title) updateTitle(props.draftedPublication.title);
        if (props.draftedPublication?.type) updateType(props.draftedPublication.type);
        if (props.draftedPublication?.content) updateContent(props.draftedPublication.content);
        if (props.draftedPublication?.licence) updateLicence(props.draftedPublication.licence);
        if (props.draftedPublication?.conflictOfInterestStatus)
            updateConflictOfInterestStatus(props.draftedPublication.conflictOfInterestStatus);
        if (props.draftedPublication?.conflictOfInterestText)
            updateConflictOfInterestText(props.draftedPublication.conflictOfInterestText);
        if (props.forPublicationID) updateForPublicationsID(props.forPublicationID);
    }, []);

    React.useEffect(() => {
        router.push(
            {
                query: { ...router.query, step: currentStep }
            },
            undefined,
            { shallow: true }
        );
    }, [currentStep]);

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.createPublication.canonical} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.BuildPublication
                steps={steps}
                currentStep={currentStep}
                setStep={setCurrentStep}
                publication={publication}
                token={props.token}
            >
                {publication
                    ? steps.map(
                          (step, index) =>
                              index === currentStep && (
                                  <Framer.motion.section
                                      key={index}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.35 }}
                                  >
                                      {step.component}
                                  </Framer.motion.section>
                              )
                      )
                    : null}
            </Layouts.BuildPublication>
        </>
    );
};

export default Edit;
