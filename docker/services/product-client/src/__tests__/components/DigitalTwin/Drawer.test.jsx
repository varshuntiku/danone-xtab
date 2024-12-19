import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { Provider } from 'react-redux';
import store from 'store/store';
import Drawer from '../../../components/DigitalTwin/Drawer';
import RightPopout from '../../../components/DigitalTwin/RightPopout';
import Analysis from '../../../components/DigitalTwin/Analysis';
import Simulate from '../../../components/DigitalTwin/Simulate';
import '@testing-library/jest-dom/extend-expect';

const history = createMemoryHistory();

describe('Drawer Component', () => {
    const defaultProps = {
        data: {
            drawerOpen: false,
            actionOpen: false,
            simulateOpen: false,
            digitaltwin_data: {
                display_kpis: [],
                metrics: [],
                simulate: {
                    extra_filters: []
                }
            },
            simulate_filters: {
                scenarios: []
            }
        },
        classes: {},
        drawer_zone_options: vi.fn().mockReturnValue([]),
        onChangeZone: vi.fn(),
        CodxFontFamily: '',
        themeContextPlot: '',
        onChangeSlider: vi.fn(),
        onSimulateScenario: vi.fn(),
        onShowSimulateOutput: vi.fn(),
        onShowSimulateInput: vi.fn(),
        onChangeDropDown: vi.fn(),
        drawer_data: {},
        rightPopoutStateChange: vi.fn()
    };

    it('renders Simulate when simulateOpen is true', () => {
        const props = {
            ...defaultProps,
            data: {
                ...defaultProps.data,
                simulateOpen: true
            }
        };

        render(<Drawer {...defaultProps} />);
    });

    it('does not render anything if no conditions are met', () => {
        render(<Drawer {...defaultProps} />);
        expect(screen.queryByText(/RightPopout Component/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Analysis Component/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Simulate Component/i)).not.toBeInTheDocument();
    });

    it('properly handles data transformation in display_kpi_options', () => {
        const props = {
            ...defaultProps,
            data: {
                ...defaultProps.data,
                drawerOpen: true,
                digitaltwin_data: {
                    display_kpis: [{ name: 'KPI 1', value: 'kpi1' }]
                }
            }
        };

        render(<Drawer {...defaultProps} />);
    });
});
