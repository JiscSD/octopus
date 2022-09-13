import React, { useCallback, useMemo, useState } from 'react';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Stores from '@stores';
import * as Types from '@types';
import * as Interfaces from '@interfaces';
import * as FAIcons from 'react-icons/fa';
import * as Config from '@config';
import * as Contexts from '@contexts';

import cuid from 'cuid';

const getTransformedReference = (reference: Interfaces.Reference): Interfaces.Reference => {
    const URL_REGEX = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
    const urlMatches = reference.text.match(URL_REGEX) || [];

    if (!urlMatches?.length) {
        // no urls have been found
        return {
            ...reference,
            type: 'TEXT',
            text: reference.text,
            location: null
        };
    }

    // reverse the order for easier access
    const reversedUrlMatches = urlMatches.reverse(); // we only need the last DOI/URL

    // get the last valid DOI url
    const DOI_REGEX = /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/g;
    const doiUrl = reversedUrlMatches.find((match) => DOI_REGEX.test(match));

    if (doiUrl) {
        return {
            ...reference,
            type: 'DOI',
            text: reference.text,
            location: doiUrl
        };
    }

    // extract the last URL
    const lastUrl = reversedUrlMatches[0];
    return {
        ...reference,
        type: 'URL',
        text: reference.text,
        location: lastUrl
    };
};

const MainText: React.FC = (): React.ReactElement | null => {
    const {
        id: publicationId,
        updateDescription,
        keywords,
        updateKeywords,
        content,
        description,
        updateContent,
        language,
        updateLanguage,
        references,
        updateReferences
    } = Stores.usePublicationCreationStore();
    const [selectedReference, setSelectedReference] = useState<Interfaces.Reference | null>(null);
    const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number | null>(null);
    const isAddingReference = useMemo(() => selectedReferenceIndex !== null, [selectedReferenceIndex]);
    const confirmation = Contexts.useConfirmationModal();

    const addReferences = (editorContent: string) => {
        const paragraphsArray = editorContent.match(/<p>(.*?)<\/p>/g) || [];

        if (!paragraphsArray.length) {
            return;
        }

        let referencesArray = references || [];

        for (let i = 0; i < paragraphsArray.length; i++) {
            const currentParagraph = paragraphsArray[i].trim();
            const paragraphElement = new DOMParser().parseFromString(currentParagraph, 'text/html').querySelector('p');
            const textContent = paragraphElement?.textContent?.trim();

            if (!textContent) {
                continue; // don't add empty references
            }

            const newReference = getTransformedReference({
                id: cuid(),
                publicationId,
                type: 'TEXT',
                text: currentParagraph,
                location: null
            });

            referencesArray.push(newReference);
        }
        updateReferences(referencesArray);
    };

    const destroyReference = (id: string) => {
        updateReferences(references.filter((item) => item.id !== id));
    };

    const handleCloseReferenceModal = useCallback(() => {
        setSelectedReference(null);
    }, []);

    const saveReferenceChanges = useCallback(
        (reference: Interfaces.Reference) => {
            const modifiedReference = getTransformedReference(reference);

            if (isAddingReference && selectedReferenceIndex !== null) {
                // it's a new reference
                const newReferencesArray = [...references];
                // add new reference right after the selected index
                newReferencesArray.splice(selectedReferenceIndex + 1, 0, modifiedReference);
                updateReferences(newReferencesArray);
                return handleCloseReferenceModal();
            }

            updateReferences(
                references.map((reference) => (reference.id === modifiedReference.id ? modifiedReference : reference))
            );
            setSelectedReference(null);
        },
        [handleCloseReferenceModal, isAddingReference, references, selectedReferenceIndex, updateReferences]
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Main text" required />
                {publicationId && (
                    <Components.TextEditor
                        defaultContent={content}
                        contentChangeHandler={updateContent}
                        references={references}
                    />
                )}
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Language" required />
                <select
                    name="language"
                    id="language"
                    onChange={(e) => updateLanguage(e.target.value as Types.Languages)}
                    className="mb-4 block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400 lg:mb-0 xl:w-1/2"
                    required
                    defaultValue={
                        Config.values.octopusInformation.languages.find((entry) => entry.code === language)?.code ||
                        'en'
                    }
                >
                    {Config.values.octopusInformation.languages.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                            {entry.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                <Components.PublicationCreationStepTitle text="References" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include your reference list for this publication. References should be line-separated and include a
                    DOI or other URL. Once you have added your references, you can create reference links in the main
                    text editor.
                </span>
                <div className="pb-8">
                    <Components.AddReferences addReferences={addReferences} />
                </div>
                {references && references.length > 0 && (
                    <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                        <table className="w-full divide-y divide-grey-100  dark:divide-teal-300">
                            <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                <tr>
                                    <th className="py-4 pl-4 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6">
                                        Title
                                    </th>
                                    <th className="py-4 pl-4 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6">
                                        Location
                                    </th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                {references.map((reference, index) => (
                                    <tr key={reference.id}>
                                        <td className="w-[60%] min-w-[400px] py-4 pl-4 text-sm text-grey-900 transition-colors duration-500 children:text-sm dark:text-white-50 sm:pl-6">
                                            <Components.ParseHTML
                                                content={
                                                    reference.location
                                                        ? reference.text.replaceAll(
                                                              reference.location,
                                                              `<a href="${reference.location}" target="_blank" rel="noreferrer noopener">${reference.location}</a>`
                                                          )
                                                        : reference.text
                                                }
                                            ></Components.ParseHTML>
                                        </td>
                                        <td className="w-[40%] min-w-[250px] break-all py-4 pl-4 text-sm text-grey-900 underline transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                            {reference.location && (
                                                <Components.Link href={reference.location} openNew>
                                                    {reference.location}
                                                </Components.Link>
                                            )}
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                            <Components.IconButton
                                                className="p-2"
                                                title="Add"
                                                icon={
                                                    <FAIcons.FaPlus
                                                        className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                        aria-hidden="true"
                                                    />
                                                }
                                                onClick={() => {
                                                    setSelectedReferenceIndex(index);
                                                    setSelectedReference({
                                                        id: cuid(), // generate new id
                                                        publicationId,
                                                        text: '',
                                                        type: 'TEXT',
                                                        location: null
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                            <Components.IconButton
                                                className="p-2"
                                                title="Edit"
                                                icon={
                                                    <FAIcons.FaEdit
                                                        className="h-4 w-4 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                                        aria-hidden="true"
                                                    />
                                                }
                                                onClick={() => {
                                                    if (isAddingReference) {
                                                        setSelectedReferenceIndex(null); // reset modal title
                                                    }
                                                    setSelectedReference(reference);
                                                }}
                                            />
                                        </td>
                                        <td className="p-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                            <Components.IconButton
                                                className="p-2"
                                                title="Delete"
                                                icon={
                                                    <OutlineIcons.TrashIcon className="h-5 w-5 text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                                }
                                                onClick={async () => {
                                                    const confirmed = await confirmation(
                                                        'Deleting a reference may affect the accuracy of your reference numbering and in-text references. Are you sure you want to delete this reference? This action cannot be undone. ',
                                                        'Are you sure you want to delete this reference?',
                                                        <OutlineIcons.TrashIcon
                                                            className="h-10 w-10 text-grey-600"
                                                            aria-hidden="true"
                                                        />,
                                                        'Delete'
                                                    );
                                                    if (confirmed) {
                                                        destroyReference(reference.id);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Short description" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include a short description of your publication to aid discovery. This can be no more than 160
                    characters in length.
                </span>
                <textarea
                    required
                    rows={3}
                    maxLength={160}
                    value={description}
                    onChange={(e) => updateDescription(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                />
                <div className="mt-2 flex justify-end">
                    <span className="text-xs text-grey-500 dark:text-white-50">{description.length} / 160</span>
                </div>
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Keywords" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include up to 10 keywords relating to your content. These can be comma-separated and/or line
                    separated.
                </span>
                <textarea
                    required
                    rows={5}
                    value={keywords}
                    onChange={(e) => updateKeywords(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                />
                <div className="mt-2 flex justify-end">
                    <span className="text-xs text-grey-500 dark:text-white-50">
                        {Helpers.formatKeywords(keywords).length} / 10
                    </span>
                </div>
            </div>

            <Components.EditReferenceModal
                title={isAddingReference ? 'Add reference' : 'Edit reference'}
                reference={selectedReference}
                onSave={saveReferenceChanges}
                onClose={handleCloseReferenceModal}
            />
        </div>
    );
};

export default MainText;
