import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PencilIcon } from '@heroicons/react/outline';
import { FlagIcon } from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as API from '@api';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const requestedSlug = context.query.slug;
    const response = await API.get(`${Config.endpoints.publications}/${requestedSlug}`);
    const publication: Interfaces.Publication = response.data;

    if (!publication || response.status !== 200) {
        return {
            notFound: true
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
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewPublication.canonical}/${props.publication.url_slug}`} />
                <title>{`${props.publication.title} - ${Config.urls.viewPublication.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    <header className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <div className="lg:col-span-2">
                            <span className="mb-4 block font-montserrat text-2xl font-semibold text-pink-500">
                                {Helpers.formatPublicationType(props.publication.type)}
                            </span>
                            <h1 className="mb-8 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-4xl xl:leading-normal">
                                {props.publication.title}
                            </h1>
                            <span className="mb-8 block tracking-wider text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                DOI: <span className="font-medium text-teal-500">{props.publication.doi}</span>
                            </span>
                            <div className="mb-12 print:hidden lg:flex">
                                <Components.ActionButton
                                    title="Write a review"
                                    icon={
                                        <PencilIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 group-hover:text-teal-800" />
                                    }
                                    callback={(e) => {
                                        e.preventDefault();
                                        router.push(`${Config.urls.createReview.path}?for=${props.publication.id}`);
                                    }}
                                    className="mr-6 mb-4 lg:mb-0"
                                />
                            </div>
                            <Components.Link
                                href={`${Config.urls.createFlag.path}?for=${props.publication.id}`}
                                className="flex w-fit items-center rounded border-transparent text-xs font-bold text-pink-500 outline-0 focus:ring-2 focus:ring-yellow-400 print:hidden"
                            >
                                <span>Report this publication</span>
                                <FlagIcon className="ml-2 h-3 w-3" />
                            </Components.Link>
                        </div>
                        <aside className="relative mb-8 mt-8 flex items-center justify-center print:hidden lg:mt-0 lg:mb-0 lg:justify-end">
                            <Components.PublicationRatings publication={props.publication} />
                        </aside>
                    </header>
                </Components.SectionTwo>

                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        <aside className="col-span-2 hidden pt-24 lg:block">
                            <Components.PublicationSidebar
                                actions={[
                                    { title: 'Authors', href: 'authors' },
                                    { title: 'Full text', href: 'full-text' },
                                    { title: 'Related publications', href: 'related-publications' },
                                    { title: 'Funding statement', href: 'funding-statement' },
                                    { title: 'Conflicts of interest', href: 'conflicts-of-interest' },
                                    { title: 'Reviews', href: 'reviews' },
                                    { title: 'Additional information', href: 'additional-information' },
                                    { title: 'Publication chain', href: 'publication-chain' }
                                ]}
                            />
                        </aside>
                        <div className="lg:col-span-6">
                            {/** Authors */}
                            <Components.PublicationContentSection id="authors" title="Authors">
                                <p className="block leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                                    {props.publication.user.firstName} {props.publication.user.lastName}
                                </p>
                            </Components.PublicationContentSection>

                            {/** Full text */}
                            <Components.PublicationContentSection id="full-text" title="Full text">
                                <Components.ParseHTML content={props.publication.content} />
                            </Components.PublicationContentSection>

                            {/** Related */}
                            <Components.PublicationContentSection
                                id="related-publications"
                                title="Related publications"
                            >
                                <p>Lorem</p>
                            </Components.PublicationContentSection>

                            {/** Funding statement */}
                            <Components.PublicationContentSection id="funding-statement" title="Funding statement">
                                <p className="block leading-relaxed text-grey-800 dark:text-grey-100">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, eius explicabo ullam
                                    magnam commodi molestias quis repudiandae, in nesciunt ducimus debitis eum impedit
                                    maiores voluptate provident sequi molestiae nemo quas. Necessitatibus earum ea iste
                                    enim cupiditate saepe molestias commodi ipsum itaque asperiores vel deserunt sint,
                                    exercitationem eaque, autem facilis eligendi rem optio tempore numquam. Vel nulla
                                    cum eius labore a! Incidunt nesciunt pariatur asperiores hic? Itaque, quidem harum
                                    provident, consequuntur nobis minus deserunt debitis velit non omnis minima atque
                                    neque ipsum vel quam tempore temporibus, architecto distinctio delectus officiis!
                                    Asperiores. Quos corrupti commodi, asperiores, magnam harum fugiat optio praesentium
                                    architecto, ut rem unde? Quam pariatur reiciendis soluta unde molestiae animi est
                                    architecto, impedit temporibus, harum quo necessitatibus blanditiis nulla debitis!
                                    Corrupti nostrum tempora harum similique recusandae, quia reprehenderit quis
                                    molestias quae ducimus unde quisquam! Ea quis incidunt quas non omnis nihil nisi
                                    voluptas rerum est voluptate. Doloribus nemo natus vel!
                                </p>
                            </Components.PublicationContentSection>

                            {/** Conflicts of interest */}
                            <Components.PublicationContentSection
                                id="conflicts-of-interest"
                                title="Conflicts of interest"
                            >
                                <p className="block leading-relaxed text-grey-800 dark:text-grey-100">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, eius explicabo ullam
                                    magnam commodi molestias quis repudiandae, in nesciunt ducimus debitis eum impedit
                                    maiores voluptate provident sequi molestiae nemo quas. Necessitatibus earum ea iste
                                    enim cupiditate saepe molestias commodi ipsum itaque asperiores vel deserunt sint,
                                    exercitationem eaque, autem facilis eligendi rem optio tempore numquam. Vel nulla
                                    cum eius labore a! Incidunt nesciunt pariatur asperiores hic? Itaque, quidem harum
                                    provident, consequuntur nobis minus deserunt debitis velit non omnis minima atque
                                    neque ipsum vel quam tempore temporibus, architecto distinctio delectus officiis!
                                    Asperiores. Quos corrupti commodi, asperiores, magnam harum fugiat optio praesentium
                                    architecto, ut rem unde? Quam pariatur reiciendis soluta unde molestiae animi est
                                    architecto, impedit temporibus, harum quo necessitatibus blanditiis nulla debitis!
                                    Corrupti nostrum tempora harum similique recusandae, quia reprehenderit quis
                                    molestias quae ducimus unde quisquam! Ea quis incidunt quas non omnis nihil nisi
                                    voluptas rerum est voluptate. Doloribus nemo natus vel!
                                </p>
                            </Components.PublicationContentSection>

                            {/** Reviews */}
                            <Components.PublicationContentSection id="reviews" title="Reviews">
                                <p>Lorem</p>
                            </Components.PublicationContentSection>

                            {/** Additional information */}
                            <Components.PublicationContentSection
                                id="additional-information"
                                title="Additional information"
                            >
                                <p className="block leading-relaxed text-grey-800 dark:text-grey-100">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, eius explicabo ullam
                                    magnam commodi molestias quis repudiandae, in nesciunt ducimus debitis eum impedit
                                    maiores voluptate provident sequi molestiae nemo quas. Necessitatibus earum ea iste
                                    enim cupiditate saepe molestias commodi ipsum itaque asperiores vel deserunt sint,
                                    exercitationem eaque, autem facilis eligendi rem optio tempore numquam. Vel nulla
                                    cum eius labore a! Incidunt nesciunt pariatur asperiores hic? Itaque, quidem harum
                                    provident, consequuntur nobis minus deserunt debitis velit non omnis minima atque
                                    neque ipsum vel quam tempore temporibus, architecto distinctio delectus officiis!
                                    Asperiores. Quos corrupti commodi, asperiores, magnam harum fugiat optio praesentium
                                    architecto, ut rem unde? Quam pariatur reiciendis soluta unde molestiae animi est
                                    architecto, impedit temporibus, harum quo necessitatibus blanditiis nulla debitis!
                                    Corrupti nostrum tempora harum similique recusandae, quia reprehenderit quis
                                    molestias quae ducimus unde quisquam! Ea quis incidunt quas non omnis nihil nisi
                                    voluptas rerum est voluptate. Doloribus nemo natus vel!
                                </p>
                            </Components.PublicationContentSection>

                            {/** Publication chain */}
                            <Components.PublicationContentSection id="publication-chain" title="Publication chain">
                                <p className="block leading-relaxed text-grey-800 dark:text-grey-100">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed, eius explicabo ullam
                                    magnam commodi molestias quis repudiandae, in nesciunt ducimus debitis eum impedit
                                    maiores voluptate provident sequi molestiae nemo quas. Necessitatibus earum ea iste
                                    enim cupiditate saepe molestias commodi ipsum itaque asperiores vel deserunt sint,
                                    exercitationem eaque, autem facilis eligendi rem optio tempore numquam. Vel nulla
                                    cum eius labore a! Incidunt nesciunt pariatur asperiores hic? Itaque, quidem harum
                                    provident, consequuntur nobis minus deserunt debitis velit non omnis minima atque
                                    neque ipsum vel quam tempore temporibus, architecto distinctio delectus officiis!
                                    Asperiores. Quos corrupti commodi, asperiores, magnam harum fugiat optio praesentium
                                    architecto, ut rem unde? Quam pariatur reiciendis soluta unde molestiae animi est
                                    architecto, impedit temporibus, harum quo necessitatibus blanditiis nulla debitis!
                                    Corrupti nostrum tempora harum similique recusandae, quia reprehenderit quis
                                    molestias quae ducimus unde quisquam! Ea quis incidunt quas non omnis nihil nisi
                                    voluptas rerum est voluptate. Doloribus nemo natus vel!
                                </p>
                            </Components.PublicationContentSection>
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
