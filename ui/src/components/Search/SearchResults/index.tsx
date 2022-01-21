import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';

type Props = {
    results: any[];
};

const SearchResults: FC<Props> = (props): JSX.Element => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (props.results.length) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [props.results]);

    return (
        <AnimatePresence>
            {open && (
                <ClickAwayListener onClickAway={toggle}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-20 top-full py-8 px-6 mt-4 left-0 w-full rounded bg-white dark:bg-grey-800 text-grey-800 dark:text-white shadow transition-colors duration-500"
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos voluptatum rem ipsum nemo odio
                        deserunt, unde voluptate, perspiciatis, qui rerum veniam veritatis atque ipsam inventore porro.
                        Mollitia, quibusdam. Eaque, ipsa. Alias consequuntur, nam cumque provident minima ad suscipit
                        reprehenderit
                    </motion.div>
                </ClickAwayListener>
            )}
        </AnimatePresence>
    );
};

export default SearchResults;
