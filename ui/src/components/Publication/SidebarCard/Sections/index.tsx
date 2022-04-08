import React from 'react';

import * as Components from '@components';

type Props = {
    sectionList?: { title: string; href: string }[];
};

const Sections: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.SectioBreak name="Sections" />
        {!!props.sectionList && (
            <div className="space-y-2">
                {props.sectionList.map((section) => (
                    <button
                        key={section.href}
                        aria-label={section.title}
                        onClick={() => document.getElementById(section.href)?.scrollIntoView({ behavior: 'smooth' })}
                        className="mr-2 mb-2 block rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                    >
                        {section.title}
                    </button>
                ))}
            </div>
        )}
    </>
);

export default Sections;
