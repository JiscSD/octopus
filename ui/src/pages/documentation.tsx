import Head from 'next/head';

import * as Components from '@components';
// import * as Docs from '@documentation';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

export const getStaticProps: Types.GetStaticProps = async () => {
    return {
        props: {
            metadata: {
                title: Config.urls.documentation.title,
                description: Config.urls.documentation.description
            }
        }
    };
};

const Documentation: Types.NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="description" content={Config.urls.documentation.description} />
            <meta name="keywords" content={Config.urls.documentation.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.documentation.canonical} />
            <title>{Config.urls.documentation.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={true}>
            <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-48">
                <Components.PageTitle text="Documentation" />
            </section>
            <section className="container mx-auto mb-8 px-8">
                {/* <Components.DocumentationSection entry={Docs.Publications[0]} /> */}
            </section>
        </Layouts.Standard>
    </>
);

export default Documentation;
