import * as HeadlessUI from '@headlessui/react';

import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Types from '@/types';
import { render, screen } from '@testing-library/react';

const sampleProps = {
    content: 'This is some publication content',
    first: true,
    flagCount: 0,
    id: 'test',
    last: false,
    peerReviewCount: 0,
    publishedDate: '2025-04-08T00:00:00Z',
    title: 'Test publication',
    type: 'PROBLEM' as Types.PublicationType,
    user: {
        firstName: 'Test',
        lastName: 'User',
        role: 'USER' as Types.UserRole
    }
};

describe('Linked publication combobox option', () => {
    beforeEach(() => {
        render(
            // Option must be nested in a combobox
            <HeadlessUI.Combobox>
                <Components.PublicationComboboxOption {...sampleProps} />
            </HeadlessUI.Combobox>
        );
    });

    it('Renders an option', () => {
        expect(screen.getByRole('option')).toBeInTheDocument();
    });

    it('Option value title is derived from content', () => {
        expect(screen.getByRole('option')).toHaveAccessibleDescription('This is some publication content');
    });

    it('Publication type is shown', () => {
        expect(screen.getByText('Research Problem')).toBeInTheDocument();
    });

    it('Published date is shown', () => {
        expect(screen.getByText(Helpers.formatDate('2025-04-08'))).toBeInTheDocument();
    });

    it('Abbreviated user name is shown', () => {
        expect(
            screen.getByText(Helpers.abbreviateUserName({ firstName: 'Test', lastName: 'User' }))
        ).toBeInTheDocument();
    });
});

describe('Individual cases', () => {
    it('Long content (above 220 chars) is truncated for title', () => {
        const longContent =
            'This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content This is some publication content ';
        render(
            <HeadlessUI.Combobox>
                <Components.PublicationComboboxOption {...sampleProps} content={longContent} />
            </HeadlessUI.Combobox>
        );
        expect(screen.getByRole('option')).toHaveAccessibleDescription(Helpers.truncateString(longContent, 220));
    });
});
