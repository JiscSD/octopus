import React from 'react';
import useSWR from 'swr';
import * as Axios from 'axios';
import Xarrow from 'react-xarrows';

import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Interfaces from '@interfaces';

type BoxProps = {
    publication: any;
    pointer?: string;
};

const Box: React.FC<BoxProps> = (props) => {
    return (
        <div
            id={props.publication.id}
            className={`${props.publication.id} overflow-hidden whitespace-pre bg-red-500 p-2`}
        >
            {props.publication.title}

            {props.pointer && (
                <Xarrow
                    path="grid"
                    strokeWidth={2}
                    color="white"
                    showHead={false}
                    start={props.pointer}
                    end={props.publication.id}
                />
            )}
        </div>
    );
};

type VisulizationProps = {
    id: string;
};

const Visulization: React.FC<VisulizationProps> = (props): React.ReactElement => {
    // const fromIds: string[] = [];
    // const toIds = [];

    const { data } = useSWR<Axios.AxiosResponse<Interfaces.Publication>>(
        `${Config.endpoints.publications}/${props.id}/links`,
        null,
        {
            // revalidateOnFocus: false,
            fallback: {
                data: {}
            }
        }
    );

    // React.useEffect(() => {
    //     if (data?.data) {
    //         data.data.linkedFrom.map((item) => fromIds.push(item.publicationFromRef.id));
    //     }
    // }, [data]);

    if (data) {
        return (
            <section className="relative mb-8 grid grid-cols-7 gap-4 border border-red-500 print:hidden">
                {Config.values.publicationTypes.map((type) => {
                    return (
                        type !== 'PEER_REVIEW' && (
                            <div key={type} className="p-2 ">
                                <span className="mb-4 block bg-purple-300 p-2 text-sm">
                                    {Helpers.formatPublicationType(type)}
                                </span>

                                <div className="space-y-4">
                                    {type === data.data.type && <Box publication={data.data} />}

                                    {data.data.linkedFrom.map((publication) => {
                                        return (
                                            type === publication.publicationFromRef.type && (
                                                <Box
                                                    key={publication.publicationFromRef.id}
                                                    pointer={props.id}
                                                    publication={publication.publicationFromRef}
                                                />
                                            )
                                        );
                                    })}

                                    {data.data.linkedTo.map((publication) => {
                                        return (
                                            type === publication.publicationToRef.type && (
                                                <Box
                                                    key={publication.publicationToRef.id}
                                                    pointer={props.id}
                                                    publication={publication.publicationToRef}
                                                />
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    );
                })}
            </section>
        );
    }

    return <></>;
};

export default Visulization;
