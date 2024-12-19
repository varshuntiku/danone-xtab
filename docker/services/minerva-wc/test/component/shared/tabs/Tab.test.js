import { render, screen, fireEvent } from '@testing-library/preact';
import Tab from '../../../../src/component/shared/tabs/Tab';

describe('Tab Component', () => {
    test('renders with label and icon', () => {
        render(<Tab
            label="Tab 1"
            icon={<span>Icon</span>}
            value={1}
            orientation="horizontal"
            onTabClick={() => {}}
        />);

        expect(screen.getByText('Tab 1')).toBeTruthy();
        expect(screen.getByText('Icon')).toBeTruthy();
    });

    test('applies correct orientation class', () => {
        const { rerender } = render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaHorizontalTab')).toBe(true);

        rerender(<Tab
            label="Tab 2"
            value={2}
            orientation="vertical"
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaVerticalTab')).toBe(true);
    });

    test('applies active tab class when active', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            activeTabIndex={1}
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaActiveTab')).toBe(true);
    });

    test('does not apply active tab class when not active', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            activeTabIndex={2}
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaActiveTab')).toBe(false);
    });

    test('applies wrapped class when wrapped prop is true', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            wrapped
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaWrappedTab')).toBe(true);
    });

    test('does not apply wrapped class when wrapped prop is false', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').classList.contains('MinervaWrappedTab')).toBe(false);
    });

    test('calls onTabClick with correct value when clicked', () => {
        const onTabClick = jest.fn();
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            onTabClick={onTabClick}
        />);

        fireEvent.click(screen.getByRole('button'));
        expect(onTabClick).toHaveBeenCalledWith(1);
    });

    test('button is disabled when disabled prop is true', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            disabled
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true);
    });

    test('button is not disabled when disabled prop is false', () => {
        render(<Tab
            label="Tab 1"
            value={1}
            orientation="horizontal"
            onTabClick={() => {}}
        />);

        expect(screen.getByRole('button').hasAttribute('disabled')).toBe(false);
    });
});
