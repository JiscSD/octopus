import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
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

interface LinkedPublication {
    id: string;
    title: string;
    type: Types.PublicationType;
    publishedDate: string;
    user: {
        id: string;
        orcid: string;
        firstName: string;
        lastName: string;
    };
    linkedTo?: [
        {
            publicationToRef: LinkedPublication;
        }
    ];
    linkedFrom?: [
        {
            publicationFromRef: LinkedPublication;
        }
    ];
    parent?: string;
}

// replace with above
type BoxProps = {
    publication: BoxEntry;
    pointer?: string;
    type: string;
};

const Box: React.FC<BoxProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div id={props.publication.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
                className={`
            ${!props.type ? 'sticky top-0 border-teal-600' : 'border-transparent hover:border-teal-600'}
            block overflow-hidden rounded-md border-2 bg-white-50 px-3 py-2 text-grey-800 shadow transition-colors duration-500 dark:bg-grey-900 dark:text-white-100
            `}
            >
                <>
                    <div className="space-y-1">
                        <span
                            className="block h-16 text-sm leading-snug"
                            title={props.publication.title}
                            aria-label={props.publication.title}
                        >
                            {Helpers.truncateString(props.publication.title, 50)}
                        </span>

                        <span className="block text-xs text-grey-600 transition-colors duration-500 dark:text-grey-200">
                            {props.publication.firstName[0]} {props.publication.lastName}
                        </span>

                        <time className="block text-xs text-grey-600 transition-colors duration-500 dark:text-grey-200">
                            {Helpers.formatDate(props.publication.publishedDate)}
                        </time>
                    </div>

                    {props.pointer && (
                        <Xarrow
                            path="grid"
                            strokeWidth={2}
                            color={'#296d8a'}
                            showHead={false}
                            start={props.publication.id}
                            end={props.pointer}
                        />
                    )}
                </>
            </Components.Link>
        </Framer.motion.div>
    );
};

type VisulizationProps = {
    id: string;
};

const Visulization: React.FC<VisulizationProps> = (props): React.ReactElement => {
    const { data, error } = useSWR<Axios.AxiosResponse<LinkedPublication[]>>(
        `${Config.endpoints.publications}/${props.id}/links`,
        null,
        {
            // revalidateOnFocus: false,
            fallback: {
                data: {}
            }
        }
    );

    const getBoxes = (publication: LinkedPublication[], type: string) => {
        let boxes: BoxEntry[] = [];

        // Loop and add all from/to boxes

        for (const linked of publication) {
            if (linked.type === type) {
                boxes.push({
                    id: linked.id,
                    title: linked.title,
                    firstName: linked.user.firstName,
                    lastName: linked.user.lastName,
                    publishedDate: linked.publishedDate,
                    direction: 'left',
                    pointer: linked.parent,
                    type: linked.type
                });
            }
        }

        return boxes;
    };

    return (
        <section className="scrollbar-vert mb-8 grid h-72 grid-cols-7 gap-x-8 gap-y-2 overflow-y-auto pb-[5px]">
            {Config.values.publicationTypes.map((type) => {
                return (
                    // We're not including peer reviews in the 'chain'
                    type !== 'PEER_REVIEW' && (
                        <div key={type} className="relative">
                            <span className="sticky top-0 z-10 mb-4 block rounded bg-grey-50 p-2 pl-3 font-montserrat text-sm font-semibold text-grey-800 transition-colors duration-500 dark:bg-grey-900 dark:text-grey-200 dark:text-white-50">
                                {Helpers.formatPublicationType(type)}
                            </span>

                            <div className="space-y-4">
                                {/** data && !error === success */}
                                {data && !error && (
                                    <>
                                        {getBoxes(data.data, type).map((publication) => {
                                            console.log(publication);
                                            return (
                                                type === publication.type && (
                                                    <Box
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
