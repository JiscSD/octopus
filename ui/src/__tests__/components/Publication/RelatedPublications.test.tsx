import { within } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as TestUtils from '@/testUtils';

describe('No crosslinks / general', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    data: { recent: [], relevant: [] },
                    metadata: {
                        total: 0,
                        offset: 0,
                        limit: 10
                    }
                }}
                publicationId="test"
                type="PROBLEM"
            />
        );
    });
    it('Neither category label is shown', () => {
        expect(screen.queryByText('Most relevant')).not.toBeInTheDocument();
        expect(screen.queryByText('Most recent')).not.toBeInTheDocument();
    });
    it('Link to FAQ is present', () => {
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/faq#related_publications');
        expect(link).toHaveTextContent('What is this?');
    });
});

const crosslinkBase = TestUtils.testCrosslink;
const title = crosslinkBase.linkedPublication.latestLiveVersion.title;

describe('Recent and relevant crosslinks', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    data: {
                        recent: [
                            crosslinkBase,
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' }
                            }
                        ],
                        relevant: [
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-3' }
                            },
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-4' }
                            },
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-5' }
                            }
                        ]
                    },
                    metadata: {
                        total: 10,
                        offset: 0,
                        limit: 10
                    }
                }}
                publicationId="test"
                type="PROBLEM"
            />
        );
    });

    it('"Most recent" label is shown', () => {
        expect(screen.getByText('Most recent')).toBeInTheDocument();
    });

    it('2 recent crosslinks are shown', () => {
        // RelatedPublications is an AccordionSection, which is a section, so "Most Recent" section is the one after that.
        const recentSection = document.getElementsByTagName('section')[1];
        expect(within(recentSection).getAllByText(title)).toHaveLength(2);
    });

    it('"Most relevant" label is shown', () => {
        expect(screen.getByText('Most relevant')).toBeInTheDocument();
    });

    it('3 relevant crosslinks are shown', () => {
        const recentSection = document.getElementsByTagName('section')[2];
        expect(within(recentSection).getAllByText(title)).toHaveLength(3);
    });
});

describe('Only recent crosslinks', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublications
                id="related-publications"
                crosslinks={{
                    data: {
                        recent: [
                            crosslinkBase,
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' }
                            }
                        ],
                        relevant: []
                    },
                    metadata: {
                        total: 10,
                        offset: 0,
                        limit: 10
                    }
                }}
                publicationId="test"
                type="PROBLEM"
            />
        );
    });

    it('Card list is not labelled "Most recent"', () => {
        expect(screen.queryByText('Most recent')).not.toBeInTheDocument();
    });

    it('2 crosslinks are shown', () => {
        expect(screen.getAllByText(title)).toHaveLength(2);
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
                    data: {
                        recent: [],
                        relevant: [
                            crosslinkBase,
                            {
                                ...crosslinkBase,
                                linkedPublication: { ...crosslinkBase.linkedPublication, id: 'test-2' }
                            }
                        ]
                    },
                    metadata: {
                        total: 10,
                        offset: 0,
                        limit: 10
                    }
                }}
                publicationId="test"
                type="PROBLEM"
            />
        );
    });

    it('Card list is not labelled "Most relevant"', () => {
        expect(screen.queryByText('Most relevant')).not.toBeInTheDocument();
    });

    it('2 crosslinks are shown', () => {
        expect(screen.getAllByText(title)).toHaveLength(2);
    });

    it('Only one crosslink list section is shown', () => {
        // Main accordion section and 1 inside
        expect(document.getElementsByTagName('section')).toHaveLength(2);
    });
});
