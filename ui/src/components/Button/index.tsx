import { FC } from 'react';

import * as Components from '@components';

type Props = {
    href: string;
    title: string;
};

const Button: FC<Props> = (props): JSX.Element => {
    return (
        <span className='rounded-2xl bg-white pt-4 pb-6 px-6 hover:bg-grey-50 transition-colors duration-500'>
            <Components.ExtendedLink href={props.href} title={props.title} className='!text-grey-800' />
        </span>
    );
};

export default Button;
