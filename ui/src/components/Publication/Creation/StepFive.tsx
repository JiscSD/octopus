import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Config from '@config';
import * as Stores from '@stores';

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
    const setError = Stores.usePublicationCreationStore((state) => state.setError);
    const title = Stores.usePublicationCreationStore((state) => state.title);
    const conflictOfInterestStatus = Stores.usePublicationCreationStore((state) => state.conflictOfInterestStatus);
    const conflictOfInterestText = Stores.usePublicationCreationStore((state) => state.conflictOfInterestText);
    const licence = Stores.usePublicationCreationStore((state) => state.licence);
    const content = Stores.usePublicationCreationStore((state) => state.content);
    const linkedTo = Stores.usePublicationCreationStore((state) => state.linkTo);

    React.useEffect(() => {
        if (!linkedTo.length) setError('No publications have been linked!');
        return () => setError(null);
    }, [linkedTo.length, setError]);

    return (
        <div className="text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
            <div className="relative mt-20 border-b border-grey-100 pb-8 transition-colors duration-500 dark:border-grey-700">
                <h1 className="mb-4 block font-montserrat text-3xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {title}
                </h1>
                {title.length ? <CompletedIcon /> : <IncompleteIcon />}
            </div>
            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Chosen publications to link
                </span>
                {linkedTo.length ? (
                    linkedTo.map((link) => (
                        <p
                            key={link.id}
                            className="mb-2 text-grey-800 transition-colors duration-500 dark:text-white-50"
                        >
                            {link.publicationToRef.title}
                        </p>
                    ))
                ) : (
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">No links created</p>
                )}
                {linkedTo.length ? <CompletedIcon /> : <IncompleteIcon />}
            </div>
            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Creative commons licence
                </span>
                <Components.Link
                    href={Config.values.octopusInformation.licences[licence].link}
                    openNew={true}
                    className="mb-2 block w-fit rounded underline decoration-teal-500 decoration-2 underline-offset-2 outline-0 hover:decoration-teal-600 focus:ring-2 focus:ring-yellow-400"
                >
                    <strong className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {Config.values.octopusInformation.licences[licence].nicename}
                    </strong>
                </Components.Link>
                {licence ? <CompletedIcon /> : <IncompleteIcon />}
            </div>

            <div className="relative mt-10 border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
                <span className="mb-8 block text-xxs font-bold uppercase tracking-widest text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Conflict of interest
                </span>
                {conflictOfInterestStatus ? (
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {conflictOfInterestText.length
                            ? conflictOfInterestText
                            : 'You have selected there is a conflict of interest, but have not provided a reason.'}
                    </p>
                ) : (
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
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
