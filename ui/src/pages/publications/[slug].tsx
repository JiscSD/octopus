import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DownloadIcon, PencilIcon, EyeIcon, LinkIcon } from '@heroicons/react/outline';
import { FlagIcon } from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Mocks from '@mocks';

export const getServerSideProps: GetServerSideProps = async (context) => {
    // const { data } = context.query; // this is the full url, not just query params, so because the file is named [slug], there is a slug object, i.e the dynamic part
    // console.log(data); // will log in our nodejs process, not console

    const publication: Interfaces.Publication = Mocks.testData.testSinglePublication;

    // If no publication is found, maybe a more granular check can be done here
    if (!publication) {
        return {
            notFound: true // render the 404 not found page
        };
    }

    return {
        props: {
            publication
        }
    };
};

type Props = {
    publication: Interfaces.Publication;
};

const Publication: NextPage<Props> = (props): JSX.Element => {
    return (
        <>
            <Head>
                {/** We need a way to get a short description for a publication */}
                <meta name="description" content="" />
                {/** We need a way to get a comma seperated string of keywords for a publication */}
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${props.publication.url_slug}`} />
                <title>{`${props.publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 pt-8 lg:pt-16">
                        <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500 lg:mb-8">
                            {Helpers.formatPublicationType(props.publication.type)}
                        </span>

                        <header className="mb-8 grid grid-cols-1 lg:mb-12 lg:grid-cols-3 lg:gap-4">
                            <section className="col-span-2">
                                <h1 className="mb-8 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-4xl xl:leading-normal">
                                    {props.publication.title}
                                </h1>
                                {/** Publication meta */}
                                <div>
                                    {/** Authors */}
                                    <div className="mb-4 flex dark:text-white">
                                        <span>Authors:</span>
                                        <span>Alexandra Freeman, Ashley Redman, Nathan Sainsbury</span>
                                    </div>
                                    {/** Dates */}
                                    <time className="mb-4 block dark:text-white">Date time here</time>
                                    {/** Reporting */}
                                    <span className="flex items-center text-xs font-bold text-pink-500">
                                        Report this publication
                                        <FlagIcon className="ml-2 h-3 w-3" />
                                    </span>
                                </div>
                            </section>
                            <aside className="mb-8 flex items-center lg:mb-0">
                                <div>Ratings here</div>
                            </aside>
                        </header>
                    </section>

                    <section className="container mx-auto mb-12 px-8">
                        <h2 className="mb-6 block font-montserrat text-2xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white">
                            Actions
                        </h2>
                        <div className="flex items-center">
                            <Components.ActionButton
                                title="Download"
                                icon={
                                    <DownloadIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                }
                                callback={() => console.log('download')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Review"
                                icon={
                                    <PencilIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                }
                                callback={() => console.log('write review')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Watch"
                                icon={
                                    <EyeIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                }
                                callback={() => console.log('watch')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Write a linked publication"
                                icon={
                                    <LinkIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                }
                                callback={() => console.log('write new pub')}
                                className="mr-6"
                            />
                        </div>
                    </section>

                    <section className="container mx-auto px-8 pb-16">
                        <Components.Tabs
                            content={[
                                {
                                    title: 'Full text',
                                    content: <Components.ParseHTML content={props.publication.content} />
                                },
                                {
                                    title: 'Related',
                                    content: <Components.ParseHTML content={'<p>Related publications view</p>'} />
                                },
                                {
                                    title: 'Reviews',
                                    content: <Components.ParseHTML content={'<p>Reviews here</p>'} />
                                },
                                {
                                    title: 'Additional information',
                                    content: <Components.ParseHTML content={'<p>Additional informaito here</p>'} />
                                },
                                {
                                    title: 'Public chain',
                                    content: <Components.ParseHTML content={'<p>Public chain here</p>'} />
                                }
                            ]}
                        />
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
