import React from 'react';

import * as OutlineIcons from '@heroicons/react/outline';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';

import * as Components from '@components';

type Props = {
    publication: Interfaces.BookmarkedPublication;
    token: string;
    onDelete: () => void;
};

const BookmarkedPublications: React.FC<Props> = (props): React.ReactElement => {
    const [deleteLoading, setDeleteLoading] = React.useState(false);

    const onRemoveBookmarkHandler = async () => {
        props.onDelete();
        setDeleteLoading(true);
    };

    return (
        <div className="mb-8 flex grid-cols-8 items-center justify-center align-middle ">
            <Components.Link
                key={props.publication.id}
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
                className="col-span-7 flex w-full"
            >
                <div className="w-full rounded border border-transparent bg-white-50 p-3 shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:shadow-none">
                    <div className="lg: flex justify-between">
                        <div className="flex items-end text-sm">
                            <span className="mr-2 leading-3 text-pink-500 ">
                                {Helpers.formatPublicationType(props.publication.type)}
                            </span>
                            {props.publication.publishedDate ? (
                                <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                                    Published: {Helpers.formatDate(props.publication.publishedDate)}
                                </span>
                            ) : (
                                <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                                    Last updated: {Helpers.formatDate(props.publication.updatedAt)}
                                </span>
                            )}
                        </div>
                        <span className="text-xs leading-3 text-teal-500 empty:hidden">{props.publication.doi}</span>
                    </div>
                    <span className="mt-2 block font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.publication.title}
                    </span>
                    <span className=" mt-2 block font-montserrat text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.publication.user.firstName} {props.publication.user.lastName}
                        {props.publication.coAuthors &&
                            props.publication.coAuthors.map(
                                (author) => ', ' + author.user.firstName + ' ' + author.user.lastName
                            )}
                    </span>
                </div>
            </Components.Link>
            <button
                className="col-span-1 ml-2 h-8 align-middle hover:cursor-pointer focus:outline-none focus:ring focus:ring-yellow-200 focus:ring-offset-2 dark:outline-none dark:focus:ring dark:focus:ring-yellow-600 dark:focus:ring-offset-1"
                onClick={onRemoveBookmarkHandler}
            >
                {deleteLoading ? (
                    <OutlineIcons.RefreshIcon className="h-8 w-8 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                ) : (
                    <OutlineIcons.XCircleIcon className="h-8 w-8 text-blue-700 transition duration-150 dark:text-blue-50" />
                )}
            </button>
        </div>
    );
};

export default BookmarkedPublications;
