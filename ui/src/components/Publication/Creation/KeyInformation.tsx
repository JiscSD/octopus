import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as Interfaces from '@interfaces';
import * as api from '@api';

/**
 * @description Edit title
 */
const KeyInformation: React.FC = (): React.ReactElement => {
    const {
        id,
        title,
        updateTitle,
        licence,
        updateLicence,
        authorAffiliations,
        updateAuthorAffiliations,
        isIndependentAuthor,
        updateIsIndependentAuthor
    } = Stores.usePublicationCreationStore();
    const { user } = Stores.useAuthStore();

    const {
        data: orcidAffiliations = [],
        isValidating,
        error
    } = useSWR<Interfaces.MappedOrcidAffiliation[]>('/orcid-affiliations');

    useSWR(isValidating || error ? null : `${Config.endpoints.publications}/${id}/my-affiliations`, (url) => {
        const updatedAuthorAffiliations = orcidAffiliations.filter((affiliation) =>
            authorAffiliations.some(({ id }) => affiliation.id === id)
        );

        try {
            if (JSON.stringify(authorAffiliations) === JSON.stringify(updatedAuthorAffiliations)) {
                // there's no need for update
                return;
            }
        } catch (error) {
            console.log(error);
        }

        updateAuthorAffiliations(updatedAuthorAffiliations);

        // also update author affiliations in DB
        api.put(
            url,
            { affiliations: updatedAuthorAffiliations, isIndependent: isIndependentAuthor },
            user?.token
        ).catch((err) => {
            console.log(err);
        });
    });

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
                <label htmlFor="cc-licence-label" id="cc-licence-label">
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
                        aria-labelledby="cc-licence-label"
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
                            <Components.PublicationCreationStepTitle text="Add your affiliations" required />
                            <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                The following affiliations are present on{' '}
                                <Components.Link
                                    href={`https://orcid.org/my-orcid?orcid=${user?.orcid}`}
                                    openNew
                                    className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                >
                                    your ORCID® profile
                                </Components.Link>
                                . To add a new affiliation, please enter it on{' '}
                                <Components.Link
                                    href={`https://orcid.org/my-orcid?orcid=${user?.orcid}`}
                                    openNew
                                    className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                >
                                    your ORCID profile
                                </Components.Link>
                                .
                            </p>

                            <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                <Components.Link
                                    href="https://support.orcid.org/hc/en-us/sections/360002054993-Assert-your-affiliations"
                                    openNew
                                    className="text-teal-600 underline transition-colors duration-500 dark:text-teal-400"
                                >
                                    Click here
                                </Components.Link>{' '}
                                to learn more about adding affiliations to ORCID.
                            </p>

                            <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-100">
                                Please note that any other authors will be given the opportunity to add their own
                                affiliations later.
                            </p>
                        </div>

                        <Components.AuthorAffiliations
                            scrollHeight={700}
                            isIndependentAuthor={isIndependentAuthor}
                            availableAffiliations={orcidAffiliations}
                            selectedAffiliations={authorAffiliations}
                            onSelectionChange={updateAuthorAffiliations}
                            onIndependentAuthorChange={updateIsIndependentAuthor}
                        />
                    </div>
                </Framer.motion.div>
            </div>
        </div>
    );
};

export default KeyInformation;
