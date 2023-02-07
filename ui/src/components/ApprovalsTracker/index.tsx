import React, { useEffect } from 'react';
import * as Types from '@types';
import * as Interfaces from '@interfaces';

type Props = {
    publicationData: Interfaces.Publication;
    user: Types.UserType;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    return (
        <>
            <p className="my-2 text-lg dark:text-white-50">
                Your role on this publication:{' '}
                {props.user.id === props.publicationData.createdBy ? 'Corresponding author' : 'Author'}
            </p>
            <div className="my-2 overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
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
                                        {CoAuthor.linkedUser ? (
                                            <p>
                                                {props.publicationData.createdBy === CoAuthor.linkedUser
                                                    ? `${CoAuthor.user?.firstName} ${CoAuthor.user?.lastName} (Corrosponding Author)`
                                                    : `${CoAuthor.user?.firstName} ${CoAuthor.user?.lastName} `}
                                            </p>
                                        ) : (
                                            <p>
                                                {props.publicationData.createdBy === props.user.id
                                                    ? `${CoAuthor.email}`
                                                    : 'Unconfirmed Author'}
                                            </p>
                                        )}
                                        {props.publicationData.createdBy === CoAuthor.linkedUser && (
                                            <p> {CoAuthor.email}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                    {props.publicationData.createdBy === CoAuthor.linkedUser ? (
                                        <div className="space-y-2">
                                            <p> Corrosponding Author </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {!CoAuthor.linkedUser ? (
                                                <p> Unconfirmed </p>
                                            ) : (
                                                <>
                                                    {CoAuthor.confirmedCoAuthor ? (
                                                        <p className="text-green-700 dark:text-green-300"> Approved </p>
                                                    ) : (
                                                        <p> Approval Pending </p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ApprovalsTracker;
