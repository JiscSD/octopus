import React from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

/**
 * @description Edit title
 */
const StepOne: React.FC = () => {
    const title = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.title);
    const updateTitle = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateTitle
    );
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);

    return (
        <>
            <div className="mb-6 lg:mb-10">
                <label className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                    What is the title of this publication?
                </label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="block w-10/12 rounded-md border bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white"
                />
            </div>
            <div className="mb-6">
                <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                    {Helpers.formatPublicationType(type)}
                </span>
                <p className="text-grey-800 dark:text-white">
                    You have chosen this publication to of type `{Helpers.formatPublicationType(type)}`. This can now{' '}
                    <strong>not</strong> be changed.
                </p>
                <p className="text-grey-800 dark:text-white">
                    If you wish to change the publication type, you must delete this publication and create a{' '}
                    <Components.Link
                        href={Config.urls.createPublication.path}
                        className="rounded outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <span className="underline decoration-teal-500 decoration-2 underline-offset-2">new</span>
                    </Components.Link>
                    .
                </p>
            </div>
        </>
    );
};

/**
 * @description Edit links
 */
const StepTwo = () => {
    // from the store
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);
    const forPublicationsID = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.forPublicationsID
    );

    const [limit, setLimit] = React.useState(10);
    const [publicationLinkToList, setPublicationLinkToList] = React.useState<Interfaces.Publication[] | []>([]);
    const [fetchForError, setFetchForError] = React.useState<string | null>(null);
    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);
    const formattedAsString = availableLinkTypes.join(',');

    const swrKey = `/publications?type=${formattedAsString}&limit=${limit}&orderBy=publishedDate&orderDirection=asc`;

    const {
        data: { data: results = [] } = {},
        error,
        isValidating
    } = useSWR(swrKey, null, {
        fallback: {
            '/publications': []
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const removeFromLinkToList = (publication: Interfaces.Publication) => {
        const set = new Set(publicationLinkToList);
        set.delete(publication);
        setPublicationLinkToList(Array.from(set));
    };

    const manageAvailableToAdd = (availablePublication: Interfaces.Publication) => {
        // get already linked TODO

        // Known bug, publicatiosn from single endpoint are of different shape to from getall, so set will see them as the same and double up.
        const current = [...publicationLinkToList, availablePublication]; // current in state
        const unquie = new Set(current);
        setPublicationLinkToList(Array.from(unquie));
    };

    const getAskedForPublication = async (id: string) => {
        setFetchForError(null);
        try {
            const response = await api.get(`${Config.endpoints.publications}/${id}`, undefined);
            // null check because api returns null if publication isnt found rather than error code
            if (response.data) {
                manageAvailableToAdd(response.data);
            } else {
                throw new Error();
            }
        } catch (err) {
            setFetchForError('There was a problem fetching the publication you chose to link from.');
        }
    };

    React.useEffect(() => {
        if (forPublicationsID) getAskedForPublication(forPublicationsID);
    }, [forPublicationsID]);

    return (
        <>
            <h1 className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                What publications do you want to linked to?
            </h1>

            <p className="mb-6 block text-grey-800 transition-colors duration-500 dark:text-white">
                <span>
                    A{' '}
                    <Components.Link
                        href={`${Config.urls.about.path}#${type}`}
                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                    >
                        <span>{Helpers.formatPublicationType(type)}</span>
                    </Components.Link>{' '}
                    can link back to:{' '}
                </span>
                {availableLinkTypes.map((type, index) => (
                    <span key={type}>
                        <Components.Link
                            href={`${Config.urls.about.path}#${type}`}
                            openNew={true}
                            className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                        >
                            <span>{Helpers.formatPublicationType(type)}</span>
                        </Components.Link>
                        {index !== availableLinkTypes.length - 1 ? ', ' : '.'}
                    </span>
                ))}
            </p>

            {error && !isValidating && <Components.Alert severity="ERROR" title={error} className="mb-6 w-fit" />}
            {fetchForError && (
                <Components.Alert severity="ERROR" title={fetchForError} allowDismiss={true} className="mb-6 w-fit" />
            )}

            <div className="my-10 lg:mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3>Choose from the below</h3>
                        {!error &&
                            !isValidating &&
                            results.data?.length &&
                            results.data.map((availablePublication: Interfaces.Publication) => (
                                <button
                                    onClick={() => manageAvailableToAdd(availablePublication)}
                                    key={availablePublication.id}
                                >
                                    {availablePublication.title}
                                </button>
                            ))}
                    </div>
                    <div>
                        <h3>Selected for linking</h3>
                        {publicationLinkToList.map((addedPublication) => (
                            <div key={addedPublication.id} className="grid grid-cols-12">
                                <span className="col-span-11">{addedPublication.title}</span>
                                <button className="col-span-1" onClick={() => removeFromLinkToList(addedPublication)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const StepThree = () => {
    return <div>step 3 yay</div>;
};

const StepFour = () => {
    return <div>step 4 yay</div>;
};

const StepFive = () => {
    return <div>step 5 yay</div>;
};

const steps: Interfaces.PublicationBuildingStep[] = [
    {
        title: 'Side bar title needed',
        subTitle: 'Page sub title needed',
        component: <StepOne />
    },
    {
        title: 'Create links',
        subTitle: 'Some sub title here',
        component: <StepTwo />
    },
    {
        title: 'Licence & COI',
        subTitle: 'Some sub title here',
        component: <StepThree />
    },
    {
        title: 'Full text',
        subTitle: 'Some sub title here',
        component: <StepFour />
    },
    {
        title: 'Review & Publish <span role="img" aria-label="rocket" className="pl-2">🚀</span>',
        subTitle: 'Once a publication is published, it is NOT editable.',
        component: <StepFive />
    }
];

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    let draftedPublicationID: string | string[] | null = null;
    let draftedPublication: Interfaces.Publication | null = null;
    let forPublicationID: string | string[] | null = null;
    let error: string | null = null;

    if (context.query.id) draftedPublicationID = context.query.id;
    if (context.query.for) forPublicationID = context.query.for;
    if (Array.isArray(draftedPublicationID)) draftedPublicationID = draftedPublicationID[0];
    // we're only dealing with one provided publication to link to from params for now.
    // future feature to support multiple
    if (Array.isArray(draftedPublicationID)) draftedPublicationID = draftedPublicationID[0];

    // handle pre loading a drafted publication & passing it as a page prop
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
            token,
            error
        }
    };
};

type Props = {
    draftedPublication: Interfaces.Publication;
    forPublicationID: string | null;
    token: string;
    error: string | null;
};

const Edit: Types.NextPage<Props> = (props): JSX.Element => {
    const [currentStep, setCurrentStep] = React.useState(0);
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

    React.useEffect(() => {
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

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords} />
                <link rel="canonical" href={`${Config.urls.createPublication.canonical}`} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.BuildPublication
                steps={steps}
                currentStep={currentStep}
                setStep={setCurrentStep}
                publication={publication}
                token={props.token}
            >
                {steps.map(
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
                )}
            </Layouts.BuildPublication>
        </>
    );
};

export default Edit;
