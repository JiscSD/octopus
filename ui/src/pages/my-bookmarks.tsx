import React from 'react';
import Head from 'next/head';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // If not logged in, i.e no token with the right key, send them to ocrid to login and return
    const token = Helpers.guardPrivateRoute(context);
    // If logged in, grab the token from cookies

    let user: Interfaces.User | null = null;

    let usersBookmarks: Interfaces.BookmarkedPublicationsData[] = [];

    try {
        const response = await api.get(`${Config.endpoints.bookmarks}`, token);
        usersBookmarks = response.data;
    } catch (err) {
        console.log('err');
    }

    return {
        props: {
            user,
            usersBookmarks,
            token
        }
    };
};

type Props = {
    usersBookmarks: Interfaces.BookmarkedPublicationsData[];
    token: string;
};

const MyBookmarks: Types.NextPage<Props> = (props): React.ReactElement => {
    const [userBookmarks, setUserBookmarks] = React.useState(props.usersBookmarks);

    const deleteBookmark = async (publication: string) => {
        try {
            await api.destroy(`${Config.endpoints.publications}/${publication}/bookmark`, props.token);

            const getBookmarks = await api.get(`${Config.endpoints.bookmarks}`, props.token);
            setUserBookmarks(getBookmarks.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content={Config.urls.myBookmarks.description} />
                <meta name="keywords" content={Config.urls.myBookmarks.keywords.join(',')} />
                <link rel="canonical" href={Config.urls.myBookmarks.canonical} />
                <title>{Config.urls.myBookmarks.title}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8  lg:pb-4 lg:pt-8">
                    <div className="mb-8 flex items-center">
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            Your bookmarked publications
                        </h1>
                    </div>
                </header>

                <section className="container mx-auto mb-16 px-8">
                    {userBookmarks.length ? (
                        <div className="relative rounded-md lg:w-2/3">
                            {userBookmarks.map((bookmark: Interfaces.BookmarkedPublicationsData) => (
                                <Components.BookmarkedPublications
                                    publication={bookmark.publication}
                                    key={bookmark.id}
                                    token={props.token}
                                    onDelete={() => deleteBookmark(bookmark.publication.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any bookmarked publications"
                            className="w-fit"
                        />
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default MyBookmarks;
