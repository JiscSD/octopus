import React from 'react';

type Props = {
    embedId: string;
    title: string;
    allowFullScreen: boolean;
    width: number;
    height: number;
};

const YouTube: React.FC<Props> = (props): JSX.Element => (
    <div className="flex h-fit w-full rounded-lg bg-white p-2 transition-colors duration-500 dark:bg-teal-500 ">
        <iframe
            width={props.width}
            height={props.height}
            src={`https://www.youtube.com/embed/${props.embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={props.allowFullScreen}
            title={props.title}
            className="rounded-lg outline-0 focus:ring-2 focus:ring-yellow-400"
        />
    </div>
);

export default YouTube;
