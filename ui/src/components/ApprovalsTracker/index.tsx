import React, { useMemo } from 'react';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Components from '@components';

type Props = {
    publication: Interfaces.Publication;
    isPublishing: boolean;
    onPublish: () => void;
};

const ApprovalsTracker: React.FC<Props> = (props): React.ReactElement => {
    const { user } = Stores.useAuthStore();

    const remainingApprovalsCount = useMemo(
        () => props.publication.coAuthors.filter((author) => !author.confirmedCoAuthor).length,
        [props.publication.coAuthors]
    );

    return (
        <div className="children:transition-colors">
            <h4 className="mt-8 text-lg dark:text-white-50">
                Your role on this publication:{' '}
                <span className="font-semibold">
                    {props.publication.createdBy === user?.id ? 'Corresponding author' : 'Author'}
                </span>
            </h4>
            <div className="my-2 overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
                <table
                    data-testid="approval-tracker-table"
                    className="min-w-full divide-y divide-grey-100 dark:divide-teal-300"
                >
                    <thead className="bg-grey-50 duration-500 dark:bg-grey-700">
                        <tr>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50">
                                Author
                            </th>
                            <th className="whitespace-pre py-3.5 px-6  text-left text-sm font-semibold text-grey-900 duration-500 dark:text-grey-50 ">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-100 bg-white-50 duration-500 dark:divide-teal-300 dark:bg-grey-600">
                        {props.publication.coAuthors.map((author) => (
                            <tr key={author.id}>
                                <td className="whitespace-nowrap py-4 px-6 text-sm text-grey-900 duration-500 dark:text-white-50">
                                    {author.linkedUser ? (
                                        <>
                                            <Components.Link
                                                href={`/authors/${author.linkedUser}`}
                                                className="rounded border-transparent underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-white-50"
                                            >
                                                {author.user?.firstName} {author.user?.lastName}
                                            </Components.Link>{' '}
                                            {author.linkedUser === user?.id && <span className="text-xs">(You)</span>}
                                        </>
                                    ) : (
                                        <>Unconfirmed Author</>
                                    )}
                                    {user?.id === props.publication.createdBy && (
                                        <p className="mt-1 text-xs">{author.email}</p>
                                    )}
                                </td>
                                <td className="whitespace-nowrap py-4 px-6  text-sm text-grey-900 duration-500 dark:text-white-50">
                                    {author.linkedUser === props.publication.createdBy ? (
                                        <>Corresponding author</>
                                    ) : author.confirmedCoAuthor ? (
                                        <span className="text-green-500 dark:text-green-300">Approved</span>
                                    ) : author.linkedUser ? (
                                        <>Approval Pending</>
                                    ) : (
                                        <>Unconfirmed</>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {user?.id === props.publication.createdBy && (
                            <tr className="bg-grey-50 duration-500 dark:bg-grey-700">
                                <td
                                    colSpan={2}
                                    className="whitespace-nowrap py-4 px-6 text-sm text-grey-900 duration-500 dark:text-white-50"
                                >
                                    {remainingApprovalsCount > 0 ? (
                                        <div className="text-center">
                                            <h4 className="text-lg dark:text-white-50">
                                                <span className="font-semibold">{remainingApprovalsCount}</span> more
                                                author {remainingApprovalsCount === 1 ? 'approval is' : 'approvals are'}{' '}
                                                required before publishing
                                            </h4>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <OutlineIcons.BadgeCheckIcon className="w-6 text-green-500 duration-500 dark:text-green-300" />
                                                <h4 className="text-lg dark:text-white-50">
                                                    All authors have <span className="font-semibold">approved</span>{' '}
                                                    this publication
                                                </h4>
                                            </div>
                                            <Components.Button
                                                disabled={props.isPublishing}
                                                className="inline-flex items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                                                endIcon={<OutlineIcons.CloudUploadIcon className="w-5 text-white-50" />}
                                                title="Publish"
                                                onClick={props.onPublish}
                                            >
                                                Publish
                                            </Components.Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalsTracker;
