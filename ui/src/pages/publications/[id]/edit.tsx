import React from 'react';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';
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
        title: 'Page 1',
        subTitle: 'Page 1',
        component: <Components.PublicationCreationStepOne />,
        icon: <OutlineIcons.FingerPrintIcon className="h-6 w-6 text-teal-400" />
    },
    {
        title: 'Structural links',
        subTitle: 'Structural links',
        component: <Components.PublicationCreationStepTwo />,
        icon: <OutlineIcons.CubeTransparentIcon className="h-6 w-6 text-teal-400" />
    },
    {
        title: 'Main text',
        subTitle: 'Main text',
        component: <Components.PublicationCreationStepFour />,
        icon: <OutlineIcons.PencilIcon className="h-5 w-5 text-teal-400" />
    },
    {
        title: 'Page 3',
        subTitle: 'Page 3',
        component: <Components.PublicationCreationStepThree />,
        icon: <OutlineIcons.PencilAltIcon className="h-5 w-5 text-teal-400" />
    },
    {
        title: 'Review & publish',
        subTitle: 'Review your publications content',
        component: <Components.PublicationCreationStepFive />,
        icon: <OutlineIcons.CloudIcon className="h-5 w-5 text-teal-400" />
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

const Edit: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    let defaultStep = props.step ? parseInt(props.step) : 0;
    defaultStep = defaultStep <= steps.length - 1 && defaultStep >= 0 ? defaultStep : 0;

    const [currentStep, setCurrentStep] = React.useState(defaultStep);
    const [publication] = React.useState(props.draftedPublication);

    const updateId = Stores.usePublicationCreationStore((state) => state.updateId);
    const updateTitle = Stores.usePublicationCreationStore((state) => state.updateTitle);
    const updateType = Stores.usePublicationCreationStore((state) => state.updateType);
    const updateContent = Stores.usePublicationCreationStore((state) => state.updateContent);
    const updateLicence = Stores.usePublicationCreationStore((state) => state.updateLicence);
    const updateConflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state) => state.updateConflictOfInterestStatus
    );
    const updateConflictOfInterestText = Stores.usePublicationCreationStore(
        (state) => state.updateConflictOfInterestText
    );
    const updateLinkTo = Stores.usePublicationCreationStore((state) => state.updateLinkTo);

    React.useEffect(() => {
        if (props.draftedPublication.id) updateId(props.draftedPublication.id);
        if (props.draftedPublication?.title) updateTitle(props.draftedPublication.title);
        if (props.draftedPublication?.type) updateType(props.draftedPublication.type);
        if (props.draftedPublication?.content) updateContent(props.draftedPublication.content);
        if (props.draftedPublication?.licence) updateLicence(props.draftedPublication.licence);
        if (props.draftedPublication?.conflictOfInterestStatus)
            updateConflictOfInterestStatus(props.draftedPublication.conflictOfInterestStatus);
        if (props.draftedPublication?.conflictOfInterestText)
            updateConflictOfInterestText(props.draftedPublication.conflictOfInterestText);
        updateLinkTo(props.draftedPublication.linkedTo);
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
