import React from 'react';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
};

const Desktop: React.FC<Props> = (props): JSX.Element => (
    <nav className="mr-4">
        <ul className="flex items-center">
            {props.items.map((item) => (
                <li key={item.value} className="first:ml-0 last:mr-0 md:mx-1 lg:mx-2">
                    {!item.subItems && (
                        <Components.Link
                            href={item.value}
                            className="rounded border-transparent p-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <span className="text-white">{item.label}</span>
                        </Components.Link>
                    )}

                    {item.subItems?.length && (
                        <HeadlessUI.Menu as="div" className="relative z-50 inline-block text-left">
                            <HeadlessUI.Menu.Button className="rounded border-transparent p-2 outline-0 focus:ring-2 focus:ring-yellow-400">
                                {item.label}
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
                                    className="divide-gray-100 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-blue-600 divide-opacity-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                    {item.subItems.map((subItem, index) => (
                                        <li key={index} className="py-2 px-3 text-teal-600">
                                            <HeadlessUI.Menu.Item>
                                                <div>
                                                    {/** @ts-ignore - Types correctly but still has issues? */}
                                                    {subItem?.label && subItem?.value ? (
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
                    )}
                </li>
            ))}
        </ul>
    </nav>
);

export default Desktop;
