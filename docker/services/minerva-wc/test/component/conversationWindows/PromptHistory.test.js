import { fireEvent, render, screen } from '@testing-library/preact';
import MainService from '../../../src/service/mainService';
import QueryService from '../../../src/service/queryService';
import RootContextProvider from '../../../src/context/rootContext';
import PromptHistory from '../../../src/component/conversationWindows/PromptHistory';

describe('PromptHistory test', () => {

    // Helper function to render the component with required context
    const renderComponent = (queryServiceOverrides = {}) => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        Object.assign(queryService, queryServiceOverrides);

        return render(
            <RootContextProvider value={{ mainService, queryService }}>
                <PromptHistory />
            </RootContextProvider>
        );
    };

    test('component should render with queries', () => {
        const query1 = {
            id: 572,
            input: "sales across brands1",
            output: {
                type: "sql",
                response: {
                    text: "Example response",
                    sql_query: "SELECT * FROM sales",
                    widgets: [],
                    processed_query: "sales across brands1"
                }
            },
            window_id: 60,
            feedback: null
        };

        const { container } = renderComponent({ queries: { value: [query1] } });

        expect(container.textContent).toMatch("sales across brands1");
    });


    test('component should render "Load More" if more items are available', () => {
        const query1 = {
            id: 572,
            input: "sales across brands1",
            output: {
                type: "sql",
                response: {
                    text: "Example response",
                    sql_query: "SELECT * FROM sales",
                    widgets: [],
                    processed_query: "sales across brands1"
                }
            },
            window_id: 60,
            feedback: null
        };

        const queryService = new QueryService(new MainService());
        queryService.queries.value = [query1];
        queryService.total_count.value = 5;
        queryService.loadingConversation.value = false;

        const { container } = renderComponent({ queries: queryService.queries, total_count: queryService.total_count, loadingConversation: queryService.loadingConversation });

        expect(container.textContent).toMatch("Load more");
    });
});
