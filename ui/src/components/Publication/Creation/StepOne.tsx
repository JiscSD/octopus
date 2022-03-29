import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';

/**
 * @description Edit title
 */
const StepOne: React.FC = (): React.ReactElement => {
    const title = Stores.usePublicationCreationStore((state) => state.title);
    const updateTitle = Stores.usePublicationCreationStore((state) => state.updateTitle);

    return (
        <div className="space-y-6 lg:w-10/12 lg:space-y-10">
            <div className="">
                <Components.PublicationCreationStepTitle text="Title" />
                <span className="mb-2 block text-xs leading-snug text-grey-700">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia placeat delectus soluta mollitia, non
                    provident repudiandae, nobis possimus, id ipsam suscipit.
                </span>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="bg-white-60 block w-full rounded-md border border-grey-100 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                />
            </div>
        </div>
    );
};

export default StepOne;
