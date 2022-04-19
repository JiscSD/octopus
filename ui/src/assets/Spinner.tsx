import React from 'react';

type Props = {
    width: number;
    height: number;
    className?: string;
};

const Spinner: React.FC<Props> = (props): React.ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width}
        height={props.height}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className={`animate-spin ${props.className ?? ''}`}
    >
        <circle
            cx="50"
            cy="50"
            fill="none"
            strokeWidth="10"
            r="35"
            strokeDasharray="164.93361431346415 56.97787143782138"
            transform="matrix(1,0,0,1,0,0)"
            style={{ transform: 'matrix(1, 0, 0, 1, 0, 0)', animationPlayState: 'paused' }}
        ></circle>
    </svg>
);

export default Spinner;
