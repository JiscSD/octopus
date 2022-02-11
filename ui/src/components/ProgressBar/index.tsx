import React from 'react';
import * as Framer from 'framer-motion';

type Props = {
    value: number;
};

const ProgressBar: React.FC<Props> = (props): JSX.Element => (
    <div className="relative w-52">
        <Framer.motion.span
            initial={{ width: 0 }}
            animate={{ width: `${props.value}%` }}
            className="absolute left-0 top-2/4 h-1/2 -translate-y-[50%] rounded-sm bg-teal-500"
        />
    </div>
);

export default ProgressBar;
