import React from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { ArrowBackIos, ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ReactComponent as OwnerImage } from '../../../assets/img/user-image.svg';

const Downloads = ({ ...props }) => {
    const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';

    const useStyles = makeStyles((theme) => ({
        rootContainer: {
            color: theme.palette.text.default,
            marginTop: 0,
            height: '100%',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '21px',
            fontSize: '2rem',
            background: darkTheme ? '#0C2744' : '#F6F6F6'
        },
        searchBoxContainer: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            background: darkTheme ? '#0C2744' : '#F6F6F6',
            paddingBottom: '3rem'
        },
        title: {
            color: theme.palette.text.default,
            fontSize: '3rem',
            fontStyle: 'normal',
            fontWeight: '300',
            lineHeight: 'normal',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center'
        },
        backIcon: {
            background: darkTheme ? '#1E3E5F' : 'rgba(206, 217, 250, 1)',
            height: '4rem',
            width: '4rem',
            position: 'absolute',
            left: '5rem',
            top: '3rem',
            padding: '1rem 0.5rem 1rem 1rem',
            cursor: 'pointer',
            color: darkTheme ? theme.palette.text.contrastText : '#000'
        },
        iconStyle: {
            height: '4rem',
            width: '4rem',
            padding: '1rem 0.5rem 1rem 1rem',
            cursor: 'pointer',
            color: darkTheme ? theme.palette.text.contrastText : '#000'
        },
        tableStyle: {
            borderRadius: '4px',
            border:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? '1px solid #023973'
                    : 'none',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15);',
            marginTop: '2rem',
            height: '40rem',
            paddingBottom: '1rem',
            overflow: 'scroll',
            scrollY: 'hidden',
            scrollX: 'hidden',
            '&::-webkit-scrollbar-corner': {
                color: 'transparent'
            },
            '&::-webkit-scrollbar-track': {
                marginTop: '1rem'
            }
        },
        tableHeadRow: {
            borderRadius: '3px 3px 0px 0px',
            background: darkTheme ? '#1E3E5F80' : '#E4E7F380'
        },
        fillerRowStyle: {
            height: '30px'
        },
        rowLightStyle: {
            borderBottom: `0.5px solid ${darkTheme ? '#091F3A' : 'rgba(9, 31, 58, 0.30)'}`,
            background: darkTheme ? '#091F3A' : '#F6F6F6'
        },
        tableHeadCell: {
            color: theme.palette.text.default,
            fontSize: '1.42rem',
            fontWeight: '600',
            letterSpacing: '0.11rem',
            border: 'none',
            marginBottom: '3rem',
            height: '4rem',
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            paddingLeft: 0
        },
        tableContentCell: {
            color: theme.palette.text.default,
            fontSize: '1.75rem',
            fontWeight: 300,
            border: 'none',
            textAlign: 'left',
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            paddingLeft: 0,
            '& svg': {
                fill: theme.palette.text.inlineCode
            }
        },
        viewData: {
            color: theme.palette.text.contrastText,
            fontSize: '1.75rem',
            fontWeight: 300,
            border: 'none',
            textAlign: 'left',
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            paddingLeft: 0,
            textDecoration: 'underline',
            cursor: 'pointer'
        },
        tableHolder: {
            borderRadius: '4px',
            border: `1px solid ${darkTheme ? '#142D4B' : '#B6BEC7'}`,
            background: darkTheme ? '#142D4B' : '#F6F6F6',
            padding: '2rem',
            height: 'fit-content',
            marginLeft: '4rem'
        },
        tableHeaderHolder: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        tableHeader: {
            fontWeight: 500,
            lineSpacing: '1px',
            fontSize: '1.75rem'
        },
        rowBlueStyle: {
            borderBottom: `0.5px solid ${darkTheme ? '#1E3E5F30' : 'rgba(9, 31, 58, 0.30)'}`,
            background: darkTheme ? '#1E3E5F30' : '#E4E7F340'
        },
        redTag: {
            color: '#F34F03',
            textAlign: 'center',
            fontSize: '1.25rem',
            lineHeight: '1.3',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            borderRadius: '2px',
            background: '#FFEBDA',
            marginTop: '2rem',
            margiRight: '1rem',
            height: 'fit-content',
            width: 'fit-content'
        },
        greenTag: {
            color: '#018786',
            textAlign: 'center',
            fontSize: '1.25rem',
            lineHeight: '1.3',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            borderRadius: '2px',
            background: darkTheme ? '#E8FAFA' : 'rgba(144, 236, 235, 0.20)',
            marginTop: '2rem',
            marginRight: '1rem',
            height: 'fit-content',
            width: 'fit-content'
        },
        moreTags: {
            marginTop: '1rem',
            color: theme.palette.text.contrastText,
            fontSize: '1.75rem',
            fontStyle: 'normal',
            fontWeight: 400,
            letterSpacing: '0.5px',
            textDecorationLine: 'underline'
        },
        ownerValue: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        ownerIcon: {
            height: '3rem',
            width: '3rem'
        },
        tableRowSelector: {
            fontSize: '2rem',
            display: 'flex',
            gap: '1rem',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        widgetConfigFormControl: {
            color: theme.palette.text.default,
            fontSize: '1.5rem',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        widgetConfigSelect: {
            padding: theme.spacing(1),
            backgroundColor: theme.palette.primary.dark,
            borderRadius: theme.spacing(0.5),
            '& .MuiInput-underline': {
                '&:after': {
                    borderColor: theme.palette.text.default
                },
                '&:before': {
                    borderColor: theme.palette.text.default
                },
                '&:hover:not(.Mui-disabled):before': {
                    borderBottomColor: theme.palette.text.default
                }
            }
        },
        widgetConfigCheckboxLabel: {
            padding: theme.spacing(1),
            color: theme.palette.text.default + ' !important',
            fontSize: '1.5rem'
        },
        arrowUpIcon: {
            height: '3rem',
            width: '3rem',
            color: darkTheme ? theme.palette.text.contrastText : '#000',
            cursor: 'pointer'
        },
        arrowDownIcon: {
            height: '3rem',
            width: '3rem',
            fontSize: '10rem',
            color: darkTheme ? theme.palette.text.contrastText : '#000',
            cursor: 'pointer',
            marginTop: '-2.3rem'
        },
        iconHolder: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0rem'
        },
        tableHeadHolder: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }
    }));
    const classes = useStyles();

    const handleBackClick = () => {
        props.setDSDownload(false);
        props.DS_ClickHandle('Download');
    };
    const modelsViewData = {
        columns: [
            { id: 'Sr.No', name: 'Sr.No', type: 'text' },
            { id: 'Dataset Name', name: 'Dataset Name', type: 'text' },
            { id: 'Description', name: 'Description', type: 'text' },
            { id: 'Region', name: 'Region', type: 'text' },
            { id: 'Tags', name: 'Tags', type: 'tags' },
            { id: 'Owner', name: 'Owner', type: 'owner' },
            { id: 'Download Date', name: 'Download Date', type: 'text' },
            { id: 'Actions', name: 'Actions', type: 'view' }
        ],
        data: [
            {
                value1: '1',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '2',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '3',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '4',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '5',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '6',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '7',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            },
            {
                value1: '8',
                value2: 'E-commerce Sales Data',
                value3: 'We want to view this datasource and...',
                value4: 'India',
                value5: 'Date',
                value6: 'Date',
                value7: '24/09/21',
                value8: 'View Dataset'
            }
        ]
    };
    const renderTableCell = (type, cellData) => {
        switch (type) {
            case 'text':
                return <TableCell className={classes.tableContentCell}>{cellData}</TableCell>;
            case 'column_head':
                return (
                    <TableCell className={`${classes.tableHeadCell}`}>
                        <div className={classes.tableHeadHolder}>
                            {cellData}
                            {cellData != 'Sr.No' && cellData != 'Actions' && (
                                <div className={classes.iconHolder}>
                                    <ArrowDropUp className={classes.arrowUpIcon} />
                                    <ArrowDropDown className={classes.arrowDownIcon} />
                                </div>
                            )}
                            {'    '}
                        </div>
                    </TableCell>
                );
            case 'tags':
                return (
                    <Grid container spacing={1}>
                        <Grid item xs={4} key="tag1" className={classes.greenTag}>
                            {'Finance'}
                        </Grid>
                        <Grid item xs={4} key="tag2" className={classes.redTag}>
                            {'Revenue'}
                        </Grid>
                        <Grid item xs={3} className={classes.moreTags}>
                            +4
                        </Grid>
                    </Grid>
                );
            case 'owner':
                return (
                    <TableCell className={`${classes.tableHeadCell}`}>
                        {' '}
                        <Typography className={classes.ownerValue}>
                            <OwnerImage className={classes.ownerIcon} /> Deepika Singh
                        </Typography>
                    </TableCell>
                );
            case 'view':
                return <TableCell className={classes.viewData}>{cellData}</TableCell>;
        }
    };

    return (
        <div className={classes.rootContainer}>
            <div className={classes.searchBoxContainer}>
                <Typography className={classes.title}>
                    <ArrowBackIos className={classes.backIcon} onClick={handleBackClick} />{' '}
                    Downloads
                </Typography>
            </div>
            <div className={classes.tableHolder}>
                <div className={classes.tableHeaderHolder}>
                    <Typography className={classes.tableHeader}>Downloaded Datasets</Typography>
                </div>
                <TableContainer className={classes.tableStyle}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.tableHeadRow}>
                                {modelsViewData.columns.map((column) => {
                                    return renderTableCell('column_head', column.name);
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modelsViewData.data.map((row, i) => {
                                return (
                                    <TableRow
                                        key={i}
                                        className={
                                            i % 2 == 0
                                                ? classes.rowLightStyle
                                                : classes.rowBlueStyle
                                        }
                                    >
                                        {Object.keys(row).map((cellData, j) => {
                                            return renderTableCell(
                                                modelsViewData.columns[j]['type'],
                                                row[cellData]
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <div className={classes.tableRowSelector}>
                                        <Typography className={classes.tableContentCell}>Rows per page:</Typography>
                                        <FormControl className={clsx(classes.widgetConfigFormControl,classes.widgetConfigSelect)}>
                                            <Select
                                                labelId="dashboard"
                                                id="dashboard"
                                                placeholder={7}
                                                value={7}
                                                label="Age"
                                                classes={{
                                                    icon: classes.iconStyle
                                                }}
                                            >
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                                <MenuItem value={1}>4</MenuItem>
                                                <MenuItem value={2}>5</MenuItem>
                                                <MenuItem value={3}>6</MenuItem>
                                                <MenuItem value={3}>7</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Typography className={classes.tableContentCell}>Page:</Typography>
                                        <ArrowBackIos
                                    className={classes.iconStyle}
                                    onClick={handleBackClick}
                                />
                                  <Typography className={classes.tableContentCell}>1/10</Typography>
                                  <ArrowForwardIos
                                    className={classes.iconStyle}
                                    onClick={handleBackClick}
                                />
                                    </div> */}
            </div>
        </div>
    );
};

export default Downloads;
