import React, { useCallback } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
    handleLogout: () => void;
};

const Mobile: React.FC<Props> = (props): React.ReactElement => {
    const [open, setOpen] = React.useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <div className="relative h-8 w-8">
            <button
                aria-label="Mobile Navigation Menu"
                onClick={(e) => setOpen((prevState) => !prevState)}
                className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                <OutlineIcons.MenuIcon
                    className={`h-8 w-8 text-teal-500 dark:text-white-50 ${
                        open && 'text-grey-100'
                    } transition-colors duration-500 `}
                />
            </button>
            <Framer.AnimatePresence>
                {open && (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Framer.motion.nav
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-10 right-0 z-20 w-max rounded bg-white-50 px-4 shadow-md dark:border-2 dark:border-teal-300 dark:bg-grey-800"
                        >
                            <ul>
                                {props.items.map((item) => (
                                    <li key={item.value} className="my-4">
                                        {item.subItems?.length ? (
                                            <HeadlessUI.Menu as="div" className="relative z-50 inline-block text-left">
                                                <HeadlessUI.Menu.Button
                                                    className="rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50"
                                                    onClick={handleClose}
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
                                                        className="focus:outline-none dark:divide-teal-600 dark:border-teal-500 dark:bg-grey-800"
                                                    >
                                                        {item.subItems.map((subItem, index) => (
                                                            <li
                                                                key={index}
                                                                className="py-2 pl-4 text-teal-600 transition-colors duration-500 dark:text-white-50"
                                                            >
                                                                <HeadlessUI.Menu.Item>
                                                                    <div>
                                                                        {subItem?.label && subItem.value ? (
                                                                            <Components.Link
                                                                                href={subItem.value}
                                                                                className="block w-full rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                                                                onClick={handleClose}
                                                                            >
                                                                                <span className="">
                                                                                    {subItem.label}
                                                                                </span>
                                                                            </Components.Link>
                                                                        ) : (
                                                                            <Components.Link
                                                                                href="#"
                                                                                onClick={props.handleLogout}
                                                                            >
                                                                                {subItem.label}
                                                                            </Components.Link>
                                                                        )}
                                                                    </div>
                                                                </HeadlessUI.Menu.Item>
                                                            </li>
                                                        ))}
                                                    </HeadlessUI.Menu.Items>
                                                </HeadlessUI.Transition>
                                            </HeadlessUI.Menu>
                                        ) : (
                                            <Components.Link href={item.value} className="p-2" onClick={handleClose}>
                                                <span className="font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                    {item.label}
                                                </span>
                                            </Components.Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </Framer.motion.nav>
                    </ClickAwayListener>
                )}
            </Framer.AnimatePresence>
        </div>
    );
};

export default Mobile;
