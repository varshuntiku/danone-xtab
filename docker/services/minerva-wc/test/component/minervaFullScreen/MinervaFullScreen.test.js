import { fireEvent, render, screen } from '@testing-library/preact';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import RootContextProvider from '../../../src/context/rootContext';
import MinervaFullScreen from '../../../src/component/minervaFullScreen/MinervaFullScreen';
import ViewModeContextProvider from '../../../src/context/viewModeContext';
import { SideWorkspaceContext } from '../../../src/model/SideWorkspace';
import UtilService from '../../../src/service/utilService';

describe('MinervaFullScreen test', () => {
    test('component should render', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <ViewModeContextProvider
                value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    handleExpand: () => { },
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}
            >
                <MinervaFullScreen />
            </ViewModeContextProvider>

        </RootContextProvider>);
        expect(container.querySelector(".MinervaFullScreen")).toBeTruthy();
    });

    test('component should render: fullscreen-mini', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const external_go_back_title = "arrow_back";
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <ViewModeContextProvider
                value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen-mini",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    handleExpand: () => { },
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}
            >
                <MinervaFullScreen />
            </ViewModeContextProvider>

        </RootContextProvider>);
        expect(container.querySelector(".MinervaFullScreen")).toBeTruthy();
    });

    test('component should render: external_go_back', () => {
        const external_go_back_title = "Go back"
        const external_go_back = true
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], external_go_back, external_go_back_title, utilService }}>
            <ViewModeContextProvider
                value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    handleExpand: () => { },
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}
            >
                <MinervaFullScreen />
            </ViewModeContextProvider>

        </RootContextProvider>);
        const goBackEvent = jest.fn();
        container.addEventListener("external:go-back", goBackEvent);
        const goBackBtn = screen.getByRole('button', { name: 'Go back' });
        fireEvent.click(goBackBtn);
        expect(goBackEvent).toHaveBeenCalled();
    });

    test('component should render: toggleConvoHisoty', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <ViewModeContextProvider
                value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    handleExpand: () => { },
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}
            >
                <MinervaFullScreen />
            </ViewModeContextProvider>

        </RootContextProvider>);
        const goBackEvent = jest.fn();
        container.addEventListener("external:go-back", goBackEvent);
        const reorderBtn = screen.getByRole('button', { name: 'Open Conversation History' });
        fireEvent.click(reorderBtn);
        expect(container.querySelector(".MinervaFullScreen-convo-opened")).toBeTruthy();
    });

    test('component should render: closeConvoWindow', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <ViewModeContextProvider
                value={{
                    popper: false,
                    popperOpened: false,
                    popperExpanded: false,
                    variant: "fullscreen",
                    openSideWorkspace: false,
                    handleOpenSideWorkspace: () => { },
                    closeSideWorkspace: () => { },
                    handleExpand: () => { },
                    sideWorkspaceContext: SideWorkspaceContext.PINNED_RESPONSES
                }}
            >
                <MinervaFullScreen />
            </ViewModeContextProvider>

        </RootContextProvider>);
        const reorderBtn = screen.getByRole('button', { name: 'Open Conversation History' });
        fireEvent.click(reorderBtn);
        expect(container.querySelector(".MinervaFullScreen-convo-opened")).toBeTruthy();
        const closebtn = screen.getAllByRole('button', { name: 'close' })[0]
        fireEvent.click(closebtn);
        expect(container.querySelector(".MinervaFullScreen-conversation-section-visible")).toBeFalsy();
    });

});
