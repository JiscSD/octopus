import React, { useEffect, useMemo, useRef } from 'react';
import Xarrow from 'react-xarrows';
import useSWR from 'swr';

import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as Framer from 'framer-motion';

interface BoxEntry {
    id: string;
    title: string;
    type: string;
    createdBy: string;
    authorFirstName: string;
    authorLastName: string;
    publishedDate: string;
    authors: Interfaces.LinkedPublication['authors'];
    pointers: string[];
}

type BoxProps = BoxEntry & {
    isSelected: boolean;
};

const Box: React.FC<BoxProps> = (props): React.ReactElement => {
    // pick main author to display on visualization box
    const mainAuthor = useMemo(() => {
        const correspondingAuthor = {
            id: props.createdBy,
            firstName: props.authorFirstName,
            lastName: props.authorLastName
        };

        if (!props.authors.length) {
            return correspondingAuthor;
        }

        const authors = props.authors.map((author) => ({
            id: author.linkedUser,
            firstName: author.user?.firstName,
            lastName: author.user?.lastName
        }));

        // check if corresponding author is part of authors list
        if (!authors.find((author) => author.id === correspondingAuthor.id)) {
            return correspondingAuthor;
        }

        // return first author
        return authors[0];
    }, [props.authorFirstName, props.authorLastName, props.authors, props.createdBy]);

    return (
        <Framer.motion.div id={props.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.id}`}
                className={`
            ${
                props.isSelected
                    ? 'border-teal-600 bg-teal-700 tracking-wide text-white-50 dark:bg-teal-800'
                    : 'border-transparent bg-teal-100 text-teal-800 hover:border-teal-600 dark:bg-grey-700 '
            }
             relative z-20 block overflow-hidden rounded-md border-2 px-3 py-2 text-grey-800 shadow transition-colors duration-500 dark:text-white-100
            `}
            >
                <>
                    <div
                        className={`mb-2 line-clamp-3 text-xs leading-snug xl:min-h-[50px] 2xl:min-h-[60px] 2xl:text-sm ${
                            props.isSelected ? 'font-semibold' : 'font-medium'
                        }`}
                        title={props.title}
                        role="complementary"
                        aria-label={props.title}
                    >
                        <span>{props.title}</span>
                    </div>
                    <div className="space-y-1">
                        <span
                            className={`${
                                props.isSelected
                                    ? 'font-medium text-teal-100'
                                    : 'text-grey-600 dark:font-medium dark:text-teal-50'
                            } block overflow-hidden text-ellipsis whitespace-nowrap text-xxs transition-colors duration-500 2xl:text-xs`}
                        >
                            {`${mainAuthor.firstName ? `${mainAuthor.firstName[0]}. ` : ''}${mainAuthor.lastName}`}
                        </span>

                        <time
                            className={`${
                                props.isSelected ? 'text-teal-50' : 'text-grey-600'
                            } block text-xxs transition-colors duration-500 dark:text-grey-200 2xl:text-xs`}
                            suppressHydrationWarning
                        >
                            {Helpers.formatDate(props.publishedDate, 'short')}
                        </time>
                    </div>
                </>
            </Components.Link>
            {props.pointers.map((pointer, index) => (
                <Xarrow
                    key={`arrow-${index}`}
                    path="smooth"
                    strokeWidth={2}
                    color={'#296d8a'}
                    showHead
                    start={props.id}
                    end={pointer}
                    zIndex={5}
                    startAnchor={'right'}
                    endAnchor={'left'}
                    animateDrawing={0.2}
                    curveness={0.5}
                />
            ))}
        </Framer.motion.div>
    );
};

const sortPublicationsByPublicationDate = (publications: Interfaces.LinkedPublication[]) => {
    return publications.sort((a, b) => new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf());
};

/**
 * Sort an array of publications so that the parents/children (in list a) of a publication (in list b)
 * appear close to it in the visualisation.
 * Because of the way we get data from the API, both lists will consist of the same type:
 * LinkedToPublication or LinkedFromPublication.
 * @param a The list of publications to sort
 * @param b The list of publications to sort them in relation to (these should be of the type immediately before
 * or after those in "a")
 * @returns a sorted list of publications
 */
const getOrderedLinkedPublications = (
    a: Interfaces.LinkedPublication[],
    b: Interfaces.LinkedPublication[]
): Interfaces.LinkedPublication[] => {
    const types = Config.values.publicationTypes;
    // Confirm that the type of publications in list a immediately follows or precedes the type of publications in list b
    const aFollowsB = a.every((aPub) => b.every((bPub) => types.indexOf(bPub.type) === types.indexOf(aPub.type) - 1));
    const aPrecedesB = a.every((aPub) => b.every((bPub) => types.indexOf(bPub.type) === types.indexOf(aPub.type) + 1));
    if (!(aFollowsB || aPrecedesB)) {
        console.log('Type mismatch! Abandoning.');
        return [];
    } else {
        const aSorted: Interfaces.LinkedPublication[] = [];
        // For each publication in "b"
        for (const bPub of b) {
            const aPubs = sortPublicationsByPublicationDate(
                // Pick the publications from "a" that are parents of the "b" publication...
                aPrecedesB
                    ? a.filter((aPub) => (aPub as Interfaces.LinkedToPublication).childPublication === bPub.id)
                    : // Or children, if we're working the other way
                      a.filter((aPub) => (aPub as Interfaces.LinkedFromPublication).parentPublication === bPub.id)
            );
            for (const aPub of aPubs) {
                if (!aSorted.find((sortedAPub) => sortedAPub.id === aPub.id)) {
                    aSorted.push(aPub);
                }
            }
        }
        return aSorted;
    }
};

type VisualizationProps = {
    publicationId: string;
};

const Visualization: React.FC<VisualizationProps> = (props): React.ReactElement => {
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

    const boxEntries: {
        [key in Types.PublicationType]?: BoxEntry[];
    } = {};
    if (data) {
        // Order publications by type, neatly, so that chains are displayed without crossing over where possible.
        const { publication: selectedPublication, linkedTo, linkedFrom } = data;
        const publicationsByType: {
            [key in Types.PublicationType]?: (
                | Interfaces.LinkedToPublication
                | Interfaces.LinkedFromPublication
                | Interfaces.LinkedPublication
            )[];
        } = {};
        // For the selected publication's type, we only need the selected publication.
        publicationsByType[selectedPublication.type] = [selectedPublication];
        // Process parents by type, proceeding away from the selected publication's type.
        const orderedParents: {
            [key in Types.PublicationType]?: Interfaces.LinkedToPublication[];
        } = {};
        let parentTypeIdx = filteredPublicationTypes.indexOf(selectedPublication.type) - 1;
        // For each type, going backwards towards PROBLEM, starting with the one before the selected publication's type...
        while (parentTypeIdx >= 0) {
            const type = filteredPublicationTypes[parentTypeIdx];
            const publicationsOfType = linkedTo.filter((linkedPublication) => linkedPublication.type === type);

            // Sort parents.
            // For the type immediately before the selected publication's type, just order parents by publication date, descending.
            if (parentTypeIdx === filteredPublicationTypes.indexOf(selectedPublication.type) - 1) {
                orderedParents[type] = sortPublicationsByPublicationDate(
                    publicationsOfType
                ) as Interfaces.LinkedToPublication[];
            } else {
                // For types further along the chain, use custom ordering.
                const precedingType = filteredPublicationTypes[parentTypeIdx + 1];
                const precedingTypePublicationsOrdered = orderedParents[precedingType];
                if (precedingTypePublicationsOrdered !== undefined) {
                    orderedParents[type] = getOrderedLinkedPublications(
                        publicationsOfType,
                        precedingTypePublicationsOrdered
                    ) as Interfaces.LinkedToPublication[];
                }
            }
            parentTypeIdx--;
        }
        Object.assign(publicationsByType, orderedParents);

        const orderedChildren: {
            [key in Types.PublicationType]?: Interfaces.LinkedFromPublication[];
        } = {};
        let childTypeIdx = filteredPublicationTypes.indexOf(selectedPublication.type) + 1;
        // For each type, going forwards towards REAL_WORLD_APPLICATION, starting with the one after the selected publication's type...
        while (childTypeIdx <= filteredPublicationTypes.indexOf('REAL_WORLD_APPLICATION')) {
            const type = filteredPublicationTypes[childTypeIdx];
            const publicationsOfType = linkedFrom.filter((linkedPublication) => linkedPublication.type === type);

            // Sort child publications.
            // For the type immediately after the selected publication's type, just order children by publication date, descending.
            if (childTypeIdx === filteredPublicationTypes.indexOf(selectedPublication.type) + 1) {
                orderedChildren[type] = publicationsOfType.sort(
                    (a, b) => new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf()
                );
            } else {
                // For types further along the chain, order them to keep the visualisation as neat as we can.
                // Pass the publications of the type we want to sort, and the (sorted) publications of the type before that.
                const precedingType = filteredPublicationTypes[childTypeIdx - 1];
                const precedingTypePublicationsOrdered = orderedChildren[precedingType];
                if (precedingTypePublicationsOrdered !== undefined) {
                    orderedChildren[type] = getOrderedLinkedPublications(
                        publicationsOfType,
                        precedingTypePublicationsOrdered
                    ) as Interfaces.LinkedFromPublication[];
                }
            }
            childTypeIdx++;
        }
        Object.assign(publicationsByType, orderedChildren);
        // Set up the data we need to render a box for each publication.
        for (const type of filteredPublicationTypes) {
            const publicationsOfType = publicationsByType[type];
            const boxEntriesOfType: BoxEntry[] = [];
            if (publicationsOfType !== undefined) {
                for (const publication of publicationsOfType) {
                    // Get ids of children of this publication in the chain to which we will render a pointer arrow.
                    const pointers =
                        // This is the selected publication or its descendant, so get children from linkedFrom.
                        type === selectedPublication.type ||
                        filteredPublicationTypes.indexOf(type) >
                            filteredPublicationTypes.indexOf(selectedPublication.type)
                            ? [
                                  ...new Set(
                                      linkedFrom
                                          .filter(
                                              (child) =>
                                                  child.type !== 'PEER_REVIEW' &&
                                                  child.parentPublication === publication.id
                                          )
                                          .map((child) => child.id)
                                  )
                              ]
                            : // This is a direct parent, so point only to the selected publication.
                            filteredPublicationTypes.indexOf(type) ===
                              filteredPublicationTypes.indexOf(selectedPublication.type) - 1
                            ? [selectedPublication.id]
                            : // This is an ancestor, so get children from linkedTo.
                              [
                                  ...new Set(
                                      linkedTo
                                          .filter(
                                              (parent) => parent.type !== 'PEER_REVIEW' && parent.id === publication.id
                                          )
                                          .map((parent) => parent.childPublication)
                                  )
                              ];

                    boxEntriesOfType.push({
                        id: publication.id,
                        title: publication.title,
                        type: publication.type,
                        createdBy: publication.createdBy,
                        publishedDate: publication.publishedDate,
                        authorFirstName: publication.authorFirstName,
                        authorLastName: publication.authorLastName,
                        authors: publication.authors,
                        pointers
                    });
                }
            }
            boxEntries[type] = boxEntriesOfType;
        }
    }

    const boxes = filteredPublicationTypes.map((type) => {
        const boxEntriesOfType = boxEntries[type];
        const boxesOfType = boxEntriesOfType
            ? boxEntriesOfType.map((boxEntry) => (
                  <Box isSelected={props.publicationId == boxEntry.id} key={boxEntry.id} {...boxEntry} />
              ))
            : [];
        return (
            <div key={type} className="space-y-4 p-1">
                {boxesOfType}
            </div>
        );
    });

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
                    <div className="grid min-w-[1000px] grid-cols-7 gap-[2%]">{data && boxes}</div>
                </div>
            </div>
        </section>
    );
};

export default Visualization;
