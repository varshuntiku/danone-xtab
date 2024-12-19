export type GridTableParams = {
    coldef: Array<ColdefItem>,
    rowData: Array<RowDataItem>,
    gridOptions: GridOption,
    disabled: boolean,
    onChange?: (rows: Array<RowDataItem>)=>{}
    onOuterAction?: (parma: OuterActionParams) => {}
}

export type OuterActionParams = {
    button: {
        text?: string,
        name?: string,
        variant?: string,
        size?: string
    },
    rows: Array<RowDataItem>,
    columns: Array<ColdefItem>
}

export type ColdefItem = {
    headerName: string,
    field: string,
    editable: boolean,
    cellRenderer: string,
    cellEditor: string,
    cellEditorParams: any,
    align: string
    __id?: string
}

export type RowDataItem = {
    [key: string]: any,
    __id?: string
}

export type GridOption = any