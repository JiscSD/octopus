import React from 'react';

type Props = {
    sectionList?: { title: string; href: string }[];
};

const Sections: React.FC<Props> = (props): React.ReactElement => (
    <>
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-grey-300" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white-50 px-2 text-xs text-grey-500">Sections</span>
            </div>
        </div>
        {!!props.sectionList && (
            <div className="space-y-2">
                {props.sectionList.map((section) => (
                    <button
                        key={section.href}
                        aria-label={section.title}
                        onClick={() => document.getElementById(section.href)?.scrollIntoView({ behavior: 'smooth' })}
                        className="mr-2 mb-2 block rounded border-transparent text-sm font-medium text-teal-600 outline-0 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                    >
                        {section.title}
                    </button>
                ))}
            </div>
        )}
    </>
);

export default Sections;
