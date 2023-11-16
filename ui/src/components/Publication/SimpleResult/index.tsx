import React, { useMemo } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Components from '@components';
import * as api from '@api';
import * as Config from '@config';
import axios from 'axios';
import { useRouter } from 'next/router';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    user: Interfaces.User;
    canCreateNewVersion?: boolean;
    canEditNewVersion?: boolean;
};

const SimpleResult: React.FC<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const status = useMemo(
        () => Helpers.getPublicationStatusByAuthor(props.publicationVersion, props.user),
        [props.publicationVersion, props.user]
    );

    const handleCreateNewVersion = React.useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            e.preventDefault();
            setError('');
            setLoading(true);

            try {
                // create new version
                await api.post(
                    `${Config.endpoints.publications}/${props.publicationVersion.versionOf}/publication-versions`,
                    {},
                    Helpers.getJWT()
                );

                // redirect user to the edit page
                await router.push(`/publications/${props.publicationVersion.versionOf}/edit?step=0`);
            } catch (error) {
                console.log(error);
                setError(axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message);
            }

            setLoading(false);
        },
        [props.publicationVersion.versionOf, router]
    );

    const handleEditDraftVersion = React.useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            e.preventDefault();
            // redirect user to the edit page
            await router.push(`/publications/${props.publicationVersion.versionOf}/edit?step=0`);
        },
        [props.publicationVersion.versionOf, router]
    );

    return (
        <div className="w-full rounded border border-transparent bg-white-50 p-3 text-sm shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:shadow-none sm:text-base">
            <div className="flex justify-between gap-2">
                <div className="flex w-fit flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:gap-2">
                    <span
                        className={`${
                            status === 'Live'
                                ? 'text-teal-500 dark:text-teal-300'
                                : 'text-purple-500 dark:text-purple-300'
                        } flex items-center gap-2 font-semibold leading-3 transition-colors duration-500`}
                    >
                        {status === 'Live' ? (
                            <OutlineIcons.ArrowTopRightOnSquareIcon className="inline h-4 min-w-[1rem] leading-3" />
                        ) : (
                            <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem] leading-3" />
                        )}

                        {status}
                    </span>
                    {props.user.id === props.publicationVersion.createdBy && (
                        <span className="leading-tight text-green-700 dark:text-green-300">(Corresponding Author)</span>
                    )}
                    <span className="leading-3 text-pink-500 ">
                        {Helpers.formatPublicationType(props.publicationVersion.publication.type)}
                    </span>
                    {props.publicationVersion.publishedDate ? (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Published:{' '}
                            <time suppressHydrationWarning>
                                {Helpers.formatDate(props.publicationVersion.publishedDate)}
                            </time>
                        </span>
                    ) : (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Last updated:{' '}
                            <time suppressHydrationWarning>
                                {Helpers.formatDate(props.publicationVersion.updatedAt)}
                            </time>
                        </span>
                    )}
                </div>
                <span className="right-4 text-xs text-teal-500 empty:hidden">
                    {props.publicationVersion.publication.doi}
                </span>
            </div>
            <div className={`mt-2 flex gap-4 ${error ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                <p className="flex-1 font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {props.publicationVersion.title}
                </p>

                {
                    /**
                     * @TODO - remove stage check when ready to go in production
                     */

                    ['local', 'int'].includes(process.env.NEXT_PUBLIC_STAGE!) && status === 'Live' && (
                        <>
                            {error && <Components.Alert severity="ERROR" title={error} />}
                            {props.canCreateNewVersion && (
                                <Components.Button
                                    disabled={loading}
                                    title="Create new version"
                                    className="self-end children:border-0 children:py-0 children:text-teal-500 children:dark:text-teal-300"
                                    endIcon={
                                        <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem] leading-3" />
                                    }
                                    onClick={handleCreateNewVersion}
                                >
                                    Create new version
                                </Components.Button>
                            )}
                            {props.canEditNewVersion && (
                                <Components.Button
                                    disabled={loading}
                                    title="Edit draft version"
                                    className="self-end children:border-0 children:py-0 children:text-teal-500 children:dark:text-teal-300"
                                    endIcon={
                                        <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem] leading-3" />
                                    }
                                    onClick={handleEditDraftVersion}
                                >
                                    Edit draft version
                                </Components.Button>
                            )}
                            {!props.canCreateNewVersion && !props.canEditNewVersion && (
                                <Components.Alert
                                    className="sm:mt-2"
                                    severity="INFO"
                                    title="New version being edited."
                                />
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default SimpleResult;
