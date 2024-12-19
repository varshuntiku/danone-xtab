import { render, screen, fireEvent } from '@testing-library/preact';
import { useContext } from 'preact/hooks';
import OutlineEditor from '../../../../../../src/component/queryOutput/widgetOutput/widgets/outlineEditor/OutlineEditor';
import RootContextProvider, { RootContext } from '../../../../../../src/context/rootContext';

const defaultQuery = {
    id: 572,
    input: 'sales across brands1',
    output: {
        type: 'sql',
        response: {
            text: 'The sales data shows the total sales for each brand...',
            sql_query: '\n## SQL Query\n\n```python\nif True:\n   print("Hello world")```\n\n',
            widgets: [
                {
                    name: 'dataTable',
                    type: 'dataTable',
                    title: 'sales across brands1',
                    value: {
                        data: { values: [['sodax']], columns: ['brand'] },
                        layout: {},
                    },
                },
            ],
            processed_query: 'sales across brands1',
        },
    },
    window_id: 60,
    feedback: null,
};

const mockQueryService = {
    updateQueryRecord: jest.fn(),
    makeQuery: jest.fn(),
    queries: [defaultQuery],
};

const mockMainService = {
    copilotAppId: {
        value: 'test-app-id'
    }
};

const mockContextValue = {
    queryService: mockQueryService,
    mainService: mockMainService,
    query: { ...defaultQuery }
};

jest.mock('preact/hooks', () => ({
    ...jest.requireActual('preact/hooks'),
    useContext: () => mockContextValue,
}));

jest.mock('../../../../../../src/component/queryOutput/widgetOutput/widgets/recommendationList/RecommendationList', () => {
    return (props) => (
        <div>
            {props.data && props.data.length > 0 ? props.data.map((item, index) => (
                <button key={index} onClick={() => props.onClick(item.name)}>
                    {item.name}
                </button>
            )) : null}
        </div>
    );
});

describe('OutlineEditor Component', () => {
    const data = {
        slides: [
            {
                placeholder: [
                    { placeholder_type: 'title', idx: 1, content: 'Slide 1 Title' },
                    { placeholder_type: 'body', idx: 2, content: 'Slide 1 Body Content' },
                ]
            },
            {
                placeholder: [
                    { placeholder_type: 'center_title', idx: 1, content: 'Slide 2 Center Title' },
                    { placeholder_type: 'object', idx: 2, content: 'Slide 2 Object Content' },
                ]
            }
        ],
        presentationAction: [
            { name: 'Action 1' },
            { name: 'Action 2', variant: 'secondary' }
        ],
        selected_conversations: [1, 2]
    };

    beforeEach(() => {
        render(
            <RootContextProvider value={mockContextValue}>
                <OutlineEditor data={data} />
            </RootContextProvider>
        );
    });

    it('should render actions from RecommendationList', () => {
        expect(screen.getByText('Action 1')).toBeTruthy();
        expect(screen.getByText('Action 2')).toBeTruthy();
    });

    it('should call queryService.makeQuery with correct parameters on action click', () => {
        const actionButton = screen.getByText('Action 1');
        fireEvent.click(actionButton);

        expect(mockQueryService.makeQuery).toHaveBeenCalledWith('Action 1', 'text', 'storyboard:presentation', {
            "outline_data": {
                "slides": data.slides
            },
            "selected_conversations": data.selected_conversations
        });
    });
});
