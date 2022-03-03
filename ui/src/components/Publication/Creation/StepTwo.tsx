import React from 'react';
import useSWR from 'swr';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

/**
 * @description Edit links
 */
const StepTwo: React.FC = (): JSX.Element => {
    const draftedPublication = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.draftedPublication
    );
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);
    const forPublicationsID = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.forPublicationsID
    );

    const [limit, setLimit] = React.useState(10);
    const [publicationLinkToList, setPublicationLinkToList] = React.useState<Interfaces.Publication[] | []>([]);
    const [fetchForError, setFetchForError] = React.useState<string | null>(null);
    const [confirmSaveLinks, setConfirmSaveLinks] = React.useState(false);
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
        // TODO We need to make sure to exclude publications already linked.
        const unquie = new Set([...publicationLinkToList, availablePublication]);
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

    const saveAndCommitLinks = () => {
        // save the links

        // Either save all & refresh otherwise other publication state is lost, or was save behind the scence and use toast to show update was successful or failed
        // the later would be better, but it's alot to do right now
        // hard refresh to current step to ensure current step represents live data
        window.location.href = `${Config.urls.viewPublication.path}/${draftedPublication.id}/edit?step=1`;
    };

    React.useEffect(() => {
        if (forPublicationsID) getAskedForPublication(forPublicationsID);
    }, [forPublicationsID]);

    return (
        <>
            <Components.Modal
                open={confirmSaveLinks}
                setOpen={setConfirmSaveLinks}
                positiveActionCallback={saveAndCommitLinks}
                positiveButtonText="Commit"
                cancelButtonText="Cancel"
                title="Are you sure you want to commit these links?"
                icon={<OutlineIcons.SaveIcon className="text-green-600 h-6 w-6" aria-hidden="true" />}
            >
                <p className="text-gray-500 text-sm">
                    Whilst this publication is in draft mode, you can later edit these links.
                </p>
            </Components.Modal>
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

            <div className="my-4 border-t border-grey-100 py-4 transition-colors duration-500 dark:border-grey-700 lg:my-10 lg:pt-6">
                <h2 className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                    Publications already linked to this one
                </h2>
                here
            </div>

            <div className="my-4 border-t border-grey-100 py-4 transition-colors duration-500 dark:border-grey-700 lg:my-10 lg:pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                        Add new links to this publication?
                    </h2>
                    <button
                        className="rounded bg-teal-500 px-3 py-1 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed"
                        onClick={() => setConfirmSaveLinks(true)}
                    >
                        Save &amp; create links
                    </button>
                </div>
                <div className="my-6 grid grid-cols-2 gap-4 ">
                    <div>
                        <h3>Choose from the below</h3>
                        <div className="scrollbar scrollbar-vert h-96 overflow-x-auto rounded border border-teal-500 p-4">
                            {!error &&
                                !isValidating &&
                                results.data?.length &&
                                results.data.map((availablePublication: Interfaces.Publication) => {
                                    if (availablePublication.id !== forPublicationsID) {
                                        return (
                                            <button
                                                className="mb-2 whitespace-nowrap bg-white text-left text-sm"
                                                onClick={() => manageAvailableToAdd(availablePublication)}
                                                key={availablePublication.id}
                                            >
                                                {availablePublication.title}
                                            </button>
                                        );
                                    }
                                })}
                        </div>
                    </div>
                    <div>
                        <h3>Selected for linking</h3>
                        <div className="scrollbar scrollbar-vert h-96 overflow-x-auto rounded border border-teal-500 p-4">
                            {publicationLinkToList.map((addedPublication) => (
                                <div key={addedPublication.id} className="grid grid-cols-12">
                                    <span className="col-span-11">{addedPublication.title}</span>
                                    <button
                                        className="col-span-1"
                                        onClick={() => removeFromLinkToList(addedPublication)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepTwo;
