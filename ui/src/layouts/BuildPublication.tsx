import React, { useCallback, useMemo, useState } from 'react';
import * as Router from 'next/router';
import * as ReactIconsFA from 'react-icons/fa';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as api from '@api';
import * as Hooks from '@hooks';

import ClickAwayListener from 'react-click-away-listener';

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
    const updateCoAuthors = Stores.usePublicationCreationStore((state) => state.updateCoAuthors);
    const store = Stores.usePublicationCreationStore();
    const [memoizedStore] = useState(store);
    const setToast = Stores.useToastStore((state) => state.setToast);
    const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
    const [publishModalVisibility, setPublishModalVisibility] = React.useState(false);
    const [requestApprovalModalVisibility, setRequestApprovalModalVisibility] = React.useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const xl = Hooks.useMediaQuery('(min-width: 1280px)');
    const lg = Hooks.useMediaQuery('(min-width: 1024px)');

    // Reset the store when navigating away from the publication flow, this is why we have the save feature
    // If I save a publication then go to create a new, my old data is still in the store, we dont want this
    React.useEffect(() => {
        return () => {
            memoizedStore.reset();
        };
    }, [memoizedStore]);

    const checkRequired = useCallback(
        (store: Types.PublicationCreationStoreType): { ready: boolean; message: string } => {
            let ready = { ready: true, message: '' };
            if (!store.title) ready = { ready: false, message: 'You must provide a title' };
            if (!store.content) ready = { ready: false, message: 'You must provide main text' };
            if (!store.licence) ready = { ready: false, message: 'You must select a licence' };
            if (!store.linkTo?.length)
                ready = { ready: false, message: 'You must link this publication to at least one other' };

            if (store.conflictOfInterestStatus && !store.conflictOfInterestText.length) {
                ready = {
                    ready: false,
                    message: 'You have selected there is a conflict of interest, please provide a reason.'
                };
            }
            if (typeof store.conflictOfInterestStatus == 'undefined') {
                ready = { ready: false, message: 'You must select a conflict of interest option' };
            }
            if (store.type === Config.values.octopusInformation.publications.DATA.id) {
                if (store.ethicalStatement === null)
                    ready = { ready: false, message: 'You must select an ethical statement option' };
                if (store.dataPermissionsStatement === null)
                    ready = { ready: false, message: 'You must select a data permissions option' };
                if (
                    !store.dataPermissionsStatementProvidedBy &&
                    store.dataPermissionsStatement === Config.values.dataPermissionsOptions[0]
                )
                    ready = {
                        ready: false,
                        message: 'You must provide details of who gave permission for the data collection and sharing'
                    };
            }
            if (!store.coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor)) {
                ready = { ready: false, message: 'All co-authors must be verified.' };
            }
            return ready;
        },
        []
    );

    const checkRequiredApproval = useCallback(
        (store: Types.PublicationCreationStoreType): { ready: boolean; message: string } => {
            let ready = { ready: true, message: '' };
            if (!store.title) ready = { ready: false, message: 'You must provide a title' };
            if (!store.content) ready = { ready: false, message: 'You must provide main text' };
            if (!store.licence) ready = { ready: false, message: 'You must select a licence' };
            if (!store.linkTo?.length)
                ready = { ready: false, message: 'You must link this publication to at least one other' };

            if (store.conflictOfInterestStatus && !store.conflictOfInterestText.length) {
                ready = {
                    ready: false,
                    message: 'You have selected there is a conflict of interest, please provide a reason.'
                };
            }
            if (typeof store.conflictOfInterestStatus == 'undefined') {
                ready = { ready: false, message: 'You must select a conflict of interest option' };
            }
            if (store.type === Config.values.octopusInformation.publications.DATA.id) {
                if (store.ethicalStatement === null)
                    ready = { ready: false, message: 'You must select an ethical statement option' };
                if (store.dataPermissionsStatement === null)
                    ready = { ready: false, message: 'You must select a data permissions option' };
                if (
                    !store.dataPermissionsStatementProvidedBy &&
                    store.dataPermissionsStatement === Config.values.dataPermissionsOptions[0]
                )
                    ready = {
                        ready: false,
                        message: 'You must provide details of who gave permission for the data collection and sharing'
                    };
            }

            return ready;
        },
        []
    );

    const CheckCoAuthorsToApprove = useCallback(
        (store: Types.PublicationCreationStoreType): { ready: boolean; message: string } => {
            let ready = { ready: true, message: '' };
            if (!store.coAuthors.every((coAuthor) => coAuthor.approvalRequested)) {
                ready = { ready: false, message: 'CoAuthors pending approval request' };
            }
            return ready;
        },
        []
    );

    // Function called before action is taken, save, exit, preview, publish etc...
    const saveCurrent = useCallback(
        async (message?: string) => {
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
                body.dataAccessStatement = store.dataAccessStatement;
                if (store.dataPermissionsStatement?.length) {
                    body.dataPermissionsStatement = store.dataPermissionsStatement;
                    body.dataPermissionsStatementProvidedBy = store.dataPermissionsStatementProvidedBy;
                }
            }

            if (store.type === 'PROTOCOL' || store.type === 'HYPOTHESIS') {
                body.selfDeclaration = store.selfDeclaration;
            }

            await api.patch(`${Config.endpoints.publications}/${props.publication.id}`, body, props.token);

            // update references for this publication
            await api.put(
                `${Config.endpoints.publications}/${props.publication.id}/reference`,
                store.references,
                props.token
            );

            // update co-authors for this publications - should really be put
            await api.put(
                `${Config.endpoints.publications}/${props.publication.id}/coauthor`,
                store.coAuthors,
                props.token
            );

            if (message) {
                setToast({
                    visible: true,
                    dismiss: true,
                    title: message,
                    icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                    message: null
                });
            }
        },
        [props.publication?.id, props.token, setToast, store]
    );

    /**
     * @title Requesting to publish
     * @description When requesting to go live, we carry out a few checks.
     *              The api will tell us is we cannot go live, but prior to request
     *              we can do some ui level checks & direct the author to the
     *              correct step if a field is missing.
     */
    const publish = useCallback(async () => {
        const check = checkRequired(store);
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
    }, [checkRequired, props.publication.id, props.token, router, saveCurrent, store]);

    const requestApproval = useCallback(async () => {
        try {
            await saveCurrent();
            const response = await api.put(
                `${Config.endpoints.publications}/${props.publication.id}/coauthors/request-approval`,
                {},
                props.token
            );
            updateCoAuthors(response.data);
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(message);
        }

        setRequestApprovalModalVisibility(false);
    }, [saveCurrent, store]);

    // Option selected from modal
    const save = useCallback(async () => {
        try {
            await saveCurrent('Publication successfully saved');
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(message);
        }

        setSaveModalVisibility(false);
    }, [saveCurrent, store]);

    // Option selected from modal
    const deleteExit = useCallback(async () => {
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
    }, [props.publication.id, props.token, router, setToast, store, user]);

    const handlePreview = useCallback(async () => {
        try {
            await saveCurrent();
            router.push({
                pathname: `${Config.urls.viewPublication.path}/${props.publication.id}`
            });
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(message);
        }
    }, [props.publication?.id, router, saveCurrent, store]);

    const isReadyToPreview = useMemo(
        () => Boolean(store.title.trim()) && !Helpers.isEmptyContent(store.content),
        [store.content, store.title]
    );

    const isReadyToPublish = useMemo(
        () => isReadyToPreview && checkRequired(store).ready,
        [checkRequired, isReadyToPreview, store]
    );

    const isReadyRequestApproval = useMemo(
        () => isReadyToPreview && checkRequiredApproval(store).ready,
        [checkRequiredApproval, isReadyToPreview, store]
    );

    const coAuthorsToApprove = useMemo(() => CheckCoAuthorsToApprove(store).ready, [CheckCoAuthorsToApprove, store]);

    return (
        <>
            <Components.Modal
                open={saveModalVisibility}
                setOpen={setSaveModalVisibility}
                positiveActionCallback={save}
                positiveButtonText="Save"
                cancelButtonText="Cancel"
                title="Are you sure you want to save your changes?"
                icon={<ReactIconsFA.FaRegSave className="h-8 w-8 text-grey-600" aria-hidden="true" />}
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
                open={requestApprovalModalVisibility}
                setOpen={setRequestApprovalModalVisibility}
                positiveActionCallback={requestApproval}
                positiveButtonText="Finalise Draft and Send Request"
                cancelButtonText="Cancel"
                title="Are you sure you want to finalise your publication?"
                icon={<OutlineIcons.CloudUploadIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            ></Components.Modal>
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
            <div className="w-full border-t border-grey-100 dark:border-grey-400"></div>
            <main className="container flex min-h-screen px-8">
                {lg ? (
                    <aside
                        className={`flex w-full max-w-[30%] flex-col justify-between border-r border-transparent bg-teal-700 pt-10 transition-all duration-300 dark:border-grey-400 2xl:max-w-[25%]`}
                    >
                        <ul className="sticky top-0 min-h-[500px] space-y-2">
                            {props.steps.map((step, index) => (
                                <li key={step.title}>
                                    <button
                                        onClick={() => props.setStep(index)}
                                        className={`flex w-full items-center space-x-4 py-4 pl-8 pr-4 text-left font-montserrat font-medium text-white-100 underline decoration-transparent decoration-2 outline-0 ring-inset transition-colors duration-150 focus:ring-2 focus:ring-yellow-400 dark:text-grey-50 dark:hover:text-white-50 ${
                                            index === props.currentStep ? 'bg-teal-600 text-white-50' : ''
                                        }`}
                                    >
                                        {step.icon}
                                        <span className="-mb-1">{step.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="px-8 pb-8">
                            <span className="block font-montserrat text-sm text-white-100">Need help?</span>
                            <span className="block font-montserrat text-xs text-white-100">
                                Check out our{' '}
                                <Components.Link openNew={true} href="/faq" className="underline">
                                    FAQs
                                </Components.Link>
                            </span>
                        </div>
                    </aside>
                ) : (
                    <>
                        <ClickAwayListener onClickAway={() => setShowSideBar(false)}>
                            <aside
                                className={`${
                                    showSideBar ? 'translate-x-0' : '-translate-x-full'
                                } fixed inset-0 z-20 flex w-[80%] max-w-[20rem] flex-col justify-between border-r border-transparent bg-teal-700 py-10 transition-transform duration-300 dark:border-grey-400`}
                            >
                                <Components.IconButton
                                    title="Toggle side bar"
                                    className="absolute -right-8 top-[50vh] rounded-br rounded-tr border-t border-r border-b border-grey-400 bg-teal-700"
                                    icon={
                                        showSideBar ? (
                                            <OutlineIcons.ArrowLeftIcon className="h-6 w-6 text-white-50" />
                                        ) : (
                                            <OutlineIcons.ArrowRightIcon className="h-6 w-6 text-white-50" />
                                        )
                                    }
                                    onClick={() => setShowSideBar((prevState) => !prevState)}
                                />

                                <div className="flex h-full flex-col justify-between overflow-y-auto">
                                    <ul className="space-y-2">
                                        {props.steps.map((step, index) => (
                                            <li key={step.title}>
                                                <button
                                                    onClick={() => {
                                                        props.setStep(index);
                                                        setShowSideBar(false);
                                                    }}
                                                    className={`flex w-full items-center space-x-4 py-4 pl-8 pr-4 text-left font-montserrat font-medium text-white-100 underline decoration-transparent decoration-2 outline-0 ring-inset transition-colors duration-150 focus:ring-2 focus:ring-yellow-400 dark:text-grey-50 dark:hover:text-white-50 ${
                                                        index === props.currentStep ? 'bg-teal-600 text-white-50' : ''
                                                    }`}
                                                >
                                                    {step.icon}
                                                    <span className="-mb-1">{step.title}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="px-8 pt-10">
                                        <span className="block font-montserrat text-sm text-white-100">Need help?</span>
                                        <span className="block font-montserrat text-xs text-white-100">
                                            Check out our{' '}
                                            <Components.Link openNew={true} href="/faq" className="underline">
                                                FAQs
                                            </Components.Link>
                                        </span>
                                    </div>
                                </div>
                            </aside>
                        </ClickAwayListener>

                        <div
                            hidden={!showSideBar}
                            className="overlay fixed inset-0 z-10 bg-grey-800 opacity-75 transition-opacity dark:bg-grey-900"
                        ></div>
                    </>
                )}
                <section className="w-full border-grey-100 py-8 transition-colors duration-500 dark:border-grey-400 lg:max-w-[70%] lg:py-8 lg:pl-8 xl:py-12 xl:pl-16 2xl:max-w-[75%]">
                    <div className="mb-12 flex flex-wrap items-center justify-between gap-8">
                        <span className="block font-montserrat text-lg font-semibold text-teal-600 transition-colors duration-500 dark:text-teal-400">
                            {Helpers.formatPublicationType(store.type)}
                        </span>
                        <div className="flex items-center justify-end gap-8 xl:w-full xl:justify-between 2xl:w-auto 2xl:justify-end">
                            {xl ? (
                                <>
                                    <div className="flex gap-4">
                                        <Components.Button
                                            title={
                                                isReadyToPreview
                                                    ? 'Preview'
                                                    : 'Publication must contain a title and main text before previewing'
                                            }
                                            onClick={handlePreview}
                                            disabled={!isReadyToPreview}
                                            endIcon={<OutlineIcons.EyeIcon className="text-white-500 h-5 w-5" />}
                                            className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                        >
                                            Preview
                                        </Components.Button>
                                        {!coAuthorsToApprove ? (
                                            <Components.Button
                                                title="Request Approval"
                                                onClick={() => setRequestApprovalModalVisibility(true)}
                                                disabled={!isReadyRequestApproval}
                                                endIcon={
                                                    <OutlineIcons.CloudUploadIcon className="h-5 w-5 text-white-50" />
                                                }
                                                className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                            />
                                        ) : (
                                            <Components.Button
                                                title="Publish"
                                                onClick={() => setPublishModalVisibility(true)}
                                                disabled={!isReadyToPublish}
                                                endIcon={
                                                    <OutlineIcons.CloudUploadIcon className="h-5 w-5 text-white-50" />
                                                }
                                                className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                            />
                                        )}
                                        <Components.Button
                                            title="Save"
                                            onClick={() => setSaveModalVisibility(true)}
                                            className="rounded border-0 bg-green-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                            endIcon={<ReactIconsFA.FaRegSave className="h-5 w-5 text-white-50" />}
                                        />
                                        <Components.Button
                                            title="Delete draft"
                                            onClick={() => setDeleteModalVisibility(true)}
                                            className="children:border-0"
                                            endIcon={<OutlineIcons.TrashIcon className="h-5 w-5 text-teal-600" />}
                                        />
                                    </div>
                                    <div className="flex gap-8">
                                        <Components.Button
                                            className="children:border-0"
                                            disabled={props.currentStep <= 0}
                                            startIcon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                                            onClick={() => props.setStep((prevState: number) => prevState - 1)}
                                            title="Previous"
                                        />

                                        <Components.Button
                                            className="children:border-0"
                                            disabled={props.currentStep >= props.steps.length - 1}
                                            endIcon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                            onClick={() => props.setStep((prevState: number) => prevState + 1)}
                                            title="Next"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-4">
                                        <Components.IconButton
                                            icon={<OutlineIcons.EyeIcon className="h-5 w-5" />}
                                            disabled={!isReadyToPreview}
                                            title={
                                                isReadyToPreview
                                                    ? 'Preview'
                                                    : 'Publication must contain a title and main text before previewing'
                                            }
                                            onClick={handlePreview}
                                        />
                                        {!coAuthorsToApprove ? (
                                            <Components.IconButton
                                                title="Request Approval"
                                                icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5" />}
                                                disabled={!isReadyRequestApproval}
                                                onClick={() => setRequestApprovalModalVisibility(true)}
                                            />
                                        ) : (
                                            <Components.IconButton
                                                title="Publish"
                                                icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5" />}
                                                disabled={!isReadyToPublish}
                                                onClick={() => setPublishModalVisibility(true)}
                                            />
                                        )}
                                        <Components.IconButton
                                            title="Save"
                                            icon={<ReactIconsFA.FaRegSave className="h-5 w-5" />}
                                            onClick={() => setSaveModalVisibility(true)}
                                        />
                                        <Components.IconButton
                                            title="Delete draft"
                                            icon={<OutlineIcons.TrashIcon className="h-5 w-5" />}
                                            onClick={() => setDeleteModalVisibility(true)}
                                        />
                                    </div>
                                    <div className="flex gap-8">
                                        <Components.IconButton
                                            title="Previous"
                                            icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-500" />}
                                            disabled={props.currentStep <= 0}
                                            onClick={() => props.setStep((prevState: number) => prevState - 1)}
                                        />
                                        <Components.IconButton
                                            title="Next"
                                            icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-500" />}
                                            disabled={props.currentStep >= props.steps.length - 1}
                                            onClick={() => props.setStep((prevState: number) => prevState + 1)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {!!store.error && <Components.Alert severity="ERROR" title={store.error} className="mb-12 w-fit" />}
                    <div>
                        <p className="text-md mb-6 block font-semibold text-grey-700 transition-colors duration-500 dark:text-white-100">
                            Remember to save this draft before navigating away from the publication form.
                        </p>
                    </div>
                    <div className="mb-12">{props.children}</div>
                    {/* bottom next and back nav buttons */}
                    <div className="flex items-center justify-end space-x-8 ">
                        {xl ? (
                            <>
                                <Components.Button
                                    title="Save"
                                    onClick={() => setSaveModalVisibility(true)}
                                    className="rounded border-0 bg-green-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                    endIcon={<ReactIconsFA.FaRegSave className="h-5 w-5 text-white-50" />}
                                />
                                <Components.Button
                                    className="children:border-0"
                                    disabled={props.currentStep <= 0}
                                    startIcon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                                    onClick={() => props.setStep((prevState: number) => prevState - 1)}
                                    title="Previous"
                                />
                            </>
                        ) : (
                            <>
                                <Components.IconButton
                                    icon={<ReactIconsFA.FaRegSave className="h-5 w-5" />}
                                    title="Save"
                                    onClick={() => setSaveModalVisibility(true)}
                                />
                                <Components.IconButton
                                    disabled={props.currentStep <= 0}
                                    icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4" />}
                                    title="Previous"
                                    onClick={() => props.setStep((prevState: number) => prevState - 1)}
                                />
                            </>
                        )}

                        {props.steps.length - 1 === props.currentStep ? (
                            xl ? (
                                <>
                                    {console.log(store.coAuthors)}
                                    <Components.Button
                                        title={
                                            isReadyToPreview
                                                ? 'Preview'
                                                : 'Publication must contain a title and main text before previewing'
                                        }
                                        disabled={!isReadyToPreview}
                                        endIcon={<OutlineIcons.EyeIcon className="text-white-500 h-5 w-5" />}
                                        className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                        onClick={handlePreview}
                                    >
                                        Preview
                                    </Components.Button>
                                    {!coAuthorsToApprove ? (
                                        <Components.Button
                                            className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                            disabled={!isReadyRequestApproval}
                                            endIcon={<OutlineIcons.CloudUploadIcon className="h-5 w-5 text-white-50" />}
                                            title="Request Approval"
                                            onClick={() => setRequestApprovalModalVisibility(true)}
                                        />
                                    ) : (
                                        <Components.Button
                                            className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                                            disabled={!isReadyToPublish}
                                            endIcon={<OutlineIcons.CloudUploadIcon className="h-5 w-5 text-white-50" />}
                                            title="Publish"
                                            onClick={() => setPublishModalVisibility(true)}
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <Components.IconButton
                                        disabled={!isReadyToPreview}
                                        icon={<OutlineIcons.EyeIcon className="h-5 w-5" />}
                                        title={
                                            isReadyToPreview
                                                ? 'Preview'
                                                : 'Publication must contain a title and main text before previewing'
                                        }
                                        onClick={handlePreview}
                                    />

                                    {!coAuthorsToApprove ? (
                                        <Components.IconButton
                                            disabled={!isReadyRequestApproval}
                                            icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5" />}
                                            title="Request Approval"
                                            onClick={() => setRequestApprovalModalVisibility(true)}
                                        />
                                    ) : (
                                        <Components.IconButton
                                            disabled={!isReadyToPublish}
                                            icon={<OutlineIcons.CloudUploadIcon className="h-5 w-5" />}
                                            title="Publish"
                                            onClick={() => setPublishModalVisibility(true)}
                                        />
                                    )}
                                </>
                            )
                        ) : xl ? (
                            <Components.Button
                                className="children:border-0"
                                disabled={props.currentStep >= props.steps.length - 1}
                                endIcon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                title="Next"
                                onClick={() => {
                                    props.setStep((prevState: number) => prevState + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        ) : (
                            <Components.IconButton
                                disabled={props.currentStep >= props.steps.length - 1}
                                icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4" />}
                                title="Next"
                                onClick={() => {
                                    props.setStep((prevState: number) => prevState + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
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
