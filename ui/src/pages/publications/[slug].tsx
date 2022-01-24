import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DownloadIcon, PencilIcon, EyeIcon, LinkIcon } from '@heroicons/react/outline';

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
                        <span className="block mb-4 lg:mb-8 font-montserrat font-semibold text-2xl text-pink-500">
                            {Helpers.formatPublicationType(props.publication.type)}
                        </span>

                        <header className="grid mb-8 lg:mb-12 grid-cols-1 lg:grid-cols-3 lg:gap-4">
                            <section className="col-span-2">
                                <h1 className="block mb-8 font-montserrat font-bold text-2xl md:text-3xl xl:text-4xl text-grey-800 dark:text-white leading-tight xl:leading-normal transition-colors duration-500">
                                    {props.publication.title}
                                </h1>
                                {/** Publication meta */}
                                <div>
                                    {/** Authors */}
                                    <div>
                                        <span>Authors:</span>
                                        <span>Alexandra Freeman, Ashley Redman, Nathan Sainsbury</span>
                                    </div>
                                    {/** Dates */}
                                    <time>Date time here</time>
                                    {/** Reporting */}
                                    <div>Reporting here</div>
                                </div>
                            </section>
                            <aside className="mb-8 lg:mb-0">something</aside>
                        </header>
                    </section>

                    <section className="container mx-auto px-8 mb-12">
                        <h2 className="block mb-6 font-montserrat font-semibold text-2xl text-grey-800 dark:text-white transition-colors duration-500">
                            Actions
                        </h2>
                        <div className="flex items-center">
                            <Components.ActionButton
                                title="Download"
                                icon={
                                    <DownloadIcon className="w-6 h-6 text-teal-500 group-hover:text-teal-800 transition-colors duration-500" />
                                }
                                callback={() => console.log('download')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Review"
                                icon={
                                    <PencilIcon className="w-6 h-6 text-teal-500 group-hover:text-teal-800 transition-colors duration-500" />
                                }
                                callback={() => console.log('write review')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Watch"
                                icon={
                                    <EyeIcon className="w-6 h-6 text-teal-500 group-hover:text-teal-800 transition-colors duration-500" />
                                }
                                callback={() => console.log('watch')}
                                className="mr-6"
                            />
                            <Components.ActionButton
                                title="Write a linked publication"
                                icon={
                                    <LinkIcon className="w-6 h-6 text-teal-500 group-hover:text-teal-800 transition-colors duration-500" />
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
                                    title: 'hello',
                                    content: <Components.ParseHTML content={props.publication.content} />
                                },
                                {
                                    title: 'Another',
                                    content: <Components.ParseHTML content={'<p>Some html here </p>'} />
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
