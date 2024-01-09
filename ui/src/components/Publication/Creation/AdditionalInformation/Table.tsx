import React from 'react';

import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';

type RowProps = {
    item: Interfaces.AdditionalInformation;
};

const TableRow: React.FC<RowProps> = (props): React.ReactElement => {
    const { publicationVersion, updatePublicationVersion } = Stores.usePublicationCreationStore();
    const user = Stores.useAuthStore((state) => state.user);

    const [isLoading, setIsLoading] = React.useState(false);

    const onDeleteRowHandler = async (id: string) => {
        setIsLoading(true);
        try {
            await api.destroy(
                `${Config.endpoints.publicationVersions}/${publicationVersion.id}/additional-information/${id}`,
                user?.token
            );

            updatePublicationVersion({
                ...publicationVersion,
                additionalInformation: publicationVersion.additionalInformation.filter((item) => item.id !== id)
            });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    return (
        <tr key={props.item.id} className="h-12 align-middle">
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                {props.item.title}
            </td>
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <Components.Link href={props.item.url} openNew>
                    {props.item.url}
                </Components.Link>
            </td>
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                {props.item.description}
            </td>
            <td className="space-nowrap h-full items-center justify-center py-4 text-center">
                {isLoading ? (
                    <Components.IconButton
                        className="p-2"
                        title="Deleting item"
                        icon={
                            <OutlineIcons.ArrowPathIcon
                                className="ml-6 h-full w-7 animate-reverse-spin justify-center align-middle text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                aria-hidden="true"
                                aria-label="Deleting item"
                            />
                        }
                    />
                ) : (
                    <Components.IconButton
                        className=" h-full justify-center align-middle"
                        title="Delete"
                        icon={
                            <OutlineIcons.TrashIcon
                                className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50"
                                aria-hidden="true"
                            />
                        }
                        onClick={() => onDeleteRowHandler(props.item.id)}
                    />
                )}
            </td>
        </tr>
    );
};

const Table: React.FC = () => {
    const { publicationVersion } = Stores.usePublicationCreationStore();
    return (
        <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8">
            {!!publicationVersion.additionalInformation.length && (
                <table
                    data-testid="additional-information-table"
                    className="mb-6 min-w-full divide-y divide-grey-100 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:divide-teal-300 dark:ring-transparent  md:rounded-lg"
                >
                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            Title
                        </th>
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            URL
                        </th>
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            Short Description
                        </th>
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            Delete
                        </th>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {publicationVersion.additionalInformation.map((item) => (
                            <TableRow item={item} />
                        ))}
                    </tbody>
                </table>
            )}
        </Framer.motion.div>
    );
};

export default Table;
