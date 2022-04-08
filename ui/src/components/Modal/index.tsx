import React from 'react';
import * as HeadlessUI from '@headlessui/react';

type Props = {
    open: boolean;
    setOpen: any; // state setter
    positiveActionCallback: any; // state setter
    positiveButtonText: string;
    cancelButtonText: string;
    title: string;
    icon?: React.ReactNode;
    disableButtons?: boolean;
    children?: React.ReactChildren | React.ReactChild[] | React.ReactChild;
};

const Modal: React.FC<Props> = (props) => {
    const cancelButtonRef = React.useRef(null);

    return (
        <HeadlessUI.Transition.Root show={props.open} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={props.setOpen} // Ah, this expects a boolean toggle state, so passing the state setter here for the 'onClose' auto sets it to false
            >
                <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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

                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <HeadlessUI.Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="relative inline-block w-11/12 transform overflow-hidden rounded-lg bg-white-50 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:p-6 sm:align-middle lg:max-w-xl">
                            <div>
                                {!!props.icon && (
                                    <div className="bg-green-100 mx-auto flex h-8 w-8 items-center justify-center rounded-full">
                                        {props.icon}
                                    </div>
                                )}
                                <div className="mt-3 text-center sm:mt-5">
                                    <HeadlessUI.Dialog.Title
                                        as="h3"
                                        className="font-montserrat text-lg font-medium leading-6 text-grey-900"
                                    >
                                        {props.title}
                                    </HeadlessUI.Dialog.Title>
                                    <div className="mt-2">{props.children}</div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-base font-medium text-white-50 shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-teal-600 sm:col-start-2 sm:text-sm"
                                    onClick={() => props.positiveActionCallback()}
                                    disabled={props.disableButtons}
                                >
                                    {props.positiveButtonText}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-grey-300 bg-pink-600 px-4 py-2 text-base font-medium text-white-50 shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-pink-600 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    onClick={() => props.setOpen(false)}
                                    disabled={props.disableButtons}
                                    ref={cancelButtonRef}
                                >
                                    {props.cancelButtonText}
                                </button>
                            </div>
                        </div>
                    </HeadlessUI.Transition.Child>
                </div>
            </HeadlessUI.Dialog>
        </HeadlessUI.Transition.Root>
    );
};

export default Modal;
