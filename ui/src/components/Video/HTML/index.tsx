import React from 'react';

type Props = {
    srcWebM?: string;
    srcMp4?: string;
    title?: string;
    showCaption: boolean;
    controls: boolean;
    poster?: string;
    width?: number;
    className?: string;
};

const HTML: React.FC<Props> = (props): JSX.Element => (
    <figure
        aria-label={props.title}
        className={`h-fit w-full rounded-lg bg-white p-2 transition-colors duration-500 dark:bg-teal-500 ${
            props.className ? props.className : ''
        }`}
    >
        <video
            controls={props.controls}
            width={props.width}
            poster={props.poster}
            className="rounded-lg outline-0 focus:ring-2 focus:ring-yellow-400"
        >
            <source src={props.srcWebM} type="video/webm" />
            <source src={props.srcMp4} type="video/mp4" />
        </video>

        <figcaption className={`mt-2 block text-right text-sm ${!props.showCaption && 'sr-only'}`}>
            {props.title}
        </figcaption>
    </figure>
);

export default HTML;
