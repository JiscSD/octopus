import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';
import * as Assets from '@assets';
import * as Contexts from '@contexts';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Stores from '@stores';
import * as Framer from 'framer-motion';

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context, currentUser) => {
    const token = Helpers.getJWT(context);

    let user: Interfaces.User | null = null;
    let userPublicationVersions: Interfaces.PublicationVersion[] = [];
    let error: string | null = null;

    // fetch the current user
    try {
        const response = await api.get(`${Config.endpoints.users}/${currentUser.id}`, token);
        user = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    /**
     * @TODO - /user/{id}/publications now returns paginated results
     * Need to handle this into a separate ticket
     *
     */

    try {
        const response = await api.get(
            `${Config.endpoints.users}/${currentUser.id}/publication-versions?limit=999`,
            token
        );
        userPublicationVersions = response.data.results;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    return {
        props: {
            user,
            userPublicationVersions,
            protectedPage: true
        }
    };
});

type Props = {
    user: Interfaces.User;
    userPublicationVersions: Interfaces.PublicationVersion[];
};

const Account: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const confirmation = Contexts.useConfirmationModal();
    const { setUser } = Stores.useAuthStore();
    const [revokeAccessError, setRevokeAccessError] = useState<string | null>(null);
    const [isRevokingAccess, setIsRevokingAccess] = useState(false);

    const livePublicationVersions = React.useMemo(
        () => props.userPublicationVersions.filter((publicationVersion) => publicationVersion.currentStatus === 'LIVE'),
        [props.userPublicationVersions]
    );

    const draftPublicationVersions = React.useMemo(
        () =>
            props.userPublicationVersions.filter(
                (publication) => publication.currentStatus === 'DRAFT' || publication.currentStatus === 'LOCKED'
            ),
        [props.userPublicationVersions]
    );

    const handleRevokeAccess = useCallback(async () => {
        const confirmed = await confirmation(
            'Are you sure?',
            "Revoking access to your ORCID profile will log you out. In order to access Octopus again, you'll need to grant permission to your ORCID profile next time you login.",
            <OutlineIcons.UserMinusIcon className="h-8 w-8 text-teal-600 transition-colors duration-500 dark:text-teal-400" />,
            'Yes',
            'No'
        );

        if (confirmed) {
            setIsRevokingAccess(true);
            setRevokeAccessError(null);

            try {
                await api.destroy(Config.endpoints.revokeOrcidAccess, Helpers.getJWT());
                await router.push({
                    pathname: `${Config.urls.home.path}`
                });
                Helpers.clearJWT();
                setUser(null);
            } catch (error) {
                const errorMessage = axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : (error as Error).message;

                setRevokeAccessError(errorMessage);
            }

            setIsRevokingAccess(false);
        }
    }, [confirmation, router, setUser]);

    const verticalDivider = <span className="hidden border-r border-teal-500 py-4 md:block" />;

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content={Config.urls.account.description} />
                <meta name="keywords" content={Config.urls.account.keywords.join(',')} />
                <link rel="canonical" href={Config.urls.account.canonical} />
                <title>{`Author: ${props.user?.orcid} - ${Config.urls.account.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8 pb-20 pt-10 md:pb-24 md:pt-16">
                    <div className="mb-8 flex items-center">
                        <Components.Avatar user={props.user} className="text-xl lg:h-16 lg:w-16" />
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            {props.user?.firstName} {props.user?.lastName}
                        </h1>
                    </div>
                    <div className="flex flex-col flex-wrap gap-4 md:flex-row md:items-center">
                        <h2 className="font-montserrat text-lg font-medium leading-normal text-grey-800 transition-colors duration-500 dark:text-white-50">
                            <Components.Link
                                className="flex w-fit items-center gap-2"
                                href={`https://orcid.org/${props.user?.orcid}`}
                                openNew={true}
                            >
                                <Assets.OrcidLogoIcon width={24} />
                                <span className="font-semibold text-teal-500">{props.user?.orcid}</span>
                            </Components.Link>
                        </h2>

                        {verticalDivider}

                        {props.user?.email && (
                            <>
                                <h2 className="font-montserrat text-lg font-medium leading-normal text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    Email: {props.user?.email} (
                                    <Components.Link
                                        href={`${Config.urls.verify.path}/?state=${encodeURIComponent(router.asPath)}`}
                                    >
                                        <span className="font-semibold text-teal-500">Update</span>
                                    </Components.Link>
                                    )
                                </h2>
                                {verticalDivider}
                            </>
                        )}

                        <Components.Link
                            href={`${Config.urls.viewUser.path}/${props.user?.id}`}
                            className="rounded underline decoration-teal-500 decoration-2 underline-offset-1 outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <span className="block py-2 font-montserrat text-sm font-medium leading-none text-grey-800 transition-colors duration-500 dark:text-white-50">
                                View my public author page
                            </span>
                        </Components.Link>

                        {verticalDivider}

                        <Components.Button
                            disabled={isRevokingAccess}
                            endIcon={
                                <OutlineIcons.UserMinusIcon className='className="h-6 dark:text-white-50" w-6 text-teal-500 transition-colors duration-500' />
                            }
                            title="Revoke ORCID Access"
                            onClick={handleRevokeAccess}
                        />
                    </div>
                    <Framer.AnimatePresence>
                        {revokeAccessError && (
                            <Components.Alert
                                severity="ERROR"
                                title={'Cannot revoke ORCID access'}
                                details={[revokeAccessError]}
                                className="mt-4"
                            />
                        )}
                    </Framer.AnimatePresence>
                </header>

                <section id="content" className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Draft publications
                    </h2>
                    {draftPublicationVersions.length ? (
                        <div className="relative space-y-4 xl:w-2/3">
                            {draftPublicationVersions.map((publicationVersion) => (
                                <Components.Link
                                    key={publicationVersion.id}
                                    href={
                                        props.user.id === publicationVersion.createdBy
                                            ? `${Config.urls.viewPublication.path}/${publicationVersion.versionOf}/edit?step=0`
                                            : `${Config.urls.viewPublication.path}/${publicationVersion.versionOf}/`
                                    }
                                    className="mb-5 flex "
                                >
                                    <Components.PublicationSimpleResult
                                        publicationVersion={publicationVersion}
                                        user={props.user}
                                    />
                                </Components.Link>
                            ))}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any draft publications"
                            className="w-fit"
                        />
                    )}
                </section>

                <section className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Live publications
                    </h2>
                    {livePublicationVersions.length ? (
                        <div className="relative space-y-4 xl:w-2/3">
                            {livePublicationVersions.map((publicationVersion) => {
                                const canCreateNewVersion =
                                    publicationVersion.isLatestVersion &&
                                    !draftPublicationVersions.some(
                                        (version) => version.versionOf === publicationVersion.versionOf
                                    );

                                const canEditNewVersion = draftPublicationVersions.some(
                                    (version) =>
                                        version.versionOf === publicationVersion.versionOf &&
                                        version.createdBy === props.user.id
                                );

                                return (
                                    <Components.Link
                                        key={publicationVersion.id}
                                        href={`${Config.urls.viewPublication.path}/${publicationVersion.versionOf}`}
                                        className="mb-5 flex "
                                    >
                                        <Components.PublicationSimpleResult
                                            publicationVersion={publicationVersion}
                                            user={props.user}
                                            canCreateNewVersion={canCreateNewVersion}
                                            canEditNewVersion={canEditNewVersion}
                                        />
                                    </Components.Link>
                                );
                            })}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any live publications"
                            className="w-fit"
                        />
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Account;
