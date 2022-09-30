import * as Components from '@components';
import { render, screen } from '@testing-library/react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
const MainText = <h1> test</h1>;

describe('MainText tests', () => {
    it('MainText renders without crashing', () => {
        render(MainText);
        // expect(screen.getByTestId('main-text')).toBeInTheDocument();
    });

});
