import { fireEvent, render, screen } from '@testing-library/preact';
import ConfirmPopup from '../../../../src/component/shared/confirmPopup/ConfirmPopup';

describe('CardView test', () => {
    test('component should render', () => {
        const { container } = render(<ConfirmPopup />);
        expect(container.textContent).toBeFalsy();
    });

    test('component should render: disabled', () => {
        let clicked = false;
        const child = jest.fn((tc) => {
            if (!clicked) {
                tc();
            }
            clicked = true;
        })
        const { container } = render(<ConfirmPopup disabled enableCloseButton hideConfirmButton hideCancelButton>
            {child}
        </ConfirmPopup>);
        expect(child).toHaveBeenCalled();
    });

    test('component should render: enableCloseButton', () => {
        let clicked = false;
        const child = jest.fn((tc) => {
            if (!clicked) {
                tc();
            }
            clicked = true;
        })
        const { container } = render(<ConfirmPopup enableCloseButton hideConfirmButton hideCancelButton>
            {child}
        </ConfirmPopup>);
        const closeBtn = screen.getByTitle("Close");
        expect(container.querySelector(".MinervaConfirmPopup")).toBeTruthy();
        expect(closeBtn).toBeTruthy();
        fireEvent.click(closeBtn);
        expect(container.querySelector(".MinervaConfirmPopup")).toBeFalsy();
    });

    test('component should render: handleCancel', () => {
        let clicked = false;
        const child = jest.fn((tc) => {
            if (!clicked) {
                tc();
            }
            clicked = true;
        })
        const { container } = render(<ConfirmPopup enableCloseButton hideConfirmButton hideCancelButton>
            {child}
        </ConfirmPopup>);
        const dialog = container.querySelector("dialog");
        expect(container.querySelector(".MinervaConfirmPopup")).toBeTruthy();
        fireEvent.click(dialog);
        expect(container.querySelector(".MinervaConfirmPopup")).toBeFalsy();
    });
});
