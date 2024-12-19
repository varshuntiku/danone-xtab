import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FormDialogSaveScenario from '../../../components/dynamic-form/saveScenarioDialog.jsx';
import { describe, it, afterEach, expect, vi } from 'vitest';

const history = createMemoryHistory();

describe('FormDialogSaveScenario Component', () => {
    afterEach(cleanup);

    it('Should render FormDialogSaveScenario and handle close', () => {
        const mockHandleClose = vi.fn(); // Using vitest's vi.fn()
        const { getByLabelText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <FormDialogSaveScenario
                        dialogOpen={true}
                        handleDialogClose={mockHandleClose}
                        handleSaveScenario={vi.fn()}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
