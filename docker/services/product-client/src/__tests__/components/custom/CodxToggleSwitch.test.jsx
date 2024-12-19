import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import ToggleSwitch from '../../../components/custom/CodxToggleSwitch';
import { vi } from 'vitest';

const history = createMemoryHistory();

describe('ToggleSwitch Component', () => {
    const mockOnChange = vi.fn();

    const renderComponent = (props) => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <ToggleSwitch {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    };

    it('should render without crashing', () => {
        const customClasses = {
            toggleClasses: {
                baseColor: '#000000',
                checkedBaseColor: '#FFFFFF',
                trackColor: '#CCCCCC',
                checkedTrackColor: '#999999',
                border: '2px solid #FF0000',
                checkedBorder: '2px solid #00FF00'
            }
        };
        renderComponent({
            elementProps: { labelLeft: 'Left Label', labelRight: 'Right Label' },
            onChange: mockOnChange,
            classes: customClasses,
            'data-testid': 'toggle-switch'
        });

        expect(screen.getByTestId('toggle-switch')).toBeInTheDocument();
    });

    it('should render labels correctly', () => {
        const customClasses = {
            toggleClasses: {
                baseColor: '#000000',
                checkedBaseColor: '#FFFFFF',
                trackColor: '#CCCCCC',
                checkedTrackColor: '#999999',
                border: '2px solid #FF0000',
                checkedBorder: '2px solid #00FF00'
            }
        };
        renderComponent({
            elementProps: { labelLeft: 'Left Label', labelRight: 'Right Label' },
            onChange: mockOnChange,
            classes: customClasses,
            'data-testid': 'toggle-switch'
        });

        expect(screen.getByText('Left Label')).toBeInTheDocument();
        expect(screen.getByText('Right Label')).toBeInTheDocument();
    });

    it('should apply custom styles based on props', () => {
        const customClasses = {
            toggleClasses: {
                baseColor: '#000000',
                checkedBaseColor: '#FFFFFF',
                trackColor: '#CCCCCC',
                checkedTrackColor: '#999999',
                border: '2px solid #FF0000',
                checkedBorder: '2px solid #00FF00'
            }
        };

        renderComponent({
            elementProps: { labelLeft: 'Left Label', labelRight: 'Right Label' },
            classes: customClasses,
            onChange: mockOnChange,
            'data-testid': 'toggle-switch'
        });
    });
});
