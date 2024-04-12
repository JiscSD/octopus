import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';

const crosslink = {
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
    createdBy: 'test',
    createdAt: '2024-04-11T10:47:00.000Z'
};

describe('Related publication card', () => {
    beforeEach(() => {
        render(<Components.RelatedPublicationsCard crosslink={crosslink} />);
    });

    it('Title is shown', () => {
        expect(screen.getByText(crosslink.linkedPublication.latestLiveVersion.title)).toBeInTheDocument();
    });

    it('Corresponding author credit is shown', () => {
        expect(screen.getByText('By T. User')).toBeInTheDocument();
    });

    it('Published date is shown in short format', () => {
        expect(
            screen.getByText(Helpers.formatDate(crosslink.linkedPublication.latestLiveVersion.publishedDate, 'short'))
        ).toBeInTheDocument();
    });

    it('Visit publication link is shown', () => {
        const link = screen.getByRole('link');
        expect(link).toHaveTextContent('View this publication');
        expect(link).toHaveAttribute('href', `${Config.urls.viewPublication.path}/${crosslink.linkedPublication.id}`);
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
            />
        );
        expect(
            screen.getByText('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy...')
        ).toBeInTheDocument();
    });
});
