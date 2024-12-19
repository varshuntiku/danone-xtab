import React from 'react';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CodxComponentsDemo from '../../../components/custom/CodxComponentsDemo';
import { vi } from 'vitest';

vi.mock('../../../components/custom/CodxStepper', () => {
    return {
        default: (props) => (
            <>
                <button aria-label="next" onClick={props.handleNext}>
                    next
                </button>
                <button aria-label="back" onClick={props.handleBack}>
                    back
                </button>
            </>
        )
    };
});

const history = createMemoryHistory();

describe('Codex Product test', () => {
    afterEach(cleanup);

    test('Should render CodxComponentsDemo Component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxComponentsDemo {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test("Should render dialog popup when 'Click' button is clicked", async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxComponentsDemo {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('dialog-button');
        fireEvent.click(button);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show Me' })).toBeInTheDocument();
        const linkBtn = screen.getByRole('button', { name: 'Show Me' });
        fireEvent.click(linkBtn);
        expect(history.location.pathname).toBe('/app/26');
    });
    test('Should close the dialog popup when close icon is clicked', async () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxComponentsDemo {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        const button = screen.getByLabelText('dialog-button');
        fireEvent.click(button);
        expect(
            screen.getByText('Lets look at how has the Investment Performed', { exact: false })
        ).toBeInTheDocument();
        const closeButton = screen.getByLabelText('close');
        fireEvent.click(closeButton);
        expect(
            screen.getByText('Lets look at how has the Investment Performed', { exact: false })
        ).not.toBeVisible();
    });

    test('Should render CodxComponentsDemo Component 1', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CodxComponentsDemo {...Props} />
                </Router>
            </CustomThemeContextProvider>
        );
        fireEvent.click(screen.getByLabelText('next'));
        fireEvent.click(screen.getByLabelText('back'));
    });
});

const Props = {};
