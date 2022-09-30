import * as Components from '@components';
import { render, screen } from '@testing-library/react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
const component = <Components.PublicationCreationMainText />;

describe('MainText tests', () => {
    it('MainText renders without crashing', () => {
        render(component);
        expect(screen.getByTestId('main-text')).toBeInTheDocument();
    });

    it('MainText renders select options', () => {
        render(component);
        const selectElement = screen.getByTestId('main-text-select-element');
        expect(screen.getByTestId('main-text-select')).toContainElement(selectElement);
    });

    it('MainText renders certain language options', () => {
        render(component);
        const selectElement = screen.getByTestId('main-text-select-element');
        expect(screen.getByTestId('main-text-select')).toHaveTextContent('Cree');
    });
});
