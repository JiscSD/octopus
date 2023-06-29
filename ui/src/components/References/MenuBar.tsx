import * as React from 'react';
import * as FAIcons from 'react-icons/fa';
import * as tiptap from '@tiptap/react';

const menuIconStyles = 'p-2 hover:bg-grey-100 hover:rounded focus:outline-yellow-500';
const activeMenuIconStyles = 'p-2 bg-grey-100 rounded focus:outline-yellow-500';

type MenuBarProps = {
    editor: tiptap.Editor;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuBar: React.FC<MenuBarProps> = (props) => {
    return (
        props.editor && (
            <div className="flex items-center">
                <button
                    type="button"
                    title="Bold"
                    onClick={() => props.editor.chain().focus().toggleBold().run()}
                    className={props.editor.isActive('bold') ? activeMenuIconStyles : menuIconStyles}
                >
                    <FAIcons.FaBold className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    title="Italic"
                    onClick={() => props.editor.chain().focus().toggleItalic().run()}
                    className={props.editor.isActive('italic') ? activeMenuIconStyles : menuIconStyles}
                >
                    <FAIcons.FaItalic className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    title="Strikethrough"
                    onClick={() => props.editor.chain().focus().toggleStrike().run()}
                    className={props.editor.isActive('strike') ? activeMenuIconStyles : menuIconStyles}
                >
                    <FAIcons.FaStrikethrough className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    title="Underline"
                    onClick={() => props.editor.chain().focus().toggleUnderline().run()}
                    className={props.editor.isActive('underline') ? activeMenuIconStyles : menuIconStyles}
                >
                    <FAIcons.FaUnderline className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>

                <span className="mx-2 inline-block h-6 w-px bg-grey-300" />
                <button
                    type="button"
                    title="Undo"
                    className={props.editor.isActive('undo') ? activeMenuIconStyles : menuIconStyles}
                    onClick={() => props.editor.chain().focus().undo().run()}
                >
                    <FAIcons.FaUndo className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    title="Redo"
                    className={props.editor.isActive('redo') ? activeMenuIconStyles : menuIconStyles}
                    onClick={() => props.editor.chain().focus().redo().run()}
                >
                    <FAIcons.FaRedo className="h-3 w-3 text-grey-700" aria-hidden="true" />
                </button>
            </div>
        )
    );
};

export default React.memo(MenuBar);
