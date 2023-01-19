import React from 'react';
import * as HeadlessUi from '@headlessui/react';
import * as SolidIcon from '@heroicons/react/solid';
import * as tiptap from '@tiptap/react';
import * as Mammoth from 'mammoth';
import * as FAIcons from 'react-icons/fa';
import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Types from '@types';

import TipTapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';

type LetterIconType = {
    letter: string;
};

const LetterIcon: React.FC<LetterIconType> = (props) => (
    <span className="mx-auto block font-bold leading-none tracking-wide text-grey-700">{props.letter}</span>
);

const menuIconStyles = 'p-2 hover:bg-grey-100 hover:rounded focus:outline-yellow-500';
const activeMenuIconStyles = 'p-2 bg-grey-100 rounded focus:outline-yellow-500';

interface MenuBarProps {
    editor: tiptap.Editor;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    importModalVisible: boolean;
    setImportModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBar: React.FC<MenuBarProps> = (props) => {
    const user = Stores.useAuthStore((state) => state.user);

    const headingOptions = React.useMemo(
        () => [
            {
                name: 'Paragraph',
                onClick: () => props.editor.chain().focus().setParagraph().run(),
                className: 'text-normal'
            },
            {
                name: 'Heading 1',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                className: 'text-2xl'
            },
            {
                name: 'Heading 2',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 2 }).run(),
                className: 'text-xl'
            },
            {
                name: 'Heading 3',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 3 }).run(),
                className: 'text-lg'
            },
            {
                name: 'Heading 4',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 4 }).run(),
                className: 'text-md'
            },
            {
                name: 'Heading 5',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 5 }).run(),
                className: 'text-sm'
            },
            {
                name: 'Heading 6',
                onClick: () => props.editor.chain().focus().toggleHeading({ level: 6 }).run(),
                className: 'text-xs text-grey-500'
            }
        ],
        [props.editor]
    );

    const [activeImageUploadType, setActiveImageUploadType] = React.useState<Types.ImageUploadTypes>('FILE_UPLOAD');
    const [selected, setSelected] = React.useState(headingOptions[0]);
    const [linkModalVisible, setLinkModalVisible] = React.useState(false);
    const [imageModalVisible, setImageModalVisible] = React.useState(false);
    const [linkUrl, setLinkUrl] = React.useState('');
    const importDocumentInput = React.useRef(null);
    const [image, setImage] = React.useState<Interfaces.TextEditorImage>({
        name: '',
        alt: '',
        base64: null,
        url: null,
        libraryUrl: null,
        width: null
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | string>(null);

    const openLinkModal = React.useCallback(() => {
        setLinkUrl(props.editor.getAttributes('link').href);
        setLinkModalVisible(true);
    }, [props.editor]);

    const closeLinkModal = React.useCallback(() => {
        setLinkModalVisible(false);
        setLinkUrl('');
    }, []);

    const saveLink = React.useCallback(() => {
        if (linkUrl) {
            props.editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl, target: '_blank' }).run();
        } else {
            props.editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
        closeLinkModal();
    }, [props.editor, linkUrl, closeLinkModal]);

    // TODO wire up remove link if we want to add this in the near future.
    const removeLink = React.useCallback(() => {
        props.editor.chain().focus().extendMarkRange('link').unsetLink().run();
        closeLinkModal();
    }, [props.editor, closeLinkModal]);

    // For File upload
    const handleUploadImage = async (files: Interfaces.ImagePreview[]) => {
        setLoading(true);

        const syncFiles = await Promise.allSettled(
            files.map((file) =>
                api.post<{ id: string; name: string }>(
                    '/images',
                    {
                        name: file.name,
                        image: file.base64
                    },
                    user?.token
                )
            )
        );

        syncFiles.forEach((file) => {
            // check status, only do it for fulfilled
            if (file.status === 'fulfilled') {
                props.editor.commands.setImage({
                    src: `${Config.urls.mediaBucket}/${file.value.data.id}`,
                    alt: 'Coming soon',
                    title: file.value.data.name
                });
            }
        });

        setImageModalVisible(false);
        setLoading(false);
    };

    // For URL source upload
    const handleURLSourceUpload = (url: string) => {
        props.editor.commands.setImage({
            src: url,
            alt: image.alt,
            title: image.name
        });

        clearImageAndCloseModal();
    };

    // Clears the image state and closes the modal
    const clearImageAndCloseModal = () => {
        setImageModalVisible(false);
        setImage({
            name: '',
            alt: '',
            base64: null,
            url: null,
            width: '',
            libraryUrl: null
        });
    };

    // Array buffer helper
    function readFileInputEventAsArrayBuffer(file: any, callback: any) {
        const reader = new FileReader();

        reader.onload = function (loadEvent) {
            var arrayBuffer = loadEvent.target?.result;
            callback(arrayBuffer);
        };

        reader.readAsArrayBuffer(file);
    }

    // For document import
    const handleImportDocument = async (e: React.FormEvent, replace: boolean = false) => {
        e.preventDefault();

        const fileList: React.RefObject<any> = importDocumentInput;

        if (fileList.current?.files) {
            readFileInputEventAsArrayBuffer(fileList.current?.files[0], async (arrayBuffer: any) => {
                try {
                    const result = await Mammoth.convertToHtml(
                        { arrayBuffer: arrayBuffer },
                        {
                            convertImage: Mammoth.images.imgElement((image) =>
                                image.read('base64').then(async (imageBuffer) => {
                                    const syncFile = await api.post<{ id: string; name: string }>(
                                        '/images',
                                        {
                                            name: '',
                                            image: 'data:' + image.contentType + ';base64,' + imageBuffer
                                        },
                                        user?.token
                                    );

                                    props.setImportModalVisible(false);

                                    return {
                                        src: `${Config.urls.mediaBucket}/${syncFile.data.id}`
                                    };
                                })
                            )
                        }
                    );
                    if (replace) {
                        props.editor.commands.setContent(result.value);
                    } else {
                        props.editor.commands.insertContent(result.value);
                    }

                    props.setImportModalVisible(false);
                } catch (err) {
                    setError('Unable to import .docx file. Please re-save your document and try again.');
                }
            });
        }
    };

    React.useEffect(() => {
        if (props.editor) {
            if (props.editor.isActive('heading', { level: 1 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 1');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('heading', { level: 2 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 2');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('heading', { level: 3 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 3');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('heading', { level: 4 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 4');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('heading', { level: 5 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 5');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('heading', { level: 6 })) {
                const option = headingOptions.find((option) => option.name === 'Heading 6');
                if (option) setSelected(option);
                props.setLoading(false);
            }

            if (props.editor.isActive('paragraph')) {
                const option = headingOptions.find((option) => option.name === 'Normal text');
                if (option) setSelected(option);
                props.setLoading(false);
            }
        }
    }, [props.loading, props.setLoading, props.editor, headingOptions]);

    return (
        props.editor && (
            <>
                <div className="flex">
                    <HeadlessUi.Listbox value={selected} onChange={setSelected}>
                        <div className="relative mt-1">
                            <HeadlessUi.Listbox.Button className="relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left hover:cursor-pointer hover:bg-grey-100 focus:outline-yellow-500 sm:text-sm">
                                <span className="block truncate">{selected.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <SolidIcon.SelectorIcon className="h-5 w-5 text-grey-400" aria-hidden="true" />
                                </span>
                            </HeadlessUi.Listbox.Button>
                            <HeadlessUi.Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <HeadlessUi.Listbox.Options className="absolute z-40 mt-1 max-h-60 w-fit rounded-md bg-white-50 py-1 text-base shadow-sm sm:text-sm">
                                    {headingOptions.map((heading, index) => (
                                        <HeadlessUi.Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                `${active ? 'text-slate-800  bg-grey-50' : 'text-slate-600'}
                          relative cursor-default select-none py-2 px-4 ${heading.className}`
                                            }
                                            value={heading}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <button
                                                        className={`${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        } block truncate`}
                                                        onClick={heading.onClick}
                                                        aria-label="Select heading"
                                                    >
                                                        {heading.name}
                                                    </button>
                                                </>
                                            )}
                                        </HeadlessUi.Listbox.Option>
                                    ))}
                                </HeadlessUi.Listbox.Options>
                            </HeadlessUi.Transition>
                        </div>
                    </HeadlessUi.Listbox>

                    <div className="flex max-w-full items-center overflow-x-auto lg:max-w-md xl:max-w-xl 2xl:max-w-full">
                        <span className="mx-2 inline-block h-6 w-[1px] bg-grey-300" />
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
                        <span className="mx-2 inline-block h-6 w-[1px] bg-grey-300" />
                        <button
                            type="button"
                            title="Align Left"
                            onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
                            className={
                                props.editor.isActive({ textAlign: 'left' }) ? activeMenuIconStyles : menuIconStyles
                            }
                        >
                            <FAIcons.FaAlignLeft className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Align Center"
                            onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
                            className={
                                props.editor.isActive({ textAlign: 'center' }) ? activeMenuIconStyles : menuIconStyles
                            }
                        >
                            <FAIcons.FaAlignCenter className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Align Right"
                            onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
                            className={
                                props.editor.isActive({ textAlign: 'right' }) ? activeMenuIconStyles : menuIconStyles
                            }
                        >
                            <FAIcons.FaAlignRight className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-[1px] bg-grey-300" />
                        <button
                            type="button"
                            title="Unordered list"
                            onClick={() => props.editor.chain().focus().toggleBulletList().run()}
                            className={props.editor.isActive('bulletList') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaListUl className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Ordered List"
                            onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
                            className={props.editor.isActive('orderedList') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaListOl className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-[1px] bg-grey-300" />
                        <button
                            type="button"
                            title="Code block"
                            onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
                            className={props.editor.isActive('codeBlock') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaCode className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Quote"
                            onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
                            className={props.editor.isActive('blockquote') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaQuoteRight className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-[1px] bg-grey-300" />
                        <button
                            type="button"
                            title="Link"
                            onClick={openLinkModal}
                            className={props.editor.isActive('link') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaLink className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-px bg-grey-300" />
                        <button
                            type="button"
                            title="Image"
                            onClick={() => {
                                setImage({
                                    name: props.editor.getAttributes('image').title,
                                    alt: props.editor.getAttributes('image').alt,
                                    base64: null,
                                    url: null,
                                    width: '',
                                    libraryUrl: null
                                });
                                setImageModalVisible(true);
                            }}
                            className={props.editor.isActive('image') ? activeMenuIconStyles : menuIconStyles}
                        >
                            <FAIcons.FaImage className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-px bg-grey-300" />
                        <button
                            type="button"
                            title="Horizontal rule"
                            className={props.editor.isActive('horizontalRule') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor.chain().focus().setHorizontalRule().run()}
                        >
                            <FAIcons.FaRulerHorizontal className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <span className="mx-2 inline-block h-6 w-px bg-grey-300" />
                        <button
                            type="button"
                            title="Insert table"
                            className={props.editor.isActive('insertTable') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() =>
                                props.editor
                                    ?.chain()
                                    .focus()
                                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                    .run()
                            }
                        >
                            <FAIcons.FaTable className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Add column"
                            className={props.editor.isActive('addColumnBefore') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor?.chain().focus().addColumnBefore().run()}
                        >
                            <FAIcons.FaColumns className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Stop"
                            className={props.editor.isActive('deleteColumn') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor?.chain().focus().deleteColumn().run()}
                        >
                            <FAIcons.FaStop className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Add row before"
                            className={props.editor.isActive('addRowBefore') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor?.chain().focus().addRowBefore().run()}
                        >
                            <FAIcons.FaPlusSquare className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Delete row"
                            className={props.editor.isActive('deleteRow') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor?.chain().focus().deleteRow().run()}
                        >
                            <FAIcons.FaMinusSquare className="h-3 w-3 text-grey-700" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            title="Delete table"
                            className={props.editor.isActive('deleteTable') ? activeMenuIconStyles : menuIconStyles}
                            onClick={() => props.editor?.chain().focus().deleteTable().run()}
                        >
                            <LetterIcon letter="X" />
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
                </div>
                {/* Link modal */}
                <HeadlessUi.Dialog
                    open={linkModalVisible}
                    onClose={() => setLinkModalVisible(false)}
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <HeadlessUi.Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative top-[30%] mx-auto max-w-sm rounded bg-white-50 p-4 shadow-sm">
                        <HeadlessUi.Dialog.Title className="sr-only">Add your link</HeadlessUi.Dialog.Title>
                        <HeadlessUi.Dialog.Description>
                            <label htmlFor="link" className="mt-4 block text-sm font-medium text-grey-700">
                                Enter your link
                            </label>
                            <div className="mt-2">
                                <input
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    type="text"
                                    name="link"
                                    id="link"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="block w-full rounded-md border-grey-300 shadow-sm placeholder:font-light focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm"
                                />
                            </div>
                        </HeadlessUi.Dialog.Description>

                        <div className="mt-6 flex justify-between">
                            <button
                                className="border-1 inline-flex items-center rounded border border-grey-300 bg-white-50 py-1.5 text-xs font-medium text-grey-700 first:px-2.5 hover:bg-grey-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                onClick={closeLinkModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-sky-50 text-sky-900 hover:bg-sky-100 inline-flex items-center rounded border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                onClick={saveLink}
                            >
                                Add link
                            </button>
                        </div>
                    </div>
                </HeadlessUi.Dialog>

                {/* Image upload modal */}
                <HeadlessUi.Dialog
                    open={imageModalVisible}
                    onClose={() => setImageModalVisible(false)}
                    className="fixed inset-0 z-10 overflow-y-auto"
                >
                    <HeadlessUi.Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative top-[30%] mx-auto w-11/12 rounded bg-white-50 p-4 shadow-sm md:w-9/12 lg:w-160 xl:w-192">
                        <HeadlessUi.Dialog.Title className="sr-only">Add an image</HeadlessUi.Dialog.Title>
                        <HeadlessUi.Dialog.Description>
                            <Components.Tabs
                                tabHead={['File upload', 'URL source']}
                                tabBody={[
                                    <Components.FileUpload
                                        key="file-upload"
                                        positiveActionCallback={handleUploadImage}
                                        negativeActionCallback={clearImageAndCloseModal}
                                        loading={loading}
                                    />,
                                    <Components.URLSourceUpload
                                        key="url-source-upload"
                                        image={image}
                                        positiveActionCallback={handleURLSourceUpload}
                                        negativeActionCallback={clearImageAndCloseModal}
                                    />
                                ]}
                            />
                        </HeadlessUi.Dialog.Description>
                    </div>
                </HeadlessUi.Dialog>

                <HeadlessUi.Dialog
                    open={props.importModalVisible}
                    onClose={() => props.setImportModalVisible(false)}
                    className="fixed inset-0 z-10 overflow-y-auto"
                    title="Document Import"
                >
                    <HeadlessUi.Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative top-[30%] mx-auto w-11/12 rounded bg-white-50 p-4 shadow-sm md:w-9/12 lg:w-128 xl:w-160">
                        <HeadlessUi.Dialog.Title className="sr-only">
                            Import a Word document (.docx only)
                        </HeadlessUi.Dialog.Title>
                        <HeadlessUi.Dialog.Description>
                            <label htmlFor="document-import">
                                <input
                                    name="document-import"
                                    ref={importDocumentInput}
                                    type="file"
                                    aria-label="Choose a Word document"
                                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="cursor-pointer rounded-md text-sm ring-offset-2 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-teal-700 hover:file:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                                <span className="sr-only">Choose a Word document</span>
                            </label>
                            <div className="mt-6 flex justify-between space-x-4">
                                <button
                                    type="submit"
                                    name="insert"
                                    onClick={(e) => handleImportDocument(e, false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-base font-medium text-white-50 shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-teal-600 sm:col-start-1 sm:mt-0 sm:text-sm"
                                >
                                    Insert
                                </button>
                                <button
                                    type="submit"
                                    name="replace"
                                    onClick={(e) => handleImportDocument(e, true)}
                                    disabled={props.editor.isEmpty}
                                    className="mt-3 inline-flex w-full justify-center rounded-md border bg-teal-600 px-4 py-2 text-base font-medium text-white-50 shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-teal-600 sm:col-start-1 sm:mt-0 sm:text-sm"
                                >
                                    Replace existing
                                </button>
                            </div>
                            <div className="mt-6 flex justify-between space-x-4">
                                <Components.ModalButton
                                    onClick={() => props.setImportModalVisible(false)}
                                    disabled={false}
                                    text="Cancel"
                                    title="Cancel"
                                    actionType="NEGATIVE"
                                />
                            </div>
                        </HeadlessUi.Dialog.Description>
                    </div>
                </HeadlessUi.Dialog>
            </>
        )
    );
};

interface TextEditorProps {
    contentChangeHandler: (editor: any) => void;
    defaultContent: string;
    references?: Interfaces.Reference[];
}

const TextEditor: React.FC<TextEditorProps> = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [importModalVisible, setImportModalVisible] = React.useState(false);

    const textEditor = tiptap.useEditor({
        autofocus: true,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right']
            }),
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableHeader,
            TableCell,
            TipTapImage.configure({
                inline: true
            })
        ],
        onUpdate: ({ editor }) => props.contentChangeHandler(editor.getHTML()),
        onSelectionUpdate: () => setLoading(true),
        editorProps: {
            attributes: {
                class: `${Config.values.HTMLStylesTiptapEditor} prose max-w-none mt-6 outline-none min-h-[150px] xl:min-h-[250px] dark:text-grey-800`
            }
        },
        content: props.defaultContent
    });

    return textEditor ? (
        <>
            <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                Your publication can be added via the main text editor, or imported via a Word document (.docx). Once
                imported, your publication can be further edited in the text field.
            </span>
            <button
                onClick={() => setImportModalVisible(true)}
                title="Import from Microsoft Word (.docx)"
                className={`my-4 flex items-center space-x-2 rounded-sm text-sm font-medium text-grey-800 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed dark:text-white-50`}
            >
                <img src="/images/docx.svg" alt="Word Document" className="h-6 w-6" />
                <span>Import from Microsoft Word (.docx)</span>
            </button>

            <div className="mb-4 rounded-md border border-grey-100 bg-white-50 px-4 pt-2 pb-4 shadow focus-within:ring-2 focus-within:ring-yellow-500">
                <MenuBar
                    editor={textEditor}
                    loading={loading}
                    setLoading={setLoading}
                    importModalVisible={importModalVisible}
                    setImportModalVisible={setImportModalVisible}
                />

                <tiptap.EditorContent editor={textEditor} />
            </div>
        </>
    ) : null;
};

export default TextEditor;
