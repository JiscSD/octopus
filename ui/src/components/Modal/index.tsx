import React from 'react';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';

type Props = {
    open: boolean;
    onClose: any; // state setter
    positiveActionCallback: any; // state setter
    positiveButtonText: string;
    negativeActionCallback?: any;
    cancelButtonText: string;
    title: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    loading?: boolean;
};

const Modal: React.FC<Props> = (props) => {
    const cancelButtonRef = React.useRef(null);
    const loading = !!props.loading;

    return (
        <HeadlessUI.Transition.Root show={props.open} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={props.onClose}
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
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="xl:max-w-2 relative mx-8 my-20 inline-block w-11/12 transform overflow-hidden rounded-lg bg-white-50 text-left align-bottom shadow-xl transition-all sm:align-middle lg:max-w-xl">
                            <Components.ModalBarLoader loading={loading} />
                            <div className="px-4 pb-4 pt-5 sm:px-8 sm:py-6">
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
                                        disabled={loading}
                                        text={props.positiveButtonText}
                                        title={props.positiveButtonText}
                                        actionType="POSITIVE"
                                    />
                                    <Components.ModalButton
                                        onClick={() =>
                                            props.negativeActionCallback
                                                ? props.negativeActionCallback()
                                                : props.onClose()
                                        }
                                        disabled={loading}
                                        ref={cancelButtonRef}
                                        text={props.cancelButtonText}
                                        title={props.cancelButtonText}
                                        actionType="NEGATIVE"
                                    />
                                </div>
                            </div>
                        </div>
                    </HeadlessUI.Transition.Child>
                </div>
            </HeadlessUI.Dialog>
        </HeadlessUI.Transition.Root>
    );
};

export default Modal;
