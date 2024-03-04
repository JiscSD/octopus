import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Helpers from '@/helpers';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Hooks from '@/hooks';

type Props = {
    publication: Interfaces.Publication;
    user: Interfaces.User;
    controlRequests: Interfaces.ControlRequest[];
};

const SimpleResult: React.FC<Props> = (props): React.ReactElement => {
    const { handleCreateNewVersion, loadingNewVersion, newVersionError } = Hooks.useCreateNewVersion(
        props.publication.id
    );
    const { handleControlRequest, loadingControlRequest, controlRequestError } = Hooks.useControlRequest(
        props.publication.id
    );

    const latestLiveVersion = props.publication.versions.find((version) => version.isLatestLiveVersion);
    const isAuthorOnLatestLive =
        latestLiveVersion?.coAuthors.some((coAuthor) => coAuthor.linkedUser === props.user.id) ||
        latestLiveVersion?.createdBy === props.user.id;
    const latestVersion = props.publication.versions.find((version) => version.isLatestVersion);
    const draftExistsWithPermission =
        latestVersion?.currentStatus === 'DRAFT' || latestVersion?.currentStatus === 'LOCKED';
    const draftVersion = draftExistsWithPermission ? latestVersion : null;
    const draftExistsWithoutPermission = !draftExistsWithPermission && !latestLiveVersion?.isLatestVersion;
    const hasAlreadyRequestedControl = props.controlRequests.some(
        (request) => request.data.publicationVersion.versionOf === props.publication.id
    );

    const divider = <span className="border-b border-grey-300 pt-4 dark:border-teal-500 sm:border-r sm:pb-4" />;
    const publishedVersionCount = props.publication.versions.filter(
        (version) => version.currentStatus === 'LIVE'
    ).length;

    const requestControl = hasAlreadyRequestedControl ? (
        <Components.Alert
            severity="INFO"
            title="You have requested control over this publication version."
            className="mt-4"
        />
    ) : (
        <>
            {controlRequestError && <Components.Alert severity="ERROR" title={controlRequestError} className="mt-4" />}
            <Components.Button
                disabled={loadingControlRequest}
                title="Take over editing"
                onClick={handleControlRequest}
                endIcon={<OutlineIcons.PencilSquareIcon className="h-4" />}
                className="mt-5 w-fit bg-green-600 px-3 text-white-50 children:border-none children:text-white-50"
            />
        </>
    );

    const viewDraftButton = (
        <Components.Button
            href={`/publications/${props.publication.id}`}
            endIcon={<OutlineIcons.EyeIcon className="h-4" />}
            title="View Draft"
            className="mt-5 w-fit bg-green-600 px-3 text-white-50 children:border-none children:text-white-50"
        />
    );

    return (
        <li
            data-testid={`publication-${props.publication.id}`}
            className="flex min-h-[200px] w-full flex-col rounded border border-transparent bg-white-50 p-5 text-sm text-grey-800 shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:text-white-50 dark:shadow-none sm:flex-row sm:text-base"
        >
            <div className="flex flex-grow basis-1/5 flex-col sm:pr-5">
                <p className="pb-5 font-bold text-pink-500 dark:text-pink-300">
                    {Helpers.formatPublicationType(props.publication.type)}
                </p>
                <p className="flex-1 flex-grow pb-5 font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {latestLiveVersion ? latestLiveVersion.title : latestVersion?.title}
                </p>
                <div className="flex flex-col justify-between lg:flex-row">
                    <span>{`${publishedVersionCount} published version${publishedVersionCount !== 1 ? 's' : ''}`}</span>
                    <span className="right-4 text-teal-500 empty:hidden dark:text-teal-300">
                        {props.publication.doi}
                    </span>
                </div>
            </div>
            {divider}
            <div className="flex flex-grow basis-1/5 flex-col items-start pt-4 sm:px-5 sm:pt-0">
                <p className="flex flex-col gap-2 pb-5 lg:flex-row lg:items-center">
                    <span className="flex items-center gap-2 font-bold text-pink-500 dark:text-pink-300">
                        <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem]" />
                        Draft
                    </span>
                    {draftExistsWithPermission && (
                        <span>
                            {latestVersion.user.id === props.user.id
                                ? ' (Corresponding Author)'
                                : latestVersion.coAuthors.find((coAuthor) => coAuthor.linkedUser === props.user.id)
                                ? ' (Author)'
                                : latestVersion.coAuthors.find((coAuthor) => coAuthor.email === props.user.email) &&
                                  ' (Invited)'}
                        </span>
                    )}
                </p>
                {draftVersion ? (
                    <div className="flex h-full flex-col justify-between">
                        <p>
                            Last updated on{' '}
                            <time suppressHydrationWarning>{Helpers.formatDate(draftVersion.updatedAt)}</time>
                        </p>
                        <p className="flex-grow pb-5">
                            Status: {Helpers.getPublicationStatusByAuthor(draftVersion, props.user)}
                        </p>
                        {props.user.id !== draftVersion.user.id ? (
                            draftVersion.coAuthors.some(
                                (coAuthor) => coAuthor.email === props.user.email && !coAuthor.linkedUser
                            ) ? (
                                <>
                                    <p>
                                        <Components.Link
                                            href={`${Config.urls.viewUser.path}/${draftVersion.user.id}`}
                                            className="underline"
                                        >
                                            {draftVersion.user.firstName.substring(0, 1)}. {draftVersion.user.lastName}
                                        </Components.Link>{' '}
                                        has created a new draft version. You will need to confirm your involvement to
                                        access it.
                                    </p>
                                    <Components.Button
                                        href={`/author-link?email=${props.user.email}&publicationId=${props.publication.id}&versionId=${draftVersion.id}&approve=true`}
                                        title="Confirm Involvement"
                                        className="mt-5 w-fit bg-green-600 px-3 text-white-50 children:border-none children:text-white-50"
                                    />
                                </>
                            ) : (
                                <>
                                    <p>
                                        <Components.Link
                                            href={`${Config.urls.viewUser.path}/${draftVersion.user.id}`}
                                            className="underline"
                                        >
                                            {draftVersion.user.firstName.substring(0, 1)}. {draftVersion.user.lastName}
                                        </Components.Link>{' '}
                                        is working on a new draft version
                                    </p>
                                    {viewDraftButton}
                                    {requestControl}
                                </>
                            )
                        ) : draftVersion.currentStatus === 'LOCKED' ? (
                            viewDraftButton
                        ) : (
                            <Components.Button
                                href={`/publications/${props.publication.id}/edit?step=0`}
                                endIcon={<OutlineIcons.PencilSquareIcon className="h-4" />}
                                title="Edit Draft"
                                className="mt-5 w-fit bg-green-600 px-3 text-white-50 children:border-none children:text-white-50"
                            />
                        )}
                    </div>
                ) : props.publication.type === 'PEER_REVIEW' ? (
                    <p>Peer reviews cannot be reversioned</p>
                ) : isAuthorOnLatestLive ? (
                    draftExistsWithoutPermission ? (
                        <div className="flex h-full flex-col justify-between">
                            <p>Someone else is working on a new draft version, and you do not yet have access to it.</p>
                            {requestControl}
                        </div>
                    ) : (
                        <>
                            <p className="flex-grow pb-5">New draft not created</p>
                            {newVersionError && (
                                <Components.Alert severity="ERROR" title={newVersionError} className="mt-4" />
                            )}
                            <Components.Button
                                disabled={loadingNewVersion}
                                title="Create Draft Version"
                                onClick={handleCreateNewVersion}
                                endIcon={<OutlineIcons.PencilSquareIcon className="h-4" />}
                                className="mt-5 bg-green-600 px-3 text-white-50 children:border-none children:text-white-50"
                            />
                        </>
                    )
                ) : (
                    <p>You do not have permission to create draft versions of this publication</p>
                )}
            </div>
            {divider}
            <div className="flex flex-grow basis-1/5 flex-col items-start pt-4 sm:pl-5 sm:pt-0">
                <p className="pb-5 font-bold text-pink-500 dark:text-pink-300">Published</p>
                {latestLiveVersion ? (
                    <>
                        <div className="flex-grow">
                            <p>
                                Published on{' '}
                                <time suppressHydrationWarning>
                                    {latestLiveVersion.publishedDate &&
                                        Helpers.formatDate(latestLiveVersion.publishedDate)}
                                </time>
                            </p>
                            {!isAuthorOnLatestLive && (
                                <p>You are not listed as an author on the latest published version</p>
                            )}
                        </div>
                        <Components.Button
                            href={`/publications/${props.publication.id}`}
                            endIcon={<OutlineIcons.ArrowTopRightOnSquareIcon className="h-4" />}
                            title="View"
                            className="mt-5 bg-teal-500 px-3 text-white-50 children:border-none children:text-white-50"
                        />
                    </>
                ) : (
                    <p>Never published</p>
                )}
            </div>
        </li>
    );
};

export default SimpleResult;
