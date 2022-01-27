import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';
import { MenuIcon } from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    items: Interfaces.NavMenuItem[];
};

const Mobile: React.FC<Props> = (props): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div className="relative mr-4 h-8 w-8">
            <button
                aria-label="Mobile Navigation Menu"
                onClick={(e) => toggle()}
                className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                <MenuIcon className={`h-8 w-8 text-white ${open && 'text-grey-100'} transition-all `} />
            </button>
            <AnimatePresence>
                {open && (
                    <ClickAwayListener onClickAway={toggle}>
                        <motion.nav
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-10 right-0 z-20 rounded bg-white px-4 shadow-md dark:border-2 dark:border-teal-300 dark:bg-grey-800"
                        >
                            <ul>
                                {props.items.map((item) => (
                                    <li key={item.value} className="my-4">
                                        <Components.Link
                                            href={item.value}
                                            className="rounded border-transparent pl-2 pr-6 outline-0 focus:ring-2 focus:ring-yellow-400"
                                        >
                                            <span className="text-grey-900 dark:text-white">{item.label}</span>
                                        </Components.Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.nav>
                    </ClickAwayListener>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Mobile;
