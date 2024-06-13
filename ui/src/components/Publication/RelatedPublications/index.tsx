import React, { useState } from 'react';
import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as Types from '@/types';

type Props = {
    id: string;
    publicationId: string;
    crosslinks: Interfaces.GetPublicationMixedCrosslinksResponse;
    type: Types.PublicationType | undefined;
};

const RelatedPublications: React.FC<Props> = (props) => {
    const user = Stores.useAuthStore((state) => state.user);
    const { recent, relevant } = props.crosslinks.data;
    const totalCrosslinks = props.crosslinks.metadata.total;
    const [viewAllModalVisibility, setViewAllModalVisibility] = useState(false);
    const [suggestModalVisibility, setSuggestModalVisibility] = useState(false);
    const [viewAllModalKey, setViewAllModalKey] = useState(0);
    const showShowAllButton = totalCrosslinks > 5;

    const openViewAllModal = () => {
        setViewAllModalVisibility(true);
        // Resets modal state
        setViewAllModalKey(viewAllModalKey + 1);
    };

    return (
        // TODO: Remove this condition when crosslinking is fully released.
        !!totalCrosslinks && (
            <Components.AccordionSection id={props.id} title={'Related Publications'}>
                <div className="space-y-4 px-6 py-4">
                    {!!recent.length && (
                        <section className="flex flex-col">
                            {!!relevant.length && (
                                <span className="uppercase leading-0 block font-montserrat text-xs font-bold tracking-wide text-teal-400 dark:text-teal-200">
                                    Most recent
                                </span>
                            )}
                            {recent.map((crosslink) => (
                                <Components.RelatedPublicationsCard
                                    crosslink={crosslink}
                                    key={crosslink.linkedPublication.id}
                                />
                            ))}
                        </section>
                    )}
                    {!!relevant.length && (
                        <section className="flex flex-col border-grey-200 border-t pt-4">
                            {!!recent.length && (
                                <span className="uppercase leading-0 block font-montserrat text-xs font-bold tracking-wide text-teal-400 dark:text-teal-200">
                                    Most relevant
                                </span>
                            )}
                            {relevant.map((crosslink) => (
                                <Components.RelatedPublicationsCard
                                    crosslink={crosslink}
                                    key={crosslink.linkedPublication.id}
                                />
                            ))}
                        </section>
                    )}
                    {(showShowAllButton || (user && props.type)) && (
                        <div className="flex flex-col md:flex-row lg:flex-col gap-4 justify-between ">
                            {showShowAllButton && (
                                <>
                                    <Components.Button
                                        title="Show All"
                                        className="border-2 bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 justify-center w-full md:w-1/2 lg:w-full"
                                        onClick={openViewAllModal}
                                    />
                                    <Components.RelatedPublicationsViewAllModal
                                        publicationId={props.publicationId}
                                        open={viewAllModalVisibility}
                                        onClose={() => setViewAllModalVisibility(false)}
                                        key={viewAllModalKey}
                                    />
                                </>
                            )}
                            {user && props.type && (
                                <>
                                    <Components.Button
                                        title="Suggest a link"
                                        className="border-2 bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 justify-center w-full md:w-1/2 lg:w-full"
                                        onClick={() => setSuggestModalVisibility((prevState) => !prevState)}
                                    />
                                    <Components.RelatedPublicationsSuggestModal
                                        publicationId={props.publicationId}
                                        type={props.type}
                                        open={suggestModalVisibility}
                                        onClose={() => setSuggestModalVisibility(false)}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </Components.AccordionSection>
        )
    );
};

export default RelatedPublications;
