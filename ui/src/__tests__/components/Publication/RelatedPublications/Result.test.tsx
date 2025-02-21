import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';

const crosslink = TestUtils.testCrosslink;

describe('Related publication result', () => {
    beforeEach(() => {
        render(
            <Components.RelatedPublicationsResult
                crosslink={crosslink}
                sourcePublicationId="test-publication"
                mutateList={jest.fn}
                setError={jest.fn}
            />
        );
    });

    it('Title is shown', () => {
        expect(screen.getByText(crosslink.linkedPublication.latestLiveVersion.title)).toBeInTheDocument();
    });

    it('Author attribution is shown', () => {
        expect(
            screen.getByText(
                `By ${Helpers.abbreviateUserName(crosslink.linkedPublication.latestLiveVersion.user)} | ${Helpers.formatDate(crosslink.linkedPublication.latestLiveVersion.publishedDate)}`
            )
        ).toBeInTheDocument();
    });

    it('Visit publication link is shown', () => {
        const link = screen.getByRole('link');
        expect(link).toHaveAccessibleName('Visit publication');
        expect(link).toHaveAttribute(
            'href',
            `${Config.urls.viewPublication.path}/${crosslink.linkedPublication.id}?suggestedFrom=test-publication`
        );
    });
});
