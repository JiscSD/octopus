import * as Framer from 'framer-motion';
import React, { useMemo } from 'react';
import Xarrow, { useXarrow } from 'react-xarrows';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as I from '@/interfaces';

type BoxProps = I.VisualizationBoxData;

const Box: React.FC<BoxProps> = (props): React.ReactElement => {
    useXarrow();
    // pick main author to display on visualization box
    const mainAuthor = {
        id: props.createdBy,
        firstName: props.authorFirstName,
        lastName: props.authorLastName
    };

    const { flagCount, peerReviewCount } = props;
    const hasFlagAndPeerReview = flagCount && peerReviewCount;
    const hasOneOfFlagOrPeerReview = flagCount || peerReviewCount;

    const publishedDateClasses = `${
        props.isSelected ? 'text-teal-50' : 'text-grey-600'
    } block text-xxs transition-colors duration-500 dark:text-grey-200 2xl:text-xs`;

    const publishedDateMarkup = props.publishedDate ? (
        <time className={publishedDateClasses} suppressHydrationWarning>
            {Helpers.formatDate(props.publishedDate, 'short')}
        </time>
    ) : null;

    const boxContents = (
        <>
            <div
                className={`mb-2 line-clamp-3 text-xs leading-snug xl:min-h-[50px] 2xl:min-h-[60px] 2xl:text-sm ${
                    props.isSelected ? 'font-semibold' : 'font-medium'
                }`}
                title={props.title ?? undefined}
                role="complementary"
                aria-label={props.title ?? undefined}
            >
                <span>{props.title}</span>
            </div>
            <div className="flex">
                <div
                    className={`${
                        hasFlagAndPeerReview ? 'w-1/2' : hasOneOfFlagOrPeerReview ? 'w-3/4' : 'w-full'
                    }  space-y-1`}
                >
                    <span
                        className={`${
                            props.isSelected
                                ? 'font-medium text-teal-100'
                                : 'text-grey-600 dark:font-medium dark:text-teal-50'
                        } block overflow-hidden text-ellipsis whitespace-nowrap text-xxs transition-colors duration-500 2xl:text-xs`}
                    >
                        {Helpers.abbreviateUserName(mainAuthor)}
                    </span>
                    {props.isDraft ? <span className={publishedDateClasses}>Draft</span> : publishedDateMarkup}
                </div>
                <Components.EngagementCounts
                    flagCount={props.flagCount}
                    peerReviewCount={props.peerReviewCount}
                    narrow={true}
                    className={hasFlagAndPeerReview ? 'w-1/2' : 'w-1/4'}
                    childClasses={
                        props.isSelected
                            ? 'font-medium text-teal-100'
                            : 'text-grey-600 dark:font-medium dark:text-teal-50'
                    }
                />
            </div>
        </>
    );

    const boxClasses = `
${
    props.isSelected
        ? 'border-teal-600 bg-teal-700 tracking-wide text-white-50 dark:bg-teal-800'
        : 'border-transparent bg-teal-100 text-teal-800 hover:border-teal-600 dark:bg-grey-700 '
}
relative z-20 block overflow-hidden rounded-md border-2 px-3 py-2 text-grey-800 shadow transition-colors duration-500 dark:text-white-100
`;

    const boxContentsWrappedInLink = (
        <Components.Link href={`${Config.urls.viewPublication.path}/${props.id}`} className={boxClasses}>
            {boxContents}
        </Components.Link>
    );

    const boxContentsWrappedInDiv = <div className={boxClasses}>{boxContents}</div>;

    return (
        <Framer.motion.div id={props.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            {props.renderAsLink ? boxContentsWrappedInLink : boxContentsWrappedInDiv}

            {props.childPublicationIds.map((childPublicationId, index) => (
                <Xarrow
                    key={`arrow-${index}`}
                    path="smooth"
                    strokeWidth={2}
                    color={'#296d8a'}
                    showHead
                    start={props.id}
                    end={childPublicationId}
                    zIndex={5}
                    startAnchor={'right'}
                    endAnchor={'left'}
                    animateDrawing={0.2}
                    curveness={0.5}
                />
            ))}
        </Framer.motion.div>
    );
};

export default Box;
