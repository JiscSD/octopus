import React, { useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    className?: string;
    crosslink: Interfaces.RelativeCrosslink;
    sourcePublicationId: string;
    mutateList: () => void; // Refetch the list of related publications, e.g. after this one is deleted.
    setError: (message: string) => void;
};

const RelatedPublicationsResult: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const coAuthors = props.crosslink.linkedPublication.latestLiveVersion.coAuthors;
    const publicationVersion = props.crosslink.linkedPublication.latestLiveVersion;
    const publicationId = props.crosslink.linkedPublication.id;
    const authorNames = React.useMemo(() => {
        return !coAuthors.length
            ? Helpers.abbreviateUserName(publicationVersion.user)
            : coAuthors.map((author) => Helpers.abbreviateUserName(author.user)).join(', ');
    }, [coAuthors, publicationVersion.user]);

    const handleDeleteCrosslink = async () => {
        setDeleteLoading(true);
        try {
            await api.destroy(`${Config.endpoints.crosslinks}/${props.crosslink.id}`, user?.token);
            props.mutateList();
        } catch (err) {
            props.setError('Failed to delete link.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div
            className={`
                    h-[6rem]
                    items-start
                    overflow-hidden
                    rounded-none
                    border-b
                    border-grey-50
                    bg-white-50
                    px-4
                    py-4
                    shadow
                    outline-0
                    transition-colors
                    duration-500
                    hover:opacity-95
                    focus:overflow-hidden
                    focus:border-transparent
                    focus:opacity-95
                    focus:ring-2
                    focus:ring-yellow-500
                    dark:border-grey-600
                    dark:bg-grey-700
                    w-full
                    flex
                    flex-col
                    justify-between
                    ${props.className ? props.className : ''}
                `}
        >
            <p className="text-left font-semibold mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50 truncate w-full">
                {publicationVersion.title}
            </p>

            <div className="flex justify-between w-full">
                <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                    title={authorNames}
                >
                    By {authorNames} | {Helpers.relativeDate(publicationVersion.publishedDate)}
                </span>
                <span className="flex">
                    <Components.Link
                        href={`${Config.urls.viewPublication.path}/${publicationId}?suggestedFrom=${props.sourcePublicationId}`}
                        openNew={true}
                        ariaLabel={'Visit publication'}
                        className="block p-1"
                    >
                        <OutlineIcons.ArrowTopRightOnSquareIcon className="h-4 w-4 text-teal-600" />
                    </Components.Link>
                    {props.crosslink.createdBy === user?.id && (
                        <Components.IconButton
                            icon={<OutlineIcons.TrashIcon className="h-4 w-4 text-teal-600" />}
                            title="Delete suggestion"
                            onClick={handleDeleteCrosslink}
                            className="ml-2"
                            disabled={deleteLoading}
                        />
                    )}
                </span>
            </div>
        </div>
    );
};

export default RelatedPublicationsResult;
