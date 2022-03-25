import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

/**
 * @description Edit Licence, COI & soon to be description & keywords
 */
const StepThree: React.FC = (): React.ReactElement => {
    const conflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestStatus
    );
    const updateConflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateConflictOfInterestStatus
    );
    const conflictOfInterestText = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestText
    );
    const updateConflictOfInterestText = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateConflictOfInterestText
    );
    const licence: Types.LicenceType = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.licence
    );
    const updateLicence = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateLicence
    );

    const [showLicenceDetails, setShowLicenceDetails] = React.useState(true);

    return (
        <div className="mb-6 space-y-12 lg:mb-10">
            <div className="border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <Components.PublicationCreationStepTitle text="Creative commons licence" />
                <div className="items-center lg:flex">
                    <select
                        id="licence"
                        name="publicationType"
                        value={licence}
                        onChange={(e) => updateLicence(e.target.value as Types.LicenceType)}
                        className="mb-4 block w-fit rounded-md border border-teal-500 bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 lg:mb-0"
                        required
                    >
                        {Object.values(Config.values.octopusInformation.licences).map((type) => (
                            <option key={type.value} value={type.value}>
                                {Config.values.octopusInformation.licences[type.value].nicename}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowLicenceDetails((prevState) => !prevState)}
                        className="rounded bg-teal-500 px-3 py-1 text-xs font-medium text-white-50 outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed lg:ml-8"
                    >
                        {showLicenceDetails ? 'Hide licence information' : 'Not sure which licence to choose?'}
                    </button>
                </div>
                {showLicenceDetails && (
                    <Framer.motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-grey-800 transition-colors duration-500 dark:text-white-50"
                    >
                        <div className="mt-8">
                            <Components.Link
                                href={Config.values.octopusInformation.licences[licence].link}
                                openNew={true}
                                className="mb-2 block w-fit rounded underline decoration-teal-500 decoration-2 underline-offset-2 outline-0 hover:decoration-teal-600 focus:ring-2 focus:ring-yellow-400"
                            >
                                <strong>{Config.values.octopusInformation.licences[licence].nicename}</strong>
                            </Components.Link>
                            <span className="block text-sm lg:w-10/12">
                                {Config.values.octopusInformation.licences[licence].description}
                            </span>
                        </div>
                    </Framer.motion.div>
                )}
            </div>
            <div className="pb-16 transition-colors duration-500 dark:border-grey-700">
                <div className="mb-6">
                    <Components.PublicationCreationStepTitle text="Do this publication have a conflict of interest?" />
                    {conflictOfInterestStatus && (
                        <label
                            htmlFor="conflictOfInterestStatus"
                            className="block text-xs text-grey-800 transition-colors duration-500 dark:text-white-50"
                        >
                            You must specify a reason for the conflict of interest
                        </label>
                    )}
                </div>

                <label htmlFor="conflictOfInterestStatus" className="mb-6 flex items-center">
                    <input
                        required
                        id="conflictOfInterestStatus"
                        name="conflictOfInterestStatus"
                        type="checkbox"
                        checked={conflictOfInterestStatus}
                        onChange={(e) => updateConflictOfInterestStatus(e.target.checked)}
                        className="rounded-sm border border-teal-500 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    />
                    <span className="ml-2 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                        This publication <strong>does</strong> have a conflict of interest.
                    </span>
                </label>
                {conflictOfInterestStatus && (
                    <textarea
                        id="conflictOfInterestStatus"
                        name="conflictOfInterestStatus"
                        value={conflictOfInterestText}
                        rows={6}
                        onChange={(e) => updateConflictOfInterestText(e.target.value)}
                        className="w-full rounded border border-teal-500 bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 dark:text-white-50"
                        required
                    />
                )}
            </div>
        </div>
    );
};

export default StepThree;
