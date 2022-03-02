import React from 'react';
import Head from 'next/head';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

const StepOne: React.FC = () => {
    const title = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.title);
    const updateTitle = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateTitle
    );
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);
    const updateType = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateType
    );
    const linkedFromPublication = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.linkedFromPublication
    );

    return (
        <div>
            <p>{title}</p>
            <input type="text" value={title} onChange={(e) => updateTitle(e.target.value)} />

            <p>{type}</p>

            <select onChange={(e) => updateType(e.target.value as Types.PublicationType)}>
                {Helpers.publicationsAvailabletoPublication(linkedFromPublication.type).map((item) => (
                    <option key={item} value={item} selected={type === item}>
                        {Helpers.formatPublicationType(item)}
                    </option>
                ))}
            </select>
        </div>
    );
};

const StepTwo = () => {
    return <div>step 2 yay</div>;
};

const StepThree = () => {
    return <div>step 3 yay</div>;
};

const StepFour = () => {
    return <div>step 4 yay</div>;
};

const steps: Interfaces.PublicationBuildingStep[] = [
    {
        title: 'Step 1 title here',
        subTitle: 'Some sub title here',
        component: <StepOne />
    },
    {
        title: 'Choose a licence',
        subTitle: 'Some sub title here',
        component: <StepTwo />
    },
    {
        title: 'Full text',
        subTitle: 'Some sub title here',
        component: <StepThree />
    },
    {
        title: 'Review & Publish',
        subTitle: 'Once a publication is published, it is NOT editable.',
        component: <StepFour />
    }
];

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    let draftedPublicationID: string | string[] | null = null;
    let draftedPublication: Interfaces.Publication | null = null;
    let error: string | null = null;

    if (context.query.id) draftedPublicationID = context.query.id;
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
            error
        }
    };
};

type Props = {
    draftedPublication?: Interfaces.Publication | null;
    error: string | null;
};

const Edit: Types.NextPage<Props> = (props): JSX.Element => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [publication, setPublication] = React.useState(props.draftedPublication ? props.draftedPublication : {});

    console.log(props.draftedPublication);

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
    // const updateLinkedFromPublication = Stores.usePublicationCreationStore(
    //     (state: Types.PublicationCreationStoreType) => state.linkedFromPublication
    // );

    const title = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.title);
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);
    const content = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.content);
    const licence = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.licence);
    const conflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestStatus
    );
    const conflictOfInterestText = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestText
    );
    const linkedFromPublication = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.linkedFromPublication
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
        // if (props.draftedPublication?.linkedTo.length)
        //     updateLinkedFromPublication(props.draftedPublication?.linkedTo[0].publicationToRef); // what the hell do we do here???

        console.log(props.draftedPublication?.linkedTo);
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
            >
                <>
                    {/* {steps.map(
                        (step, index) => index === currentStep && <section key={index}>{step.component}</section>
                    )} */}

                    <div className="my-12 bg-yellow-400">
                        dev testing:
                        <div>{title}</div>
                        <div>{type}</div>
                        <div>{content}</div>
                        <div>{licence}</div>
                        <div>{conflictOfInterestStatus && 'yes'}</div>
                        <div>{conflictOfInterestText}</div>
                        <div>{linkedFromPublication?.title}</div>
                    </div>
                </>
            </Layouts.BuildPublication>
        </>
    );
};

export default Edit;
