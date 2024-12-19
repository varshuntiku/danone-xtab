import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CodxCarousel from '../../../components/custom/CodxCarousel.jsx';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CodxCarousel  Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxCarousel>{[<div key="1"></div>]}</CodxCarousel>
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts CodxCarousel  Component', () => {
        vi.useFakeTimers();
        const props = {
            index: 0,
            interval: 2000,
            transitionDuration: 1000,
            slide: true,
            direction: 'left',
            pauseOnMouseEnter: true,
            ref: {
                current: 0,
                moveLeft: () => {},
                moveRight: () => {},
                setCurrent: () => {},
                setSlideState: () => {}
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxCarousel {...props}>{[<div key="1"></div>]}</CodxCarousel>
                </Router>
            </CustomThemeContextProvider>
        );
        act(() => {
            vi.advanceTimersByTime(props.interval);
        });
    });
});
