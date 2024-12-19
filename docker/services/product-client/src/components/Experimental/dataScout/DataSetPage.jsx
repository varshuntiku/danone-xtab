import React, { useState } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { ArrowBackIos, BookmarkBorderOutlined, Bookmark } from '@material-ui/icons';
import ModalComponent from '../../connectedSystem/Intelligence/ModalComponent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ReactComponent as OwnerImage } from '../../../assets/img/user-image.svg';
import { ReactComponent as LockLight } from '../../../assets/img/DS-Lock-Light.svg';
import { ReactComponent as LockDark } from '../../../assets/img/DS-Lock-Dark.svg';
import { Star, StarBorder, StarHalf, LockOutlined } from '@material-ui/icons';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import BookMarks from './BookMarks';
import Downloads from './Downloads';
import DownloadIcon from '@material-ui/icons/GetApp';

const DataSetPage = (props) => {
    const darkTheme = localStorage.getItem('codx-products-theme') == 'dark';
    const useStyles = makeStyles((theme) => ({
        rootContainer: {
            color: theme.palette.text.default,
            margin: 0,
            padding: '2rem',
            height: 'fit-content',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '21px',
            fontSize: '2rem',
            background: darkTheme ? '#0C2744' : '#F6F6F6',
            overflow: 'hidden'
        },
        header: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem'
        },
        backIcon: {
            background: darkTheme ? '#1E3E5F' : 'rgba(206, 217, 250, 1)',
            height: '4rem',
            width: '4rem',
            left: 10,
            padding: '1rem 0.5rem 1rem 1rem',
            top: '50%',
            cursor: 'pointer',
            color: darkTheme ? theme.palette.text.contrastText : '#000'
        },
        dataHeading: {
            fontWeight: 300,
            fontSize: '2.75rem'
        },
        dataDescription: {
            fontWeight: 500,
            fontSize: '2rem',
            marginTop: '2rem'
        },
        description: {
            fontWeight: 400,
            fontSize: '1.75rem',
            marginTop: '1rem',
            width: '40vw',
            color: theme.palette.text.default
        },
        modal: {
            paddingLeft: '2rem'
        },
        descriptionModal: {
            fontWeight: 400,
            fontSize: '1.75rem',
            marginTop: '1rem',
            letterSpacing: '1.5px',
            color: theme.palette.text.default
        },
        dataSetBody: {
            padding: '0rem 2rem',
            marginTop: '2rem'
        },
        redTag: {
            color: '#F34F03',
            textAlign: 'center',
            fontSize: '1.5rem',
            lineHeight: '1.3',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            borderRadius: '2px',
            background: '#FFEBDA',
            marginTop: '2rem',
            marginRight: '1rem',
            height: 'fit-content',
            width: 'fit-content',
            whiteSpace: 'nowrap',
            minWidth: '8rem'
        },
        violetTag: {
            color: 'rgba(134, 79, 221, 1)',
            textAlign: 'center',
            fontSize: '1.5rem',
            lineHeight: '1.3',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            borderRadius: '2px',
            background: darkTheme ? '#D7CCE9' : 'rgba(215, 204, 233, 0.3)',
            marginTop: '2rem',
            marginRight: '1rem',
            height: 'fit-content',
            width: 'fit-content',
            whiteSpace: 'nowrap',
            minWidth: '8rem'
        },
        greenTag: {
            color: '#018786',
            textAlign: 'center',
            fontSize: '1.5rem',
            lineHeight: '1.3',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            borderRadius: '2px',
            background: darkTheme ? '#E8FAFA' : 'rgba(144, 236, 235, 0.20)',
            marginTop: '2rem',
            marginRight: '1rem',
            height: 'fit-content',
            width: 'fit-content',
            whiteSpace: 'nowrap',
            minWidth: '8rem'
        },
        tagContainer: {
            width: '60vw'
        },
        detailsContainer: {
            width: '70vw',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 1,
            marginTop: '2rem'
        },
        detailsHolder: {
            dispay: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: '4rem',
            borderRight: `var(--border-right, 1px solid ${darkTheme ? '#FFF' : 'rgba(0,0,0,0.5)'})`
        },
        attribute: {
            fontWeight: 400,
            fontSize: '1.75rem',
            letterSpacing: '1px'
        },
        value: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '1px'
        },
        ownerValue: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        previewHolder: {
            background: darkTheme ? 'transparent' : 'rgba(219, 223, 234, 0.3)',
            width: '110%',
            height: '40rem',
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        previewHeader: {
            fontWeight: 500,
            fontSize: '2.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        },
        accessText: {
            color: theme.palette.text.contrastText,
            fontWeight: 500,
            fontSize: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.25rem',
            justifyContent: 'center',
            cursor: 'pointer'
        },
        infoText: {
            color: darkTheme ? '#fff' : 'rgba(91, 129, 174, 1)',
            fontWeight: 400,
            fontSize: '1.75rem',
            letterSpacing: '1px',
            marginTop: '0.25rem',
            marginLeft: '0.25rem'
        },
        accessIcon: {
            height: '2rem',
            width: '2rem',
            fill: theme.palette.text.contrastText
        },
        bookmarkIcon: {
            height: '2rem',
            width: '2rem',
            color: darkTheme ? theme.palette.text.contrastText : '#000',
            cursor: 'pointer'
        },
        modalInput: {
            backgroundColor: darkTheme ? '#1E3E5F' : 'rgba(255, 255, 255, 0.7)',
            height: '18rem',
            width: '100%',
            border: 'none',
            padding: '1.5rem 1rem',
            textAlign: 'start',
            color: theme.palette.text.default,
            '&::focus': {
                border: 'none'
            },
            '&::placeholder': {
                color: darkTheme ? '#fff60' : '#00060'
            }
        },
        modalButtonHolder: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
        },
        sendButton: {
            background: darkTheme ? '#979797' : 'black',
            border: `2px solid ${darkTheme ? '#979797' : 'black'}`,
            borderRadius: '3px',
            color: darkTheme ? 'black' : 'white',
            padding: '1rem 2rem'
        },
        sendActiveButton: {
            background: theme.palette.text.contrastText,
            border: `2px solid ${theme.palette.text.contrastText}`,
            borderRadius: '3px',
            color: darkTheme ? 'black' : 'white',
            padding: '1rem 2rem',
            cursor: 'pointer'
        },
        cancelButton: {
            background: darkTheme ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
            border: `2px solid ${theme.palette.text.contrastText}`,
            borderRadius: '3px',
            color: theme.palette.text.contrastText,
            padding: '1rem 2rem',
            cursor: 'pointer'
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
            overflow: 'scroll',
            scrollX: 'hidden',
            paddingBottom: '1rem'
        },
        tableHeadRow: {
            borderRadius: '3px 3px 0px 0px',
            background: darkTheme ? '#1E3E5F80' : '#E4E7F380'
        },
        fillerRowStyle: {
            height: '30px'
        },
        rowLightStyle: {
            borderBottom: `0.5px solid ${darkTheme ? '#142D4B' : 'rgba(9, 31, 58, 0.30)'}`,
            background: darkTheme ? '#142D4B' : '#F6F6F6'
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
            paddingBottom: '1.5rem'
        },
        tableContentCell: {
            color: theme.palette.text.default,
            fontSize: '1.75rem',
            fontWeight: 300,
            border: 'none',
            textAlign: 'left',
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            '& svg': {
                fill: theme.palette.text.inlineCode
            }
        },
        tableHolder: {
            borderRadius: '4px',
            border: `1px solid ${darkTheme ? '#142D4B' : '#B6BEC7'}`,
            background: darkTheme ? '#142D4B' : '#F6F6F6',
            padding: '2rem',
            height: '40rem',
            overflow: 'hidden',
            marginTop: '1rem'
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
        ratingsContainer: {
            display: 'flex',
            gap: '0.25rem'
        },
        ratingIcon: {
            height: '2rem',
            width: '2rem',
            fill: 'rgba(238, 180, 61, 1)'
        },
        ownerIcon: {
            height: '3rem',
            width: '3rem'
        },
        rowBlueStyle: {
            borderBottom: `0.5px solid ${darkTheme ? '#1E3E5F30' : 'rgba(9, 31, 58, 0.30)'}`,
            background: darkTheme ? '#1E3E5F30' : '#E4E7F340'
        },
        bookMarkHolder: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        },
        pending: {
            fontSize: '1.5rem',
            borderRadius: '1.5rem',
            background: '#FFEBDA',
            textTransform: 'capitalize',
            fontWeight: 500,
            color: '#FC9947',
            padding: '0.5rem 1.5rem',
            width: 'fit-content'
        },
        approved: {
            fontSize: '1.5rem',
            borderRadius: '1.5rem',
            background: '#E1FFE7',
            textTransform: 'capitalize',
            fontWeight: 500,
            color: '#2F8D41',
            padding: '0.5rem 1.5rem',
            width: 'fit-content'
        }
    }));
    const data = props.dataPage;
    const classes = useStyles();
    const [popup, setPopup] = useState(false);
    const [access, setAccess] = useState(data?.access || false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({});
    const [status, setStatus] = useState(access || false);
    const [requestInput, setRequestInput] = useState('');
    const [bookMarked, setBookMarked] = useState(data?.bookmark || false);
    const modelsViewData = {
        columns: [
            { id: 'name', name: 'Column Header', type: 'text' },
            { id: 'service_health', name: 'Column Header', type: 'text' },
            { id: 'drift', name: 'Column Header', type: 'text' },
            { id: 'accuracy', name: 'Column Header', type: 'text' }
        ],
        data: [
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' },
            { value1: 'Date', value2: 'Date', value3: 'Date', value4: 'Date' }
        ]
    };

    const renderTableCell = (type, cellData) => {
        switch (type) {
            case 'text':
                return <TableCell className={classes.tableContentCell}>{cellData}</TableCell>;
            case 'column_head':
                return <TableCell className={`${classes.tableHeadCell}`}>{cellData}</TableCell>;
        }
    };
    const sendRequest = () => {
        let newData = [...props.data.allData];
        newData[props.index]['access'] = 'Pending';
        let newObj = { ...props.data };
        newObj.allData = newData;
        props.setData(newObj);
        setAccess('Pending');
        setPopup(false);
        setNotificationOpen(true);
        let notificationNew = {
            message: `View request sent successfully for ${data.heading}`
        };
        setNotification(notificationNew);
        setStatus(true);
        setTimeout(() => {
            let newData = [...props.data.allData];
            newData[props.index]['access'] = 'Approved';
            let newObj = { ...props.data };
            newObj.allData = newData;
            props.setData(newObj);
            setAccess('Approved');
            setNotificationOpen(true);
            let notificationNew = {
                message: `View request grant successfully for “${data.heading}”`
            };
            setNotification(notificationNew);
        }, [10000]);
    };

    const setBookmark = (val) => {
        let newData = [...props.data.allData];
        newData[props.index]['bookmark'] = val;
        setBookMarked(val);
        let newObj = { ...props.data };
        newObj.allData = newData;
        props.setData(newObj);
        setNotificationOpen(true);
        let notificationNew = {
            message: bookMarked
                ? `${data.heading} removed from bookmarks`
                : `${data.heading} added to bookmarks`
        };
        setNotification(notificationNew);
    };

    return (
        <React.Fragment>
            {props.DSDownload && (
                <Downloads
                    params={props.params}
                    setDSDownload={props.setDSDownload}
                    DS_ClickHandle={props.DS_ClickHandle}
                />
            )}
            {props.DsBookmark && (
                <BookMarks
                    params={props.params}
                    setDsBookmark={props.setDsBookmark}
                    DS_ClickHandle={props.DS_ClickHandle}
                    index={props.index}
                    setDataIndex={props.setDataIndex}
                    setData={props.setData}
                    obj={props.data}
                    setDataPage={props.setDataPage}
                    setDSDownload={props.setDSDownload}
                    DSDownload={props.DSDownload}
                    DsBookmark={props.DsBookmark}
                    dataPage={props.dataPage}
                />
            )}
            {!props.DsBookmark && !props.DSDownload && (
                <div className={classes.rootContainer}>
                    <div className={classes.header}>
                        <ArrowBackIos
                            className={classes.backIcon}
                            onClick={() => props.setDataPage(null)}
                        />
                        <Typography className={classes.dataHeading}>{data.heading}</Typography>
                        <div className={classes.bookMarkHolder}>
                            {status && (
                                <Typography
                                    className={
                                        access != 'Approved' ? classes.pending : classes.approved
                                    }
                                >
                                    {access == 'Approved' ? 'Approved' : 'Pending'}
                                </Typography>
                            )}
                            {access == 'Approved' && (
                                <DownloadIcon className={classes.bookmarkIcon} />
                            )}
                            {bookMarked ? (
                                <Bookmark
                                    onClick={() => setBookmark(false)}
                                    className={classes.bookmarkIcon}
                                />
                            ) : (
                                <BookmarkBorderOutlined
                                    onClick={() => setBookmark(true)}
                                    className={classes.bookmarkIcon}
                                />
                            )}
                        </div>
                    </div>
                    <div className={classes.dataSetBody}>
                        <Typography className={classes.dataDescription}>
                            {' '}
                            Data Description
                        </Typography>
                        <Typography className={classes.description}>
                            {data.data_description}
                        </Typography>
                        <Typography className={classes.dataDescription}> Tags</Typography>
                        <Grid container spacing={1} className={classes.tagContainer}>
                            {data.tags.map((val, key) => (
                                <Grid
                                    item
                                    key={`${data.heading}tag${key}`}
                                    className={
                                        val.type == 'green'
                                            ? classes.greenTag
                                            : val.type === 'red'
                                            ? classes.redTag
                                            : classes.violetTag
                                    }
                                >
                                    {val.tag}
                                </Grid>
                            ))}
                        </Grid>
                        <div className={classes.detailsContainer}>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>Region</Typography>
                                <Typography className={classes.value}>INDIA</Typography>
                            </div>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>No Of Columns</Typography>
                                <Typography className={classes.value}>50</Typography>
                            </div>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>No Of Rows</Typography>
                                <Typography className={classes.value}>1000</Typography>
                            </div>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>Last Updated</Typography>
                                <Typography className={classes.value}>Jan 20 , 2023</Typography>
                            </div>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>Dataset Owner</Typography>
                                <Typography className={classes.ownerValue}>
                                    <OwnerImage className={classes.ownerIcon} /> Deepika Singh
                                </Typography>
                            </div>
                            <div className={classes.detailsHolder}>
                                <Typography className={classes.attribute}>
                                    No Of Downloads
                                </Typography>
                                <Typography className={classes.value}>10</Typography>
                            </div>
                            <div
                                style={{ '--border-right': 'none' }}
                                className={classes.detailsHolder}
                            >
                                <Typography className={classes.attribute}>Ratings</Typography>
                                <Typography className={classes.ownerValue}>
                                    <div className={classes.ratingsContainer}>
                                        <Star className={classes.ratingIcon} />
                                        <Star className={classes.ratingIcon} />
                                        <Star className={classes.ratingIcon} />
                                        <StarHalf className={classes.ratingIcon} />
                                        <StarBorder className={classes.ratingIcon} />
                                    </div>
                                    (12)
                                </Typography>
                            </div>
                        </div>
                        <Typography className={classes.dataDescription}> Data Preview</Typography>
                        {access != 'Approved' && (
                            <div className={classes.previewHolder}>
                                <Typography className={classes.previewHeader}>
                                    {' '}
                                    {darkTheme ? <LockDark /> : <LockLight />} To view file preview
                                </Typography>
                                <Typography
                                    className={classes.accessText}
                                    onClick={() => setPopup(true)}
                                >
                                    <LockOutlined className={classes.accessIcon} /> Request Access
                                </Typography>
                                {popup && (
                                    <ModalComponent
                                        openDialogue={popup}
                                        setOpenDialogue={setPopup}
                                        maxWidth={false}
                                        fullScreen={false}
                                        title={'Request Access'}
                                    >
                                        <Grid container spacing={1} className={classes.modal}>
                                            <Grid item xs={4} className={classes.description}>
                                                Dataset
                                            </Grid>
                                            <Grid item xs={8} className={classes.descriptionModal}>
                                                {data.heading}
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} className={classes.modal}>
                                            <Grid item xs={4} className={classes.description}>
                                                Business Justification*
                                            </Grid>
                                            <Grid item xs={8} className={classes.descriptionModal}>
                                                <textarea
                                                    className={classes.modalInput}
                                                    placeholder="Add business justification"
                                                    value={requestInput}
                                                    onChange={(e) =>
                                                        setRequestInput(e.target.value)
                                                    }
                                                    maxlength="256"
                                                />
                                                <Typography className={classes.infoText}>
                                                    Maximum 256 characters
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <div item xs={12} className={classes.modalButtonHolder}>
                                            <button
                                                onClick={() => setPopup(false)}
                                                className={classes.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => sendRequest()}
                                                className={
                                                    requestInput
                                                        ? classes.sendActiveButton
                                                        : classes.sendButton
                                                }
                                            >
                                                Send Request
                                            </button>
                                        </div>
                                    </ModalComponent>
                                )}
                            </div>
                        )}
                        {access == 'Approved' && (
                            <div className={classes.tableHolder}>
                                <div className={classes.tableHeaderHolder}>
                                    <Typography className={classes.tableHeader}>
                                        Sales_data Preview
                                    </Typography>
                                    <Typography className={classes.tableHeader}>
                                        File Size : 12 MB
                                    </Typography>
                                </div>
                                <TableContainer className={classes.tableStyle}>
                                    <Table>
                                        <TableHead>
                                            <TableRow className={classes.tableHeadRow}>
                                                {modelsViewData.columns.map((column) => {
                                                    return renderTableCell(
                                                        'column_head',
                                                        column.name
                                                    );
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
                            </div>
                        )}
                    </div>
                    <CustomSnackbar
                        open={notificationOpen && notification?.message ? true : false}
                        autoHideDuration={
                            notification?.autoHideDuration === undefined
                                ? 3000
                                : notification?.autoHideDuration
                        }
                        onClose={() => setNotificationOpen(false)}
                        severity={notification?.severity || 'datascout'}
                        message={notification?.message}
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default DataSetPage;
