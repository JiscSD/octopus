import React from 'react';
import * as HeadlessUI from '@headlessui/react';
import * as SolidIcons from '@heroicons/react/solid';

import * as Stores from '@stores';

const Toast: React.FC = (): React.ReactElement => {
    const toast = Stores.useToastStore((state) => state.toast);
    const clearToast = Stores.useToastStore((state) => state.clearToast);

    React.useEffect(() => {
        setTimeout(() => {
            if (toast.visible) {
                clearToast();
            }
        }, 6000);
    }, [toast.visible, clearToast]);

    return !!toast.visible ? (
        <div
            aria-live="assertive"
            className="fixed right-5 bottom-8 z-40 flex w-11/12 flex-col items-center space-y-4 sm:items-end lg:bottom-12 lg:right-12 lg:w-full"
        >
            <HeadlessUI.Transition
                show={toast.visible}
                as={React.Fragment}
                enter="transform ease-out duration-350 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-250"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white-50 shadow-lg ring-1 ring-yellow-500 ring-opacity-5 transition-colors duration-500 dark:bg-grey-700">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">{toast.icon}</div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                    {toast.title}
                                </p>
                                {!!toast.message && (
                                    <p className="mt-1 text-sm text-grey-500 transition-colors duration-500 dark:text-grey-50">
                                        {toast.message}
                                    </p>
                                )}
                                {!!toast.dismiss && (
                                    <div className="mt-3 flex space-x-7">
                                        <button
                                            type="button"
                                            className="bg-white -ml-1 rounded-md px-1 text-sm font-medium text-grey-700 transition-colors duration-500 hover:text-grey-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-grey-100 dark:hover:text-white-100"
                                            onClick={() => {
                                                clearToast();
                                            }}
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    className="bg-white inline-flex rounded-full text-teal-500 transition-colors duration-500 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    onClick={() => {
                                        clearToast();
                                    }}
                                >
                                    <span className="sr-only">Close</span>
                                    <SolidIcons.XIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </HeadlessUI.Transition>
        </div>
    ) : (
        <></>
    );
};

export default Toast;
