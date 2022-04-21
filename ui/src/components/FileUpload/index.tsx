import React from 'react';

import * as Assets from '@assets';

type Props = {
    inputCallBack: (e: any) => void; // fix the any
    positiveActionCallback: () => void;
    negativeActionCallback: () => void;
    loading: boolean;
};

const FileUpload: React.FC<Props> = (props): React.ReactElement => (
    <section key="file-upload" className="relative">
        {props.loading && <Assets.Spinner width={25} height={25} className="absolute top-5 right-5 stroke-teal-500" />}

        <input
            type="file"
            onChange={(e) => props.inputCallBack(e)}
            accept="image/png, image/jpeg, image/jpg"
            disabled={props.loading}
        />

        <div className="mt-6 flex justify-between">
            <button
                className="border-1 inline-flex items-center rounded border border-grey-300 bg-white-50 py-1.5 text-xs font-medium text-grey-700 first:px-2.5 hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                onClick={props.negativeActionCallback}
                disabled={props.loading}
            >
                Cancel
            </button>
            <button
                className="bg-sky-50 text-sky-900 hover:bg-sky-100 inline-flex items-center rounded border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                onClick={props.positiveActionCallback}
                disabled={props.loading}
            >
                Upload image
            </button>
        </div>
    </section>
);

export default FileUpload;
