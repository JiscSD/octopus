import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

/**
 * @description Edit title
 */
const KeyInformation: React.FC = (): React.ReactElement => {
    const title = Stores.usePublicationCreationStore((state) => state.title);
    const updateTitle = Stores.usePublicationCreationStore((state) => state.updateTitle);
    const licence: Types.LicenceType = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.licence
    );
    const updateLicence = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateLicence
    );

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <label id="title-label">
                    <Components.PublicationCreationStepTitle text="Title" required />
                </label>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Titles should be concise, specific, and informative to help others find your work.
                </span>
                <input
                    aria-labelledby="title-label"
                    required
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400"
                />
            </div>
            <div>
                <label id="cc-licence-label">
                    <Components.PublicationCreationStepTitle text="Creative commons licence" required />
                </label>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    You retain the copyright to your work, and can choose what licence you would like to assign it.
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Please note that your licence must allow derivative works, to support current and expected
                    functionality on the site (e.g. translation).
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Contact the Octopus team at{' '}
                    <Components.Link
                        href="mailto:help@jisc.ac.uk"
                        openNew={true}
                        className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                    >
                        help@jisc.ac.uk
                    </Components.Link>{' '}
                    if you would like to use a license that isn&apos;t listed.
                </span>
                <div className="items-center lg:flex">
                    <select
                        aria-labelledby='cc-licence-label'
                        id="licence"
                        name="publicationType"
                        value={licence}
                        onChange={(e) => updateLicence(e.target.value as Types.LicenceType)}
                        className="mb-4 block w-1/2 rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400 lg:mb-0"
                        required
                    >
                        {Object.values(Config.values.octopusInformation.licences).map((type) => (
                            <option key={type.value} value={type.value}>
                                {Config.values.octopusInformation.licences[type.value].nicename}
                            </option>
                        ))}
                    </select>
                </div>
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
                            <strong>{Config.values.octopusInformation.licences[licence].fullName}</strong>
                        </Components.Link>
                        <span className="mb-2 block text-sm lg:w-10/12">
                            {Config.values.octopusInformation.licences[licence].description}
                        </span>
                        <span className="block text-sm lg:w-10/12">
                            View all{' '}
                            <Components.Link
                                href="https://creativecommons.org/about/cclicenses/"
                                openNew
                                className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                            >
                                Creative Commons licenses
                            </Components.Link>
                            .
                        </span>
                    </div>
                    <div className="mt-12">
                        <div className="mb-10">
                            <Components.PublicationCreationStepTitle text="Affiliated Organisations" />
                            <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                Please enter the details for any organisations this publication is associated with.
                                Please note that funding sources are added later in the publication form.
                            </span>
                            <Components.Button
                                title="Search for your organisation's ROR"
                                link
                                href="https://ror.org/"
                                iconPosition="RIGHT"
                                icon={
                                    <OutlineIcons.SearchIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                }
                            />
                        </div>
                        <Components.RORForm type="affiliations" />
                    </div>
                </Framer.motion.div>
            </div>
        </div>
    );
};

export default KeyInformation;
