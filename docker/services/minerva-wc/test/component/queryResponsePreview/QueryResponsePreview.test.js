import { render, screen } from '@testing-library/preact';
import QueryResponsePreview from '../../../src/component/pinnedQueries/QueryResponsePreview';


jest.mock('../../../src/component/queryOutput/widgetOutput/WidgetOutput', () => ({
    WidgetItem: jest.fn(({ widget }) => <div id='widget-item'>{widget?.type}</div>),
}));

describe('QueryResponsePreview tests', () => {

    const renderComponent = (query) => {
        return render(<QueryResponsePreview query={query} />);
    };

    test('should render a chart widget when available', () => {
        const chartWidget = {
            type: 'chart',
        };
        const query = {
            output: {
                response: {
                    widgets: [chartWidget]
                }
            }
        };

        renderComponent(query);

        expect(document.getElementById('widget-item')).toBeTruthy();
        expect(screen.getByText('chart')).toBeTruthy();
    });

    test('should render a text or markdown widget when chart is not available', () => {
        const textWidget = {
            type: 'text',
        };
        const query = {
            output: {
                response: {
                    widgets: [textWidget]
                }
            }
        };

        renderComponent(query);

        expect(document.getElementById('widget-item')).toBeTruthy();
        expect(screen.getByText('text')).toBeTruthy();
    });

    test('should display fallback content when no suitable widget is found', () => {
        const query = {
            output: {
                response: {
                    text: 'Fallback content'
                }
            }
        };

        renderComponent(query);

        expect(screen.getByText('Fallback content')).toBeTruthy();
    });

    test('should apply the correct class for chart widget', () => {
        const chartWidget = {
            type: 'chart',
        };
        const query = {
            output: {
                response: {
                    widgets: [chartWidget]
                }
            }
        };

        const { container } = renderComponent(query);
        expect(container.querySelector('.MinervaQueryResponsePreview-content-chart')).toBeTruthy();
    });
});
