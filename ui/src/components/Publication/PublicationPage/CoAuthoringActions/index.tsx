import axios from 'axios';
import React from 'react';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Stores from '@/stores';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    isReadyForPublish: boolean;
    isCorrespondingAuthor: boolean;
    isLoading: boolean;
    onUnlockPublication: () => Promise<void>;
    onApprove: () => Promise<void>;
    onCancelApproval: () => Promise<void>;
    onPublish: () => Promise<void>;
    onEditAffiliations: () => void;
    setServerError: (error: string) => void;
};

const CoAuthoringActions: React.FC<Props> = (props) => {
    const { user } = Stores.useAuthStore();
    const [isLoading, setIsLoading] = React.useState<boolean>(props.isLoading);
    const [approvalRetentionChangeFeedback, setApprovalRetentionChangeFeedback] = React.useState<string>('');

    const author = React.useMemo(
        () => props.publicationVersion.coAuthors.find((author) => author.linkedUser === user?.id),
        [props.publicationVersion.coAuthors, user?.id]
    );

    const [retainApproval, setRetainApproval] = React.useState<boolean>(
        author?.retainApproval === false ? false : true
    );

    const sortedAffiliationNames = React.useMemo(
        () =>
            author
                ? Helpers.getSortedAffiliations(author.affiliations).map((affiliation) => affiliation.organization.name)
                : [],
        [author]
    );

    const isApproved = React.useMemo(() => author?.confirmedCoAuthor || false, [author?.confirmedCoAuthor]);

    const updateApprovalRetention = React.useCallback(
        async (retainApproval: boolean) => {
            props.setServerError('');
            setIsLoading(true);
            try {
                await api.patch(
                    `/publication-versions/${props.publicationVersion?.id}/coauthors/${author?.id}`,
                    {
                        retainApproval
                    },
                    user?.token
                );
                setRetainApproval(retainApproval);
                setApprovalRetentionChangeFeedback('Your approval retention preference has been submitted.');
            } catch (err) {
                props.setServerError(axios.isAxiosError(err) ? err.response?.data?.message : (err as Error).message);
            }
            setIsLoading(false);
        },
        [props.publicationVersion?.id, user?.token]
    );

    return (
        <div className="mb-4 flex flex-col gap-12 rounded-lg bg-grey-50 p-6 text-grey-900 shadow ring-1 ring-black ring-opacity-5 transition-colors duration-500 dark:bg-grey-700 dark:text-white-50 dark:ring-transparent xl:flex-row xl:gap-6">
            <div className="flex-1">
                <h4>
                    <strong>Publication status:</strong>{' '}
                    {user ? Helpers.getPublicationStatusByAuthor(props.publicationVersion, user) : ''}
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
                                href={`${Config.urls.viewPublication.path}/${props.publicationVersion.publication.id}/edit?step=0`}
                                title="Edit publication"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await props.onUnlockPublication();
                                }}
                            >
                                Cancel pending authorship requests and unlock for editing
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
                    props.publicationVersion.coAuthors.some((author) => !author.confirmedCoAuthor) && (
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
                        className="max-w-fit"
                        variant="block"
                        disabled={!props.isReadyForPublish || props.isLoading}
                        endIcon={<OutlineIcons.CloudArrowUpIcon className="w-5 shrink-0 text-white-50" />}
                        title="Publish"
                        onClick={props.onPublish}
                    >
                        Publish
                    </Components.Button>
                ) : (
                    <>
                        <Components.Checkbox
                            checked={retainApproval}
                            className="mb-4"
                            disabled={isLoading}
                            id="retain-approval"
                            label="Automatically approve future changes to this draft"
                            name="retain-approval"
                            onChange={(event) => updateApprovalRetention(event.target.checked)}
                        />
                        <div aria-live="polite" className="sr-only">
                            {approvalRetentionChangeFeedback}
                        </div>
                        {isApproved ? (
                            <Components.Button
                                className="max-w-fit"
                                variant="block"
                                endIcon={<OutlineIcons.XMarkIcon className="w-5 shrink-0 text-white-50" />}
                                title="Cancel your approval"
                                onClick={props.onCancelApproval}
                            >
                                Cancel your approval
                            </Components.Button>
                        ) : (
                            <Components.Button
                                className="max-w-fit"
                                variant="block"
                                disabled={!(author?.isIndependent || author?.affiliations.length) || props.isLoading}
                                endIcon={<OutlineIcons.CheckIcon className="w-5 shrink-0 text-white-50" />}
                                title="Approve this publication"
                                onClick={props.onApprove}
                            >
                                Approve this publication
                            </Components.Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CoAuthoringActions;
