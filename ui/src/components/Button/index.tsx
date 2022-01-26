import React from 'react';

import * as Components from '@components';

type Props = {
    href: string;
    title: string;
};

const Button: React.FC<Props> = (props): JSX.Element => {
    return (
        <span className="rounded-2xl bg-white px-6 pt-4 pb-6 transition-colors duration-500 hover:bg-grey-50">
            <Components.ExtendedLink href={props.href} title={props.title} className="!text-grey-800" />
        </span>
    );
};

export default Button;
