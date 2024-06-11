import React, { useState } from 'react';
import * as Components from '@/components';
import * as Interfaces from '@/interfaces';

type Props = {
    id: string;
    publicationId: string;
    crosslinks: Interfaces.GetPublicationMixedCrosslinksResponse;
};

const RelatedPublications: React.FC<Props> = (props) => {
    const { recent, relevant } = props.crosslinks.data;
    const totalCrosslinks = props.crosslinks.metadata.total;
    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalKey, setModalKey] = useState(0);
    const showShowAllButton = totalCrosslinks > 5;

    const openModal = () => {
        setModalVisibility(true);
        // Resets modal state
        setModalKey(modalKey + 1);
    };

    return totalCrosslinks ? (
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
                {showShowAllButton && (
                    <>
                        <Components.Button
                            title="Show All"
                            className="rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 children:border-0 children:text-white-50"
                            onClick={openModal}
                        />
                        <Components.RelatedPublicationsModal
                            publicationId={props.publicationId}
                            open={modalVisibility}
                            onClose={() => setModalVisibility(false)}
                            key={modalKey}
                        />
                    </>
                )}
            </div>
        </Components.AccordionSection>
    ) : null;
};

export default RelatedPublications;
