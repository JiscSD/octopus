import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Types from '@/types';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const sampleLinkedPublication = {
    id: 'test-parent',
    type: 'PROBLEM' as Types.PublicationType,
    doi: '10.1234/test',
    title: 'Test Title',
    publishedDate: '2025-04-07T00:00:00Z',
    currentStatus: 'LIVE' as Types.PublicationStatus,
    createdBy: 'test-user',
    authorFirstName: 'Test',
    authorLastName: 'User',
    authors: [
        {
            id: 'coauthor-1',
            linkedUser: 'test-user',
            publicationVersionId: 'test-parent-v1',
            user: {
                firstName: 'Test',
                lastName: 'User',
                orcid: '0000-0001-2345-6789',
                role: 'USER' as Types.UserRole
            }
        }
    ],
    flagCount: 0,
    peerReviewCount: 0,
    linkId: 'test-link',
    draft: true,
    childPublicationId: 'test-child',
    childPublicationType: 'PROBLEM' as Types.PublicationType,
    externalSource: null
};

describe('New linked publication row', () => {
    const deleteLinkMock = jest.fn(() => Promise.resolve());
    beforeEach(() => {
        render(
            // Also render a table to prevent validateDOMNesting errors for orphaned row.
            <table>
                <tbody>
                    <Components.LinkedPublicationRow
                        deleteLink={deleteLinkMock}
                        linkedPublication={sampleLinkedPublication}
                        markLinkForDeletion={jest.fn()}
                    />
                </tbody>
            </table>
        );
    });

    it('Row is rendered', () => {
        expect(screen.getByRole('row')).toBeInTheDocument();
    });

    it('Publication type is shown', () => {
        expect(screen.getByText('Research Problem')).toBeInTheDocument();
    });

    it('Title is shown', () => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('Published date is shown', () => {
        expect(screen.getByText(Helpers.formatDate('2025-04-07T00:00:00Z'))).toBeInTheDocument();
    });

    it('Abbreviated author name is shown', () => {
        expect(
            screen.getByText(Helpers.abbreviateUserName({ firstName: 'Test', lastName: 'User' }))
        ).toBeInTheDocument();
    });

    it('Delete button is shown', () => {
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('Delete button triggers deleteLink function', async () => {
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        await userEvent.click(deleteButton);
        expect(deleteLinkMock).toHaveBeenCalledTimes(1);
    });
});

describe('Linked publication row with draft publication', () => {
    it('"Draft" is shown instead of published date', () => {
        render(
            <table>
                <tbody>
                    <Components.LinkedPublicationRow
                        deleteLink={jest.fn()}
                        linkedPublication={{
                            ...sampleLinkedPublication,
                            publishedDate: null,
                            currentStatus: 'DRAFT'
                        }}
                        markLinkForDeletion={jest.fn()}
                    />
                </tbody>
            </table>
        );
        expect(screen.getByText('Draft,')).toBeInTheDocument();
    });
});

describe('Linked publication created in previous version, not flagged for deletion', () => {
    const markForDeletionMock = jest.fn(() => Promise.resolve());
    beforeEach(() => {
        render(
            <table>
                <tbody>
                    <Components.LinkedPublicationRow
                        deleteLink={jest.fn()}
                        linkedPublication={{
                            ...sampleLinkedPublication,
                            draft: false,
                            pendingDeletion: false
                        }}
                        markLinkForDeletion={markForDeletionMock}
                    />
                </tbody>
            </table>
        );
    });

    it('Status message is shown', () => {
        expect(screen.getByText('To be retained when published')).toBeInTheDocument();
    });

    it('Mark for deletion button is shown', () => {
        const deletionButton = screen.getByRole('button');
        expect(deletionButton).toHaveAccessibleDescription('Mark for deletion');
    });

    it('Mark for deletion button triggers function passed to "markLinkForDeletion" prop', async () => {
        const markForDeletionButton = screen.getByRole('button', { name: 'Mark for deletion' });
        await userEvent.click(markForDeletionButton);
        expect(markForDeletionMock).toHaveBeenCalledTimes(1);
        expect(markForDeletionMock).toHaveBeenCalledWith(sampleLinkedPublication.linkId, true);
    });
});

describe('Linked publication created in previous version, flagged for deletion', () => {
    const markForDeletionMock = jest.fn(() => Promise.resolve());
    beforeEach(() => {
        render(
            <table>
                <tbody>
                    <Components.LinkedPublicationRow
                        deleteLink={jest.fn()}
                        linkedPublication={{
                            ...sampleLinkedPublication,
                            draft: false,
                            pendingDeletion: true
                        }}
                        markLinkForDeletion={markForDeletionMock}
                    />
                </tbody>
            </table>
        );
    });

    it('Status message is shown', () => {
        expect(screen.getByText('To be deleted when published')).toBeInTheDocument();
    });

    it('Cancel deletion button is shown', () => {
        const deletionButton = screen.getByRole('button');
        expect(deletionButton).toHaveAccessibleDescription('Cancel pending deletion');
    });

    it('Cancel deletion button triggers function passed to "markLinkForDeletion" prop', async () => {
        const cancelDeletionButton = screen.getByRole('button', { name: 'Cancel pending deletion' });
        await userEvent.click(cancelDeletionButton);
        expect(markForDeletionMock).toHaveBeenCalledTimes(1);
        expect(markForDeletionMock).toHaveBeenCalledWith(sampleLinkedPublication.linkId, false);
    });
});
