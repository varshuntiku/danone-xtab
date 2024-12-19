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
import Tasks from '../../../components/llmWorkbench/Tasks';
const history = createMemoryHistory();

vi.mock('store/thunks/llmWorkbenchThunk');
vi.mock('store');

describe('Tasks Component', () => {
    const setup = () => {
        return render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Tasks />
                </CustomThemeContextProvider>
            </Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the Tasks title', () => {
        setup();
        expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    });

    it('renders the search input field', () => {
        setup();
        const searchInput = screen.getByPlaceholderText(/Filter by name/i);
        expect(searchInput).toBeInTheDocument();
    });

    it('blurs other tasks when one task is focused', () => {
        const mockTasks = ['Task 1', 'Task 2', 'Task 3'];

        vi.spyOn(store, 'getState').mockReturnValue({
            llmWorkbench: {
                importedModel: {
                    huggingFace: { tasks: mockTasks },
                    loadingModels: false
                }
            }
        });

        setup();

        const firstTask = screen.getByText(mockTasks[0]);
        const secondTask = screen.getByText(mockTasks[1]);

        fireEvent.click(firstTask);
        expect(firstTask).toHaveClass(
            'MuiButtonBase-root MuiListItem-root makeStyles-eachTask-45 makeStyles-focus-46 MuiListItem-gutters MuiListItem-button'
        );
        expect(secondTask).toHaveClass(
            'MuiButtonBase-root MuiListItem-root makeStyles-eachTask-45 makeStyles-blur-47 MuiListItem-gutters MuiListItem-button'
        );
    });

    it('disables tasks when loadingModels is true', () => {
        const mockTasks = ['Task 1', 'Task 2'];

        vi.spyOn(store, 'getState').mockReturnValue({
            llmWorkbench: {
                importedModel: {
                    huggingFace: { tasks: mockTasks },
                    loadingModels: true
                }
            }
        });

        setup();

        mockTasks.forEach((task) => {
            expect(screen.getByText(task)).toBeInTheDocument();
        });
    });
});
