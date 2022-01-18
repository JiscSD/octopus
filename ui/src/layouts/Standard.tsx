import { FC } from 'react';

type Props = { children: React.ReactNode };

const Standard: FC<Props> = (props) => {
    return (
        <>
            <header>Header here</header>
            <main>{props.children}</main>
            <footer></footer>
        </>
    );
};

export default Standard;
