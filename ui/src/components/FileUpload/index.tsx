import React from 'react';
import * as DropZone from 'react-dropzone';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';

type Props = {
    positiveActionCallback: (files: Interfaces.ImagePreview[]) => void;
    negativeActionCallback: () => void;
    loading: boolean;
    uploadErrors?: string[];
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
        <section className="relative">
            {!!previewBase64.length && (
                <div className="mb-8 grid max-h-72 grid-cols-4 gap-4 overflow-y-auto overflow-x-hidden rounded p-4">
                    {previewBase64.map((file, index) => (
                        <Components.ImagePreview
                            key={index}
                            id={file.name}
                            source={file.base64}
                            showClose
                            close={() =>
                                setPreviewBase64((prevState) => [
                                    ...prevState.filter((item) => item.base64 !== file.base64)
                                ])
                            }
                        />
                    ))}
                </div>
            )}

            <label
                {...getRootProps()}
                htmlFor="file-upload"
                className="relative flex w-full items-center justify-center rounded border-2 border-dashed border-grey-100 bg-grey-50 px-8 py-4 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
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
                        <OutlineIcons.ArrowDownTrayIcon className="mx-auto mb-2 w-12 text-grey-200" />
                        <span className="font-montserrat text-base font-medium text-grey-300">Drop here....</span>
                    </span>
                ) : (
                    <span>
                        <OutlineIcons.PhotoIcon className="mx-auto mb-2 w-12 text-grey-200" />
                        <span className="font-montserrat text-base font-medium text-grey-300">
                            Click or drag files here to upload
                        </span>
                    </span>
                )}
            </label>

            {Boolean(props.uploadErrors?.length) && (
                <Components.Alert
                    data-testid="upload-error"
                    severity="ERROR"
                    title="File upload error"
                    details={props.uploadErrors}
                    className="mt-4 w-full"
                />
            )}

            <div className="mt-6 flex justify-between space-x-4">
                <Components.ModalButton
                    text="Upload image"
                    title="Upload image"
                    onClick={() => props.positiveActionCallback(previewBase64)}
                    disabled={props.loading || !previewBase64.length}
                    loading={props.loading}
                    actionType="POSITIVE"
                />
                <Components.ModalButton
                    text="Cancel"
                    title="Cancel"
                    onClick={() => props.negativeActionCallback()}
                    disabled={props.loading}
                    actionType="NEGATIVE"
                />
            </div>
        </section>
    );
};

export default FileUpload;
