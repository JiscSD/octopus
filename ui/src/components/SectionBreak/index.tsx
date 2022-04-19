import React from 'react';

type Props = {
    name: string;
};

const SectionBreak: React.FC<Props> = (props): React.ReactElement => (
    <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-grey-300 transition-colors duration-500 dark:border-grey-600" />
        </div>
        <div className="relative flex justify-center">
            <span className="bg-white-50 px-2 text-xs text-grey-500 transition-colors duration-500 dark:bg-grey-900 dark:text-white-50">
                {props.name}
            </span>
        </div>
    </div>
);

export default SectionBreak;
