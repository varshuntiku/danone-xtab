import { render, screen, fireEvent } from '@testing-library/preact';
import PinnedQuery from '../../../src/component/pinnedQueries/PinnedQuery';
import RootContextProvider from '../../../src/context/rootContext';
import { QueryServiceEvents } from '../../../src/model/Events';

// Mock the context provider
const mockQueryService = {
    eventTarget: {
        dispatchEvent: jest.fn(),
    },
};

const defaultContextValue = {
    queryService: mockQueryService,
    minerva_avatar_url: '',
};

describe('PinnedQuery', () => {
    beforeEach(() => {
        mockQueryService.eventTarget.dispatchEvent.mockClear();
    });

    test('renders with query data', () => {
        const query = {
            input: 'Test Query',
            id: '123',
            pinned: true,
            output: {
                response: 'Test Response'
            }
        };

        render(
            <RootContextProvider value={defaultContextValue}>
                <PinnedQuery
                    // @ts-ignore
                    query={query} />
            </RootContextProvider>
        );

        expect(screen.getByText('Test Query')).toBeTruthy();
        expect(screen.getByText('View in chat')).toBeTruthy();
    });

    test('toggles expand state on button click', () => {
        const query = { input: 'Test Query' };

        const { container } = render(
            <RootContextProvider value={defaultContextValue}>
                <PinnedQuery query={query} />
            </RootContextProvider>
        );

        expect(container.querySelector('.MinervaPinnedQuery-expanded')).toBeNull();

        fireEvent.click(screen.getByTitle('Expand more'));

        expect(container.querySelector('.MinervaPinnedQuery-expanded')).toBeTruthy();
    });

    test('handles View in chat button click', () => {
        const query = { id: '123' };

        render(
            <RootContextProvider value={defaultContextValue}>
                <PinnedQuery query={query} />
            </RootContextProvider>
        );

        fireEvent.click(screen.getByText('View in chat'));
        expect(mockQueryService.eventTarget.dispatchEvent).toHaveBeenCalledWith(QueryServiceEvents.JUMP_TO_QUERY, { detail: { id: '123' } });
    });

    test('renders collapsed view correctly', () => {
        const query = {
            input: 'Test Query',
        };

        render(
            <RootContextProvider value={defaultContextValue}>
                <PinnedQuery query={query} />
            </RootContextProvider>
        );

        expect(screen.getByText('Test Query')).toBeTruthy();
        expect(screen.queryByText('Test Response')).toBeNull();
    });
});
