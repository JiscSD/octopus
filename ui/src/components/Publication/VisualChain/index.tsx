import React from 'react';

import * as Types from '@types';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    highlighted: Types.PublicationType;
};

const VisualChain: React.FC<Props> = (props): React.ReactElement => (
    <div className="print:hidden">
        {Config.values.publicationTypes.map((type, index) => {
            return type !== 'PEER_REVIEW' ? (
                <div
                    key={type}
                    className="relative mb-2 mr-0 block after:text-grey-500 last:mr-0 xl:mr-2 xl:mb-0 xl:inline xl:after:content-['_→'] xl:last:after:content-['']"
                >
                    <span
                        title={type}
                        className={`text-grey-800 transition-colors duration-500 dark:text-white ${
                            props.highlighted === type
                                ? `font-bold underline decoration-pink-500 underline-offset-2`
                                : `${
                                      Config.values.publicationTypes[index + 1] === props.highlighted ||
                                      Config.values.publicationTypes[index - 1] === props.highlighted
                                          ? 'font-medium'
                                          : ''
                                  }`
                        }`}
                    >
                        {Helpers.formatPublicationType(type)}
                    </span>
                </div>
            ) : null;
        })}
    </div>
);

export default VisualChain;
