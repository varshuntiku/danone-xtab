import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import DashboardsWrapper from '../../components/DashboardsWrapper';
import { Provider } from 'react-redux';
import store from 'store/store';
import { getDashboardDetails } from '../../services/dashboard';

vi.mock('../services/dashboard.js', () => ({
    getDashboardDetails: vi.fn(() =>
        Promise.resolve({
            template: { name: 'diagnoseme' },
            id: '123'
        })
    )
}));

describe('DashboardsWrapper', () => {
    it('should render DiagnosemeHome for Diagnoseme template', async () => {
        render(
            <MemoryRouter>
                <DashboardsWrapper match={{ params: {} }} />
            </MemoryRouter>
        );
    });
});
