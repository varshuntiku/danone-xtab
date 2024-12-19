import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';
import { createMemoryHistory } from 'history';
import ApplicationList from '../../../components/card/ApplicationList.jsx';
import { getKpis } from '../../../services/app';
import { vi } from 'vitest';

vi.mock('../../../services/app', () => ({
    getKpis: vi.fn()
}));

vi.mock('../../../components/custom/CodxCarousel', () => {
    return {
        default: (props) => (
            <>
                <div>Mock Carousel Component</div>
                {props.children}
            </>
        )
    };
});

vi.mock('../../../components/AppWidgetLabel', () => ({
    getParsedKPIValue: () => {}
}));

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);
    beforeEach(() => {
        const observe = vi.fn();

        window.IntersectionObserver = vi.fn(function () {
            this.observe = observe;
        });
    });

    test('Should render layouts ApplicationList Component', () => {
        getKpis.mockImplementation(({ callback }) => callback({ status: 'error' }));
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ApplicationList {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });

    test('Should render layouts ApplicationList Component 1', () => {
        getKpis.mockImplementation(({ callback }) =>
            callback([
                {
                    data: {
                        extra_dir: 'up',
                        extra_value: 10
                    },
                    name: 'test kpi 1'
                },
                {
                    data: {
                        extra_dir: 'down',
                        extra_value: 10
                    },
                    name: 'test kpi 2'
                }
            ])
        );
        const { getByText, debug } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ApplicationList {...Props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    });
});

const Props = {
    classes: {},
    apps: [
        {
            id: 30,
            name: 'Capacity Planning',
            contact_email: 'ranjith@themathcompany.com',
            industry: 'CPG',
            function: 'Supply Chain',
            problem_area: 'Logistics',
            problem: 'Capacity Planning',
            config_link: false,
            blueprint_link: false,
            description: 'Labour and capacity planning to optimize cost of operations',
            app_link: false,
            approach_url: false,
            data_story_enabled: false
        }
    ],
    forRestrictedUser: false,
    applications: [],
    match: {
        params: {
            industry: ''
        }
    }
};
