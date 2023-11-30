import React from 'react';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';

type Props = {
    open: boolean;
    negativeActionCallback: any;
    cancelButtonText: string;
    title: string;
    subTitle?: string;
    children?: React.ReactNode;
};

const SimpleModal: React.FC<Props> = (props) => {
    const cancelButtonRef = React.useRef(null);

    return (
        <HeadlessUI.Transition.Root show={props.open} as={React.Fragment}>
            <HeadlessUI.Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClose={props.negativeActionCallback}
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
                        <div className="xl:max-w-2 relative mx-8 my-20 inline-block w-11/12 transform overflow-hidden rounded-lg bg-grey-100 px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:px-8 sm:py-6 sm:align-middle lg:max-w-xl">
                            <div>
                                <div className="mt-3 sm:mt-5">
                                    <HeadlessUI.Dialog.Title
                                        as="h3"
                                        className="text-center font-montserrat text-lg font-semibold leading-6 text-grey-900"
                                    >
                                        {props.title}
                                    </HeadlessUI.Dialog.Title>
                                    {props.subTitle && (
                                        <h4 className="mt-6 font-montserrat text-base font-semibold leading-6 text-grey-900">
                                            {props.subTitle}
                                        </h4>
                                    )}
                                    <div className="mt-2">{props.children}</div>
                                </div>
                            </div>
                            <div className="mt-5 flex justify-between space-x-4 sm:mt-6">
                                <Components.ModalButton
                                    onClick={props.negativeActionCallback}
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

export default SimpleModal;
