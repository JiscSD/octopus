import React, { useState } from 'react';
import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    id: string;
    publicationId: string;
    crosslinks: Interfaces.GetPublicationMixedCrosslinksResponse;
};

const RelatedPublications: React.FC<Props> = (props) => {
    const user = Stores.useAuthStore((state) => state.user);
    const { recent, relevant } = props.crosslinks.data;
    const totalCrosslinks = props.crosslinks.metadata.total;
    const [modalVisibility, setModalVisibility] = useState(false);
    const showShowAllButton = totalCrosslinks > 5;
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
                {(showShowAllButton || user) && (
                    <div className="flex flex-col md:flex-row lg:flex-col gap-4 justify-between ">
                        {showShowAllButton && (
                            <>
                                <Components.Button
                                    title="Show All"
                                    className="border-2 bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 justify-center w-full md:w-1/2 lg:w-full"
                                    onClick={() => setModalVisibility((prevState) => !prevState)}
                                />
                                <Components.RelatedPublicationsViewAllModal
                                    publicationId={props.publicationId}
                                    open={modalVisibility}
                                    onClose={() => setModalVisibility(false)}
                                />
                            </>
                        )}
                        {user && (
                            <Components.Button
                                title="Suggest a link"
                                className="border-2 bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 justify-center w-full md:w-1/2 lg:w-full"
                                onClick={() => console.log('Open suggest crosslink modal')}
                            />
                        )}
                    </div>
                )}
            </div>
        </Components.AccordionSection>
    ) : null;
};

export default RelatedPublications;
