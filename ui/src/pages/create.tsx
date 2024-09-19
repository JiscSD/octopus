import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
    const { for: publicationForID = null, type: publicationType = null, topic: topicId = null } = context.query;

    return {
        props: {
            publicationForID,
            publicationType,
            protectedPage: true,
            topicId
        }
    };
});

const SupportText: React.FC<React.PropsWithChildren> = (props): React.ReactElement => (
    <span className="mb-3 block w-full text-sm text-grey-700 transition-colors duration-500 dark:text-white-100 xl:w-1/2">
        {props.children}
    </span>
);

type PageProps = {
    publicationForID: string | null;
    publicationType: Types.PublicationType | null;
    topicId: string | null;
};

const Create: Types.NextPage<PageProps> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const [title, setTitle] = React.useState<string>('');
    const [publicationType, setPublicationType] = React.useState(props.publicationType ?? 'PROBLEM');
    const [confirmed, setConfirmed] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [createPublicationLoading, setCreatePublicationLoading] = React.useState(false);

    const createPublication = async () => {
        setCreatePublicationLoading(true);
        setError(null);

        try {
            const response = await api.post<{ id: string }>(
                Config.endpoints.publications,
                {
                    title,
                    type: publicationType,
                    licence: Config.values.octopusInformation.licences.CC_BY.value, // This is no longer editable - save hard-coded value
                    topicIds: props.topicId ? [props.topicId] : []
                },
                Helpers.getJWT()
            );

            if (props.publicationForID) {
                await api.post(
                    '/links',
                    {
                        to: props.publicationForID,
                        from: response.data.id
                    },
                    Helpers.getJWT()
                );
            }

            router.push({
                pathname: `${Config.urls.viewPublication.path}/${response.data.id}/edit`
            });
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setError(message);
            setCreatePublicationLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>{Config.urls.createPublication.title}</title>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="og:title" content={Config.urls.createPublication.title} />
                <meta name="og:description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.createPublication.canonical} />
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-16">
                    {error ? <Components.Alert severity="ERROR" title={error} className="mt-2" /> : null}

                    <div className="mb-10">
                        <Components.PageSubTitle text="Record a piece of research" className="!mb-4" />

                        <SupportText>
                            Octopus is designed for officially recording your research contributions to the primary
                            research record. It is different from writing an article for a journal (which you can do
                            once you have recorded the primary work in Octopus). It is more like a &apos;patent
                            office&apos;, where you can establish priority for new ideas and work, and where your work
                            can be assessed on its quality and integrity. Every piece of work recorded is adding to the
                            sum of knowledge, as long as it is positioned in the right place so that others can find it
                            and build on it.
                        </SupportText>
                        <SupportText>
                            Octopus is designed to help you demonstrate the quality of your work, and to place it so
                            that others can build around it.
                        </SupportText>
                        <SupportText>
                            There are no rules on style and layout of publications. You should, however, continue to be
                            guided by any relevant reporting guidelines for your field, such as the{' '}
                            <Components.Link
                                href="https://www.equator-network.org"
                                ariaLabel="Read more about the EQUATOR guidlines"
                                title="Read more about the EQUATOR guidlines"
                                className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                            >
                                EQUATOR
                            </Components.Link>{' '}
                            guidelines in health research. You will also be given the opportunity to link to additional
                            resources deposited on specialist platforms (such as data or code repositories).
                        </SupportText>
                        <Components.Link
                            href={Config.urls.authorGuide.path}
                            className="my-6 flex w-44 items-center justify-between rounded-lg bg-teal-400 px-8 py-4 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:text-white-50 dark:hover:bg-grey-600"
                        >
                            <span className="text-center font-montserrat text-sm leading-none tracking-wide">
                                Author Guide
                            </span>
                        </Components.Link>
                    </div>

                    <div className="mb-10">
                        <Components.PageSubTitle text="Title*" className="!mb-4" />
                        <SupportText>
                            Titles should be concise, specific, and informative to help others find your work.
                        </SupportText>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 lg:w-1/2"
                        />
                    </div>

                    <div className="mb-12">
                        <Components.PageSubTitle text="Type of publication" className="!mb-4" />
                        <SupportText>
                            Octopus has 8 publication types which closely align with the research process and move away
                            from the traditional research paper. These are linked to form a research chain, from initial
                            Research Problem to Real World Application. You will no longer need to structure your
                            publications like a paper, with an abstract and introduction, as the publication chain
                            itself serves this role. You will be asked to write a very short description to aid
                            discovery.{' '}
                            <Components.Link
                                href={Config.urls.about.path}
                                ariaLabel="Read more about the Octopus publication types."
                                title="Read more about the Octopus publication types."
                                className="text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                            >
                                Read more about the Octopus publication types
                            </Components.Link>
                        </SupportText>
                        <SupportText>
                            Note that publication type cannot be changed once you click &apos;next&apos;
                        </SupportText>
                        <select
                            id="publicationType"
                            name="publicationType"
                            value={publicationType}
                            onChange={(e) => setPublicationType(e.target.value as Types.PublicationType)}
                            disabled={!!props.publicationType}
                            className="my-4 block w-fit rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                        >
                            {props.publicationType ? (
                                <option key={props.publicationType} value={props.publicationType}>
                                    {Helpers.formatPublicationType(props.publicationType)}
                                </option>
                            ) : (
                                Config.values.publicationTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {Helpers.formatPublicationType(type)}
                                    </option>
                                ))
                            )}
                        </select>
                        <SupportText>
                            Definition: {Config.values.octopusInformation.publications[publicationType].content}
                        </SupportText>
                    </div>

                    <label htmlFor="confirm" className="mb-2 flex items-center">
                        <input
                            required
                            id="confirm"
                            name="confirm"
                            type="checkbox"
                            checked={confirmed}
                            disabled={!publicationType || !title.length}
                            onChange={() => setConfirmed((prev) => !prev)}
                            className="rounded-sm border-teal-500 bg-white-50 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                        />
                        <span
                            className={`ml-2 block text-grey-800 transition-colors duration-500 dark:text-white-50 ${
                                !publicationType || !title.length ? 'text-grey-500 dark:text-grey-200' : ''
                            }`}
                        >
                            I confirm this is the correct publication type.
                        </span>
                    </label>
                    <Components.Button
                        title="Create this publication"
                        disabled={!publicationType || !title.length || !confirmed || createPublicationLoading}
                        onClick={createPublication}
                        endIcon={
                            <OutlineIcons.ArrowSmallRightIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        }
                    />
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Create;
