import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
    handleLogout: () => void;
};

const Desktop: React.FC<Props> = (props): React.ReactElement => (
    <nav>
        <ul className="flex items-center">
            {props.items.map((item) => (
                <li key={item.value} className="first:ml-0 last:mr-0 md:mx-1 lg:mx-2">
                    {item.subItems?.length ? (
                        <HeadlessUI.Menu as="div" className="relative z-50 inline-block text-left">
                            <HeadlessUI.Menu.Button
                                data-testid={item.dataTestId}
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
                                    {item.subItems.map((subItem, index) => {
                                        return subItem?.label && subItem.value ? (
                                            <li className="py-2 px-3 text-teal-600 transition-colors duration-500 dark:text-white-50">
                                                <HeadlessUI.Menu.Item as="a" key={index} href={subItem.value}>
                                                    {({ active }) => (
                                                        <span
                                                            className={`${
                                                                active ? 'border-yellow-400' : 'border-transparent'
                                                            } text-white m-0 block w-full rounded-md border-2 p-0.5`}
                                                        >
                                                            {subItem.label}
                                                        </span>
                                                    )}
                                                </HeadlessUI.Menu.Item>
                                            </li>
                                        ) : (
                                            <li className="py-2 px-3 text-teal-600 transition-colors duration-500 dark:text-white-50">
                                                <HeadlessUI.Menu.Item key={index}>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={props.handleLogout}
                                                            className={`${
                                                                active ? 'border-yellow-400' : 'border-transparent'
                                                            } text-white m-0 block w-full cursor-pointer rounded-md border-2 text-left`}
                                                        >
                                                            Logout
                                                        </button>
                                                    )}
                                                </HeadlessUI.Menu.Item>
                                            </li>
                                        );
                                    })}
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
