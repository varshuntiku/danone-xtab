import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { vi } from 'vitest';
import ProblemDefinition from '../../../../components/dsWorkbench/projectDetail/ProblemDefinition';

import store from 'store/store';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import '@testing-library/jest-dom/extend-expect';

vi.mock('../../../services/project', () => ({
    getProject: vi.fn(),
    saveProject: vi.fn(),
    deleteAttachment: vi.fn()
}));

vi.mock('../../CustomSnackbar', () => ({
    default: ({ open, onClose, message, severity }) =>
        open ? (
            <div data-testid="snackbar" role="alert">
                {message}
            </div>
        ) : null
}));

const history = createMemoryHistory();

describe('ProblemDefinition Component', () => {
    const renderComponent = (props = {}) => {
        return render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <ProblemDefinition {...props} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
    };

    test('renders without crashing', () => {
        renderComponent();
        expect(screen.getByLabelText('Problem definition create root')).toBeInTheDocument();
    });

    test('renders Tabs with the correct number of sections', async () => {
        const props = {
            match: { params: { projectId: 'test-project-id' } },
            location: { state: {} }
        };
        renderComponent(props);

        await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(1));
    });
});
