import { render, screen } from '@testing-library/react';

import * as Components from '@/components';

describe('Related publications voting area', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublicationsVotingArea
                suggestedFromPublication={{ id: 'test-publication', title: 'Test Publication' }}
                crosslink={{
                    id: 'test-crosslink',
                    publications: [
                        { id: 'test-publication', title: 'Test Publication' },
                        { id: 'test-publication-2', title: 'Test Publication 2' }
                    ],
                    upvotes: 15,
                    downvotes: 9,
                    createdAt: '2024-10-23T09:16:00.000Z',
                    createdBy: 'test-user'
                }}
                vote={null}
            />
        );
    });

    it('"You have navigated from" message is shown', () => {
        expect(
            screen.getByText('You have navigated to this publication via a link from “Test Publication”.')
        ).toBeInTheDocument();
    });

    it('"Log in to" message is shown because user is not logged in', () => {
        expect(
            screen.getByText(
                'Log in to use the voting options to record whether or not you feel that these two publications should be linked.'
            )
        ).toBeInTheDocument();
    });

    it('Two voting buttons are present', () => {
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('Voting buttons are disabled because user is not logged in', () => {
        const buttons = screen.getAllByRole('button');
        for (const button of buttons) {
            expect(button).toBeDisabled();
        }
    });

    it('Voting buttons show vote counts', () => {
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveTextContent('15');
        expect(buttons[1]).toHaveTextContent('9');
    });

    it('Return to previous publication link is present', () => {
        const returnLink = screen.getByRole('link');
        expect(returnLink).toHaveTextContent('Return to previous publication');
        expect(returnLink).toHaveAttribute('href', '/publications/test-publication');
    });

    // TODO: Add tests for interacting with buttons if it can be worked out how to mock the auth store.
});
