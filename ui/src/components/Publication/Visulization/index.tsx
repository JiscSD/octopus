import React, { useEffect, useMemo, useRef } from 'react';
import Xarrow from 'react-xarrows';
import useSWR from 'swr';

import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as Axios from 'axios';
import * as Framer from 'framer-motion';

interface BoxEntry {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    pointer?: string;
    publishedDate: string;
    direction?: 'right' | 'left' | 'auto';
    type: Types.PublicationType;
}

// replace with above
type BoxProps = {
    current: boolean;
    publication: BoxEntry;
    pointer?: string;
    type: string;
};

const Box: React.FC<BoxProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div
            id={props.publication.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
        >
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
                className={`
            ${
                props.current
                    ? 'border-teal-600 bg-teal-700 tracking-wide text-white-50 dark:bg-teal-800'
                    : 'border-transparent bg-teal-100 text-teal-800 hover:border-teal-600 dark:bg-grey-700 '
            }
             relative z-20 block overflow-hidden rounded-md border-2 px-3 py-2 text-grey-800 shadow transition-colors duration-500 dark:text-white-100
            `}
            >
                <>
                    <div
                        className={`mb-2 text-xs leading-snug line-clamp-3 xl:min-h-[50px] 2xl:min-h-[60px] 2xl:text-sm ${
                            props.current ? 'font-semibold' : 'font-medium'
                        }`}
                        title={props.publication.title}
                        role="complementary"
                        aria-label={props.publication.title}
                    >
                        <span>{props.publication.title}</span>
                    </div>
                    <div className="space-y-1">
                        <span
                            className={`${
                                props.current
                                    ? 'font-medium text-teal-100'
                                    : 'text-grey-600 dark:font-medium dark:text-teal-50'
                            } block overflow-hidden text-ellipsis whitespace-nowrap text-xxs transition-colors duration-500 2xl:text-xs`}
                        >
                            {props.publication.firstName[0]} {props.publication.lastName}
                        </span>

                        <time
                            className={`${
                                props.current ? 'text-teal-50' : 'text-grey-600'
                            } block text-xxs transition-colors duration-500 dark:text-grey-200 2xl:text-xs`}
                        >
                            {Helpers.formatDate(props.publication.publishedDate, 'short')}
                        </time>
                    </div>
                </>
            </Components.Link>
            {props.pointer && (
                <Xarrow
                    path="grid"
                    strokeWidth={2}
                    color={'#296d8a'}
                    showHead={false}
                    start={props.publication.id}
                    end={props.pointer}
                    zIndex={5}
                />
            )}
        </Framer.motion.div>
    );
};

type VisulizationProps = {
    id: string;
};

const Visulization: React.FC<VisulizationProps> = (props): React.ReactElement => {
    const { data } = useSWR<Axios.AxiosResponse<Interfaces.PublicationWithLinks>>(
        `${Config.endpoints.publications}/${props.id}/links`,
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

    const getBoxes = (publication: Interfaces.PublicationWithLinks, type: string) => {
        let boxes: BoxEntry[] = [];

        // Push the root element first
        boxes.push({
            id: publication.rootPublication.id,
            title: publication.rootPublication.title,
            firstName: publication.rootPublication.user.firstName,
            lastName: publication.rootPublication.user.lastName,
            publishedDate: publication.rootPublication.publishedDate,
            direction: 'auto',
            type: publication.rootPublication.type
        });

        // Loop all linked to publications
        for (const linked of publication.linkedToPublications) {
            if (!boxes.find((box) => box.id === linked.publicationTo) && linked.publicationToType === type) {
                boxes.push({
                    id: linked.publicationTo,
                    title: linked.publicationToTitle,
                    firstName: linked.publicationToFirstName,
                    lastName: linked.publicationToLastName,
                    publishedDate: linked.publicationToPublishedDate,
                    pointer: linked.publicationFrom,
                    type: linked.publicationToType
                });
            }
        }

        // Loop all linked from publications
        for (const linked of publication.linkedFromPublications) {
            if (!boxes.find((box) => box.id === linked.publicationFrom) && linked.publicationFromType === type) {
                boxes.push({
                    id: linked.publicationFrom,
                    title: linked.publicationFromTitle,
                    firstName: linked.publicationFromFirstName,
                    lastName: linked.publicationFromLastName,
                    publishedDate: linked.publicationFromPublishedDate,
                    pointer: linked.publicationTo,
                    type: linked.publicationFromType
                });
            }
        }

        return boxes;
    };

    // We're not including peer reviews in the 'chain'
    const filteredPublicationTypes = useMemo(
        () => Config.values.publicationTypes.filter((type) => type !== 'PEER_REVIEW'),
        []
    );

    return (
        <section className="container mb-8 px-8 pt-8 lg:pt-16">
            <div className="overflow-hidden bg-teal-50 dark:bg-grey-800" ref={visualizationHeaderRef}>
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
            <div className="sm:scrollbar-vert max-h-[24rem] overflow-y-auto xl:max-h-[30rem]">
                <div className="sm:scrollbar min-h-[16rem] overflow-x-auto" ref={visualizationWrapperRef}>
                    <div className="grid min-w-[1000px] grid-cols-7 gap-[2%]">
                        {filteredPublicationTypes.map((type) => (
                            <div key={type} className="space-y-4 p-1">
                                {data ? (
                                    <>
                                        {getBoxes(data.data, type).map(
                                            (publication) =>
                                                type === publication.type && (
                                                    <Box
                                                        current={data.data.rootPublication.id == publication.id}
                                                        key={publication.id}
                                                        pointer={publication.pointer}
                                                        publication={publication}
                                                        type={publication.type}
                                                    />
                                                )
                                        )}
                                    </>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Visulization;
