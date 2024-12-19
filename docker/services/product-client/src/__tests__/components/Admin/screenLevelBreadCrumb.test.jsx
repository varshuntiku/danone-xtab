import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import ScreenLevelBreadcrumb from '../../../components/Admin/ScreenLevelBreadcrumb';

describe('ScreenLevelBreadcrumb Component', () => {
    afterEach(cleanup);

    it('should render first-level breadcrumb correctly', () => {
        const screens = [{ id: 1, name: 'First Level Screen', level: 0 }];

        render(<ScreenLevelBreadcrumb screens={screens} screenId={1} />);

        expect(screen.getByText('First Level Screen')).toBeInTheDocument();
    });

    it('should render second-level breadcrumb correctly', () => {
        const screens = [
            { id: 1, name: 'First Level Screen', level: 0 },
            { id: 2, name: 'Second Level Screen', level: 1 }
        ];

        render(<ScreenLevelBreadcrumb screens={screens} screenId={2} />);

        expect(screen.getByText('First Level Screen')).toBeInTheDocument();

        expect(screen.getByText('Second Level Screen')).toBeInTheDocument();
    });

    it('should render third-level breadcrumb correctly', () => {
        const screens = [
            { id: 1, name: 'First Level Screen', level: 0 },
            { id: 2, name: 'Second Level Screen', level: 1 },
            { id: 3, name: 'Third Level Screen', level: 2 }
        ];

        render(<ScreenLevelBreadcrumb screens={screens} screenId={3} />);

        expect(screen.getByText('First Level Screen')).toBeInTheDocument();

        expect(screen.getByText('Second Level Screen')).toBeInTheDocument();

        expect(screen.getByText('Third Level Screen')).toBeInTheDocument();
    });

    it('should not render breadcrumbs if no matching screenId is found', () => {
        const screens = [
            { id: 1, name: 'First Level Screen', level: 0 },
            { id: 2, name: 'Second Level Screen', level: 1 },
            { id: 3, name: 'Third Level Screen', level: 2 }
        ];

        render(<ScreenLevelBreadcrumb screens={screens} screenId={4} />);

        expect(screen.queryByText('First Level Screen')).not.toBeInTheDocument();
        expect(screen.queryByText('Second Level Screen')).not.toBeInTheDocument();
        expect(screen.queryByText('Third Level Screen')).not.toBeInTheDocument();
    });
});
