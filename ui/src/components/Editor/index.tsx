import React from 'react';
import * as TipTap from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Gapcursor from '@tiptap/extension-gapcursor';

import * as Components from '@components';

import * as Config from '@config';

type EditorProps = {
    content: string;
    changeCallback: (content: string) => void;
};

const Editor: React.FC<EditorProps> = (props): React.ReactElement => {
    const editorConstructor = TipTap.useEditor({
        extensions: [
            StarterKit,
            Gapcursor,
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableHeader,
            TableCell
        ],
        editorProps: {
            attributes: {
                class: `${Config.values.HTMLStyles} rounded-b border border-t-0 border-grey-100 dark:border-teal-500 p-4 outline-0 focus:ring-2 focus:ring-yellow-400 min-h-[400px] 2xl:min-h-[600px] bg-white-50 dark:bg-grey-700`
            }
        },
        onUpdate: ({ editor }) => props.changeCallback(editor.getHTML()),
        content: props.content
    });

    return (
        <div className="overflow-x-auto xl:overflow-visible">
            <Components.EditorMenuBar
                editor={editorConstructor}
                className="rounded-t border border-b-0 border-grey-100 bg-grey-50 p-2 pb-2 transition-colors duration-500 dark:border-teal-500 dark:bg-grey-900"
            />
            <TipTap.EditorContent editor={editorConstructor} />
        </div>
    );
};

export default Editor;
