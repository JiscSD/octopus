import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publicationRef: Interfaces.PublicationRef;
    showType: boolean;
};

const Link: React.FC<Props> = (props) => (
    <div className="mb-2">
        {props.showType && (
            <span className="mt-2 mb-1 mr-4 block text-sm">
                {Helpers.formatPublicationType(props.publicationRef.type)}
            </span>
        )}
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.publicationRef.id}`}
            className="block w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
        >
            <span className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                {props.publicationRef.title}
            </span>
        </Components.Link>
    </div>
);

export default Link;
