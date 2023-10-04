import React, { useEffect, useState } from 'react';

import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Framer from 'framer-motion';
import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Helpers from '@helpers';
import * as I from '@interfaces';

import { DragDropContext, Droppable, Draggable, DropResult, DragStart } from 'react-beautiful-dnd';
import { createId } from '@paralleldrive/cuid2';

// reorder the result
const reorder = (list: I.CoAuthor[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle?: React.CSSProperties): React.CSSProperties => ({
    userSelect: 'none',
    filter: isDragging ? 'opacity(0.7)' : undefined,
    boxShadow: isDragging ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : undefined,
    // styles applied on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? 'transparent' : undefined
});

const preserveColumnsWidth = (draggableId: string) => {
    const selectedRow = document.getElementById(draggableId);

    if (!selectedRow) {
        return;
    }

    // preserve selected row columns width while dragging
    selectedRow.querySelectorAll('td').forEach((cell) => {
        cell.setAttribute('style', `width: ${cell.clientWidth}px;`);
    });

    // preserve table columns width while dragging
    const columns = document.querySelectorAll('th');
    columns.forEach((column) => {
        column.setAttribute('style', `min-width: ${column.clientWidth}px`);
    });
};

const resetColumnsWidth = (draggableId: string) => {
    const selectedRow = document.getElementById(draggableId);

    if (!selectedRow) {
        return;
    }

    // reset selected row columns width
    selectedRow.querySelectorAll('td').forEach((cell) => {
        cell.removeAttribute('style');
    });

    // reset table columns width
    const columns = document.querySelectorAll('th');
    columns.forEach((column) => {
        column.removeAttribute('style');
    });
};

const onBeforeDragStart = (start: DragStart) => {
    preserveColumnsWidth(start.draggableId);
};

const CoAuthor: React.FC = (): React.ReactElement => {
    const coAuthors = Stores.usePublicationCreationStore((state) => state.publicationVersion.coAuthors);
    const updateCoAuthors = Stores.usePublicationCreationStore((state) => state.updateCoAuthors);
    const versionId = Stores.usePublicationCreationStore((state) => state.publicationVersion.id);
    const user = Stores.useAuthStore((state) => state.user);

    const [loading, setLoading] = React.useState(false);
    const [coAuthor, setCoAuthor] = React.useState('');
    const [emailValidated, setEmailValidated] = React.useState(true);
    const [emailDuplicated, SetEmailDuplicated] = React.useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            // dropped outside the list
            return;
        }

        const items = reorder(coAuthors, result.source.index, result.destination.index);

        updateCoAuthors(items);
        setTimeout(() => resetColumnsWidth(result.draggableId)); // execute after state update in order to prevent flickering
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmailValidated(true);
        SetEmailDuplicated(true);
        setCoAuthor(event.target.value?.trim());
    };

    // Validate email for co author regex to use -
    const addCoAuthorToPublication = React.useCallback(async () => {
        setLoading(true);

        const authorsArray = coAuthors || [];

        // check to ensure co-author email is not already in the store/database
        const emailDuplicate = authorsArray.some((author) => author.email.toLowerCase() === coAuthor.toLowerCase());
        if (emailDuplicate) {
            SetEmailDuplicated(false);
            setLoading(false);
            return;
        }

        const validEmail = Helpers.validateEmail(coAuthor);

        if (!validEmail) {
            setEmailValidated(false);
            setLoading(false);
            return;
        }

        setCoAuthor('');

        const newAuthor = {
            id: createId(),
            publicationVersionId: versionId,
            email: coAuthor,
            linkedUser: null,
            approvalRequested: false,
            confirmedCoAuthor: false,
            isIndependent: false,
            affiliations: []
        };

        authorsArray.push(newAuthor);
        updateCoAuthors(authorsArray);
        setLoading(false);
    }, [coAuthors, coAuthor, versionId, updateCoAuthors]);

    const deleteCoAuthor = async (coAuthorId: string) => {
        updateCoAuthors(coAuthors.filter((item) => item.id !== coAuthorId));
    };

    const refreshCoAuthors = React.useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get(
                `${Config.endpoints.publicationVersions}/${versionId}/coauthors`,
                user?.token
            );
            updateCoAuthors(response.data);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    }, [updateCoAuthors, user?.token, versionId]);

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Co-authors" />
                <p className="block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Add the email addresses of any co-authors involved in this publication. Note that they will only
                    receive an email asking them to confirm their involvement and preview the publication once you have
                    requested their approval using the &quot;Request Approval&quot; button.
                </p>
                <br />
                <p className="block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Please note that in line with the smaller publication types on Octopus, we encourage you to list
                    only those authors that were directly involved in this stage of the research process.
                </p>
                <br />
            </div>

            <div data-testid="co-author-invite">
                <div className="flex items-center space-x-4">
                    <input
                        data-testid="co-author-email-input"
                        className="w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                        autoComplete="off"
                        placeholder="Email of co-author"
                        value={coAuthor}
                        type="email"
                        onChange={handleEmailChange}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') addCoAuthorToPublication();
                        }}
                    />
                    <Components.Button
                        title="Add Co-author"
                        disabled={!coAuthor}
                        onClick={addCoAuthorToPublication}
                        endIcon={
                            loading ? (
                                <OutlineIcons.ArrowPathIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                            ) : (
                                <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                            )
                        }
                    />
                </div>
                {!emailValidated && (
                    <Components.Alert
                        data-testid="email-error"
                        severity="ERROR"
                        title="Please enter a valid email address"
                        className="mt-3 w-2/3"
                    />
                )}
                {!emailDuplicated && (
                    <Components.Alert
                        data-testid="email-error"
                        severity="ERROR"
                        title="Email already added as an author"
                        className="mt-3 w-2/3"
                    />
                )}
            </div>

            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <h2 className="text-md flex space-x-1 font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Re-arrange the authors in this table to change their displayed order in the final publication
                </h2>
                <br />
                <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                            <table
                                id="authors-table"
                                data-testid="coauthor-table"
                                className="min-w-full divide-y divide-grey-100 dark:divide-teal-300"
                            >
                                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                    <tr>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Order
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Status
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Approval Requested
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Email
                                        </th>
                                        <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                            User
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>

                                <DragDropContext onDragEnd={onDragEnd} onBeforeDragStart={onBeforeDragStart}>
                                    {isMounted && (
                                        <Droppable droppableId="droppable">
                                            {(provided, snapshot) => (
                                                <tbody
                                                    className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600"
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                >
                                                    {coAuthors.map((coAuthor, index) => (
                                                        <Draggable
                                                            key={coAuthor.id}
                                                            draggableId={coAuthor.id}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <Components.PublicationCreationCoAuthorEntry
                                                                    key={coAuthor.id}
                                                                    coAuthor={coAuthor}
                                                                    deleteCoAuthor={deleteCoAuthor}
                                                                    dragHandleProps={provided.dragHandleProps}
                                                                    isMainAuthor={coAuthor.linkedUser === user?.id} // only main author can access 'edit draft' screen atm
                                                                    entryProps={{
                                                                        id: coAuthor.id,
                                                                        className:
                                                                            'box-border w-full h-full bg-white-50 outline-0 ring-offset-1 focus:ring-2 focus:ring-inset focus:ring-yellow-400 last-of-type:focus:rounded-b-lg dark:bg-grey-600',
                                                                        ref: provided.innerRef,
                                                                        ...provided.draggableProps,
                                                                        style: getItemStyle(
                                                                            snapshot.isDragging,
                                                                            provided.draggableProps.style
                                                                        )
                                                                    }}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </tbody>
                                            )}
                                        </Droppable>
                                    )}
                                </DragDropContext>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex min-w-full justify-end pt-2">
                    <Components.Button
                        title="Refresh"
                        onClick={refreshCoAuthors}
                        startIcon={
                            <OutlineIcons.ArrowPathIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        }
                        textSize="sm"
                        className="px-1 py-2"
                        disabled={loading}
                    />
                </div>
            </Framer.motion.div>

            {!coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor) && (
                <Components.Alert
                    severity="INFO"
                    title="All co-authors must be verified before making a publication live."
                    className="w-fit"
                />
            )}
        </div>
    );
};

export default CoAuthor;
