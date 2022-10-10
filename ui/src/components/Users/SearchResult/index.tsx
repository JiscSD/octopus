import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Config from '@config';
import * as Assets from '@assets';

type Props = {
    user: Interfaces.CoreUser;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => (
    <Framer.motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 0.35 }}
    >
        <Components.Link
            href={`${Config.urls.viewUser.path}/${props.user.id}`}
            className={`
                grid
                grid-cols-1
                items-start
                gap-4
                overflow-hidden
                border-b
                border-grey-50
                bg-white-50
                py-4
                px-4
                shadow
                outline-0
                transition-colors
                duration-500
                hover:opacity-95
                focus:border-transparent
                focus:opacity-95
                focus:ring-2
                focus:ring-yellow-500
                dark:border-grey-600
                dark:bg-grey-700
                lg:grid-cols-12
                ${props.className ? props.className : ''}
                `}
        >
            <Components.Avatar user={props.user} className="col-span-1 lg:col-span-2" />
            <span className="col-span-6 flex h-full items-center font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                {props.user.firstName}. {props.user?.lastName}
            </span>
            <div className="relative z-20 col-span-4 flex h-full items-center font-light text-grey-600 transition-colors duration-500 dark:text-grey-100 lg:col-span-3">
                {/**
                 * @TODO - will display current author affiliation here
                 * GET /users endpoint doesn't return affiliations atm
                 * This will be handled in OCT-385
                 */}
            </div>
            <OutlineIcons.ChevronRightIcon className="col-span-1 hidden h-5 w-5 self-center justify-self-end text-teal-400 lg:block" />
        </Components.Link>
    </Framer.motion.div>
);

export default SearchResult;
