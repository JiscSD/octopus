import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    heads: string[];
    records: Interfaces.OrcidWorksRecord[];
};

const WorksTable: React.FC<Props> = (props) => (
    <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                    <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                        <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                            <tr>
                                {props.heads.map((head, index) => (
                                    <th
                                        key={head}
                                        scope="col"
                                        className={`whitespace-pre py-3.5 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 ${
                                            index === 0 ? 'pl-4 pr-3 sm:pl-6' : 'px-3'
                                        }`}
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                            {props.records.map((record, index) => (
                                <tr key={index}>
                                    <td className="space-nowrap py-4 pl-4 pr-3 text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                        {record.url ? (
                                            <a href={record.url} className="underline">
                                                {record.title}
                                            </a>
                                        ) : (
                                            record.title
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-500 transition-colors duration-500 dark:text-grey-100">
                                        {record.doi ?? 'No DOI available.'}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-500 transition-colors duration-500 dark:text-grey-100">
                                        {`${record.publishedDate.year ? record.publishedDate.year : ''}${
                                            record.publishedDate.month ? `-${record.publishedDate.month}` : ''
                                        }${record.publishedDate.day ? `-${record.publishedDate.day}` : ''}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default WorksTable;
