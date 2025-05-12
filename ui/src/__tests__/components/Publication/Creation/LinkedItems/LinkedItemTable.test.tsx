import * as Components from '@/components';
import * as Config from '@/config';
import { render, screen } from '@testing-library/react';

describe('Linked item table', () => {
    const component = (
        <Components.LinkedItemTable
            deleteLink={jest.fn(() => Promise.resolve())}
            entities={[]}
            entityType={'LIVE_PUBLICATION'}
        />
    );

    beforeEach(() => {
        render(component);
    });

    it('Renders a table', () => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
    });

    it('Renders a header row', () => {
        const headerRow = screen.getByRole('row');
        expect(headerRow).toBeInTheDocument();
    });

    it('Renders a column heading with the entity type label', () => {
        const columnHeading = screen.getByRole('columnheader', {
            name: Config.values.linkedEntityTypeLabels.LIVE_PUBLICATION
        });
        expect(columnHeading).toBeInTheDocument();
    });

    it('Renders a column heading named "Delete"', () => {
        const columnHeading = screen.getByRole('columnheader', {
            name: 'Delete'
        });
        expect(columnHeading).toBeInTheDocument();
    });
});

describe('Linked item table for topics', () => {
    it('Renders a column heading with the correct entity type label', () => {
        render(
            <Components.LinkedItemTable
                deleteLink={jest.fn(() => Promise.resolve())}
                entities={[]}
                entityType={'TOPIC'}
            />
        );
        const columnHeading = screen.getByRole('columnheader', {
            name: Config.values.linkedEntityTypeLabels.TOPIC
        });
        expect(columnHeading).toBeInTheDocument();
    });
});
