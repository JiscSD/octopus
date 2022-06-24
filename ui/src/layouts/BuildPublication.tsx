import React from 'react';
import * as Router from 'next/router';
import * as ReactIconsFA from 'react-icons/fa';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
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
        className={`font-lg flex items-center space-x-2 rounded-sm py-1 text-grey-800 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed dark:text-white-50 ${
            props.className ? props.className : ''
        }`}
    >
        {props.iconPosition === 'LEFT' && props.icon}
        <span>{props.text}</span>
        {props.iconPosition === 'RIGHT' && props.icon}
    </button>
);

type BuildPublicationProps = {
    steps: Interfaces.CreationStep[];
    currentStep: number;
    setStep: any; // Can be a page number or a callback of its own
    publication: Interfaces.Publication;
    token: string;
    children: React.ReactNode;
};

const BuildPublication: React.FC<BuildPublicationProps> = (props) => {
    const router = Router.useRouter();
    const user = Stores.useAuthStore((state) => state.user);
    const store = Stores.usePublicationCreationStore();
    const setToast = Stores.useToastStore((state) => state.setToast);

    const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
    const [publishModalVisibility, setPublishModalVisibility] = React.useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState(false);
    const [isReadyToPreview, setIsReadyToPreview] = React.useState(true);

    // Function called before action is taken, save, exit, preview, publish etc...
    const saveCurrent = async (message?: string) => {
        store.setError(null);

        const body: Interfaces.PublicationUpdateRequestBody = {
            title: store.title,
            content: store.content,
            description: store.description,
            keywords: Helpers.formatKeywords(store.keywords),
            licence: store.licence,
            language: store.language,
            conflictOfInterestStatus: store.conflictOfInterestStatus,
            conflictOfInterestText: store.conflictOfInterestText,
            affiliationStatement: store.affiliationsStatement,
            fundersStatement: store.funderStatement
        };

        if (store.type === 'DATA') {
            body.ethicalStatement = store.ethicalStatement;
            body.ethicalStatementFreeText = store.ethicalStatement !== null ? store.ethicalStatementFreeText : null;
            if (store.dataAccessStatement?.length) body.dataAccessStatement = store.dataAccessStatement;
            if (store.dataPermissionsStatement?.length) {
                body.dataPermissionsStatement = store.dataPermissionsStatement;
                body.dataPermissionsStatementProvidedBy = store.dataPermissionsStatementProvidedBy;
            }
        }

        if (store.type === 'PROTOCOL' || store.type === 'HYPOTHESIS') {
            body.selfDeclaration = store.selfDeclaration;
        }

        await api.patch(`${Config.endpoints.publications}/${props.publication.id}`, body, props.token);

        if (message) {
            setToast({
                visible: true,
                dismiss: true,
                title: message,
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: null
            });
        }
    };

    /**
     * @title Requesting to publish
     * @description When requesting to go live, we carry out a few checks.
     *              The api will tell us is we cannot go live, but prior to request
     *              we can do some ui level checks & direct the author to the
     *              correct step if a field is missing.
     */
    const publish = async () => {
        const check = checkRequired();
        if (check.ready) {
            store.setError(null);
            try {
                await saveCurrent();
                await api.put(`${Config.endpoints.publications}/${props.publication.id}/status/LIVE`, {}, props.token);
                router.push({
                    pathname: `${Config.urls.viewPublication.path}/${props.publication.id}`
                });
            } catch (err) {
                const { message } = err as Interfaces.JSONResponseError;
                store.setError(message);
            }
        } else {
            store.setError(check.message);
        }
        setPublishModalVisibility(false);
    };

    // Option selected from modal
    const save = async () => {
        try {
            await saveCurrent('Publication successfully saved');
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(message);
        }

        setSaveModalVisibility(false);
    };

    // Option selected from modal
    const deleteExit = async () => {
        try {
            await api.destroy(`${Config.endpoints.publications}/${props.publication.id}`, props.token);
            router.push({
                pathname: user ? `${Config.urls.viewUser.path}/${user?.id}` : Config.urls.browsePublications.path
            });
            setToast({
                visible: true,
                dismiss: true,
                title: 'Draft successfully removed',
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: null
            });
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(message);
        }

        setDeleteModalVisibility(false);
    };

    const checkRequired = (): { ready: boolean; message: string } => {
        let ready = { ready: true, message: '' };
        if (!store.title) ready = { ready: false, message: 'You must provide a title' };
        if (!store.content) ready = { ready: false, message: 'You must provide main text' };
        if (!store.licence) ready = { ready: false, message: 'You must select a licence' };
        if (!store.linkTo.length)
            ready = { ready: false, message: 'You must link this publication to at least one other' };
        if (store.conflictOfInterestStatus && !store.conflictOfInterestText.length) {
            ready = {
                ready: false,
                message: 'You have selected there is a conflict of interest, please provide a reason.'
            };
        }
        if (store.type === Config.values.octopusInformation.publications.DATA.id) {
            if (store.ethicalStatement === null)
                ready = { ready: false, message: 'You must select an ethical statement option' };
            if (store.dataPermissionsStatement === null)
                ready = { ready: false, message: 'You must select a data permissions option' };
        }
        if (!store.coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor)) {
            ready = { ready: false, message: 'All co-authors must be verified.' };
        }

        return ready;
    };

    // Monitor the stores state, and conditionally enable the publish button
    React.useEffect(() => {
        const check = checkRequired();
        setIsReadyToPreview(check.ready);
    }, [
        store.title,
        store.content,
        store.licence,
        store.conflictOfInterestStatus,
        store.conflictOfInterestText,
        store.linkTo,
        store.type,
        store.ethicalStatement,
        store.dataPermissionsStatement,
        store.coAuthors
    ]);

    // Reset the store when navigating away from the publication flow, this is why we have the save feature
    // If I save a publication then go to create a new, my old data is still in the store, we dont want this
    React.useEffect(() => {
        return () => store.reset();
    }, []);

    return (
        <>
            <Components.Modal
                open={saveModalVisibility}
                setOpen={setSaveModalVisibility}
                positiveActionCallback={save}
                positiveButtonText="Save"
                cancelButtonText="Cancel"
                title="Are you sure you want to save your changes?"
                icon={<OutlineIcons.SaveIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">
                    Changes to your publication will be saved and it will be stored as a draft.
                </p>
            </Components.Modal>
            <Components.Modal
                open={publishModalVisibility}
                setOpen={setPublishModalVisibility}
                positiveActionCallback={publish}
                positiveButtonText="Yes, save &amp; publish"
                cancelButtonText="Cancel"
                title="Are you sure you want to publish?"
                icon={<OutlineIcons.CloudUploadIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
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
                icon={<OutlineIcons.TrashIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">All content will be deleted and cannot be restored.</p>
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
                        <span className="block font-montserrat text-xs text-white-100">
                            Check out our{' '}
                            <Components.Link openNew={true} href="/faq" className="underline">
                                FAQs
                            </Components.Link>
                        </span>
                    </div>
                </aside>
                <section className="col-span-12 place-content-end border-t border-grey-100 p-8 transition-colors duration-500 dark:border-grey-400 lg:col-span-10 lg:py-12 lg:px-16 ">
                    <div className="mb-12 flex flex-col items-end lg:flex-row lg:justify-between">
                        <span className="block font-montserrat text-lg font-semibold text-teal-600 transition-colors duration-500 dark:text-teal-400">
                            {Helpers.formatPublicationType(store.type)}
                        </span>
                        <div className="flex space-x-8 ">
                            <NavigationButton
                                text="Previous"
                                disabled={props.currentStep <= 0}
                                onClick={() => props.setStep((prevState: number) => prevState - 1)}
                                icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                                iconPosition="LEFT"
                            />

                            <NavigationButton
                                text="Next"
                                disabled={props.currentStep >= props.steps.length - 1}
                                onClick={() => props.setStep((prevState: number) => prevState + 1)}
                                icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                iconPosition="RIGHT"
                            />

                            <NavigationButton
                                text="Preview"
                                onClick={async () => {
                                    try {
                                        await saveCurrent();
                                        router.push({
                                            pathname: `${Config.urls.viewPublication.path}/${props.publication.id}`
                                        });
                                    } catch (err) {
                                        const { message } = err as Interfaces.JSONResponseError;
                                        store.setError(message);
                                    }
                                }}
                                disabled={!isReadyToPreview}
                                icon={<OutlineIcons.EyeIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />

                            <NavigationButton
                                text="Publish"
                                onClick={() => setPublishModalVisibility(true)}
                                disabled={!isReadyToPreview}
                                className=""
                                icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />

                            <NavigationButton
                                text="Save"
                                onClick={() => setSaveModalVisibility(true)}
                                className=""
                                icon={<ReactIconsFA.FaRegSave className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />
                            <NavigationButton
                                text="Delete draft"
                                onClick={() => setDeleteModalVisibility(true)}
                                className=""
                                icon={<OutlineIcons.TrashIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />
                        </div>
                    </div>
                    {!!store.error && <Components.Alert severity="ERROR" title={store.error} className="mb-12 w-fit" />}
                    <div className="mb-12">{props.children}</div>
                    {/* bottom next and back nav buttons */}
                    <div className="flex justify-end space-x-8 ">
                        <NavigationButton
                            text="Previous"
                            disabled={props.currentStep <= 0}
                            onClick={() => {
                                props.setStep((prevState: number) => prevState - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                            iconPosition="LEFT"
                        />
                        {props.steps.length - 1 === props.currentStep ? (
                            <NavigationButton
                                text="Publish"
                                onClick={() => setPublishModalVisibility(true)}
                                disabled={!isReadyToPreview}
                                className=""
                                icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5 text-teal-600" />}
                                iconPosition="RIGHT"
                            />
                        ) : (
                            <NavigationButton
                                text="Next"
                                disabled={props.currentStep >= props.steps.length - 1}
                                onClick={() => {
                                    props.setStep((prevState: number) => prevState + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                iconPosition="RIGHT"
                            />
                        )}
                    </div>
                </section>
            </main>
            <Components.Footer waves={false} />
        </>
    );
};

export default BuildPublication;
