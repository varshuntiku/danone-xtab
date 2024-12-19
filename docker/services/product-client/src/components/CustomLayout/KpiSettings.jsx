import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    makeStyles
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/CloseOutlined';
import Layouts_Horizontal from 'assets/img/Layouts_Horizontal.jpg';
import Layouts_Vertical from 'assets/img/Layouts_Vertical.jpg';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '3rem'
    },
    section: {
        marginBottom: theme.spacing(4)
    },
    control: {
        display: 'flex',
        alignItems: 'left',
        flexDirection: 'column',
        marginTop: '2rem',
        position: 'relative'
    },
    buttonGroup: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '0.5rem'
    },
    input: {
        minWidth: 120,
        '& .MuiInputBase-root': {
            color: theme.palette.text.default,
            borderBottom: `1px solid ${theme.palette.text.default}`
        },
        '& .MuiInputBase-input': {
            borderBottom: `1px solid ${theme.palette.text.default}`
        }
    },
    infoIcon: {
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    },
    infoContainer: {
        position: 'absolute',
        width: '40rem',
        height: 'auto',
        background: theme.palette.background.modelBackground,
        color: theme.palette.border.dashboard,
        zIndex: 1000,
        left: '110%',
        top: '-350%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: `0px 2px 20px 0px ${theme.palette.border.dashboard}`,
        padding: '1rem'
    },
    orientationHolder: {
        width: 'auto',
        display: 'flex',
        fontSize: '1.6rem',
        color: theme.palette.text.default,
        fontFamily: theme.body.B1.fontFamily,
        margin: '1rem',
        paddingBottom: '1rem',
        borderBottom: `1px solid ${theme.palette.text.default}`
    },
    infoContext: {
        fontSize: '1.6rem',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        margin: '0.5rem 1rem'
    },
    horizontalText: {
        display: 'flex',
        fontSize: '1.6rem',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        justifyContent: 'space-around',
        marginBottom: '1rem'
    },
    CloseIcon: {
        marginLeft: 'auto',
        width: '1.6rem',
        height: '1.6rem',
        color: theme.palette.text.contrastText,
        cursor: 'pointer'
    },
    recommendation: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    recommendationText: {
        marginLeft: theme.spacing(1)
    },
    kpiHeader: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        fontSize: '1.8rem',
        color: theme.palette.text.default
    },
    kpiDesc: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        marginTop: '0.5rem'
    },
    kpiNumberHeader: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.default,
        '& .MuiInput-underline:before ': {
            borderBottom: `1px solid ${theme.palette.text.default}`
        },
        '& .MuiInput-underline:hover ': {
            borderBottom: `1px solid ${theme.palette.text.default}`
        }
    },
    kpiNumberCount: {
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: '1.6rem',
        color: theme.palette.text.default
    },
    plusIcon: {
        background: theme.palette.text.default,
        borderRadius: 0,
        marginLeft: '3rem',
        padding: '0.5rem 0.5rem',
        '& svg': {
            color: `${theme.palette.text.btnTextColor} !important`
        }
    },
    minusIcon: {
        background: theme.palette.background.default,
        borderRadius: 0,
        marginRight: '3rem',
        padding: '0.5rem 0.5rem',
        '& svg': {
            color: `${theme.palette.text.default} !important`
        }
    },
    sectionHolder: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    tooltipTitle: {
        fontSize: '1.5rem',
        background: theme.palette.background.modelBackground,
        color: theme.palette.text.default,
        padding: '2rem',
        marginLeft: '2rem',
        border: `0.1px solid ${theme.palette.border.loginGrid}`
    },
    imageHolder: {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '0.5rem 2rem 0.5rem 2rem'
    },
    infoImage: {
        width: '45%'
    }
}));

const KPISettings = ({ kpiCount, setKpiCount, rows, setRows, orientation, setOrientation }) => {
    const classes = useStyles();
    const [sectionPopup, setSectionPopup] = useState(false);
    const [orientationPopup, setOrientationPopup] = useState(false);
    const handleKpiChange = (delta) => {
        setKpiCount(kpiCount + delta);
    };

    const handleOrientationChange = (event) => {
        setOrientation(event.target.value);
    };

    const handleRowsChange = (event) => {
        setRows(event.target.value);
    };

    return (
        <div className={classes.container}>
            <div className={classes.section}>
                <Typography className={classes.kpiHeader}>KPI Settings</Typography>
                <Typography className={classes.kpiDesc}>
                    Define the number of KPIs to display in your layout. Use the controls to add or
                    remove KPIs as needed.
                </Typography>
                <div className={classes.control}>
                    <Typography className={classes.kpiNumberHeader}>Number of KPI</Typography>
                    <div className={classes.buttonGroup}>
                        <IconButton
                            className={classes.minusIcon}
                            onClick={() => handleKpiChange(-1)}
                            disabled={kpiCount === 0}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <Typography className={classes.kpiNumberCount}>{kpiCount}</Typography>
                        <IconButton
                            className={classes.plusIcon}
                            onClick={() => handleKpiChange(1)}
                            disabled={kpiCount >= 6}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                </div>
            </div>

            <div className={classes.section}>
                <Typography className={classes.kpiHeader}>Widget Settings</Typography>
                <Typography className={classes.kpiDesc}>
                    Customize layout by specifying the number of rows & add widgets from the layout
                    to tailor the dashboard.
                </Typography>

                <div className={classes.sectionHolder}>
                    <div className={classes.control}>
                        <Typography className={classes.kpiNumberHeader}>
                            Section Orientation
                            <InfoIcon
                                className={classes.infoIcon}
                                onClick={() => setOrientationPopup(!orientationPopup)}
                                data-testid="info-icon-orientation"
                            />
                            {orientationPopup && (
                                <div className={classes.infoContainer}>
                                    <Typography className={classes.orientationHolder}>
                                        Orientation{' '}
                                        <CloseIcon
                                            onClick={() => setOrientationPopup(false)}
                                            className={classes.CloseIcon}
                                            data-testid="close-icon-orientation"
                                        />
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        By default, widgets are arranged horizontally. If you choose
                                        vertical orientation, they will be arranged vertically
                                        instead.
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        <b>Example</b>
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        The below images shows an example of vertical & horizontal
                                        orientation with 3 widgets in the first section and 1 widget
                                        in the second section.
                                    </Typography>
                                    <span className={classes.imageHolder}>
                                        <img
                                            className={classes.infoImage}
                                            src={Layouts_Vertical}
                                            alt="section orientation image"
                                        ></img>
                                        <img
                                            className={classes.infoImage}
                                            src={Layouts_Horizontal}
                                            alt="section orientation image"
                                        ></img>
                                    </span>
                                    <div className={classes.horizontalText}>
                                        <span>Vertical</span>
                                        <span>Horizontal</span>
                                    </div>
                                </div>
                            )}
                        </Typography>
                        <FormControl className={classes.input}>
                            <Select value={orientation} onChange={handleOrientationChange}>
                                <MenuItem value="Horizontal">Horizontal</MenuItem>
                                <MenuItem value="Vertical">Vertical</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={classes.control}>
                        <Typography className={classes.kpiNumberHeader}>
                            Number of Sections
                            {sectionPopup && (
                                <div className={classes.infoContainer}>
                                    <Typography className={classes.orientationHolder}>
                                        Sections
                                        <CloseIcon
                                            onClick={() => setSectionPopup(false)}
                                            className={classes.CloseIcon}
                                            data-testid="close-icon-section"
                                        />
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        Specify the number of sections you want to divide your
                                        dashboard into. Recommended maximum is 3-4 sections for
                                        optimal readability and performance.{' '}
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        <b>Example</b>
                                    </Typography>
                                    <Typography className={classes.infoContext}>
                                        The below image shows an example of vertical & horizontal
                                        orientation with 2 sections inside which widgets can be
                                        added.
                                    </Typography>
                                    <span className={classes.imageHolder}>
                                        <img
                                            className={classes.infoImage}
                                            src={Layouts_Vertical}
                                            alt="section orientation image"
                                        ></img>
                                        <img
                                            className={classes.infoImage}
                                            src={Layouts_Horizontal}
                                            alt="section orientation image"
                                        ></img>
                                    </span>
                                    <div className={classes.horizontalText}>
                                        <span>Vertical</span>
                                        <span>Horizontal</span>
                                    </div>
                                </div>
                            )}
                            <InfoIcon
                                className={classes.infoIcon}
                                onClick={() => setSectionPopup(!sectionPopup)}
                                data-testid="info-icon-section"
                            />
                        </Typography>
                        <TextField
                            type="integer"
                            value={rows}
                            onChange={handleRowsChange}
                            placeholder="Input Number"
                            className={classes.input}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPISettings;
