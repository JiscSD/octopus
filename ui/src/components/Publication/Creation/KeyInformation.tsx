import React from 'react';
import * as Framer from 'framer-motion';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

/**
 * @description Edit title
 */
const KeyInformation: React.FC = (): React.ReactElement => {
    const { title, updateTitle } = Stores.usePublicationCreationStore();

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <label htmlFor="title-label" id="title-label">
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
                <label htmlFor="cc-license-label" id="cc-license-label">
                    <Components.PublicationCreationStepTitle text="Creative commons license" />
                </label>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                    Your publication will use a CC BY 4.0 license by default. Contact the Octopus team at{' '}
                    <Components.Link
                        href="mailto:help@jisc.ac.uk"
                        openNew={true}
                        className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                    >
                        help@jisc.ac.uk
                    </Components.Link>{' '}
                    if you would like to discuss using a different license type.
                </span>
                <Framer.motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-grey-800 transition-colors duration-500 dark:text-white-50"
                >
                    <div className="mt-8">
                        <Components.Link
                            href={Config.values.octopusInformation.licences.CC_BY.link}
                            openNew={true}
                            className="mb-2 block w-fit rounded underline decoration-teal-500 decoration-2 underline-offset-2 outline-0 hover:decoration-teal-600 focus:ring-2 focus:ring-yellow-400"
                        >
                            <strong>{Config.values.octopusInformation.licences.CC_BY.fullName}</strong>
                        </Components.Link>
                        <span className="mb-2 block text-sm lg:w-10/12">
                            {Config.values.octopusInformation.licences.CC_BY.description}
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
                </Framer.motion.div>
            </div>
        </div>
    );
};

export default KeyInformation;
