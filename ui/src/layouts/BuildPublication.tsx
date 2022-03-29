import React from 'react';
import parse from 'html-react-parser';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

type NavigationButtonProps = {
    text: string;
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    icon: React.ReactElement;
    iconPosition: 'LEFT' | 'RIGHT';
};

const NavigationButton: React.FC<NavigationButtonProps> = (props) => (
    <button
        disabled={props.disabled}
        onClick={props.onClick}
        className={`flex items-center space-x-2 rounded-sm py-1 text-sm font-medium text-grey-800 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed dark:text-white-50 ${
            props.className ? props.className : ''
        }`}
    >
        {props.iconPosition === 'LEFT' && props.icon}
        <span>{props.text}</span>
        {props.iconPosition === 'RIGHT' && props.icon}
    </button>
);

type BuildPublicationProps = {
    steps: Interfaces.PublicationBuildingStep[];
    currentStep: number;
    setStep: any; //Not sure what type we can use for a state setter than has access tp previous state
    publication: Interfaces.Publication;
    token: string;
    children: React.ReactNode;
};

const BuildPublication: React.FC<BuildPublicationProps> = (props) => {
    const router = Router.useRouter();
    const user = Stores.useAuthStore((state) => state.user);
    const error = Stores.usePublicationCreationStore((state) => state.error);
    const setError = Stores.usePublicationCreationStore((state) => state.setError);
    const title = Stores.usePublicationCreationStore((state) => state.title);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const content = Stores.usePublicationCreationStore((state) => state.content);
    const licence = Stores.usePublicationCreationStore((state) => state.licence);
    const conflictOfInterestStatus = Stores.usePublicationCreationStore((state) => state.conflictOfInterestStatus);
    const conflictOfInterestText = Stores.usePublicationCreationStore((state) => state.conflictOfInterestText);

    const [saveExitModalVisibility, setSaveExitModalVisibility] = React.useState(false);
    const [publishModalVisibility, setPublishModalVisibility] = React.useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState(false);

    const prevStep = () => props.setStep((prevState: number) => prevState - 1);
    const nextStep = () => props.setStep((prevState: number) => prevState + 1);

    const saveCurrent = async () => {
        if (conflictOfInterestStatus && !conflictOfInterestText.length) {
            props.setStep(2);
            throw new Error('You must provide a conflict of interest reason.');
        }

        await api.patch(
            `${Config.endpoints.publications}/${props.publication.id}`,
            {
                title,
                content,
                licence,
                conflictOfInterestStatus,
                conflictOfInterestText
            },
            props.token
        );
    };

    const publish = async () => {
        setError(null);
        try {
            await saveCurrent();
            await api.put(`${Config.endpoints.publications}/${props.publication.id}/status/LIVE`, {}, props.token);
            router.push({
                pathname: `${Config.urls.viewPublication.path}/${props.publication.id}`
            });
        } catch (err) {
            // server is giving a nice response message, but that is not th err message recived, can not access response message due to throw
            // const { message } = err as Interfaces.JSONResponseError;
            setError('Publication is not ready to be made LIVE. Make sure all fields are filled in.'); // hard coded server response
        }

        setPublishModalVisibility(false);
    };

    const saveExit = async () => {
        setError(null);
        try {
            await saveCurrent();
            router.push({
                pathname: Config.urls.browsePublications.path
            });
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setError(message);
        }

        setSaveExitModalVisibility(false);
    };

    const deleteExit = async () => {
        setError(null);
        try {
            await api.destroy(`${Config.endpoints.publications}/${props.publication.id}`, props.token);
            router.push({
                pathname: user ? `${Config.urls.viewUser.path}/${user?.id}` : Config.urls.browsePublications.path
            });
        } catch (err) {
            setError('There was a problem deleting this publicaiton');
        }

        setDeleteModalVisibility(false);
    };

    return (
        <>
            <Components.Modal
                open={saveExitModalVisibility}
                setOpen={setSaveExitModalVisibility}
                positiveActionCallback={saveExit}
                positiveButtonText="Save and exit"
                cancelButtonText="Cancel"
                title="Are you sure you want to leave?"
                icon={<OutlineIcons.SaveIcon className="text-green-600 h-10 w-10" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">
                    Changes to your publication will be saved and it&apos;s status kept as draft.
                </p>
            </Components.Modal>
            <Components.Modal
                open={publishModalVisibility}
                setOpen={setPublishModalVisibility}
                positiveActionCallback={publish}
                positiveButtonText="Yes, save &amp; publish"
                cancelButtonText="Cancel"
                title="Are you sure you want to publish?"
                icon={<OutlineIcons.AcademicCapIcon className="text-green-600 h-10 w-10" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">It is not possible to make any changes post-publication.</p>
            </Components.Modal>
            <Components.Modal
                open={deleteModalVisibility}
                setOpen={setDeleteModalVisibility}
                positiveActionCallback={deleteExit}
                positiveButtonText="Yes, delete this draft"
                cancelButtonText="Cancel"
                title="Are you sure you want to delete this publication?"
                icon={<OutlineIcons.TrashIcon className="text-green-600 h-10 w-10" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">
                    You are about to delete this draft publication, all progress will be lost.
                </p>
            </Components.Modal>
            <Components.Header fixed={false} hasBorder={false} />
            <main className="grid min-h-screen grid-cols-12">
                <aside className="dark: relative col-span-2 hidden h-full border-r border-t border-transparent bg-teal-700 pt-9 transition-colors duration-500 dark:border-grey-400 lg:block">
                    <ul className="sticky top-0 space-y-2">
                        {props.steps.map((step, index) => (
                            <li key={step.title}>
                                <button
                                    onClick={() => props.setStep(index)}
                                    className={`flex w-full items-center space-x-4 py-4 pl-8 pr-2 text-left font-montserrat font-medium text-white-100 underline decoration-transparent decoration-2 outline-0 ring-inset transition-colors duration-150 focus:ring-2 focus:ring-yellow-400 dark:text-grey-50 dark:hover:text-white-50 ${
                                        index === props.currentStep ? 'bg-teal-600 text-white-50' : ''
                                    }`}
                                >
                                    {step.icon}
                                    <span className="-mb-1">{step.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="fixed bottom-6 px-8">
                        <span className="block font-montserrat text-sm text-white-100">Need help?</span>
                        <span className="block font-montserrat text-xs text-white-100">Check out our FAQs</span>
                    </div>
                </aside>
                <section className="col-span-12 border-t border-grey-100 p-8 transition-colors duration-500 dark:border-grey-400 lg:col-span-10 lg:py-12 lg:px-16">
                    <div className="mb-12 flex flex-col items-end lg:flex-row lg:justify-between">
                        <span className="block font-montserrat text-lg font-semibold text-teal-600 transition-colors duration-500 dark:text-teal-400">
                            {Helpers.formatPublicationType(type)}
                        </span>
                        <div className="flex space-x-8">
                            <NavigationButton
                                text="Previous"
                                disabled={props.currentStep <= 0}
                                onClick={prevStep}
                                icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                                iconPosition="LEFT"
                            />
                            {props.currentStep < props.steps.length - 1 && (
                                <NavigationButton
                                    text="Next"
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    onClick={nextStep}
                                    icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                    iconPosition="RIGHT"
                                />
                            )}
                            {props.currentStep === props.steps.length - 1 && (
                                <NavigationButton
                                    text="Publish"
                                    onClick={() => setPublishModalVisibility(true)}
                                    className=""
                                    disabled={!!error}
                                    icon={<OutlineIcons.StarIcon className="h-5 w-5 text-teal-600" />}
                                    iconPosition="RIGHT"
                                />
                            )}
                            <NavigationButton
                                text="Save and exit"
                                onClick={() => setSaveExitModalVisibility(true)}
                                className=""
                                icon={<OutlineIcons.SaveAsIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />
                            <NavigationButton
                                text="Delete draft"
                                onClick={() => setDeleteModalVisibility(true)}
                                className=""
                                icon={<OutlineIcons.TrashIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />

                            <button
                                onClick={() => {
                                    router.push(`${Config.urls.viewPublication.path}/${props.publication.id}`);
                                }}
                                className="block rounded bg-teal-500 px-3 py-1 text-sm font-medium text-white-50 outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed lg:hidden"
                            >
                                Preview publication
                            </button>
                        </div>
                    </div>
                    {!!error && (
                        <Components.Alert severity="ERROR" title={error} allowDismiss className="mb-12 w-fit" />
                    )}
                    <div className="mb-12">{props.children}</div>
                </section>
            </main>
        </>
    );
};

export default BuildPublication;
