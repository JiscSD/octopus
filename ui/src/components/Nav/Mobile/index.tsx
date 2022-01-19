import { FC } from 'react';

interface Item {
    label: string;
    value: string;
}

type Props = {
    items: Item[];
};

const Mobile: FC<Props> = (props): JSX.Element => {
    return <>Mobile Nav here</>;
};

export default Mobile;
