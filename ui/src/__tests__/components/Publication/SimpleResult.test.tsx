import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';

jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '',
            query: '',
            asPath: ''
        };
    }
}));

// testPublication is a PROBLEM with 1 published version.
describe('Simple result with a live version as corresponding author', () => {
    beforeEach(() => {
        render(
            <Components.PublicationSimpleResult
                publication={TestUtils.testPublication}
                user={TestUtils.testUser}
                controlRequests={[]}
            />
        );
    });
    it('Shows publication type', () => {
        expect(screen.getByText('Research Problem')).toBeInTheDocument();
    });
    it('Shows title', () => {
        expect(screen.getByText('Test publication')).toBeInTheDocument();
    });
    it('Shows published version count', () => {
        expect(screen.getByText('1 published version')).toBeInTheDocument();
    });
    it('Shows DOI', () => {
        expect(screen.getByText('testdoi')).toBeInTheDocument();
    });
    it('Shows "Create Draft Version" button and associated text', () => {
        expect(screen.getByText('New draft not created')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Draft Version' })).toBeInTheDocument();
    });
    it('Shows published date', () => {
        expect(screen.getByText('Published on', { exact: false })).toHaveTextContent(
            `Published on ${Helpers.formatDate(TestUtils.testPublication.versions[0].publishedDate || '')}`
        );
    });
    it('Shows "View" link', () => {
        expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('href', '/publications/test');
    });
});

describe('Simple result with a draft version as corresponding author', () => {
    beforeEach(() => {
        render(
            <Components.PublicationSimpleResult
                publication={{
                    ...TestUtils.testPublication,
                    versions: [
                        {
                            ...TestUtils.testPublication.versions[0],
                            isLatestLiveVersion: false,
                            currentStatus: 'DRAFT',
                            publishedDate: null,
                            publicationStatus: [
                                {
                                    status: 'DRAFT',
                                    createdAt: '2023-02-27T09:50:00.000Z',
                                    id: 'test-status-1'
                                }
                            ]
                        }
                    ]
                }}
                user={TestUtils.testUser}
                controlRequests={[]}
            />
        );
    });
    it('Shows (Corresponding Author)', () => {
        expect(screen.getByText('(Corresponding Author)')).toBeInTheDocument();
    });
    it('Shows draft updated time', () => {
        expect(screen.getByText('Last updated on', { exact: false })).toHaveTextContent(
            `Last updated on ${Helpers.formatDate(TestUtils.testPublication.versions[0].updatedAt || '')}`
        );
    });
    it('Shows status label', () => {
        expect(screen.getByText('Status: Draft')).toBeInTheDocument();
    });
    it('Shows "Edit Draft" link', () => {
        expect(screen.getByRole('link', { name: 'Edit Draft' })).toHaveAttribute(
            'href',
            '/publications/test/edit?step=0'
        );
    });
    it('Shows "Never published"', () => {
        expect(screen.getByText('Never published')).toBeInTheDocument();
    });
});

describe('Simple result - unique cases', () => {
    it('New version button is not shown for Peer Review', () => {
        render(
            <Components.PublicationSimpleResult
                publication={{ ...TestUtils.testPublication, type: 'PEER_REVIEW' }}
                user={TestUtils.testUser}
                controlRequests={[]}
            />
        );
        expect(screen.queryByRole('button', { name: 'Create Draft Version' })).not.toBeInTheDocument();
        expect(screen.getByText('Peer reviews cannot be reversioned')).toBeInTheDocument();
    });
});
