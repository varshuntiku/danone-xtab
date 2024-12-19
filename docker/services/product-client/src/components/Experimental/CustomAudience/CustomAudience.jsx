import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Paper } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import GetAppIcon from '@material-ui/icons/GetApp';
import TimelineIcon from '@material-ui/icons/Timeline';
import AddIcon from '@material-ui/icons/Add';
import CustomAudienceForm from './CustomAudienceForm';
import CustomSnackbar from '../../CustomSnackbar';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.details
    },
    card: {},
    title: {
        padding: '1rem',
        color: theme.palette.text.default
    },
    cardTitle: {
        fontSize: '1.7rem',
        fontStyle: 'normal',
        textTransform: 'capitalize'
    },
    cardSubTitle: {
        fontSize: '1.3rem',
        opacity: '0.7',
        letterSpacing: '0.05rem'
    },
    viewOrEdit: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        cursor: 'pointer'
    },
    createIcon: {
        fill: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        marginRight: '1rem',
        marginTop: '0.8rem'
    },
    imgContainer: {
        width: '100%',
        height: '25rem',
        '& img': {
            width: '100%',
            height: '100%',
            padding: '1rem'
        }
    },
    cardBody: {
        marginLeft: '1rem',
        marginRight: '1rem'
    },
    audienceTitle: {
        color: theme.palette.text.default,
        fontSize: '1.3rem',
        opacity: '0.7',
        letterSpacing: '0.05rem'
    },
    audienceNumber: {
        color: theme.palette.text.default,
        fontSize: '1.3rem'
    },
    footerIcon: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '1rem',
        alignItems: 'center',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: theme.palette.primary.contrastText,
        fill: theme.palette.primary.contrastText
    },
    fooIcon: {
        fill: theme.palette.primary.contrastText,
        marginLeft: '2rem',
        marginRight: '1rem'
    },
    line: {
        opacity: '0.3'
    },
    inputConatiner: {
        width: '55%',
        position: 'relative'
    },
    searchInput: {
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.details,
        color: theme.palette.text.default,
        border: 'none',
        borderRadius: '3rem',
        outline: 'none',
        padding: '1.5rem',
        paddingLeft: '3rem',
        paddingRight: '6rem',
        width: '100%',
        marginRight: '2rem'
    },
    searchIcon: {
        position: 'absolute',
        top: '0.9rem',
        right: '2rem',
        fontSize: '3rem',
        opacity: '0.5',
        backgroundColor: 'tranparent'
    },
    createButton: {
        backgroundColor: 'theme.palette.primary.contrastText',
        padding: '1rem',
        marginLeft: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    addIcon: {
        fontSize: '2.2rem',
        marginRight: '.6rem',
        fontWeight: 'bold',
        marginBottom: '.5rem'
    }
}));
export default function CustomAudience({ params }) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [notification, setNotification] = React.useState();
    const [notificationOpen, setNotificationOpen] = React.useState();

    useEffect(() => {
        if (params.cards.length > 0) {
            setData(params.cards);
        }
    }, [params]);

    const handleOnEditClick = (element) => {
        handleIsFormOpen(true);
        setSelectedItem(element);
    };

    const handleIsFormOpen = (value) => {
        if (value === false) {
            setSelectedItem({});
        }
        setIsFormOpen(value);
    };

    const addUpdateData = (newObj, isEditedData) => {
        let existingData = data.map((a) => {
            return { ...a };
        });
        if (!isEditedData) {
            newObj.id = Math.random().toString(16).slice(2);
            setData([newObj, ...existingData]);
        } else {
            var foundIndex = existingData.findIndex((x) => x.id == newObj.id);
            existingData[foundIndex] = newObj;
            setData(existingData);
        }
        handleIsFormOpen(false);
        setNotification({ message: 'Form submitted successfully' });
        setNotificationOpen(true);
    };

    return (
        <React.Fragment>
            {isFormOpen ? (
                <CustomAudienceForm
                    selectedItem={selectedItem}
                    handleIsFormOpen={handleIsFormOpen}
                    addUpdateData={addUpdateData}
                />
            ) : (
                <React.Fragment>
                    <Grid container spacing={2} style={{ marginBottom: '1.5rem' }}>
                        <Grid item xs={6}>
                            {/* <ButtonGroup size="small" aria-label="small outlined button group">
                                <Button variant="contained">Overview</Button>
                                <Button>Projection</Button>
                                <Button>Comparison Analytics</Button>
                            </ButtonGroup> */}
                        </Grid>
                        <Grid item xs={6} container direction="row" justifyContent="flex-end">
                            <div className={classes.inputConatiner}>
                                <input
                                    className={classes.searchInput}
                                    placeholder="Search Custom Audience Name"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <div>
                                    <SearchIcon className={classes.searchIcon} />
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                className={classes.createButton}
                                onClick={() => handleIsFormOpen(true)}
                                aria-label="Create custom audience"
                            >
                                <AddIcon className={classes.addIcon} />
                                Create Custom Audience
                            </Button>
                        </Grid>
                    </Grid>
                    {data.length > 0 && (
                        <Grid container spacing={2}>
                            {data
                                .filter((el) =>
                                    el.title.toLowerCase().includes(searchValue.toLowerCase())
                                )
                                .map((el) => (
                                    <Grid item xs={3} key={el.title}>
                                        <Paper className={classes.paper}>
                                            <div className={classes.card}>
                                                <div className={classes.title}>
                                                    <Grid container spacing={1}>
                                                        <Grid
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-start"
                                                        >
                                                            <div className={classes.cardTitle}>
                                                                {el.title}
                                                            </div>
                                                            <div className={classes.cardSubTitle}>
                                                                {el.subtitle}
                                                            </div>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-end"
                                                        >
                                                            <div
                                                                className={classes.viewOrEdit}
                                                                onClick={() =>
                                                                    handleOnEditClick(el)
                                                                }
                                                            >
                                                                <CreateIcon
                                                                    className={classes.createIcon}
                                                                />
                                                                View / Edit
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <div className={classes.imgContainer}>
                                                    <img src={el.img} alt="custom audience" />
                                                </div>
                                                <div className={classes.cardBody}>
                                                    <Grid container spacing={1}>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-start"
                                                        >
                                                            <div className={classes.audienceTitle}>
                                                                Audienece Size
                                                            </div>
                                                            <div className={classes.audienceNumber}>
                                                                {el.audienceSizeValue}
                                                            </div>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-end"
                                                        >
                                                            <div className={classes.audienceTitle}>
                                                                purchase prospensity
                                                            </div>
                                                            <div className={classes.audienceNumber}>
                                                                {el.purchaseProspensityValue}
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={1}>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-start"
                                                        >
                                                            <div className={classes.audienceTitle}>
                                                                Average Basket Size
                                                            </div>
                                                            <div className={classes.audienceNumber}>
                                                                {el.averageBasketValue}
                                                            </div>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            container
                                                            direction="column"
                                                            alignItems="flex-end"
                                                        >
                                                            <div className={classes.audienceTitle}>
                                                                Purchaase Value
                                                            </div>
                                                            <div className={classes.audienceNumber}>
                                                                {el.purchaseVlaue}
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr className={classes.line} />
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            container
                                                            item
                                                            xs={12}
                                                            direction="row"
                                                            justifyContent="flex-end"
                                                        >
                                                            <div className={classes.footerIcon}>
                                                                <GetAppIcon
                                                                    className={classes.fooIcon}
                                                                />
                                                                Report
                                                            </div>
                                                            <div className={classes.footerIcon}>
                                                                <TimelineIcon
                                                                    className={classes.fooIcon}
                                                                />
                                                                Analyze
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        </Paper>
                                    </Grid>
                                ))}
                        </Grid>
                    )}
                    {/* Snackbar Start */}
                    <CustomSnackbar
                        open={notificationOpen && notification?.message}
                        autoHideDuration={3000}
                        onClose={setNotificationOpen.bind(null, false)}
                        severity={notification?.severity || 'success'}
                        message={notification?.message}
                        link={notification?.link}
                    />
                    {/* Snackbar End */}
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
