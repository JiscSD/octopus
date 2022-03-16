import Head from 'next/head';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

interface Errors {
    latest: null | string;
}

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const errors: Errors = {
        latest: null
    };

    let latest: unknown = [];
    try {
        const latestResponse = await api.search(
            'publications',
            null,
            Config.values.publicationTypes.join(),
            5,
            0,
            'publishedDate',
            'asc'
        );
        latest = latestResponse.data as Interfaces.Publication[];
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        errors.latest = message;
    }

    return {
        props: {
            latest,
            errors
        }
    };
};

type Props = {
    latest: Interfaces.Publication[];
    errors: Errors;
};

const Browse: Types.NextPage<Props> = (props): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.browsePublications.description} />
                <meta name="keywords" content={Config.urls.browsePublications.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.browsePublications.canonical} />
                <title>{Config.urls.browsePublications.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                    <Components.PageTitle text="Browse all publications" />
                </section>
                <section id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                    <aside className="relative col-span-2 hidden lg:block">
                        <div className="sticky top-28">
                            <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white">
                                Publication type
                            </h2>
                            <Components.Link
                                href={`${
                                    Config.urls.search.path
                                }?for=publications&type=${Config.values.publicationTypes.join()}`}
                                className="group mb-2 block w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                            >
                                <span className="font-medium text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                    All
                                </span>
                            </Components.Link>
                            {Config.values.publicationTypes.map((type) => (
                                <Components.Link
                                    key={type}
                                    href={`${Config.urls.search.path}?for=publications&type=${type}`}
                                    className="group mb-2 block w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                >
                                    <span className="text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                        {Helpers.formatPublicationType(type)}
                                    </span>
                                </Components.Link>
                            ))}
                        </div>
                    </aside>
                    <article className="lg:col-span-6">
                        <div className="mb-16">
                            <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white">
                                Latest publications
                            </h2>
                            <h3 className="mb-6 block font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 ">
                                See the latest publications that have been uploaded to Octopus
                            </h3>

                            {/** If there are no latest or there was an error, we do show an alert */}
                            {!props.errors.latest ? (
                                <Components.PublicationCarousel publications={props.latest} />
                            ) : (
                                <Components.Alert
                                    title="There was a problem fetching the latest publications"
                                    details={[props.errors.latest]}
                                    severity="ERROR"
                                    allowDismiss={true}
                                />
                            )}
                        </div>
                    </article>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Browse;
