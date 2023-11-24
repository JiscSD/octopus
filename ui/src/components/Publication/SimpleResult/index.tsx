import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Components from '@components';
import * as api from '@api';
import * as Config from '@config';
import axios from 'axios';
import { useRouter } from 'next/router';

type Props = {
    publication: Interfaces.PublicationWithVersions;
    user: Interfaces.User;
    canCreateNewVersion?: boolean;
    canEditNewVersion?: boolean;
};

const SimpleResult: React.FC<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const latestLiveVersion = props.publication.versions.find((version) => version.isLatestLiveVersion);
    const authorOnLatestLive =
        latestLiveVersion?.coAuthors.find((coAuthor) => coAuthor.linkedUser === props.user.id) ||
        latestLiveVersion?.createdBy === props.user.id;
    const latestVersion = props.publication.versions.find((version) => version.isLatestVersion);
    const draftExistsWithPermission =
        latestVersion?.currentStatus === 'DRAFT' || latestVersion?.currentStatus === 'LOCKED';
    const draftVersion = draftExistsWithPermission ? latestVersion : false;
    const draftExistsWithoutPermission = !draftExistsWithPermission && !latestLiveVersion?.isLatestVersion;

    const handleCreateNewVersion = React.useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            setError('');
            setLoading(true);

            try {
                // create new version
                await api.post(
                    `${Config.endpoints.publications}/${props.publication.id}/publication-versions`,
                    {},
                    Helpers.getJWT()
                );

                // redirect user to the edit page
                await router.push(`/publications/${props.publication.id}/edit?step=0`);
            } catch (error) {
                console.log(error);
                setError(axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message);
            }

            setLoading(false);
        },
        [props.publication.id, router]
    );

    const divider = <span className="border-b border-grey-300 pt-4 dark:border-teal-500 sm:border-r sm:pb-4" />;
    const publishedVersionCount = props.publication.versions.filter(
        (version) => version.currentStatus === 'LIVE'
    ).length;

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
                    <span className="flex items-center gap-2 font-bold leading-3 text-pink-500 dark:text-pink-300">
                        <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem]" />
                        Draft
                    </span>
                    {draftExistsWithPermission && (
                        <span>
                            {latestVersion.user.id === props.user.id
                                ? ' (Corresponding Author)'
                                : latestVersion.coAuthors.find((coAuthor) => coAuthor.linkedUser === props.user.id) &&
                                  ' (Author)'}
                        </span>
                    )}
                </p>
                {draftVersion ? (
                    <>
                        <p>
                            Last updated:{' '}
                            <time suppressHydrationWarning>{Helpers.formatDate(draftVersion.updatedAt)}</time>
                        </p>
                        <p className="flex-grow pb-5">
                            Status: {Helpers.getPublicationStatusByAuthor(draftVersion, props.user)}
                        </p>
                        {draftVersion.currentStatus === 'DRAFT' ? (
                            props.user.id === draftVersion.user.id ? (
                                <Components.Button
                                    href={`/publications/${props.publication.id}/edit?step=0`}
                                    endIcon={<OutlineIcons.PencilSquareIcon className="h-4" />}
                                    title="Edit Draft"
                                    className="mt-5 bg-green-600 px-3 text-white-50"
                                    childClasses="text-white-50 border-none"
                                />
                            ) : (
                                <p>
                                    <Components.Link
                                        href={`${Config.urls.viewUser.path}/${draftVersion.user.id}`}
                                        className="underline"
                                    >
                                        {draftVersion.user.firstName.substring(0, 1)}. {draftVersion.user.lastName}
                                    </Components.Link>{' '}
                                    has created a new draft version
                                </p>
                            )
                        ) : (
                            <Components.Button
                                href={`/publications/${props.publication.id}`}
                                endIcon={<OutlineIcons.EyeIcon className="h-4" />}
                                title="View Draft"
                                className="mt-5 bg-green-600 px-3 text-white-50"
                                childClasses="text-white-50 border-none"
                            />
                        )}
                    </>
                ) : authorOnLatestLive ? (
                    draftExistsWithoutPermission ? (
                        <p>Someone else has created a new draft version, and you do not yet have access to it</p>
                    ) : (
                        <>
                            <p className="flex-grow pb-5">New draft not created</p>
                            <Components.Button
                                disabled={loading}
                                title="Create Draft Version"
                                onClick={handleCreateNewVersion}
                                endIcon={<OutlineIcons.PencilSquareIcon className="h-4" />}
                                className="mt-5 bg-green-600 px-3 text-white-50"
                                childClasses="text-white-50 border-none"
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
                                Published on:{' '}
                                <time suppressHydrationWarning>
                                    {latestLiveVersion.publishedDate &&
                                        Helpers.formatDate(latestLiveVersion.publishedDate)}
                                </time>
                            </p>
                            {!authorOnLatestLive && <p>You are not listed as an author on the latest version</p>}
                        </div>
                        <Components.Button
                            href={`/publications/${props.publication.id}`}
                            endIcon={<OutlineIcons.ArrowTopRightOnSquareIcon className="h-4" />}
                            title="View"
                            className="mt-5 bg-teal-500 px-3 text-white-50"
                            childClasses="text-white-50 border-none"
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
