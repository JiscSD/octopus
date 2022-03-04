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

type Props = {
    publicationForID: string | null;
    publicationType: Types.PublicationType | null;
    token: string;
};

const Create: Types.NextPage<Props> = (props): JSX.Element => {
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
                <meta name="keywords" content={`${Config.urls.createPublication.keywords.join(', ')}`} />
                <link rel="canonical" href={`${Config.urls.createPublication.canonical}`} />
                <title>{Config.urls.createPublication.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-8 lg:pt-36">
                        {error ? <Components.Alert severity="ERROR" title={error} className="mt-2" /> : null}

                        <aside className="mb-8 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-1 lg:mb-0">
                            <h2 className="mb-6 font-montserrat text-2xl text-grey-800 transition-colors duration-500 dark:text-white">
                                Creating a publication
                            </h2>
                            <ul>
                                <li className="mb-4 text-grey-600 transition-colors duration-500 dark:text-grey-50">
                                    <span className="font-medium">Publication title</span>
                                    <ul className="ml-4 list-disc">
                                        <li className="ml-2 py-2">Something about what makes a good title</li>
                                    </ul>
                                </li>

                                <li className="mb-4 text-grey-600 transition-colors duration-500 dark:text-grey-50">
                                    <span className="font-medium">Publication type</span>
                                    <ul className="ml-4 list-disc">
                                        <li className="ml-2 py-2">This is the type of publication</li>
                                        <li className="ml-2 pb-2">Some other info about publication types</li>
                                    </ul>
                                </li>
                            </ul>
                        </aside>
                        <div className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-1">
                            <div className="mb-12">
                                <label className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                                    What is the title of this publication?
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-10/12 rounded-md border bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white"
                                />
                            </div>

                            <div className="mb-12">
                                <label
                                    htmlFor="publicationType"
                                    className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white"
                                >
                                    Type of publication
                                </label>
                                <select
                                    id="publicationType"
                                    name="publicationType"
                                    value={publicationType ?? ''}
                                    onChange={(e) => setPublicationType(e.target.value as Types.PublicationType)}
                                    className="block w-fit rounded-md border bg-transparent text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white"
                                >
                                    {Config.values.publicationTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {Helpers.formatPublicationType(type)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label htmlFor="confirm" className="mb-6 flex items-center">
                                <input
                                    required
                                    id="confirm"
                                    name="confirm"
                                    type="checkbox"
                                    checked={confirmed}
                                    disabled={!publicationType || !title.length}
                                    onChange={() => setConfirmed((prev) => !prev)}
                                    className="rounded-sm border-teal-500 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                                />
                                <span className="ml-2 block text-grey-800 transition-colors duration-500 dark:text-white">
                                    I confirm this is the correct publication type.
                                </span>
                            </label>

                            <Components.ActionButton
                                title="Create this publication"
                                icon={
                                    <OutlineIcons.ArrowSmRightIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white" />
                                }
                                disabled={!publicationType || !title.length || !confirmed}
                                callback={createPublication}
                            />
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Create;
