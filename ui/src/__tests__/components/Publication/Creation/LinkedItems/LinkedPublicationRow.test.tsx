import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Linked publication row', () => {
    beforeEach(() => {
        render(
            <Components.LinkedPublicationRow
                linkedPublication={TestUtils.testLinkedToPublication}
                deleteLink={jest.fn(() => Promise.resolve())}
            />
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

    it('Disabled deletion button is shown if link is not draft', () => {
        expect(
            screen.getByRole('button', {
                name: 'Deletion forbidden as link is inherited from previous version'
            })
        ).toBeDisabled();
    });

    it('Delete button is not shown if link is not draft', () => {
        expect(
            screen.queryByRole('button', {
                name: 'Delete linked publication'
            })
        ).not.toBeInTheDocument();
    });
});

describe('Draft links', () => {
    const deleteLink = jest.fn(() => Promise.resolve());
    beforeEach(() => {
        render(
            <Components.LinkedPublicationRow
                linkedPublication={{ ...TestUtils.testLinkedToPublication, draft: true }}
                deleteLink={deleteLink}
            />
        );
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
        expect(deleteLink).toHaveBeenCalledWith(TestUtils.testLinkedToPublication.linkId);
        expect(deleteLink).toHaveBeenCalledTimes(1);
    });

    it('"Deletion forbidden" button is not shown if link is draft', () => {
        expect(
            screen.queryByRole('button', {
                name: 'Deletion forbidden as link is inherited from previous version'
            })
        ).not.toBeInTheDocument();
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
                    />
                </tbody>
            </table>
        );
        expect(screen.getByText('Draft,')).toBeInTheDocument();
    });
});
