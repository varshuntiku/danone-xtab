import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { expect, vi } from 'vitest';
import BrowseProblemDefinition from '../../../../components/dsWorkbench/projectDetail/BrowseProblemDefinition';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import '@testing-library/jest-dom/extend-expect';
import { getProject } from '../../../../services/project';

const history = createMemoryHistory();

vi.mock('../../../services/project', () => ({
    getProjects: vi.fn(),
    getProject: vi.fn()
}));
vi.mock('../../../hooks/useDebounceCallback', () => ({
    useDebouncedCallback: (fn) => fn
}));
vi.mock('../../../hooks/useDebounceEffect', () => ({
    useDebouncedEffect: (fn, deps, delay) => fn()
}));

beforeAll(() => {
    global.IntersectionObserver = class {
        constructor() {}

        observe() {}

        unobserve() {}

        disconnect() {}
    };
});

afterAll(() => {
    global.IntersectionObserver = undefined;
});

describe('BrowseProblemDefinition Component', () => {
    const mockOnImport = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders BrowseProblemDefinition link', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition onImport={mockOnImport} currentProjectId={1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        expect(screen.getByText('Browse Problem Definition')).toBeInTheDocument();
    });

    test('opens dialog on clicking the link', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition onImport={mockOnImport} currentProjectId={1} />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Browse Problem Definition'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('displays search field and project list', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition
                            onImport={mockOnImport}
                            currentProjectId={1}
                            notification={{ message: 'Test message', severity: 'error' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Browse Problem Definition'));
        expect(screen.getByPlaceholderText('Browse')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('handles project selection', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition
                            onImport={mockOnImport}
                            currentProjectId={1}
                            notification={{ message: 'Test message', severity: 'error' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Browse Problem Definition'));

        expect(screen.getByText('Select a Project to View Problem Definition')).toBeInTheDocument();
    });

    test('closes dialog when Close button is clicked', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition
                            onImport={mockOnImport}
                            currentProjectId={1}
                            notification={{ message: 'Test message', severity: 'error' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );
        fireEvent.click(screen.getByText('Browse Problem Definition'));

        expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    test('displays CustomSnackbar when notification is set', async () => {
        const { rerender } = render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition
                            onImport={mockOnImport}
                            currentProjectId={1}
                            notification={{ message: 'Test message', severity: 'error' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        rerender(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <BrowseProblemDefinition
                            onImport={mockOnImport}
                            currentProjectId={1}
                            notification={{ message: 'Test message', severity: 'error' }}
                        />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(await screen.findByText('Browse Problem Definition')).toBeInTheDocument();
    });
});
