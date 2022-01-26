import React from 'react';

type Props = {
    embedId: string;
    title: string;
    allowFullScreen: boolean;
    width: number;
    height: number;
};

const YouTube: React.FC<Props> = (props): JSX.Element => (
    <div className="flex h-fit w-full rounded-lg bg-white p-2">
        <iframe
            width={props.width}
            height={props.height}
            src={`https://www.youtube.com/embed/${props.embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={props.allowFullScreen}
            title="Embedded youtube"
            className="rounded-lg"
        />
    </div>
);

export default YouTube;
