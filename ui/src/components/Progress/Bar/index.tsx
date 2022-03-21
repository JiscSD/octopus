import React from 'react';
import * as Framer from 'framer-motion';

type Props = {
    value: number;
    color: string;
    width: number;
    className?: string;
};

const Bar: React.FC<Props> = (props): React.ReactElement => (
    <div
        style={{ width: props.width ? props.width : 0 }}
        className={`relative ${props.className ? props.className : ''}`}
    >
        <Framer.motion.span
            initial={{ width: 0 }}
            animate={{ width: `${props.value ? props.value : 0}%` }}
            className="absolute left-0 top-2/4 h-1/3 -translate-y-[50%] rounded-sm bg-teal-500"
            style={{ backgroundColor: props.color }}
        />
    </div>
);

export default Bar;
