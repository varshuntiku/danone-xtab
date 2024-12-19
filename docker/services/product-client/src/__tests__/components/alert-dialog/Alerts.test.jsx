import React from 'react';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import Alerts from '../../../components/alert-dialog/Alerts';

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render Alerts Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('Your created alerts will appear here')).toBeInTheDocument();
    });
    test('Should render Alerts Component1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        expect(screen.getByText('ab')).toBeInTheDocument();
    });
    test('Should render list of alerts', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );
        const list = screen.getByRole('list');
        const { getAllByRole } = within(list);
        const items = getAllByRole('button');
        expect(items.length).toBe(3);
    });
    test('Should select the clicked alert', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const list = screen.getByRole('list');
        const { getByRole } = within(list);
        const items = getByRole('button');
        fireEvent.click(items);
        waitFor(() => expect(items).toHaveClass('Mui-selected'));
        //expect(items).toHaveClass('Mui-selected')
    });
    test('Should render the delete icon for the clicked alert', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const list = screen.getByRole('list');
        const { getByRole } = within(list);
        const items = getByRole('button');
        fireEvent.click(items);
        waitFor(() => expect(items).toHaveClass('Mui-selected'));
        expect(screen.getByLabelText('Delete Alert')).toBeInTheDocument();
        const deleteBtn = screen.getByLabelText('Delete Alert');
        fireEvent.click(deleteBtn);
        expect(screen.getByLabelText('Cancel Delete', { exact: false })).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Delete', { exact: false })).toBeInTheDocument();
    });
    test('Should delete the clicked alert', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const list = screen.getByRole('list');
        const { getByRole } = within(list);
        const items = getByRole('button');
        fireEvent.click(items);
        waitFor(() => expect(items).toHaveClass('Mui-selected'));
        expect(screen.getByLabelText('Delete Alert')).toBeInTheDocument();
        const deleteBtn = screen.getByLabelText('Delete Alert');
        fireEvent.click(deleteBtn);
        expect(screen.getByLabelText('Confirm Delete', { exact: false })).toBeInTheDocument();
        const confirmBtn = screen.getByLabelText('Confirm Delete', { exact: false });
        fireEvent.click(confirmBtn);
    });
    test('Should not delete the clicked alert', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <Alerts {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );
        const list = screen.getByRole('list');
        const { getByRole } = within(list);
        const items = getByRole('button');
        fireEvent.click(items);
        waitFor(() => expect(items).toHaveClass('Mui-selected'));
        expect(screen.getByLabelText('Delete Alert')).toBeInTheDocument();
        const deleteBtn = screen.getByLabelText('Delete Alert');
        fireEvent.click(deleteBtn);
        expect(screen.getByLabelText('Cancel Delete', { exact: false })).toBeInTheDocument();
        const cancelBtn = screen.getByLabelText('Cancel Delete', { exact: false });
        fireEvent.click(cancelBtn);
    });
});

const Props = {
    alerts: [],
    selectedAlertId: null,
    selectAlert: () => {},
    alertClicked: () => {}
};

const Props1 = {
    alerts: [
        {
            app_id: 26,
            app_screen_id: 103,
            app_screen_widget_id: 488,
            category: 'trace-pie-1',
            condition: 'below',
            id: 39,
            receive_notification: true,
            threshold: 500,
            title: 'ab'
        }
    ],
    selectedAlertId: 39,
    selectAlert: () => {},
    alertClicked: () => {},
    deleteAlert: () => {}
};

const Props2 = {
    alerts: [
        {
            app_id: 26,
            app_screen_id: 103,
            app_screen_widget_id: 488,
            category: 'trace-pie-1',
            condition: 'below',
            id: 39,
            receive_notification: true,
            threshold: 500,
            title: 'alert 1'
        },
        {
            app_id: 26,
            app_screen_id: 103,
            app_screen_widget_id: 488,
            category: 'trace-pie-1',
            condition: 'below',
            id: 40,
            receive_notification: true,
            threshold: 500,
            title: 'alert 2'
        },
        {
            app_id: 26,
            app_screen_id: 103,
            app_screen_widget_id: 488,
            category: 'trace-pie-1',
            condition: 'below',
            id: 41,
            receive_notification: true,
            threshold: 500,
            title: 'alert 3'
        }
    ],
    selectedAlertId: null,
    selectAlert: () => {},
    alertClicked: () => {}
};
