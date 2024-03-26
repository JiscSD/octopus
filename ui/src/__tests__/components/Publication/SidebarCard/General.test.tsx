import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';

describe('Basic tests', () => {
    beforeEach(() => {
        render(
            <Components.PublicationSidebarCardGeneral
                publicationVersion={TestUtils.testPublicationVersion}
                linkedFrom={[]}
                flags={[]}
            />
        );
    });
    it('Shows publication type', () => {
        expect(screen.getByText('Research Problem')).toBeInTheDocument();
    });
    it('Shows published date', () => {
        expect(
            screen.getByText(Helpers.formatDate(TestUtils.testPublication.versions[0].publishedDate || ''))
        ).toBeInTheDocument();
    });
    it('Shows language', () => {
        expect(screen.getByText('English')).toBeInTheDocument();
    });
    it('Shows licence link', () => {
        expect(
            screen.getByText(
                Config.values.octopusInformation.licences[TestUtils.testPublicationVersion.licence].nicename
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Licence' })).toHaveAttribute(
            'href',
            Config.values.octopusInformation.licences[TestUtils.testPublicationVersion.licence].link
        );
    });
    it('Shows DOI link', () => {
        expect(screen.getByText('DOI:')).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: `DOI link: https://doi.org/${TestUtils.testPublicationVersion.publication.doi}`
            })
        ).toHaveAttribute('href', `https://doi.org/${TestUtils.testPublicationVersion.publication.doi}`);
    });
    it('Shows no peer reviews', () => {
        expect(screen.getByText('Peer Reviews (This Version): (0)')).toBeInTheDocument();
    });
    it('Does not show All Versions peer review count', () => {
        expect(screen.queryByText('Peer Reviews (All Versions):', { exact: false })).not.toBeInTheDocument();
    });
    it('Does not show flags', () => {
        expect(screen.queryByText('Red flags: ', { exact: false })).not.toBeInTheDocument();
    });
});

describe('Multi-version publication with Peer Reviews, Flags and version DOI', () => {
    beforeEach(() => {
        render(
            <Components.PublicationSidebarCardGeneral
                publicationVersion={{
                    ...TestUtils.testPublicationVersion,
                    versionNumber: 2,
                    doi: 'testversiondoi'
                }}
                linkedFrom={[
                    {
                        ...TestUtils.testLinkedFromPublication,
                        type: 'PEER_REVIEW',
                        parentVersionId: TestUtils.testPublicationVersion.id
                    },
                    {
                        ...TestUtils.testLinkedFromPublication,
                        type: 'PEER_REVIEW',
                        parentVersionId: TestUtils.testPublicationVersion.id + 'v1'
                    }
                ]}
                flags={[
                    TestUtils.testFlag,
                    {
                        ...TestUtils.testFlag,
                        resolved: true
                    }
                ]}
            />
        );
    });
    it('Shows version DOI link', () => {
        expect(screen.getByText('DOI (This Version):')).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: `DOI link: https://doi.org/testversiondoi`
            })
        ).toHaveAttribute('href', `https://doi.org/testversiondoi`);
    });
    it('Shows "versionless" DOI link', () => {
        expect(screen.getByText('DOI (All Versions):')).toBeInTheDocument();
        expect(
            screen.getByRole('link', {
                name: `DOI link: https://doi.org/${TestUtils.testPublicationVersion.publication.doi}`
            })
        ).toHaveAttribute('href', `https://doi.org/${TestUtils.testPublicationVersion.publication.doi}`);
    });
    it('Shows 1 peer review for this version', () => {
        expect(screen.getByText('Peer Reviews (This Version): (1)')).toBeInTheDocument();
    });
    it('Shows 2 peer reviews for all versions', () => {
        expect(screen.getByText('Peer Reviews (All Versions): (2)')).toBeInTheDocument();
    });
    it('Shows 1 active red flag', () => {
        expect(screen.getByText('Red flags:', { exact: false })).toHaveTextContent('Red flags:(1)');
    });
});
