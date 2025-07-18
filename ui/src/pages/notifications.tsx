import React from 'react';
import Head from 'next/head';

import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Helpers from '@/helpers';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
    const token = Helpers.getJWT(context);
    let userPublicationBookmarks: Interfaces.BookmarkedEntityData[] = [];
    let userTopicBookmarks: Interfaces.BookmarkedEntityData[] = [];
    let userSettings: Interfaces.UserSettings | null = null;

    try {
        const response = await api.get(`${Config.endpoints.bookmarks}?type=PUBLICATION`, token);
        userPublicationBookmarks = response.data;
    } catch (err) {
        console.log(err);
    }

    try {
        const response = await api.get(`${Config.endpoints.bookmarks}?type=TOPIC`, token);
        userTopicBookmarks = response.data;
    } catch (err) {
        console.log(err);
    }

    try {
        const response = await api.get(`${Config.endpoints.users}/me/settings`, token);
        userSettings = response.data;
    } catch (err) {
        console.log(err);
    }

    return {
        props: {
            userPublicationBookmarks,
            userTopicBookmarks,
            userSettings,
            token,
            protectedPage: true
        }
    };
});

type Props = {
    userPublicationBookmarks: Interfaces.BookmarkedEntityData[];
    userTopicBookmarks: Interfaces.BookmarkedEntityData[];
    userSettings: Interfaces.UserSettings;
    token: string;
};

const Notifications: Types.NextPage<Props> = (props): React.ReactElement => {
    const [userPublicationBookmarks, setUserPublicationBookmarks] = React.useState(props.userPublicationBookmarks);
    const [userTopicBookmarks, setUserTopicBookmarks] = React.useState(props.userTopicBookmarks);
    const [userSettings, setUserSettings] = React.useState<Interfaces.UserSettings>(props.userSettings);

    const deletePublicationBookmark = async (id: string) => {
        try {
            await api.destroy(`${Config.endpoints.bookmarks}/${id}`, props.token);
            setUserPublicationBookmarks(userPublicationBookmarks.filter((bookmark) => bookmark.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTopicBookmark = async (id: string) => {
        try {
            await api.destroy(`${Config.endpoints.bookmarks}/${id}`, props.token);
            setUserTopicBookmarks(userTopicBookmarks.filter((bookmark) => bookmark.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const changeBookmarkNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableBookmarkNotifications: checked,
            enableBookmarkVersionNotifications: checked
        };
        setUserSettings(updatedSettings);
    };

    const changeBookmarkVersionNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableBookmarkVersionNotifications: checked,
            // Because we only have 1 subfield, we can directly update the parent.
            // Once we have more than 1 subfield, we need to check if all subfields are true/false & update the parent
            // It has to behave like a select/deselect all
            enableBookmarkNotifications: checked
        };
        setUserSettings(updatedSettings);
    };

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content={Config.urls.notifications.description} />
                <meta name="keywords" content={Config.urls.notifications.keywords.join(',')} />
                <link rel="canonical" href={Config.urls.notifications.canonical} />
                <title>{Config.urls.notifications.title}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8  lg:pb-4 lg:pt-8">
                    <div className="mb-8 flex items-center">
                        <h1 className="block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            Notifications
                        </h1>
                    </div>
                </header>

                <section className="container mx-auto mb-16 px-8">
                    <fieldset>
                        <legend className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                            Notification settings
                        </legend>
                        <Components.Checkbox
                            id="bookmark-notifications"
                            name="bookmark-notifications"
                            onChange={changeBookmarkNotifications}
                            checked={userSettings.enableBookmarkNotifications}
                            label="Receive notifications for bookmarked publications"
                            className="font-semibold w-fit"
                        />
                        <Components.Checkbox
                            id="bookmark-version-notifications"
                            name="bookmark-version-notifications"
                            onChange={changeBookmarkVersionNotifications}
                            checked={userSettings.enableBookmarkVersionNotifications}
                            label="Receive notifications about new versions of bookmarked publications"
                            className="mt-4 ml-8 w-fit"
                        />
                    </fieldset>
                </section>

                <section className="container mx-auto mb-16 px-8">
                    {userPublicationBookmarks.length || userTopicBookmarks.length ? (
                        <>
                            {!!userPublicationBookmarks.length && (
                                <>
                                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                                        Your bookmarked publications
                                    </h2>
                                    <div className="relative rounded-md lg:w-2/3">
                                        {userPublicationBookmarks.map((bookmark: Interfaces.BookmarkedEntityData) => (
                                            <Components.BookmarkedPublications
                                                publication={bookmark.entity as Interfaces.BookmarkedPublication}
                                                key={bookmark.id}
                                                token={props.token}
                                                onDelete={() => deletePublicationBookmark(bookmark.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            {!!userTopicBookmarks.length && (
                                <>
                                    <h2
                                        className={`mt-${
                                            userPublicationBookmarks.length ? 8 : 0
                                        } mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8 lg:mt-${
                                            userPublicationBookmarks.length ? 16 : 0
                                        }`}
                                    >
                                        Your bookmarked topics
                                    </h2>
                                    <div className="relative rounded-md lg:w-2/3">
                                        {userTopicBookmarks.map((bookmark: Interfaces.BookmarkedEntityData) => (
                                            <Components.BookmarkedTopics
                                                topic={bookmark.entity as Interfaces.BookmarkedTopic}
                                                key={bookmark.id}
                                                token={props.token}
                                                onDelete={() => deleteTopicBookmark(bookmark.id)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any bookmarked publications or topics"
                            className="w-fit"
                        />
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Notifications;
