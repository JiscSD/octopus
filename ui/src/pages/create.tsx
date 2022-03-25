import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    let publicationForID: string | string[] | null = null;
    let publicationType: string | string[] | null = null;

    if (context.query.for) publicationForID = context.query.for;
    if (context.query.type) publicationType = context.query.type;

    if (Array.isArray(publicationForID)) publicationForID = publicationForID[0];
    if (Array.isArray(publicationType)) publicationType = publicationType[0];

    return {
        props: {
            publicationForID,
            publicationType,
            token
        }
    };
};

const Title = ({ text }: { text: string }): React.ReactElement => (
    <label className="mb-4 block font-montserrat text-xl font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
        {text}
    </label>
);

const SupportText = ({ text }: { text: string }): React.ReactElement => (
    <span className="mb-2 block text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">{text}</span>
);

type PageProps = {
    publicationForID: string | null;
    publicationType: Types.PublicationType | null;
    token: string;
};

const Create: Types.NextPage<PageProps> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const [title, setTitle] = React.useState<string>('');
    const [publicationType, setPublicationType] = React.useState(props.publicationType ?? 'PROBLEM');
    const [confirmed, setConfirmed] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const createPublication = async () => {
        setError(null);
        try {
            const response = await api.post(
                Config.endpoints.publications,
                {
                    title,
                    type: publicationType
                },
                props.token
            );

            const redirect = {
                pathname: `${Config.urls.viewPublication.path}/${response.data.id}/edit`,
                query: {}
            };

            if (props.publicationForID) {
                redirect.query = {
                    for: props.publicationForID
                };
            }

            router.push(redirect);
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setError(message);
        }
    };

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.createPublication.canonical} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-16">
                    {error ? <Components.Alert severity="ERROR" title={error} className="mt-2" /> : null}

                    <div className="mb-12">
                        <Components.PageSubTitle text="Publication title" className="!mb-4" />
                        <SupportText
                            text="Titles should be concise, specific, and informative – this will help relevant readers find
                            your material."
                        />
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 lg:w-1/2"
                        />
                    </div>

                    <div className="mb-20">
                        <Components.PageSubTitle text="Type of publication" className="!mb-4" />
                        <SupportText text="Octopus has 8 publication types which align with the scientific process." />
                        <SupportText text={Config.values.octopusInformation.publications[publicationType].content} />
                        <select
                            id="publicationType"
                            name="publicationType"
                            value={publicationType}
                            onChange={(e) => setPublicationType(e.target.value as Types.PublicationType)}
                            className="block w-fit rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                        >
                            {Config.values.publicationTypes.map((type) => (
                                <option key={type} value={type}>
                                    {Helpers.formatPublicationType(type)}
                                </option>
                            ))}
                        </select>
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
                        disabled={!publicationType || !title.length || !confirmed}
                        onClick={createPublication}
                        iconPosition="RIGHT"
                        icon={
                            <OutlineIcons.ArrowSmRightIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        }
                    />
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Create;
