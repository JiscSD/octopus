import React from 'react';

import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Config from '@/config';

type Props = {
    topic: Interfaces.BaseTopic;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => (
    <Components.SearchResult
        className={props.className + ' py-7'}
        linkDestination={`${Config.urls.viewTopic.path}/${props.topic.id}`}
    >
        <h2 className="col-span-7 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
            {props.topic.title}
        </h2>
    </Components.SearchResult>
);

export default SearchResult;
