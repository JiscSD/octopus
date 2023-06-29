import React from 'react';
import * as Router from 'next/router';
import * as Config from '@config';

const Desktop: React.FC = (): React.ReactElement => {
    const router = Router.useRouter();

    return (
        <button
            className="hidden rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 lg:block"
            onClick={(e) => router.push(`${Config.urls.search.path}/publications`)}
        >
            Search
        </button>
    );
};

export default Desktop;
