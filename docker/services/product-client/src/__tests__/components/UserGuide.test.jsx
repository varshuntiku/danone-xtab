import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import UserGuide from '../../components/UserGuide';
import CustomThemeContextProvider from '../../themes/customThemeContext';
import { getScreenUserGuide } from 'services/screen.js';
import { vi } from 'vitest';

vi.mock('../../services/screen', () => ({
    getScreenUserGuide: vi.fn()
}));

const history = createMemoryHistory();

describe('User Guide component tests', () => {
    afterEach(cleanup);

    test('Render the component', () => {
        const scrollViewMock = vi.fn();
        const onData = vi.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollViewMock;
        getScreenUserGuide.mockImplementation(
            ({
                callback,
                response_data = {
                    data: [
                        {
                            guide_name: 'Test Guide',
                            guide_type: 'pdf',
                            guide_url: 'https://www.google.com'
                        },
                        {
                            guide_name: 'Test video Guide',
                            guide_type: 'video',
                            guide_url: `${
                                import.meta.env['REACT_APP_STATIC_DATA_ASSET']
                            }/test-user-guides/NucliOS and 3 more pages - Work - Microsoft​ Edge 2023-03-16 18-06-42.mp4`
                        }
                    ]
                }
            }) => callback(response_data)
        );
        const { getByText } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <UserGuide
                        app_id={1}
                        screen_id={1}
                        onData={onData}
                        closeMoreOptions={() => {}}
                    />
                </Router>
            </CustomThemeContextProvider>
        );
        const userGuideButton = screen.getByText('User Guide');
        expect(userGuideButton).toBeInTheDocument();
        fireEvent.click(userGuideButton);
        const menuList = screen.getAllByRole('menuitem');
        expect(menuList).not.toHaveLength(0);
        fireEvent.click(menuList[0]);
        fireEvent.click(menuList[1]);
    });
});
