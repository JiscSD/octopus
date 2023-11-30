import React from 'react';

import * as Components from '@components';

import * as Stores from '@stores';
import * as Types from '@types';

/**
 * @description Edit conflict of interest status
 */
const ConflictOfInterest: React.FC = (): React.ReactElement => {
    const { publicationVersion, updatePublicationVersion } = Stores.usePublicationCreationStore();

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <div className="mb-6">
                    <Components.PublicationCreationStepTitle
                        text="Does this publication have any conflicts of interest?"
                        required
                    />
                </div>

                <fieldset className="mb-2 space-x-6">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="coi"
                            value="true"
                            id="coi-true"
                            checked={publicationVersion.conflictOfInterestStatus === true}
                            onChange={() =>
                                updatePublicationVersion({ ...publicationVersion, conflictOfInterestStatus: true })
                            }
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
                            id="coi-false"
                            checked={publicationVersion.conflictOfInterestStatus === false}
                            onChange={() => {
                                updatePublicationVersion({
                                    ...publicationVersion,
                                    conflictOfInterestStatus: false,
                                    conflictOfInterestText: ''
                                });
                            }}
                        />
                        <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">No</span>
                    </label>
                </fieldset>

                {publicationVersion.conflictOfInterestStatus && (
                    <>
                        <label
                            htmlFor="conflictOfInterestStatus"
                            className="mb-4 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50"
                        >
                            Please detail any conflicts of interest related to this publication.
                        </label>
                        <textarea
                            id="conflictOfInterestStatus"
                            name="conflictOfInterestStatus"
                            value={publicationVersion.conflictOfInterestText || ''}
                            rows={6}
                            onChange={(e) =>
                                updatePublicationVersion({
                                    ...publicationVersion,
                                    conflictOfInterestText: e.target.value
                                })
                            }
                            className="w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                            required
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ConflictOfInterest;
