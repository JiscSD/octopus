import React from 'react';
import * as Stores from '@stores';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as OutlineIcons from '@heroicons/react/24/outline';

type Props = {
    publication: Interfaces.Publication;
    isReadyForPublish: boolean;
    isCorrespondingAuthor: boolean;
    isPublishing: boolean;
    onUnlockPublication: () => Promise<void>;
    onApprove: () => Promise<void>;
    onCancelApproval: () => Promise<void>;
    onPublish: () => Promise<void>;
    onEditAffiliations: () => void;
};

const ActionBar: React.FC<Props> = (props) => {
    const { user } = Stores.useAuthStore();

    const author = React.useMemo(
        () => props.publication.coAuthors.find((author) => author.linkedUser === user?.id),
        [props.publication.coAuthors, user?.id]
    );

    const sortedAffiliationNames = React.useMemo(
        () =>
            author
                ? Helpers.getSortedAffiliations(author.affiliations).map((affiliation) => affiliation.organization.name)
                : [],
        [author]
    );

    const isApproved = React.useMemo(() => author?.confirmedCoAuthor || false, [author?.confirmedCoAuthor]);

    return (
        <div className="mb-4 flex flex-col gap-12 rounded-lg bg-grey-50 p-6 text-grey-900 shadow ring-1 ring-black ring-opacity-5 transition-colors duration-500 dark:bg-grey-700 dark:text-white-50 dark:ring-transparent xl:flex-row xl:gap-6">
            <div className="flex-1">
                <h4>
                    <strong>Publication status:</strong>{' '}
                    {user ? Helpers.getPublicationStatusByAuthor(props.publication, user) : ''}
                </h4>
                <div className="my-6 flex items-start text-sm">
                    <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px]" />
                    <p>
                        This publication is only visible to authors. All authors must approve this draft before it can
                        be published.
                    </p>
                </div>
                {props.isCorrespondingAuthor && (
                    <div className="flex items-start text-sm">
                        <OutlineIcons.LockClosedIcon className="mr-2 inline max-w-[20px]" />
                        <div>
                            <p className="pb-1">This publication is locked for approval.</p>
                            <Components.Link
                                className="inline w-fit rounded text-teal-600 underline outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-teal-200 dark:decoration-teal-200"
                                href={`${Config.urls.viewPublication.path}/${props.publication.id}/edit?step=4`}
                                title="Edit publication"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await props.onUnlockPublication();
                                }}
                            >
                                Cancel all authorship requests and unlock for editing
                            </Components.Link>
                        </div>
                    </div>
                )}
                {!props.isCorrespondingAuthor && (
                    <div className="flex items-start text-sm">
                        <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px]" />
                        <p>
                            {isApproved
                                ? 'You have already approved this publication.'
                                : 'If any changes are required, please discuss with the corresponding author.'}
                        </p>
                    </div>
                )}
            </div>
            <div className="hidden w-[1px] bg-grey-700 dark:bg-white-100 xl:block"></div>
            <div className="flex-1">
                {(props.isCorrespondingAuthor || !author?.confirmedCoAuthor) && (
                    <>
                        <h4>
                            <strong>Your affiliations</strong>
                        </h4>
                        <div className="my-6 flex items-start text-sm">
                            {author && (
                                <div className="flex cursor-default items-center gap-4">
                                    {author.isIndependent ? (
                                        <p>Unaffiliated</p>
                                    ) : !author.isIndependent && !author.affiliations.length ? (
                                        <p>Affiliations not entered</p>
                                    ) : (
                                        <div title={sortedAffiliationNames.join(', ')}>
                                            {sortedAffiliationNames.length > 3
                                                ? sortedAffiliationNames
                                                      .slice(0, 2)
                                                      .concat(`+${sortedAffiliationNames.length - 2} more`)
                                                      .map((affiliationName, index) => (
                                                          <p key={`affiliation-${index}`}>
                                                              {affiliationName}
                                                              {index < 2 ? ',' : ''}
                                                          </p>
                                                      ))
                                                : sortedAffiliationNames.map((affiliationName, index) => (
                                                      <p key={`affiliation-${index}`}>
                                                          {affiliationName}
                                                          {index < sortedAffiliationNames.length - 1
                                                              ? ','
                                                              : index > 0
                                                              ? '.'
                                                              : ''}
                                                      </p>
                                                  ))}
                                        </div>
                                    )}

                                    <Components.Link
                                        className="inline w-fit rounded border-transparent text-teal-600 underline decoration-teal-500 underline-offset-2 outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-200 dark:decoration-teal-200"
                                        href="#"
                                        role="button"
                                        title={
                                            !(author.isIndependent || author.affiliations.length)
                                                ? 'Select your affiliations'
                                                : 'Edit your affiliations'
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            props.onEditAffiliations();
                                        }}
                                    >
                                        {!(author.isIndependent || author.affiliations.length)
                                            ? 'Select your affiliations'
                                            : 'Edit your affiliations'}
                                    </Components.Link>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <h4 className="mb-4">
                    <strong>{props.isCorrespondingAuthor ? 'Publishing' : 'Approval'}</strong>
                </h4>

                {!(author?.isIndependent || author?.affiliations.length) && (
                    <div className="mb-4 flex items-start text-sm">
                        <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px] text-red-500" />
                        <p>Affiliations must be selected before approving the publication.</p>
                    </div>
                )}

                {props.isCorrespondingAuthor &&
                    props.publication.coAuthors.some((author) => !author.confirmedCoAuthor) && (
                        <div className="mb-4 flex items-start text-sm">
                            <OutlineIcons.ExclamationCircleIcon className="mr-2 inline max-w-[20px] text-red-500" />
                            <p>
                                All authors must add their affiliations and approve the publication before you can
                                publish.
                            </p>
                        </div>
                    )}

                {props.isCorrespondingAuthor ? (
                    <Components.Button
                        className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                        disabled={!props.isReadyForPublish || props.isPublishing}
                        endIcon={<OutlineIcons.CloudArrowUpIcon className="w-5 shrink-0 text-white-50" />}
                        title="Publish"
                        onClick={props.onPublish}
                    >
                        Publish
                    </Components.Button>
                ) : isApproved ? (
                    <Components.Button
                        className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-red-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                        endIcon={<OutlineIcons.XMarkIcon className="w-5 shrink-0 text-white-50" />}
                        title="Cancel your approval"
                        onClick={props.onCancelApproval}
                    >
                        Cancel your approval
                    </Components.Button>
                ) : (
                    <Components.Button
                        className="inline-flex max-w-fit items-center rounded border-2 border-transparent bg-teal-600 px-2.5 text-white-50 shadow-sm outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed children:border-0 children:text-white-50"
                        disabled={!(author?.isIndependent || author?.affiliations.length)}
                        endIcon={<OutlineIcons.CheckIcon className="w-5 shrink-0 text-white-50" />}
                        title="Approve this publication"
                        onClick={props.onApprove}
                    >
                        Approve this publication
                    </Components.Button>
                )}
            </div>
        </div>
    );
};

export default ActionBar;
