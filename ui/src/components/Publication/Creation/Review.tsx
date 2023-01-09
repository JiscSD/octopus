import React from 'react';

import * as OutlineIcons from '@heroicons/react/outline';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Helpers from '@helpers';

const CompletedIcon = () => (
    <OutlineIcons.BadgeCheckIcon className="absolute right-1 top-1 z-10 h-6 w-6 bg-teal-50 text-teal-500 transition-colors duration-500 dark:bg-grey-800" />
);

const IncompleteIcon = () => (
    <OutlineIcons.ExclamationCircleIcon className="absolute right-1 top-1 z-10 h-6 w-6 bg-teal-50 text-yellow-600 transition-colors duration-500 dark:bg-grey-800 dark:text-yellow-500" />
);

const MandatoryIcon = () => (
    <OutlineIcons.ExclamationCircleIcon className="absolute right-1 top-1 z-10 h-6 w-6 bg-teal-50 text-red-600 transition-colors duration-500 dark:bg-grey-800 dark:text-red-500" />
);

/**
 * @description Content review
 */
const Review: React.FC = (): React.ReactElement => {
    const title = Stores.usePublicationCreationStore((state) => state.title);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const coAuthors = Stores.usePublicationCreationStore((state) => state.coAuthors);
    const conflictOfInterestStatus = Stores.usePublicationCreationStore((state) => state.conflictOfInterestStatus);
    const conflictOfInterestText = Stores.usePublicationCreationStore((state) => state.conflictOfInterestText);
    const licence = Stores.usePublicationCreationStore((state) => state.licence);
    const content = Stores.usePublicationCreationStore((state) => state.content);
    const linkedTo = Stores.usePublicationCreationStore((state) => state.linkTo);
    const ethicalStatement = Stores.usePublicationCreationStore((state) => state.ethicalStatement);
    const dataPermissionsStatement = Stores.usePublicationCreationStore((state) => state.dataPermissionsStatement);
    const dataPermissionsStatementProvidedBy = Stores.usePublicationCreationStore(
        (state) => state.dataPermissionsStatementProvidedBy
    );

    return (
        <>
            <Components.PublicationCreationStepTitle text="Review &#38; publish" />
            <p className="mb-2 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                Your publication will go live as soon as you select Publish. At this point, the publication will be
                date-stamped and the DOI updated to be findable, which establishes the work as yours.
            </p>
            <p className="mb-2 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                It will appear publicly on your personal page for other researchers, institutions and funders to see,
                alongside others’ subsequent reviews of it.
            </p>
            <p className="mb-10 block text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 xl:w-9/12">
                Please note that publications cannot be edited post-publication.
            </p>

            <div className="space-y-8">
                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Title
                    </span>
                    {title.trim() ? <CompletedIcon /> : <MandatoryIcon />}
                </div>

                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Links
                    </span>
                    {linkedTo.length ? <CompletedIcon /> : <IncompleteIcon />}
                </div>

                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Co-authors
                    </span>
                    {coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor) ? <CompletedIcon /> : <IncompleteIcon />}
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
                    {conflictOfInterestStatus === false && <CompletedIcon />}
                </div>

                <div className="relative">
                    <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Full text
                    </span>
                    {!Helpers.isEmptyContent(content) ? <CompletedIcon /> : <MandatoryIcon />}
                </div>

                {type === Config.values.octopusInformation.publications.DATA.id && (
                    <>
                        <div className="relative">
                            <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                                Ethical statement
                            </span>
                            {ethicalStatement?.length ? <CompletedIcon /> : <IncompleteIcon />}
                        </div>

                        <div className="relative">
                            <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                                Data permissions statement
                            </span>
                            {dataPermissionsStatement?.length ? <CompletedIcon /> : <IncompleteIcon />}
                        </div>

                        {dataPermissionsStatement === Config.values.dataPermissionsOptions[0] && (
                            <div className="relative">
                                <span className="block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    Data permissions statement provided by
                                </span>
                                {dataPermissionsStatementProvidedBy?.length ? <CompletedIcon /> : <IncompleteIcon />}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Review;
