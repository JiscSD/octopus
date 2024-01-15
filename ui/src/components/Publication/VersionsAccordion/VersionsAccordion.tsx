import React, { useEffect, useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';
import * as Components from '@/components';
import * as Framer from 'framer-motion';
import * as Hooks from '@/hooks';
import * as Config from '@/config';
import * as Stores from '@/stores';

type Props = {
    id?: string;
    versions: Types.PartialPublicationVersion[];
    selectedVersion: Interfaces.PublicationVersion;
    controlRequests: Interfaces.ControlRequest[];
    onServerError: (errorMessage: string) => void;
    onUnlockPublication: () => Promise<void>;
};

const VersionsAccordion: React.FC<Props> = (props) => {
    const [expanded, setExpanded] = useState(true);
    const { user } = Stores.useAuthStore();
    const { handleControlRequest, controlRequestError } = Hooks.useControlRequest(props.selectedVersion.versionOf);
    const { handleCreateNewVersion, loadingNewVersion, newVersionError } = Hooks.useCreateNewVersion(
        props.selectedVersion.versionOf
    );

    useEffect(() => props.onServerError(controlRequestError), [controlRequestError, props]);
    useEffect(() => props.onServerError(newVersionError), [newVersionError, props]);

    const isAuthorOnLatestLiveVersion = props.versions.some(
        (version) => version.isLatestLiveVersion && version.coAuthors.some((author) => author.linkedUser === user?.id)
    );
    const latestVersion = props.versions.find((version) => version.isLatestVersion);
    const canCreateNewVersion = isAuthorOnLatestLiveVersion && (latestVersion?.isLatestLiveVersion || false);
    const canRequestControl =
        isAuthorOnLatestLiveVersion && !canCreateNewVersion && latestVersion?.createdBy !== user?.id;
    const hasAlreadyRequestedControl = props.controlRequests.some(
        (request) => request.data.publicationVersion.versionOf === props.selectedVersion.versionOf
    );
    const canEditDraft = Boolean(
        latestVersion && !latestVersion.isLatestLiveVersion && latestVersion.createdBy === user?.id
    );

    return (
        <Framer.AnimatePresence>
            <Framer.motion.div
                id={props.id}
                key={props.id}
                className="border-grey rounded shadow transition-colors duration-500 dark:bg-grey-900"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
            >
                <Components.Button
                    title="Versions"
                    className={`w-full justify-between bg-grey-50 px-6 py-1 font-inter transition-all duration-300 children:border-0 dark:bg-grey-700 ${
                        expanded ? 'rounded-none rounded-t' : ''
                    }`}
                    endIcon={
                        <OutlineIcons.ChevronDownIcon
                            className={`w-4 transition-transform duration-300 dark:text-white-50 ${
                                expanded ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    }
                    onClick={() => setExpanded((prevState) => !prevState)}
                >
                    Versions
                </Components.Button>

                <Framer.AnimatePresence>
                    {expanded && (
                        <Framer.motion.div
                            key="versions-accordion-items"
                            className="overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                        >
                            <div className="space-y-3 px-6 py-4">
                                {canEditDraft &&
                                    (latestVersion?.currentStatus === 'LOCKED' ? (
                                        <Components.Link
                                            title="Edit Draft"
                                            className="flex w-fit rounded border-transparent text-sm font-semibold text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                            href={`${Config.urls.viewPublication.path}/${props.selectedVersion.versionOf}/edit?step=0`}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                await props.onUnlockPublication();
                                            }}
                                        >
                                            Edit Draft &nbsp;
                                            <OutlineIcons.PencilSquareIcon className="inline w-4" />
                                        </Components.Link>
                                    ) : (
                                        <Components.Link
                                            title="Edit Draft"
                                            className="flex w-fit rounded border-transparent text-sm font-semibold text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                            href={`${Config.urls.viewPublication.path}/${props.selectedVersion.versionOf}/edit?step=0`}
                                        >
                                            Edit Draft &nbsp;
                                            <OutlineIcons.PencilSquareIcon className="inline w-4" />
                                        </Components.Link>
                                    ))}

                                {canCreateNewVersion && (
                                    <Components.Link
                                        title="Create new version"
                                        className={`flex w-fit rounded border-transparent text-sm font-semibold capitalize text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400 ${
                                            loadingNewVersion ? 'cursor-not-allowed' : ''
                                        }`}
                                        href="#"
                                        onClick={handleCreateNewVersion}
                                    >
                                        Create new version &nbsp;
                                        <OutlineIcons.PencilSquareIcon className="inline w-4" />
                                    </Components.Link>
                                )}

                                {canRequestControl && !hasAlreadyRequestedControl && (
                                    <Components.Link
                                        title="Take over editing"
                                        className="flex w-fit rounded border-transparent text-sm font-semibold text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                        href="#"
                                        onClick={handleControlRequest}
                                    >
                                        Take over editing &nbsp;
                                        <OutlineIcons.PencilSquareIcon className="inline w-4" />
                                    </Components.Link>
                                )}

                                {isAuthorOnLatestLiveVersion && !latestVersion && (
                                    <p className="text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                        Version {props.versions.length + 1}: Currently being edited
                                    </p>
                                )}

                                {props.versions
                                    .sort((version1, version2) => version2.versionNumber - version1.versionNumber)
                                    .map((version) =>
                                        version.id === props.selectedVersion.id ? (
                                            <p
                                                key={version.id}
                                                className="text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100"
                                            >
                                                Version {version.versionNumber}: Currently viewed
                                            </p>
                                        ) : (
                                            <Components.Link
                                                key={version.id}
                                                className="flex w-fit rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                                                href={`/publications/${version.versionOf}/versions/${version.versionNumber}`}
                                            >
                                                Version {version.versionNumber}:{' '}
                                                {version.publishedDate
                                                    ? new Date(version.publishedDate).toLocaleDateString()
                                                    : 'Draft'}
                                            </Components.Link>
                                        )
                                    )}
                            </div>
                        </Framer.motion.div>
                    )}
                </Framer.AnimatePresence>
            </Framer.motion.div>
        </Framer.AnimatePresence>
    );
};

export default VersionsAccordion;
