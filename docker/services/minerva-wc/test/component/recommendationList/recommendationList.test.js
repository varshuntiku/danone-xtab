import { render, screen, fireEvent } from '@testing-library/preact';
import RecommendationList from '../../../src/component/queryOutput/widgetOutput/widgets/recommendationList/RecommendationList';
import { RootContext } from '../../../src/context/rootContext';
import RootContextProvider from '../../../src/context/rootContext';
import useDisableUserInput from '../../../src/util/useDisableUserInput';
import { h } from 'preact';

// Mock the useDisableUserInput hook
jest.mock('../../../src/util/useDisableUserInput', () => ({
    __esModule: true,
    default: jest.fn()
}));

// Mock context provider values
const mockQueryService = {
    makeQuery: jest.fn()
};

describe('RecommendationList', () => {
    beforeEach(() => {

        mockQueryService.makeQuery.mockClear();
        // @ts-ignore
        (useDisableUserInput).mockReturnValue(false); // Default to enabled
    });

    test('renders without data', () => {
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{}} />
            </RootContextProvider>
        );
        expect(screen.queryByText('RecommendationList-title')).toBeNull();
        expect(screen.queryByText('RecommendationList-content')).toBeNull();
    });

    test('renders with title', () => {
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ title: 'Test Title', items: [] }} />
            </RootContextProvider>
        );
        expect(screen.getByText('Test Title')).toBeTruthy();
    });

    test('renders with items', () => {
        const items = ['Item 1', 'Item 2'];
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ items }} />
            </RootContextProvider>
        );
        items.forEach(item => {
            expect(screen.getByText(item)).toBeTruthy();
        });
    });

    test('handles item click', () => {
        const items = ['Item 1'];
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ items }} />
            </RootContextProvider>
        );
        fireEvent.click(screen.getByText('Item 1'));
        expect(mockQueryService.makeQuery).toHaveBeenCalledWith('Item 1', 'text', 'recommended-followup');
    });

    test('handles key press event', () => {
        const items = ['Item 1'];
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ items }} />
            </RootContextProvider>
        );
        fireEvent.keyPress(screen.getByText('Item 1'), { key: 'Enter', code: 13 });
        expect(mockQueryService.makeQuery).toHaveBeenCalledWith('Item 1', 'text', 'recommended-followup');
    });

    test('applies disabled styling when isDisabled is true', () => {
        // @ts-ignore
        (useDisableUserInput).mockReturnValue(true);
        const items = ['Item 1'];
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ items }} />
            </RootContextProvider>
        );
        expect(screen.getByText('Item 1').parentElement.className.includes('RecommendationList-disabledItem')).toBe(true);
    });

    test('does not apply disabled styling when isDisabled is false', () => {
        // @ts-ignore
        (useDisableUserInput).mockReturnValue(false);
        const items = ['Item 1'];
        render(
            <RootContextProvider value={{ queryService: mockQueryService }}>
                <RecommendationList data={{ items }} />
            </RootContextProvider>
        );
        expect(screen.getByText('Item 1').parentElement.className.includes('RecommendationList-disabledItem')).toBe(false);
    });
});
