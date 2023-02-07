import React, { useEffect } from 'react';
import * as Components from '@components';
import * as Types from '@types';
import * as Interfaces from '@interfaces';
import { Publication } from '@layouts';
import CoAuthor from '../Publication/Creation/CoAuthor';

type Props = {
    publicationData: Interfaces.Publication;
    user: Interfaces.User;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
            <table
                data-testid="approval-tracket-table"
                className="mb- min-w-full divide-y divide-grey-100 dark:divide-teal-300"
            >
                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                    <tr>
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            Author
                        </th>
                        <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                    {props.publicationData.coAuthors.map((CoAuthor) => (
                        <tr key={CoAuthor.id}>
                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                <div className="space-y-2">
                                    {props.publicationData.createdBy === props.user.id ? (
                                        <div>
                                            {CoAuthor.linkedUser ? (
                                                <p>{`${CoAuthor.user?.firstName} ${CoAuthor.user?.lastName}`} </p>
                                            ) : (
                                                <p>{CoAuthor.email} </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {CoAuthor.linkedUser && (
                                                <p>{`${CoAuthor.user?.firstName} ${CoAuthor.user?.lastName}`} </p>
                                            )}
                                        </div>
                                    )}

                                    {props.publicationData.createdBy === CoAuthor.linkedUser && (
                                        <p> Corrosponding Author </p>
                                    )}
                                </div>
                            </td>
                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                <div className="space-y-2">
                                    {!CoAuthor.linkedUser ? (
                                        <p> Unconfirmed </p>
                                    ) : (
                                        <p> {CoAuthor.confirmedCoAuthor ? 'Approved' : 'Approval Pending'} </p>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovalsTracker;
