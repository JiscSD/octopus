import React, { useCallback, useMemo, useState } from 'react';
import * as Router from 'next/router';
import * as ReactIconsFA from 'react-icons/fa';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Stores from '@/stores';
import * as Config from '@/config';
import * as api from '@/api';

import ClickAwayListener from 'react-click-away-listener';
import axios from 'axios';

const completenessIcons: { [key in Types.TabCompletionStatus]: React.ReactElement } = {
    COMPLETE: <OutlineIcons.CheckBadgeIcon className="h-6 w-6 text-teal-300 transition-colors duration-500" />,
    INCOMPLETE: (
        <OutlineIcons.ExclamationCircleIcon className="h-6 w-6 text-yellow-400 transition-colors duration-500" />
    )
};

type BuildPublicationProps = {
    steps: Interfaces.CreationStepWithCompletenessStatus[];
    currentStep: number;
    setStep: any; // Can be a page number or a callback of its own
    publicationVersion: Interfaces.PublicationVersion;
    token: string;
    children: React.ReactNode;
};

const BuildPublication: React.FC<BuildPublicationProps> = (props) => {
    const router = Router.useRouter();
    const user = Stores.useAuthStore((state) => state.user);
    const store = Stores.usePublicationCreationStore();
    const [memoizedStore] = useState(store);
    const setToast = Stores.useToastStore((state) => state.setToast);
    const [saveModalVisibility, setSaveModalVisibility] = React.useState(false);
    const [saveModalLoading, setSaveModalLoading] = React.useState(false);
    const [ariContactConsent, setAriContactConsent] = React.useState<undefined | boolean>(undefined);
    const [publishModalVisibility, setPublishModalVisibility] = React.useState(false);
    const [publishModalLoading, setPublishModalLoading] = React.useState(false);
    const [requestApprovalModalVisibility, setRequestApprovalModalVisibility] = React.useState(false);
    const [requestApprovalModalLoading, setRequestApprovalModalLoading] = React.useState(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState(false);
    const [deleteModalLoading, setDeleteModalLoading] = React.useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const [navigationAnnouncement, setNavigationAnnouncement] = useState('');

    // Reset the store when navigating away from the publication flow, this is why we have the save feature
    // If I save a publication then go to create a new, my old data is still in the store, we dont want this
    React.useEffect(() => {
        return () => {
            memoizedStore.resetPublicationVersion();
            memoizedStore.resetLinkedTo();
            memoizedStore.resetReferences();
        };
    }, [memoizedStore]);

    React.useEffect(() => {
        if (store.error) {
            Helpers.scrollTopSmooth();
        }
    }, [store.error]);

    const checkRequired = useCallback(
        (store: Types.PublicationCreationStoreType): { ready: boolean; message: string } => {
            const { publicationVersion, linkedTo } = store;

            let ready = { ready: true, message: '' };

            if (!publicationVersion.title) ready = { ready: false, message: 'You must provide a title' };
            if (!publicationVersion.content) ready = { ready: false, message: 'You must provide main text' };
            const hasLiveLinks =
                linkedTo.length && linkedTo.every((linkedPublication) => linkedPublication.currentStatus === 'LIVE');
            const hasLinkNotPendingDeletion = linkedTo.some((link) => link.pendingDeletion === false);
            if (
                (publicationVersion.publication.type === 'PROBLEM' &&
                    (!hasLiveLinks || !hasLinkNotPendingDeletion) &&
                    !publicationVersion.topics.length) ||
                (publicationVersion.publication.type !== 'PROBLEM' && !hasLiveLinks)
            )
                ready = { ready: false, message: 'You must link this publication to at least one other item' };

            if (publicationVersion.conflictOfInterestStatus && !publicationVersion.conflictOfInterestText?.length) {
                ready = {
                    ready: false,
                    message: 'You have selected there is a conflict of interest, please provide a reason.'
                };
            }
            if (publicationVersion.conflictOfInterestStatus === null) {
                ready = { ready: false, message: 'You must select a conflict of interest option' };
            }
            if (publicationVersion.publication.type === Config.values.octopusInformation.publicationTypes.DATA.id) {
                if (publicationVersion.ethicalStatement === null)
                    ready = { ready: false, message: 'You must select an ethical statement option' };
                if (publicationVersion.dataPermissionsStatement === null)
                    ready = { ready: false, message: 'You must select a data permissions option' };
                if (
                    !publicationVersion.dataPermissionsStatementProvidedBy &&
                    publicationVersion.dataPermissionsStatement === Config.values.dataPermissionsOptions[0]
                )
                    ready = {
                        ready: false,
                        message: 'You must provide details of who gave permission for the data collection and sharing'
                    };
            }

            if (!publicationVersion.coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor)) {
                ready = { ready: false, message: 'All co-authors must be verified.' };
            }

            const correspondingAuthor = publicationVersion.coAuthors.find(
                (author) => author.linkedUser === publicationVersion.createdBy
            );

            if (!(correspondingAuthor?.affiliations.length || correspondingAuthor?.isIndependent)) {
                ready = {
                    ready: false,
                    message: 'You must add your affiliations or confirm if you are an independent author.'
                };
            }

            return ready;
        },
        []
    );

    const checkRequiredApproval = useCallback(
        (store: Types.PublicationCreationStoreType): { ready: boolean; message: string } => {
            const { publicationVersion, linkedTo } = store;

            let ready = { ready: true, message: '' };

            if (!publicationVersion.title) ready = { ready: false, message: 'You must provide a title' };
            if (!publicationVersion.content) ready = { ready: false, message: 'You must provide main text' };
            if (!linkedTo.length && !publicationVersion.topics.length)
                ready = { ready: false, message: 'You must link this publication to at least one other item' };

            if (publicationVersion.conflictOfInterestStatus && !publicationVersion.conflictOfInterestText?.length) {
                ready = {
                    ready: false,
                    message: 'You have selected there is a conflict of interest, please provide a reason.'
                };
            }
            if (publicationVersion.conflictOfInterestStatus === null) {
                ready = { ready: false, message: 'You must select a conflict of interest option' };
            }
            if (publicationVersion.publication.type === Config.values.octopusInformation.publicationTypes.DATA.id) {
                if (publicationVersion.ethicalStatement === null)
                    ready = { ready: false, message: 'You must select an ethical statement option' };
                if (publicationVersion.dataPermissionsStatement === null)
                    ready = { ready: false, message: 'You must select a data permissions option' };
                if (
                    !publicationVersion.dataPermissionsStatementProvidedBy &&
                    publicationVersion.dataPermissionsStatement === Config.values.dataPermissionsOptions[0]
                )
                    ready = {
                        ready: false,
                        message: 'You must provide details of who gave permission for the data collection and sharing'
                    };
            }
            const correspondingAuthor = publicationVersion.coAuthors.find(
                (author) => author.linkedUser === publicationVersion.createdBy
            );

            if (!(correspondingAuthor?.affiliations.length || correspondingAuthor?.isIndependent)) {
                ready = {
                    ready: false,
                    message: 'You must add your affiliations or confirm if you are an independent author.'
                };
            }

            return ready;
        },
        []
    );

    // Function called before action is taken, save, exit, preview, publish etc...
    const saveCurrent = useCallback(
        async (message?: string) => {
            store.setError(null);
            const { publicationVersion, references } = store;

            const body: Interfaces.PublicationUpdateRequestBody = {
                title: publicationVersion.title,
                content: publicationVersion.content,
                description: publicationVersion.description,
                keywords: publicationVersion.keywords,
                language: publicationVersion.language,
                conflictOfInterestStatus: publicationVersion.conflictOfInterestStatus,
                conflictOfInterestText: publicationVersion.conflictOfInterestText,
                fundersStatement: publicationVersion.fundersStatement
            };

            if (publicationVersion.publication.type === 'PROBLEM') {
                body.topics = publicationVersion.topics.map((topic) => topic.id);
            }

            if (publicationVersion.publication.type === 'DATA') {
                body.ethicalStatement = publicationVersion.ethicalStatement;
                body.ethicalStatementFreeText =
                    publicationVersion.ethicalStatement !== null ? publicationVersion.ethicalStatementFreeText : null;
                body.dataAccessStatement = publicationVersion.dataAccessStatement;
                if (publicationVersion.dataPermissionsStatement?.length) {
                    body.dataPermissionsStatement = publicationVersion.dataPermissionsStatement;
                    body.dataPermissionsStatementProvidedBy = publicationVersion.dataPermissionsStatementProvidedBy;
                }
            }

            if (
                publicationVersion.publication.type === 'PROTOCOL' ||
                publicationVersion.publication.type === 'HYPOTHESIS'
            ) {
                body.selfDeclaration = publicationVersion.selfDeclaration;
            }

            const correspondingAuthor = publicationVersion.coAuthors.find(
                (author) => author.linkedUser === publicationVersion.createdBy
            );

            const promises = [
                // update current publication version
                api.patch(`${Config.endpoints.publicationVersions}/${props.publicationVersion.id}`, body, props.token),
                // update references for this version
                api.put(
                    `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/references`,
                    references,
                    props.token
                ),
                // update co-authors for this version
                api.put(
                    `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors`,
                    publicationVersion.coAuthors,
                    props.token
                ),
                // update author affiliations on this version
                api.patch(
                    `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors/${correspondingAuthor?.id}`,
                    {
                        affiliations: correspondingAuthor?.affiliations || [],
                        isIndependent: correspondingAuthor?.isIndependent || false
                    },
                    props.token
                )
            ];

            await Promise.all(promises).catch((error) =>
                store.setError(
                    axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : message
                )
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
        [props.publicationVersion.id, props.token, setToast, store]
    );

    /**
     * @title Requesting to publish
     * @description When requesting to go live, we carry out a few checks.
     *              The api will tell us if we cannot go live, but prior to request
     *              we can do some ui level checks & direct the author to the
     *              correct step if a field is missing.
     */
    const publish = useCallback(async () => {
        setPublishModalLoading(true);
        const check = checkRequired(store);
        if (check.ready) {
            store.setError(null);
            try {
                await saveCurrent();
                await api.put(
                    `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/status/LIVE${ariContactConsent ? '?ariContactConsent=true' : ''}`,
                    {},
                    props.token
                );
                await router.push({
                    pathname: `${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`
                });
            } catch (err) {
                const { message } = err as Interfaces.JSONResponseError;
                store.setError(
                    axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                        ? err.response.data.message
                        : message
                );
            }
        } else {
            store.setError(check.message);
        }
        setPublishModalVisibility(false);
        setPublishModalLoading(false);
    }, [
        checkRequired,
        props.publicationVersion.id,
        props.publicationVersion.versionOf,
        props.token,
        router,
        saveCurrent,
        store,
        ariContactConsent
    ]);

    const onClosePublishModal = () => {
        setPublishModalVisibility(false);
    };

    const requestApproval = useCallback(async () => {
        setRequestApprovalModalLoading(true);
        try {
            // save publication
            await saveCurrent();

            // request co-authors approvals
            await api.put(
                `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/coauthors/request-approval`,
                {},
                props.token
            );

            // update publication status to LOCKED
            await api.put(
                `${Config.endpoints.publicationVersions}/${props.publicationVersion.id}/status/LOCKED`,
                {},
                props.token
            );

            // redirect to publication page
            await router.push(`${Config.urls.viewPublication.path}/${props.publicationVersion.publication.id}`);
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(
                axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : message
            );
        }
        setRequestApprovalModalVisibility(false);
        setRequestApprovalModalLoading(false);
    }, [props.publicationVersion.id, props.publicationVersion.publication.id, props.token, router, saveCurrent, store]);

    const onCloseRequestApprovalModal = () => {
        setRequestApprovalModalVisibility(false);
    };

    // Option selected from modal
    const save = useCallback(async () => {
        setSaveModalLoading(true);
        try {
            await saveCurrent('Publication successfully saved');
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(
                axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : message
            );
        }

        setSaveModalVisibility(false);
        setSaveModalLoading(false);
    }, [saveCurrent, store]);

    const onCloseSaveModal = () => {
        setSaveModalVisibility(false);
    };

    // Option selected from modal
    const deleteVersion = useCallback(async () => {
        setDeleteModalLoading(true);
        try {
            await api.destroy(`${Config.endpoints.publicationVersions}/${props.publicationVersion.id}`, props.token);
            await router.push({
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
            store.setError(
                axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : message
            );
        }

        setDeleteModalVisibility(false);
        setDeleteModalLoading(false);
    }, [props.publicationVersion.id, props.token, router, setToast, store, user]);

    const onCloseDeleteModal = () => {
        setDeleteModalVisibility(false);
    };

    const handlePreview = useCallback(async () => {
        try {
            await saveCurrent();
            await router.push({
                pathname: `${Config.urls.viewPublication.path}/${props.publicationVersion.publication.id}`
            });
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            store.setError(
                axios.isAxiosError(err) && typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : message
            );
        }
    }, [props.publicationVersion.publication.id, router, saveCurrent, store]);

    const isReadyToPreview = useMemo(
        () =>
            Boolean(
                store.publicationVersion &&
                    store.publicationVersion.title.trim() &&
                    store.publicationVersion.content &&
                    !Helpers.isEmptyContent(store.publicationVersion.content)
            ),
        [store.publicationVersion]
    );

    const isReadyToPublish = useMemo(
        () => isReadyToPreview && checkRequired(store).ready,
        [checkRequired, isReadyToPreview, store]
    );

    const isReadyToRequestApproval = useMemo(
        () => isReadyToPreview && checkRequiredApproval(store).ready,
        [checkRequiredApproval, isReadyToPreview, store]
    );

    const hasUnconfirmedCoAuthors = !store.publicationVersion?.coAuthors.every(
        (coAuthor) => coAuthor.confirmedCoAuthor
    );

    // Collate all alerts that might be shown.
    const generateAlertComponents = (): React.ReactElement[] | null => {
        let alerts: React.ReactElement[] = [];
        if (
            props.publicationVersion.publication.type === 'PEER_REVIEW' &&
            store.linkedTo.length === 1 &&
            store.linkedTo[0].parentVersionIsLatestLive === false
        ) {
            alerts.push(
                <Components.Alert
                    severity="INFO"
                    className="mb-12"
                    allowDismiss={true}
                    title="A new version of the publication you are reviewing has been released since you started writing this peer review."
                    details={['Your review will be recorded against the latest version.']}
                ></Components.Alert>
            );
        }
        if (!!store.error) {
            alerts.push(<Components.Alert severity="ERROR" title={store.error} className="mb-12 w-fit" />);
        }
        return alerts;
    };
    const alerts = generateAlertComponents();

    // When the user hits the prev/next buttons.
    const sectionNavigate = (forward: boolean): void => {
        const newStep = props.currentStep + (forward ? 1 : -1);
        props.setStep(newStep);
        Helpers.scrollTopSmooth();
        setNavigationAnnouncement(`Navigated to ${props.steps[newStep].title} section and scrolled to top of section.`);
    };

    const topPrevButtonXlId = 'top-previous-button-xl-displays';
    const topNextButtonXlId = 'top-next-button-xl-displays';
    const topPrevButtonSmallId = 'top-previous-button-small-displays';
    const topNextButtonSmallId = 'top-next-button-small-displays';

    const linkedToARI = store.linkedTo.some((linkedTo) => linkedTo.externalSource === 'ARI' && linkedTo.draft);
    const linksPendingDeletion = store.linkedTo.filter((link) => link.pendingDeletion);

    return (
        <>
            <Components.Modal
                open={saveModalVisibility}
                onClose={onCloseSaveModal}
                loading={saveModalLoading}
                positiveCallback={save}
                positiveButtonText="Save"
                cancelButtonText="Cancel"
                title="Are you sure you want to save your changes?"
                icon={<ReactIconsFA.FaRegSave className="h-8 w-8 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-sm text-grey-700">
                    Changes to your publication will be saved and it will be stored as a draft.
                </p>
            </Components.Modal>
            <Components.Modal
                open={publishModalVisibility}
                onClose={onClosePublishModal}
                loading={publishModalLoading}
                positiveCallback={publish}
                positiveButtonText="Yes, save &amp; publish"
                positiveButtonDisabled={linkedToARI && ariContactConsent === undefined}
                cancelButtonText="Cancel"
                title="Are you sure you want to publish?"
                icon={<OutlineIcons.CloudArrowUpIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-sm text-grey-700">It is not possible to make any changes post-publication.</p>
                {!!linksPendingDeletion.length && (
                    <Components.LinksPendingDeletionMessage
                        publicationTitles={linksPendingDeletion.flatMap((link) => (link.title ? [link.title] : []))}
                    />
                )}
                {linkedToARI && (
                    <>
                        <p className="text-sm text-grey-700 my-4">
                            Your publication is linked to a UK government department&apos;s Area of Research Interest
                            (ARI). If you would like your contact details to be shared with the relevant government
                            department so that they can get in touch with you about your work, please check the box
                            below.
                        </p>
                        <fieldset className="flex justify-center gap-4">
                            <legend className="text-sm text-grey-700 mb-4">
                                I agree to having my email, name and the details of this publication shared with the
                                government department(s) that published this ARI. <Components.RequiredIndicator />
                            </legend>
                            <label
                                htmlFor="ari-contact-consent-yes"
                                className="flex items-center space-x-2 hover:cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="ARI contact consent"
                                    id="ari-contact-consent-yes"
                                    checked={ariContactConsent === true}
                                    onChange={() => {
                                        console.log('Yes');
                                        setAriContactConsent(true);
                                    }}
                                    className="hover:cursor-pointer"
                                    required={true}
                                />
                                <span className="ml-2 text-sm text-grey-700">Yes</span>
                            </label>
                            <label
                                htmlFor="ari-contact-consent-no"
                                className="flex items-center space-x-2 hover:cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="ARI contact consent"
                                    id="ari-contact-consent-no"
                                    checked={ariContactConsent === false}
                                    onChange={() => {
                                        console.log('No');
                                        setAriContactConsent(false);
                                    }}
                                    className="hover:cursor-pointer"
                                    required={true}
                                />
                                <span className="ml-2 text-sm text-grey-700">No</span>
                            </label>
                        </fieldset>
                    </>
                )}
            </Components.Modal>
            <Components.Modal
                open={requestApprovalModalVisibility}
                onClose={onCloseRequestApprovalModal}
                loading={requestApprovalModalLoading}
                positiveCallback={requestApproval}
                positiveButtonText="Finalise Draft and Send Request"
                cancelButtonText="Cancel"
                title="Are you sure you want to finalise your publication?"
                icon={<OutlineIcons.CloudArrowUpIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">
                    This action will lock your publication and notify other authors that they must approve it in its
                    current state before publishing.
                </p>
            </Components.Modal>
            <Components.Modal
                open={deleteModalVisibility}
                onClose={onCloseDeleteModal}
                loading={deleteModalLoading}
                positiveCallback={deleteVersion}
                positiveButtonText="Yes, delete this draft"
                cancelButtonText="Cancel"
                title="Are you sure you want to delete this publication?"
                icon={<OutlineIcons.TrashIcon className="h-10 w-10 text-grey-600" aria-hidden="true" />}
            >
                <p className="text-sm text-grey-700">All content will be deleted and cannot be restored.</p>
            </Components.Modal>
            <Components.Header fixed={false} hasBorder={false} />
            <div className="w-full border-t border-grey-100 dark:border-grey-400"></div>
            <main className="container flex min-h-screen px-8">
                <aside
                    className={`hidden w-full max-w-[30%] flex-col justify-between border-r border-transparent bg-teal-700 pt-10 transition-all duration-300 dark:border-grey-400 lg:flex 2xl:max-w-[25%]`}
                >
                    <ul className="sticky top-0 min-h-[600px] space-y-2">
                        {props.steps.map((step, index) => (
                            <li key={step.title}>
                                <button
                                    onClick={() => props.setStep(index)}
                                    className={`flex w-full items-center space-x-4 py-4 pl-8 pr-4 text-left font-montserrat font-medium text-white-100 underline decoration-transparent decoration-2 outline-0 ring-inset transition-colors duration-150 focus:ring-2 focus:ring-yellow-400 dark:text-grey-50 dark:hover:text-white-50 ${
                                        index === props.currentStep ? 'bg-teal-600 text-white-50' : ''
                                    }`}
                                >
                                    {step.icon}
                                    <span className="-mb-1 grow">{step.title}</span>
                                    {completenessIcons[step.status]}
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

                <div className="lg:hidden">
                    <ClickAwayListener onClickAway={() => setShowSideBar(false)}>
                        <aside
                            className={`${
                                showSideBar ? 'translate-x-0' : '-translate-x-full'
                            } fixed inset-0 z-20 flex w-[80%] max-w-[20rem] flex-col justify-between border-r border-transparent bg-teal-700 py-10 transition-transform duration-300 dark:border-grey-400`}
                        >
                            <Components.IconButton
                                title="Toggle side bar"
                                className="absolute -right-8 top-[50vh] rounded-br rounded-tr border-b border-r border-t border-grey-400 bg-teal-700"
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
                                                <span className="-mb-1 grow">{step.title}</span>
                                                {completenessIcons[step.status]}
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
                </div>

                <section className="w-full border-grey-100 py-8 transition-colors duration-500 dark:border-grey-400 lg:max-w-[70%] lg:py-8 lg:pl-8 xl:py-12 xl:pl-16 2xl:max-w-[75%]">
                    <div className="mb-12 flex flex-wrap items-center justify-between gap-8">
                        <span className="block font-montserrat text-lg font-semibold text-teal-600 transition-colors duration-500 dark:text-teal-400">
                            {store.publicationVersion &&
                                Helpers.formatPublicationType(store.publicationVersion.publication.type)}
                        </span>
                        <div aria-live="polite" className="sr-only">
                            {navigationAnnouncement}
                        </div>
                        <div className="hidden items-center justify-end gap-8 xl:flex xl:w-full xl:justify-between 2xl:w-auto 2xl:justify-end">
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
                                    variant="block"
                                >
                                    Preview
                                </Components.Button>
                                {hasUnconfirmedCoAuthors ? (
                                    <Components.Button
                                        title="Request Approval"
                                        onClick={() => setRequestApprovalModalVisibility(true)}
                                        disabled={!isReadyToRequestApproval}
                                        endIcon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5 text-white-50" />}
                                        variant="block"
                                    />
                                ) : (
                                    <Components.Button
                                        title="Publish"
                                        onClick={() => setPublishModalVisibility(true)}
                                        disabled={!isReadyToPublish}
                                        endIcon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5 text-white-50" />}
                                        variant="block"
                                    />
                                )}
                                <Components.Button
                                    title="Save"
                                    onClick={() => setSaveModalVisibility(true)}
                                    variant="block-alt"
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
                                    onClick={() => sectionNavigate(false)}
                                    title="Previous"
                                    id={topPrevButtonXlId}
                                />

                                <Components.Button
                                    className="children:border-0"
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    endIcon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                    onClick={() => sectionNavigate(true)}
                                    title="Next"
                                    id={topNextButtonXlId}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-8 xl:hidden xl:w-full xl:justify-between 2xl:w-auto 2xl:justify-end">
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
                                {hasUnconfirmedCoAuthors ? (
                                    <Components.IconButton
                                        title="Request Approval"
                                        icon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5" />}
                                        disabled={!isReadyToRequestApproval}
                                        onClick={() => setRequestApprovalModalVisibility(true)}
                                    />
                                ) : (
                                    <Components.IconButton
                                        title="Publish"
                                        icon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5" />}
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
                                    onClick={() => sectionNavigate(false)}
                                    id={topPrevButtonSmallId}
                                />
                                <Components.IconButton
                                    title="Next"
                                    icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-500" />}
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    onClick={() => sectionNavigate(true)}
                                    id={topNextButtonSmallId}
                                />
                            </div>
                        </div>
                    </div>
                    {alerts}
                    <div>
                        <p className="text-md mb-6 block font-semibold text-grey-700 transition-colors duration-500 dark:text-white-100">
                            Remember to save this draft before navigating away from the publication form.
                        </p>
                    </div>
                    <div className="mb-12">{props.children}</div>
                    {/* bottom next and back nav buttons */}
                    <div className="flex items-center justify-end space-x-8 ">
                        <div className="hidden items-center justify-end space-x-8 xl:flex">
                            <Components.Button
                                title="Save"
                                onClick={() => setSaveModalVisibility(true)}
                                variant="block-alt"
                                endIcon={<ReactIconsFA.FaRegSave className="h-5 w-5 text-white-50" />}
                            />
                            <Components.Button
                                className="children:border-0"
                                disabled={props.currentStep <= 0}
                                startIcon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4 text-teal-600" />}
                                onClick={() => {
                                    sectionNavigate(false);
                                    document.getElementById(topPrevButtonXlId)?.focus();
                                }}
                                title="Previous"
                            />
                            {props.steps.length - 1 === props.currentStep && (
                                <>
                                    <Components.Button
                                        title={
                                            isReadyToPreview
                                                ? 'Preview'
                                                : 'Publication must contain a title and main text before previewing'
                                        }
                                        disabled={!isReadyToPreview}
                                        endIcon={<OutlineIcons.EyeIcon className="text-white-500 h-5 w-5" />}
                                        variant="block"
                                        onClick={handlePreview}
                                    >
                                        Preview
                                    </Components.Button>
                                    {hasUnconfirmedCoAuthors ? (
                                        <Components.Button
                                            variant="block"
                                            disabled={!isReadyToRequestApproval}
                                            endIcon={
                                                <OutlineIcons.CloudArrowUpIcon className="h-5 w-5 text-white-50" />
                                            }
                                            title="Request Approval"
                                            onClick={() => setRequestApprovalModalVisibility(true)}
                                        />
                                    ) : (
                                        <Components.Button
                                            variant="block"
                                            disabled={!isReadyToPublish}
                                            endIcon={
                                                <OutlineIcons.CloudArrowUpIcon className="h-5 w-5 text-white-50" />
                                            }
                                            title="Publish"
                                            onClick={() => setPublishModalVisibility(true)}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-8 xl:hidden">
                            <Components.IconButton
                                icon={<ReactIconsFA.FaRegSave className="h-5 w-5" />}
                                title="Save"
                                onClick={() => setSaveModalVisibility(true)}
                            />
                            <Components.IconButton
                                disabled={props.currentStep <= 0}
                                icon={<OutlineIcons.ArrowLeftIcon className="h-4 w-4" />}
                                title="Previous"
                                onClick={() => {
                                    sectionNavigate(false);
                                    document.getElementById(topPrevButtonSmallId)?.focus();
                                }}
                            />
                            {props.steps.length - 1 === props.currentStep && (
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

                                    {hasUnconfirmedCoAuthors ? (
                                        <Components.IconButton
                                            disabled={!isReadyToRequestApproval}
                                            icon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5" />}
                                            title="Request Approval"
                                            onClick={() => setRequestApprovalModalVisibility(true)}
                                        />
                                    ) : (
                                        <Components.IconButton
                                            disabled={!isReadyToPublish}
                                            icon={<OutlineIcons.CloudArrowUpIcon className="h-5 w-5" />}
                                            title="Publish"
                                            onClick={() => setPublishModalVisibility(true)}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {props.currentStep < props.steps.length - 1 && (
                            <>
                                <Components.Button
                                    className="hidden children:border-0 xl:flex"
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    endIcon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
                                    title="Next"
                                    onClick={() => {
                                        sectionNavigate(true);
                                        document.getElementById(topNextButtonXlId)?.focus();
                                    }}
                                />

                                <Components.IconButton
                                    className="xl:hidden"
                                    disabled={props.currentStep >= props.steps.length - 1}
                                    icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4" />}
                                    title="Next"
                                    onClick={() => {
                                        sectionNavigate(true);
                                        document.getElementById(topNextButtonSmallId)?.focus();
                                    }}
                                />
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Components.Footer waves={false} />
        </>
    );
};

export default BuildPublication;
