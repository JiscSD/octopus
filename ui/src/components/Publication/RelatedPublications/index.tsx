import { KeyedMutator } from 'swr';
import * as NextRouter from 'next/router';
import React, { useState } from 'react';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Interfaces from '@/interfaces';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Stores from '@/stores';
import * as Types from '@/types';

type Props = {
    id: string;
    publicationId: string;
    crosslinks: Interfaces.GetPublicationMixedCrosslinksResponse;
    type: Types.PublicationType;
    refreshCrosslinks: KeyedMutator<Interfaces.GetPublicationMixedCrosslinksResponse>;
};

const RelatedPublications: React.FC<Props> = (props) => {
    const router = NextRouter.useRouter();
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
        <Components.AccordionSection id={props.id} title={'Related Publications'}>
            <div className="flex flex-col space-y-4 px-6 py-4">
                <Components.Button
                    title="Related publications section in FAQ"
                    className="self-end"
                    endIcon={<OutlineIcons.InformationCircleIcon className="w-6 text-teal-600 dark:text-teal-200" />}
                    openNew={true}
                    href={Config.urls.faq.path + '#related_publications'}
                >
                    <span className="text-teal-600 dark:text-teal-200">What is this?</span>
                </Components.Button>
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
                                sourcePublicationId={props.publicationId}
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
                                sourcePublicationId={props.publicationId}
                                key={crosslink.linkedPublication.id}
                            />
                        ))}
                    </section>
                )}
                <div className="flex flex-col md:flex-row lg:flex-col gap-4 justify-between ">
                    {showShowAllButton && (
                        <>
                            <Components.Button
                                title="View All"
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
                    {user ? (
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
                                onClose={() => {
                                    setSuggestModalVisibility(false);
                                }}
                                refreshCrosslinks={props.refreshCrosslinks}
                            />
                        </>
                    ) : (
                        <Components.Button
                            title="Sign in to suggest a link"
                            className="border-2 bg-teal-600 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 justify-center w-full md:w-1/2 lg:w-full"
                            href={`${Config.urls.orcidLogin.path}&state=${encodeURIComponent(router.asPath)}`}
                        />
                    )}
                </div>
            </div>
        </Components.AccordionSection>
    );
};

export default RelatedPublications;
