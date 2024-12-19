import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import VisualContents from '../../../components/createStory/visualContent';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts VisualContents Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VisualContents item={props.item} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render AppWidgetInsights when insight_data is present', () => {
        const props = {
            item: {
                value: JSON.stringify({ insight_data: true })
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VisualContents item={props.item} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render KpiWidget when graph_data contains extra_dir', () => {
        const props = {
            item: {
                graph_data: { extra_dir: 'Test Extra Dir', name: 'Test Name' }
            }
        };
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <VisualContents item={props.item} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});

const props = {
    item: {
        content_id: 396,
        name: ' sales across top products',
        metadata: 'Object',
        value: null,
        app_screen_id: null,
        app_screen_widget_id: null,
        is_label: false,
        app_screen_widget_value_id: null
    }
};
