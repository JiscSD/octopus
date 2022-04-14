import React from 'react';
import * as Router from 'next/router';

import * as Helpers from '@helpers';
import * as Config from '@config';

const Desktop: React.FC = (): React.ReactElement => {
    const router = Router.useRouter();

    return (
        <button
            className="hidden rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 lg:block"
            onClick={(e) =>
                router.push({
                    pathname: Config.urls.search.path
                })
            }
        >
            Search
            <span className="ml-2 text-sm text-teal-300 transition-colors duration-500 dark:text-grey-500">
                {Helpers.setOSKey()}
            </span>
        </button>
    );
};

export default Desktop;
