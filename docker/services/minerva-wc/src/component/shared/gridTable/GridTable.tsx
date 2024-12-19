import { Context, createContext } from "preact";
import { ColdefItem, GridTableParams, RowDataItem } from "./GridTableModel"
import "./gridTable.scss";
import { useCallback, useContext, useState } from "preact/hooks";
import Input from "./cellEditors/input/Input";
import { processColumns, processRows } from "./gridTableUtil";
import Select from "./cellEditors/select/Select";
import { buttonVariantToClass } from "../../../util";

const GridTablePropsContext: Context<GridTableParams> = createContext(null);

export default function GridTable({onChange, onOuterAction, ...props}: GridTableParams) {
    const [columns, setColumns] = useState(() => processColumns(props?.coldef));
    const [rows, setRows] = useState(() => processRows(props?.rowData));
    const {gridOptions, disabled} = props || {};
    const handleCellValueChange = useCallback((value: any, row: RowDataItem, column: ColdefItem) => {
        if (column?.field) {
            row[column.field] = value;
        }
        if (onChange) {
            onChange(rows);
        }
        setRows([...rows])
    }, []);

    const handleOuterAction = (el) => {
        onOuterAction({button: el, rows, columns})
    }

    return (<GridTablePropsContext.Provider value={props}>
        <div className="MinervaGridTableRoot">
            <div className="MinervaGridTableWrapper">
                <table>
                    <thead>
                        <HeaderColumns columns={columns}></HeaderColumns>
                    </thead>
                    <tbody>
                        <TableRows rows={rows} columns={columns} onCellValueChange={handleCellValueChange}/>
                    </tbody>
                </table>
            </div>
            <OuterActions gridOptions={gridOptions} onAction={handleOuterAction} disabled={disabled} />
        </div>
    </GridTablePropsContext.Provider>)
}

function HeaderColumns({columns}: {columns: Array<ColdefItem>}) {
    return <tr>
        {columns?.map(col => (
            <HeaderColumn column={col} key={col?.__id} />
        ))}
    </tr>
}

function HeaderColumn({column}: {column: ColdefItem}) {
    return <th style={{"--align": column?.align}}>
        <span className="MinervaTypo-body2">{column?.headerName}</span>
    </th>
}

function TableRows({rows, columns, onCellValueChange}: {rows: Array<RowDataItem>, columns: Array<ColdefItem>, onCellValueChange}) {
    return <>
        {rows?.map((row) => (
            <tr key={row?.__id}>
                {columns?.map((col) => (
                    <TableData key={row?.__id + " " + col?.__id} row={row} col={col} onCellValueChange={onCellValueChange} />
                ))}
            </tr>
        ))}
    </>
}

function TableData({row, col, onCellValueChange}: {row: RowDataItem, col: ColdefItem, onCellValueChange}) {
    return <td style={{"--align": col?.align}}>
        {col?.editable ?
        <CellEditor row={row} col={col} onValueChange={(v) => onCellValueChange(v, row, col)} />
        : <CellRenderer row={row} col={col} />
        }
    </td>
}

function CellEditor({row, col, onValueChange}: {row: RowDataItem, col: ColdefItem, onValueChange}) {
    const data = row?.[col?.field];
    const {disabled} = useContext(GridTablePropsContext) || {};
    switch (col?.cellEditor) {
        case 'input':
            return <Input value={data} onChange={onValueChange} disabled={disabled} fullWidth {...col?.cellEditorParams} />
        case 'select':
            return <Select value={data} onChange={onValueChange} disabled={disabled} fullWidth {...col?.cellEditorParams} />
        default:
            return null;
    }
}

function CellRenderer({row, col}: {row: RowDataItem, col: ColdefItem}) {
    const data = row?.[col?.field];
    switch (col?.cellRenderer) {
        case 'text':
            return <span>{data}</span>
        default:
            return null;
    }
}

function OuterActions({gridOptions, onAction, disabled=false}) {
    return <div className="MinervaGridTable-outeraction">
    {gridOptions?.outerActions?.map((el, i) => {
        if (!el) {
            return <div style={{flex: 1}} key={i+"null"}></div>
        }
        return (<button
            key={(el?.label || el?.name) + i}
            className={buttonVariantToClass(el?.variant, el?.size)}
            onClick={() => {
                onAction(el);
            }}
            disabled={disabled}
        >
            {el?.text || el?.name}
        </button>)
    })}
    </div>
}