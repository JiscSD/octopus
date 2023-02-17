import React from 'react';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';

type Props = {
    publication: Interfaces.Publication;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    const { user } = Stores.useAuthStore();

    return (
        <>
            <p className="mt-8 text-lg font-semibold dark:text-white-50">
                Your role on this publication:{' '}
                {props.publication.createdBy === user?.id ? 'Corresponding author' : 'Author'}
            </p>
            <div className="my-2 overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                <table
                    data-testid="approval-tracker-table"
                    className="min-w-full divide-y divide-grey-100 dark:divide-teal-300"
                >
                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                        <tr>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50">
                                Author
                            </th>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 ">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {props.publication.coAuthors.map((author) => (
                            <tr key={author.id}>
                                <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 transition-colors duration-500 dark:text-white-50">
                                    {author.linkedUser ? (
                                        <>
                                            {author.user?.firstName} {author.user?.lastName}{' '}
                                            {author.linkedUser === user?.id && <span className="text-xs">(you)</span>}
                                        </>
                                    ) : (
                                        <>Unconfirmed Author</>
                                    )}
                                    {(author.linkedUser === props.publication.createdBy ||
                                        user?.id === props.publication.createdBy) && (
                                        <p className="mt-1 text-xs">{author.email}</p>
                                    )}
                                </td>
                                <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 transition-colors duration-500 dark:text-white-50">
                                    {author.linkedUser === props.publication.createdBy ? (
                                        <>Corresponding author</>
                                    ) : author.confirmedCoAuthor ? (
                                        <span className="text-green-700 dark:text-green-300">Approved</span>
                                    ) : author.linkedUser ? (
                                        <>Approval Pending</>
                                    ) : (
                                        <>Unconfirmed</>
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
