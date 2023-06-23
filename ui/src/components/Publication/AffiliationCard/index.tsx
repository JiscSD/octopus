import React, { useCallback, useRef, useState } from 'react';
import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Outline from '@heroicons/react/24/outline';
import * as Helpers from '@helpers';

type AffiliationCardProps = {
    affiliation: Interfaces.MappedOrcidAffiliation;
    disableSelection?: boolean;
    onSelect?: (affiliation: Interfaces.MappedOrcidAffiliation) => void;
    onRemove?: (affiliation: Interfaces.MappedOrcidAffiliation) => void;
};

const AffiliationCard: React.FC<AffiliationCardProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const affiliationDetailsRef = useRef<HTMLDivElement>(null);

    const toggleIsOpen = useCallback(
        () =>
            setIsOpen((prevState) => {
                const isOpen = !prevState;

                if (affiliationDetailsRef.current) {
                    const maxHeight = affiliationDetailsRef.current.scrollHeight;
                    affiliationDetailsRef.current.style.maxHeight = `${isOpen ? maxHeight : 0}px`;
                }

                return isOpen;
            }),
        []
    );
    const handleSelect = useCallback(() => props.onSelect && props.onSelect(props.affiliation), [props]);
    const handleRemove = useCallback(() => props.onRemove && props.onRemove(props.affiliation), [props]);

    const {
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

                {props.onSelect && (
                    <Components.Button
                        title="Add affiliation"
                        className="flex-shrink-0 text-teal-400 children:border-0"
                        disabled={props.disableSelection}
                        endIcon={<Outline.PlusCircleIcon className="w-5 text-teal-400" />}
                        onClick={handleSelect}
                    >
                        Add
                    </Components.Button>
                )}

                {props.onRemove && (
                    <Components.Button
                        title="Remove affiliation"
                        className="flex-shrink-0 text-teal-400 children:border-0"
                        disabled={props.disableSelection}
                        endIcon={<Outline.MinusCircleIcon className="w-5 text-teal-400" />}
                        onClick={handleRemove}
                    >
                        Remove
                    </Components.Button>
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
                        {startDate ? Helpers.getFormattedAffiliationDate(startDate) : null} {startDate ? ' to ' : null}
                        {endDate ? Helpers.getFormattedAffiliationDate(endDate) : startDate ? 'Present' : null}
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
                    <p>{Helpers.getFormattedAffiliationDate(createdAt)}</p>
                </div>
                <div>
                    <h4 className="pt-1 font-semibold">Last modified</h4>
                    <p>{Helpers.getFormattedAffiliationDate(updatedAt)}</p>
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

export default React.memo(AffiliationCard);
