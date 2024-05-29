import React from 'react';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@/components';

type Props = {
    open: boolean;
    onClose: () => void; // state setter
    positiveActionCallback?: () => void; // state setter
    positiveButtonText?: string;
    negativeActionCallback?: () => void;
    cancelButtonText: string;
    title: string;
    titleClasses?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    loading?: boolean;
};

const Modal: React.FC<Props> = (props) => {
    const cancelButtonRef = React.useRef(null);
    const loading = !!props.loading;
    const showPositiveActionButton = props.positiveActionCallback && props.positiveButtonText;

    return (
        <HeadlessUI.Transition.Root show={props.open} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={loading ? () => {} : props.onClose}
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
                        <div className="relative mx-8 my-20 inline-block w-11/12 transform overflow-hidden rounded-lg bg-white-50 text-left align-bottom shadow-xl transition-all sm:align-middle lg:max-w-3xl xl:max-w-5xl">
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
                                            className={`font-montserrat text-lg font-medium leading-6 text-grey-900${props.titleClasses ? ' ' + props.titleClasses : ''}`}
                                        >
                                            {props.title}
                                        </HeadlessUI.Dialog.Title>
                                        <div className="mt-2">{props.children}</div>
                                    </div>
                                </div>
                                <div
                                    className={`mt-5 flex ${showPositiveActionButton ? 'justify-between' : 'justify-end'} space-x-4 sm:mt-6`}
                                >
                                    {showPositiveActionButton && (
                                        <Components.ModalButton
                                            onClick={() => {
                                                // Shouldn't be necessary but typescript still thinks the function could be undefined
                                                if (props.positiveActionCallback !== undefined)
                                                    props.positiveActionCallback();
                                            }}
                                            disabled={loading}
                                            text={props.positiveButtonText || ''}
                                            title={props.positiveButtonText || ''}
                                            actionType="POSITIVE"
                                        />
                                    )}
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
                                        className="md:w-1/6"
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
