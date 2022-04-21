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
        <>
            <Components.PublicationCreationStepTitle text="Review &#38; publish" />
            <p className="mb-2 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                Your publication will go live as soon as you select Publish. At this point the publication will be
                date-stamped and a DOI created, establishing the work as yours.
            </p>
            <p className="mb-2 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                It will appear publicly on your personal page for other researchers, institutions and funders to see,
                alongside others’ subsequent reviews and ratings of it.
            </p>
            <p className="mb-10 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                Please note that publications cannot be edited post-publication.
            </p>

            <div className="space-y-8">
                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Title
                    </span>
                    {title.length ? <CompletedIcon /> : <IncompleteIcon />}
                </div>
                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Links
                    </span>
                    {linkedTo.length ? <CompletedIcon /> : <IncompleteIcon />}
                </div>
                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Creative commons licence
                    </span>
                    {licence ? <CompletedIcon /> : <IncompleteIcon />}
                </div>

                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Conflict of interest
                    </span>
                    {conflictOfInterestStatus && conflictOfInterestText.length ? <CompletedIcon /> : <IncompleteIcon />}
                    {!conflictOfInterestStatus && <CompletedIcon />}
                </div>

                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Full text
                    </span>
                    {content.length > 7 ? <CompletedIcon /> : <IncompleteIcon />}
                </div>
            </div>
        </>
    );
};

export default StepFive;
