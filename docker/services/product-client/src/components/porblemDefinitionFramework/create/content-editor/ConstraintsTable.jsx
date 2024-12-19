import React from 'react';
import { makeStyles } from '@material-ui/core';
import GridTable from '../../../gridTable/GridTable';
import InfoPopper from '../InfoPopper';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        '& .MuiTableContainer-root': {
            backgroundColor: theme.palette.primary.main
        },
        '& .pd-constraints-type-cell': {
            borderRight: '4px solid ' + theme.palette.primary.dark + ' !important',
            paddingLeft: '6.5rem'
        },
        '& .pd-constraints-type-header': {
            paddingLeft: '6.5rem'
        },
        '& .MuiTableCell-root': {
            fontSize: '1.8rem'
        },
        '& .rdw-editor-wrapper': {
            minHeight: '10.3rem'
        }
    }
}));

export default function ConstraintsTable({ params, onChange }) {
    const classes = useStyles();
    const tableParams = params.tableParams;
    const coldef = [
        {
            headerName: 'Type',
            field: 'type',
            width: '33rem',
            cellClassName: 'pd-constraints-type-cell',
            headerClassName: 'pd-constraints-type-header',
            cellParamsField: 'typeParams',
            cellRenderer: ({ params }) => {
                return (
                    <>
                        {params.value}
                        {params.info ? (
                            <InfoPopper
                                {...params?.info}
                                size="large"
                                style={{
                                    marginLeft: '1rem',
                                    position: 'relative',
                                    top: '-1pt'
                                }}
                            />
                        ) : null}
                    </>
                );
            }
        },
        {
            headerName: 'Describe the constraints under which we are working (if any)',
            field: 'desc',
            cellEditor: 'rich-text',
            cellParamsField: 'descParams',
            editable: true
        }
    ];
    tableParams.coldef = coldef;
    return (
        <div aria-label="Grid Layout editor root" className={classes.root}>
            {params?.info ? (
                <InfoPopper
                    {...params?.info}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        left: '24px',
                        transform: 'translate(4px, 2px)',
                        zIndex: 3
                    }}
                />
            ) : null}
            <GridTable
                params={tableParams}
                onRowDataChange={(e) => {
                    onChange(e);
                }}
            />
        </div>
    );
}
