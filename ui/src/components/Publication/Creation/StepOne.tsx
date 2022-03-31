import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

/**
 * @description Edit title
 */
const StepOne: React.FC = (): React.ReactElement => {
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
                <Components.PublicationCreationStepTitle text="Title" />
                <span className="mb-2 block text-xs leading-snug text-grey-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia placeat delectus soluta mollitia, non
                    provident repudiandae, nobis possimus, id ipsam suscipit.
                </span>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400"
                />
            </div>
            <div>
                <Components.PublicationCreationStepTitle text="Creative commons licence" />
                <div className="items-center lg:flex">
                    <select
                        id="licence"
                        name="publicationType"
                        value={licence}
                        onChange={(e) => updateLicence(e.target.value as Types.LicenceType)}
                        className="mb-4 block w-fit rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 lg:mb-0"
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
                        <span className="block text-sm lg:w-10/12">
                            {Config.values.octopusInformation.licences[licence].description}
                        </span>
                    </div>
                </Framer.motion.div>
            </div>
        </div>
    );
};

export default StepOne;
