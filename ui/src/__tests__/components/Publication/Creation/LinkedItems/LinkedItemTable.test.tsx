import * as Components from '@/components';
import { render, screen } from '@testing-library/react';

describe('Inherited linked publications table', () => {
    beforeEach(() => {
        render(
            <Components.LinkedItemTable
                entityType={'PUBLICATION'}
                inherited={true}
                rows={
                    <tr>
                        <td>Sample content</td>
                    </tr>
                }
            />
        );
    });

    it('Renders a table', () => {
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('Renders a header row', () => {
        expect(screen.getAllByRole('row')[0]).toBeInTheDocument();
    });

    it('Renders a column heading named "Publications"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Publications'
            })
        ).toBeInTheDocument();
    });

    it('Renders a column heading named "Status"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Status'
            })
        ).toBeInTheDocument();
    });

    it('Renders a column heading named "View"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'View'
            })
        ).toBeInTheDocument();
    });

    it('Renders a column heading named "Actions"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Actions'
            })
        ).toBeInTheDocument();
    });

    it('Renders jsx passed to "rows" prop', () => {
        expect(screen.getByText('Sample content')).toBeInTheDocument();
    });
});

describe('New linked publications table', () => {
    beforeEach(() => {
        render(<Components.LinkedItemTable entityType={'PUBLICATION'} inherited={false} rows={null} />);
    });

    it('Does not render a column heading named "Status"', () => {
        expect(
            screen.queryByRole('columnheader', {
                name: 'Status'
            })
        ).not.toBeInTheDocument();
    });

    it('Renders a column heading named "View"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'View'
            })
        ).toBeInTheDocument();
    });

    it('Renders a column heading named "Actions"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Actions'
            })
        ).toBeInTheDocument();
    });
});

describe('Linked item table for topics', () => {
    beforeEach(() => {
        render(<Components.LinkedItemTable entityType={'TOPIC'} inherited={true} rows={null} />);
    });

    it('Renders a column heading named "Topics"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Topics'
            })
        ).toBeInTheDocument();
    });

    it('Does not render a column heading named "Status"', () => {
        expect(
            screen.queryByRole('columnheader', {
                name: 'Status'
            })
        ).not.toBeInTheDocument();
    });

    it('Does not render a column heading named "View"', () => {
        expect(
            screen.queryByRole('columnheader', {
                name: 'View'
            })
        ).not.toBeInTheDocument();
    });

    it('Renders a column heading named "Actions"', () => {
        expect(
            screen.getByRole('columnheader', {
                name: 'Actions'
            })
        ).toBeInTheDocument();
    });
});
