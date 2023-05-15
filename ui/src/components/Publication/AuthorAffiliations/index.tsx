import React, { useCallback, useMemo, useRef, useState } from 'react';
import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Outline from '@heroicons/react/outline';

const getFormattedAffiliationDate = (date: number | Interfaces.OrcidAffiliationDate): string => {
    if (typeof date === 'number') {
        const jsDate = new Date(date);
        const day = jsDate.toLocaleDateString('en-GB', { day: '2-digit' });
        const month = jsDate.toLocaleDateString('en-GB', { month: '2-digit' });
        const year = jsDate.toLocaleDateString('en-GB', { year: 'numeric' });

        return `${year}-${month}-${day}`;
    }

    return Object.values({ year: date.year, month: date.month, day: date.day }) // enforce order yyyy-mm-dd
        .filter((value) => value)
        .join('-');
};

const getSortedAffiliations = (affiliations: Interfaces.MappedOrcidAffiliation[]) => {
    const affiliationsWithStartDate = affiliations.filter((affiliation) => affiliation.startDate);
    const affiliationsWithoutStartDate = affiliations.filter((affiliation) => !affiliation.startDate);

    return [
        ...affiliationsWithStartDate.sort((a1, a2) =>
            getFormattedAffiliationDate(a2.startDate as Interfaces.OrcidAffiliationDate).localeCompare(
                getFormattedAffiliationDate(a1.startDate as Interfaces.OrcidAffiliationDate)
            )
        ),
        ...affiliationsWithoutStartDate.sort((a1, a2) => a1.organization.name.localeCompare(a2.organization.name))
    ];
};

type AffiliationsCardProps = {
    affiliation: Interfaces.MappedOrcidAffiliation;
    disableSelection?: boolean;
    onSelect?: (affiliation: Interfaces.MappedOrcidAffiliation) => void;
    onRemove?: (affiliation: Interfaces.MappedOrcidAffiliation) => void;
};

const AffiliationCard: React.FC<AffiliationsCardProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const affiliationDetailsRef = useRef<HTMLDivElement>(null);

    const toggleIsOpen = useCallback(
        () =>
            setIsOpen((prevState) => {
                const isOpen = !prevState;

                if (affiliationDetailsRef.current) {
                    const maxHeight = affiliationDetailsRef.current?.scrollHeight;
                    affiliationDetailsRef.current.style.maxHeight = `${isOpen ? maxHeight : 0}px`;
                }

                return isOpen;
            }),
        []
    );
    const handleSelect = useCallback(() => props.onSelect && props.onSelect(props.affiliation), [props]);
    const handleRemove = useCallback(() => props.onRemove && props.onRemove(props.affiliation), [props]);

    const {
        id,
        affiliationType,
        organization,
        startDate,
        endDate,
        title,
        departmentName,
        createdAt,
        updatedAt,
        source,
        url
    } = props.affiliation;

    return (
        <div className="rounded-lg bg-white-50 p-4 text-sm last:mb-0 dark:bg-grey-700">
            <div className="flex items-start justify-between gap-4">
                <h4 className="pt-2 font-semibold">
                    {organization.name}: {organization.address.city},{' '}
                    {organization.address.region ? `${organization.address.region}, ` : ''}
                    {organization.address.country}
                </h4>
                {props.onSelect ? (
                    <Components.Button
                        title="Add affiliation"
                        className="flex-shrink-0 text-teal-400 children:border-0"
                        disabled={props.disableSelection}
                        endIcon={<Outline.PlusCircleIcon className="w-5 text-teal-400" />}
                        onClick={handleSelect}
                    >
                        Add
                    </Components.Button>
                ) : (
                    props.onRemove && (
                        <Components.Button
                            title="Remove affiliation"
                            className="flex-shrink-0 text-teal-400 children:border-0"
                            disabled={props.disableSelection}
                            endIcon={<Outline.MinusCircleIcon className="w-5 text-teal-400" />}
                            onClick={handleRemove}
                        >
                            Remove
                        </Components.Button>
                    )
                )}
            </div>

            <p className="my-4 capitalize">{affiliationType.split('-').join(' ')}</p>

            <div
                ref={affiliationDetailsRef}
                className={`h-full space-y-4 overflow-hidden ${isOpen ? 'mb-4' : ''}`}
                style={{
                    transition: '0.3s max-height',
                    maxHeight: 0
                }}
            >
                {(startDate || endDate || title || departmentName) && (
                    <p>
                        {startDate ? getFormattedAffiliationDate(startDate) : null} {startDate ? ' to ' : null}
                        {endDate ? getFormattedAffiliationDate(endDate) : startDate ? 'Present' : null}
                        {(startDate || endDate) && ' | '}
                        {title}
                        {departmentName ? ` (${departmentName})` : null}
                    </p>
                )}
                {organization['disambiguated-organization'] && (
                    <div>
                        <h4 className="pt-1 font-semibold">Organization Identifiers</h4>
                        <p>
                            {organization['disambiguated-organization']['disambiguation-source']}:{' '}
                            {organization['disambiguated-organization']['disambiguated-organization-identifier']}
                        </p>
                    </div>
                )}

                {url && (
                    <div>
                        <h4 className="pt-1 font-semibold">URL</h4>
                        <Components.Link
                            className="rounded text-teal-600 underline decoration-teal-500 underline-offset-2 outline-0 transition-colors focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                            href={url}
                            title="Affiliation URL"
                            openNew
                        >
                            {url}
                        </Components.Link>
                    </div>
                )}

                <div>
                    <h4 className="pt-1 font-semibold">Added</h4>
                    <p>{getFormattedAffiliationDate(createdAt)}</p>
                </div>
                <div>
                    <h4 className="pt-1 font-semibold">Last modified</h4>
                    <p>{getFormattedAffiliationDate(updatedAt)}</p>
                </div>

                <h4 className="pt-1 font-semibold">
                    Source: <span className="font-normal">{source.name}</span>
                </h4>
            </div>

            <Components.Button title={isOpen ? 'Show less details' : 'Show more details'} onClick={toggleIsOpen}>
                {isOpen ? 'Show less' : 'Show more'}
            </Components.Button>
        </div>
    );
};

type AuthorAffiliationsProps = {
    className?: string;
    availableAffiliations: Interfaces.MappedOrcidAffiliation[];
    selectedAffiliations: Interfaces.MappedOrcidAffiliation[];
    isIndependentAuthor: boolean;
    scrollHeight: number;
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
        <div className={`gap-4 rounded-lg bg-grey-100 p-4 dark:bg-grey-600 md:flex ${props.className}`}>
            <div className="flex-1">
                <h2 className="mb-4 flex space-x-1 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Available affiliations
                </h2>
                <ul
                    id="available-affiliations-list"
                    className="sm:scrollbar-vert h-full overflow-y-auto"
                    style={{ maxHeight: props.scrollHeight }}
                >
                    {filteredAvailableAffiliations.length ? (
                        getSortedAffiliations(filteredAvailableAffiliations).map((affiliation) => (
                            <li key={affiliation.id} className="mb-4 last:mb-0">
                                <AffiliationCard
                                    affiliation={affiliation}
                                    onSelect={handleAddAffiliation}
                                    disableSelection={props.isIndependentAuthor}
                                />
                            </li>
                        ))
                    ) : (
                        <li className="flex h-full items-center justify-center">
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
                    {props.selectedAffiliations.length ? (
                        getSortedAffiliations(props.selectedAffiliations).map((affiliation) => (
                            <li key={affiliation.id} className="mb-4 last:mb-0">
                                <AffiliationCard affiliation={affiliation} onRemove={handleRemoveAffiliation} />
                            </li>
                        ))
                    ) : (
                        <li className="flex h-full flex-col justify-center gap-8 py-8 pl-2 md:-mt-6">
                            <p className="flex items-center gap-2">
                                <Outline.ExclamationCircleIcon className="mr-1 inline w-5 flex-shrink-0" /> No
                                affiliations have been added
                            </p>
                            <label
                                htmlFor="confirm-independent-author"
                                className="flex cursor-pointer items-center gap-4 text-sm"
                            >
                                <input
                                    required
                                    id="confirm-independent-author"
                                    name="confirm"
                                    type="checkbox"
                                    checked={props.isIndependentAuthor}
                                    onChange={(event) => props.onIndependentAuthorChange(event.target.checked)}
                                    className="cursor-pointer rounded-sm border-teal-500 bg-white-50 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                                />
                                <span className="text-grey-800 transition-colors dark:text-white-50">
                                    I am an independent author and do not need to enter any affiliations
                                </span>
                            </label>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(AuthorAffiliations);
