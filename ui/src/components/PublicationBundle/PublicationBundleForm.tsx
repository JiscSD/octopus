import React from 'react';
import * as Framer from 'framer-motion';
import type { AxiosResponse } from 'axios';
import * as OutlineIcons from '@heroicons/react/24/outline';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    Modifier,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Contexts from '@/contexts';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    bundle?: Interfaces.ClientPublicationBundle | null;
    isSaving?: boolean;
    editable?: boolean;
    onSave: (bundle: Omit<Interfaces.ClientPublicationBundle, 'id'>) => void;
};

const PublicationBundleForm = (props: Props): JSX.Element => {
    const { bundle, isSaving: isLoading, onSave, editable } = props;
    const { setError } = Stores.usePublicationCreationStore((state) => ({ setError: state.setError }));

    // https://github.com/clauderic/dnd-kit/issues/926
    const dndContextId = React.useId();

    const confirmation = Contexts.useConfirmationModal();

    const [bundleName, setBundleName] = React.useState<string>(bundle?.name || '');
    const [deletionUpdate, setDeletionUpdate] = React.useState('');
    const [deleting, setDeleting] = React.useState(false);
    const [entries, setEntries] = React.useState<Interfaces.ClientPublicationBundle['entries']>(bundle?.entries || []);

    const addEntry = async (publicationId: string) => {
        const getPublication: AxiosResponse<Interfaces.Publication> = await api.get(
            `${Config.endpoints.publications}/${publicationId}`
        );
        const publication = getPublication.data;
        const latestLiveVersion = publication.versions.find((version) => version.isLatestLiveVersion);
        if (latestLiveVersion) {
            setEntries((prev) => [
                ...prev,
                {
                    id: Math.random().toString(36).substring(2, 15),
                    position: prev.length,
                    publicationId: publication.id,
                    publication: {
                        authorFirstName: latestLiveVersion.user.firstName,
                        authorLastName: latestLiveVersion.user.lastName,
                        id: publication.id,
                        publishedDate: latestLiveVersion.publishedDate || '',
                        title: latestLiveVersion.title,
                        type: publication.type
                    }
                }
            ]);
        }
    };

    const deleteEntry = async (entryId: string) => {
        const targetEntry = entries.find((entry) => entry.id === entryId);
        const confirmed = await confirmation(
            'Remove publication from bundle',
            <p>
                Are you sure you want to remove the publication{' '}
                <span className="font-semibold">{targetEntry?.publication.title}</span> from the bundle?
            </p>,
            <OutlineIcons.TrashIcon className="h-8 w-8 text-grey-600" aria-hidden="true" />,
            'Confirm'
        );
        if (confirmed) {
            setDeleting(true);
            setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
            setDeleting(false);
            setDeletionUpdate(`Publication ${entryId} has been removed from the bundle.`);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = entries.findIndex((entry) => entry.id === active.id);
            const newIndex = entries.findIndex((entry) => entry.id === over?.id);
            const orderedEntries = arrayMove(entries, oldIndex, newIndex).map((entry, index) => ({
                ...entry,
                position: index
            }));
            setEntries(orderedEntries);
        }
    };

    const disablePageScrollModifier: Modifier = (context) => {
        if (!context.activatorEvent || context.activatorEvent.type !== 'keydown') {
            return context.transform;
        }

        if (typeof window === 'undefined' || !window.document.documentElement) {
            return context.transform;
        }

        const docIndex = context.scrollableAncestors.indexOf(window.document.documentElement);
        if (docIndex === -1) {
            return context.transform;
        }

        if (context.scrollableAncestors.at(-1) === window.document.documentElement) {
            context.scrollableAncestors.pop();
        }

        return context.transform;
    };

    const thClasses =
        'whitespace-pre py-3.5 px-3 sm:px-6 text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50';

    const numberOfEntriesLowerLimit = entries.length < 2;
    const numberOfEntriesUpperLimit = entries.length >= 30;
    const invalidNumberOfEntries = numberOfEntriesLowerLimit || numberOfEntriesUpperLimit;

    return (
        <div className="w-full xl:w-2/3 2xl:w-1/2 flex flex-col gap-8 relative">
            {editable ? (
                <form className="flex flex-col gap-4">
                    <label
                        className="font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100"
                        htmlFor="bundle-name"
                    >
                        Name <Components.RequiredIndicator />
                    </label>
                    <input
                        id="bundle-name"
                        required
                        type="text"
                        value={bundleName}
                        onChange={(e) => setBundleName(e.target.value)}
                        className="block rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400"
                    />
                    <label
                        className="mt-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100"
                        htmlFor="add-publications"
                    >
                        Add publications <Components.RequiredIndicator />
                    </label>
                    <Components.PublicationCombobox
                        buttonText="Add to bundle"
                        buttonCallback={async (publicationId) => addEntry(publicationId)}
                        draftsOnly={false}
                        excludedIds={entries.map((entry) => entry.id)}
                        setError={setError}
                        disabled={numberOfEntriesUpperLimit}
                    />
                </form>
            ) : null}
            <div className="sr-only" aria-live="polite">
                {deletionUpdate}
            </div>
            <div>
                {!!entries.length && (
                    <Framer.motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className={`flex flex-col overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent ${invalidNumberOfEntries ? 'rounded-t-lg' : 'rounded-lg'}`}
                    >
                        <DndContext
                            id={dndContextId}
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[disablePageScrollModifier]}
                        >
                            <SortableContext
                                items={entries.map((entry) => entry.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <table
                                    className="min-w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                                    aria-label="Bundled publications table"
                                >
                                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                        <tr>
                                            {editable ? <th className={thClasses}>Order</th> : null}
                                            <th className={`text-left ${thClasses}`}>Publication</th>
                                            <th className={thClasses}>View</th>
                                            {editable ? <th className={thClasses}>Delete</th> : null}
                                        </tr>
                                    </thead>
                                    <tbody className="my-4 bg-white-50 transition-colors duration-500 divide-y divide-grey-100 dark:divide-teal-300 dark:bg-grey-600">
                                        {entries.map((entry) => (
                                            <Components.PublicationBundleFormEntry
                                                key={entry.id}
                                                entry={entry}
                                                onDelete={deleteEntry}
                                                deleting={deleting}
                                                editable={editable}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </SortableContext>
                        </DndContext>
                    </Framer.motion.div>
                )}
                {editable && invalidNumberOfEntries ? (
                    <div className="first:rounded-lg rounded-b-lg bg-grey-50 px-6 py-4 text-left text-sm text-grey-900 dark:bg-grey-700 dark:text-white-50 sm:text-center">
                        <h4 className="text-lg dark:text-white-50">
                            <span className="font-semibold">
                                {entries.length < 1
                                    ? 'Please add at least 2 more publication to this bundle before saving'
                                    : entries.length < 2
                                      ? 'Please add at least 1 more publication to this bundle before saving'
                                      : 'You have reached the limit of 30 publications'}
                            </span>
                        </h4>
                    </div>
                ) : null}
            </div>
            {editable ? (
                <div className="flex items-center gap-4">
                    <Components.Button href={Config.urls.viewBundles.path} title="Cancel" />
                    <Components.Button
                        disabled={!bundleName || entries.length < 2 || isLoading}
                        onClick={() => onSave({ name: bundleName, entries })}
                        title="Save"
                        variant="block"
                    />
                </div>
            ) : null}
        </div>
    );
};

export default PublicationBundleForm;
