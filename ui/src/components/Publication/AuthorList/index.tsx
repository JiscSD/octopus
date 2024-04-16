import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as Assets from '@/assets';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';

type AuthorListProps = {
    authors: Interfaces.CoAuthor[];
    className?: string;
};

const AuthorList: React.FC<AuthorListProps> = (props) => {
    const authors = props.authors.map((author, index) => {
        // A link to visit the author's external page.
        const externalLink =
            author.user &&
            // If the user is an organisational account and they have a URL, link there.
            // Otherwise just show an icon.
            (author.user.role === 'ORGANISATION' ? (
                author.user.url ? (
                    <Components.Link
                        className="flex ml-2 w-fit"
                        href={author.user.url}
                        title="Visit organisation's site"
                        openNew={true}
                    >
                        <SolidIcons.BuildingOfficeIcon
                            className="w-4 text-grey-800 dark:text-grey-100"
                            title="Organisational account icon"
                        />
                    </Components.Link>
                ) : (
                    <SolidIcons.BuildingOfficeIcon
                        aria-hidden={false}
                        className="w-4 ml-2 text-grey-800 dark:text-grey-100"
                        title="Organisational account icon"
                    />
                )
            ) : (
                // For standard users link to their ORCiD profile.
                <Components.Link
                    className="ml-2 flex w-fit items-center"
                    href={`https://${
                        process.env.NEXT_PUBLIC_STAGE === 'local' ? 'sandbox.' : ''
                    }orcid.org/${author.user?.orcid}`}
                    title="Visit ORCiD profile"
                    openNew={true}
                >
                    <Assets.OrcidLogoIcon width={24} />
                </Components.Link>
            ));
        return (
            <div key={author.id} className="flex w-fit items-center">
                <Components.Link
                    href={`${Config.urls.viewUser.path}/${author.linkedUser}`}
                    className="w-fit rounded leading-relaxed text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                >
                    <span className="author-name">{Helpers.abbreviateUserName(author.user)}</span>
                </Components.Link>
                {externalLink}
                {index < props.authors.length - 1 && (
                    <span className="leading-relaxed text-teal-600 transition-colors duration-500 dark:text-teal-400">
                        ,
                    </span>
                )}
            </div>
        );
    });

    return props.authors.length ? (
        <div className={`flex flex-wrap items-center gap-2 ${props.className}`}>{authors}</div>
    ) : null;
};

export default AuthorList;
