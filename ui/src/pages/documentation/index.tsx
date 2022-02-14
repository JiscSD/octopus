import { NextPage } from 'next';
import Head from 'next/head';

import * as CodeBlock from '@atlaskit/code';
import GlobalTheme from '@atlaskit/theme/components';

import * as Stores from '@stores';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

import data from './data.json';

type Props = {
    apiDocumentation: {
        method: string;
        endpoint: string;
        description: string;
        id: string;
        queryParameters: Array<{
            name: string;
            optional: boolean;
            enums?: Array<string>;
            description: string;
        }>;
        exampleResponse: unknown;
    };
};

const DocumentationSection: React.FC<Props> = (props): JSX.Element => {
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);

    return (
        <div className="grid grid-cols-2 gap-x-8">
            <article className="col-span-1">
                <p className="mb-4 text-grey-800 dark:text-white">{props.apiDocumentation.description}</p>
                <ul>
                    <h3 className="mb-4 text-xl font-medium tracking-wide text-grey-800 dark:text-white">
                        Query parameters
                    </h3>
                    {props.apiDocumentation.queryParameters.map((parameter) => (
                        <li
                            key={parameter.name}
                            className="border-t border-solid  border-grey-300 py-4 text-grey-800 dark:text-white"
                        >
                            <h4 className="mb-2">
                                <code className="mr-2 font-bold tracking-wide text-grey-800 dark:text-white">
                                    {parameter.name}
                                </code>
                                {parameter.optional && (
                                    <span className="text-sm text-grey-800 dark:text-grey-50">optional</span>
                                )}
                            </h4>
                            {parameter.enums && (
                                <p className="mb-2 text-grey-800 dark:text-white">
                                    <span className="font-bold">Can be:</span>{' '}
                                    {parameter.enums.join(', ').replace(/, ([^,]*)$/, ' or $1')}.
                                </p>
                            )}
                            <p className="text-grey-800 dark:text-grey-50">{parameter.description}</p>
                        </li>
                    ))}
                </ul>
            </article>
            <div className="col-span-1 rounded-2xl">
                <div className="sticky top-28">
                    <GlobalTheme.Provider value={() => ({ mode: darkMode ? 'dark' : 'light' })}>
                        <p className="block rounded-t-xl bg-teal-200 px-3 py-2 text-xs font-medium tracking-wider text-grey-900 transition-colors duration-500 dark:bg-grey-600 dark:text-white">
                            <span>{props.apiDocumentation.method}</span> {props.apiDocumentation.endpoint}
                        </p>
                        <div className="jisc-code-block mb-4">
                            <CodeBlock.CodeBlock
                                text={`try {
    const publications = await axios.get('/publications', {
        search: 'COVID',
        offest: 0,
        limit: 10,
        type: 'PROBLEM,HYPOTHSIS',
        orderBy: 'updatedAt,
        orderDirection: 'asc'
    });
    console.log(publications.data);
} catch(err) {
    console.log(err.body.message);
}`}
                                language="TypeScript"
                                showLineNumbers={false}
                            />
                        </div>
                        <p className="block rounded-t-xl bg-teal-200 px-3 py-2 text-xs font-medium tracking-wider text-grey-900 transition-colors !duration-500 dark:bg-grey-600 dark:text-white">
                            RESPONSE
                        </p>
                        <div className="jisc-code-block">
                            <CodeBlock.CodeBlock
                                text={JSON.stringify(props.apiDocumentation.exampleResponse, null, 4)}
                                language="json"
                                showLineNumbers={false}
                            />
                        </div>
                    </GlobalTheme.Provider>
                </div>
            </div>
        </div>
    );
};

const Documentation: NextPage = (): JSX.Element => (
    <>
        <Head>
            <meta name="description" content="" />
            <meta name="keywords" content="" />
            <link rel="canonical" href={`${Config.urls.documentation.canonical}`} />
            <title>{Config.urls.documentation.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={true}>
            <Components.SectionTwo
                className="bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
            >
                <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                    <Components.PageTitle text="Documentation" />
                </section>
                <section className="container mx-auto px-8">
                    <DocumentationSection apiDocumentation={data[0]} />
                </section>
            </Components.SectionTwo>
        </Layouts.Standard>
    </>
);

export default Documentation;
