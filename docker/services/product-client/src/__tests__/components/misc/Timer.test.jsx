import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Timer from '../../../components/misc/Timer';
import { vi } from 'vitest';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts Timer Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Timer {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render Timer component with initial time', () => {
        const Props = {
            minutes: 5,
            onFinish: vi.fn(),
            resetTimer: false
        };

        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Timer {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('05:00')).toBeInTheDocument();
    });
    test('Should update time every second and stop when onFinish is called', () => {
        vi.useFakeTimers();
        const onFinishMock = vi.fn();
        const Props = {
            minutes: 1,
            onFinish: onFinishMock,
            resetTimer: false
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Timer {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        act(() => {
            vi.advanceTimersByTime(60000);
        });
        expect(onFinishMock);
        expect(screen.getByText('00:58')).toBeInTheDocument();
        vi.useRealTimers();
    });
});

const Props = {
    minutes: 5,
    seconds: 0
};
