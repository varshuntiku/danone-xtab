import { render, screen, fireEvent } from '@testing-library/preact';
import Select from '../../../../src/component/shared/gridTable/cellEditors/select/Select';
import { h } from 'preact';

test('renders with given options', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(
        <Select
            value="Option 1"
            options={options}
            onChange={() => { }}
            fullWidth={false}
        />
    );

    options.forEach(option => {
        expect(screen.getByText(option)).toBeTruthy();
    });
});

test('applies fullWidth class when fullWidth is true', () => {
    render(
        <Select
            value="Option 1"
            options={['Option 1']}
            onChange={() => { }}
            fullWidth={true}
        />
    );

    expect(screen.getByRole('combobox').className.includes('MinervaFullWidth')).toBe(true)
});

test('does not apply fullWidth class when fullWidth is false', () => {
    render(
        <Select
            value="Option 1"
            options={['Option 1']}
            onChange={() => { }}
            fullWidth={false}
        />
    );

    expect(screen.getByRole('combobox').className.includes('MinervaFullWidth')).toBe(false);
});

test('calls onChange with correct value when an option is selected', () => {
    const handleChange = jest.fn();
    const options = ['Option 1', 'Option 2'];
    render(
        <Select
            value="Option 1"
            options={options}
            onChange={handleChange}
            fullWidth={false}
        />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option 2' } });
    expect(handleChange).toHaveBeenCalledWith('Option 2');
});

test('renders correctly without type attribute', () => {
    render(
        <Select
            value="Option 1"
            options={['Option 1']}
            onChange={() => { }}
            fullWidth={false}
        />
    );

    expect(screen.getByRole('combobox').getAttribute('type')).toBe(null)
});

test('renders with additional props', () => {
    render(
        <Select
            value="Option 1"
            options={['Option 1']}
            onChange={() => { }}
            data-testid="custom-select"
            fullWidth={false}
        />
    );

    expect(screen.getByTestId('custom-select')).toBeTruthy();
});
