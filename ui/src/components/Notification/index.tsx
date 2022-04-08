import React from 'react';
import * as HeadlessUI from '@headlessui/react';
import * as SolidIcons from '@heroicons/react/solid';

import * as Stores from '@stores';

const Notification = (): React.ReactElement => {
    const notificationStore = Stores.useNoficiationStore();

    // React.useEffect(() => {
    //     if (!notificationStore.visible) {
    //         notificationStore.setTitle(undefined);
    //         notificationStore.setMessage(undefined);
    //         notificationStore.setIcon(undefined);
    //         notificationStore.setDismiss(false);
    //     }
    // }, [notificationStore.visible]);

    return (
        <div
            aria-live="assertive"
            className="fixed right-12 bottom-12 z-40 flex w-full flex-col items-center space-y-4 sm:items-end"
        >
            <HeadlessUI.Transition
                show={notificationStore.visible}
                as={React.Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white-50 shadow-lg ring-1 ring-yellow-500 ring-opacity-5 transition-colors duration-500 dark:bg-grey-700">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">{notificationStore.icon}</div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                                    {notificationStore.title}
                                </p>
                                {!!notificationStore.message && (
                                    <p className="mt-1 text-sm text-grey-500 transition-colors duration-500 dark:text-grey-50">
                                        {notificationStore.message}
                                    </p>
                                )}
                                {!!notificationStore.dismiss && (
                                    <div className="mt-3 flex space-x-7">
                                        <button
                                            type="button"
                                            className="bg-white -ml-1 rounded-md px-1 text-sm font-medium text-grey-700 transition-colors duration-500 hover:text-grey-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:text-grey-100 dark:hover:text-white-100"
                                            onClick={() => {
                                                notificationStore.toggleVisibility(false);
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
                                        notificationStore.toggleVisibility(false);
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
    );
};

export default Notification;
