import React from 'react';
import Head from 'next/head';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

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
    const publicationId = context.query.id as string;
    const step = (context.query.step as string) || Object.keys(steps)[0];

    // get latest version
    const publicationVersion = await api
        .get(`${Config.endpoints.publications}/${publicationId}/publication-versions/latest`, token)
        .then((res) => res.data as Interfaces.PublicationVersion)
        .catch((error) => console.log(error));

    if (!publicationVersion) {
        return {
            notFound: true
        };
    }

    if (publicationVersion.currentStatus !== 'DRAFT') {
        return {
            redirect: {
                destination: `${Config.urls.viewPublication.path}/${publicationVersion.versionOf}`,
                permanent: false
            }
        };
    }

    // get linked publications and references
    const promises: [Promise<Interfaces.PublicationWithLinks | void>, Promise<Interfaces.Reference[] | void>] = [
        api
            .get(`${Config.endpoints.publications}/${publicationId}/links?direct=true`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error)),
        api
            .get(`${Config.endpoints.publicationVersions}/${publicationVersion.id}/references`, token)
            .then((res) => res.data)
            .catch((error) => console.log(error))
    ];

    const [directLinks = { publication: null, linkedTo: [], linkedFrom: [] }, references = []] =
        await Promise.all(promises);

    return {
        props: {
            publicationVersion,
            references,
            directLinks,
            step,
            token,
            protectedPage: true
        }
    };
});

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    references: Interfaces.Reference[];
    directLinks: Interfaces.PublicationWithLinks;
    step: string;
    token: string;
    error: string | null;
};

const Edit: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const store = Stores.usePublicationCreationStore();
    const { updateReferences, updateLinkedTo, updatePublicationVersion } = store;

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
        switch (props.publicationVersion.publication.type) {
            case Config.values.octopusInformation.publicationTypes.DATA.id:
                arr = [...arr, steps.DATA_STATEMENT, steps.CO_AUTHORS];
                break;
            case Config.values.octopusInformation.publicationTypes.PROTOCOL.id:
                arr = [...arr, steps.RESEARCH_PROCESS, steps.CO_AUTHORS];
                break;
            case Config.values.octopusInformation.publicationTypes.HYPOTHESIS.id:
                arr = [...arr, steps.RESEARCH_PROCESS, steps.CO_AUTHORS];
                break;
            default:
                arr = [...arr, steps.CO_AUTHORS];
        }
        return arr;
    }, [props.publicationVersion.publication.type]);

    const stepsToUse = Helpers.getTabCompleteness(stepsByType, store);

    // Choose which step to land the page on
    let defaultStepIdx = React.useMemo(() => {
        let defaultStepIdx = props.step ? parseInt(props.step) : 0;
        defaultStepIdx = defaultStepIdx <= stepsToUse.length - 1 && defaultStepIdx >= 0 ? defaultStepIdx : 0;
        return defaultStepIdx;
    }, [props.step, stepsToUse.length]);

    const [currentStepIdx, setCurrentStepIdx] = React.useState(defaultStepIdx);
    const [publicationVersion] = React.useState(props.publicationVersion);

    React.useEffect(() => {
        updatePublicationVersion(props.publicationVersion);
    }, [props.publicationVersion, updatePublicationVersion]);

    React.useEffect(() => {
        updateReferences(props.references);
    }, [props.references, updateReferences]);

    React.useEffect(() => {
        updateLinkedTo(props.directLinks.linkedTo);
    }, [props.directLinks.linkedTo, updateLinkedTo]);

    React.useEffect(() => {
        router.push(
            {
                query: { ...router.query, step: currentStepIdx }
            },
            undefined,
            { shallow: true }
        );
    }, [currentStepIdx]);

    const currentStep = stepsToUse.find((step, index) => index === currentStepIdx);

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
                currentStep={currentStepIdx}
                setStep={setCurrentStepIdx}
                publicationVersion={publicationVersion}
                token={props.token}
            >
                {publicationVersion
                    ? currentStep && (
                          <Framer.motion.section
                              key={currentStepIdx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.35 }}
                          >
                              {currentStep.component}
                          </Framer.motion.section>
                      )
                    : null}
            </Layouts.BuildPublication>
        </>
    );
};

export default Edit;
