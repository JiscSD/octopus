import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as tiptap from '@tiptap/react';
import * as Config from '@config';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
interface MenuBarProps {
    editor: tiptap.Editor;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

type Props = {
    positiveActionCallback: (reference: Interfaces.Reference) => void;
    negativeActionCallback: () => void;
    MenuBar: React.FC<MenuBarProps>;
    reference: Interfaces.Reference;
    loading: boolean;
}

const EditReference: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(true);
    const textEditor = tiptap.useEditor({
        content: props.reference.text,
        extensions: [StarterKit, Underline],
        onSelectionUpdate: () => setLoading(true),
        editorProps: {
            attributes: {
                class: `${Config.values.HTMLStylesTiptapEditor} mt-6 outline-none min-h-[100px] xl:min-h-[200px] dark:text-grey-800`
            }
        }
    });

    return (
        <>
        {textEditor && (
            <div className="w-full rounded-md border border-grey-100 bg-white-50 p-4 shadow focus-within:ring-2 focus-within:ring-yellow-500">
                <props.MenuBar editor={textEditor} loading={loading} setLoading={setLoading} />
                <tiptap.EditorContent editor={textEditor} />
            </div>
        )}
        <div className="mt-6 flex justify-between space-x-4">
                <Components.ModalButton
                    text="Cancel"
                    title="Cancel"
                    onClick={() => props.negativeActionCallback()}
                    disabled={props.loading}
                    actionType="NEGATIVE"
                />
                <Components.ModalButton
                    text="Save"
                    title="Save"
                    onClick={() => props.positiveActionCallback(props.reference)}
                    disabled={props.loading}
                    loading={props.loading}
                    actionType="POSITIVE"
                />
            </div>
        </>
    )
}

export default EditReference;