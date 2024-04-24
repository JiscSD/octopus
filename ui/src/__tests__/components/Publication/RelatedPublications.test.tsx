import { within } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';

import * as Components from '@/components';

describe('No crosslinks', () => {
    it('Nothing is rendered', () => {
        const { container } = render(
            <Components.RelatedPublications id="related-publications" crosslinks={{ recent: [], relevant: [] }} />
        );
        expect(container).toBeEmptyDOMElement();
    });
});

const crosslinkBase = {
    linkedPublication: {
        id: 'test-1',
        latestLiveVersion: {
            title: 'Test 1',
            publishedDate: '2024-04-11T11:47:00.000Z',
            user: {
                firstName: 'Test',
                lastName: 'User'
            }
        }
    },
    score: 0,
    createdAt: '2024-04-11T10:47:00.000Z',
    createdBy: 'test'
};

describe('Recent and relevant crosslinks', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    recent: [
                        crosslinkBase,
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' } }
                    ],
                    relevant: [
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-3' } },
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-4' } },
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-5' } }
                    ]
                }}
            />
        );
    });

    it('"Most recent" label is shown', () => {
        expect(screen.getByText('Most recent')).toBeInTheDocument();
    });

    it('2 recent crosslinks are shown', () => {
        // RelatedPublications is an AccordionSection, which is a section, so "Most Recent" section is the one after that.
        const recentSection = document.getElementsByTagName('section')[1];
        expect(within(recentSection).getAllByText('Test 1')).toHaveLength(2);
    });

    it('"Most relevant" label is shown', () => {
        expect(screen.getByText('Most relevant')).toBeInTheDocument();
    });

    it('3 relevant crosslinks are shown', () => {
        const recentSection = document.getElementsByTagName('section')[2];
        expect(within(recentSection).getAllByText('Test 1')).toHaveLength(3);
    });
});

describe('Only recent crosslinks', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    recent: [
                        crosslinkBase,
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' } }
                    ],
                    relevant: []
                }}
            />
        );
    });

    it('Card list is not labelled "Most recent"', () => {
        expect(screen.queryByText('Most recent')).not.toBeInTheDocument();
    });

    it('2 crosslinks are shown', () => {
        expect(screen.getAllByText('Test 1')).toHaveLength(2);
    });

    it('Only one crosslink list section is shown', () => {
        // Main accordion section and 1 inside
        expect(document.getElementsByTagName('section')).toHaveLength(2);
    });
});

describe('Only relevant crosslinks', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    recent: [],
                    relevant: [
                        crosslinkBase,
                        { ...crosslinkBase, linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' } }
                    ]
                }}
            />
        );
    });

    it('Card list is not labelled "Most relevant"', () => {
        expect(screen.queryByText('Most relevant')).not.toBeInTheDocument();
    });

    it('2 crosslinks are shown', () => {
        expect(screen.getAllByText('Test 1')).toHaveLength(2);
    });

    it('Only one crosslink list section is shown', () => {
        // Main accordion section and 1 inside
        expect(document.getElementsByTagName('section')).toHaveLength(2);
    });
});
