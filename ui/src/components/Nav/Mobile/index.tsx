import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';
import { MenuIcon } from '@heroicons/react/outline';

import * as Components from '@components';
import * as Lib from '@lib';

type Props = {
    items: Lib.I.NavMenuItem[];
};

const Mobile: React.FC<Props> = (props): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div className='relative w-8 h-8 mr-4'>
            <button
                onClick={(e) => toggle()}
                className='rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400'
            >
                <MenuIcon className={`w-8 h-8 text-white ${open && 'text-grey-100'} transition-all `} />
            </button>
            <AnimatePresence>
                {open && (
                    <ClickAwayListener onClickAway={toggle}>
                        <motion.nav
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            exit={{ opacity: 0 }}
                            className='absolute z-20 top-10 right-0 rounded bg-white dark:bg-grey-800 dark:border-2 dark:border-teal-300 shadow-md px-4'
                        >
                            <ul>
                                {props.items.map((item) => (
                                    <li key={item.value} className='my-4'>
                                        <Components.Link
                                            href={item.value}
                                            className='pl-2 pr-6 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400'
                                        >
                                            <span className='text-grey-900 dark:text-white'>{item.label}</span>
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
