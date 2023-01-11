import React from 'react';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';

type Props = {
    open: boolean;
    setOpen: any; // state setter
    positiveActionCallback: any; // state setter
    positiveButtonText: string;
    negativeActionCallback?: any;
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
                <div className="flex min-h-full items-center justify-center text-center">
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
                        <div className="xl:max-w-2 relative mx-8 my-20 inline-block w-11/12 transform overflow-hidden rounded-lg bg-white-50 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:px-8 sm:py-6 sm:align-middle lg:max-w-xl">
                            <div>
                                {!!props.icon && (
                                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full">
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
                            <div className="mt-5 flex justify-between space-x-4 sm:mt-6">
                                <Components.ModalButton
                                    onClick={() => props.positiveActionCallback()}
                                    disabled={props.disableButtons}
                                    text={props.positiveButtonText}
                                    title={props.positiveButtonText}
                                    actionType="POSITIVE"
                                />
                                <Components.ModalButton
                                    onClick={() =>
                                        props.negativeActionCallback
                                            ? props.negativeActionCallback()
                                            : props.setOpen(false)
                                    }
                                    disabled={props.disableButtons}
                                    ref={cancelButtonRef}
                                    text={props.cancelButtonText}
                                    title={props.cancelButtonText}
                                    actionType="NEGATIVE"
                                />
                            </div>
                        </div>
                    </HeadlessUI.Transition.Child>
                </div>
            </HeadlessUI.Dialog>
        </HeadlessUI.Transition.Root>
    );
};

export default Modal;
