import { fireEvent, render, screen, waitFor } from '@testing-library/preact';
import MinervaPopper from '../../../src/component/minervaPopper/MinervaPopper';
import RootContextProvider from '../../../src/context/rootContext';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import UtilService from '../../../src/service/utilService';

describe('CardView test', () => {
    test('component should render: open', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);

        const dialog = container.querySelector(".MinervaPopperDialog");
        const showModal = jest.fn();
        // @ts-ignore
        dialog.showModal = showModal;
        const triggerButton = screen.getByTitle('open Ask NucliOS');
        fireEvent.click(triggerButton);
        expect(showModal).toHaveBeenCalled();
    });
    test('component should render: handleClose', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);
        const closeListner = jest.fn();
        container.addEventListener("popper:close", closeListner);
        const closeBtn = screen.getByTitle("minimize");
        fireEvent.click(closeBtn);
        expect(closeListner).toHaveBeenCalled();
        container.removeEventListener("popper:close", closeListner)
    });

    test('component should render: handleOpenInNew', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, external_open_in_new: true, external_open_in_new_title: "external open", suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);
        const closeListner = jest.fn();
        container.addEventListener("external:open-in-new", closeListner);
        const externalOpenBtn = screen.getByTitle('external open');
        fireEvent.click(externalOpenBtn);
        expect(closeListner).toHaveBeenCalled();
        container.removeEventListener("external:open-in-new", closeListner);
    });

    test('component should render: hide_trigger_button', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true, suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);
        let convoHisotryVisible = screen.queryByTitle("open Ask NucliOS");
        expect(convoHisotryVisible).toBeFalsy();
    });

    test('component should render: expand', async () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);
        const expandedListener = jest.fn();
        container.addEventListener("popper:expanded", expandedListener);
        const open_in_full = screen.getByTitle('Expand');
        fireEvent.click(open_in_full);
        expect(expandedListener).toHaveBeenCalled();
        container.removeEventListener("popper:expanded", expandedListener);

        const minimize = jest.fn();
        container.addEventListener("popper:minimize", minimize);
        const close_fullscreen = screen.getByTitle('Minimize');
        fireEvent.click(close_fullscreen);
        expect(minimize).toHaveBeenCalled();
        container.removeEventListener("popper:minimized", minimize);
    });

    test('component should render: suppress_fullscreen_toggler', async () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const utilService = new UtilService(queryService);
        const { container } = render(<RootContextProvider value={{ mainService, queryService, suppress_fullscreen_toggler: true, suggested_queries: [], utilService }}>
            <MinervaPopper />
        </RootContextProvider>);
        expect(container.textContent).not.toMatch("open_in_full")
    });
});
