import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';

type Props = {
    id: string;
    title: string;
    excerpt?: string;
    link: string;
    meta?: string;
    date?: string;
    accentColor: string;
    className?: string;
};

const Result: React.FC<Props> = (props): JSX.Element => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Components.Link
                href={props.link}
                className={`mx-4 block border-t border-grey-600 px-2 py-2 outline-0 hover:opacity-80 focus:rounded focus:border-transparent focus:ring-2 focus:ring-yellow-500 ${props.className}`}
                onClick={() => toggleCmdPalette()}
            >
                <>
                    <span className="leading-0 inline-flex font-montserrat text-xs font-semibold tracking-wide text-teal-300 empty:hidden">
                        {props.meta}
                    </span>
                    <span className="mt-1 block text-base tracking-wide text-white">{props.title}</span>
                    <div className="leading-0 my-2 flex justify-between font-montserrat text-xs text-xxs font-medium tracking-wide text-grey-100 empty:hidden">
                        {props.excerpt && <span className="block">{props.excerpt}</span>}
                        {props.date && <span className="block">{props.date}</span>}
                    </div>
                </>
            </Components.Link>
        </Framer.motion.div>
    );
};

export default Result;
