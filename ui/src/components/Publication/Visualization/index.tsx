import React, { useEffect, useMemo, useRef } from 'react';
import Xarrow from 'react-xarrows';
import useSWR from 'swr';

import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Axios from 'axios';
import * as Framer from 'framer-motion';

interface BoxEntry {
    id: string;
    title: string;
    type: string;
    createdBy: string;
    authorFirstName: string;
    authorLastName: string;
    publishedDate: string;
    authors: Pick<Interfaces.CoAuthor, 'id' | 'linkedUser' | 'publicationVersionId' | 'user'>[];
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

const getPublicationsByType = (data: Interfaces.PublicationWithLinks, type: string) => {
    const { publication, linkedTo, linkedFrom } = data;
    const publications: BoxEntry[] = [];

    if (publication.type === type) {
        // Push the selected publication first
        const latestVersion = publication.versions.find((version) => version.isLatestLiveVersion);

        if (latestVersion) {
            publications.push({
                id: publication.id,
                title: latestVersion.title,
                type: publication.type,
                createdBy: latestVersion.createdBy,
                publishedDate: latestVersion.publishedDate,
                authorFirstName: latestVersion.user.firstName,
                authorLastName: latestVersion.user.lastName,
                authors: latestVersion.coAuthors,
                pointers: linkedFrom
                    .filter(
                        (linkedPublication) =>
                            linkedPublication.type !== 'PEER_REVIEW' &&
                            linkedPublication.parentPublication === publication.id
                    )
                    .map((publication) => publication.id) // get the ids of all direct child publications
            });
        }
    }

    // ignore publications above 'PROBLEM'
    if (publication.type !== 'PROBLEM') {
        // Loop through all parent publications
        for (const linkedPublication of linkedTo) {
            if (
                linkedPublication.type === type &&
                !publications.find((publication) => publication.id === linkedPublication.id)
            ) {
                publications.push({
                    id: linkedPublication.id,
                    title: linkedPublication.title,
                    type: linkedPublication.type,
                    createdBy: linkedPublication.createdBy,
                    authorFirstName: linkedPublication.authorFirstName,
                    authorLastName: linkedPublication.authorLastName,
                    authors: linkedPublication.authors,
                    publishedDate: linkedPublication.publishedDate,
                    pointers: linkedTo
                        .filter(
                            (publication) =>
                                publication.type !== 'PEER_REVIEW' && publication.id === linkedPublication.id
                        )
                        .map((publication) => publication.childPublication) // get the ids of all direct child publications
                });
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
                publications.push({
                    id: linkedPublication.id,
                    title: linkedPublication.title,
                    type: linkedPublication.type,
                    createdBy: linkedPublication.createdBy,
                    authorFirstName: linkedPublication.authorFirstName,
                    authorLastName: linkedPublication.authorLastName,
                    publishedDate: linkedPublication.publishedDate,
                    authors: linkedPublication.authors,
                    pointers: linkedFrom
                        .filter(
                            (publication) =>
                                publication.type !== 'PEER_REVIEW' &&
                                publication.parentPublication === linkedPublication.id
                        )
                        .map((publication) => publication.id) // get the ids of all direct child publications
                });
            }
        }
    }

    return publications;
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
                        {data &&
                            filteredPublicationTypes.map((type) => (
                                <div key={type} className="space-y-4 p-1">
                                    {getPublicationsByType(data, type).map((publication) => (
                                        <Box
                                            isSelected={props.publicationId == publication.id}
                                            key={publication.id}
                                            {...publication}
                                        />
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Visualization;
