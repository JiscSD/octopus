import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

// type RateProps = {
//     title: string;
//     value: number;
// };

// const data = {
//     wellDefined: {
//         title: 'Well defined',
//         value: 3
//     },
//     original: {
//         title: 'Original',
//         value: 2
//     },
//     valid: {
//         title: 'Scientifically valid',
//         value: 4
//     }
// };

// const Rating: React.FC<RateProps> = (props): React.ReactElement => {
//     const arrangeStars = (value: number) => {
//         return (
//             <div className="flex items-center justify-end">
//                 {new Array(value).fill(0).map((_, i) => (
//                     <SolidIcons.StarIcon key={i} className="h-6 w-6 text-teal-700" />
//                 ))}
//                 {new Array(5 - value).fill(0).map((_, i) => (
//                     <OutlineIcons.StarIcon key={i} className="h-6 w-6 text-teal-700" />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="mb-2 grid grid-cols-2 items-center gap-8">
//             <span className="font-montserrat text-sm font-medium text-grey-800">
//                 {props.title}({props.value})
//             </span>
//             {arrangeStars(props.value)}
//         </div>
//     );
// };

type Props = {
    publication: Interfaces.Publication;
};

const RatingsCollection: React.FC<Props> = (props): React.ReactElement => {
    return (
        <div className="w-full rounded-xl lg:w-fit">
            <div className="space-y-2 rounded-lg bg-teal-100 px-6 py-6 transition-colors duration-500">
                {/* {Object.values(ratings).map((rate: RateProps, index) => (
                    <Rating key={index} title={rate.title} value={rate.value} />
                ))} */}

                {/* <button
                    type="button"
                    onClick={(e) => writeReview(e)}
                    className="f my-6 block rounded border-transparent text-sm font-bold underline outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    Rate this publication
                </button> */}

                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800">Published:</span>
                    <time className="text-right text-sm font-medium text-grey-800">
                        {Helpers.formatDate(props.publication.publishedDate)}
                    </time>
                </div>
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800">Licence:</span>
                    <Components.Link
                        href={
                            Config.values.licenceTypes.find((licence) => licence.value === props.publication.licence)
                                ?.link || ''
                        }
                        title="licence"
                        openNew={true}
                        className="text-right text-sm font-medium text-grey-800 underline"
                    >
                        <>
                            {
                                Config.values.licenceTypes.find(
                                    (licence) => licence.value === props.publication.licence
                                )?.nicename
                            }
                        </>
                    </Components.Link>
                </div>
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800">DOI:</span>
                    <span className="text-right text-sm font-medium text-grey-800">
                        {props.publication.doi ?? 'Coiming soon'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RatingsCollection;
