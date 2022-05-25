import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';

const dataAccessOptions: string[] = [
    'This publication includes all the relevant results or data collected by the authors',
    'This publication contains a sample of relevant results or data, with the full data publicly stored on another platform',
    'This publication contains partial data because full data contains transcripts of interviews, which were impossible to anonymise or where the participants did not consent to sharing',
    'This publication contains partial data because the raw data contains confidential information, protected by a non-disclosure agreement or copyright (e.g. of digital images, maps, texts, audio-visual material)',
    'This publication contains representative digital data of physical samples or records (e.g. of museum objects, geological samples, tissue samples, images). Relevant accession/reference numbers and associated information of where the originals are stored are provided'
];
const dataPermissionsOptions: string[] = [
    'The results and data in this publication involved access to owned or copyrighted materials',
    'The results and data in this publication does not involve materials access to owned or copyrighted materials (except those in the private ownership of the authors) '
];

const DataStatements: React.FC = (): React.ReactElement => {
    // Ethic statement
    const ethicalStatement = Stores.usePublicationCreationStore((state) => state.ethicalStatement);
    const updateEthicalStatement = Stores.usePublicationCreationStore((state) => state.updateEthicalStatement);
    const ethicalStatementFreeText = Stores.usePublicationCreationStore((state) => state.ethicalStatementFreeText);
    const updateEthicalStatementFreeText = Stores.usePublicationCreationStore(
        (state) => state.updateEthicalStatementFreeText
    );

    // Data access statement
    const dataAccessStatement = Stores.usePublicationCreationStore((state) => state.dataAccessStatement);
    const updateDataAccessStatement = Stores.usePublicationCreationStore((state) => state.updateDataAccessStatement);
    const [dataAccessStatementOther, setDataAccessStatementOther] = React.useState('');

    // Data permissions statement
    const dataPermissionsStatement = Stores.usePublicationCreationStore((state) => state.dataPermissionsStatement);
    const updateDataPermissionsStatement = Stores.usePublicationCreationStore(
        (state) => state.updateDataPermissionsStatemnt
    );
    const dataPermissionsStatementProvidedBy = Stores.usePublicationCreationStore(
        (state) => state.dataPermissionsStatementProvidedBy
    );
    const updateDataPermissionsStatementProvidedBy = Stores.usePublicationCreationStore(
        (state) => state.updateDataPermissionsStatementProvidedBy
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            {/* Ethical statement */}
            <div>
                <Components.PublicationCreationStepTitle text="Ethical statement" required />
                <fieldset className="my-8 space-y-3">
                    <label htmlFor="true" className="flex items-center space-x-2 hover:cursor-pointer">
                        <input
                            type="radio"
                            name="true"
                            id="true"
                            checked={ethicalStatement === true}
                            onChange={() => updateEthicalStatement(true)}
                            className="hover:cursor-pointer"
                            aria-label="The results and data in this publication involved human or animal subjects."
                        />
                        <span className="ml-2 text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                            The results and data in this publication involved human or animal subjects.{' '}
                        </span>
                    </label>
                    <label htmlFor="false" className="flex items-center space-x-2 hover:cursor-pointer">
                        <input
                            type="radio"
                            name="false"
                            id="false"
                            checked={ethicalStatement === false}
                            onChange={() => updateEthicalStatement(false)}
                            className="hover:cursor-pointer"
                            aria-label="The results and data in this publication does not involve human or animal subjects."
                        />
                        <span className="ml-2 text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                            The results and data in this publication does <strong>not</strong> involve human or animal
                            subjects.{' '}
                        </span>
                    </label>
                </fieldset>

                <div className="mt-8">
                    <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                        If relevant: Ethical approval for the data collection and sharing was given by:
                    </span>
                    <span className="mb-2 block text-xs leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                        You may wish to link to a copy of the approval letter from your ethical committee.
                    </span>
                    <textarea
                        name="freeText"
                        id="freeText"
                        rows={3}
                        className="w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 lg:w-2/3"
                        required
                        value={ethicalStatementFreeText ?? ''}
                        onChange={(e) => updateEthicalStatementFreeText(e.target.value)}
                    />
                </div>
            </div>

            {/* Data permissions statement */}
            <div>
                <Components.PublicationCreationStepTitle text="Data permissions statement" required />
                <fieldset className="my-8 space-y-3">
                    {dataPermissionsOptions.map((option) => (
                        <label
                            key={option}
                            htmlFor={option}
                            className="flex items-center space-x-2 hover:cursor-pointer"
                        >
                            <input
                                type="radio"
                                name={option}
                                id={option}
                                checked={option === dataPermissionsStatement}
                                onChange={() => updateDataPermissionsStatement(option)}
                                className="hover:cursor-pointer"
                                aria-label={option}
                            />
                            <span className="ml-2 text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {option}
                            </span>
                        </label>
                    ))}
                </fieldset>

                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Permission for the data collection and sharing was given by <Components.RequiredIndicator />
                </span>
                <textarea
                    name="dataPermissionsStatementProvidedBy"
                    id="dataPermissionsStatementProvidedBy"
                    rows={2}
                    className="w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 lg:w-2/3"
                    required
                    value={dataPermissionsStatementProvidedBy ?? ''}
                    onChange={(e) => updateDataPermissionsStatementProvidedBy(e.target.value)}
                />
            </div>

            {/* Data access statement */}
            <div>
                <Components.PublicationCreationStepTitle text="Data access statement" />
                <span className="block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    If relevant, please provide a data access statement which describes where the results and data
                    associated with your publication can be found, and how they can be accessed.{' '}
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Select from the pre-defined statements below, or create your own. You can provide a link to any
                    publicly accessible datasets in the &apos;Additional materials&apos; field.
                </span>
                <fieldset className="mt-8 mb-4 space-y-3">
                    {dataAccessOptions.map((option) => (
                        <label
                            key={option}
                            htmlFor={option}
                            className="flex items-center space-x-2 hover:cursor-pointer"
                        >
                            <input
                                type="radio"
                                name={option}
                                id={option}
                                checked={option === dataAccessStatement}
                                onChange={() => {
                                    setDataAccessStatementOther('');
                                    updateDataAccessStatement(option);
                                }}
                                className="hover:cursor-pointer"
                                aria-label={option}
                            />
                            <span className="ml-2 text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {option}
                            </span>
                        </label>
                    ))}

                    <label htmlFor="other" className="flex items-start space-x-2 hover:cursor-pointer">
                        <input
                            type="radio"
                            name="other"
                            id="other"
                            checked={dataAccessStatementOther === dataAccessStatement}
                            onChange={() => {
                                setDataAccessStatementOther('');
                                updateDataAccessStatement('');
                            }}
                            className="hover:cursor-pointer"
                            aria-label="other"
                        />
                        <span className="ml-2 text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                            Other
                        </span>
                        <textarea
                            name="dataAccessStatementfreeText"
                            id="dataAccessStatementfreeText"
                            rows={3}
                            className="w-full rounded-md border border-grey-100 bg-white-50 text-sm text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 lg:w-2/3"
                            required
                            value={dataAccessStatementOther ?? ''}
                            placeholder="Please provide your own data access statement."
                            onChange={(e) => {
                                setDataAccessStatementOther(e.target.value);
                                updateDataAccessStatement(e.target.value);
                            }}
                            onFocus={() => updateDataAccessStatement(dataAccessStatementOther)}
                        />
                    </label>
                </fieldset>

                {/* <span className="mb-3 block text-base leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Other
                </span> */}
            </div>
        </div>
    );
};

export default DataStatements;
