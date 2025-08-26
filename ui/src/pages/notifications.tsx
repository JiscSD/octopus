import React from 'react';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

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
    const [loading, setLoading] = React.useState<boolean>(false);
    const setToast = Stores.useToastStore((state) => state.setToast);

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

    const updateNotificationsSettings = async (settings: Interfaces.UserSettings) => {
        setLoading(true);
        try {
            const payload = settings as unknown as Interfaces.JSON;
            await api.put(`${Config.endpoints.users}/me/settings`, payload, props.token);
            setUserSettings(settings);
            setToast({
                visible: true,
                title: 'Success',
                message: 'Notifications settings updated successfully',
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-green-600" />,
                dismiss: true
            });
        } catch (err) {
            console.error('Error updating notifications settings:', err);
            setToast({
                visible: true,
                title: 'Error',
                message: 'Failed to update notifications settings',
                icon: <OutlineIcons.XCircleIcon className="h-6 w-6 text-red-600" />,
                dismiss: true
            });
        }
        setLoading(false);
    };

    const changeLinkedNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableLinkedNotifications: checked
        };
        updateNotificationsSettings(updatedSettings);
    };

    const changePeerReviewNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enablePeerReviewNotifications: checked
        };
        updateNotificationsSettings(updatedSettings);
    };

    const changeVersionFlagNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableVersionFlagNotifications: checked
        };
        updateNotificationsSettings(updatedSettings);
    };

    const changeBookmarkNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableBookmarkVersionNotifications: checked,
            enableBookmarkFlagNotifications: checked,
            enableBookmarkNotifications: checked,
            enableVersionFlagNotifications: checked
        };
        updateNotificationsSettings(updatedSettings);
    };

    const changeBookmarkVersionNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableBookmarkVersionNotifications: checked,
            enableBookmarkNotifications: checked || userSettings.enableBookmarkFlagNotifications
        };
        updateNotificationsSettings(updatedSettings);
    };

    const changeBookmarkFlagNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const updatedSettings = {
            ...userSettings,
            enableBookmarkFlagNotifications: checked,
            enableBookmarkNotifications: checked || userSettings.enableBookmarkVersionNotifications
        };

        updateNotificationsSettings(updatedSettings);
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
                        <legend className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                            Notification settings
                        </legend>
                        <p className="mb-8 font-montserrat text-grey-700 transition-colors duration-500 dark:text-grey-50 max-w-3xl">
                            Use these settings to control which notifications you would like to receive. Relevant
                            activity will be sent to you in a weekly bulletin email scheduled to be sent every Monday at
                            10:00am GMT.
                        </p>
                        <Components.Checkbox
                            disabled={loading}
                            id="bookmark-notifications"
                            name="bookmark-notifications"
                            onChange={changeBookmarkNotifications}
                            checked={userSettings.enableBookmarkNotifications}
                            label="Receive notifications for bookmarked publications"
                            className={`font-semibold w-fit ${loading ? 'cursor-wait' : ''}`}
                        />
                        <Components.Checkbox
                            disabled={loading}
                            id="bookmark-version-notifications"
                            name="bookmark-version-notifications"
                            onChange={changeBookmarkVersionNotifications}
                            checked={userSettings.enableBookmarkVersionNotifications}
                            label="Receive notifications about new versions of bookmarked publications"
                            className={`mt-4 ml-8 w-fit ${loading ? 'cursor-wait' : ''}`}
                        />
                        <Components.Checkbox
                            disabled={loading}
                            id="bookmark-flag-notifications"
                            name="bookmark-flag-notifications"
                            onChange={changeBookmarkFlagNotifications}
                            checked={userSettings.enableBookmarkFlagNotifications}
                            label="Receive notifications about red flags on bookmarked publications"
                            className={`mt-4 ml-8 w-fit ${loading ? 'cursor-wait' : ''}`}
                        />
                        <Components.Checkbox
                            disabled={loading}
                            id="version-flag-notifications"
                            name="version-flag-notifications"
                            onChange={changeVersionFlagNotifications}
                            checked={userSettings.enableVersionFlagNotifications}
                            label="Enable notifications about publications I have red flagged"
                            className={`mt-4 font-semibold w-fit ${loading ? 'cursor-wait' : ''}`}
                        />
                        <Components.Checkbox
                            disabled={loading}
                            id="version-peer-review-notifications"
                            name="version-peer-review-notifications"
                            onChange={changePeerReviewNotifications}
                            checked={userSettings.enablePeerReviewNotifications}
                            label="Enable notifications about publications I have peer reviewed"
                            className={`mt-4 font-semibold w-fit ${loading ? 'cursor-wait' : ''}`}
                        />
                        <Components.Checkbox
                            disabled={loading}
                            id="version-linked-notifications"
                            name="version-linked-notifications"
                            onChange={changeLinkedNotifications}
                            checked={userSettings.enableLinkedNotifications}
                            label="Enable notifications about publications that are linked to mine"
                            className={`mt-4 font-semibold w-fit ${loading ? 'cursor-wait' : ''}`}
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
