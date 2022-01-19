import { FC } from 'react';

interface Item {
    label: string;
    value: string;
}

type Props = {
    items: Item[];
};

const Desktop: FC<Props> = (props): JSX.Element => {
    return <>Desktop nav here</>;
};

export default Desktop;
