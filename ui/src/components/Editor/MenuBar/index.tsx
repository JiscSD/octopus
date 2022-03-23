import React from 'react';
import * as ReactIconsFA from 'react-icons/fa';
import * as TipTap from '@tiptap/react';

type LetterIconType = {
    letter: string;
};

const LetterIcon: React.FC<LetterIconType> = (props) => (
    <span className="mx-auto block font-bold leading-none tracking-wide">{props.letter}</span>
);

type MenuBarOptionProps = {
    editor: TipTap.Editor | null;
    title: string;
    onClick: () => void;
    className?: string;
    children: React.ReactChild;
};

const MenuBarOption: React.FC<MenuBarOptionProps> = (props) => (
    <button
        onClick={props.onClick}
        title={props.title}
        className={`${
            props.className ? props.className : ''
        } mx-auto flex h-9 w-9 items-center justify-center overflow-hidden rounded border border-grey-100 bg-grey-100 p-1 text-grey-800 outline-0 transition-colors duration-150 focus:ring-2 focus:ring-yellow-400 dark:border-grey-700 dark:bg-grey-800 dark:text-teal-400`}
    >
        {props.children}
    </button>
);

type MenuBarProps = {
    editor: TipTap.Editor | null;
    className?: string;
};

const MenuBar: React.FC<MenuBarProps> = (props): React.ReactElement | null => {
    return props.editor ? (
        <nav
            className={`grid grid-cols-8 justify-evenly gap-2 lg:grid-cols-14 xl:grid-cols-21 ${
                props.className ? props.className : ''
            }`}
        >
            <MenuBarOption
                editor={props.editor}
                title="paragraph"
                onClick={() => props.editor?.chain().focus().setParagraph().run()}
                className={props.editor?.isActive('paragraph') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <LetterIcon letter="p" />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="h2"
                onClick={() => props.editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={props.editor.isActive('heading', { level: 2 }) ? '!bg-teal-500 !text-white-50' : ''}
            >
                <LetterIcon letter="h2" />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="h3"
                onClick={() => props.editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={props.editor.isActive('heading', { level: 3 }) ? '!bg-teal-500 !text-white-50' : ''}
            >
                <LetterIcon letter="h3" />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="h4"
                onClick={() => props.editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                className={props.editor.isActive('heading', { level: 4 }) ? '!bg-teal-500 !text-white-50' : ''}
            >
                <LetterIcon letter="h4" />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="bold"
                onClick={() => props.editor?.chain().focus().toggleBold().run()}
                className={props.editor.isActive('bold') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaBold />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="italic"
                onClick={() => props.editor?.chain().focus().toggleItalic().run()}
                className={props.editor.isActive('italic') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaItalic />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="strike"
                onClick={() => props.editor?.chain().focus().toggleStrike().run()}
                className={props.editor.isActive('strike') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaStrikethrough />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="bullet list"
                onClick={() => props.editor?.chain().focus().toggleBulletList().run()}
                className={props.editor.isActive('bulletList') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaListUl />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="ordered list"
                onClick={() => props.editor?.chain().focus().toggleOrderedList().run()}
                className={props.editor.isActive('orderedList') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaListOl />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="code block"
                onClick={() => props.editor?.chain().focus().toggleCodeBlock().run()}
                className={props.editor.isActive('codeBlock') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaCode />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="blockquote"
                onClick={() => props.editor?.chain().focus().toggleBlockquote().run()}
                className={props.editor.isActive('blockquote') ? '!bg-teal-500 !text-white-50' : ''}
            >
                <ReactIconsFA.FaQuoteLeft />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="horizontal rule"
                onClick={() => props.editor?.chain().focus().setHorizontalRule().run()}
            >
                <ReactIconsFA.FaRulerHorizontal />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="insertTable"
                onClick={() =>
                    props.editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                }
            >
                <ReactIconsFA.FaTable />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="addColumnBefore"
                onClick={() => props.editor?.chain().focus().addColumnBefore().run()}
            >
                <ReactIconsFA.FaColumns />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="deleteColumn"
                onClick={() => props.editor?.chain().focus().deleteColumn().run()}
            >
                <ReactIconsFA.FaStop />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="addRowBefore"
                onClick={() => props.editor?.chain().focus().addRowBefore().run()}
            >
                <ReactIconsFA.FaPlusSquare />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="deleteRow"
                onClick={() => props.editor?.chain().focus().deleteRow().run()}
            >
                <ReactIconsFA.FaMinusSquare />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="deleteTable"
                onClick={() => props.editor?.chain().focus().deleteTable().run()}
            >
                <LetterIcon letter="X" />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="undo"
                onClick={() => props.editor?.chain().focus().undo().run()}
            >
                <ReactIconsFA.FaUndo />
            </MenuBarOption>
            <MenuBarOption
                editor={props.editor}
                title="redo"
                onClick={() => props.editor?.chain().focus().redo().run()}
            >
                <ReactIconsFA.FaRedo />
            </MenuBarOption>
        </nav>
    ) : null;
};

export default MenuBar;
