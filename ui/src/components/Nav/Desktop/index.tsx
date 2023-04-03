import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
};

const Desktop: React.FC<Props> = (props): React.ReactElement => (
    <nav>
        <ul className="flex items-center">
            {props.items.map((item) => (
                <li key={item.value} className="first:ml-0 last:mr-0 md:mx-1 lg:mx-2">
                    {item.subItems?.length ? (
                        <HeadlessUI.Menu as="div" className="relative inline-block text-left">
                            <HeadlessUI.Menu.Button
                                data-testid="username-button"
                                className="rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50"
                            >
                                <span className="flex items-center">
                                    {item.label}
                                    <OutlineIcons.ChevronDownIcon className="ml-2 h-4 w-4 text-grey-500 transition-colors duration-500 dark:text-teal-500" />
                                </span>
                            </HeadlessUI.Menu.Button>
                            <HeadlessUI.Transition
                                as="div"
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <HeadlessUI.Menu.Items
                                    as="ul"
                                    className="divide-gray-100 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-grey-200 divide-opacity-40 rounded-md border-2 border-transparent bg-white-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-teal-600 dark:border-teal-500 dark:bg-grey-800"
                                >
                                    {item.subItems.map((subItem, index) => (
                                        <li
                                            key={index}
                                            className="py-2 px-3 text-teal-600 transition-colors duration-500 dark:text-white-50"
                                        >
                                            <HeadlessUI.Menu.Item>
                                                <div>
                                                    {subItem?.label && subItem.value ? (
                                                        <Components.Link
                                                            href={subItem.value}
                                                            className="block w-full rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                                        >
                                                            <span className="">{subItem.label}</span>
                                                        </Components.Link>
                                                    ) : (
                                                        subItem
                                                    )}
                                                </div>
                                            </HeadlessUI.Menu.Item>
                                        </li>
                                    ))}
                                </HeadlessUI.Menu.Items>
                            </HeadlessUI.Transition>
                        </HeadlessUI.Menu>
                    ) : (
                        <Components.Link href={item.value} className=" p-2 ">
                            <span className="font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                {item.label}
                            </span>
                        </Components.Link>
                    )}
                </li>
            ))}
        </ul>
    </nav>
);

export default Desktop;
