import { FC, ReactElement } from 'react';
import Link from 'next/link';

type Props = {
    href: string;
    className?: string;
    scroll?: boolean;
    children: ReactElement[] | ReactElement;
};

const CustomLink: FC<Props> = (props): JSX.Element => {
    return (
        <Link href={props.href} scroll={props.scroll}>
            <a className={props.className}>{props.children}</a>
        </Link>
    );
};

export default CustomLink;
