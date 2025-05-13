import React from 'react';
import * as Framer from 'framer-motion';

type LinkedItemTableProps = {
    entityType: 'PUBLICATION' | 'TOPIC';
    inherited: boolean;
    rows: React.ReactNode;
};

const LinkedItemTable: React.FC<LinkedItemTableProps> = (props): React.ReactElement => {
    const thClasses =
        'whitespace-pre py-3.5 px-3 sm:px-6 text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50';
    return (
        <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-4 flex flex-col">
            <div className="inline-block w-full py-2 align-middle">
                <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                    <table
                        className="w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                        id={`${props.inherited ? 'inherited' : 'new'}-linked-${props.entityType === 'TOPIC' ? 'topic' : 'publication'}-table`}
                    >
                        <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                            <tr>
                                <th
                                    className={`${props.entityType === 'PUBLICATION' ? (props.inherited ? 'w-1/2' : 'w-2/3') : 'w-5/6'} text-left ${thClasses}`}
                                >
                                    {props.entityType.charAt(0).toUpperCase() +
                                        props.entityType.slice(1).toLowerCase() +
                                        's'}
                                </th>
                                {props.entityType === 'PUBLICATION' && (
                                    <>
                                        {props.inherited && (
                                            <th className={`w-1/6 text-center ${thClasses}`}>Status</th>
                                        )}
                                        <th className={`w-1/6 text-center ${thClasses}`}>View</th>
                                    </>
                                )}
                                <th className={`w-1/6 text-center ${thClasses}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="my-4 divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                            {props.rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </Framer.motion.div>
    );
};

export default LinkedItemTable;
