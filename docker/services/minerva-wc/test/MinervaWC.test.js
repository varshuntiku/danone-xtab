import { render } from '@testing-library/preact';
import MinervaWC from '../src/MinervaWC';
import RootContextProvider from '../src/context/rootContext';
import MainService from '../src/service/mainService';
import QueryService from '../src/service/queryService';
import ViewModeContextProvider from '../src/context/viewModeContext';
import { SideWorkspaceContext } from '../src/model/SideWorkspace';
import MinervaPopper from '../src/component/minervaPopper/MinervaPopper';
// import { jest } from '@jest/globals';

jest.mock('../src/component/minervaPopper/MinervaPopper', () => {
    return () => <div>Mocked MinervaPopper</div>;
  });


describe('MinervaWC test', () => {
  test('component should render', () => {
    const mainService = new MainService();
    const queryService = new QueryService(mainService);
    const { container } = render(<RootContextProvider value={{ mainService, queryService, hide_trigger_button: true, suggested_queries: [] }}>
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
        <MinervaWC />
      </ViewModeContextProvider>
    </RootContextProvider>);
    console.log('container ', container.innerHTML)
    expect(container.textContent).toMatch('Minerva');
  });
});