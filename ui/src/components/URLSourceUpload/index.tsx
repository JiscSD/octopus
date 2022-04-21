import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    image: Interfaces.TextEditorImage;
    positiveActionCallback: (url: string) => void;
    negativeActionCallback: () => void;
};

const URLSourceUpload: React.FC<Props> = (props): React.ReactElement => {
    const [url, setUrl] = React.useState<null | string>(null);

    return (
        <section key="url-source" className="space-y-10">
            {!!url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="Image preview" className="mx-auto max-h-80 w-80" />
            ) : (
                <div className="mx-auto h-80 w-80 border-2 border-dashed border-grey-400 bg-grey-200">
                    <span>Your image here</span>
                </div>
            )}

            <input type="text" placeholder="Paste in your url to an image" onChange={(e) => setUrl(e.target.value)} />

            <div className="mt-6 flex justify-between">
                <button
                    className="border-1 inline-flex items-center rounded border border-grey-300 bg-white-50 py-1.5 text-xs font-medium text-grey-700 first:px-2.5 hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    onClick={props.negativeActionCallback}
                >
                    Cancel
                </button>
                <button
                    className="bg-sky-50 text-sky-900 hover:bg-sky-100 inline-flex items-center rounded border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    disabled={!url}
                    onClick={() => {
                        url && props.positiveActionCallback(url);
                    }}
                >
                    Add image
                </button>
            </div>
        </section>
    );
};

export default URLSourceUpload;
