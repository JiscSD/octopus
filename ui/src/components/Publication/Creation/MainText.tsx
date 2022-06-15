import React from 'react';

import * as api from '@api';
import * as Assets from '@assets';
import * as Components from '@components';
import * as Config from '@config';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Types from '@types';

const MainText: React.FC = (): React.ReactElement | null => {
    const publicationId = Stores.usePublicationCreationStore((state) => state.id);
    const description = Stores.usePublicationCreationStore((state) => state.description);
    const updateDescription = Stores.usePublicationCreationStore((state) => state.updateDescription);
    const keywords = Stores.usePublicationCreationStore((state) => state.keywords);
    const updateKeywords = Stores.usePublicationCreationStore((state) => state.updateKeywords);
    const content: string = Stores.usePublicationCreationStore((state) => state.content);
    const updateContent = Stores.usePublicationCreationStore((state) => state.updateContent);
    const language = Stores.usePublicationCreationStore((state) => state.language);
    const updateLanguage = Stores.usePublicationCreationStore((state) => state.updateLanguage);
    const references = Stores.usePublicationCreationStore((state) => state.references);
    const updateReferences = Stores.usePublicationCreationStore((state) => state.updateReferences);
    const user = Stores.useAuthStore((state) => state.user);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(false);
    }, [content]);

    const addReferencesRef = React.useRef(null);

    const fetchAndSetReferences = async (token?: string) => {
        try {
            const response = await api.get(`/publications/${publicationId}/reference`, token);
            updateReferences(response.data);
        } catch (err) {}
    };

    const addReferences = React.useCallback(async () => {
        try {
            const referenceField: React.RefObject<any> = addReferencesRef;

            // Pattern using regex groups to retrieve reference text and to determine whether a string contains DOI or URI
            const pattern =
                /(?<TEXT>.+?(?=http))((?<DOI>((((http|https):\/\/)(([-a-zA-Z0-9_]{1,265}([^\s]+)))))(10{1}\.([^\n]+)))|(?<URL>((((http|https):\/\/)(([-a-zA-Z0-9_]{1,265}([^\n]+)))))))|(?<TEXTONLY>.+?(?=$))/g;

            const matches = `${referenceField.current.value}`.matchAll(pattern);

            // Iterate through matches
            if (matches) {
                let matchArray: Interfaces.Reference[] = [];
                for (const match of matches) {
                    let location: string | null;
                    let type: Interfaces.ReferenceType;
                    let text: string;

                    if (match.groups.DOI) {
                        location = match.groups.DOI;
                        type = 'DOI';
                        text = match.groups.TEXT;
                    } else if (match.groups.URL) {
                        location = match.groups.URL;
                        type = 'URL';
                        text = match.groups.TEXT;
                    } else {
                        type = 'TEXT';
                        text = match.groups.TEXTONLY;
                        location = null;
                    }

                    const createdReference = await api.post<Interfaces.Reference>(
                        `/publications/${publicationId}/reference`,
                        {
                            type,
                            text,
                            location
                        },
                        user?.token
                    );

                    matchArray.push(createdReference.data);
                }
                fetchAndSetReferences(user?.token);
                referenceField.current.value = '';
            }
            // No references found
        } catch (err) {
            console.log(err);
        }
    }, [publicationId, user]);

    const destroyReference = React.useCallback(
        async (id: string) => {
            await api.destroy(`/publications/${publicationId}/reference/${id}`, user?.token);
            fetchAndSetReferences(user?.token);
        },
        [publicationId, user]
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Main text" required />
                {!loading ? (
                    <Components.TextEditor defaultContent={content} contentChangeHandler={updateContent} />
                ) : (
                    <div className="mt-16 flex animate-bounce justify-center">
                        <Assets.Logo width={60} height={60} className="fill-teal-500" />
                    </div>
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
                >
                    {Config.values.octopusInformation.languages.map((entry) => (
                        <option key={entry.code} selected={entry.code === language ?? 'en'} value={entry.code}>
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
                <div className="flex flex-col items-end space-y-4">
                    <textarea
                        required
                        rows={3}
                        ref={addReferencesRef}
                        className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                    ></textarea>
                    <Components.Button
                        link
                        onClick={(e) => addReferences()}
                        title={'Add references'}
                        iconPosition={'RIGHT'}
                        icon={
                            <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        }
                    />
                    {references.length > 0 && (
                        <div className="w-full overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                            <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                    <tr>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                            Title
                                        </th>
                                        <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                            Location
                                        </th>
                                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 "></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                    {references.map((reference) => (
                                        <tr key={reference.id}>
                                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                {reference.text}
                                            </td>
                                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 underline transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                <a href={reference.location}>{reference.location}</a>
                                            </td>
                                            <td className="space-nowrap py-4 px-8 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                                <button
                                                    onClick={(e) => destroyReference(reference.id)}
                                                    className="rounded-full"
                                                >
                                                    {loading ? (
                                                        <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                                    ) : (
                                                        <OutlineIcons.TrashIcon className="h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Description" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include a short description of your publication to aid discovery. We recommend around 160 characters
                    in length.
                </span>
                <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => updateDescription(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                ></textarea>
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
        </div>
    );
};

export default MainText;
