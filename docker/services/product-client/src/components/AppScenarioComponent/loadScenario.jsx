import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Checkbox from '@material-ui/core/Checkbox';
import { deleteScenarios } from '../../services/scenario';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    title: {
        fontWeight: 500,
        fontSize: '2.5rem',
        letterSpacing: '0.1em',
        opacity: 0.8,
        color: theme.palette.text.titleText,
        background: theme.palette.primary.dark
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5" className={classes.title}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
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
    simulatorButtons: {
        marginRight: theme.spacing(2)
    },
    loadButtonStyle: {
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
    inputField: {
        margin: theme.spacing(2, 0, 1, 0)
    },
    container: {
        maxHeight: 440
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
                        borderColor: theme.palette.text.titleText,
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
                    fontSize: '2.5rem !important',
                    color: theme.palette.text.titleText + '!important'
                }
            },
            MuiTableCell: {
                root: {
                    fontSize: '1.5rem !important',
                    color: theme.palette.text.titleText + '!important'
                }
            },
            MuiTablePagination: {
                root: {
                    fontSize: '1.5rem !important',
                    color: theme.palette.text.titleText + '!important'
                }
            },
            MuiPaper: {
                root: {
                    fontSize: '1.5rem !important',
                    color: theme.palette.text.titleText + '!important'
                }
            },
            MuiSelect: {
                icon: {
                    top: '0px'
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
            }
        }
    });

const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Comments' },
    { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' }
];

function EnhancedTableHead() {
    // const { classes } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox"></TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={'left'} padding={'default'}>
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired
};

export default function LoadScenario(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [scenarios, setScenarios] = React.useState(
        props.savedScenarios ? props.savedScenarios : []
    );
    const [selectedScenario, setSelectedSceanrio] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: false,
        severity: 'success'
    });

    const handleClick = (event, row) => {
        setSelectedSceanrio(row);
    };

    const isSelected = (id) => selectedScenario.id === id;

    const handleClickOpen = () => {
        setScenarios(props.savedScenarios ? props.savedScenarios : []);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedSceanrio(false);
        setScenarios(props.savedScenarios ? props.savedScenarios : []);
    };
    const handleDelete = (event, app_id, id) => {
        if (window.confirm('Are you sure you want to delete this scenario?')) {
            deleteScenarios({
                app_id: app_id,
                scenario_id: id
            })
                .then((res) => {
                    props.getScenarios();
                    setScenarios(props.savedScenarios ? props.savedScenarios : []);
                    setSnackbar({ open: true, severity: 'success', message: res['data'].message });
                    setOpen(false);
                })
                .catch((err) => {
                    setSnackbar({ open: true, severity: 'error', message: err.message });
                });
        }
    };
    const onhandleSave = () => {
        props.loadScenario(selectedScenario);
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button
                variant="contained"
                className={`${classes.simulatorButtons} ${classes.loadButtonStyle}`}
                onClick={handleClickOpen}
                aria-label="Load Scenario"
            >
                Load Scenario
            </Button>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={'lg'}
                fullWidth={true}
                aria-describedby="load-scenario-content"
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Scenarios
                </DialogTitle>
                <DialogContent id="load-scenario-content">
                    <ThemeProvider theme={selectCompTheme}>
                        <Grid container direction="row">
                            <Grid item xs={12}>
                                <TableContainer className={classes.container}>
                                    <Table
                                        stickyHeader
                                        aria-labelledby="tableTitle"
                                        size={'medium'}
                                        aria-label="enhanced table"
                                    >
                                        <EnhancedTableHead classes={classes} />
                                        <TableBody>
                                            {scenarios.map((row, index) => {
                                                const isItemSelected = isSelected(row.id);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        aria-label="scenario"
                                                        hover
                                                        onClick={(event) => handleClick(event, row)}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.id + labelId}
                                                        selected={isItemSelected}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    'aria-labelledby': labelId
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            align="left"
                                                            padding="none"
                                                        >
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.comment}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.createdAt}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <IconButton
                                                                aria-label="Delete"
                                                                className={classes.closeButton}
                                                                title="Delete"
                                                                onClick={(e) =>
                                                                    handleDelete(
                                                                        e,
                                                                        row.app_id,
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <DeleteForeverIcon color="action" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </DialogContent>
                <DialogActions>
                    {selectedScenario ? (
                        <Button
                            onClick={(e) => onhandleSave(e)}
                            variant="outlined"
                            className={classes.simulatorButtons}
                            title="Load"
                            aria-label="Load"
                        >
                            Load
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            className={classes.simulatorButtons}
                            style={{ color: '#ddd', border: '1px solid #ddd' }}
                            title="Load Disabled"
                            aria-label="Load disabled"
                        >
                            Load
                        </Button>
                    )}
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className={classes.simulatorButtons}
                        title="Cancel"
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
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
