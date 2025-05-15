import React, { useEffect, useMemo, useRef } from 'react';
import { Xwrapper } from 'react-xarrows';
import useSWR from 'swr';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

const mapLinkedPublicationToBoxData = (
    data: {
        publication: Interfaces.LinkedPublication;
        userId?: string;
    } & (
        | {
              roleInChain: 'parent';
              linksToPotentialChildren: Interfaces.LinkedToPublication[];
          }
        | {
              roleInChain: 'child' | 'main';
              linksToPotentialChildren: Interfaces.LinkedFromPublication[];
          }
    )
): Interfaces.VisualizationBoxData => {
    const { publication, userId, roleInChain, linksToPotentialChildren } = data;
    const userIsAuthor = !!userId && !!publication.authors?.some((author) => author.linkedUser === userId);
    const { id, title, type, createdBy, authorFirstName, authorLastName, publishedDate, flagCount, peerReviewCount } =
        publication;

    let childPublicationIds: string[];
    if (roleInChain === 'parent') {
        childPublicationIds = linksToPotentialChildren
            .filter(
                (linkToPotentialChild) =>
                    linkToPotentialChild.type !== 'PEER_REVIEW' && linkToPotentialChild.id === publication.id
            )
            .map((linkToChild) => linkToChild.childPublicationId);
    } else {
        childPublicationIds = linksToPotentialChildren
            .filter(
                (linkToPotentialChild) =>
                    linkToPotentialChild.type !== 'PEER_REVIEW' &&
                    linkToPotentialChild.parentPublicationId === publication.id
            )
            .map((publication) => publication.id);
    }

    return {
        isDraft: publication.currentStatus !== 'LIVE',
        isSelected: roleInChain === 'main',
        renderAsLink: publication.currentStatus === 'LIVE' || userIsAuthor,
        id,
        title,
        type,
        createdBy,
        authorFirstName,
        authorLastName,
        publishedDate,
        flagCount,
        peerReviewCount,
        childPublicationIds
    };
};

const getBoxDataByType = (
    data: Interfaces.PublicationWithLinks,
    type: string,
    userId?: string
): Interfaces.VisualizationBoxData[] => {
    const { publication, linkedTo, linkedFrom } = data;
    const publications: Interfaces.VisualizationBoxData[] = [];

    if (publication.type === type) {
        // We only need the currently viewed publication in this case.
        return [
            mapLinkedPublicationToBoxData({
                publication,
                userId,
                roleInChain: 'main',
                linksToPotentialChildren: linkedFrom
            })
        ];
    }

    // ignore publications above 'PROBLEM'
    if (publication.type !== 'PROBLEM') {
        // Loop through all parent publications
        for (const linkedPublication of linkedTo) {
            if (
                linkedPublication.type === type &&
                !publications.find((publication) => publication.id === linkedPublication.id)
            ) {
                publications.push(
                    mapLinkedPublicationToBoxData({
                        publication: linkedPublication,
                        userId,
                        roleInChain: 'parent',
                        linksToPotentialChildren: linkedTo
                    })
                );
            }
        }
    }

    // ignore publications below 'REAL_WORLD_APPLICATION'
    if (publication.type !== 'REAL_WORLD_APPLICATION') {
        // Loop through all child publications
        for (const linkedPublication of linkedFrom) {
            if (
                linkedPublication.type === type &&
                !publications.find((publication) => publication.id === linkedPublication.id)
            ) {
                publications.push(
                    mapLinkedPublicationToBoxData({
                        publication: linkedPublication,
                        userId,
                        roleInChain: 'child',
                        linksToPotentialChildren: linkedFrom
                    })
                );
            }
        }
    }

    return publications;
};

type VisualizationProps = {
    publicationId: string;
};

const Visualization: React.FC<VisualizationProps> = (props): React.ReactElement => {
    const { user } = Stores.useAuthStore();
    const { data } = useSWR<Interfaces.PublicationWithLinks>(
        `${Config.endpoints.publications}/${props.publicationId}/links`,
        null,
        {
            fallback: {
                data: {}
            }
        }
    );

    const visualizationHeaderRef = useRef<HTMLDivElement>(null);
    const visualizationWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // helper for visualization section allowing the header to be "sticky" while scrolling visualization content on x and y
        const handleHorizontalScroll = () => {
            if (visualizationWrapperRef.current && visualizationHeaderRef.current) {
                // scroll visualization header to be in sync with the content
                if (visualizationWrapperRef.current.scrollLeft !== visualizationHeaderRef.current.scrollLeft) {
                    visualizationHeaderRef.current.scrollLeft = visualizationWrapperRef.current.scrollLeft;
                }
            }
        };

        visualizationWrapperRef.current?.addEventListener('scroll', handleHorizontalScroll);
    }, []);

    // We're not including peer reviews in the 'chain'
    const filteredPublicationTypes = useMemo(
        () => Config.values.publicationTypes.filter((type) => type !== 'PEER_REVIEW'),
        []
    );

    return (
        <section className="container mb-8 px-8 pt-8 lg:pt-16">
            <div className="overflow-hidden" ref={visualizationHeaderRef}>
                <div className="grid min-w-[1000px] grid-cols-7 gap-[2%]">
                    {filteredPublicationTypes.map((type) => (
                        <div key={type}>
                            <span className="block h-12 p-2 font-montserrat text-xs font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 xl:h-14 xl:text-sm 2xl:h-auto">
                                {Helpers.formatPublicationType(type)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="sm:scrollbar-vert max-h-[24rem] overflow-y-auto overflow-x-hidden xl:max-h-[30rem]">
                <div
                    className="sm:scrollbar min-h-[16rem] overflow-x-auto overflow-y-hidden"
                    ref={visualizationWrapperRef}
                >
                    <div className="grid min-w-[1000px] grid-cols-7 gap-[2%]">
                        {data && (
                            <Xwrapper>
                                {filteredPublicationTypes.map((type) => (
                                    <div key={type} className="space-y-4 p-1">
                                        {getBoxDataByType(data, type, user?.id).map((publication) => (
                                            <Components.PublicationVisualizationBox
                                                key={publication.id}
                                                {...publication}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </Xwrapper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Visualization;
