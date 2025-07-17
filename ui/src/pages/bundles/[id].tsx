import React from 'react';
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

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
    const token = Helpers.getJWT(context);
    const id = context.params?.id as string;

    let bundle: Interfaces.PublicationBundle | null = null;

    try {
        const response = await api.get(`${Config.endpoints.publicationBundles}/${id}`, token);
        bundle = response.data;
    } catch (err) {
        console.log(err);
    }

    return {
        props: {
            bundle,
            token,
            protectedPage: true
        }
    };
});

type Props = {
    bundle: Interfaces.PublicationBundle | null;
    token: string;
};

const ViewBundle: NextPage<Props> = (props): JSX.Element => {
    const { bundle } = props;
    const [savingBundle, setSavingBundle] = React.useState(false);

    const router = Router.useRouter();
    const setToast = Stores.useToastStore((state) => state.setToast);
    const user = Stores.useAuthStore((state) => state.user);

    const saveBundle = async (data: Pick<Interfaces.PublicationBundle, 'name' | 'publications'>) => {
        if (!bundle) {
            return;
        }

        setSavingBundle(true);
        try {
            await api.patch(
                `${Config.endpoints.publicationBundles}/${bundle.id}`,
                {
                    name: data.name,
                    publicationIds: data.publications.map((publication) => publication.id)
                },
                user?.token
            );
            setToast({
                visible: true,
                title: 'Bundle saved successfully',
                message: `The bundle "${data.name}" has been updated with ${data.publications.length} publications.`,
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
                            <Components.PageTitle text={bundle.name} className="mb-8" />
                            <Components.PageSubTitle
                                text=""
                                // text={`Shareable link: ${ Config.urls.viewBundle.path }/${bundle.id}`}
                                className="font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50"
                            />
                            <Components.PublicationBundleForm
                                bundle={bundle}
                                onSave={saveBundle}
                                isSaving={savingBundle}
                            />
                        </>
                    ) : (
                        <>
                            <Components.PageTitle text="Bundle not found" className="mb-8" />
                            <Components.PageSubTitle
                                text="The bundle you are trying to edit does not exist or has been deleted."
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
