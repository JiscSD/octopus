import React from 'react';

type Props = {
    children: React.ReactChildren | React.ReactChild | React.ReactElement;
    delay: number;
};

const Delay: React.FC<Props> = (props): React.ReactElement => {
    const [done, setDone] = React.useState(false);

    React.useEffect(() => {
        const showTimer = setTimeout(() => setDone(true), props.delay);
        return () => clearTimeout(showTimer);
    });

    return done ? <>{props.children}</> : <></>;
};

export default Delay;
