/** @jsx h */
import { h } from 'preact';
import { render, fireEvent } from '@testing-library/preact';
import { useRef } from 'preact/hooks';
import DraggableDiv from '../../../../src/component/sideWorkspace/draggableDiv/DraggableDiv';

describe('DraggableDiv Component', () => {
    let container;
    let dragHandleRef;

    beforeEach(() => {
        dragHandleRef = { current: document.createElement('div') };
        dragHandleRef.current.className = 'drag-handle';
        document.body.appendChild(dragHandleRef.current);

        const utils = render(
            <DraggableDiv dragHandleRef={dragHandleRef} minimumSize={50} maximumSize={500} style={{ width: '100px' }}>
                <div>Content</div>
            </DraggableDiv>
        );
        container = utils.container.firstChild;
    });

    afterEach(() => {
        document.body.removeChild(dragHandleRef.current);
    });

    test('should resize within the bounds', () => {
        const initialWidth = parseFloat(container.style.width);
        const minimumSize = 50;
        const maximumSize = 500;

        fireEvent.mouseDown(dragHandleRef.current, { pageX: 100 });
        fireEvent.mouseMove(window, { pageX: 80 });
        fireEvent.mouseUp(window);
        const newWidth = parseFloat(container.style.width);
        expect(newWidth).toBeGreaterThan(minimumSize);
        expect(newWidth).toBeLessThan(maximumSize);

        fireEvent.mouseDown(dragHandleRef.current, { pageX: 100 });
        fireEvent.mouseMove(window, { pageX: 150 });
        fireEvent.mouseUp(window);
        const resizedWidthBelowMin = parseFloat(container.style.width);
        expect(resizedWidthBelowMin).toBeGreaterThanOrEqual(minimumSize);

        fireEvent.mouseDown(dragHandleRef.current, { pageX: 100 });
        fireEvent.mouseMove(window, { pageX: 50 });
        fireEvent.mouseUp(window);
        const resizedWidthAboveMax = parseFloat(container.style.width);
        expect(resizedWidthAboveMax).toBeLessThanOrEqual(maximumSize);
    });

    test('should stop resizing on mouseup', () => {
        const resizeSpy = jest.spyOn(window, 'removeEventListener');
        fireEvent.mouseDown(dragHandleRef.current, { pageX: 100 });
        fireEvent.mouseMove(window, { pageX: 80 });
        fireEvent.mouseUp(window);
        expect(resizeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        resizeSpy.mockRestore();
    });
});
