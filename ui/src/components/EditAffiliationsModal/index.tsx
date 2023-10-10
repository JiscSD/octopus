import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as HeadlessUI from '@headlessui/react';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as api from '@api';

type Props = {
    open: boolean;
    author: Interfaces.CoAuthor;
    autoUpdate: boolean;
    onClose: (revalidate?: boolean) => void;
};

const EditAffiliationsModal: React.FC<Props> = (props) => {
    const cancelButtonRef = React.useRef(null);
    const [confirmAffiliationsError, setConfirmAffiliationsError] = React.useState('');
    const [authorAffiliations, setAuthorAffiliations] = useState<Interfaces.MappedOrcidAffiliation[]>(
        props.author?.affiliations || []
    );
    const [isIndependentAuthor, setIsIndependentAuthor] = useState(props.author?.isIndependent || false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        data: orcidAffiliations = [],
        isValidating,
        error
    } = useSWR<Interfaces.MappedOrcidAffiliation[]>('/orcid-affiliations');

    useSWR(
        !props.autoUpdate || isValidating || error
            ? null
            : `${Config.endpoints.publications}/${props.author.publicationId}/my-affiliations`,
        (url) => {
            const updatedAuthorAffiliations = orcidAffiliations.filter((affiliation) =>
                authorAffiliations.some(({ id }) => affiliation.id === id)
            );

            try {
                if (JSON.stringify(authorAffiliations) === JSON.stringify(updatedAuthorAffiliations)) {
                    // there's no need for update
                    return;
                }
            } catch (error) {
                console.log(error);
            }

            setAuthorAffiliations(updatedAuthorAffiliations);

            // also update author affiliations in DB
            api.put(
                url,
                {
                    affiliations: updatedAuthorAffiliations.filter(
                        (affiliation) => props.author.affiliations.find(({ id }) => affiliation.id === id) // only update affiliations which are already saved into DB
                    ),
                    isIndependent: isIndependentAuthor
                },
                Helpers.getJWT()
            ).catch((err) => {
                console.log(err);
            });
        }
    );

    const handleConfirmAffiliations = React.useCallback(async () => {
        setIsUpdating(true);
        setConfirmAffiliationsError('');

        try {
            // update author affiliations
            await api.put(
                `${Config.endpoints.publications}/${props.author.publicationId}/my-affiliations`,
                { affiliations: authorAffiliations, isIndependent: isIndependentAuthor },
                Helpers.getJWT()
            );

            props.onClose(true);
        } catch (error) {
            setConfirmAffiliationsError(
                axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : (error as Error).message
            );
        }

        setIsUpdating(false);
    }, [authorAffiliations, isIndependentAuthor, props]);

    const handleCancelChanges = React.useCallback(() => {
        props.onClose();
        // wait for modal transition and reset selection
        setTimeout(() => {
            setAuthorAffiliations(
                props.author.affiliations.map((affiliation) => {
                    // reset with the updated version from ORCID to prevent out of sync states
                    const updatedAffiliation = orcidAffiliations.find(({ id }) => affiliation.id === id);

                    return updatedAffiliation ? updatedAffiliation : affiliation;
                })
            );
            setIsIndependentAuthor(props.author.isIndependent);
        }, 200);
    }, [orcidAffiliations, props]);

    return (
        <HeadlessUI.Transition.Root show={props.open} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={handleCancelChanges}
                initialFocus={cancelButtonRef}
            >
                <div className="flex min-h-full items-center justify-center text-center">
                    <HeadlessUI.Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <HeadlessUI.Dialog.Overlay className="fixed inset-0 bg-grey-800 bg-opacity-75 transition-opacity dark:bg-grey-900" />
                    </HeadlessUI.Transition.Child>

                    <HeadlessUI.Transition.Child
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative mx-8 my-20 inline-block w-11/12 transform overflow-hidden rounded-lg bg-white-50 pb-4 text-left align-bottom shadow-xl transition-all sm:align-middle xl:max-w-5xl">
                            <Components.ModalBarLoader loading={isUpdating} />
                            <div className="px-4 pt-5 sm:px-8 sm:py-6">
                                <HeadlessUI.Dialog.Title
                                    as="h3"
                                    className="pb-8 text-center font-montserrat text-lg font-medium leading-6 text-grey-900"
                                >
                                    Choose your affiliation(s) for this publication
                                </HeadlessUI.Dialog.Title>

                                <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                    The following affiliations are present on{' '}
                                    <Components.Link
                                        href={`https://orcid.org/my-orcid?orcid=${props.author?.user?.orcid}`}
                                        openNew
                                        className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                    >
                                        your ORCID® profile
                                    </Components.Link>
                                    . To add a new affiliation, please enter it on{' '}
                                    <Components.Link
                                        href={`https://orcid.org/my-orcid?orcid=${props.author?.user?.orcid}`}
                                        openNew
                                        className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                    >
                                        your ORCID profile
                                    </Components.Link>
                                    .
                                </p>

                                <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                    <Components.Link
                                        href="https://support.orcid.org/hc/en-us/sections/360002054993-Assert-your-affiliations"
                                        openNew
                                        className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                    >
                                        Click here
                                    </Components.Link>{' '}
                                    to learn more about adding affiliations to ORCID.
                                </p>

                                <div className="pt-8">
                                    <Components.AuthorAffiliations
                                        scrollHeight={400}
                                        loading={!orcidAffiliations.length && isValidating}
                                        availableAffiliations={orcidAffiliations}
                                        selectedAffiliations={authorAffiliations}
                                        isIndependentAuthor={isIndependentAuthor}
                                        onIndependentAuthorChange={setIsIndependentAuthor}
                                        onSelectionChange={setAuthorAffiliations}
                                    />
                                </div>

                                {confirmAffiliationsError && (
                                    <Components.Alert
                                        severity="ERROR"
                                        title={confirmAffiliationsError}
                                        className="mt-4"
                                    />
                                )}

                                <div className="mt-8 flex gap-4 lg:justify-end">
                                    <Components.ModalButton
                                        disabled={isUpdating || (!authorAffiliations.length && !isIndependentAuthor)}
                                        className="mt-0 lg:w-fit"
                                        onClick={handleConfirmAffiliations}
                                        text={'Confirm Affiliations'}
                                        title={'Confirm Affiliations'}
                                        actionType="POSITIVE"
                                    />
                                    <Components.ModalButton
                                        ref={cancelButtonRef}
                                        className="mt-0 lg:w-fit"
                                        onClick={handleCancelChanges}
                                        text={'Cancel Changes'}
                                        title={'Cancel Changes'}
                                        actionType="NEGATIVE"
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>
                        </div>
                    </HeadlessUI.Transition.Child>
                </div>
            </HeadlessUI.Dialog>
        </HeadlessUI.Transition.Root>
    );
};

export default React.memo(EditAffiliationsModal);
