import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

type LinkedItemTableProps = {
    deleteLink: (id: string) => Promise<void>;
    entities: Interfaces.LinkedToPublication[] | Interfaces.BaseTopic[];
    entityType: Types.LinkedEntityType;
};

const LinkedItemTable: React.FC<LinkedItemTableProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
            <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                    <table
                        className="min-w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                        id={`linked-${props.entityType === 'TOPIC' ? 'topic' : 'publication'}-table`}
                    >
                        <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                            <tr>
                                <th className="w-4/5 whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6">
                                    {Config.values.linkedEntityTypeLabels[props.entityType]}
                                </th>
                                <th className="whitespace-pre py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody className="my-4 divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                            {props.entities.map((entity) =>
                                'type' in entity ? (
                                    <Components.LinkedPublicationRow
                                        key={entity.id}
                                        linkedPublication={entity}
                                        deleteLink={props.deleteLink}
                                    />
                                ) : (
                                    <Components.LinkedTopicRow
                                        key={entity.id}
                                        topic={entity}
                                        deleteTopic={props.deleteLink}
                                    />
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Framer.motion.div>
    );
};

export default LinkedItemTable;
