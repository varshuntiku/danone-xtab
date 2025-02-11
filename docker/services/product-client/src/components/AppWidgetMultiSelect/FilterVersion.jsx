import {
    alpha,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    makeStyles,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import * as moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        gap: '2rem',
        padding: '2rem',
        height: '100%'
    },
    pivotsContainer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '4rem',
        alignContent: 'flex-start',
        maxHeight: '450px',
        overflowY: 'auto',
        paddingBottom: '1rem',
        width: '40%'
    },
    chip: {
        color: theme.palette.text.default,
        borderColor: theme.palette.text.default,
        width: '45%',
        cursor: 'pointer'
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    dropzoneContainer: {
        width: '20%',
        display: 'flex',
        flexDirection: 'column'
    },
    dropZone: {
        background: theme.palette.primary.dark,
        flex: 1,
        borderRadius: '4px',
        border: `1px solid ${alpha(theme.palette.text.default, 0.4)}`,
        padding: '1rem',
        maxHeight: '450px',
        overflowY: 'auto'
    },
    divider: {
        borderColor: alpha(theme.palette.primary.light, 0.4)
    },
    closeIcon: {
        cursor: 'pointer'
    },
    inputField: {
        margin: theme.spacing(2, 0, 1, 0)
    },
    simulatorButtons: {
        marginRight: theme.spacing(2),
        '&.Mui-disabled': {
            pointerEvents: 'auto'
        }
    },
    label: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    radio: {
        '& svg': {
            width: '2.2rem',
            height: '2.2rem',
            color: theme.palette.primary.contrastText
        }
    },
    iconBtn: {
        '& svg': {
            width: '2rem',
            height: '2rem',
            color: theme.palette.border.buttonOutline
        }
    },
    deleteBtn: {
        '& svg': {
            width: '2rem',
            height: '2rem',
            color: 'red'
        },
        '&.Mui-disabled': {
            pointerEvents: 'auto',
            '& svg': {
                color: theme.palette.grey[500]
            }
        }
    },
    checkedLabel: {
        color: theme.palette.primary.contrastText,
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    filterOptionContainer: {
        float: 'left',
        padding: theme.spacing(1, 0),
        margin: theme.spacing(0.5, 2),
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(4)
    },
    filterOptionHeader: {
        color: theme.palette.text.default,
        padding: theme.spacing(0.5, 1),
        fontSize: '1.5rem',
        lineHeight: '1.6rem',
        fontWeight: 500,
        marginLeft: theme.spacing(1)
    },
    filterOptionValue: {
        marginRight: theme.spacing(1),
        padding: theme.spacing(0.5, 1),
        fontSize: '1.5rem',
        lineHeight: '1.6rem',
        fontWeight: 500,
        color: theme.palette.primary.contrastText
    },
    filterSection: {
        backgroundColor: theme.palette.primary.light,
        borderRadius: '0.5rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
    }
}));

//for save filter
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
const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1, 1, 2, 1)
    }
}))(MuiDialogActions);

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

export function CreateFilter(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [filterCombination, setFilterCombination] = React.useState({
        versionName: '',
        description: ''
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [buttonTitle, setButtonTitle] = useState('Please enter the name');
    const [existingVersionList, setExistingVersionList] = useState([]);
    const [isExists, setIsExists] = useState(false);
    const [currentFilter, setCurrentFilter] = useState({
        selected_filter: null,
        filter_data: null
    });

    useEffect(() => {
        let versionName = props.existingFilterVersion.map((ver) => ver.name.toLowerCase());
        setExistingVersionList(versionName);
    }, [props.existingFilterVersion]);

    useEffect(() => {
        setCurrentFilter({
            ...currentFilter,
            filter_data: props.selectedFilter.filterData ? props.selectedFilter.filterData : null,
            selected_filter: props.selectedFilter.selected ? props.selectedFilter.selected : null
        });
    }, [props.selectedFilter]);

    const handleonChange = (event) => {
        let value = event.target.value;
        setFilterCombination({ ...filterCombination, [event.target.name]: value });
        if (event.target.name === 'versionName') {
            if (value === '') {
                setButtonTitle('Please enter the name');
            }
            if (existingVersionList.includes(value.toLowerCase())) {
                setIsDisabled(true);
                setIsExists(true);
                setButtonTitle('Name already exists.');
            } else {
                setIsDisabled(false);
                setIsExists(false);
            }
        }
    };
    const handleClickOpen = () => {
        setFilterCombination({
            ...filterCombination,
            versionName: '',
            filter_data: null,
            description: ''
        });
        setIsExists(false);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOnSaveFilter = () => {
        props.onSaveFilterVersion(filterCombination);
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" disabled={props.errorMessage} onClick={handleClickOpen}>
                Save Report
            </Button>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Save Reports
                </DialogTitle>
                <DialogContent>
                    <ThemeProvider theme={selectCompTheme}>
                        <Grid container direction="row">
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    error={isExists}
                                    helperText={isExists ? 'This name already exists!' : ''}
                                    className={classes.inputField}
                                    value={filterCombination.name}
                                    name={'versionName'}
                                    placeholder="Enter the name"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleonChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required"
                                    label="Description"
                                    className={classes.inputField}
                                    value={filterCombination.description}
                                    name={'description'}
                                    placeholder="Enter the description"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleonChange}
                                    multiline={true}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.filterSection}>
                                <FilterChips currentFilter={currentFilter} classes={classes} />
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleOnSaveFilter}
                        variant="contained"
                        className={classes.simulatorButtons}
                        disabled={isDisabled}
                        title={buttonTitle}
                    >
                        Save
                    </Button>

                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className={classes.simulatorButtons}
                        title="Cancel"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function FilterVersion({ ...props }) {
    const classes = useStyles();
    const [filterVar, setFilterVar] = React.useState(props.filterVersions || []);
    const currentFilter = {
        filter_data: props.currentFilter.filterData || [],
        selected_filter: props.currentFilter.selected || {}
    };
    const [visible, setVisible] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [editFilter, setEditFilter] = React.useState({});
    const [radioOption, setRadioOption] = React.useState(props.selectedFilterVersion);

    useEffect(() => {
        setFilterVar(props.filterVersions);
    }, [props.filterVersions]);

    const handleChange = (event) => {
        setRadioOption(event.target.value);
        const versionDetail = filterVar.find((item) => item.name === event.target.value);
        props.onChangeFilterVersion(versionDetail);
        setEditFilter(versionDetail);
    };
    const handleClose = () => {
        setVisible(false);
    };

    const handleOnDelete = (item) => {
        if (window.confirm('Are you sure you want to delete this reports?')) {
            props.onDeleteFilterVersion(item);
        }
    };
    const handleVisibility = () => {
        setVisible(true);
    };

    const handleOnUpdate = (item) => {
        setEditOpen(true);
    };

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" style={{ height: 'inherit', width: '100%' }}>
                {filterVar.length === 0 ? (
                    <Typography variant="h4" className={classes.title}>
                        "No reports have been saved"
                    </Typography>
                ) : (
                    <RadioGroup
                        aria-label="radio-filter-version"
                        name="radio-filter-version"
                        value={radioOption}
                        onChange={handleChange}
                        style={{ height: 'inherit', overflowX: 'auto', padding: '1rem' }}
                    >
                        {filterVar?.map((item) => {
                            const checked = radioOption && radioOption.includes(item.name);
                            const label = (
                                <>
                                    {' '}
                                    <span style={{ fontWeight: '700' }}>{item.name}</span>
                                    {item.description && (
                                        <span style={{ fontWeight: '400' }}>
                                            : {item.description}
                                        </span>
                                    )}
                                </>
                            );
                            return (
                                <div
                                    style={{ display: 'flex', justifyContent: 'space-between' }}
                                    key={'filter-version-' + item.name}
                                >
                                    <FormControlLabel
                                        value={item.name}
                                        control={<Radio className={classes.radio} />}
                                        label={label}
                                        classes={{
                                            label: checked ? classes.checkedLabel : classes.label
                                        }}
                                        key={item.name + ' '}
                                    />
                                    {radioOption === item.name && (
                                        <>
                                            <div>
                                                <IconButton
                                                    aria-label="Info"
                                                    className={classes.iconBtn}
                                                    title={'Filter info'}
                                                    onClick={handleVisibility}
                                                    key={'info ' + item.name + ' '}
                                                >
                                                    <VisibilityIcon color="action" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Edit"
                                                    className={classes.iconBtn}
                                                    title={'Edit'}
                                                    onClick={handleOnUpdate.bind(null, item)}
                                                    key={'edit ' + item.name + ' '}
                                                >
                                                    <EditIcon color="action" />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Delete"
                                                    className={classes.deleteBtn}
                                                    title={'Delete'}
                                                    onClick={handleOnDelete.bind(null, item)}
                                                    key={'delete ' + item.name + ' '}
                                                >
                                                    <DeleteForeverIcon color="action" />
                                                </IconButton>
                                            </div>
                                            <Dialog
                                                onClose={handleClose}
                                                aria-labelledby="customized-dialog-title"
                                                open={visible}
                                                maxWidth={'md'}
                                                fullWidth={true}
                                            >
                                                <DialogTitle
                                                    id="customized-dialog-title"
                                                    onClose={handleClose}
                                                ></DialogTitle>
                                                <DialogContent>
                                                    <ThemeProvider theme={selectCompTheme}>
                                                        <Grid container direction="row">
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                className={classes.filterSection}
                                                            >
                                                                <FilterChips
                                                                    currentFilter={currentFilter}
                                                                    classes={classes}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </ThemeProvider>
                                                </DialogContent>
                                            </Dialog>
                                            <UpdateFilterVersion
                                                editFilter={editFilter}
                                                setEditOpen={setEditOpen}
                                                editOpen={editOpen}
                                                onUpdateFilterVersion={props.onUpdateFilterVersion}
                                                existingFilterVersion={props.filterVersions}
                                            />
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </RadioGroup>
                )}
            </FormControl>
        </div>
    );
}

export function FilterChips(props) {
    const { currentFilter, classes } = props;

    return (
        <>
            {currentFilter?.filter_data?.map((item) => {
                return (
                    <div
                        key={'selected_filter_' + item['widget_tag_label']}
                        className={classes.filterOptionContainer}
                    >
                        <span className={classes.filterOptionHeader}>
                            <Typography variant="inherit" noWrap>
                                {item['widget_tag_label'] && item['widget_tag_label'].length <= 3
                                    ? item['widget_tag_label'].toUpperCase()
                                    : item['widget_tag_label']}
                            </Typography>
                        </span>
                        <span className={classes.filterOptionValue}>
                            <Typography variant="inherit" noWrap>
                                {item['widget_filter_type'] ? (
                                    <>
                                        {item['widget_filter_type'] === 'date_range' &&
                                            moment(
                                                new Date(
                                                    currentFilter.selected_filter[
                                                        item['widget_tag_key']
                                                    ].start_date
                                                )
                                            ).format(
                                                item['widget_filter_params']?.start_date?.format ||
                                                    'DD/MM/yyyy'
                                            ) +
                                                ' - ' +
                                                moment(
                                                    new Date(
                                                        currentFilter.selected_filter[
                                                            item['widget_tag_key']
                                                        ].end_date
                                                    )
                                                ).format(
                                                    item['widget_filter_params']?.end_date
                                                        ?.format || 'DD/MM/yyyy'
                                                )}
                                        {item['widget_filter_type'] === 'dropdown_radio' &&
                                        currentFilter.selected_filter[item['widget_tag_key']]
                                            ?.search == ''
                                            ? currentFilter.selected_filter[item['widget_tag_key']][
                                                  item['widget_filter_extra_params'][0]['label']
                                              ] +
                                              ' ' +
                                              item['widget_filter_extra_params'][1]['label'] +
                                              ' ' +
                                              currentFilter.selected_filter[item['widget_tag_key']][
                                                  item['widget_filter_extra_params'][1]['label']
                                              ]
                                            : currentFilter.selected_filter[item['widget_tag_key']]
                                                  ?.items instanceof Array &&
                                              currentFilter.selected_filter[item['widget_tag_key']]
                                                  ?.items.length > 1
                                            ? currentFilter.selected_filter[
                                                  item['widget_tag_key']
                                              ]?.items.indexOf('All') > -1
                                                ? 'All'
                                                : currentFilter.selected_filter[
                                                      item['widget_tag_key']
                                                  ]?.items.length + ' Items selected'
                                            : currentFilter.selected_filter[item['widget_tag_key']]
                                                  ?.items}
                                    </>
                                ) : currentFilter.selected_filter[item['widget_tag_key']] instanceof
                                      Array &&
                                  currentFilter.selected_filter[item['widget_tag_key']].length >
                                      1 ? (
                                    currentFilter.selected_filter[item['widget_tag_key']].indexOf(
                                        'All'
                                    ) > -1 ? (
                                        'All'
                                    ) : (
                                        currentFilter.selected_filter[item['widget_tag_key']]
                                            .length + ' Items selected'
                                    )
                                ) : (
                                    currentFilter.selected_filter[item['widget_tag_key']]
                                )}
                            </Typography>
                        </span>
                    </div>
                );
            })}
        </>
    );
}

export function UpdateFilterVersion(props) {
    const classes = useStyles();
    const [filterCombination, setFilterCombination] = React.useState({
        name: props.editFilter.name,
        description: props.editFilter.description,
        existingName: props.editFilter.name
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [buttonTitle, setButtonTitle] = useState('Please enter the name');
    const [existingVersionList, setExistingVersionList] = useState([]);
    const [isExists, setIsExists] = useState(false);

    useEffect(() => {
        let versionName = props.existingFilterVersion.map((ver) => ver.name.toLowerCase());
        setExistingVersionList(versionName);
        setIsDisabled(true);
    }, [props.existingFilterVersion]);

    const handleonChange = (event) => {
        let value = event.target.value;
        setFilterCombination({ ...filterCombination, [event.target.name]: value });
        setIsDisabled(false);
        if (event.target.name === 'name') {
            if (value === '') {
                setButtonTitle('Please enter the name');
                setIsDisabled(true);
            }
            // if (existingVersionList.includes(value.toLowerCase())) {
            //     setIsDisabled(true)
            //     setIsExists(true)
            //     setButtonTitle("Name already exists.")
            // } else {
            //     setIsDisabled(false)
            //     setIsExists(false)
            // }
        }
    };

    const handleClose = () => {
        props.setEditOpen(false);
        setFilterCombination({
            name: props.editFilter.name,
            description: props.editFilter.description,
            existingName: props.editFilter.name
        });
        setIsDisabled(true);
    };
    const handleUpdateFilter = () => {
        props.onUpdateFilterVersion(filterCombination);
        props.setEditOpen(false);
    };

    return (
        <>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.editOpen}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Edit Report
                </DialogTitle>
                <DialogContent>
                    <ThemeProvider theme={selectCompTheme}>
                        <Grid container direction="row">
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    error={isExists}
                                    helperText={isExists ? 'This name already exists!' : ''}
                                    className={classes.inputField}
                                    value={filterCombination.name}
                                    name={'name'}
                                    placeholder="Enter the name"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleonChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required"
                                    label="Description"
                                    className={classes.inputField}
                                    value={filterCombination.description}
                                    name={'description'}
                                    placeholder="Enter the description"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleonChange}
                                    multiline={true}
                                />
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleUpdateFilter}
                        variant="contained"
                        className={classes.simulatorButtons}
                        disabled={isDisabled}
                        title={buttonTitle}
                    >
                        Update
                    </Button>

                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className={classes.simulatorButtons}
                        title="Cancel"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
