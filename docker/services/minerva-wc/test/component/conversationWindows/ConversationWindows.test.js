import { fireEvent, render, screen } from '@testing-library/preact';
import ConversationWindows from '../../../src/component/conversationWindows/ConversationWindows';
import RootContextProvider from '../../../src/context/rootContext';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';

describe('ConversationWindows test', () => {
    test('component should render', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        queryService.conversationWindows.value = [{
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        },{
            created_at: Date.now().toLocaleString(),
            id: 2,
            pinned: false,
            title: "window 2"
        }]
        const { container } = render(<RootContextProvider value={{mainService, queryService, hide_trigger_button: true}}>
            <ConversationWindows />
        </RootContextProvider>);
        expect(screen.queryByTestId('1_convo_windo_item')).toBeTruthy();
    });

    test('component should render: search', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        queryService.conversationWindows.value = [{
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        },{
            created_at: Date.now().toLocaleString(),
            id: 2,
            pinned: false,
            title: "window 2"
        }]
        const { container } = render(<RootContextProvider value={{mainService, queryService, hide_trigger_button: true}}>
            <ConversationWindows />
        </RootContextProvider>);
        const search = screen.getByLabelText("search convo input");
        fireEvent.change(search, {target: {value: '1'}});
        expect(screen.queryByTestId('1_convo_windo_item')).toBeTruthy();
        expect(screen.queryByTestId('2_convo_windo_item')).toBeFalsy();
    });

    test('component should render: window select', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const changeChatWindow = jest.fn()
        queryService.changeChatWindow = changeChatWindow;
        queryService.conversationWindows.value = [{
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        },{
            created_at: Date.now().toLocaleString(),
            id: 2,
            pinned: false,
            title: "window 2"
        }]
        const { container } = render(<RootContextProvider value={{mainService, queryService, hide_trigger_button: true}}>
            <ConversationWindows />
        </RootContextProvider>);
        const window2 = screen.getByTestId("2_convo_windo_item");
        fireEvent.click(window2);
        expect(changeChatWindow).toBeCalledWith(2);
    });

    test('component should render: New chat', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const startNewChatWindow = jest.fn()
        queryService.startNewChatWindow = startNewChatWindow;
        queryService.conversationWindows.value = [{
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        },{
            created_at: Date.now().toLocaleString(),
            id: 2,
            pinned: false,
            title: "window 2"
        }]
        const { container } = render(<RootContextProvider value={{mainService, queryService, hide_trigger_button: true}}>
            <ConversationWindows />
        </RootContextProvider>);
        const newChatBtn = screen.getByLabelText("New chat");
        fireEvent.click(newChatBtn);
        expect(startNewChatWindow).toBeCalledWith();
    });
});
