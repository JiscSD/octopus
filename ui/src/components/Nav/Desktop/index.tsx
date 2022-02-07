import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
};

const Desktop: React.FC<Props> = (props): JSX.Element => {
    return (
        <nav className="mr-6 flex">
            <ul className="flex">
                {props.items.map((item) => (
                    <li key={item.value} className="first:ml-0 last:mr-0 md:mx-1 lg:mx-2">
                        <Components.Link
                            href={item.value}
                            className="rounded border-transparent p-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <span className="font-manrope text-white">{item.label}</span>
                        </Components.Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Desktop;
