import React from 'react';

import * as Lib from '@lib';
import * as Components from '@components';

type Props = {
    items: Lib.I.NavMenuItem[];
};

const Desktop: React.FC<Props> = (props): JSX.Element => {
    return (
        <nav className='flex mr-12'>
            <ul className='flex'>
                {props.items.map((item) => (
                    <li key={item.value} className='lg:mx-2 md:mx-1 last:mr-0 first:ml-0'>
                        <Components.Link
                            href={item.value}
                            className='p-2 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400'
                        >
                            <span className='font-manrope text-white'>{item.label}</span>
                        </Components.Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Desktop;
