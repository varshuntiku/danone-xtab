import React from 'react';
import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    alpha,
    makeStyles,
    Typography
} from '@material-ui/core';
import GridTable from '../gridTable/GridTable';
import { useEffect } from 'react';
import CodxCircularLoader from '../CodxCircularLoader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiAccordion-root': {
            '&:hover': {
                opacity: 1,
                backgroundColor: 'none'
            }
        }
    },
    rootSection: {
        '&:before': {
            height: 0
        }
    },
    rootSectionSummary: {
        background: theme.palette.primary.light,
        border: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        color: theme.palette.text.default,
        position: 'sticky',
        top: 0,
        zIndex: 3
    },
    rootSectionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem',
        paddingRight: '1rem',
        marginBottom: '2rem',
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        borderTop: 0,
        flexDirection: 'column'
    },
    accordionHeaderName: {
        color: theme.palette.text.default,
        fontWeight: 500
    },
    accordionRoot: {
        '&:before': {
            height: 0
        }
    },
    accordionSummary: {
        borderTop: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        background: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.background.hover
        }
    },
    accordionDetails: {
        paddingTop: '1rem',
        paddingBottom: '1rem'
    },
    confirmationError: {
        top: '-12px',
        position: 'relative',
        width: '100%',
        fontSize: '1.4rem',
        color: red[500]
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    actionsStyle: {
        postion: 'relative',
        overflow: 'hidden',
        paddingLeft: '24px !important',
        paddingRight: '24px !important'
    }
}));

export default function CodxAccordion({ params, onFetchTableData }) {
    const classes = useStyles();
    const [data, setData] = useState(params);
    const [expanded, setExpanded] = React.useState(params.expanded);
    return (
        <div className={classes.root}>
            <div style={{ maxHeight: data.extraParams?.maxHeight, overflow: 'auto' }}>
                {data?.sections?.map((el) => (
                    <Section
                        key={el.name}
                        data={el}
                        tableData={data.tableData}
                        tableConfig={el.tableConfig}
                        expanded={el.name === expanded}
                        classes={classes}
                        onFetchTableData={onFetchTableData}
                        onDataChange={(e) => {
                            Object.assign(el, e);
                            setData({ ...data });
                        }}
                        onOpenChange={() => setExpanded((e) => (e !== el.name ? el.name : false))}
                    />
                ))}
            </div>
        </div>
    );
}

function Section({
    data,
    tableData,
    tableConfig,
    expanded,
    classes,
    onDataChange,
    onOpenChange,
    onFetchTableData
}) {
    const [tableParams, setTableParams] = useState({ ...tableConfig, ...tableData });
    const [loading, setLoading] = useState(true);
    const { lazyLoadTableData } = data;

    const onDataLoad = (e) => {
        data.tableData = e;
        onDataChange(e);
    };

    useEffect(() => {
        const loadData = async function () {
            if (data.lazyLoadTableData && !data.tableData) {
                try {
                    const resp = await onFetchTableData({
                        actionType: data.lazyLoadTableData,
                        data
                    });
                    setTableParams((s) => ({ ...s, ...resp }));
                    onDataLoad(resp);
                } catch (err) {
                    // console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadData();
    }, [lazyLoadTableData, tableData, onFetchTableData, data, onDataLoad]);

    return (
        <Accordion className={classes.rootSection} expanded={expanded} onChange={onOpenChange}>
            <AccordionSummary
                className={classes.rootSectionSummary}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography variant="h4">{data?.name}</Typography>
            </AccordionSummary>

            {expanded ? (
                <AccordionDetails className={classes.rootSectionDetails}>
                    <Typography
                        variant="h5"
                        style={{ width: '100%' }}
                        className={classes.accordionHeaderName}
                        gutterBottom
                    >
                        {data?.accordionHeaderName}
                    </Typography>
                    <div style={{ width: '100%' }}>
                        {data?.tableData ? (
                            <div>
                                {loading ? (
                                    <CodxCircularLoader center size={90} />
                                ) : (
                                    <GridTable
                                        params={tableParams}
                                        onRowDataChange={(e) => {
                                            data.tableData.rowData = e;
                                            onDataChange(data);
                                        }}
                                        onAction={() => {}}
                                    />
                                )}
                            </div>
                        ) : null}
                    </div>
                </AccordionDetails>
            ) : null}
        </Accordion>
    );
}
