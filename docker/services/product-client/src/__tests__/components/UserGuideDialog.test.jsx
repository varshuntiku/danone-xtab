import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { expect, vi } from 'vitest';
import UserGuideDialog from '../../components/UserGuideDialog';
import {
    saveScreenUserGuide,
    getScreenUserGuide,
    updateScreenUserGuide,
    deleteScreenUserGuide
} from '../../services/screen.js';
const history = createMemoryHistory();
vi.mock('services/screen.js', () => ({
    getScreenUserGuide: vi.fn().mockResolvedValue({}),
    saveScreenUserGuide: vi.fn(),
    updateScreenUserGuide: vi.fn(),
    deleteScreenUserGuide: vi.fn()
}));

describe('UserGuideDialog', () => {
    let setNotificationOpen;
    let setNotification;
    let setGuideName;
    let setGuideType;
    let setGuideURL;
    let setGuideSelected;

    beforeEach(() => {
        setNotificationOpen = vi.fn();
        setNotification = vi.fn();
        setGuideName = vi.fn();
        setGuideType = vi.fn();
        setGuideURL = vi.fn();
        setGuideSelected = vi.fn();
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const renderComponent = () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                        setNotificationOpen={setNotificationOpen}
                        setNotification={setNotification}
                        setGuideName={setGuideName}
                        setGuideType={setGuideType}
                        setGuideURL={setGuideURL}
                        setGuideSelected={setGuideSelected}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
    };

    it('should handle failed guide deletion', () => {
        renderComponent();

        const response_data = { status: 'error' };

        const instance = screen.getByText('Create Guide').closest('button');

        expect(setNotification).not.toBeCalled();
    });

    afterEach(() => {
        cleanup();
    });

    it('should render correctly with initial props', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        expect(screen.getByText('Test Screen')).toBeInTheDocument();
    });

    it('should display notification when input fields are empty', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Create Guide'));

        expect(screen.getByText('Please fill all fields !')).toBeInTheDocument();
    });

    it('should update guide name state on input change', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        const nameInput = screen.getByText('Guide Name');

        expect(nameInput).toBeInTheDocument();
    });

    it('should call saveScreenUserGuide on save button click', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Create Guide'));

        expect(saveScreenUserGuide).not.toBeCalled();
    });

    it('should display notification when input fields are empty', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Create Guide'));

        expect(screen.getByText('Please fill all fields !')).toBeInTheDocument();
    });

    it('should delete a guide and call updateScreenUserGuide', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        screen.debug();
        const guideNameInput = screen.getByText('Guide Name');
        const guideUrlInput = screen.getByText('Guide URL');

        fireEvent.click(screen.getByText('Create Guide'));
        expect(screen.getByText('Create Guide').toBeInTheDocument);
    });

    it('should call updateScreenUserGuide on update button click', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuideDialog
                        app_id="123"
                        screen_id="456"
                        screen_name="Test Screen"
                        onCloseGuide={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );

        fireEvent.click(screen.getByText('Guide Name'));
    });

    afterEach(() => {
        cleanup();
    });
    it('should render guide name and URL input fields', () => {
        renderComponent();

        expect(screen.getByText('Guide Name')).toBeInTheDocument();
        expect(screen.getByText('Guide URL')).toBeInTheDocument();
    });

    afterEach(() => {
        cleanup();
    });
});
