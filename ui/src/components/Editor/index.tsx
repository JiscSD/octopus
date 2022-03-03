import React from 'react';
import * as TipTap from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Gapcursor from '@tiptap/extension-gapcursor';

import * as Config from '@config';

type MenuBarOptionProos = {
    editor: TipTap.Editor | null;
    label: string;
    onClick: () => void;
    className?: string;
};

const MenuBarOption: React.FC<MenuBarOptionProos> = (props) => (
    <button onClick={props.onClick} className={`${props.className ? props.className : ''} bg-yellow-500`}>
        {props.label}
    </button>
);

type MenuBarProps = {
    editor: TipTap.Editor | null;
    className?: string;
};

const MenuBar: React.FC<MenuBarProps> = (props): JSX.Element | null => {
    return props.editor ? (
        <>
            {/** Typography */}
            <nav
                className={`grid grid-cols-5 justify-evenly gap-2 lg:grid-cols-8 xl:grid-cols-19 ${
                    props.className ? props.className : ''
                }`}
            >
                <MenuBarOption
                    editor={props.editor}
                    label="paragraph"
                    onClick={() => props.editor?.chain().focus().setParagraph().run()}
                    className={props.editor?.isActive('paragraph') ? 'is-active' : ''}
                />
                {/* <MenuBarOption
                editor={props.editor}
                label="h1"
                onClick={() => props.editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={props.editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            /> */}
                <MenuBarOption
                    editor={props.editor}
                    label="h2"
                    onClick={() => props.editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={props.editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="h3"
                    onClick={() => props.editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={props.editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="h4"
                    onClick={() => props.editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={props.editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="h5"
                    onClick={() => props.editor?.chain().focus().toggleHeading({ level: 5 }).run()}
                    className={props.editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="h6"
                    onClick={() => props.editor?.chain().focus().toggleHeading({ level: 6 }).run()}
                    className={props.editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="bold"
                    onClick={() => props.editor?.chain().focus().toggleBold().run()}
                    className={props.editor.isActive('bold') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="italic"
                    onClick={() => props.editor?.chain().focus().toggleItalic().run()}
                    className={props.editor.isActive('italic') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="strike"
                    onClick={() => props.editor?.chain().focus().toggleStrike().run()}
                    className={props.editor.isActive('strike') ? 'is-active' : ''}
                />
                {/* <MenuBarOption
                editor={props.editor}
                label="code"
                onClick={() => props.editor?.chain().focus().toggleCode().run()}
                className={props.editor.isActive('code') ? 'is-active' : ''}
            /> */}
                <MenuBarOption
                    editor={props.editor}
                    label="clear marks"
                    onClick={() => props.editor?.chain().focus().unsetAllMarks().run()}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="clear nodes"
                    onClick={() => props.editor?.chain().focus().clearNodes().run()}
                />

                <MenuBarOption
                    editor={props.editor}
                    label="bullet list"
                    onClick={() => props.editor?.chain().focus().toggleBulletList().run()}
                    className={props.editor.isActive('bulletList') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="ordered list"
                    onClick={() => props.editor?.chain().focus().toggleOrderedList().run()}
                    className={props.editor.isActive('orderedList') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="code block"
                    onClick={() => props.editor?.chain().focus().toggleCodeBlock().run()}
                    className={props.editor.isActive('codeBlock') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="blockquote"
                    onClick={() => props.editor?.chain().focus().toggleBlockquote().run()}
                    className={props.editor.isActive('blockquote') ? 'is-active' : ''}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="horizontal rule"
                    onClick={() => props.editor?.chain().focus().setHorizontalRule().run()}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="hard break"
                    onClick={() => props.editor?.chain().focus().setHardBreak().run()}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="undo"
                    onClick={() => props.editor?.chain().focus().undo().run()}
                />
                <MenuBarOption
                    editor={props.editor}
                    label="redo"
                    onClick={() => props.editor?.chain().focus().redo().run()}
                />
            </nav>
            {/** Tables */}
            <nav
                className={`grid grid-cols-5 justify-evenly gap-2 lg:grid-cols-8 xl:grid-cols-15 ${
                    props.className ? props.className : ''
                }`}
            >
                <button
                    onClick={() =>
                        props.editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                >
                    insertTable
                </button>
                <button onClick={() => props.editor?.chain().focus().addColumnBefore().run()}>addColumnBefore</button>
                <button onClick={() => props.editor?.chain().focus().addColumnAfter().run()}>addColumnAfter</button>
                <button onClick={() => props.editor?.chain().focus().deleteColumn().run()}>deleteColumn</button>
                <button onClick={() => props.editor?.chain().focus().addRowBefore().run()}>addRowBefore</button>
                <button onClick={() => props.editor?.chain().focus().addRowAfter().run()}>addRowAfter</button>
                <button onClick={() => props.editor?.chain().focus().deleteRow().run()}>deleteRow</button>
                <button onClick={() => props.editor?.chain().focus().deleteTable().run()}>deleteTable</button>
                <button onClick={() => props.editor?.chain().focus().mergeCells().run()}>mergeCells</button>
                <button onClick={() => props.editor?.chain().focus().splitCell().run()}>splitCell</button>
                <button onClick={() => props.editor?.chain().focus().mergeOrSplit().run()}>mergeOrSplit</button>
                <button onClick={() => props.editor?.chain().focus().setCellAttribute('colspan', 2).run()}>
                    setCellAttribute
                </button>
                <button onClick={() => props.editor?.chain().focus().goToNextCell().run()}>goToNextCell</button>
                <button onClick={() => props.editor?.chain().focus().goToPreviousCell().run()}>goToPreviousCell</button>
            </nav>
        </>
    ) : null;
};

type EditorProps = {
    content: string;
    changeCallback: (content: string) => void;
};

const Editor: React.FC<EditorProps> = (props): JSX.Element => {
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
                class: `${Config.values.HTMLStyles} rounded border border-teal-500 p-4 outline-0 focus:ring-2 focus:ring-yellow-400 min-h-[400px] bg-white dark:bg-grey-700`
            }
        },
        onUpdate: ({ editor }) => props.changeCallback(editor.getHTML()),
        content: props.content
    });

    return (
        <div className="">
            <MenuBar editor={editorConstructor} className="mb-6" />
            <TipTap.EditorContent editor={editorConstructor} className="" />
        </div>
    );
};

export default Editor;
