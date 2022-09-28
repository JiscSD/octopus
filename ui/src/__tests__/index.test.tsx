import { render, screen } from '@testing-library/react'
import * as Components from '@components';
import * as OutlineIcons from '@heroicons/react/outline';
import '@testing-library/jest-dom'

const button = <Components.Button
    className="children:border-0"
    disabled={true}
    icon={<OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-600" />}
    iconPosition="RIGHT"
    onClick={() => {return true}}
    title={'Click me'} 
/>

describe('Button tests', () => {
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
    expect(screen.getByRole('button')).toBeDisabled()
  });
});