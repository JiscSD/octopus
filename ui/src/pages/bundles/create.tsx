import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';

export const getStaticProps: Types.GetStaticProps = async () => ({
    props: {
        protectedPage: true
    }
});

const CreateBundle: NextPage = (): JSX.Element => {
    const [savingBundle, setSavingBundle] = React.useState(false);

    const router = Router.useRouter();
    const setToast = Stores.useToastStore((state) => state.setToast);
    const user = Stores.useAuthStore((state) => state.user);

    const saveBundle = async (bundle: Pick<Interfaces.PublicationBundle, 'name' | 'entries'>) => {
        setSavingBundle(true);
        try {
            await api.post(
                Config.endpoints.publicationBundles,
                {
                    name: bundle.name,
                    publicationIds: bundle.entries.map((entry) => entry.publicationId)
                },
                user?.token
            );
            setToast({
                visible: true,
                title: 'Bundle created successfully',
                message: `The bundle "${bundle.name}" has been created with ${bundle.entries.length} publications.`,
                icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-600" />,
                dismiss: true
            });

            router.push(Config.urls.viewBundles.path);

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
                <title>{Config.urls.createBundle.documentTitle}</title>
                <meta name="description" content={Config.urls.createBundle.description} />
                <meta name="og:title" content={Config.urls.createBundle.documentTitle} />
                <meta name="og:description" content={Config.urls.createBundle.description} />
                <meta name="keywords" content={Config.urls.createBundle.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.createBundle.canonical} />
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                    <Components.PageTitle text={Config.urls.createBundle.title} className="mb-8" />
                    <Components.PageSubTitle
                        text="Save this bundle to create a shareable link"
                        className="font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50"
                    />
                    <Components.PublicationBundleForm onSave={saveBundle} isSaving={savingBundle} editable={true} />
                </section>
            </Layouts.Standard>
        </>
    );
};

export default CreateBundle;
