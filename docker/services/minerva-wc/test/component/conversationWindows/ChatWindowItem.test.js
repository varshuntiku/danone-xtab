import { fireEvent, render, screen } from '@testing-library/preact';
import ChatWindowItem from '../../../src/component/conversationWindows/ChatWindowItem';
import RootContextProvider from '../../../src/context/rootContext';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';

describe('ChatWindowItem test', () => {
    test('component should render', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} />
        </RootContextProvider>);
        const rootEle = screen.getByTestId("1_convo_windo_item");
        fireEvent.click(rootEle);
        expect(container.querySelector('.MinervaChatWindowItem-title-editing')).toBeFalsy();
        const titleInput = screen.getByPlaceholderText("Conversation name")
        fireEvent.change(titleInput, { target: { value: 'window 2' } });
        expect(container.querySelector('.MinervaChatWindowItem-title-editing')).toBeTruthy();
    });

    test('component should render: input click', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} />
        </RootContextProvider>);
        const titleInput = screen.getByPlaceholderText("Conversation name")
        fireEvent.click(titleInput);
        const rootEleClickEvent = jest.fn();
        screen.getByTestId("1_convo_windo_item").addEventListener('click', rootEleClickEvent);
        expect(rootEleClickEvent).not.toHaveBeenCalled();
    });

    test('component should render: action container click', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} />
        </RootContextProvider>);
        const actionContainer = screen.getByLabelText("action container")
        fireEvent.click(actionContainer);
        const rootEleClickEvent = jest.fn();
        screen.getByTestId("1_convo_windo_item").addEventListener('click', rootEleClickEvent);
        expect(rootEleClickEvent).not.toHaveBeenCalled();
    });

    test('component should render: delete button click', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} />
        </RootContextProvider>);
        const actionContainer = screen.getByLabelText("action container")
        fireEvent.click(actionContainer);
        const rootEleClickEvent = jest.fn();
        screen.getByTestId("1_convo_windo_item").addEventListener('click', rootEleClickEvent);
        expect(rootEleClickEvent).not.toHaveBeenCalled();
    });

    test('component should render: delete button click', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} />
        </RootContextProvider>);
        const actionContainer = screen.getByLabelText("action container")
        fireEvent.click(actionContainer);
        const rootEleClickEvent = jest.fn();
        screen.getByTestId("1_convo_windo_item").addEventListener('click', rootEleClickEvent);
        expect(rootEleClickEvent).not.toHaveBeenCalled();
    });

    test('component should render: selected', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} selected={true} />
        </RootContextProvider>);
        const actionContainer = container.querySelector(".MinervaChatWindowItem-selected");
        expect(actionContainer).toBeTruthy();
    });

    test('component should render: handleCancelEdit ', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} selected={true} />
        </RootContextProvider>);
        expect(container.querySelector('.MinervaChatWindowItem-title-editing')).toBeFalsy();
        const titleInput = screen.getByPlaceholderText("Conversation name")
        fireEvent.change(titleInput, { target: { value: 'window 2' } });
        expect(container.querySelector('.MinervaChatWindowItem-title-editing')).toBeTruthy();
        const cancelBnt = screen.getByTitle("close");
        fireEvent.click(cancelBnt);
        expect(container.querySelector('.MinervaChatWindowItem-title-editing')).toBeFalsy();
    });

    test('component should render: handleDelete ', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const deleteConversationWindow = jest.fn();
        queryService.deleteConversationWindow = deleteConversationWindow;
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} selected={true} />
        </RootContextProvider>);
        const deleteBtn = screen.getByLabelText("delete");
        fireEvent.click(deleteBtn);
        const confirmBtn = screen.getByLabelText("Confirm")
        fireEvent.click(confirmBtn);
        expect(deleteConversationWindow).toHaveBeenCalledWith(1)
    });

    test('component should render: handleExpand ', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} selected={true} />
        </RootContextProvider>);
        const expandBtn = screen.getByLabelText("Expand more");
        fireEvent.click(expandBtn);
        expect(container.querySelector(".MinervaChatWindowItem-row3-expended")).toBeTruthy();
    });

    test('component should render: onSelect ', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const onSelect = jest.fn();
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} onSelect={onSelect} />
        </RootContextProvider>);
        const rootEle = screen.getByTestId("1_convo_windo_item");
        fireEvent.click(rootEle);
        expect(onSelect).toHaveBeenCalled();
    });

    test('component should render: handleComplete ', () => {
        const data = {
            created_at: Date.now().toLocaleString(),
            id: 1,
            pinned: false,
            title: "window 1"
        }
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const updateConversationWindow = jest.fn();
        queryService.updateConversationWindow = updateConversationWindow;
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true }}>
            <ChatWindowItem data={data} selected={true} />
        </RootContextProvider>);
        const titleInput = screen.getByPlaceholderText("Conversation name")
        fireEvent.change(titleInput, { target: { value: 'window 2' } });
        const doneBtn = screen.getByTitle("save");
        fireEvent.click(doneBtn);
        expect(updateConversationWindow).toHaveBeenLastCalledWith(1, expect.objectContaining({
            title: "window 2"
        }))
    });

});
