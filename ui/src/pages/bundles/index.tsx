import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Framer from 'framer-motion';
import Head from 'next/head';
import React from 'react';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Contexts from '@/contexts';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Stores from '@/stores';
import * as Types from '@/types';
import useSWR from 'swr';

export const getServerSideProps: Types.GetServerSideProps = Helpers.withServerSession(async (context) => {
    const token = Helpers.getJWT(context);
    const limit = Helpers.extractNextQueryParam(context.query.limit, true) || '10';
    const offset = Helpers.extractNextQueryParam(context.query.offset, true) || '0';

    let fallback: Interfaces.SearchResults<Interfaces.PublicationBundle> = {
        data: [],
        metadata: {
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            total: 0
        }
    };

    try {
        const response = await api.get(`${Config.endpoints.publicationBundles}?limit=${limit}&offset=${offset}`, token);
        fallback = response.data;
    } catch (err) {
        console.log(err);
    }

    return {
        props: {
            fallback,
            token,
            protectedPage: true
        }
    };
});

type Props = {
    fallback: Interfaces.SearchResults<Interfaces.PublicationBundle>;
    token: string;
};

const ViewBundles: Types.NextPage<Props> = (props): JSX.Element => {
    const { fallback, token } = props;

    const [offset, setOffset] = React.useState(fallback.metadata.offset ? fallback.metadata.offset : 0);
    const [isDeletingId, setIsDeletingId] = React.useState('');

    const swrKey = `/publication-bundles?limit=10&offset=${offset}`;

    const scrollTargetRef = React.useRef<HTMLDivElement>(null);

    const {
        data: response,
        error,
        isValidating,
        mutate
    } = useSWR<Interfaces.SearchResults<Interfaces.PublicationBundle>>(swrKey, null, {
        fallback: { [swrKey]: fallback },
        use: [Helpers.laggy]
    });

    const setToast = Stores.useToastStore((state) => state.setToast);
    const user = Stores.useAuthStore((state) => state.user);
    const [bundleName, setBundleName] = React.useState<string>('');
    const [deletionUpdate, setDeletionUpdate] = React.useState('');

    const confirmation = Contexts.useConfirmationModal();

    const handleDelete = async (bundleId: string) => {
        if (!response) {
            return;
        }

        const bundle = response.data.find((bundle) => bundle.id === bundleId);
        if (!bundle) {
            return;
        }

        const confirmed = await confirmation(
            'Remove bundle',
            <p>Are you sure you want to delete this publication bundle?</p>,
            <OutlineIcons.TrashIcon className="h-8 w-8 text-grey-600" aria-hidden="true" />,
            'Confirm'
        );
        if (confirmed) {
            setIsDeletingId(bundle.id);
            try {
                await api.destroy(`${Config.endpoints.publicationBundles}/${bundleId}`, token);
                await mutate();
            } catch (err) {
                console.error(err);
                setToast({
                    visible: true,
                    dismiss: true,
                    title: 'Error removing bundle',
                    icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                    message: 'There was an error removing the bundle. Please try again later.'
                });
                return;
            } finally {
                setIsDeletingId('');
            }

            setDeletionUpdate(`Bundle ${bundle?.name} has been removed.`);
        }
    };

    const scrollFunction = () => {
        if (!scrollTargetRef.current) return;
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head>
                <title>{Config.urls.viewBundles.documentTitle}</title>
                <meta name="description" content={Config.urls.viewBundles.description} />
                <meta name="og:title" content={Config.urls.viewBundles.documentTitle} />
                <meta name="og:description" content={Config.urls.viewBundles.description} />
                <meta name="keywords" content={Config.urls.viewBundles.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.viewBundles.canonical} />
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <section className="container px-8 pb-10 pt-10">
                    <div
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 lg:mb-0 xl:w-2/3 2xl:w-1/2"
                        ref={scrollTargetRef}
                    >
                        <Components.PageTitle text={Config.urls.viewBundles.title} />
                        <Components.Button
                            title="Create new bundle"
                            className="lg:mb-8"
                            href={Config.urls.createBundle.path}
                            endIcon={
                                <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                            }
                        />
                    </div>

                    <div className="xl:w-2/3 2xl:w-1/2">
                        <div className="sr-only" aria-live="polite">
                            {deletionUpdate}
                        </div>

                        {!response!.data.length ? (
                            <Components.Alert
                                key="no-results-alert"
                                severity="INFO"
                                title="You do not have any publication bundles"
                            />
                        ) : (
                            <Components.PaginatedResults
                                offset={offset}
                                setOffset={setOffset}
                                isValidating={offset > 0 ? isValidating : false}
                                limit={fallback.metadata.limit}
                                total={response?.metadata.total || 0}
                                noResultsTitle="You do not have any publication bundles"
                                scrollFunction={scrollFunction}
                                results={
                                    <ViewBundlesResults
                                        onDelete={handleDelete}
                                        bundles={response!.data}
                                        isDeletingId={isDeletingId}
                                    />
                                }
                            />
                        )}
                    </div>
                </section>
            </Layouts.Standard>
        </>
    );
};

function ViewBundlesResults(props: {
    bundles: Interfaces.PublicationBundle[];
    isDeletingId: string;
    onDelete: (id: string) => void;
}): JSX.Element | null {
    const { bundles, onDelete, isDeletingId } = props;

    const iconClasses = 'size-5 md:size-6 text-teal-600 transition-colors duration-500 dark:text-teal-400 ';
    const thClasses =
        'whitespace-pre py-3.5 px-3 sm:px-6 text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 text-left';
    const tdClasses = 'py-3.5 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    if (!bundles.length) {
        return null;
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent">
            <table
                className="min-w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                aria-label="Bundles list"
            >
                <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                    <tr>
                        <th className={thClasses}>Name</th>
                        <th className={`hidden md:table-cell ${thClasses}`}>Date created</th>
                        <th className={`text-center hidden md:table-cell ${thClasses}`}>View</th>
                        <th className={`text-center ${thClasses}`}>Delete</th>
                    </tr>
                </thead>
                <tbody className="my-4 bg-white-50 transition-colors duration-500 dark:bg-grey-600">
                    {bundles.map((bundle) => (
                        <tr key={bundle.id}>
                            <td className={`w-3/4 ${tdClasses}`}>
                                <div className="flex flex-col gap-2">
                                    <p className="hidden md:block font-medium">{bundle.name || 'Untitled Bundle'}</p>
                                    <Components.Link
                                        href={`${Config.urls.viewBundles.path}/${bundle.id}`}
                                        className="text-teal-600 hover:underline dark:text-teal-400 font-medium md:hidden"
                                        aria-label={`View bundle ${bundle.name || 'Untitled Bundle'}`}
                                    >
                                        {bundle.name || 'Untitled Bundle'}
                                    </Components.Link>
                                    <p className="text-xs">
                                        <span className="md:hidden">{Helpers.formatDate(bundle.createdAt)},</span>{' '}
                                        {bundle.entries.length} publications
                                    </p>
                                </div>
                            </td>
                            <td className={`w-1/4 hidden md:table-cell ${tdClasses}`}>
                                {Helpers.formatDate(bundle.createdAt)}
                            </td>
                            <td className={`w-1/4 hidden md:table-cell ${tdClasses}`}>
                                <div className="flex items-center justify-center">
                                    <Components.Link
                                        href={`${Config.urls.viewBundle.path}/${bundle.id}`}
                                        ariaLabel={'View bundle details'}
                                        className="p-2"
                                    >
                                        <OutlineIcons.ArrowTopRightOnSquareIcon className={iconClasses} />
                                    </Components.Link>
                                </div>
                            </td>
                            <td className={`w-1/4 text-sm ${tdClasses}`}>
                                <div className="flex items-center justify-center">
                                    <Components.IconButton
                                        className="p-2"
                                        title="Delete"
                                        icon={
                                            isDeletingId === bundle.id ? (
                                                <OutlineIcons.ArrowPathIcon
                                                    className={iconClasses + ' animate-spin'}
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <OutlineIcons.TrashIcon className={iconClasses} aria-hidden="true" />
                                            )
                                        }
                                        disabled={isDeletingId === bundle.id}
                                        onClick={async () => onDelete(bundle.id)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewBundles;
