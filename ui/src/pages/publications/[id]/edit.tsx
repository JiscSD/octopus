import React from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';
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
        id: 'KEY_INFORMATION',
        title: 'Key information',
        subTitle: 'Key information',
        component: <Components.PublicationCreationKeyInformation />,
        icon: <OutlineIcons.FingerPrintIcon className="h-6 w-6 text-teal-300" />
    },
    AFFILIATIONS: {
        id: 'AFFILIATIONS',
        title: 'Affiliations',
        subTitle: 'Affiliations',
        component: <Components.PublicationCreationAffiliations />,
        icon: <OutlineIcons.TagIcon className="h-6 w-6 text-teal-300" />
    },
    LINKED_ITEMS: {
        id: 'LINKED_ITEMS',
        title: 'Linked items',
        subTitle: 'Linked items',
        component: <Components.PublicationCreationLinkedItems />,
        icon: <OutlineIcons.CubeTransparentIcon className="h-6 w-6 text-teal-300" />
    },
    MAIN_TEXT: {
        id: 'MAIN_TEXT',
        title: 'Main text',
        subTitle: 'Main text',
        component: <Components.PublicationCreationMainText />,
        icon: <OutlineIcons.PencilIcon className="h-5 w-5 text-teal-300" />
    },
    CONFLICT_OF_INTEREST: {
        id: 'CONFLICT_OF_INTEREST',
        title: 'Conflict of interest',
        subTitle: 'Conflict of interest',
        component: <Components.PublicationCreationConflictOfInterest />,
        icon: <OutlineIcons.MagnifyingGlassIcon className="h-5 w-5 text-teal-400" />
    },
    CO_AUTHORS: {
        id: 'CO_AUTHORS',
        title: 'Co-authors',
        subTitle: 'Co-authors',
        component: <Components.PublicationCreationCoAuthor />,
        icon: <OutlineIcons.UserGroupIcon className="h-5 w-5 text-teal-300" />
    },
    FUNDERS: {
        id: 'FUNDERS',
        title: 'Funders',
        subTitle: 'Funders',
        component: <Components.PublicationCreationFunders />,
        icon: <OutlineIcons.CurrencyPoundIcon className="h-5 w-5 text-teal-300" />
    },
    DATA_STATEMENT: {
        id: 'DATA_STATEMENT',
        title: 'Data statements',
        subTitle: 'Data statements',
        component: <Components.PublicationCreationDataStatements />,
        icon: <OutlineIcons.DocumentChartBarIcon className="h-6 w-6 text-teal-400" />
    },
    RESEARCH_PROCESS: {
        id: 'RESEARCH_PROCESS',
        title: 'Research process',
        subTitle: 'Research process',
        component: <Components.PublicationCreationResearchProcess />,
        icon: <OutlineIcons.DocumentChartBarIcon className="h-6 w-6 text-teal-300" />
    }
};

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
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

    if (draftedPublication?.currentStatus === 'LOCKED') {
        return {
            redirect: {
                destination: `${Config.urls.viewPublication.path}/${draftedPublication.id}`,
                permanent: false
            }
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
});

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
    const stepsByType = React.useMemo(() => {
        let arr: Interfaces.CreationStep[] = [
            steps.KEY_INFORMATION,
            steps.AFFILIATIONS,
            steps.LINKED_ITEMS,
            steps.MAIN_TEXT,
            steps.CONFLICT_OF_INTEREST,
            steps.FUNDERS
        ];
        switch (props.draftedPublication.type) {
            case Config.values.octopusInformation.publications.DATA.id:
                arr = [...arr, steps.DATA_STATEMENT, steps.CO_AUTHORS];
                break;
            case Config.values.octopusInformation.publications.PROTOCOL.id:
                arr = [...arr, steps.RESEARCH_PROCESS, steps.CO_AUTHORS];
                break;
            case Config.values.octopusInformation.publications.HYPOTHESIS.id:
                arr = [...arr, steps.RESEARCH_PROCESS, steps.CO_AUTHORS];
                break;
            default:
                arr = [...arr, steps.CO_AUTHORS];
        }
        return arr;
    }, [props.draftedPublication.type]);

    const stepsToUse = Helpers.getTabCompleteness(stepsByType, store);

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
                store.updateReferences(response.data);
            } catch (err) {
                // todo: improve error handling
                console.log(err);
            }
        }
    }, [props.draftedPublication.id, props.token, store.updateReferences]);

    const fetchAndSetAuthors = React.useCallback(async () => {
        if (props.draftedPublication.id) {
            try {
                const response = await api.get(`/publications/${props.draftedPublication.id}/coauthors`, props.token);
                store.updateCoAuthors(response.data);
            } catch (err) {
                // todo: improve error handling
                console.log(err);
            }
        }
    }, [props.draftedPublication.id, props.token, store.updateCoAuthors]);

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

        const correspondingAuthor = props.draftedPublication?.coAuthors.find(
            (author) => author.linkedUser === props.draftedPublication.createdBy
        );

        store.updateAuthorAffiliations(correspondingAuthor?.affiliations || []);
        store.updateIsIndependentAuthor(correspondingAuthor?.isIndependent || false);

        store.updateAffiliationsStatement(props.draftedPublication.affiliationStatement);
        store.updateConflictOfInterestStatus(props.draftedPublication.conflictOfInterestStatus);
        store.updateTopics(props.draftedPublication.topics);
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
