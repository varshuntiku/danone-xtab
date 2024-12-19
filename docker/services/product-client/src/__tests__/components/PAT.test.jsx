import React from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CustomThemeContextProvider from 'themes/customThemeContext';
import { deleteUserToken, getJwtTokenByUser } from 'services/alerts';
import PAT from '../../components/Utils/PAT';
import { vi } from 'vitest';

const history = createMemoryHistory();
vi.mock('../../services/alerts', () => ({
    deleteUserToken: vi.fn(),
    getJwtTokenByUser: vi.fn()
}));

describe('PAT component renders', () => {
    afterEach(cleanup);
    test('Should render PAT component', () => {
        const mockeddata = [
            {
                id: 11,
                created_at: 'Mon, 29 May 2023 04:00:10 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg2MTAsImlhdCI6MTY4NTM1MjYxMCwic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.l_UibHOe1Zw1HCeDxBwKDaaBFiIzVDfkXhe_WnjvHQc',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            },
            {
                id: 12,
                created_at: 'Mon, 29 May 2023 04:02:03 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg3MjMsImlhdCI6MTY4NTM1MjcyMywic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.qBZN8h6DTIVHxGdQONf1P72ozLmtjCHa0_S-ORRC_B8',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            }
        ];
        getJwtTokenByUser.mockResolvedValue({ data: mockeddata });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PAT />
                </Router>
            </CustomThemeContextProvider>
        );
    });

    test('Should render buttons and label PAT component', () => {
        const mockeddata = [
            {
                id: 11,
                created_at: 'Mon, 29 May 2023 04:00:10 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg2MTAsImlhdCI6MTY4NTM1MjYxMCwic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.l_UibHOe1Zw1HCeDxBwKDaaBFiIzVDfkXhe_WnjvHQc',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            },
            {
                id: 12,
                created_at: 'Mon, 29 May 2023 04:02:03 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg3MjMsImlhdCI6MTY4NTM1MjcyMywic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.qBZN8h6DTIVHxGdQONf1P72ozLmtjCHa0_S-ORRC_B8',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            }
        ];
        getJwtTokenByUser.mockResolvedValue({ data: mockeddata });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PAT />
                </Router>
            </CustomThemeContextProvider>
        );
        const generatePatText = screen.getByText('Generate PAT');
        expect(generatePatText).toBeInTheDocument();
    });
    test('Should call delete usertoken api call', () => {
        const mockeddata = [
            {
                id: 11,
                created_at: 'Mon, 29 May 2023 04:00:10 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg2MTAsImlhdCI6MTY4NTM1MjYxMCwic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.l_UibHOe1Zw1HCeDxBwKDaaBFiIzVDfkXhe_WnjvHQc',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            },
            {
                id: 12,
                created_at: 'Mon, 29 May 2023 04:02:03 GMT',
                user_id: 0,
                user_email: 'sharath.kumar@themathcompany.com',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTMxMjg3MjMsImlhdCI6MTY4NTM1MjcyMywic3ViIjoic2hhcmF0aC5rdW1hckB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOmZhbHNlLCJjcmVhdGVfYXBwIjpmYWxzZSwiZGVsZXRlX2FwcCI6ZmFsc2V9fQ.qBZN8h6DTIVHxGdQONf1P72ozLmtjCHa0_S-ORRC_B8',
                access: "{'trigger_notification': False, 'create_app': False, 'delete_app': False}"
            }
        ];
        getJwtTokenByUser.mockResolvedValue({ data: mockeddata });
        deleteUserToken.mockResolvedValue({ success: true, message: 'Token deleted successfully' });
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <PAT />
                </Router>
            </CustomThemeContextProvider>
        );
    });
});
