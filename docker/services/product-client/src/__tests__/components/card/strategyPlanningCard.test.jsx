import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import StrategyPlanningCard from '../../../components/card/strategyPlanningCard.jsx';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts strategyPlanningCard Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StrategyPlanningCard {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('configure'));
    });

    test('Should render layouts strategyPlanningCard Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StrategyPlanningCard {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('customize'));
    });

    test('Should render layouts strategyPlanningCard Component 2', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StrategyPlanningCard {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('wiki'));
    });

    test('Should render layouts strategyPlanningCard Component 3', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StrategyPlanningCard history={history} {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByText('Capacity Planning'));
    });

    test('Should render layouts strategyPlanningCard Component 4', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <StrategyPlanningCard history={history} {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('forward'));
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
            config_link: '/test_config',
            blueprint_link: '/test_blueprint',
            description: 'Labour and capacity planning to optimize cost of operations',
            app_link: true,
            approach_url: '/test_apporach',
            data_story_enabled: false
        }
    ],
    function: 'Supply Chain'
};
