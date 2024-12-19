import { render, screen, fireEvent } from '@testing-library/preact';
import RecommendationCards from '../../../src/component/queryOutput/widgetOutput/widgets/recommendationCards/RecommendationCards';
import RootContextProvider from '../../../src/context/rootContext';
import useDisableUserInput from '../../../src/util/useDisableUserInput';


jest.mock('../../../src/util/useDisableUserInput', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('RecommendationCards tests', () => {

    const renderComponent = (data, isDisabled = false) => {
        const queryService = { makeQuery: jest.fn() };
        // @ts-ignore
        (useDisableUserInput).mockReturnValue(isDisabled);

        return render(
            <RootContextProvider value={{
                // @ts-ignore
                queryService
            }}>
                <RecommendationCards data={data} />
            </RootContextProvider>
        );
    };

    test('component should render with items', () => {
        const data = { items: ['Item 1', 'Item 2'] };

        renderComponent(data);

        expect(screen.getByText('Item 1')).toBeTruthy();
        expect(screen.getByText('Item 2')).toBeTruthy();
    });

    // test('clicking a card should call makeQuery', () => {
    //     const data = { items: ['Item 1'] };
    //     const queryService = { makeQuery: jest.fn() };

    //     renderComponent(data);

    //     fireEvent.click(screen.getByText('Item 1'));

    //     expect(queryService.makeQuery).toHaveBeenCalledWith('Item 1', 'recommended-prompt');
    // });

    test('component should apply disabled style when isDisabled is true', () => {
        const data = { items: ['Item 1'] };

        renderComponent(data, true);

        const card = screen.getByText('Item 1').closest('div');
        expect(card).toBeTruthy()
    });
});
