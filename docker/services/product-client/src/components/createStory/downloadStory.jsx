import React, { useCallback, /*useEffect,*/ useState } from 'react';
import { /*GetApp,*/ Close, /*Check,*/ VerticalAlignBottom } from '@material-ui/icons';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    /*alpha,*/ IconButton,
    makeStyles,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { withRouter } from 'react-router';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fileDownloadRequest } from '../../services/admin';
// import { useMatomo } from '@datapunt/matomo-tracker-react'
import { logMatomoEvent } from '../../services/matomo';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.palette.primary.main
    },
    title: {
        color: theme.palette.text.default
    },
    subtitle: {
        color: theme.palette.text.default,
        padding: '15px 0px 50px 25px'
    },
    input: {
        color: theme.palette.text.default + ' !important',
        border: '1px solid #4560D7',
        backgroundColor: theme.palette.primary.dark,
        fontSize: '12px',
        fontWeight: 400
    },
    overrideIcon: {
        fontSize: 'large',
        color: theme.palette.text.default
    },
    overrideOutlined: {
        padding: '10px 15px 10px 15px',
        width: '182px'
    },
    formControl: {
        paddingTop: '9px',
        display: 'flex',
        height: '76px'
    },
    dropdownDiv: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: '58%'
    },
    selectTxt: {
        width: '125px',
        height: '16px',
        fontSize: '12px',
        fontWeight: '400px'
    },
    cancelBtn: {
        borderRadius: '3px',
        padding: '0.7rem 5rem',
        width: '91px'
    },
    downloadBtn: {
        borderRadius: '3px',
        padding: '0.7rem 5rem',
        width: '111px'
    },
    actionIcon: {
        '& svg': {
            fontSize: '2.5rem',
            color: theme.palette.text.titleText
        }
    }
}));

function DownloadStory({ story, storyname, ...props }) {
    const classNames = useStyles();
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [value, setValue] = React.useState('Select');
    const data = ['ppt', 'pdf'];
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);
    // const { trackEvent } = useMatomo()

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const triggerDownload = () => {
        logMatomoEvent({
            e_c: 'Story',
            e_a: 'trigger-event-of-download-story',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        fileDownloadRequest({ story_id: story, type: value })
            .then(() => {
                setSnackbar({
                    open: true,
                    severity: 'success',
                    message:
                        'We are processing your request. Please find the download status under Stories > Downloads tab.'
                });
                setOpen(false);
            })
            .catch(() => {
                logMatomoEvent({
                    e_c: 'Story',
                    e_a: 'error-event-of-download-story',
                    ca: 1,
                    url: window.location.href,
                    // urlref: window.location.href,
                    pv_id: props.matomo.pv_id
                });
            });
    };
    return [
        <IconButton
            key={1}
            title="Download story"
            onClick={setOpen.bind(null, true)}
            className={classNames.actionIcon}
            aria-label="Download story"
        >
            <VerticalAlignBottom fontSize="large" />
        </IconButton>,
        <Dialog
            key={2}
            open={open}
            onClose={setOpen.bind(null, false)}
            fullWidth
            maxWidth="sm"
            aria-labelledby="download-story"
            aria-describedby="download-story-content"
        >
            <DialogTitle className={classNames.title} disableTypography id="download-story">
                <Typography
                    variant="h4"
                    style={{ fontSize: '2.5rem', letterSpacing: '0.1em', opacity: 0.8 }}
                >
                    Download Story
                </Typography>
                <IconButton
                    title="Close"
                    onClick={setOpen.bind(null, false)}
                    style={{ position: 'absolute', top: '4px', right: 0 }}
                    className={classNames.actionIcon}
                    aria-label="Close"
                >
                    <Close fontSize="large" />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classNames.subtitle} id="download-story-content">
                <Typography variant="h6" style={{ fontSize: '2rem' }}>
                    {storyname}
                </Typography>
                <div className={classNames.dropdownDiv}>
                    <Typography variant="h6" className={classNames.selectTxt}>
                        Download Story as
                    </Typography>
                    <FormControl variant="outlined" className={classNames.formControl}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={value}
                            IconComponent={ExpandMoreIcon}
                            onChange={handleChange}
                            renderValue={(selected) => `Format: ${selected}`}
                            className={classNames.input}
                            classes={{
                                outlined: classNames.overrideOutlined,
                                icon: classNames.overrideIcon
                            }}
                            MenuProps={{
                                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                                transformOrigin: { vertical: 'top', horizontal: 'left' },
                                getContentAnchorEl: null
                            }}
                        >
                            {data.map((item) => (
                                <MenuItem key={item} value={item.toUpperCase()}>
                                    <Typography variant="inherit">{item.toUpperCase()}</Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions style={{ padding: '8px 24px 24px', borderTop: 'solid 1px black' }}>
                <Button
                    className={classNames.cancelBtn}
                    variant="outlined"
                    onClick={handleCancel}
                    aria-label="Cancel download"
                >
                    Cancel
                </Button>
                <Button
                    title="share"
                    disabled={!(story && value != 'Select')}
                    className={classNames.downloadBtn}
                    variant="contained"
                    onClick={triggerDownload}
                    aria-label="confirm download"
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>,
        <CustomSnackbar
            key={3}
            message={snackbar.message}
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
            severity={snackbar.severity}
        />
    ];
}

// export default withRouter(DownloadStory);

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = () => {
    return {
        // getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    withRouter(DownloadStory)
);
