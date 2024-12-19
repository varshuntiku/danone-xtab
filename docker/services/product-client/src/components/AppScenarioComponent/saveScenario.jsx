import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '../../assets/Icons/CloseBtn';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import { saveScrenario, validScenarioName } from '../../services/scenario';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        background: theme.palette.background.pureWhite,
        fontFamily: theme.title.h1.fontFamily,
        borderBottom: 'none'
    },
    closeButton: {
        padding: 0,
        margin: 0,
        '& svg': {
            width: theme.layoutSpacing(16),
            height: theme.layoutSpacing(16)
        }
    },
    title: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(4)}`,
        width: '100%',
        '& h5': {
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(22),
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: theme.layoutSpacing(36),
            letterSpacing: theme.layoutSpacing(1),
            color: theme.palette.text.revamp
        },
        background: theme.palette.background.pureWhite,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <div className={classes.title}>
                <Typography variant="h5">{children}</Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </div>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1, 1, 2, 1)
    }
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    saveButtonStyle: {
        margin: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(10)} ${theme.layoutSpacing(16)}`,
        height: theme.layoutSpacing(36),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(24)}`,
        '& span': {
            fontSize: theme.layoutSpacing(15),
            fontWeight: '500',
            lineHeight: 'normal',
            letterSpacing: theme.layoutSpacing(1.5)
        }
    },
    simulatorButtons: {
        marginRight: theme.spacing(2)
    },
    cancelBtn: {
        height: theme.layoutSpacing(36)
    },
    simulatorSaveButton: {
        backgroundColor: theme.palette.text.default,
        color: theme.palette.text.peachText,
        marginRight: theme.spacing(2),
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(30)}`,
        height: theme.layoutSpacing(36)
    },
    containedSimulatorSave: {
        padding: `${theme.layoutSpacing(8)} ${theme.layoutSpacing(30)}`,
        height: theme.layoutSpacing(36),
        backgroundColor: theme.palette.text.default
    },
    inputField: {
        margin: theme.spacing(2, 0, 1, 0),
        '& .MuiOutlinedInput-root.Mui-focused': {
            border: '#4788D8 1px solid'
        }
    },
    dialogPaper: {
        background: theme.palette.background.pureWhite,
        width: theme.layoutSpacing(572),
        padding: `${theme.layoutSpacing(48)} ${theme.layoutSpacing(44)} ${theme.layoutSpacing(
            28
        )} ${theme.layoutSpacing(44)}`
    },
    titleWrapper: {
        padding: `0 ${theme.layoutSpacing(16)}`,
        background: theme.palette.background.pureWhite
    },
    sepratorLine: {
        width: 'calc(100% - 32px)',
        marginTop: 0,
        marginBottom: 0
    },
    dialogAction: {
        backgroundColor: theme.palette.background.pureWhite
    }
}));
const selectCompTheme = (theme) =>
    createMuiTheme({
        ...theme,
        overrides: {
            ...theme,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem',
                    '&$focused': {
                        color: theme.palette.text.titleText,
                        fontWeight: 'bold'
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: theme.palette.text.titleText
                    },
                    '&$focused $notchedOutline': {
                        borderColor: theme.palette.border.inputFocus,
                        borderWidth: 1.5
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: theme.palette.text.titleText,
                        borderWidth: 1.5
                    }
                },
                input: {
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }
            },

            MuiSvgIcon: {
                root: {
                    fontSize: '3rem !important',
                    color: theme.palette.text.titleText + '!important'
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                },
                body2: {
                    fontSize: '1.25rem'
                },
                caption: {
                    fontSize: '1rem',
                    color: theme.palette.text.titleText
                }
            },

            MuiButton: {
                textPrimary: {
                    color: theme.palette.text.titleText,
                    fontSize: theme.spacing(2.5)
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)'
                }
            },
            MuiFormHelperText: {
                root: {
                    fontSize: '1.25rem'
                }
            }
        }
    });

export default function SaveScenario(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [scenario, setScenario] = React.useState({
        scenarioname: '',
        comment: '',
        filters_json: props.filters_json,
        app_id: Number(props.app_id),
        app_screen_id: props.screen_id,
        widget_id: props.widget_id,
        scenarios_json: props.scenarios_json
    });
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: false,
        severity: 'success'
    });
    const [isexists, setIsExists] = React.useState(false);
    const [responseKey, setResponseKey] = React.useState(false);

    const handleClickOpen = () => {
        setScenario({
            ...scenario,
            scenarioname: '',
            comment: '',
            filters_json: props.filters_json,
            app_id: Number(props.app_id),
            app_screen_id: props.screen_id,
            widget_id: props.widget_id,
            scenarios_json: props.scenarios_json
        });
        setOpen(true);
        setIsExists(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleonChange = (event) => {
        let value = event.target.value;
        setScenario({
            ...scenario,
            [event.target.name]: value
        });
        if (event.target.name === 'scenarioname') {
            let nameExists = debounce(isScenarioNameExists, 2000);
            nameExists(value);
        }
    };
    const onhandleSave = () => {
        saveScrenario({
            payload: scenario,
            callback: saveCallback
        });
    };
    const saveCallback = (response) => {
        setOpen(false);
        if (response && response['status'] === 200) {
            setSnackbar({ open: true, severity: 'success', message: response.message });
            props.getScenarios();
        } else {
            setSnackbar({
                open: true,
                severity: 'error',
                message: response.error ? response.error : response.message
            });
        }
        setScenario({
            ...scenario,
            scenarioname: '',
            comment: ''
        });
    };

    const debounce = (func, wait, immediate) => {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    const isScenarioNameExists = (name) => {
        setResponseKey(false);
        validScenarioName({
            app_id: scenario.app_id,
            name: name,
            app_screen_id: scenario.app_screen_id,
            widget_id: scenario.widget_id
        })
            .then((res) => {
                setResponseKey(true);
                let val = res.data.isexists === 'true' ? true : false;
                setIsExists(val);
            })
            .catch(() => {
                setIsExists(false);
            });
    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                className={`${classes.simulatorButtons} ${classes.saveButtonStyle}`}
                onClick={handleClickOpen}
                aria-label="Save Scenario"
            >
                Save Scenario
            </Button>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={'md'}
                aria-describedby="scenario-content"
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    className={classes.titleWrapper}
                >
                    Save Scenario
                </DialogTitle>
                <DialogContent id="scenario-content" className={classes.dialogPaper}>
                    <ThemeProvider theme={selectCompTheme}>
                        <Grid container direction="row">
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    error={isexists}
                                    helperText={
                                        isexists ? 'This scenario name already exists!' : ''
                                    }
                                    className={classes.inputField}
                                    value={scenario.scenarioname}
                                    name={'scenarioname'}
                                    placeholder="Enter the scenario name"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleonChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required1"
                                    label="Comment"
                                    className={classes.inputField}
                                    value={scenario.comment}
                                    name={'comment'}
                                    placeholder="Enter the comment"
                                    variant="outlined"
                                    fullWidth={true}
                                    multiline={true}
                                    inputprops={{
                                        type: 'text',
                                        rows: 3,
                                        maxrows: 3
                                    }}
                                    onChange={handleonChange}
                                />
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </DialogContent>
                <DialogActions className={classes.dialogAction}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className={`${classes.simulatorButtons} ${classes.cancelBtn}`}
                        title="Cancel"
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                    {scenario.scenarioname && !isexists && responseKey ? (
                        <Button
                            onClick={(e) => onhandleSave(e)}
                            variant="contianed"
                            className={`${classes.simulatorButtons} ${classes.containedSimulatorSave}`}
                            title="Save"
                            aria-label="Save"
                        >
                            Save
                        </Button>
                    ) : (
                        <Button
                            variant="contianed"
                            className={classes.simulatorSaveButton}
                            title="Please fill the scenario name."
                            aria-label="Save"
                        >
                            Save
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
        </React.Fragment>
    );
}
