import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as I from '@/interfaces';
import * as Types from '@/types';

const defaultBoxProps: I.VisualizationBoxData = {
    isDraft: false,
    isSelected: false,
    renderAsLink: false,
    id: 'test-publication-id',
    title: 'Test publication title',
    type: 'PROBLEM',
    publishedDate: '2025-03-26T00:00:00.000Z',
    createdBy: 'test-user-id',
    authorFirstName: 'Test',
    authorLastName: 'User',
    flagCount: 0,
    peerReviewCount: 0,
    childPublicationIds: []
};

describe('Visualization box', () => {
    test('Title is displayed', () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} />);
        expect(screen.getByText('Test publication title')).toBeInTheDocument();
    });

    test("Author's abbreviated user name is displayed", () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} />);
        expect(screen.getByText('T. User')).toBeInTheDocument();
    });

    test('Published date is displayed if passed', () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} />);
        expect(screen.getByText(Helpers.formatDate('2025-03-26T00:00:00.000Z', 'short'))).toBeInTheDocument();
    });

    test('"Draft" is displayed if published date is not defined and isDraft prop is true', () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} isDraft={true} publishedDate={null} />);
        expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    test('No link is rendered if renderAsLink prop is false', () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} />);
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    test('Renders as link to publication if renderAsLink prop is true', () => {
        render(<Components.PublicationVisualizationBox {...defaultBoxProps} renderAsLink={true} />);
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            `${Config.urls.viewPublication.path}/${defaultBoxProps.id}`
        );
    });
});
