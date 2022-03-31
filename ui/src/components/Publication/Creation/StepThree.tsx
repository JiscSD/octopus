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
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <div className="mb-6">
                    <Components.PublicationCreationStepTitle text="Does this publication have any conflicts of interest?" />
                </div>
                {/* <label htmlFor="conflictOfInterestStatus" className="mb-6 flex items-center">
                    <input
                        required
                        id="conflictOfInterestStatus"
                        name="conflictOfInterestStatus"
                        type="checkbox"
                        checked={!conflictOfInterestStatus}
                        onChange={(e) => updateConflictOfInterestStatus(!e.target.checked)}
                        className="rounded-sm border border-grey-100 shadow outline-0  focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                    />
                    <span className="ml-2 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                        This publication <strong>does not</strong> have a conflict of interest.
                    </span>
                </label> */}
                <fieldset className="mb-2 space-x-6">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="coi"
                            value="true"
                            checked={conflictOfInterestStatus}
                            id="coi-true"
                            onChange={() => updateConflictOfInterestStatus(true)}
                        />
                        <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">
                            Yes
                        </span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="coi"
                            value="false"
                            checked={!conflictOfInterestStatus}
                            id="coi-false"
                            onChange={() => updateConflictOfInterestStatus(false)}
                        />
                        <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">No</span>
                    </label>
                </fieldset>

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
                            className="w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                            required
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default StepThree;
