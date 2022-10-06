import React, { useCallback, useEffect, useState } from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as tiptap from '@tiptap/react';
import * as Config from '@config';
import * as HeadlessUI from '@headlessui/react';
import * as Helpers from '@helpers';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import MenuBar from './MenuBar';
import Placeholder from '@tiptap/extension-placeholder';

type Props = {
    title: string;
    reference: Interfaces.Reference | null;
    onSave: (reference: Interfaces.Reference) => void;
    onClose: () => void;
};

const EditReferenceModal: React.FC<Props> = ({ title, reference, onSave, onClose }): React.ReactElement => {
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [referenceLink, setReferenceLink] = useState<string | null | undefined>(null);

    const textEditor = tiptap.useEditor({
        content: reference?.text,
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: 'Add your reference text...',
                emptyEditorClass:
                    'cursor-text before:content-[attr(data-placeholder)] before:absolute before:opacity-60 before-pointer-events-none'
            })
        ],
        onSelectionUpdate: () => setLoading(true),
        editorProps: {
            attributes: {
                class: `${Config.values.HTMLStylesTiptapEditor} mt-6 outline-none min-h-[100px] dark:text-grey-800`
            }
        }
    });

    useEffect(() => {
        if (reference?.id) {
            textEditor?.commands?.setContent(reference.text);
            setReferenceLink(reference.location);
            setSubmitError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reference?.id]);

    const handleReferenceSave = useCallback(() => {
        setSubmitError(null);

        if (!reference || !textEditor) {
            return;
        }

        if (!textEditor.getText().trim()) {
            return setSubmitError('Reference text is required.');
        }

        const htmlString = textEditor.getHTML();
        const paragraphsArray = htmlString.match(/<p>(.*?)<\/p>/g) || [];

        if (paragraphsArray.length > 1) {
            return setSubmitError('New lines are not allowed within the reference text.');
        }

        if (referenceLink) {
            const isValidUrl = Helpers.validateURL(referenceLink?.trim());

            if (!isValidUrl) {
                return setSubmitError('Reference link must be a valid URL starting with "http".');
            }
        }

        onSave({ ...reference, text: htmlString, location: referenceLink?.trim() });
    }, [onSave, reference, referenceLink, textEditor]);

    return (
        <HeadlessUI.Transition.Root show={Boolean(reference)} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                open={true}
                onClose={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-20"
            >
                <HeadlessUI.Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <HeadlessUI.Dialog.Overlay className="fixed inset-0 bg-grey-800 bg-opacity-75 transition-opacity dark:bg-grey-900" />
                </HeadlessUI.Transition.Child>

                <HeadlessUI.Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div className="transition-alls relative w-11/12 transform overflow-hidden rounded-lg bg-white-50 px-4 pt-5 pb-4 shadow-xl sm:px-8 sm:py-6 sm:align-middle lg:max-w-3xl">
                        <HeadlessUI.Dialog.Title
                            as="h3"
                            className="pb-4 text-center font-montserrat text-lg font-medium leading-6 text-grey-900"
                        >
                            {title}
                        </HeadlessUI.Dialog.Title>
                        <h4 className="flex space-x-1 pb-1 font-montserrat text-base font-medium text-grey-800 transition-colors duration-500 dark:text-white-100">
                            Reference text
                        </h4>
                        {textEditor && (
                            <div className="w-full rounded-md border border-grey-100 bg-white-50 p-4 shadow focus-within:ring-2 focus-within:ring-yellow-500">
                                <MenuBar editor={textEditor} loading={loading} setLoading={setLoading} />
                                <tiptap.EditorContent editor={textEditor} />
                            </div>
                        )}

                        <h4 className="mt-8 flex space-x-1 pb-1 font-montserrat text-base font-medium text-grey-800 transition-colors duration-500 dark:text-white-100">
                            Reference link
                        </h4>

                        <input
                            className="w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow outline-none focus:ring-2 focus:ring-yellow-400"
                            autoComplete="off"
                            placeholder="Add your reference link..."
                            value={referenceLink || ''}
                            onChange={(e) => setReferenceLink(e.target.value)}
                        />

                        {submitError && <Components.Alert severity="WARNING" title={submitError} className="mt-4" />}

                        <div className="mt-6 flex justify-between space-x-4">
                            <Components.ModalButton
                                text="Save"
                                title="Save"
                                onClick={handleReferenceSave}
                                actionType="POSITIVE"
                            />
                            <Components.ModalButton
                                text="Cancel"
                                title="Cancel"
                                onClick={onClose}
                                actionType="NEGATIVE"
                            />
                        </div>
                    </div>
                </HeadlessUI.Transition.Child>
            </HeadlessUI.Dialog>
        </HeadlessUI.Transition.Root>
    );
};

export default React.memo(EditReferenceModal);
