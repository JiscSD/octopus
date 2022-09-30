import * as Components from '@components';
import { render, screen } from '@testing-library/react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
const MainText = <Components.PublicationCreationMainText />;

describe('MainText tests', () => {
    it('MainText renders without crashing', () => {
        render(MainText);
        expect(screen.getByTestId('main-text')).toBeInTheDocument();
    });

    // it('MainText textarea renders correctly', () => {
    //   render(MainText);
    //   expect(screen.getByText("Import from Microsoft Word")).toBeInTheDocument();
    // });
});
