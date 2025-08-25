import React, { useMemo } from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import type { NextPage } from 'next';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.getJWT(context);
    const id = context.params?.id as string;

    let bundle: Interfaces.PublicationBundle | null = null;

    try {
        const response = await api.get(`${Config.endpoints.publicationBundles}/${id}`, token);

        // Augment bundle publications with latest live versions
        bundle = { ...response.data, entries: [] } as Interfaces.PublicationBundle;

        for (const entry of response.data.entries) {
            const latestLiveVersion = entry.publication.versions[0];
            if (!latestLiveVersion) continue;

            bundle.entries.push({
                ...entry,
                publication: {
                    authorFirstName: latestLiveVersion.user.firstName,
                    authorLastName: latestLiveVersion.user.lastName,
                    id: entry.id,
                    publishedDate: latestLiveVersion.publishedDate || '',
                    title: latestLiveVersion.title,
                    type: entry.publication.type
                }
            });
        }
    } catch (err) {
        console.log(err);
    }

    let editMode = false;

    if (bundle && token) {
        const decodedToken = await Helpers.getDecodedUserToken(token);
        editMode = bundle.createdBy === decodedToken?.id;
    }

    const clientBundle = bundle
        ? {
              id: bundle.id,
              name: bundle.name,
              entries: bundle.entries
          }
        : null;

    return {
        props: {
            editMode,
            bundle: clientBundle,
            token: token || null,
            protectedPage: false
        }
    };
};

type Props = {
    bundle: Interfaces.ClientPublicationBundle | null;
    editMode: boolean;
    token: string | null;
    protectedPage: boolean;
};

const ViewBundle: NextPage<Props> = (props): JSX.Element => {
    const { bundle, editMode, token } = props;
    const [savingBundle, setSavingBundle] = React.useState(false);
    const [linkCopied, setLinkCopied] = React.useState(false);

    const router = Router.useRouter();
    const setToast = Stores.useToastStore((state) => state.setToast);

    const saveBundle = async (data: Omit<Interfaces.ClientPublicationBundle, 'id'>) => {
        if (!bundle) {
            return;
        }

        setSavingBundle(true);
        try {
            await api.patch(
                `${Config.endpoints.publicationBundles}/${bundle.id}`,
                {
                    name: data.name,
                    publicationIds: data.entries.map((entry) => entry.publicationId)
                },
                token ?? undefined
            );
            setToast({
                visible: true,
                title: 'Bundle saved successfully',
                message: `The bundle "${data.name}" has been updated with ${data.entries.length} publications.`,
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-600" />,
                dismiss: true
            });

            router.push(Config.urls.viewBundles.path);
        } catch (err) {
            console.error('Error saving bundle:', err);
            setToast({
                visible: true,
                title: 'Error creating bundle',
                message: 'An error occurred while creating the bundle. Please try again.',
                icon: <OutlineIcons.XCircleIcon className="h-6 w-6 text-red-600" />,
                dismiss: true
            });
        }
        setSavingBundle(false);
    };

    const bundleShareableLink = useMemo(() => {
        if (!bundle) return '';
        const path = `${Config.urls.viewBundle.path}/${bundle.id}`;
        const origin = process.env.NEXT_PUBLIC_BASE_URL;

        return `${origin}${path}`;
    }, [bundle]);

    const copyToClipboard = () => {
        if (!bundleShareableLink) return;

        navigator.clipboard
            .writeText(bundleShareableLink)
            .then(() => {
                setLinkCopied(true);
                setToast({
                    visible: true,
                    title: 'Link copied to clipboard',
                    message: 'You can now share this link with others.',
                    icon: <OutlineIcons.CheckIcon className="h-6 w-6 text-teal-600" />,
                    dismiss: true
                });
                setTimeout(() => setLinkCopied(false), 3000);
            })
            .catch((err) => {
                console.error('Failed to copy link:', err);
                setToast({
                    visible: true,
                    title: 'Error copying link',
                    message: 'An error occurred while copying the link. Please try again.',
                    icon: <OutlineIcons.XCircleIcon className="h-6 w-6 text-red-600" />,
                    dismiss: true
                });
            });
    };

    return (
        <>
            <Head>
                <title>{Config.urls.viewBundle.documentTitle}</title>
                <meta name="description" content={Config.urls.viewBundle.description} />
                <meta name="og:title" content={Config.urls.viewBundle.documentTitle} />
                <meta name="og:description" content={Config.urls.viewBundle.description} />
                <meta name="keywords" content={Config.urls.viewBundle.keywords.join(', ')} />
                {bundle ? <link rel="canonical" href={`${Config.urls.viewBundle.canonical}/${bundle.id}`} /> : null}
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                    {bundle ? (
                        <>
                            <Components.PageTitle text={bundle.name} className={editMode ? 'lg:mb-2' : 'mb-4'} />
                            {editMode ? (
                                <h2 className="font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 mb-8 mt-4 lg:mt-0 ">
                                    Shareable link:{' '}
                                    <Components.Button
                                        childClassName="truncate max-w-[calc(100vw-6rem)]"
                                        onClick={copyToClipboard}
                                        title={bundleShareableLink}
                                        endIcon={
                                            linkCopied ? (
                                                <OutlineIcons.ClipboardDocumentCheckIcon className="h-5 w-5 text-green-500 transition-colors duration-500 dark:text-green-50" />
                                            ) : (
                                                <OutlineIcons.ClipboardDocumentIcon className="h-5 w-5 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                            )
                                        }
                                    >
                                        {bundleShareableLink}
                                    </Components.Button>
                                </h2>
                            ) : null}
                            <Components.PublicationBundleForm
                                bundle={bundle}
                                onSave={saveBundle}
                                editable={editMode}
                                isSaving={savingBundle}
                            />
                        </>
                    ) : (
                        <>
                            <Components.PageTitle text="Bundle not found" className="mb-8" />
                            <Components.PageSubTitle
                                text="The bundle you are trying to view does not exist or has been deleted."
                                className="font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50"
                            />
                        </>
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default ViewBundle;
