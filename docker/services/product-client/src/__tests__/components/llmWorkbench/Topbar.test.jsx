import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store/store';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import appNavBarStyle from '../../../assets/jss/appNavBarStyle';
import { withStyles } from '@material-ui/core/styles';
import Topbar from '../../../components/llmWorkbench/Topbar';
const history = createMemoryHistory();

const MockTopbar = withStyles(appNavBarStyle, { withTheme: true })(Topbar);

describe('Topbar Component', () => {
    const setup = (path = '/') => {
        history.push(path);
        return render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <MockTopbar />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    };

    it('renders the Nuclios logo link', () => {
        setup();
        const link = screen.getByRole('link', { name: /main-dashboard/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders the application title LLM Workbench', () => {
        setup();
        expect(screen.getByText(/LLM Workbench/i)).toBeInTheDocument();
    });

    it('does not render the application title when the path includes an exception', () => {
        setup('/results');
        expect(screen.queryByText(/LLM Workbench/i)).toBeInTheDocument();
    });

    it('renders the MenuBar component', () => {
        setup();
        expect(screen.getByRole('link', { name: /main-dashboard/i })).toBeInTheDocument();
    });
});
