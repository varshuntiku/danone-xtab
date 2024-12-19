import { render, screen, fireEvent } from "@testing-library/preact";
import GridTable from "../../../../src/component/shared/gridTable/GridTable";
import Select from "../../../../src/component/shared/gridTable/cellEditors/select/Select";

jest.mock("../../../../src/component/shared/gridTable/cellEditors/input/Input", () => ({ value, onChange, disabled }) => (
    // @ts-ignore
    <input value={value} onChange={e => onChange(e.target.value)} disabled={disabled} />
));

jest.mock("../../../../src/component/shared/gridTable/cellEditors/select/Select", () => ({ value, onChange, disabled }) => (
    <select value={value} onChange={e => onChange(e.target.
        // @ts-ignore
        value)} disabled={disabled}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
    </select>
));

const defaultColumns = [
    { __id: 'col1', field: 'name', headerName: 'Name', editable: true, cellEditor: 'input', align: 'left' },
    { __id: 'col2', field: 'type', headerName: 'Type', editable: true, cellEditor: 'select', align: 'left' },
    { __id: 'col3', field: 'description', headerName: 'Description', align: 'left' }
];

const defaultRows = [
    { __id: 'row1', name: 'Row 1', type: 'option1', description: 'Description 1' },
    { __id: 'row2', name: 'Row 2', type: 'option2', description: 'Description 2' }
];

const defaultProps = {
    coldef: defaultColumns,
    rowData: defaultRows,
    gridOptions: {
        outerActions: [{ name: 'action1', text: 'Action 1', variant: 'primary', size: 'medium' }]
    },
    onChange: jest.fn(),
    onOuterAction: jest.fn(),
    disabled: false
};

describe("GridTable", () => {

    test("handles outer action button click", () => {
        // @ts-ignore
        render(<GridTable {...defaultProps} />);

        fireEvent.click(screen.getByText("Action 1"));
        expect(defaultProps.onOuterAction).toHaveBeenCalledWith({
            button: { name: 'action1', text: 'Action 1', variant: 'primary', size: 'medium' },
            rows: defaultProps.rowData,
            columns: defaultProps.coldef
        });
    });
});
