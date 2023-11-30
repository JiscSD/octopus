import * as Components from '@components';
import { render, screen } from '@testing-library/react';

describe('MainText tests', () => {
    const component = <Components.PublicationCreationMainText />;

    beforeEach(() => {
        render(component);
    });

    it('MainText renders without crashing', () => {
        expect(screen.getByTestId('main-text')).toBeInTheDocument();
    });

    it('MainText renders select options', () => {
        const selectElement = screen.getByTestId('main-text-select-element');
        expect(screen.getByTestId('main-text-select')).toContainElement(selectElement);
    });

    it('MainText renders certain language options', () => {
        const selectElement = screen.getByTestId('main-text-select-element');
        expect(screen.getByTestId('main-text-select')).toHaveTextContent('Cree');
    });
});
