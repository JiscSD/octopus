import React, { useCallback } from 'react';
import useSWR from 'swr';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as api from '@api';

/**
 * @description Edit affiliations
 */
const Affiliations: React.FC = (): React.ReactElement => {
    const { user } = Stores.useAuthStore();
    const publicationVersion = Stores.usePublicationCreationStore((state) => state.publicationVersion);
    const updateAuthorAffiliations = Stores.usePublicationCreationStore((state) => state.updateAuthorAffiliations);
    const updateIsIndependentAuthor = Stores.usePublicationCreationStore((state) => state.updateIsIndependentAuthor);
    const correspondingAuthor = publicationVersion.coAuthors.find(
        (author) => author.linkedUser === publicationVersion.createdBy
    );

    const {
        data: orcidAffiliations = [],
        isValidating,
        error
    } = useSWR<Interfaces.MappedOrcidAffiliation[]>('/orcid-affiliations');

    useSWR(
        isValidating || error
            ? null
            : `${Config.endpoints.publicationVersions}/${publicationVersion.id}/my-affiliations`,
        (url) => {
            const updatedAuthorAffiliations = orcidAffiliations.filter((affiliation) =>
                correspondingAuthor?.affiliations.some(({ id }) => affiliation.id === id)
            );

            try {
                if (JSON.stringify(correspondingAuthor?.affiliations) === JSON.stringify(updatedAuthorAffiliations)) {
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
                { affiliations: updatedAuthorAffiliations, isIndependent: correspondingAuthor?.isIndependent },
                user?.token
            ).catch((err) => {
                console.log(err);
            });
        }
    );

    return (
        <div className="space-y-12 text-grey-800 dark:text-white-50 2xl:space-y-16">
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
                    Please note that any other authors will be given the opportunity to add their own affiliations
                    later.
                </p>
            </div>

            <Components.AuthorAffiliations
                loading={isValidating && !orcidAffiliations.length}
                scrollHeight={700}
                isIndependentAuthor={correspondingAuthor?.isIndependent || false}
                availableAffiliations={orcidAffiliations}
                selectedAffiliations={correspondingAuthor?.affiliations || []}
                onSelectionChange={updateAuthorAffiliations}
                onIndependentAuthorChange={updateIsIndependentAuthor}
            />
        </div>
    );
};

export default Affiliations;
