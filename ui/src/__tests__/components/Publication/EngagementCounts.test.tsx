import { render, screen } from '@testing-library/react';

import * as Components from '@/components';

describe('Flag and peer review', () => {
    beforeEach(() => {
        render(<Components.EngagementCounts flagCount={1} peerReviewCount={2} />);
    });
    it('Red flag count is shown', () => {
        expect(screen.getByTitle('Red flag count')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
    it('Peer review count is shown', () => {
        expect(screen.getByTitle('Peer review count')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });
});

describe('Flag only', () => {
    beforeEach(() => {
        render(<Components.EngagementCounts flagCount={1} peerReviewCount={0} />);
    });
    it('Red flag count is shown', () => {
        expect(screen.getByTitle('Red flag count')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
    it('Peer review count is not shown', () => {
        expect(screen.queryByTitle('Peer review count')).not.toBeInTheDocument();
    });
});

describe('Peer review only', () => {
    beforeEach(() => {
        render(<Components.EngagementCounts flagCount={0} peerReviewCount={1} />);
    });
    it('Red flag count is not shown', () => {
        expect(screen.queryByTitle('Red flag count')).not.toBeInTheDocument();
    });
    it('Peer review count is not shown', () => {
        expect(screen.getByTitle('Peer review count')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});

describe('No engagements', () => {
    beforeEach(() => {
        render(<Components.EngagementCounts flagCount={0} peerReviewCount={0} />);
    });
    it('Red flag count is not shown', () => {
        expect(screen.queryByTitle('Red flag count')).not.toBeInTheDocument();
    });
    it('Peer review count is not shown', () => {
        expect(screen.queryByTitle('Peer review count')).not.toBeInTheDocument();
    });
});
