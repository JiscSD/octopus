import '@testing-library/jest-dom';

import * as Components from '@components';
import * as OutlineIcons from '@heroicons/react/24/outline';

import { fireEvent, render, screen } from '@testing-library/react';

describe('Button test suite with enabled button stating "click me"', () => {
    const handleOnClick = jest.fn();

    const button = (
        <Components.Button className="children:border-0" disabled={false} onClick={handleOnClick} title={'Click me'} />
    );

    beforeEach(() => {
        render(button);
    });

    it('Renders button component without crashing', () => {
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Button displays what is passed into prop title', () => {
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('Button to have accessible description', () => {
        expect(screen.getByRole('button')).toHaveAccessibleDescription('Click me');
    });

    it('Button to be enabled', () => {
        expect(screen.getByRole('button')).toBeEnabled();
    });

    it('Button able to be clicked', () => {
        fireEvent.click(screen.getByText('Click me'));

        expect(handleOnClick).toHaveBeenCalledTimes(1);
    });
});

describe('Button test suite with disabled button stating "click me"', () => {
    const handleOnClick = jest.fn();

    const button = (
        <Components.Button className="children:border-0" disabled onClick={handleOnClick} title={'Click me'} />
    );

    beforeEach(() => {
        render(button);
    });

    it('Button to be disabled', () => {
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Should not fire the callback when clicked', () => {
        fireEvent.click(screen.getByText('Click me'));

        expect(handleOnClick).toHaveBeenCalledTimes(0);
    });
});

describe('Button Icon', () => {
    it('should render with an icon before text', () => {
        const iconId = 'SVG_ICON';
        const buttonTitle = 'Click me';
        const { container } = render(
            <Components.Button
                className="children:border-0"
                disabled={true}
                startIcon={<OutlineIcons.ArrowRightIcon id={iconId} className="h-4 w-4 text-teal-600" />}
                onClick={() => {
                    return true;
                }}
                title={buttonTitle}
            />
        );

        expect(container.querySelector(`#${iconId}`)).toBeInTheDocument();
        expect(container.querySelector('button')?.children[0].id).toBe('SVG_ICON');
        expect(container.querySelector('button')?.children[1].textContent).toBe(buttonTitle);
    });

    it('should render with an icon after text', () => {
        const iconId = 'SVG_ICON';
        const buttonTitle = 'Click me';
        const { container } = render(
            <Components.Button
                className="children:border-0"
                disabled={true}
                endIcon={<OutlineIcons.ArrowRightIcon id={iconId} className="h-4 w-4 text-teal-600" />}
                onClick={() => {
                    return true;
                }}
                title={buttonTitle}
            />
        );

        expect(container.querySelector('button')?.children[0].textContent).toBe(buttonTitle);
        expect(container.querySelector(`#${iconId}`)).toBeInTheDocument();
        expect(container.querySelector('button')?.children[1].id).toBe('SVG_ICON');
    });
});

describe('Button as a Link', () => {
    it('should be a link when href prop is provided', () => {
        const title = 'I will render as link';
        const href = '/test-link';
        const { container } = render(<Components.Button title={title} href={href} />);

        expect(container.querySelector('a')?.getAttribute('href')).toBe(href);
    });

    it('should have "target=_blank" attribute when "openNew" prop is provided', () => {
        const title = 'I will render as link';
        const href = '/test-link';
        const { container } = render(<Components.Button title={title} href={href} openNew />);

        expect(container.querySelector('a')?.getAttribute('target')).toBe('_blank'); // opens the link in a new tab
    });
});
