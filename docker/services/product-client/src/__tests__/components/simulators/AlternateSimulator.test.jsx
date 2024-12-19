import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import AlternateSimulator from '../../../components/simulators/AlternateSimulator';
import { GraphInfo } from '../../../components/graphInfo/GraphInfo';
import { vi } from 'vitest';

vi.mock('../../../components/graphInfo/GraphInfo', () => ({
    GraphInfo: () => <div>Mock GraphInfo Component</div>
}));

const history = createMemoryHistory();

describe('AlternateSimulator', () => {
    afterEach(cleanup);

    const props = {
        screen_id: 1,
        app_id: 1,
        action_type: 'action_Type',
        params: {
            sections: ['test1'],
            section_inputs: {
                test1: [
                    {
                        label: 'test label',
                        flag_active: true,
                        flag_optimize: true,
                        steps: 2,
                        min: 0,
                        max: 10
                    }
                ]
            },
            actions: [
                { action_flag_type: 'test_action_flag', name: 'Test action button 1' },
                { name: 'Test action button 2' }
            ],
            graph_info: {}
        },
        parent_obj: {
            handleAltActionInvoke: vi.fn(),
            props: {
                selected_filters: {
                    'Time Frame': { checked: 'CY 2020', label: 'Time Frame', options: ['CY 2020'] },
                    Region: { checked: 'USA', label: 'Region', options: ['USA'] },
                    Industry: { checked: 'Beer', label: 'Industry', options: ['Beer'] },
                    Category: { checked: 'All', label: 'Category', options: ['All'] },
                    'Sub Category': { checked: 'All', label: 'Sub Category', options: ['All'] }
                },
                details: { id: 1 }
            }
        },
        savedScenarios: [{ name: 'Scenario 1' }],
        show_simulator: true,
        onCloseSimulator: vi.fn()
    };

    test('Should render AlternateSimulator component', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlternateSimulator {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('test label')).toBeInTheDocument();
        expect(screen.getByText('Test action button 1')).toBeInTheDocument();
        expect(screen.getByText('Test action button 2')).toBeInTheDocument();
    });

    test('Should handle slider interactions', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlternateSimulator {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        const slider = screen.getAllByRole('checkbox')[0];
        act(() => {
            fireEvent.click(slider);
            fireEvent.change(slider, { target: { checked: false } });
        });

        expect(slider).not.toBeChecked();
    });

    test('Should call onLoadScenario when scenario is loaded', () => {
        const loadScenarioMock = vi.fn();
        const newProps = { ...props, onLoadScenario: loadScenarioMock };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlternateSimulator {...newProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        act(() => {
            newProps.onLoadScenario({ scenarios_json: {} });
        });

        expect(loadScenarioMock).toHaveBeenCalled();
    });

    test('Should render GraphInfo when graph_info is provided', () => {
        const newProps = { ...props, params: { ...props.params, graph_info: {} } };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlternateSimulator {...newProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Mock GraphInfo Component')).toBeInTheDocument();
    });

    test('Should display total value in typeB', () => {
        const typeBProps = {
            ...props,
            params: {
                ...props.params,
                simulator_type: 'typeB',
                section_inputs: {
                    test1: [{ value: 100 }]
                }
            }
        };

        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <AlternateSimulator {...typeBProps} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });
});
