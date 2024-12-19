import { fireEvent, render, screen } from '@testing-library/preact';
import LoadMore from '../../../../src/component/shared/loadMore/LoadMore';
import RootContextProvider from '../../../../src/context/rootContext';
import QueryService from '../../../../src/service/queryService';
import MainService from '../../../../src/service/mainService';

describe('LoadMore test', () => {
    test('component should render: loading', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        queryService.loadingConversation.value = true
        const { container } = render(<RootContextProvider value={{mainService, queryService}}>
            <LoadMore  />
        </RootContextProvider>);
        expect(container.textContent).toMatch("Loading...")
    });

    test('component should render: handleLoadMore', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        queryService.queries.value = [{}]
        queryService.total_count.value = 5;
        const loadConversation = jest.fn();
        queryService.loadConversation = loadConversation;
        const { container } = render(<RootContextProvider value={{mainService, queryService}}>
            <LoadMore  />
        </RootContextProvider>);
        fireEvent.click(screen.getByText("Load more"));
        expect(loadConversation).toHaveBeenCalled();
    });
});
