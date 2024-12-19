import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomImage from '../../../../components/dynamic-form/inputFields/CustomImage';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../components/ImageZoomIn', () => {
    return {
        __esModule: true,
        default: React.forwardRef((props, ref) => <div data-testid="image-zoom-in" ref={ref}></div>)
    };
});

describe('CustomImage Component', () => {
    const mockParams = {
        src: 'test-image.jpg',
        alt: 'Test Image',
        enable_zoom: true
    };

    const renderComponent = (params = mockParams) => {
        return render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomImage params={params} />
                </Router>
            </CustomThemeContextProvider>
        );
    };

    test('should render the image with correct src and alt', () => {
        renderComponent();

        const img = screen.getByAltText('Test Image');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'test-image.jpg');
    });

    test('should not render ImageZoomIn component when enable_zoom is false', () => {
        renderComponent({ ...mockParams, enable_zoom: false });

        expect(screen.queryByTestId('image-zoom-in')).toBeNull();
    });

    test('should not call handlePopoverOpen or handlePopoverClose when enable_zoom is false', () => {
        renderComponent({ ...mockParams, enable_zoom: false });

        const img = screen.getByAltText('Test Image');

        fireEvent.mouseMove(img);
        fireEvent.mouseLeave(img);

        expect(screen.queryByTestId('image-zoom-in')).toBeNull();
    });
});
