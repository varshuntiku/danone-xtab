import { fireEvent, render, screen } from '@testing-library/preact';
import Feedback from '../../../../src/component/shared/feedback/Feedback';

describe('Feedback test', () => {
    test('component should render: thumb_up handleFeedback', () => {
        const handleChangeFeedback = jest.fn();
        const { container } = render(<Feedback feedback={0} onChangeFeedback={handleChangeFeedback} />);
        const thumb_upBtn = screen.getByTitle("like");
        fireEvent.click(thumb_upBtn);
        expect(handleChangeFeedback).toHaveBeenCalledWith(1);
        expect(container.querySelector(".MinervaFeedback-active")).toBeTruthy();
    });

    test('component should render: thumb_down handleFeedback', () => {
        const handleChangeFeedback = jest.fn();
        const { container } = render(<Feedback feedback={0} onChangeFeedback={handleChangeFeedback} />);
        const thumb_downBtn = screen.getByTitle("dislike");
        fireEvent.click(thumb_downBtn);
        expect(handleChangeFeedback).toHaveBeenCalledWith(-1);
        expect(container.querySelector(".MinervaFeedback-active")).toBeTruthy();
    });

    test('component should render: neutral handleFeedback', () => {
        const handleChangeFeedback = jest.fn();
        const { container } = render(<Feedback feedback={-1} onChangeFeedback={handleChangeFeedback} />);
        const thumb_downBtn = screen.getByTitle("dislike");
        fireEvent.click(thumb_downBtn);
        expect(handleChangeFeedback).toHaveBeenCalledWith(0);
        expect(container.querySelector(".MinervaFeedback-active")).toBeFalsy();
        fireEvent.click(thumb_downBtn);
        expect(handleChangeFeedback).toHaveBeenCalledWith(-1);
        expect(container.querySelector(".MinervaFeedback-active")).toBeTruthy();
    });
});

