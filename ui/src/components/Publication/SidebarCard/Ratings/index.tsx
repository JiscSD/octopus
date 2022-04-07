import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    publication: Interfaces.Publication;
};

const Ratings: React.FC<Props> = (props): React.ReactElement => {
    return (
        <>
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Reviews</span>
                </div>
            </div>
            <div className="flex">
                <span className="text-xs">Placeholder for display ratings...</span>
            </div>
        </>
    );
};

export default Ratings;
