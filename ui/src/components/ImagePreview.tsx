import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    id: string;
    source?: string;
    showClose: boolean;
    close: () => void;
};

const ImagePreview: React.FC<Props> = (props): React.ReactElement => (
    <div
        key={props.id}
        className="relative flex h-full w-full items-center justify-center rounded border-2 border-dashed border-grey-100 p-3"
    >
        {props.showClose && (
            <button
                onClick={() => props.close()}
                className="absolute right-0 -top-3 h-4 w-4 rounded-full focus:outline-yellow-400"
            >
                <OutlineIcons.XCircleIcon className="h-7 w-7 rounded-full bg-white-50 text-pink-500" />
            </button>
        )}

        {props.source ? <img src={props.source} alt="preview" className="w-full object-cover" /> : <></>}
    </div>
);

export default ImagePreview;
