/** @jsx h */
import { h } from 'preact';
import { render, fireEvent, waitFor } from '@testing-library/preact';
import RecommendationBox from '../../../../src/component/queryOutput/widgetOutput/widgets/queryInfoView/RecommendationBox';

// Mock the useDisableUserInput hook
jest.mock('../../../../src/util/useDisableUserInput', () => jest.fn());

describe('RecommendationBox Component', () => {
    const mockData = {
        title: 'Recommendation Title',
        enableCopyButton: true,
        items: ['Item 1', 'Item 2', 'Item 3']
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the component with title and items', () => {
        const { getByText } = render(<RecommendationBox data={mockData} />);

        expect(getByText('Recommendation Title')).toBeTruthy();
        mockData.items.forEach(item => {
            expect(getByText(item)).toBeTruthy();
        });
    });

    test('should render copy button when enabled', () => {
        const { getByText } = render(<RecommendationBox data={mockData} />);
        expect(getByText('Copy')).toBeTruthy();
    });

    test('should not render copy button when disabled in data', () => {
        const modifiedData = { ...mockData, enableCopyButton: false };
        const { queryByText } = render(<RecommendationBox data={modifiedData} />);

        expect(queryByText('Copy')).not.toBeTruthy();
    });
});
