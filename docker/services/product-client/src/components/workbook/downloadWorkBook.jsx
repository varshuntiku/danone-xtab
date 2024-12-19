import React, { useState, useContext, useEffect, useRef } from 'react';
// import Workbook from 'react-excel-workbook';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import { ReactComponent as GetApp } from 'assets/img/Download_Ic.svg';
import * as XLSX from 'xlsx';
import { Typography } from '@material-ui/core';
import * as htmlToImage from 'html-to-image';
import { SelectedIndexContext } from 'context/SelectedIndexContext';
import { Button, Checkbox, Paper, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { IconButton, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    downloadWorkbook: {
        position: 'relative'
    },
    downloadButton: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5),
        backgroundColor: 'transparent',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        border: 'none !important',
        borderRadius: '50% !important',
        boxShadow: 'none',
        position: 'relative',
        '& svg': {
            fill: theme.palette.text.default
        },
        // align: 'right',
        '&:hover': {
            opacity: '0.75',
            backgroundColor: theme.palette.background.lightHover,
            color: theme.palette.primary.contrastText,
            borderRadius: '40%',
            boxShadow: 'none'
        }
    },
    downloadButtonActivated: {
        opacity: '0.75',
        backgroundColor: theme.palette.background.lightHover,
        color: theme.palette.primary.contrastText,
        borderRadius: '40%',
        boxShadow: 'none'
    },
    icon: {
        fontSize: '2.5rem'
    },
    link: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.6rem',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    dropDownHolder: {
        border: `1px solid ${
            localStorage.getItem('codx-products-theme') === 'dark' ? '#322937' : '#EEE'
        }`,
        borderRadius: theme.spacing(0.2),
        boxShadow: '0px 2px 2px 0px rgba(151, 151, 151, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '5rem',
        right: '0',
        zIndex: 1000,
        background: `${
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(33, 24, 44, 1)'
                : theme.palette.background.default
        }`,
        width: 'max-content'
    },
    downloadButtonSingleTable: {
        padding: theme.spacing(0.8),
        minWidth: theme.spacing(5),
        backgroundColor: 'transparent',
        border: '1px solid ' + theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.75',
            backgroundColor: theme.palette.primary.light,
            border: '1px solid ' + theme.palette.primary.contrastText,
            color: theme.palette.primary.contrastText
        }
    },
    dropDownValue: {
        color: theme.palette.text.default,
        fontSize: '1.8rem',
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        cursor: 'pointer',
        padding: '1rem 1rem 1rem 1rem ',
        background: `${
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(33, 24, 44, 1)'
                : theme.palette.background.white
        }`,
        '&:hover': {
            backgroundColor: theme.palette.background.lightHover,
            color: theme.palette.text.default
        }
    },
    dropDownValue2: {
        color: theme.palette.text.default,
        fontSize: '1.8rem',
        fontWeight: theme.title.h1.fontWeight,
        fontFamily: theme.body.B1.fontFamily,
        cursor: 'pointer',
        padding: '1rem 1rem 1rem 1rem ',
        background: `${
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(33, 24, 44, 1)'
                : theme.palette.background.white
        }`,
        '&:hover': {
            backgroundColor: theme.palette.background.lightHover,
            color: theme.palette.text.default
        }
    },
    paperVisible: {
        position: 'absolute',
        top: '3.4rem',
        right: '-1rem',
        zIndex: 3,
        padding: '1.7rem',
        width: 'auto',
        minWidth: '28rem',
        border: '1px solid ' + theme.palette.border.colorWithOpacity
    },
    columnSelection: {
        color: theme.palette.text.default,
        fontSize: '1.3rem'
    },
    columnDiv: {
        display: 'flex',
        gap: '1rem'
    },
    formControlLabel: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '2rem'
    },
    rowDiv: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '2rem'
    },
    radioGroupDiv: {
        marginBottom: '1.2rem'
    },
    downloadFiletable: {
        position: 'relative'
    },
    rowIndexdiv: {
        display: 'flex'
    },
    label: {
        fontSize: '1.3rem',
        fontWeight: '520'
    },
    downloadButtonDiv: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
}));

// function WorkSheet(tableData) {
//     return (
//         <Workbook.Sheet
//             data={JSON.parse(tableData.table_data)}
//             name={tableData.SheetName ? tableData.SheetName : 'Chart Data'}
//         >
//             {tableData.table_headers.map((item) => (
//                 <Workbook.Column label={item.label} value={(row) => row[item.id]} key={item} />
//             ))}
//         </Workbook.Sheet>
//     );
// }

/**
 * Downloads the on-screen data in a tabular format as an excel file
 * @summary The visual data on the screen is passed to the function as props where it is converted to an xlsx format excel file which can be downloaded from the download button.
 * It can be used where we want the visual data in a tabular form as a downloadable excel file
 * JSON:
 * {
 *   "sheet_name": <Name of sheet in downlaoded excel>,
 *    "table_data": <json format of table orient records>,
 *     "table_headers":  {
 *                           "id": <id/key name>,
 *                           "label": <label shown as column name in downloaded sheet>
 *                         }
 *    }
 * @param {object} props - {tableData, filename }
 */

export default function DownloadWorkBook({ tableData, filename, isLink, isButton, ...props }) {
    const classes = useStyles();
    const [isPaperVisible, setPaperVisible] = useState(false);
    const [fileType, setFileType] = useState('xlsx');
    const [downloadSelected, setDownloadSelected] = useState(false);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [parsedTableArray, setParsedTableArray] = useState([]);
    const { selectedCheckColumn, toggleCheckedColumn, setSelectedCheckColumn } =
        useContext(SelectedIndexContext);
    const containerRef = useRef(null);
    const hasMounted = useRef(false);

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setPaperVisible(false);
        }
    };

    useEffect(() => {
        const rawData = tableData?.table_data;
        document.addEventListener('mousedown', handleClickOutside);

        if (typeof rawData === 'string') {
            try {
                const parsedArray = JSON.parse(rawData);
                setParsedTableArray(parsedArray);

                const headers = Object.keys(parsedArray[0]);
                setTableHeaders(headers);
                if (!hasMounted.current) {
                    const allColumns = new Set(headers.map((_, index) => index));
                    setSelectedCheckColumn(allColumns);
                    hasMounted.current = true;
                }
            } catch (error) {
                console.error('Error parsing table data', error);
            }
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [tableData, setSelectedCheckColumn]);

    const filteredData = parsedTableArray.map((row) => {
        let filteredRow = {};
        tableHeaders.forEach((header, index) => {
            if (selectedCheckColumn.has(index)) {
                filteredRow[header] = row[header];
            }
        });
        return filteredRow;
    });

    const isDownloadDisabled = selectedCheckColumn.size === 0;
    const toggleSelectAll = () => {
        if (selectedCheckColumn.size === tableHeaders.length) {
            setSelectedCheckColumn(new Set());
        } else {
            const allColumns = new Set(tableHeaders.map((_, index) => index));
            setSelectedCheckColumn(allColumns);
        }
    };

    const downloadData = (fileName, selectedFileType) => {
        setDownloadSelected(!downloadSelected);
        const workbook = XLSX.utils.book_new();
        fileName = fileName || 'TableData';

        try {
            if (selectedFileType === 'xlsx') {
                const worksheet = XLSX.utils.json_to_sheet(filteredData);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
                XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
            } else if (selectedFileType === 'csv') {
                const worksheet = XLSX.utils.json_to_sheet(filteredData);
                const csvContent = XLSX.utils.sheet_to_csv(worksheet);

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `${fileName}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error(`Unknown file type selected: ${selectedFileType}`);
            }
        } catch (err) {
            console.error('Download error', err);
        }
    };

    const handleFileTypeChange = (event) => {
        setFileType(event.target.value);
    };

    const togglePaperVisibility = () => {
        setPaperVisible(!isPaperVisible);
    };

    const download = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    const downloadImage = () => {
        setDownloadSelected(!downloadSelected);
        setPaperVisible(false);
        htmlToImage.toPng(document.getElementById(props.nodeId)).then(function (dataUrl) {
            download(dataUrl, props?.downloadImageName || `graphImage.png`);
        });
    };

    const downloadClick = () => {
        if (props.hideImageData) {
            downloadData(filename, fileType);
        } else {
            setDownloadSelected(!downloadSelected);
        }
    };

    let button = (
        <div className={` ${classes.downloadWorkbook}`}>
            {tableData?.type === 'string' ? (
                <div ref={containerRef}>
                    <Tooltip title={<h1>Download File</h1>}>
                        <IconButton
                            aria-label="download"
                            className={` ${classes.downloadButton}`}
                            disabled={
                                props.hideImageData ? !tableData : !tableData && !props.imageData
                            }
                            onClick={togglePaperVisibility}
                        >
                            <GetApp fontSize="large" color="inherit" />
                        </IconButton>
                    </Tooltip>

                    {isPaperVisible && (
                        <Paper
                            elevation={3}
                            className={`${classes.paperVisible}`}
                            style={{ width: 'auto' }}
                        >
                            <h3 className={`${classes.columnSelection}`}>Select Columns:</h3>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedCheckColumn.size === tableHeaders.length}
                                        onChange={toggleSelectAll}
                                        indeterminate={
                                            selectedCheckColumn.size > 0 &&
                                            selectedCheckColumn.size < tableHeaders?.length
                                        }
                                    />
                                }
                                label="Select All"
                                classes={{ label: classes.label }}
                            />

                            <div className={`${classes.columnDiv}`}>
                                {Array.from(
                                    { length: Math.ceil(tableHeaders.length / 4) },
                                    (_, rowIndex) => (
                                        <div key={rowIndex} className={`${classes.rowIndexdiv}`}>
                                            {Array.from({ length: 2 }, (_, groupIndex) => {
                                                const startIndex = rowIndex * 4 + groupIndex * 2;
                                                const groupColumns = tableHeaders.slice(
                                                    startIndex,
                                                    startIndex + 2
                                                );
                                                return (
                                                    <div
                                                        key={groupIndex}
                                                        className={`${classes.formControlLabel}`}
                                                    >
                                                        {groupColumns.map((header, index) => {
                                                            const columnIndex = startIndex + index;
                                                            return (
                                                                <FormControlLabel
                                                                    key={header}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={selectedCheckColumn.has(
                                                                                columnIndex
                                                                            )}
                                                                            onChange={() =>
                                                                                toggleCheckedColumn(
                                                                                    columnIndex
                                                                                )
                                                                            }
                                                                        />
                                                                    }
                                                                    label={header}
                                                                    classes={{
                                                                        label: classes.label
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                )}
                            </div>

                            <h3 className={classes.columnSelection}>Select File Type:</h3>
                            <div className={classes.radioGroupDiv}>
                                <RadioGroup value={fileType} onChange={handleFileTypeChange}>
                                    <FormControlLabel
                                        value="xlsx"
                                        control={<Radio />}
                                        label="Download as Excel"
                                        classes={{ label: classes.label }}
                                    />
                                    <FormControlLabel
                                        value="csv"
                                        control={<Radio />}
                                        label="Download as CSV"
                                        classes={{ label: classes.label }}
                                    />
                                </RadioGroup>
                            </div>

                            <div className={classes.downloadButtonDiv}>
                                <Button
                                    onClick={downloadClick}
                                    color="primary"
                                    variant="contained"
                                    className={classes.downloadButtonSingleTable}
                                    disabled={isDownloadDisabled}
                                >
                                    Download
                                </Button>
                            </div>
                        </Paper>
                    )}
                </div>
            ) : (
                <div>
                    <Button
                        title="Download CSV"
                        className={` ${classes.downloadButton} ${
                            downloadSelected && classes.downloadButtonActivated
                        }`}
                        disabled={props.hideImageData ? !tableData : !tableData && !props.imageData}
                        onClick={downloadClick}
                        aria-label="Download CSV"
                    >
                        <GetApp fontSize="large" color="inherit" />
                    </Button>

                    {downloadSelected && !props.hideImageData && (
                        <div className={classes.dropDownHolder}>
                            {tableData && (
                                <Typography
                                    onClick={() => downloadData(filename, tableData)}
                                    className={classes.dropDownValue}
                                >
                                    Download as Data
                                </Typography>
                            )}
                            {!props.hideImageData && (
                                <Typography
                                    className={classes.dropDownValue2}
                                    onClick={() => downloadImage()}
                                >
                                    Download as Image
                                </Typography>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    if (isLink) {
        button = (
            <Link
                to="#"
                title={props.text || 'Download'}
                className={clsx({ [classes.link]: true })}
                disabled={!tableData}
                onClick={() => downloadData(filename, fileType)}
            >
                {props.text || 'Download'}
            </Link>
        );
    } else if (isButton) {
        return (
            <Button
                endIcon={<GetApp fontSize="large" />}
                size={props.size}
                title={props.text || 'Download'}
                variant={props.variant || 'outlined'}
                disabled={!tableData}
                onClick={() => downloadData(filename, fileType)}
                aria-label={props.text || 'Download'}
            >
                {props.text || 'Download'}
            </Button>
        );
    }

    if (tableData || props.imageData) {
        return <>{button}</>;
    } else {
        return null;
    }
}
