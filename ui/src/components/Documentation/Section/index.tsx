import React from 'react';
// import * as CodeBlock from '@atlaskit/code';
// import GlobalTheme from '@atlaskit/theme/components';

import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as Types from '@/types';

type SectionProps = {
    entry: Interfaces.DocumentationEntry;
};

const DocumentationSection: React.FC<SectionProps> = (props): React.ReactElement => {
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);

    return (
        <div className="grid grid-cols-1 gap-x-8  xl:grid-cols-2 2xl:gap-x-16">
            <article className="col-span-1">
                <p className="mb-4 text-grey-800 dark:text-white-50">{props.entry.description}</p>
                {!!props.entry.queryParameters && (
                    <ul>
                        <h3 className="mb-4 text-xl font-medium tracking-wide text-grey-800 dark:text-white-50">
                            Query parameters
                        </h3>
                        {props.entry.queryParameters.map((parameter: Interfaces.DocumentationEntryQueryParams) => (
                            <li
                                key={parameter.name}
                                className="border-t border-solid  border-grey-300 py-4 text-grey-800 dark:text-white-50"
                            >
                                <h4 className="mb-2">
                                    <code className="mr-2 font-bold tracking-wide text-grey-800 dark:text-white-50">
                                        {parameter.name}
                                    </code>
                                    {parameter.optional && (
                                        <span className="text-sm text-grey-800 dark:text-grey-50">optional</span>
                                    )}
                                </h4>
                                {parameter.enums && (
                                    <p className="mb-2 text-grey-800 dark:text-white-50">
                                        <span className="font-bold">Can be:</span>{' '}
                                        {parameter.enums.join(', ').replace(/, ([^,]*)$/, ' or $1')}.
                                    </p>
                                )}
                                <p className="text-grey-800 dark:text-grey-50">{parameter.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </article>
            <div className="col-span-1 rounded-2xl">
                <div className="sticky top-28">
                    {/* <GlobalTheme.Provider value={() => ({ mode: darkMode ? 'dark' : 'light' })}>
                        <p className="block rounded-t-xl bg-teal-200 px-3 py-2 text-xs font-medium tracking-wider text-grey-900 transition-colors duration-500 dark:bg-grey-600 dark:text-white-50">
                            <span>{props.entry.method}</span> {props.entry.endpoint}
                        </p>
                        <div className="jisc-code-block mb-4">
                            <CodeBlock.CodeBlock
                                text={props.entry.exampleUse}
                                language="TypeScript"
                                showLineNumbers={false}
                            />
                        </div>
                        <p className="block rounded-t-xl bg-teal-200 px-3 py-2 text-xs font-medium tracking-wider text-grey-900 transition-colors !duration-500 dark:bg-grey-600 dark:text-white-50">
                            Response
                        </p>
                        <div className="jisc-code-block">
                            <CodeBlock.CodeBlock
                                text={JSON.stringify(props.entry.exampleResponse, null, 4)}
                                language="json"
                                showLineNumbers={false}
                            />
                        </div>
                    </GlobalTheme.Provider> */}
                </div>
            </div>
        </div>
    );
};

export default DocumentationSection;
