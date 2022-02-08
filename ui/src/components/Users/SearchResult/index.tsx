import React from 'react';
import * as Framer from 'framer-motion';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    id: string;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): JSX.Element => {
    return (
        <Framer.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Components.Link
                href={`${Config.urls.viewUser.path}/${props.id}`}
                className={`mx-4 block border-t border-grey-600 px-2 py-2 outline-0 focus:rounded focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${props.className}`}
            >
                <span>{props.id}</span>
            </Components.Link>
        </Framer.motion.div>
    );
};

export default SearchResult;
