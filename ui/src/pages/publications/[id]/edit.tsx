import React from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/outline';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';

import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Types from '@types';

const steps: Types.CreationSteps = {
    KEY_INFORMATION: {
        title: 'Key information',
        subTitle: 'Key information',
        component: <Components.PublicationCreationKeyInformation />,
        icon: <OutlineIcons.FingerPrintIcon className="h-6 w-6 text-teal-400" />
    },
    LINKED_PUBLICATIONS: {
        title: 'Linked publications',
        subTitle: 'Linked publications',
        component: <Components.PublicationCreationLinkedPublications />,
        icon: <OutlineIcons.CubeTransparentIcon className="h-6 w-6 text-teal-400" />
    },
    MAIN_TEXT: {
        title: 'Main text',
        subTitle: 'Main text',
        component: <Components.PublicationCreationMainText />,
        icon: <OutlineIcons.PencilIcon className="h-5 w-5 text-teal-400" />
    },
    CONFLICT_OF_INTEREST: {
        title: 'Conflict of interest',
        subTitle: 'Conflict of interest',
        component: <Components.PublicationCreationConflictOfInterest />,
        icon: <OutlineIcons.SearchIcon className="h-5 w-5 text-teal-400" />
    },
    CO_AUTHORS: {
        title: 'Co-authors',
        subTitle: 'Co-authors',
        component: <Components.PublicationCreationCoAuthor />,
        icon: <OutlineIcons.UserGroupIcon className="h-5 w-5 text-teal-400" />
    },
    FUNDERS: {
        title: 'Funders',
        subTitle: 'Funders',
        component: <Components.PublicationCreationFunders />,
        icon: <OutlineIcons.CurrencyPoundIcon className="h-5 w-5 text-teal-400" />
    },
    DATA_STATEMENT: {
        title: 'Data statements',
        subTitle: 'Data statements',
        component: <Components.PublicationCreationDataStatements />,
        icon: <OutlineIcons.DocumentReportIcon className="h-6 w-6 text-teal-400" />
    },
    RESEARCH_PROCESS: {
        title: 'Research process',
        subTitle: 'Research process',
        component: <Components.PublicationCreationResearchProcess />,
        icon: <OutlineIcons.DocumentReportIcon className="h-6 w-6 text-teal-400" />
    },
    REVIEW: {
        title: 'Review & publish',
        subTitle: 'Review your publications content',
        component: <Components.PublicationCreationReview />,
        icon: <OutlineIcons.CloudIcon className="h-5 w-5 text-teal-400" />
    }
};

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // prevent unauthenticated users to access this page
    await Helpers.guardPrivateRoute(context);
    const token = Helpers.getJWT(context);

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
            error,
            protectedPage: true
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
    const { updateReferences, updateCoAuthors, ...store } = Stores.usePublicationCreationStore();

    // Choose which flow steps/pages to include based on the publication type
    const stepsToUse = React.useMemo(() => {
        let arr: Interfaces.CreationStep[] = [];
        switch (props.draftedPublication.type) {
            case Config.values.octopusInformation.publications.DATA.id:
                arr = [
                    steps.KEY_INFORMATION,
                    steps.LINKED_PUBLICATIONS,
                    steps.MAIN_TEXT,
                    steps.CONFLICT_OF_INTEREST,
                    steps.FUNDERS,
                    steps.DATA_STATEMENT,
                    steps.CO_AUTHORS,
                    steps.REVIEW
                ];
                break;
            case Config.values.octopusInformation.publications.PROTOCOL.id:
                arr = [
                    steps.KEY_INFORMATION,
                    steps.LINKED_PUBLICATIONS,
                    steps.MAIN_TEXT,
                    steps.CONFLICT_OF_INTEREST,
                    steps.FUNDERS,
                    steps.RESEARCH_PROCESS,
                    steps.CO_AUTHORS,
                    steps.REVIEW
                ];
                break;
            case Config.values.octopusInformation.publications.HYPOTHESIS.id:
                arr = [
                    steps.KEY_INFORMATION,
                    steps.LINKED_PUBLICATIONS,
                    steps.MAIN_TEXT,
                    steps.CONFLICT_OF_INTEREST,
                    steps.FUNDERS,
                    steps.RESEARCH_PROCESS,
                    steps.CO_AUTHORS,
                    steps.REVIEW
                ];
                break;
            default:
                arr = [
                    steps.KEY_INFORMATION,
                    steps.LINKED_PUBLICATIONS,
                    steps.MAIN_TEXT,
                    steps.CONFLICT_OF_INTEREST,
                    steps.FUNDERS,
                    steps.CO_AUTHORS,
                    steps.REVIEW
                ];
        }
        return arr;
    }, [props.draftedPublication.type]);

    // Choose which step to land the page on
    let defaultStep = React.useMemo(() => {
        let defaultStep = props.step ? parseInt(props.step) : 0;
        defaultStep = defaultStep <= stepsToUse.length - 1 && defaultStep >= 0 ? defaultStep : 0;
        return defaultStep;
    }, [props.step]);

    const [currentStep, setCurrentStep] = React.useState(defaultStep);
    const [publication] = React.useState(props.draftedPublication);

    const fetchAndSetReferences = React.useCallback(async () => {
        if (props.draftedPublication.id) {
            try {
                const response = await api.get(`/publications/${props.draftedPublication.id}/reference`, props.token);
                updateReferences(response.data);
            } catch (err) {
                // todo: improve error handling
                console.log(err);
            }
        }
    }, [props.draftedPublication.id, props.token, updateReferences]);

    const fetchAndSetAuthors = React.useCallback(async () => {
        if (props.draftedPublication.id) {
            try {
                const response = await api.get(`/publications/${props.draftedPublication.id}/coauthors`, props.token);
                updateCoAuthors(response.data);
            } catch (err) {
                // todo: improve error handling
                console.log(err);
            }
        }
    }, [props.draftedPublication.id, props.token, updateCoAuthors]);

    React.useEffect(() => {
        fetchAndSetReferences();
        fetchAndSetAuthors();
    }, [fetchAndSetReferences, fetchAndSetAuthors]);

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

        if (props.draftedPublication.selfDeclaration) {
            store.updateSelfDeclaration(props.draftedPublication.selfDeclaration);
        }

        if (props.draftedPublication.dataAccessStatement) {
            store.updateDataAccessStatement(props.draftedPublication.dataAccessStatement);
        }

        if (props.draftedPublication.dataPermissionsStatement) {
            store.updateDataPermissionsStatemnt(props.draftedPublication.dataPermissionsStatement);
        }

        if (props.draftedPublication.dataPermissionsStatementProvidedBy) {
            store.updateDataPermissionsStatementProvidedBy(props.draftedPublication.dataPermissionsStatementProvidedBy);
        }

        store.updateLinkTo(props.draftedPublication.linkedTo);
        store.updateFunders(props.draftedPublication.funders);
        store.updateFunderStatement(props.draftedPublication.fundersStatement);
        store.updateAffiliations(props.draftedPublication.affiliations);
        store.updateAffiliationsStatement(props.draftedPublication.affiliationStatement);
        store.updateConflictOfInterestStatus(props.draftedPublication.conflictOfInterestStatus);
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
