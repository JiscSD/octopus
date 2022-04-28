import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';

const DelclarationsAndStatements: React.FC = (): React.ReactElement => {
    const ethicalStatement = Stores.usePublicationCreationStore((state) => state.ethicalStatement);
    const updateEthicalStatement = Stores.usePublicationCreationStore((state) => state.updateEthicalStatement);
    const ethicalStatementFreeText = Stores.usePublicationCreationStore((state) => state.ethicalStatementFreeText);
    const updateEthicalStatementFreeText = Stores.usePublicationCreationStore(
        (state) => state.updateEthicalStatementFreeText
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Ethical statement" />
                <fieldset className="my-8 space-y-2">
                    <label htmlFor="1" className="flex items-center space-x-2 hover:cursor-pointer">
                        <input
                            type="radio"
                            name="1"
                            id="1"
                            checked={ethicalStatement === 1}
                            onChange={() => updateEthicalStatement(1)}
                            className="hover:cursor-pointer"
                            aria-label="The results and data in this publication involved human or animal subjects."
                        />
                        <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">
                            The results and data in this publication involved human or animal subjects.{' '}
                        </span>
                    </label>
                    <label htmlFor="2" className="flex items-center space-x-2 hover:cursor-pointer">
                        <input
                            type="radio"
                            name="2"
                            id="2"
                            checked={ethicalStatement === 2}
                            onChange={() => updateEthicalStatement(2)}
                            className="hover:cursor-pointer"
                            aria-label="The results and data in this publication does not involve human or animal subjects."
                        />
                        <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">
                            The results and data in this publication does not involve human or animal subjects.{' '}
                        </span>
                    </label>
                </fieldset>

                <div className="mt-8">
                    <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                        Optional: Ethical approval for the data collection and sharing was given by:
                    </span>
                    <span className="mb-2 block text-xs leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                        You may wish to link to a copy of the approval letter from your ethical committee.
                    </span>
                    <textarea
                        name="freeText"
                        id="freeText"
                        rows={3}
                        className="w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                        required
                        value={ethicalStatementFreeText}
                        onChange={(e) => updateEthicalStatementFreeText(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default DelclarationsAndStatements;
