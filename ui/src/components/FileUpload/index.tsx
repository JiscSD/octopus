import React from 'react';
import * as DropZone from 'react-dropzone';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';

type Props = {
    positiveActionCallback: (files: Interfaces.ImagePreview[]) => void;
    negativeActionCallback: () => void;
    loading: boolean;
};

const FileUpload: React.FC<Props> = (props): React.ReactElement => {
    const [previewBase64, setPreviewBase64] = React.useState<Interfaces.ImagePreview[]>([]);

    const onDrop = React.useCallback(async (acceptedFiles: Omit<FileList, 'item'>) => {
        if (acceptedFiles.length) {
            for (const file of Array.from(acceptedFiles)) {
                const base64 = await Helpers.getBase64FromFile(file);
                setPreviewBase64((prevState) => [...prevState, { name: file.name, base64 }]);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = DropZone.useDropzone({ onDrop });

    return (
        <section key="file-upload" className="relative">
            {!!previewBase64.length && (
                <div className="mb-4 grid grid-cols-4 gap-2">
                    {previewBase64.map((file, index) => (
                        <div key={index} className="relative">
                            <img src={file.base64} alt="preview" width={100} />
                            <button
                                onClick={() =>
                                    setPreviewBase64((prevState) => [
                                        ...prevState.filter((item) => item.base64 !== file.base64)
                                    ])
                                }
                                className="absolute right-2 top-2 h-4 w-4 bg-grey-400"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <label
                {...getRootProps()}
                htmlFor="file-upload"
                className="relative flex w-full items-center justify-center rounded border-2 border-dashed border-grey-100 bg-grey-50 py-4 px-8 hover:cursor-pointer"
            >
                <input
                    id="file-upload"
                    name="file-upload"
                    aria-label="File upload"
                    aria-busy={props.loading}
                    {...getInputProps()}
                />
                {isDragActive ? (
                    <span>
                        <OutlineIcons.DownloadIcon className="mx-auto mb-2 w-12 text-grey-200" />
                        <span className="font-montserrat text-base font-medium text-grey-300">Drop here....</span>
                    </span>
                ) : (
                    <span>
                        <OutlineIcons.PhotographIcon className="mx-auto mb-2 w-12 text-grey-200" />
                        <span className="font-montserrat text-base font-medium text-grey-300">
                            Click or drag files here to upload
                        </span>
                    </span>
                )}
            </label>

            <div className="mt-6 flex justify-between space-x-4">
                <Components.ModalButton
                    text="Cancel"
                    title="Cancel"
                    onClick={() => props.negativeActionCallback()}
                    disabled={props.loading}
                    actionType="NEGATIVE"
                />
                <Components.ModalButton
                    text="Upload image"
                    title="Upload image"
                    onClick={() => props.positiveActionCallback(previewBase64)}
                    disabled={props.loading}
                    loading={props.loading}
                    actionType="POSITIVE"
                />
            </div>
        </section>
    );
};

export default FileUpload;
