import React, { useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Framer from 'framer-motion';

type Props = {
    children: React.ReactNode;
    id: string;
    title: string;
};

const AccordionSection: React.FC<Props> = (props) => {
    const [expanded, setExpanded] = useState(true);

    const toggleId = `${props.id}-toggle`;
    const childId = `${props.id}-items`;

    return (
        <Framer.AnimatePresence>
            <Framer.motion.section
                id={props.id}
                key={props.id}
                className="border-grey rounded shadow transition-colors duration-500 dark:bg-grey-900"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
            >
                <Components.Button
                    id={toggleId}
                    title={props.title}
                    className={`w-full justify-between bg-grey-50 px-6 py-1 font-inter transition-all duration-300 children:border-0 dark:bg-grey-700 ${
                        expanded ? 'rounded-none rounded-t' : ''
                    }`}
                    endIcon={
                        <OutlineIcons.ChevronDownIcon
                            className={`w-4 transition-transform duration-300 dark:text-white-50 ${
                                expanded ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                    }
                    onClick={() => setExpanded((prevState) => !prevState)}
                    accordionConfig={{
                        contentElementId: childId,
                        expanded
                    }}
                >
                    {props.title}
                </Components.Button>

                <Framer.AnimatePresence>
                    {expanded && (
                        <Framer.motion.div
                            id={childId}
                            key={childId}
                            className="overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            role="region"
                            aria-labelledby={toggleId}
                        >
                            {props.children}
                        </Framer.motion.div>
                    )}
                </Framer.AnimatePresence>
            </Framer.motion.section>
        </Framer.AnimatePresence>
    );
};

export default AccordionSection;
