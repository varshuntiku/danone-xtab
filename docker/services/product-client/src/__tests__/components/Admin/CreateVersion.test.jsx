import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import CreateVersion from '../../../components/Admin/CreateVersion';
import { UserInfoContext } from 'context/userInfoContent';

const history = createMemoryHistory();

const nac_context = {
    nac_roles: [
        {
            name: 'app-admin',
            id: 2,
            permissions: [
                {
                    name: 'RESET_ALL_APP',
                    id: 1
                },
                {
                    name: 'CREATE_PREVIEW_APP',
                    id: 2
                },
                {
                    name: 'PROMOTE_APP',
                    id: 6
                },
                {
                    name: 'EDIT_PRODUCTION_APP',
                    id: 7
                }
            ]
        }
    ]
};

describe('codex product test', () => {
    test('rendering of CreateVersion component', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <CreateVersion {...props} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    test('testing the rendering of titile in component', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const titleEl = screen.getByText(
            'Select the source version from where you want to copy the application from'
        );
        expect(titleEl).toBeInTheDocument();
    });

    test('testing rendering of checkbox text', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const checkBoxText = screen.getByText('Copy App Variables');
        expect(checkBoxText).toBeInTheDocument();
    });
    test('testing rendering of checkbox', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const checkBox = screen.getByRole('checkbox');
        expect(checkBox).toBeInTheDocument();
    });
    test('testing rendering of replicate version button and it should be disbled', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const replicateBtn = screen.getByRole('button', { name: 'REPLICATE VERSION' });
        expect(replicateBtn).toBeInTheDocument();
        expect(replicateBtn).toBeDisabled();
    });
    test('testing rendering of CreateVersion component 1', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const resetAppVersionTitle = screen.getByText(
            'Do you want to reset this version of application?'
        );
        expect(resetAppVersionTitle).toBeInTheDocument();
        const resetAppVersionText = screen.getByText(
            'Resetting the application will remove all modules, screens, configuration and uiacs. overview will not be impacted'
        );
        expect(resetAppVersionText).toBeInTheDocument();
    });

    test('testing rendering of reset version', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const resetBtn = screen.getByRole('button', { name: 'RESET VERSION' });
        expect(resetBtn).toBeInTheDocument();
    });

    test('testing rendering of confirm popup after clicking on reset version button', () => {
        const props = {
            app_info: {
                env_apps: [{ id: 8, environment: 'preview' }]
            }
        };
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserInfoContext.Provider value={nac_context}>
                        <CreateVersion {...props} />
                    </UserInfoContext.Provider>
                </Router>
            </CustomThemeContextProvider>
        );
        const resetBtn = screen.getByRole('button', { name: 'RESET VERSION' });
        expect(resetBtn).toBeInTheDocument();
        fireEvent.click(resetBtn);
        const resetText = screen.getByText('Reset This Version?');
        expect(resetText).toBeInTheDocument();
        const popUpDesc = screen.getByText(
            'Current version of the application will be reset by clearing all screens and associated UIaCs.'
        );
        expect(popUpDesc).toBeInTheDocument();
        const CancelBtn = screen.getByRole('button', { name: 'No' });
        expect(CancelBtn).toBeInTheDocument();
        expect(CancelBtn).not.toBeDisabled();
        const confirmBtn = screen.getByRole('button', { name: 'Yes' });
        expect(confirmBtn).toBeInTheDocument();
        expect(confirmBtn).toBeDisabled();
    });
});
