import React from 'react';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

/**
 * @description Edit title
 */
const StepOne: React.FC = (): JSX.Element => {
    const title = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.title);
    const updateTitle = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateTitle
    );
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);

    return (
        <>
            <div className="mb-6 lg:mb-10">
                <label className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                    Publication title
                </label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => updateTitle(e.target.value)}
                    className="block w-10/12 rounded-md  border-teal-500 bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white"
                />
            </div>
            <div className="mb-6">
                <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                    {Helpers.formatPublicationType(type)}
                </span>
                <p className="text-grey-800 dark:text-white">
                    You have selected the publication type &quot;{Helpers.formatPublicationType(type)}&quot;.
                </p>
                <p className="mt-2 text-grey-800 dark:text-white">
                    Please note that this cannot be changed. If you wish to change publication type, you must delete
                    this publication and create a new one.
                </p>
            </div>
        </>
    );
};

export default StepOne;
