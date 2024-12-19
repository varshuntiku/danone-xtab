import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DeleteStory from '../../../components/createStory/DeleteStory.jsx';
import { act } from 'react-dom/test-utils';
import { deleteReport } from '../../../services/reports';
import { vi } from 'vitest';
const history = createMemoryHistory();

vi.mock('../../../services/reports', () => ({
    deleteReport: vi.fn()
}));

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render layouts DeleteStory Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DeleteStory classes={{}} />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render layouts DeleteStory Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DeleteStory classes={{}} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTitle('delete story')).toBeInTheDocument();
        const btn = screen.getByTitle('delete story');
        fireEvent.click(btn);

        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelBtn);
    });

    test('Should render layouts DeleteStory Component 2', () => {
        const props = {
            story: {
                name: 'test story',
                id: 1,
                apps: [{}, {}]
            },
            classes: {}
        };
        deleteReport.mockImplementation(({ callback }) => callback());
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DeleteStory {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTitle('delete story')).toBeInTheDocument();
        const btn = screen.getByTitle('delete story');
        fireEvent.click(btn);

        expect(screen.getAllByRole('checkbox')).not.toBeNull();
        const checkbox = screen.getAllByRole('checkbox')[0];

        act(() => {
            checkbox.click();
            fireEvent.change(checkbox, { target: { checked: true } });
        });

        expect(screen.getByTitle('share')).toBeInTheDocument();
        const delBtn = screen.getByTitle('share');

        fireEvent.click(delBtn);
    });

    test('Should render layouts DeleteStory Component 3', () => {
        const props = {
            story: {
                name: 'test story',
                id: 1,
                apps: [{}, {}]
            },
            classes: {}
        };
        deleteReport.mockImplementation(() => {
            throw 'error';
        });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <DeleteStory {...props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByTitle('delete story')).toBeInTheDocument();
        const btn = screen.getByTitle('delete story');
        fireEvent.click(btn);

        expect(screen.getAllByRole('checkbox')).not.toBeNull();
        const checkbox = screen.getAllByRole('checkbox')[0];

        act(() => {
            checkbox.click();
            fireEvent.change(checkbox, { target: { checked: true } });
        });

        expect(screen.getByTitle('share')).toBeInTheDocument();
        const delBtn = screen.getByTitle('share');

        fireEvent.click(delBtn);
    });
});
