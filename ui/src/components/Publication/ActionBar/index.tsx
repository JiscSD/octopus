import React from 'react';
import * as Stores from '@stores';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    publication: Interfaces.Publication;
    isReadyForPublish: boolean;
    isCorrespondingUser: boolean;
    isPublishing: boolean;
    onUnlockPublication: () => Promise<void>;
    onApprove: () => Promise<void>;
    onCancelApproval: () => Promise<void>;
    onPublish: () => Promise<void>;
};

const ActionBar: React.FC<Props> = (props) => {
    const { user } = Stores.useAuthStore();
    const isApprovedByCoAuthor = React.useMemo(
        () => props.publication.coAuthors.some((author) => author.linkedUser === user?.id && author.confirmedCoAuthor),
        [props.publication.coAuthors, user?.id]
    );

    return (
        <div className="mb-4 rounded-lg bg-grey-50 p-6 text-grey-900 shadow ring-1 ring-black ring-opacity-5 transition-colors duration-500 dark:bg-grey-700 dark:text-white-50 dark:ring-transparent">
            {user && (
                <div className="flex flex-col gap-4 pb-8 lg:flex-row lg:items-center lg:justify-between">
                    <h4>
                        <strong>Publication status:</strong>{' '}
                        {Helpers.getPublicationStatusByAuthor(props.publication, user)}
                    </h4>
                    {props.isCorrespondingUser ? (
                        props.isReadyForPublish ? (
                            <Components.Button
                                className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                                disabled={props.isPublishing}
                                endIcon={<OutlineIcons.CloudUploadIcon className="w-5 shrink-0 text-white-50" />}
                                title="Publish"
                                onClick={props.onPublish}
                            >
                                Publish
                            </Components.Button>
                        ) : null
                    ) : isApprovedByCoAuthor ? (
                        <Components.Button
                            className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-red-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                            endIcon={<OutlineIcons.XIcon className="w-5 shrink-0 text-white-50" />}
                            title="Cancel your approval"
                            onClick={props.onCancelApproval}
                        >
                            Cancel your approval
                        </Components.Button>
                    ) : (
                        <Components.Button
                            className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                            endIcon={<OutlineIcons.CheckIcon className="w-5 shrink-0 text-white-50" />}
                            title="Approve this publication"
                            onClick={props.onApprove}
                        >
                            Approve this publication
                        </Components.Button>
                    )}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <div className="flex items-start text-sm">
                        <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px]" />
                        <p>
                            This publication is only visible to authors. All authors must approve this draft before it
                            can be published.
                        </p>
                    </div>
                    {props.isCorrespondingUser && (
                        <div className="mt-6 flex items-start text-sm">
                            <OutlineIcons.LockClosedIcon className="mr-2 inline max-w-[20px]" />
                            <div>
                                <p className="pb-1">This publication is locked for approval.</p>
                                <Components.Link
                                    className="inline w-fit rounded text-teal-600 underline outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-teal-200 dark:decoration-teal-200"
                                    href={`${Config.urls.viewPublication.path}/${props.publication.id}/edit?step=4`}
                                    title="Edit publication"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        await props.onUnlockPublication();
                                    }}
                                >
                                    Cancel all authorship requests and unlock for editing
                                </Components.Link>
                            </div>
                        </div>
                    )}
                </div>
                {!props.isCorrespondingUser && (
                    <div className="flex items-start text-sm">
                        <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px]" />
                        <p>
                            {isApprovedByCoAuthor
                                ? 'You have already approved this publication.'
                                : 'If any changes are required, please discuss with the corresponding author.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionBar;
