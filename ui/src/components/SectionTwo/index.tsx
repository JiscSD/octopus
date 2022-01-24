import React from 'react';

import * as Assets from '@assets';

type Props = {
    id?: string;
    className?: string;
    waveFillTop: string;
    waveFillMiddle: string;
    waveFillBottom: string;
    children: React.ReactNode;
};

const SectionTwo: React.FC<Props> = (props): JSX.Element => {
    return (
        <section
            id={props.id && props.id}
            className={`relative transition-colors duration-500 ${props.className && props.className}`}
        >
            <>
                {props.children}
                <Assets.WaveTwo
                    waveFillTop={props.waveFillTop}
                    waveFillMiddle={props.waveFillMiddle}
                    waveFillBottom={props.waveFillBottom}
                />
            </>
        </section>
    );
};

export default SectionTwo;
