import React, { useMemo } from 'react';
import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Outline from '@heroicons/react/24/outline';
import * as Helpers from '@/helpers';

type AuthorAffiliationsProps = {
    className?: string;
    availableAffiliations: Interfaces.MappedOrcidAffiliation[];
    selectedAffiliations: Interfaces.MappedOrcidAffiliation[];
    isIndependentAuthor: boolean;
    scrollHeight: number;
    loading?: boolean;
    onSelectionChange: (selectedAffiliations: Interfaces.MappedOrcidAffiliation[]) => void;
    onIndependentAuthorChange: (isIndependent: boolean) => void;
};

const AuthorAffiliations: React.FC<AuthorAffiliationsProps> = (props) => {
    const handleAddAffiliation = (selectedAffiliation: Interfaces.MappedOrcidAffiliation) =>
        props.onSelectionChange([...props.selectedAffiliations, selectedAffiliation]);

    const handleRemoveAffiliation = (selectedAffiliation: Interfaces.MappedOrcidAffiliation) =>
        props.onSelectionChange(
            props.selectedAffiliations.filter((affiliation) => affiliation.id !== selectedAffiliation.id)
        );

    const filteredAvailableAffiliations = useMemo(
        () =>
            props.availableAffiliations.filter(
                (availableAffiliation) =>
                    !props.selectedAffiliations.some(
                        (selectedAffiliation) => selectedAffiliation.id === availableAffiliation.id
                    )
            ),
        [props.availableAffiliations, props.selectedAffiliations]
    );

    return (
        <div className={`gap-4 rounded-lg bg-grey-50 p-4 dark:bg-grey-600 md:flex ${props.className}`}>
            <div className="flex-1">
                <h2 className="mb-4 flex space-x-1 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Available affiliations
                </h2>
                <ul
                    id="available-affiliations-list"
                    className="sm:scrollbar-vert h-full overflow-y-auto"
                    style={{ maxHeight: props.scrollHeight }}
                >
                    {props.loading ? (
                        <li className="flex h-full items-center justify-center pb-20 pt-10">
                            <h4>Loading...</h4>
                        </li>
                    ) : filteredAvailableAffiliations.length ? (
                        Helpers.getSortedAffiliations(filteredAvailableAffiliations).map((affiliation) => (
                            <li key={affiliation.id} className="mb-4 last:mb-0">
                                <Components.AffiliationCard
                                    affiliation={affiliation}
                                    onSelect={handleAddAffiliation}
                                    disableSelection={props.isIndependentAuthor}
                                />
                            </li>
                        ))
                    ) : (
                        <li className="flex h-full items-center justify-center pb-20 pt-10">
                            <h4>No results</h4>
                        </li>
                    )}
                </ul>
            </div>

            <div id="VERTICAL-DIVIDER" className="mt-8 w-[1px] bg-grey-700 dark:bg-white-100"></div>

            <div className="flex-1">
                <h2 className="mb-4 flex space-x-1 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Selected affiliations
                </h2>
                <ul
                    id="selected-affiliations-list"
                    className="sm:scrollbar-vert h-full overflow-y-auto"
                    style={{ maxHeight: props.scrollHeight }}
                >
                    {props.loading ? (
                        <li className="flex h-full items-center justify-center pb-20 pt-10">
                            <h4>Loading...</h4>
                        </li>
                    ) : props.selectedAffiliations.length ? (
                        Helpers.getSortedAffiliations(props.selectedAffiliations).map((affiliation) => (
                            <li key={affiliation.id} className="mb-4 last:mb-0">
                                <Components.AffiliationCard
                                    affiliation={affiliation}
                                    onRemove={handleRemoveAffiliation}
                                />
                            </li>
                        ))
                    ) : (
                        <li className="flex h-full flex-col justify-center gap-8 py-8 pl-2 md:-mt-6">
                            <p className="flex items-center gap-2">
                                <Outline.ExclamationCircleIcon className="mr-1 inline w-5 flex-shrink-0" />
                                No affiliations have been added
                            </p>
                            <Components.Checkbox
                                checked={props.isIndependentAuthor}
                                id={'confirm-independent-author'}
                                inputClassName="border-teal-500"
                                label={'I am an independent author and do not need to enter any affiliations'}
                                name="confirm"
                                onChange={(event) => props.onIndependentAuthorChange(event.target.checked)}
                                required={true}
                            />
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(AuthorAffiliations);
