import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect } from 'vitest';
import ImageZoomIn from '../../components/ImageZoomIn';
import { Provider } from 'react-redux';
import store from 'store/store';

const history = createMemoryHistory();

describe('ImageZoomIn Component', () => {
    const params = {
        enable_zoom: true,
        zoom_popup_width: '30vw',
        zoom_popup_height: '40vh',
        zoom_vertical_position: 'top',
        zoom_horizontal_position: 'left'
    };

    const previewImageRef = { current: document.createElement('img') };

    it('should render without crashing', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ImageZoomIn params={params} previewImageRef={previewImageRef} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    it('should open the popover on handlePopoverOpen call', async () => {
        const ref = React.createRef();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ImageZoomIn params={params} previewImageRef={previewImageRef} ref={ref} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(ref.current).not.toBeNull());

        ref.current.handlePopoverOpen({ clientX: 150, clientY: 150, pageX: 150, pageY: 150 });

        await waitFor(() => {
            const popover = screen.queryByTestId('mouse-over-popover');
            expect(popover).toBeVisible();
        });
    });

    it('should close the popover on handlePopoverClose call', async () => {
        const ref = React.createRef();
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ImageZoomIn params={params} previewImageRef={previewImageRef} ref={ref} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        await waitFor(() => expect(ref.current).not.toBeNull());

        ref.current.handlePopoverOpen({ clientX: 150, clientY: 150, pageX: 150, pageY: 150 });
        ref.current.handlePopoverClose();

        await waitFor(() => {
            const popover = screen.queryByTestId('mouse-over-popover');
            expect(popover).toBeNull();
        });
    });

    it('should not render Popover if enable_zoom is false', () => {
        const paramsWithoutZoom = { ...params, enable_zoom: false };
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ImageZoomIn params={paramsWithoutZoom} previewImageRef={previewImageRef} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        const popover = screen.queryByTestId('mouse-over-popover');
        expect(popover).toBeNull();
    });
});
