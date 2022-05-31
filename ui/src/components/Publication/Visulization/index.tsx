import React from 'react';
import useSWR from 'swr';
import * as Axios from 'axios';
import Xarrow from 'react-xarrows';
import * as Framer from 'framer-motion';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';

interface BoxEntry {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    pointer?: string;
    direction?: 'right' | 'left' | 'auto';
    type: Types.PublicationType;
}

// replace with above
type BoxProps = {
    publication: Interfaces.PublicationRef | Interfaces.Publication;
    pointer?: string;
    type?: 'TO' | 'FROM';
};

const Box: React.FC<BoxProps> = (props): React.ReactElement => {
    // {
    //     title: '',
    //     other: '',
    //     to: ''
    //     from: '',
    //     type: ''
    // }

    const start = React.useMemo(() => {
        if (props.type === 'TO') return 'left';
        if (props.type === 'FROM') return 'right';

        return 'auto';
    }, [props.type]);

    const end = React.useMemo(() => {
        if (props.type === 'TO') return 'right';
        if (props.type === 'FROM') return 'left';
        return 'auto';
    }, [props.type]);

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
                            {props.publication.user?.firstName[0]} {props.publication.user?.lastName}
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
                            start={props.pointer}
                            end={props.publication.id}
                            startAnchor={start}
                            endAnchor={end}
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
    // const fromIds: string[] = [];
    // const toIds = [];

    const { data, error } = useSWR<Axios.AxiosResponse<Interfaces.Publication>>(
        `${Config.endpoints.publications}/${props.id}/links`,
        null,
        {
            // revalidateOnFocus: false,
            fallback: {
                data: {}
            }
        }
    );

    // BoxEntry[]

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
                                        {type === data.data.type && <Box publication={data.data} />}

                                        {/** back links */}
                                        {data.data.linkedTo.map((publication) => {
                                            return (
                                                type === publication.publicationToRef.type &&
                                                data.data.type !== publication.publicationToRef.type && (
                                                    <Box
                                                        key={publication.publicationToRef.id}
                                                        pointer={props.id}
                                                        publication={publication.publicationToRef}
                                                        type="TO"
                                                    />
                                                )
                                            );
                                        })}

                                        {/** forward links */}
                                        {data.data.linkedFrom.map((publication) => {
                                            return (
                                                type === publication.publicationFromRef.type &&
                                                data.data.type !== publication.publicationFromRef.type &&
                                                publication.publicationFromRef.type !== 'PROBLEM' && (
                                                    <Box
                                                        key={publication.publicationFromRef.id}
                                                        pointer={props.id}
                                                        publication={publication.publicationFromRef}
                                                        type="FROM"
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
