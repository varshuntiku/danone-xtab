import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import ScreenStepper from '../../components/ScreenStepper';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();

describe('Codex Screen Stepper test', () => {
    afterEach(cleanup);
    test('rendering ScreenStepper component without data', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenStepper activeStep={0} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('rendering ScreenStepper component with data', () => {
        const steps = [
            { id: 1, screen_name: 'Step 1' },
            { id: 2, screen_name: 'Step 2' },
            { id: 5, screen_name: 'Step 5' },
            { id: 7, screen_name: '' },
            { id: 9 }
        ];
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ScreenStepper activeStep={0} steps={steps} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
