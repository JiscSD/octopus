import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';

const crosslink = TestUtils.testCrosslink;

describe('Related publication card', () => {
    beforeEach(() => {
        render(<Components.RelatedPublicationsCard crosslink={crosslink} sourcePublicationId="source-publication" />);
    });

    it('Title is shown', () => {
        expect(screen.getByText(crosslink.linkedPublication.latestLiveVersion.title)).toBeInTheDocument();
    });

    it('Corresponding author credit is shown', () => {
        expect(screen.getByText('By J. Doe')).toBeInTheDocument();
    });

    it('Published date is shown in short format', () => {
        expect(
            screen.getByText(Helpers.formatDate(crosslink.linkedPublication.latestLiveVersion.publishedDate, 'short'))
        ).toBeInTheDocument();
    });

    it('Visit publication link is shown', () => {
        const link = screen.getByRole('link');
        expect(link).toHaveTextContent('View this publication');
        expect(link).toHaveAttribute(
            'href',
            `${Config.urls.viewPublication.path}/${crosslink.linkedPublication.id}?suggestedFrom=source-publication`
        );
    });
});

describe('Standalone tests', () => {
    it('Long title is truncated to 80 characters', () => {
        render(
            <Components.RelatedPublicationsCard
                crosslink={{
                    ...crosslink,
                    linkedPublication: {
                        ...crosslink.linkedPublication,
                        latestLiveVersion: {
                            ...crosslink.linkedPublication.latestLiveVersion,
                            title: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'
                        }
                    }
                }}
                sourcePublicationId="source-publication"
            />
        );
        expect(
            screen.getByText('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy...')
        ).toBeInTheDocument();
    });
});
