import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';

type Props = {
    flagCount?: number;
    peerReviewCount?: number;
    className?: string;
    childClasses?: string;
    narrow?: boolean; // Halves horizontal spacing
};

const EngagementCounts: React.FC<Props> = (props): React.ReactElement => {
    const { flagCount, peerReviewCount } = props;
    const classes = 'flex ' + (props.className || '');
    return !!props.flagCount || !!props.peerReviewCount ? (
        <span className={classes}>
            {!!flagCount && (
                <span
                    className={`flex items-end leading-none text-grey-800 transition-colors duration-500 dark:text-grey-100 ${props.childClasses}`}
                >
                    <SolidIcons.FlagIcon
                        className={`${props.narrow ? 'mr-1 md:mr-2' : 'mr-2 md:mr-4'} h-4 w-4 text-red-500`}
                        title="Red flag count"
                    />
                    {flagCount}
                </span>
            )}
            {!!peerReviewCount && (
                <span
                    className={`flex items-end leading-none text-grey-800 transition-colors duration-500 dark:text-grey-100 ${
                        props.narrow ? 'ml-2 md:ml-4' : 'ml-4 md:ml-8'
                    } ${props.childClasses}`}
                >
                    <SolidIcons.PencilIcon
                        className={`${props.narrow ? 'mr-1 md:mr-2' : 'mr-2 md:mr-4'} h-4 w-4`}
                        title="Peer review count"
                    />
                    {peerReviewCount}
                </span>
            )}
        </span>
    ) : (
        <></>
    );
};

export default EngagementCounts;
