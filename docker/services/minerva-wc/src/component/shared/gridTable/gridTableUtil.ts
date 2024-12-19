import { nanoid } from "../../../util";
import { ColdefItem, RowDataItem } from "./GridTableModel";

export function processRows(rows: Array<RowDataItem>) {
    const newRows = [...rows];
    newRows.forEach(el => el.__id = nanoid())
    return newRows;
}

export function processColumns(cols: Array<ColdefItem>) {
    const newCols = [...cols]
    newCols.forEach(el => el.__id = nanoid());
    return newCols;
}