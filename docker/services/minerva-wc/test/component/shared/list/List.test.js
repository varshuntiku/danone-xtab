import { fireEvent, render, screen } from '@testing-library/preact';
import List from '../../../../src/component/shared/list/List';

describe('List component tests', () => {
    const mockOnListItemSelect = jest.fn();
    const mockOnSelectAll = jest.fn();
    const mockOnListItemClick = jest.fn();

    const listItems = [
        { id: 1, content: 'Item 1', selected: false },
        { id: 2, content: 'Item 2', selected: false },
    ];

    test('should render list component', () => {
        const { container } = render(
            <List
                listItems={listItems}
                onListItemSelect={mockOnListItemSelect}
                onSelectAll={mockOnSelectAll}
                onListItemClick={mockOnListItemClick}
            />
        );

        expect(screen.getByText('All')).not.toBeNull();
        listItems.forEach(item => {
            expect(screen.getByText(item.content)).not.toBeNull();
        });

        expect(container.querySelector('.MinervaList-items')).not.toBeNull();
    });

    test('should handle list item checkbox change', () => {
        render(
            <List
                listItems={listItems}
                onListItemSelect={mockOnListItemSelect}
                onSelectAll={mockOnSelectAll}
                onListItemClick={mockOnListItemClick}
            />
        );

        const itemCheckbox = screen.getAllByRole('checkbox')[1];
        fireEvent.click(itemCheckbox);

        expect(mockOnListItemSelect).toHaveBeenCalledWith(1);
    });

    test('should handle select all checkbox change', () => {
        render(
            <List
                listItems={listItems}
                onListItemSelect={mockOnListItemSelect}
                onSelectAll={mockOnSelectAll}
                onListItemClick={mockOnListItemClick}
            />
        );

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);

        expect(mockOnSelectAll).toHaveBeenCalledWith(true);
    });

    test('should handle item click', () => {
        render(
            <List
                listItems={listItems}
                onListItemSelect={mockOnListItemSelect}
                onSelectAll={mockOnSelectAll}
                onListItemClick={mockOnListItemClick}
            />
        );

        const itemLink = screen.getByText('Item 1');
        fireEvent.click(itemLink);

        expect(mockOnListItemClick).toHaveBeenCalledWith(1);
    });

    test('should update select all checkbox based on item selection', () => {
        const updatedListItems = [
            { id: 1, content: 'Item 1', selected: true },
            { id: 2, content: 'Item 2', selected: true },
        ];

        render(
            <List
                listItems={updatedListItems}
                onListItemSelect={mockOnListItemSelect}
                onSelectAll={mockOnSelectAll}
                onListItemClick={mockOnListItemClick}
            />
        );

        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        if (selectAllCheckbox instanceof HTMLInputElement) {
            expect(selectAllCheckbox.checked).toBe(true);
        }

        updatedListItems.forEach((item, index) => {
            const itemCheckbox = screen.getAllByRole('checkbox')[index + 1];
            if (itemCheckbox instanceof HTMLInputElement) {
                expect(itemCheckbox.checked).toBe(item.selected);
            }
        });
    });
});
