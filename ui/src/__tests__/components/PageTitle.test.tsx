import { render, screen } from '@testing-library/react';

import * as Components from '@/components';

describe('Page title', () => {
    const text = 'The meaning of Octopus';
    const className = 'dummyclass';
    beforeEach(() => {
        render(<Components.PageTitle text={text} className={className} />);
    });

    it('Renders a first-level heading', () => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('Displays title', () => {
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('Adds className to classes', () => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveClass(className);
    });
});
