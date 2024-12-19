import { fireEvent, render, screen } from '@testing-library/preact';
import InfoPopper from '../../../../src/component/shared/infoPopper/InfoPopper';

describe('DataTable test', () => {
    test('component should render', () => {
        const { container } = render(<InfoPopper content="Hi" />);
        expect(container.textContent).toMatch("Hi");
    });

    test('component should render: handleClose', () => {
        const { container } = render(<InfoPopper content="Hello" />);
        const triggerBtn = screen.getByTitle("info");
        fireEvent.click(triggerBtn);
        const dialog = container.querySelector("dialog");
        fireEvent.click(dialog);
        expect(container.textContent).toMatch("Hello");
    });

    test('component should render: close btn', () => {
        const { container } = render(<InfoPopper content="Hello" />);
        const triggerBtn = screen.getByTitle("info");
        fireEvent.click(triggerBtn);
        const dialog = screen.getByTitle("close");
        fireEvent.click(dialog);
        expect(container.textContent).toMatch("Hello");
    });
});
