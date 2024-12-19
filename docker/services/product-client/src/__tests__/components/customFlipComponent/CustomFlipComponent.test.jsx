import React from 'react';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CustomFlipComponent from '../../../components/customFlipComponent/CustomFlipComponent.jsx';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts CustomFlipComponent  Component', () => {
        vi.useFakeTimers();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CustomFlipComponent
                        enableIntialFlipAnimation={true}
                        frontComp={<div>front</div>}
                        backComp={<div>back</div>}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        act(() => {
            vi.advanceTimersByTime(1000);
        });
    });
});
