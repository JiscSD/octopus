import React from 'react';

import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';

type Props = {
    id: string;
    title: string;
    createdBy: string;
    type: Interfaces.PublicationType;
    date: string;
    content?: string;
};
const CommandPalette: React.FC<Props> = (props): JSX.Element => {
    return (
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.id}`}
            className="mx-4 block border-t border-grey-600 px-2 py-2 outline-0 focus:rounded focus:border-transparent focus:ring-2 focus:ring-yellow-500"
        >
            <span className="leading-0 inline-flex font-montserrat text-xs font-semibold tracking-wide text-purple-300">
                {Helpers.formatPublicationType(props.type)}
            </span>
            <span className="mt-1 block text-sm tracking-wide text-white">{props.title}</span>
            <div className="leading-0 my-2 flex justify-between font-montserrat text-xs text-xxs font-medium tracking-wide text-grey-100">
                <span className="block">{props.createdBy}</span>
                <span className="block">{Helpers.formatDate(props.date)}</span>
            </div>
        </Components.Link>
    );
};

export default CommandPalette;
