import DescriptionAlerts from '../../../components/custom/DescriptionAlerts';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render DescriptionAlerts  Component to show error message', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DescriptionAlerts {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render DescriptionAlerts  Component to show success message', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DescriptionAlerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render DescriptionAlerts  Component to show warning message', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DescriptionAlerts {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render DescriptionAlerts  Component to show info message', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DescriptionAlerts {...Props3} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should render DescriptionAlerts  Component to show message when type is black(default case)', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DescriptionAlerts {...Props4} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    const Props = {
        alignRight: true,
        alertInfo: {
            severity: 'error',
            label: 'This is a error alert — check it out!!'
        }
    };
    const Props1 = {
        alignRight: false,
        alertInfo: {
            severity: 'success',
            label: 'This is a success alert — check it out!!'
        }
    };
    const Props2 = {
        alignRight: true,
        alertInfo: {
            severity: 'warning',
            label: 'This is a warning alert — check it out!!'
        }
    };
    const Props3 = {
        alignRight: false,
        alertInfo: {
            severity: 'info',
            label: 'This is a info alert — check it out!!'
        }
    };
    const Props4 = {
        alignRight: false,
        alertInfo: {
            severity: '',
            label: 'This is a success alert — check it out!!'
        }
    };
});
