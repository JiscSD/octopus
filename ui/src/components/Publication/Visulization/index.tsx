import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Types from '@types';
import * as Axios from 'axios';
import * as Framer from 'framer-motion';
import React from 'react';
import Xarrow from 'react-xarrows';
import useSWR from 'swr';

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
                    ? 'sticky top-0 border-teal-600 bg-teal-700 tracking-wide text-white-50 dark:bg-teal-800'
                    : 'border-transparent bg-teal-100 text-teal-800 hover:border-teal-600 dark:bg-grey-700 '
            }
             relative z-20 block overflow-hidden rounded-md border-2 px-3 py-2 text-grey-800 shadow transition-colors duration-500 dark:text-white-100
            `}
            >
                <>
                    <div className="space-y-1">
                        <span
                            className={`block h-24 text-xs leading-snug xl:h-16 2xl:text-sm ${
                                props.current ? 'font-semibold' : 'font-medium'
                            }`}
                            title={props.publication.title}
                            role="complementary"
                            aria-label={props.publication.title}
                        >
                            {Helpers.truncateString(props.publication.title, 45)}
                        </span>

                        <span
                            className={`${
                                props.current
                                    ? 'font-medium text-teal-100'
                                    : 'text-grey-600 dark:font-medium dark:text-teal-50'
                            } block text-xxs transition-colors duration-500 md:text-xs`}
                        >
                            {props.publication.firstName[0]} {props.publication.lastName}
                        </span>

                        <time
                            className={`${
                                props.current ? 'text-teal-50' : 'text-grey-600'
                            } block h-8 text-xxs transition-colors duration-500 dark:text-grey-200 md:text-xs xl:h-auto`}
                        >
                            {Helpers.formatDate(props.publication.publishedDate)}
                        </time>
                    </div>
                </>
            </Components.Link>
            {props.pointer && (
                <>
                    <span className="absolute -top-1 z-10 h-3 w-full border-t-4 border-teal-50 transition-colors duration-500 dark:border-grey-800"></span>
                    <Xarrow
                        path="grid"
                        strokeWidth={2}
                        color={'#296d8a'}
                        showHead={false}
                        start={props.publication.id}
                        end={props.pointer}
                        zIndex={5}
                    />
                    <span className="absolute -bottom-3 z-10 h-3 w-full border-t-4 border-teal-50 transition-colors duration-500 dark:border-grey-800"></span>
                </>
            )}
        </Framer.motion.div>
    );
};

type VisulizationProps = {
    id: string;
};

const Visulization: React.FC<VisulizationProps> = (props): React.ReactElement => {
    const { data, error } = useSWR<Axios.AxiosResponse<Interfaces.PublicationWithLinks>>(
        `${Config.endpoints.publications}/${props.id}/links`,
        null,
        {
            fallback: {
                data: {}
            }
        }
    );

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

    return (
        <section className="scrollbar-vert mb-8 grid max-h-[32rem] min-h-[22rem] grid-cols-7 gap-y-4 gap-x-8 overflow-y-auto pb-[5px] xl:gap-x-8">
            {Config.values.publicationTypes.map((type) => {
                return (
                    // We're not including peer reviews in the 'chain'
                    type !== 'PEER_REVIEW' && (
                        <div key={type} className="relative">
                            <span className="sticky top-0 z-30 block h-12 bg-teal-50 p-2 pl-3 font-montserrat text-xs font-semibold text-grey-800 transition-colors duration-500 dark:bg-grey-800 dark:text-white-50 xl:h-14 xl:text-sm 2xl:h-auto">
                                {Helpers.formatPublicationType(type)}
                            </span>

                            <div className="space-y-4 p-1">
                                {/** data && !error === success */}
                                {data && !error && (
                                    <>
                                        {getBoxes(data.data, type).map((publication) => {
                                            return (
                                                type === publication.type && (
                                                    <Box
                                                        current={data.data.rootPublication.id == publication.id}
                                                        key={publication.id}
                                                        pointer={publication.pointer}
                                                        publication={publication}
                                                        type={publication.type}
                                                    />
                                                )
                                            );
                                        })}
                                    </>
                                )}

                                {/** !data && error === error */}
                            </div>
                        </div>
                    )
                );
            })}
        </section>
    );
};

export default Visulization;
