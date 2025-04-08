import * as HeadlessUI from '@headlessui/react';

import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Types from '@/types';

type OptionProps = {
    content: string | null;
    first: boolean;
    flagCount: number;
    id: string;
    last: boolean;
    peerReviewCount: number;
    publishedDate: string | null;
    title: string;
    type: Types.PublicationType;
    user: {
        firstName: string;
        lastName: string | null;
        role: Types.UserRole;
    };
};

const Option = (props: OptionProps): React.ReactElement => {
    const { content, id, flagCount, peerReviewCount, publishedDate, title, type, user } = props;
    const hasFlagAndPeerReview = flagCount && peerReviewCount;
    const hasOneOfFlagOrPeerReview = flagCount || peerReviewCount;
    const value: Types.LinkedPublicationComboboxOptionValue = {
        id,
        title
    };
    return (
        <HeadlessUI.Combobox.Option
            key={id}
            className={({ active }) =>
                `relative cursor-default select-none p-2 text-teal-900 ${
                    active && 'ring-2 ring-inset ring-yellow-400'
                } ${props.first && 'rounded-t'} ${props.last && 'rounded-b'}`
            }
            value={value}
            title={content ? Helpers.truncateString(Helpers.htmlToText(content), 220) : ''}
        >
            <div className="space-y-2">
                <span className="font-montserrat text-sm font-medium text-teal-600">
                    {Helpers.formatPublicationType(type)}
                </span>
                <p className="text-grey-800">{title}</p>
                <div className="flex flex-col space-y-2 sm:flex-row">
                    <div
                        className={`flex items-end space-x-2 ${
                            hasFlagAndPeerReview ? 'sm:w-1/2' : hasOneOfFlagOrPeerReview ? 'sm:w-3/4' : ''
                        }`}
                    >
                        {publishedDate && (
                            <span className="text-xs leading-none text-grey-700">
                                <time suppressHydrationWarning>{Helpers.formatDate(publishedDate)}</time>,
                            </span>
                        )}
                        <span className="text-xs leading-none text-grey-700">{Helpers.abbreviateUserName(user)}</span>
                    </div>
                    <Components.EngagementCounts
                        flagCount={flagCount}
                        peerReviewCount={peerReviewCount}
                        className={`justify-start text-sm sm:justify-end ${hasFlagAndPeerReview ? 'w-1/2' : 'w-1/4'}`}
                        childClasses="text-grey-700 dark:text-grey-700"
                    />
                </div>
            </div>
        </HeadlessUI.Combobox.Option>
    );
};

export default Option;
