import * as Components from '@/components';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Basic checkbox', () => {
    beforeEach(() => {
        render(<Components.Checkbox id="test" label="Test" name="test" />);
    });

    it('Renders a checkbox', () => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('Checkbox has the passed label', () => {
        expect(screen.getByRole('checkbox')).toHaveAccessibleName('Test');
    });

    it('Checkbox is enabled', () => {
        expect(screen.getByRole('checkbox')).toBeEnabled();
    });
});

const onChange = jest.fn();

describe('Checkbox with several optional props', () => {
    beforeEach(() => {
        render(
            <Components.Checkbox
                checked={true}
                disabled={true}
                id="test"
                label="Test"
                name="test"
                onChange={onChange}
                required={true}
            />
        );
    });

    it('Checkbox is checked', () => {
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('Checkbox is disabled', () => {
        expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('Checkbox does not trigger onChange function when clicked as it is disabled', async () => {
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('Checkbox is required', () => {
        expect(screen.getByRole('checkbox')).toBeRequired();
    });
});

describe('Checkbox with several optional props - alternate values', () => {
    beforeEach(() => {
        render(
            <Components.Checkbox
                checked={false}
                disabled={false}
                id="test"
                label="Test"
                name="test"
                onChange={onChange}
                required={false}
            />
        );
    });

    it('Checkbox is not checked', () => {
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('Checkbox is enabled', () => {
        expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    it('Checkbox is not required', () => {
        expect(screen.getByRole('checkbox')).not.toBeRequired();
    });

    it('Checkbox triggers onChange function when clicked', async () => {
        await userEvent.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
