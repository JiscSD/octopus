import React, { useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as Components from '@components';
import * as Framer from 'framer-motion';

type Props = {
    versions: Types.PartialPublicationVersion[];
    selectedVersion: Interfaces.PublicationVersion;
};

const VersionsAccordion: React.FC<Props> = (props) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Framer.AnimatePresence>
            <Framer.motion.div
                id="versions-accordion"
                key="versions-accordion"
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

            <Framer.AnimatePresence>
                {/** API will only return versions that the current user has permission to see */}
                {props.versions.length !== props.selectedVersion.versionNumber && (
                    <Framer.motion.p
                        key="info"
                        className="text-sm leading-relaxed dark:text-white-50"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    >
                        <OutlineIcons.ExclamationCircleIcon className="inline w-6 stroke-2 align-bottom text-red-600 dark:text-red-500" />{' '}
                        A newer version of this publication exists
                    </Framer.motion.p>
                )}
            </Framer.AnimatePresence>
        </Framer.AnimatePresence>
    );
};

export default VersionsAccordion;
