import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CodxPopupDialog from '../../../components/custom/CodxPoupDialog';
import { vi } from 'vitest';
const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render CodxPopupDialog Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxPopupDialog {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('Should not close CodxPopupDialog Component when backdrop is clicked', () => {
        const clickCloseHandler = vi.fn();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxPopupDialog {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('presentation').firstChild);
        expect(screen.getByRole('dialog')).toBeVisible();
    });
    test('Should not close CodxPopupDialog Component when backdropClick reason is passed as props is clicked', () => {
        const clickCloseHandler = vi.fn();
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxPopupDialog {...Props1} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('presentation').firstChild);
        expect(screen.getByRole('dialog')).toBeVisible();
    });
    test('Should render close Icon when onClose handler is passed  to CodxPopupDialog Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxPopupDialog {...Props2} />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByLabelText('close')).toBeInTheDocument();
    });
});

const Props = {
    open: true,
    setOpen: () => {},
    dialogTitle: 'Delete Alert',
    dialogContent: 'Are you sure you want to delete the alert?',
    //dialogActions:,
    maxWidth: 'xs',
    dialogClasses: {},
    onClose: null,
    sectionDivider: false,
    property: null
};
const Props1 = {
    open: true,
    setOpen: () => {},
    dialogTitle: 'Delete Alert',
    dialogContent: 'Are you sure you want to delete the alert?',
    //dialogActions:,
    maxWidth: 'xs',
    dialogClasses: {},
    onClose: null,
    sectionDivider: false,
    property: null,
    reason: 'backdropClick'
};
const Props2 = {
    open: true,
    setOpen: () => {},
    dialogTitle: 'Delete Alert',
    dialogContent: 'Are you sure you want to delete the alert?',
    //dialogActions:,
    maxWidth: 'xs',
    dialogClasses: {},
    onClose: () => {},
    sectionDivider: false,
    property: 'delete',
    reason: 'backdropClick'
};
