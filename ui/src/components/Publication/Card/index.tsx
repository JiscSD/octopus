import React from 'react';

import * as SolidIcons from '@heroicons/react/24/solid';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Assets from '@assets';

type Props = {
    publication: Interfaces.Publication;
    bodyClassName?: string;
    buttonClassName?: string;
};

const Card: React.FC<Props> = (props): React.ReactElement => {
    const authors = React.useMemo(() => {
        const authors = props.publication.coAuthors.filter((author) => author.confirmedCoAuthor && author.user);

        // make sure authors list include the corresponding author
        const correspondingUser = props.publication.user;
        if (!authors.find((author) => author.linkedUser === correspondingUser.id)) {
            authors.unshift({
                id: correspondingUser.id,
                approvalRequested: false,
                confirmedCoAuthor: true,
                email: correspondingUser.email || '',
                publicationVersionId: props.publication.versionId,
                linkedUser: correspondingUser.id,
                isIndependent: true,
                affiliations: [],
                user: {
                    orcid: correspondingUser.orcid,
                    firstName: correspondingUser.firstName,
                    lastName: correspondingUser.lastName
                }
            });
        }

        return authors;
    }, [props.publication]);

    const authorNames = React.useMemo(
        () => authors.map((author) => `${author.user?.firstName[0]}. ${author.user?.lastName}`).join(', '),
        [authors]
    );

    return (
        <div className="rounded-md shadow">
            <div
                className={`rounded-t-lg border-b border-teal-500 bg-white-50 p-4 transition-colors duration-500 dark:bg-grey-700 ${props.bodyClassName}`}
            >
                <p className="mb-4 mt-2 block min-h-[6rem] font-montserrat text-lg font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white-50 lg:min-h-[7rem] 2xl:text-xl">
                    {props.publication.title.length > 80
                        ? Helpers.truncateString(props.publication.title, 69)
                        : props.publication.title}
                </p>
                <span className="mb-4 block font-montserrat text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={authorNames}>
                        {authors.map((author, index) => (
                            <span key={author.id}>
                                <Components.Link href={`${Config.urls.viewUser.path}/${author.linkedUser}`}>
                                    <>
                                        {author.user?.firstName[0]}. {author.user?.lastName}
                                    </>
                                </Components.Link>
                                {author.linkedUser !== 'octopus' && (
                                    <>
                                        &nbsp;
                                        <a
                                            href={`https://${
                                                process.env.NEXT_PUBLIC_STAGE === 'local' ? 'sandbox.' : ''
                                            }orcid.org/${author.user?.orcid}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Assets.OrcidLogoIcon width={16} className="inline align-middle" />
                                        </a>
                                    </>
                                )}
                                {index < authors.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                </span>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        {Helpers.formatPublicationType(props.publication.type)}
                    </span>
                    <time
                        className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                        suppressHydrationWarning
                    >
                        {Helpers.formatDate(props.publication.publishedDate)}
                    </time>
                </div>
            </div>
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
                className={`flex w-full items-center justify-center rounded-b-lg bg-white-50 p-4 font-montserrat font-medium tracking-tight outline-0 transition-colors duration-500 hover:bg-grey-50 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600 print:hidden ${props.buttonClassName}`}
            >
                <span className="mr-4 text-sm text-teal-600 dark:text-teal-300">View this publication</span>
                <SolidIcons.EyeIcon className="h-5 w-5 text-teal-500" />
            </Components.Link>
        </div>
    );
};

export default Card;
