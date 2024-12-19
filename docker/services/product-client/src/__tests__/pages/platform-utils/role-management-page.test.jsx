import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from 'themes/customThemeContext';
import { getAllPermissions, getAllRoles } from 'services/role';
import RoleManagementPage from 'pages/platform-utils/role-management/role-management-page.jsx';
import { vi } from 'vitest';

const history = createMemoryHistory();
vi.mock('../../../services/role', () => ({
    getAllPermissions: vi.fn(),
    getAllRoles: vi.fn()
}));

describe('Role Management Page Component', () => {
    afterEach(cleanup);
    test('Should render RoleManagementPage Component', () => {
        const match = {
            params: {
                industry: false,
                app_id: 26,
                logout: false
            }
        };
        getAllRoles.mockImplementation(() => ({
            data: [
                {
                    id: 1,
                    name: 'Role 1',
                    permissions: ['CLONING_OF_APPLICATION', 'RESET_ALL_APP'],
                    user_role_type: 'SYSTEM',
                    created_by: '--'
                }
            ]
        }));
        getAllPermissions.mockImplementation(() => ({
            data: [
                {
                    id: 1,
                    name: 'CLONING_OF_APPLICATION',
                    created_by: '--'
                },
                {
                    id: 2,
                    name: 'RESET_ALL_APP',
                    created_by: '--'
                }
            ]
        }));
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RoleManagementPage match={match} />
                </Router>
            </CustomThemeContextProvider>
        );
    });
    // test('Should render LoginPage1 Component', () => {
    //     const match = {
    //         params: {
    //             industry: false,
    //             app_id: false,
    //             logout: true
    //         }
    //     };
    //     getApp.mockImplementation(({ callback }) =>
    //         callback({ logo_url: 'https://testing_logo_url.com' })
    //     );
    //     const { getByText, debug } = render(
    //         <CustomThemeContextProvider>
    //             <Router history={history}>
    //                 <LoginPage match={match} logout={true} parent_obj={{ onLogout: () => {} }} />
    //             </Router>
    //         </CustomThemeContextProvider>
    //     );
    // });
});
