import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import appNavBarStyle from '../../../assets/jss/appNavBarStyle';
import { withStyles } from '@material-ui/core/styles';
import TrainingReport from '../../../components/llmWorkbench/TrainingReport';
const history = createMemoryHistory();
vi.mock('react-plotly.js/factory', () => {
    return {
        __esModule: true,
        default: () => () => <div data-testid="plotly-component"></div>
    };
});

describe('TrainingReport Component', () => {
    const mockReconfigure = vi.fn();

    const setup = () => {
        return render(
            <CustomThemeContextProvider>
                <TrainingReport reconfigure={mockReconfigure} />
            </CustomThemeContextProvider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the LLM Report and Health Check Report sections', () => {
        setup();
        expect(screen.getByText(/LLM Report/i)).toBeInTheDocument();
        expect(screen.getByText(/Health Check Report/i)).toBeInTheDocument();
    });

    it('renders the plotly component', () => {
        setup();
        expect(screen.getByTestId('plotly-component')).toBeInTheDocument();
    });

    it('renders health report data correctly', () => {
        setup();
        expect(screen.getByText('No. of Null Flags')).toBeInTheDocument();

        expect(screen.getByText('No. of Zero Train Set')).toBeInTheDocument();
    });

    it('calls reconfigure function when "Reconfigure & Finetune" button is clicked', () => {
        setup();
        const button = screen.getByText(/Reconfigure & Finetune/i);
        fireEvent.click(button);
        expect(mockReconfigure).toHaveBeenCalled();
    });
});
