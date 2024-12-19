import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import DigitalTwin from '../../../components/DigitalTwin/DigitalTwin';
import { Provider } from 'react-redux';
import store from 'store/store';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

const mockHandleKPIChange = vi.fn();
const mockOnCloseZone = vi.fn();
const mockOnClickMetricAction = vi.fn();

const mockState = {
    historicdrop_down: true,
    displayKPI: 'kpi1',
    digitaltwin_data: {
        display_kpis: [
            { name: 'KPI 1', value: 'kpi1', desc: 'Description 1' },
            { name: 'KPI 2', value: 'kpi2', desc: 'Description 2' }
        ],
        metrics: [
            {
                metric_key: 'kpi1',
                name: 'Metric 1',
                group: 'Group 1',
                style: { top: '10px', left: '10px' },
                metric_icon: 'icon1',
                recommendations: true,
                recommendationsList: ['Recommendation 1', 'Recommendation 2'],
                metric_value: '100',
                metric_unit: 'units',
                metric_name: 'Metric Name 1'
            }
        ],
        actions: [{ action: 'action1', name: 'Action 1' }]
    },
    historic_dropdowns: {
        shift: ['Shift 1']
    },
    selectedMetric: { name: 'Metric 1', group: 'Group 1' }
};

describe('DigitalTwin Component', () => {
    it('should render without crashing', () => {
        const mockDetails = { id: 'widget-123' };
        const mockWidgetData = {
            data: {
                widget_value_id: 'value-456',
                value: {
                    digital_twin: {
                        display_kpis: [
                            { name: 'KPI 1', value: 'kpi1', desc: 'Description 1' },
                            { name: 'KPI 2', value: 'kpi2', desc: 'Description 2' }
                        ],
                        video: {
                            light_mode: 'light_mode_video.mp4',
                            dark_mode: 'dark_mode_video.mp4'
                        }
                    },
                    simulated_value: {
                        digital_twin: {}
                    }
                }
            }
        };
        const mockSource = 'SomeText >> ScreenName';
        const mockTitle = 'Widget Title';

        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DigitalTwin
                            state={mockState}
                            handleKPIChange={mockHandleKPIChange}
                            onCloseZone={mockOnCloseZone}
                            onClickMetricAction={mockOnClickMetricAction}
                            details={mockDetails}
                            widgetData={mockWidgetData}
                            source={mockSource}
                            title={mockTitle}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByTestId('digital-twin-container')).toBeInTheDocument();
    });
});
