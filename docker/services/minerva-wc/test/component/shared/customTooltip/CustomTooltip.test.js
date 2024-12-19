import { render, screen, fireEvent } from '@testing-library/preact';
import CustomTooltip from '../../../../src/component/shared/tooltip/CustomTooltip';
import { h } from 'preact';

describe('CustomTooltip', () => {
    it('renders tooltip with correct content', () => {
        const { container } = render(
            <CustomTooltip content="Tooltip content" placement="top">
                <button>Hover me</button>
            </CustomTooltip>
        );
        const button = screen.getByText('Hover me');

        fireEvent.mouseEnter(button);

        expect(screen.getByText('Tooltip content')).toBeTruthy();
    });

    it('hides tooltip when mouse leaves', () => {
        const { container } = render(
            <CustomTooltip content="Tooltip content" placement="top">
                <button>Hover me</button>
            </CustomTooltip>
        );
        const button = screen.getByText('Hover me');

        fireEvent.mouseEnter(button);
        expect(screen.getByText('Tooltip content')).toBeTruthy();

        fireEvent.mouseLeave(button);
        expect(screen.queryByText('Tooltip content')).not.toBeTruthy();
    });

    it('positions tooltip correctly', async () => {
        const { container } = render(
            <CustomTooltip content="Tooltip content" placement="top">
                <button>Hover me</button>
            </CustomTooltip>
        );
        const button = screen.getByText('Hover me');

        fireEvent.mouseEnter(button);

        setTimeout(() => {
            const tooltip = container.querySelector('.MinervaTooltip-content');
            expect(tooltip).toBeTruthy();
            const placementClass = 'MinervaTooltip-position-top';
            expect(tooltip.className.includes(placementClass)).toBe(true);
        }, 1000);

    });
});
