import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UtilsDashboard from '../../../components/Utils/UtilsDashboard.jsx';
import { Provider } from 'react-redux';
import store from 'store/store';
const history = createMemoryHistory();

// vi.mock('../../../components/Utils/AppDetails',()=> (props)=>{
//     return(
//         <div>Mocked AppDetails Component</div>
//     )
//  })

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts UtilsDashboard Component', () => {
        history.push('/platform-utils/industry');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts UtilsDashboard Component 1', () => {
        history.push('/platform-utils/function');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts UtilsDashboard Component 2', () => {
        history.push('/platform-utils/applications');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts UtilsDashboard Component 3', () => {
        history.push('/platform-utils');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts UtilsDashboard Component with specific props', () => {
        history.push('/platform-utils');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts UtilsDashboard Component with alternative props', () => {
        history.push('/platform-utils');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should handle empty state in UtilsDashboard Component', () => {
        history.push('/platform-utils');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
    test('Should render layouts UtilsDashboard Component for /platform-utils/industry', () => {
        history.push('/platform-utils/industry');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts UtilsDashboard Component for /platform-utils/function', () => {
        history.push('/platform-utils/function');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts UtilsDashboard Component for /platform-utils/applications', () => {
        history.push('/platform-utils/applications');
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <UtilsDashboard {...Props2} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const Props = {
    classes: {},
    match: {
        isExact: true,
        params: {}
    }
};

const Props2 = {
    classes: {},
    match: {
        isExact: false,
        params: {}
    }
};
