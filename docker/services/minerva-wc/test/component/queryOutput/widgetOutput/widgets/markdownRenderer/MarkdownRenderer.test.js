import { render, screen} from '@testing-library/preact';
import MarkdownRenderer from '../../../../../../src/component/queryOutput/widgetOutput/widgets/markdownRenderer/MarkdownRenderer';
import MainService from '../../../../../../src/service/mainService';
import QueryService from '../../../../../../src/service/queryService';
import RootContextProvider from '../../../../../../src/context/rootContext';

describe('MarkdownRenderer test', () => {
    test('component should render', () => {
        const { container } = render(<MarkdownRenderer children={"<span>other code<span> ```sql\n SQL Query\n``` <pre><code>SQL Query</code></pre>"} />);
        expect(container.textContent).toMatch('SQL Query');
    });
    test('component should render: unknown langugage', () => {
        const { container } = render(<MarkdownRenderer children={"<span>other code<span> ```abcd\n SQL Query\n``` <pre><code>SQL Query</code></pre>"} />);
        expect(container.textContent).toMatch('SQL Query');
    });
    test('component should render overriden img tag', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <MarkdownRenderer children={"<img src='https://www.kasandbox.org/programming-images/avatars/leaf-green.png' alt='green-leaf'/>"} />
        </RootContextProvider>
        );
        expect(screen.getByAltText('green-leaf'));
    });
    test('component should render overriden img tag with private image source URL', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);

        const fetchBlobSasUrl = jest.fn().mockResolvedValue("https://www.kasandbox.org/programming-images/avatars/leaf-green.png")
        queryService.fetchBlobSasUrl = fetchBlobSasUrl

        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <MarkdownRenderer children={"<img src='private:https://www.kasandbox.org/programming-images/avatars/leaf-green.png' alt='green-leaf'/>\n\n<img src='private:https://www.kasandbox.org/programming-images/avatars/leaf-green.png' alt='green-leaf'/>"} />
        </RootContextProvider>
        );
        expect(fetchBlobSasUrl).toHaveBeenCalledWith("https://www.kasandbox.org/programming-images/avatars/leaf-green.png")

    });
    test('component should render custom ImageList tag', () => {
        const mainService = new MainService();
        const queryService = new QueryService(mainService);
        const { container } = render(<RootContextProvider value={{ queryService: queryService }}>
            <MarkdownRenderer children={`<ImageList params='[{"url": "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png","caption": "blue leaf"}]' width=200 height=200/>`} />
        </RootContextProvider>
        );
        expect(screen.getByAltText('blue leaf'));
    });
});
