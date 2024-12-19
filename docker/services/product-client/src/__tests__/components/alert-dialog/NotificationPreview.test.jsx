// import React from 'react';
// import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
// import { Router } from 'react-router-dom';
// import CustomThemeContextProvider from '../../../themes/customThemeContext';
// import { createMemoryHistory } from 'history';
// import NotificationPreview from '../../../components/alert-dialog/NotificationPreview';
// import { act } from 'react-dom/test-utils';
// import { IconButton } from '@material-ui/core';
// import io from 'socket.io-client';
// import { getNotifications } from 'store/index';
// import { Provider } from 'react-redux';
// import { configureStore, createSlice } from '@reduxjs/toolkit';
// import { vi } from 'vitest';

// vi.mock('socket.io-client', () => {
//     const mSocket = {
//         on: vi.fn(),
//         hasListeners: vi.fn(),
//         removeListener: vi.fn()
//     };
//     return { default: vi.fn(() => mSocket) };
// });

// vi.mock('store/index', () => ({
//     getNotifications: vi.fn()
// }));

// vi.mock('store/store', () => ({
//     store: vi.fn()
// }));

// vi.mock('eventsource', () => {
//     return {
//         default: vi.fn().mockImplementation(() => ({
//             close: vi.fn(),
//             onmessage: null,
//             onerror: null,
//             addEventListener: vi.fn(),
//             removeEventListener: vi.fn(),
//         })),
//     };
// });

// const store = configureStore({
//     reducer: createSlice({
//         name: 'notifications',
//         initialState: {
//             notificationData: {
//                 count: 1,
//                 notifications: [
//                     {
//                         alert_id: 238,
//                         app_id: 26,
//                         id: 316,
//                         is_read: false,
//                         title: 'Notification title',
//                         message: 'Custom Notification Message for industry alert 1',
//                         triggered_at: { $date: 1646131909320 },
//                         widget_id: 484,
//                         widget_name: 'Industry Volume 2019',
//                         shared_by: null
//                     },
//                     {
//                         alert_id: 239,
//                         app_id: 26,
//                         id: 317,
//                         is_read: true,
//                         title: 'Notification title 1',
//                         message: 'Custom Notification Message for industry alert 2',
//                         triggered_at: { $date: 1650131909320 },
//                         widget_id: 484,
//                         widget_name: 'Industry Volume 2019',
//                         shared_by: null
//                     },
//                     {
//                         alert_id: 240,
//                         app_id: 26,
//                         id: 318,
//                         is_read: true,
//                         title: 'Notification title 2',
//                         message: 'Custom Notification Message for industry alert 2',
//                         triggered_at: { $date: 1654131909320 },
//                         widget_id: 484,
//                         widget_name: 'Industry Volume 2019',
//                         shared_by: 'test.user@test.com'
//                     }
//                 ],
//                 platformCount: 0,
//                 platformNotifications: []
//             }
//         }
//     }).reducer
// });

// const history = createMemoryHistory();

// describe('Codex Product test', () => {
//     beforeEach(() => {
//         io.mockClear();
//         io().on.mockClear();
//     });

//     afterEach(cleanup);

//     test('Should render NotificationPreview Component', () => {
//         getNotifications.mockImplementation(() => {
//             return {
//                 type: 'getNotifications',
//                 data: {
//                     count: 1,
//                     notifications: [
//                         {
//                             alert_id: 238,
//                             app_id: 26,
//                             id: 316,
//                             is_read: false,
//                             title: 'Notification title',
//                             message: 'Custom Notification Message for industry alert 1',
//                             triggered_at: { $date: 1646131909320 },
//                             widget_id: 484
//                         }
//                     ]
//                 }
//             };
//         });

//         const { getByText, debug } = render(
//             <Provider store={store}>
//                 <CustomThemeContextProvider>
//                     <Router history={history}>
//                         <NotificationPreview {...Props} history={history} />
//                     </Router>
//                 </CustomThemeContextProvider>
//             </Provider>
//         );
//     });
//     test('Should render notifications when notification icon on navbar is clicked', () => {
//         getNotifications.mockImplementation(() => {
//             return {
//                 type: 'getNotifications',
//                 data: {
//                     count: 1,
//                     notifications: [
//                         {
//                             alert_id: 238,
//                             app_id: 26,
//                             id: 316,
//                             is_read: false,
//                             title: 'Notification title',
//                             message: 'Custom Notification Message for industry alert 1',
//                             triggered_at: { $date: 1646131909320 },
//                             widget_id: 484
//                         }
//                     ]
//                 }
//             };
//         });

//         const { getByText, debug, component } = render(
//             <Provider store={store}>
//                 <CustomThemeContextProvider>
//                     <Router history={history}>
//                         <NotificationPreview {...Props} history={history} />
//                     </Router>
//                 </CustomThemeContextProvider>
//             </Provider>
//         );

//         expect(screen.getByLabelText('nav-notification')).toBeInTheDocument();
//         fireEvent.click(screen.getByLabelText('nav-notification'));
//         expect(
//             screen.getByText('Custom Notification Message for industry alert 1', { exact: false })
//         ).toBeInTheDocument();
//     });
//     test('Should close notification panel when backdrop is clicked', async () => {
//         const { getByText, debug, component } = render(
//             <Provider store={store}>
//                 <CustomThemeContextProvider>
//                     <Router history={history}>
//                         <NotificationPreview {...Props} history={history} />
//                     </Router>
//                 </CustomThemeContextProvider>
//             </Provider>
//         );
//         fireEvent.click(screen.getByLabelText('nav-notification'));
//         expect(screen.getByText('Notifications')).toBeInTheDocument();
//         fireEvent.click(screen.getByRole('presentation').firstChild);
//         expect(
//             screen.getByText('Custom Notification Message for industry alert 1', { exact: false })
//         ).not.toBeVisible();
//     });
//     // TODO: test case to mock socket events
//     // test('Should render in-app notification', () => {
//     //     const { getByText, debug, component } = render(
//     //         <Provider store={store}>
//     //             <CustomThemeContextProvider>
//     //                 <Router history={history}>
//     //                     <NotificationPreview {...Props} history={history} />
//     //                 </Router>
//     //             </CustomThemeContextProvider>
//     //         </Provider>
//     //     );

//     //     act(() => {
//     //         io().on.mock.calls[0][1]({
//     //             id: 1,
//     //             receive_notification: true,
//     //             message: 'Custom Notification Message for portfolio alert 1'
//     //         });
//     //         //expect(component.props)
//     //         //expect(root.find(Messages).props().messages).toEqual([{fakeMessage: "test"}])
//     //         //expect(screen.getByText('Custom Notification ',{exact: false})).toBeInTheDocument()
//     //         //expect(screen.getByRole('alert')).toBeInTheDocument()
//     //     });
//     // });
// });

// const Props = {
//     app_id: 26,
//     NavBarIconButton: IconButton,
//     notificationData: {},
//     getNotifications: () => {}
// };

test('Dummy test', () => {
    // This is an empty test just to validate the test file.
});
