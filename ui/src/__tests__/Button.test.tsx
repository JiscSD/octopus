import { render, screen } from '@testing-library/react'
import * as Components from '@components';
import * as OutlineIcons from '@heroicons/react/outline';
import '@testing-library/jest-dom'

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
 
Enzyme.configure({ adapter: new Adapter() });

const button = <Components.Button
    className="children:border-0"
    disabled={false}
    icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
    iconPosition="RIGHT"
    onClick={() => {return true}}
    title={'Click me'} 
/>

describe('Button tests', () => {
  it('Renders button component without crashing', () => {
    render(button)
    expect(screen.getByRole('button')).toBeInTheDocument()
  });

  it('Button displays what is passed into prop title', () => {
    render(button)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  });

  it('Button to have accessible description', () => {
    render(button)
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Click me')
  });

  it('Button to be disabled', () => {
    render(button)
    expect(screen.getByRole('button')).toBeEnabled()
  });

  it('Button able to be clicked', () => {
    const mockCallback = jest.fn();
    const mockButton =  shallow(<Components.Button
      className="children:border-0"
      disabled={false}
      icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
      iconPosition="RIGHT"
      onClick={mockCallback}
      title={'Click me'} 
    />)

    mockButton.find('button').simulate('click')
    expect(mockCallback.mock.calls.length).toEqual(1);
  });
});