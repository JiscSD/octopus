import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('New linked publication row', () => {
    const deleteLinkMock = jest.fn(() => Promise.resolve());
    beforeEach(() => {
        render(
            // Also render a table to prevent validateDOMNesting errors for orphaned row.
            <table>
                <tbody>
                    <Components.LinkedPublicationRow
                        deleteLink={deleteLinkMock}
                        linkedPublication={{ ...TestUtils.testLinkedToPublication, draft: true }}
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
        expect(
            screen.getByText(Helpers.formatPublicationType(TestUtils.testLinkedToPublication.type))
        ).toBeInTheDocument();
    });

    it('Title is shown', () => {
        expect(screen.getByText(TestUtils.testLinkedToPublication.title as string)).toBeInTheDocument();
    });

    it('Published date is shown', () => {
        expect(
            screen.getByText(Helpers.formatDate(TestUtils.testLinkedToPublication.publishedDate as string))
        ).toBeInTheDocument();
    });

    it('Abbreviated author name is shown', () => {
        expect(
            screen.getByText(
                Helpers.abbreviateUserName({
                    firstName: TestUtils.testLinkedToPublication.authorFirstName,
                    lastName: TestUtils.testLinkedToPublication.authorLastName
                })
            )
        ).toBeInTheDocument();
    });

    it('Link to publication is shown', () => {
        expect(
            screen.getByRole('link', {
                name: 'Visit publication'
            })
        ).toHaveAttribute('href', `${Config.urls.viewPublication.path}/${TestUtils.testLinkedToPublication.id}`);
    });

    it('Enabled delete button is shown if link is draft', () => {
        expect(
            screen.getByRole('button', {
                name: 'Delete'
            })
        ).toBeEnabled();
    });

    it('Delete button triggers deleteLink function from props', () => {
        const deleteButton = screen.getByRole('button', {
            name: 'Delete'
        });
        fireEvent.click(deleteButton);
        expect(deleteLinkMock).toHaveBeenCalledWith(TestUtils.testLinkedToPublication.linkId);
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
                            ...TestUtils.testLinkedToPublication,
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
                            ...TestUtils.testLinkedToPublication,
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
        expect(markForDeletionMock).toHaveBeenCalledWith(TestUtils.testLinkedToPublication.linkId, true);
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
                            ...TestUtils.testLinkedToPublication,
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
        expect(markForDeletionMock).toHaveBeenCalledWith(TestUtils.testLinkedToPublication.linkId, false);
    });
});
