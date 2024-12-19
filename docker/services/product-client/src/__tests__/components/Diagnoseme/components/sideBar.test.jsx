import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import DiagnosemeSideBar from '../../../../components/Diagnoseme/components/sideBar';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import store from 'store/store';
import '@testing-library/jest-dom';

import { vi } from 'vitest';

const history = createMemoryHistory();
describe('DiagnosemeSideBar', () => {
    const mockDrawerCondition = vi.fn();

    const mockSideBarProps = {
        parent: 'App',
        hide: false,
        is_restricted_user: false,
        app_info: {
            name: 'diagnosemeSample',
            screens: [
                {
                    screen_index: 0,
                    screen_name: 'Home'
                }
            ],
            modules: {
                dashboard: true
            },
            is_user_admin: true
        },
        routes: [
            {
                screen_item: {
                    id: 56717,
                    screen_index: 0,
                    screen_name: 'Start Diagnosis',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/landingpage',
                href: '/diagnoseme/diagnosis',
                show: true,
                show_title: true,
                expanded: false,
                level: 0,
                expandable: false
            },
            {
                screen_item: {
                    id: 56717,
                    screen_index: 0,
                    screen_name: 'Upload Reports',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/uploadReports',
                href: '/diagnoseme/uploadReports',
                show: true,
                show_title: true,
                expanded: false,
                level: 0,
                expandable: false
            },
            {
                screen_item: {
                    id: 56717,
                    screen_index: 0,
                    screen_name: 'Follow Up',
                    hidden: false
                },
                selected: false,
                original_href: '/diagnoseme/Followup',
                href: '/diagnoseme/Followup',
                show: true,
                show_title: true,
                expanded: false,
                level: 0,
                expandable: false
            }
        ],
        user_permissions: {
            admin: true,
            all_projects: true,
            app: true,
            app_publish: true,
            case_studies: false,
            environments: true,
            my_projects: true,
            my_projects_only: true,
            rbac: true,
            widget_factory: true
        }
    };

    const mockAppNavBarProps = {
        app_info: {
            name: 'Diagnoseme',
            modules: {
                dashboard: false,
                user_guide: true
            }
        },
        parent: 'App',
        user_permissions: {
            app: true,
            case_studies: false,
            my_projects: true,
            my_projects_only: true,
            all_projects: true,
            widget_factory: true,
            environments: true,
            rbac: true,
            admin: true,
            app_publish: true
        }
    };

    it('should render correct routes', () => {
        render(
            <Provider store={store}>
                <CustomThemeContextProvider>
                    <Router history={history}>
                        <DiagnosemeSideBar />
                    </Router>
                </CustomThemeContextProvider>
            </Provider>
        );

        expect(screen.getByText('Start Diagnosis')).toBeInTheDocument();
        expect(screen.getByText('Upload Reports')).toBeInTheDocument();
        expect(screen.getByText('Follow Up')).toBeInTheDocument();
    });
});
