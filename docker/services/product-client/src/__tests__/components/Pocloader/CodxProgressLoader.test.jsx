import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import UserActions from '../../../components/Admin/UserActions';
import { Provider } from 'react-redux';
import store from 'store/store';
import {
    CodexCircularProgress,
    CodexLinearProgress,
    CodexLinearBufferedProgress,
    CodexStepperProgress,
    CodexGaugeProgress
} from '../../../components/POCProgressLoader/CodxProgressLoader';
import CodexProgressLoader from '../../../components/POCProgressLoader/CodxProgressLoader';

const history = createMemoryHistory();

vi.mock('react-plotly.js/factory', () => ({
    default: () => <div>Plotly Chart</div>
}));
window.Plotly = {};

const mockClasses = {
    root: '',
    stepperConnector: '',
    steplabel: '',
    inlineFlex: '',
    inlineFlexLinear: '',
    typography: '',
    error: '',
    icon: '',
    errorIcon: '',
    completed: '',
    active: '',
    text: '',
    label: '',
    errorLabel: '',
    iconColor: '',
    circularIconColor: '',
    activeIconColor: '',
    linearProgress: ''
};
const sampleProps = {
    hasbuffer: 0,
    progress_info: {
        testColumn: {
            params: { type: 'linear' },
            currentProgress: 50
        }
    },
    coldef: { field: 'testColumn' },
    classes: mockClasses
};

describe('CodexProgressLoader', () => {
    it('renders CodexStepperProgress with default props', () => {
        render(
            <CodexProgressLoader
                progress_info={{
                    test: {
                        params: { type: 'stepper' },
                        currentProgress: 50
                    }
                }}
                coldef={{ field: 'test' }}
            />
        );

        expect(screen.getByText(/Progress/)).toBeInTheDocument();
        expect(screen.getByText(/50%/)).toBeInTheDocument();
    });
    beforeEach(() => {
        render(<CodexProgressLoader {...sampleProps} />);
    });

    afterEach(() => {
        cleanup();
    });

    it('should render circular progress when type is circular', () => {
        render(
            <CodexProgressLoader
                {...sampleProps}
                progress_info={{
                    testColumn: { params: { type: 'circular' }, currentProgress: 50 }
                }}
            />
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle state changes for progress correctly', () => {
        render(
            <CodexProgressLoader
                {...sampleProps}
                progress_info={{
                    testColumn: { params: { type: 'circular' }, currentProgress: 50 }
                }}
            />
        );
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should apply styles based on classes prop', () => {
        const styleElement = document.querySelector('style');
        expect(styleElement).toBeDefined();
        expect(styleElement.textContent).toContain(mockClasses.root);
    });
});
