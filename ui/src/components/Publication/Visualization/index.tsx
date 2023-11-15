import React, { useEffect, useMemo, useRef } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
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
    const updateXarrow = useXarrow();
    useEffect(() => {
        updateXarrow();
    }, [updateXarrow]);
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

    const boxes: BoxEntry[] = [];
    if (data) {
        const { publication: selectedPublication, linkedTo, linkedFrom } = data;
        const allPublications = [selectedPublication, ...linkedTo, ...linkedFrom];
        const selectedTypeIndex = filteredPublicationTypes.indexOf(selectedPublication.type);
        for (const publication of allPublications) {
            const typeIndex = filteredPublicationTypes.indexOf(publication.type);
            if (!boxes.find((box) => box.id === publication.id)) {
                boxes.push({
                    id: publication.id,
                    title: publication.title,
                    type: publication.type,
                    createdBy: publication.createdBy,
                    publishedDate: publication.publishedDate,
                    authorFirstName: publication.authorFirstName,
                    authorLastName: publication.authorLastName,
                    authors: publication.authors,
                    pointers:
                        // for the selected publication and its child types, get pointers from linkedFrom
                        publication.type === selectedPublication.type || typeIndex > selectedTypeIndex
                            ? [
                                  ...new Set(
                                      linkedFrom
                                          .filter(
                                              (link) =>
                                                  link.type !== 'PEER_REVIEW' &&
                                                  link.parentPublication === publication.id
                                          )
                                          .map((link) => link.id)
                                  )
                              ]
                            : // for immediate parents, just point to the selected publication
                            typeIndex === selectedTypeIndex - 1
                            ? [selectedPublication.id]
                            : // for more distant ancestors, get pointers from linkedTo
                              [
                                  ...new Set(
                                      linkedTo
                                          .filter((link) => link.id === publication.id)
                                          .map((link) => link.childPublication)
                                  )
                              ]
                });
            }
        }
    }

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
                                {filteredPublicationTypes.map((type) => {
                                    const boxesOfType = boxes
                                        .filter((box) => box.type === type)
                                        .map((box) => (
                                            <Box isSelected={props.publicationId == box.id} key={box.id} {...box} />
                                        ));
                                    return (
                                        <div key={type} className="space-y-4 p-1">
                                            {boxesOfType}
                                        </div>
                                    );
                                })}
                            </Xwrapper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Visualization;
