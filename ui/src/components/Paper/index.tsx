import { FC, ReactElement } from 'react';

type Props = {
    children: ReactElement | ReactElement[];
};

const Paper: FC<Props> = (props): JSX.Element => {
    return (
        <div className="py-8 px-6 bg-white dark:bg-grey-900 rounded-xl shadow-lg transition-colors duration-500">
            {props.children}
        </div>
    );
};

export default Paper;
