import React, { useState } from 'react';

import * as Components from '@components';
import * as OutlineIcons from '@heroicons/react/outline';
import * as tiptap from '@tiptap/react';
import * as Config from '@config';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import MenuBar from './MenuBar';

type AddReferencesProps = {
    addReferences: (editorContent: string) => void;
};

const AddReferences: React.FC<AddReferencesProps> = ({ addReferences }) => {
    const [loading, setLoading] = useState(true);
    const textEditor = tiptap.useEditor({
        extensions: [StarterKit, Underline],
        onSelectionUpdate: () => setLoading(true),
        editorProps: {
            attributes: {
                class: `${Config.values.HTMLStylesTiptapEditor} mt-6 outline-none min-h-[100px] dark:text-grey-800`
            }
        }
    });

    return (
        <div className="flex flex-col items-end">
            {textEditor && (
                <div className="mb-4 w-full rounded-md border border-grey-100 bg-white-50 p-4 shadow focus-within:ring-2 focus-within:ring-yellow-500">
                    <MenuBar editor={textEditor} loading={loading} setLoading={setLoading} />
                    <tiptap.EditorContent editor={textEditor} />
                </div>
            )}

            <Components.Button
                link
                onClick={(e) => {
                    if (!textEditor) {
                        return;
                    }

                    // don't add empty paragraphs
                    if (!textEditor?.getText().trim()) {
                        return;
                    }

                    addReferences(textEditor.getHTML());
                    textEditor?.commands.clearContent(true);
                }}
                title={'Add references'}
                iconPosition={'RIGHT'}
                icon={
                    <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                }
            />
        </div>
    );
};

export default React.memo(AddReferences);
