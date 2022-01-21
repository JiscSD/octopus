import { FC, ReactElement, ReactText } from 'react';

type Props = {
    className?: string;
    children: ReactElement | ReactText;
};

const Pill: FC<Props> = (props): JSX.Element => {
    return (
        <span
            className={`px-2 py-1 font-semibold uppercase text-xxs tracking-widest leading-tight border-2 border-teal-500 rounded-full ${props.className}`}
        >
            {props.children}
        </span>
    );
};

export default Pill;
