import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import useSWR from 'swr';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as API from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    let publicationForID: string | string[] | null = null;
    let publicationFor: Interfaces.Publication | null = null;
    let publicationType: string | string[] | null = null;
    let error: string | null = null;

    if (context.query.for) publicationForID = context.query.for;
    if (context.query.type) publicationType = context.query.type;

    if (Array.isArray(publicationFor)) publicationFor = publicationFor[0];
    if (Array.isArray(publicationType)) publicationType = publicationType[0];

    if (publicationForID) {
        try {
            const response = await API.get(`${Config.endpoints.publications}/${publicationForID}`, token);
            publicationFor = response.data;
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            error = message;
            console.log(err);
        }
    }

    return {
        props: {
            publicationFor,
            publicationType,
            token
        }
    };
};

type Props = {
    publicationFor: Interfaces.Publication | null;
    publicationType: Types.PublicationType | null;
    token: string;
};

const Create: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const [title, setTitle] = React.useState<string>('');
    const [publicationFor, setPublicationFor] = React.useState(props.publicationFor);
    const [publicationType, setPublicationType] = React.useState(props.publicationType);
    const [confirmed, setConfirmed] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [limit, setLimit] = React.useState(5);
    const [createdPublication, setCreatedPublication] = React.useState<Interfaces.Publication | undefined>(undefined);
    const [createdLink, setCreatedLink] = React.useState<Interfaces.Publication | undefined>(undefined);
    const [creationError, setCreationError] = React.useState<string | null>(null);
    const [creationLinkError, setCreationLinkError] = React.useState<string | null>(null);

    const {
        data: { data: results = [] } = {},
        error,
        isValidating
    } = useSWR(`/publications?search=${query}&limit=${limit}`, null, {
        fallback: {
            '/publications': []
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const handleSearch = (searchTerm: string) => {
        if (searchTerm.length >= 3) setQuery(searchTerm);
        if (searchTerm.length === 0) setQuery('');
    };

    const handleConfirmed = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setConfirmed(true);
        } else {
            setConfirmed(false);
            setPublicationFor(null);
            setPublicationType(null);
        }
    };

    const createPublication = async () => {
        console.log(title, publicationFor?.id, publicationType, confirmed);

        try {
            const response = await API.post(
                Config.endpoints.publications,
                {
                    title,
                    type: publicationType
                },
                props.token
            );

            setCreatedPublication(response.data);
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setCreationError(message);
            console.log(err);
        }

        // by this point, all values will be available, lers post them to the api to create a publication, then create the link, then redirect the user to the edit screen of this publication
    };

    const createPublicationLink = async () => {
        try {
            const response = await API.post(
                Config.endpoints.links,
                {
                    to: publicationFor?.id,
                    from: createdPublication?.id
                },
                props.token
            );

            // This should be a 201 for creation no?
            if (response.status === 200) {
                router.push({
                    pathname: `${Config.urls.viewPublication.path}/${createdPublication?.id}/edit`
                });
            } else {
                setCreationLinkError('Something went wrong...');
                setPublicationType(null);
            }
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setCreationLinkError(message);
            setPublicationType(null);
            console.log(err);
        }
    };

    React.useEffect(() => {
        if (createdPublication) {
            createPublicationLink();
        }
    }, [createdPublication]);

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.createPublication.description} />
                <meta name="keywords" content={Config.urls.createPublication.keywords} />
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
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <div className="col-span-3 grid grid-cols-1 gap-8">
                            <div>
                                <label className="block">What is the title of this publication?</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block"
                                />
                            </div>

                            {!publicationFor && (
                                <div className="grid grid-cols-12 gap-8">
                                    <div className="col-span-4">
                                        <label htmlFor="publicationFor" className="block">
                                            Choose the publication to link from
                                        </label>
                                        <input
                                            id="publicationFor"
                                            type="text"
                                            placeholder="search publication"
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="block w-full"
                                        />
                                    </div>
                                    <div className="col-span-8">
                                        {!error && !isValidating && results && results.data?.length ? (
                                            <div className="flex items-center">
                                                <label htmlFor="limit" className="mr-4 block">
                                                    Showing {limit} top results
                                                </label>
                                                <select
                                                    id="limit"
                                                    name="limit"
                                                    value={limit}
                                                    onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                                                >
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={15}>15</option>
                                                    <option value={20}>20</option>
                                                </select>
                                            </div>
                                        ) : null}
                                        {!error && !isValidating && !results.data?.length && (
                                            <span>No results found</span>
                                        )}
                                        {!error && !isValidating && results && results.data?.length ? (
                                            <div className="block ">
                                                {results.data.map((publication: Interfaces.Publication) => (
                                                    <button
                                                        key={publication.id}
                                                        onClick={() => setPublicationFor(publication)}
                                                        className="my-2 block bg-white p-2"
                                                    >
                                                        <>
                                                            <span>
                                                                {Helpers.formatPublicationType(publication.type)} ---{' '}
                                                            </span>
                                                            <span>{Helpers.truncateString(publication.title, 80)}</span>
                                                            <span>
                                                                by:{' '}
                                                                {`${publication.user.firstName} ${publication.user?.lastName}`}
                                                            </span>
                                                        </>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null}
                                        {!error && isValidating && <span>loading...</span>}
                                        {!isValidating && error && <span>{error}</span>}
                                    </div>
                                </div>
                            )}

                            {publicationFor && (
                                <div>
                                    <span className="block">
                                        Chosen publication to link to:{' '}
                                        <span className="block font-semibold">{publicationFor.title}</span>
                                    </span>
                                    <button onClick={(e) => setPublicationFor(null)}>Want to change?</button>
                                </div>
                            )}

                            {publicationFor && !publicationType && (
                                <div>
                                    <label htmlFor="publicationType">Choose this publications type</label>
                                    <select
                                        id="publicationType"
                                        name="publicationType"
                                        value={publicationType ? publicationType : ''}
                                        onChange={(e) => setPublicationType(e.target.value as Types.PublicationType)}
                                    >
                                        <option selected>Choose publication type...</option>
                                        {Helpers.publicationsAvailabletoPublication(publicationFor.type).map((type) => (
                                            <option key={type} value={type}>
                                                {Helpers.formatPublicationType(type)}
                                            </option>
                                        ))}
                                    </select>
                                    {creationLinkError ? <span>{creationLinkError}</span> : null}
                                </div>
                            )}

                            {publicationType && (
                                <div>
                                    <span className="block">
                                        Chosen publication type:{' '}
                                        <span className="block font-semibold">
                                            {Helpers.formatPublicationType(publicationType)}
                                        </span>
                                    </span>
                                    <button onClick={() => setPublicationType(null)}>Want to change?</button>
                                </div>
                            )}

                            {publicationFor && publicationType && (
                                <div>
                                    <span>Is this correct?</span>
                                    <input type="checkbox" checked={confirmed} onChange={(e) => handleConfirmed(e)} />
                                </div>
                            )}

                            <button
                                disabled={!publicationFor || !publicationType || !title.length || !confirmed}
                                className="bg-yellow-500 disabled:opacity-30"
                                onClick={createPublication}
                            >
                                Create this publication
                            </button>
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Create;
