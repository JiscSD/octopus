import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

const CompletedIcon = () => (
    <OutlineIcons.BadgeCheckIcon className="absolute right-1 top-1 z-10 h-6 w-6 bg-teal-50 text-teal-500 transition-colors duration-500 dark:bg-grey-800" />
);
const IncompleteIcon = () => (
    <OutlineIcons.ExclamationCircleIcon className="absolute right-1 top-1 z-10 h-6 w-6 bg-teal-50 text-yellow-600 transition-colors duration-500 dark:bg-grey-800 dark:text-yellow-500" />
);

/**
 * @description Content review
 */
const StepFive = () => {
    const title = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.title);
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);
    const conflictOfInterestStatus = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestStatus
    );
    const conflictOfInterestText = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.conflictOfInterestText
    );
    const licence = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.licence);
    const content: string = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.content
    );

    return (
        <div className="text-sm text-grey-800 transition-colors duration-500 dark:text-white">
            <div className="relative mt-20 border-b border-grey-100 pb-8 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-4 block font-montserrat text-xl font-semibold text-pink-500">
                    {Helpers.formatPublicationType(type)}
                </span>
                <h1 className="mb-4 block font-montserrat text-3xl text-grey-800 transition-colors duration-500 dark:text-white">
                    {title}
                </h1>
                {title.length ? <CompletedIcon /> : <IncompleteIcon />}
            </div>
            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Chosen publications to link
                </span>
                <p>TODO: Link information here</p>
            </div>
            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Creative commons licence
                </span>
                <Components.Link
                    href={`${Config.values.licenceTypes.find((type) => type.value === licence)?.link}`}
                    openNew={true}
                    className="mb-2 block w-fit rounded underline decoration-teal-500 decoration-2 underline-offset-2 outline-0 hover:decoration-teal-600 focus:ring-2 focus:ring-yellow-400"
                >
                    <strong className="text-grey-800 transition-colors duration-500 dark:text-white">
                        {Config.values.licenceTypes.find((type) => type.value === licence)?.nicename} 4.0
                    </strong>
                </Components.Link>
                {licence ? <CompletedIcon /> : <IncompleteIcon />}
            </div>

            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Conflict of interest
                </span>
                {conflictOfInterestStatus ? (
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white">
                        {conflictOfInterestText}
                    </p>
                ) : (
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white">
                        Specified that there is <strong>no</strong> conflict of interest
                    </p>
                )}
                {conflictOfInterestStatus && conflictOfInterestText.length ? <CompletedIcon /> : <IncompleteIcon />}
                {!conflictOfInterestStatus && <CompletedIcon />}
            </div>

            <div className="relative mt-10 pb-16">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Full text
                </span>
                <Components.ParseHTML content={content} />
                {content.length > 7 ? <CompletedIcon /> : <IncompleteIcon />}
            </div>
        </div>
    );
};

export default StepFive;
