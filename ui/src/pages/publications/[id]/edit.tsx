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
        title: 'Key information',
        subTitle: 'Key information',
        component: <Components.PublicationCreationStepOne />,
        icon: <OutlineIcons.FingerPrintIcon className="h-6 w-6 text-teal-400" />
    },
    {
        title: 'Linked publications',
        subTitle: 'Linked publications',
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
        title: 'Conflict of interest',
        subTitle: 'Conflict of interest',
        component: <Components.PublicationCreationStepThree />,
        icon: <OutlineIcons.SearchIcon className="h-5 w-5 text-teal-400" />
    },
    {
        title: 'Co-authors',
        subTitle: 'Co-authors',
        component: <Components.PublicationCreationCoAuthor />,
        icon: <OutlineIcons.UserGroupIcon className="h-5 w-5 text-teal-400" />
    },
    {
        title: 'Funders',
        subTitle: 'Funders',
        component: <Components.PublicationCreationFunders />,
        icon: <OutlineIcons.CurrencyPoundIcon className="h-5 w-5 text-teal-400" />
    },
    {
        title: 'Declarations',
        subTitle: 'Declarations & statements',
        component: <Components.PublicationCreationDelclarationsAndStatements />,
        icon: <OutlineIcons.DocumentReportIcon className="h-6 w-6 text-teal-400" />
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

    if (draftedPublication?.currentStatus !== 'DRAFT') {
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
    const store = Stores.usePublicationCreationStore();

    // Choose which flow steps/pages to include based on the publication type
    const stepsToUse = React.useMemo(() => {
        let arr = [];
        switch (props.draftedPublication.type) {
            case Config.values.octopusInformation.publications.DATA.id:
                arr = steps;
                break;
            default:
                arr = [steps[0], steps[1], steps[2], steps[3], steps[4], steps[5], steps[6], steps[7]];
        }
        return arr;
    }, [props.draftedPublication.type]);

    // Choose which step to land the page on
    let defaultStep = React.useMemo(() => {
        let defaultStep = props.step ? parseInt(props.step) : 0;
        defaultStep = defaultStep <= steps.length - 1 && defaultStep >= 0 ? defaultStep : 0;
        return defaultStep;
    }, [props.step]);

    const [currentStep, setCurrentStep] = React.useState(defaultStep);
    const [publication] = React.useState(props.draftedPublication);

    React.useEffect(() => {
        if (props.draftedPublication.id) {
            store.updateId(props.draftedPublication.id);
        }

        if (props.draftedPublication.title) {
            store.updateTitle(props.draftedPublication.title);
        }

        if (props.draftedPublication.type) {
            store.updateType(props.draftedPublication.type);
        }

        if (props.draftedPublication.description) {
            store.updateDescription(props.draftedPublication.description);
        }

        if (props.draftedPublication.keywords.length) {
            store.updateKeywords(props.draftedPublication.keywords.join(', '));
        } else {
            store.updateKeywords('');
        }

        if (props.draftedPublication.content) {
            store.updateContent(props.draftedPublication.content);
        }

        if (props.draftedPublication.licence) {
            store.updateLicence(props.draftedPublication.licence);
        }
        if (props.draftedPublication.language) {
            store.updateLanguage(props.draftedPublication.language);
        }

        if (props.draftedPublication.conflictOfInterestStatus) {
            store.updateConflictOfInterestStatus(props.draftedPublication.conflictOfInterestStatus);
        }

        if (props.draftedPublication.conflictOfInterestText) {
            store.updateConflictOfInterestText(props.draftedPublication.conflictOfInterestText);
            store.updateLinkTo(props.draftedPublication.linkedTo);
        }

        if (props.draftedPublication.ethicalStatement !== null) {
            store.updateEthicalStatement(props.draftedPublication.ethicalStatement);
        }
        if (props.draftedPublication.ethicalStatementFreeText) {
            store.updateEthicalStatementFreeText(props.draftedPublication.ethicalStatementFreeText);
        }

        store.updateLinkTo(props.draftedPublication.linkedTo);
        store.updateCoAuthors(props.draftedPublication.coAuthors);
        store.updateFunders(props.draftedPublication.funders);
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
                steps={stepsToUse}
                currentStep={currentStep}
                setStep={setCurrentStep}
                publication={publication}
                token={props.token}
            >
                {publication
                    ? stepsToUse.map(
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
