import React from 'react';

import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Config from '@/config';

type Props = {
    user: Interfaces.CoreUser;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => (
    <Components.SearchResult
        linkDestination={`${Config.urls.viewUser.path}/${props.user.id}`}
        className={props.className}
    >
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4">
            <Components.Avatar user={props.user} className="col-span-1" />
            <span className="col-span-7 flex h-full items-center font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                {props.user.firstName} {props.user?.lastName}
            </span>
            <div className="relative z-20 col-span-3 flex h-full items-center font-light text-grey-600 transition-colors duration-500 dark:text-grey-100">
                {props.user.employment
                    .filter((employment) => {
                        const { day, month, year } = employment.endDate;

                        if (!day && !month && !year) {
                            // there's no end date
                            return true;
                        }

                        const currentDate = new Date();

                        if (Number(year) > currentDate.getFullYear()) {
                            return true;
                        }

                        if (Number(year) === currentDate.getFullYear()) {
                            // check month
                            if (month && Number(month) - 1 < currentDate.getMonth()) {
                                return false;
                            }

                            if (month && Number(month) - 1 === currentDate.getMonth()) {
                                // check day of month
                                if (day && Number(day) < currentDate.getDate()) {
                                    return false;
                                }
                            }

                            return true;
                        }

                        return false;
                    }) // only show current employer
                    .map((employment) => employment.organisation)
                    .join(', ')}
            </div>
        </div>
    </Components.SearchResult>
);

export default SearchResult;
