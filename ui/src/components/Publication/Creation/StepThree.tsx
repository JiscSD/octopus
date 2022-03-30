import React from 'react';

import * as Components from '@components';

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

    return (
        <div className="mb-6 space-y-12 lg:mb-10">
            <div className="pb-16 transition-colors duration-500 dark:border-grey-700">
                <div className="mb-6">
                    <Components.PublicationCreationStepTitle text="Do this publication have a conflict of interest?" />
                </div>

                <label htmlFor="conflictOfInterestStatus" className="mb-6 flex items-center">
                    <input
                        required
                        id="conflictOfInterestStatus"
                        name="conflictOfInterestStatus"
                        type="checkbox"
                        checked={!conflictOfInterestStatus}
                        onChange={(e) => updateConflictOfInterestStatus(!e.target.checked)}
                        className="rounded-sm border border-teal-500 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    />
                    <span className="ml-2 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                        This publication <strong>does not</strong> have a conflict of interest.
                    </span>
                </label>

                {conflictOfInterestStatus && (
                    <>
                        <label
                            htmlFor="conflictOfInterestStatus"
                            className="mb-4 block text-xs text-grey-800 transition-colors duration-500 dark:text-white-50"
                        >
                            You must specify a reason for the conflict of interest
                        </label>
                        <textarea
                            id="conflictOfInterestStatus"
                            name="conflictOfInterestStatus"
                            value={conflictOfInterestText}
                            rows={6}
                            onChange={(e) => updateConflictOfInterestText(e.target.value)}
                            className="w-full rounded border border-teal-500 bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 dark:text-white-50"
                            required
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default StepThree;
