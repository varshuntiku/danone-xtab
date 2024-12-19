import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Typography
} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { useState } from 'react';
import { useCallback } from 'react';
// import CloseIcon from '@material-ui/icons/Close';
import GridTable from './GridTable';

const useStyles = makeStyles((theme) => ({
    dialogRoot: {
        minWidth: '300px',
        width: '800px',
        background: theme.palette.primary.light
    },
    titleRoot: {
        background: theme.palette.primary.dark
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '2rem'
    },
    fontSize2: {
        fontSize: '1.6rem'
    },
    // closeButton: {
    //     cursor: "pointer",
    //     float: "right",
    //     position: "relative",
    //     top: "0.5rem"
    // },
    btn: {
        // borderRadius: "5rem",
        // padding: "0.5rem 2.6rem"
    },
    dilaogContent: {
        // maxHeight: "700px",
        // overflowY: "auto",
        // padding: "2rem 4rem"
    }
}));

function columnToRow(el) {
    let columnType = 'text';
    switch (el.coldef.cellEditor) {
        case 'text':
            columnType = 'text';
            break;
        case 'checkbox':
            columnType = 'checkbox';
            break;
        default:
            columnType = 'text';
    }
    return {
        headerName: el.coldef.headerName,
        columnType: columnType,
        __originalColdef: el.coldef
    };
}

function rowDataToCodef(columnEditorParams, row) {
    const defaultProps = row.__originalColdef ? {} : columnEditorParams.newColdefDefaultProps;
    return {
        ...row.__originalColdef,
        ...defaultProps,
        headerName: row.headerName,
        field: row.headerName,
        cellEditor: row.columnType
    };
}

export default function ColumnEditor({ open, columns, onUpdate, onClose, gridOptions }) {
    const classes = useStyles();
    const [rowData, setRowData] = useState(columns.map((el) => columnToRow(el)));

    const handleUpdate = () => {
        const coldefs = rowData.map(rowDataToCodef.bind(null, gridOptions?.columnEditorParams));
        onUpdate(coldefs);
    };

    const tableParams = {
        coldef: [
            {
                headerName: 'Header Name',
                field: 'headerName',
                cellEditor: 'text',
                cellEditorParams: {
                    variant: 'outlined',
                    fullWidth: true
                },
                editable: true
            },
            {
                headerName: 'Column Type',
                field: 'columnType',
                cellEditor: 'select',
                value: 'text',
                cellEditorParams: {
                    variant: 'outlined',
                    options: gridOptions?.columnEditorParams?.columnEditorOptions || [
                        'text',
                        'checkbox'
                    ],
                    fullWidth: true
                },
                editable: true
            }
        ],
        gridOptions: {
            enableAddRow: true,
            enableInRowDelete: true,
            enableRearrange: true,
            editorMode: true,
            stripeRow: true,
            addRowTooltip: 'Add Column'
        },
        rowData: rowData
    };

    const handleRowDataChange = useCallback((d) => {
        setRowData(d);
    }, []);

    return (
        <>
            <Dialog
                open={open}
                maxWidth="lg"
                classes={{
                    paper: clsx(classes.dialogRoot)
                }}
                aria-labelledby="edit-columns"
                aria-describedby="edit-columns-content"
            >
                <DialogTitle disableTypography className={classes.titleRoot} id="edit-columns">
                    <Typography
                        variant="body1"
                        className={clsx(classes.title, classes.colorDefault, classes.fontSize1)}
                    >
                        {'Edit Columns'}
                    </Typography>
                </DialogTitle>
                <DialogContent className={classes.dilaogContent} id="edit-column-content">
                    <Box flex flexDirection="column">
                        <GridTable params={tableParams} onRowDataChange={handleRowDataChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        className={classes.btn}
                        variant="outlined"
                        size="small"
                        onClick={onClose}
                        aria-label="Cancel"
                    >
                        {'Cancel'}
                    </Button>
                    <Button
                        className={classes.btn}
                        variant="contained"
                        size="small"
                        onClick={handleUpdate}
                        aria-label="Update"
                    >
                        {'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
