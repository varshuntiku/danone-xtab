import React, { useEffect, useCallback, useRef } from 'react';
import { withStyles, alpha } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, TextField, Tooltip } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import { Grid } from '@material-ui/core';
import { getStories, updateStory, createStory } from 'services/reports.js';
import { getApps } from 'services/dashboard.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { Slide } from '@material-ui/core';
import VisualContents from './createStory/visualContent';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';
import * as _ from 'underscore';
import InfoIcon from '@material-ui/icons/InfoOutlined';
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
    dialogPaper: {
        minHeight: '70vh',
        minWidth: '50%',
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)'
    },
    title: {
        color: theme.palette.text.titleText,
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.layoutSpacing(36),
        fontFamily: theme.title.h1.fontFamily,
        padding: `${theme.layoutSpacing(1)} ${theme.layoutSpacing(4)}`
    },
    selectedItemsTitle: {
        color: theme.palette.text.titleText,
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.layoutSpacing(36),
        fontFamily: theme.title.h1.fontFamily
    },

    selectedItemsList: {
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(20),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText
    },
    selectedItems: {
        maxHeight: '40rem',
        overflow: 'scroll',
        padding: '3rem',
        margin: '2rem',
        border: `1px solid ${theme.palette.border.grey} !important`,
        '&:hover': {
            borderColor: `${alpha(theme.palette.text.titleText, 0.5)} !important`
        }
    },
    singleItem: {
        marginBottom: '2rem'
    },
    selectedItemText: {
        marginTop: '2rem',
        marginLeft: '2rem',
        fontWeight: 'normal',
        fontSize: '2rem',
        // letterSpacing: '1.5px',
        color: theme.palette.text.titleText
    },
    deleteIcon: {
        fontSize: '3rem',
        cursor: 'pointer',
        marginRight: '10rem',
        fill: theme.palette.primary.contrastText,
        height: '100%',
        marginLeft: '5rem'
    },
    storyName: {
        marginBottom: theme.layoutSpacing(10),
        fontSize: '12px',
        color: theme.palette.text.titleText,
        '& .MuiFormHelperText-root': {
            fontSize: '1.7rem',
            marginLeft: '1rem'
        },
        '& .MuiInput-underline:before': {
            borderBottom: 'none'
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: 'none'
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'none'
        }
    },
    storyNameInput: {
        minWidth: '95%',
        width: 'full',
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.modelBackground,
        color: theme.palette.text.default,
        border: `1px solid ${theme.palette.border.grey} !important`,
        '&::placeholder': {
            color: theme.palette.text.default,
            opacity: 0.75
        },
        '&:hover': {
            borderColor: `${alpha(theme.palette.text.titleText, 0.5)} !important`
        },
        '&:focus': {
            borderColor: `${theme.palette.border.inputFocus} !important`
        },
        outline: 'none',
        padding: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
        height: '3rem'
    },
    filterInput: {
        minWidth: '95%',
        width: 'full',
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.modelBackground,
        color: theme.palette.text.default,
        border: `1px solid ${theme.palette.border.grey} !important`,
        '&::placeholder': {
            color: theme.palette.text.default,
            opacity: 0.75
        },
        '&:hover': {
            borderColor: `${alpha(theme.palette.text.titleText, 0.5)} !important`
        },
        '&:focus': {
            borderColor: `${theme.palette.border.inputFocus} !important`
        },
        outline: 'none',
        padding: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
        marginBottom: '1rem',
        height: '5rem'
    },

    filledInputArea: {
        minWidth: '95%',
        width: 'full',
        fontSize: '1.8rem',
        backgroundColor: theme.palette.background.modelBackground,
        color: theme.palette.text.default,
        border: `1px solid ${theme.palette.border.grey} !important`,
        '&::placeholder': {
            color: theme.palette.text.default,
            opacity: 0.75
        },
        '&:hover': {
            borderColor: `${alpha(theme.palette.text.titleText, 0.5)} !important`
        },
        '&:focus': {
            borderColor: `${theme.palette.border.inputFocus} !important`,
            backgroundColor: 'transparent !important'
        },
        outline: 'none',
        padding: '1rem',
        marginLeft: '1rem',
        marginRight: '1rem',
        marginBottom: '1rem'
    },
    storyDescription: {
        fontSize: '12px',
        color: theme.palette.text.titleText,
        padding: '0px !important',
        margin: '0px !important'
    },
    textArea: {
        padding: '0px !important',
        margin: '0px !important',
        '& .MuiFilledInput-root': {
            backgroundColor: theme.palette.background.modelBackground,
            '& .MuiFilledInput-input': {
                height: '150px !important',
                lineHeight: theme.spacing(3)
            },
            '&:before': {
                borderBottom: 'none'
            },
            '&:hover:before': {
                borderBottom: 'none !important'
            },
            '&:after': {
                borderBottom: 'none'
            },
            '&.Mui-focused': {
                backgroundColor: 'transparent !important'
            }
        }
    },

    listStyle: {
        listStyleType: 'none',
        padding: theme.spacing(1.5),
        fontSize: theme.spacing(2.5),
        color: theme.palette.text.titleText,
        margin: '1rem'
    },
    button: {
        borderRadius: theme.spacing(0.5),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '400',
        color: `${theme.palette.text.dark} !important`
    },
    buttonCancel: {
        borderRadius: theme.spacing(0.5),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
        // color: `${theme.palette.primary.contrastText} !important`
    },
    createNewStoryButton: {
        left: '3%',
        position: 'absolute',
        borderRadius: theme.spacing(0.5),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    },
    storyListCheckbox: {
        transform: 'scale(2)'
    },
    backIcon: {
        fontSize: '2.5rem'
    },
    backText: {
        fontSize: '1.9rem',
        fontFamily: 'Graphik Compact'
    },
    backIconWrapper: {
        fontSize: theme.spacing(5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'start',
        '&:hover': {
            background: 'none !important'
        },
        '& .MuiIconButton-root': {
            padding: '0px !important'
        },
        '& .MuiIconButton-root:hover': {
            backgroundColor: 'transparent !important',
            padding: '0px !important'
        }

        // lineHeight: '19px'
    },
    snackBarMessage: {
        '& .MuiSnackbarContent-message': {
            fontSize: theme.spacing(3)
        }
    },
    iconButtonProgress: {
        position: 'absolute',
        top: '40%',
        right: '50%',
        color: theme.palette.primary.contrastText
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '66%',
        marginLeft: '2rem'
    },
    radioLabel: {
        '& .MuiFormControlLabel-label': {
            fontSize: '12px'
        }
    },
    storyTypeLabel: {
        marginTop: '14px',
        fontSize: '2rem',
        color: theme.palette.text.titleText,
        marginLeft: '1.5rem'
    },
    storyTypeTooltip: {
        fontSize: '1.6rem',
        padding: '0.4rem 1rem',
        position: 'relative',
        top: '-2rem',
        left: '0.5rem',
        backgroundColor: theme.Toggle.DarkIconBg,
        '@media(max-width:1500px)': {
            top: '-3rem'
        }
    },
    arrow: {
        '&:before': {
            backgroundColor: theme.Toggle.DarkIconBg
        }
    },
    listStories: {
        padding: 0,
        margin: 0,
        marginLeft: '-10px'
    },
    storiesList: {
        maxHeight: '20rem',
        overflowY: 'auto',
        overflowX: 'auto'
    },
    rightDrawerVariant: {
        justifyContent: 'flex-end',
        '& .MuiDialog-paper': {
            marginRight: 0,
            overflow: 'visible'
        },
        '& .MuiDialog-paperScrollPaper': {
            maxHeight: 'unset',
            height: 'calc(100% - 1rem)'
        },
        '& $closeButton': {
            position: 'absolute',
            // left: "-5rem",
            top: '1.5rem',
            background: theme.palette.primary.light,
            backdropFilter: 'blur(2rem)'
        },
        dialogContent: {
            marginBottom: 0
        },
        closeIcon: {
            '&.MuiSvgIcon-root': {
                color: theme.palette.text.titleText
            }
        },
        dialogActionSection: {
            '& .MuiButton-outlined': {
                color: theme.palette.border.buttonOutline + '!important',
                borderColor: theme.palette.border.buttonOutline + '!important'
            },
            '& .MuiButton-contained': {
                backgroundColor: theme.palette.border.buttonOutline
            }
        }
    },
    infoIcon: {
        width: '2.2rem',
        height: '2.2rem',
        marginLeft: '0.8rem',
        color: theme.palette.background.warningDark
    },
    noStoryContainer: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    noStoriesTitle: {
        color: theme.palette.text.titleText,
        fontSize: theme.title.h2.fontSize,
        fontWeight: '400',
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h2.fontFamily
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.title}>
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

const DialogContent = withStyles(() => ({
    root: {
        overflowY: 'scroll',
        overflowX: 'hidden',
        padding: '1.6rem 0.8rem 1.6rem 1.6rem'
        //paddingRight:  "0.8rem",
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2.5)
    }
}))(MuiDialogActions);

const CreateReportsDialog = (props) => {
    const { classes } = props;
    const [open, setOpen] = React.useState(true);
    const [storiesList, setStoriesList] = React.useState();
    const [appList, setAppList] = React.useState();
    const [storiesLoading, setStoriesLoading] = React.useState(true);
    const [toggleState, setToggleState] = React.useState(
        props?.createStoryPanel ? props.createStoryPanel : true
    );
    const [selectedApps] = React.useState(new Map());
    const [checkedItems] = React.useState(new Map());
    const [selectedAppCount, setSelectedAppCount] = React.useState(true);
    // eslint-disable-next-line no-unused-vars
    const [trigger, setTrigger] = React.useState(null);
    const [filterStoryValue, setFilterStoryValue] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false });

    const [loading, setloading] = React.useState(false);
    const [appsLoading, setAppsLoading] = React.useState(false);
    const [values, setValues] = React.useState({
        storyName: '',
        storyDescription: '',
        storyType: 'static'
    });
    const [errors, setErrors] = React.useState(false);
    const didMount = useRef(false);

    const fromStoriesPage = props.stories_list_page;

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const validateInputFields = useCallback(() => {
        setErrors({ storyName: '' });
        if (!values.storyName.length) {
            setErrors({ storyName: 'Story Name is required' });
            return true;
        }
    }, [values.storyName.length]);

    useEffect(() => {
        if (didMount.current) {
            validateInputFields();
        } else didMount.current = true;
    }, [values, validateInputFields]);

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    useEffect(() => {
        if (props.app_info?.story_count) {
            getStories({
                user_email_id: props.logged_in_user_info,
                app_id: props.app_info.id,
                callback: onResponseGetStories
            });
        } else {
            setStoriesLoading(false);
        }
        if (fromStoriesPage) {
            let industry = localStorage.getItem('industry');
            setAppsLoading(true);
            getApps({
                industry: industry,
                callback: onResponseGetApps
            });
        }
    }, [fromStoriesPage, props.app_info]);

    const onResponseGetStories = (response_data) => {
        setStoriesList(response_data);
        setStoriesLoading(false);
    };

    const onResponseGetApps = (response_data) => {
        setAppList(decodeHtmlEntities(response_data));
        setAppsLoading(false);
    };

    const submit = () => {
        let validationStatus = validateInputFields();
        if (props.app_info?.story_count && toggleState && !fromStoriesPage) {
            addToExistingStory();
        } else {
            if (!validationStatus) {
                createNewStory();
            }
        }
    };

    const createNewStory = () => {
        var appIds = [];
        setloading(true);

        if (fromStoriesPage) {
            // eslint-disable-next-line no-unused-vars
            for (const [key, value] of selectedApps.entries()) {
                if (value) {
                    appIds.push(key);
                }
            }
        }

        var payload = {
            name: values.storyName,
            description: values.storyDescription,
            story_type: values.storyType,
            user_id: 0,
            email: props.logged_in_user_info,
            app_id: !fromStoriesPage ? [props.app_info.id] : [...appIds],
            content: !fromStoriesPage ? [...getCreateStoriesPayload()] : []
        };

        createStory({
            payload: payload,
            callback: onResponseCreateStory
        });
    };

    const addToExistingStory = () => {
        var storyIds = [];
        setloading(true);

        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of checkedItems.entries()) {
            if (value) {
                storyIds.push(key);
            }
        }
        var payload = {
            email: props.logged_in_user_info,
            story_id: [...storyIds],
            is_multiple_add: true,
            app_id: props.app_info.id,
            name: values.storyName,
            description: values.storyDescription,
            story_type: values.storyType,
            update: [],
            delete: [],
            add: [...getCreateStoriesPayload()]
        };
        if (storyIds.length) {
            try {
                updateStory({
                    payload: payload,
                    callback: onResponseCreateStory
                });
            } catch (error) {
                handleUpdateResponse({
                    message: 'Failed to complete action. Please try again.',
                    severity: 'error'
                });
            }
        }
    };

    const onResponseCreateStory = (response_data) => {
        handleUpdateResponse({
            message: fromStoriesPage
                ? 'Added Successfully'
                : 'Added Successfully. View them under Stories on the left navigation !'
        });
        setOpen(false);
        setloading(false);
        _.delay(
            () => {
                props.onClose();
                localStorage.removeItem('create-stories-payload');
                localStorage.removeItem('select-all-charts');
                props.onResponseAddORCreateStory(response_data);
            },
            2000,
            ''
        );
    };

    const handleUpdateResponse = useCallback(({ message, severity = 'success' }) => {
        setSnackbar({ open: true, severity, message });
    }, []);

    const togglePage = () => {
        setToggleState(false);
    };

    const getCreateStoriesPayload = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        var payloadObject = null;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(props.app_info.id);
        }
        return payloadObject;
    };

    const deleteItem = (id) => {
        const payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        const payloadObject = getCreateStoriesPayload();
        const removeIndex = payloadObject
            .map(function (item) {
                return item.app_screen_widget_value_id;
            })
            .indexOf(id);
        if (removeIndex !== -1) {
            payloadObject.splice(removeIndex, 1);
        }
        payloadMap.set(props.app_info.id, payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        setTrigger({});
    };

    const onStorySelection = (event) => {
        const item = event.target.name;
        const isChecked = event.target.checked;
        checkedItems.set(item, isChecked);
    };

    const onAppSelection = (event) => {
        const item = event.target.name;
        const isChecked = event.target.checked;
        selectedApps.set(item, isChecked);
        setSelectedAppCount(true);
        // eslint-disable-next-line no-unused-vars
        for (const [, value] of selectedApps.entries()) {
            if (value) {
                setSelectedAppCount(false);
            }
        }
    };

    useEffect(() => {
        setToggleState(props.createStoryPanel);
    }, [props.createStoryPanel]);

    return (
        <>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                classes={{
                    container: classes.rightDrawerVariant,
                    paper: classes.dialogPaper
                }}
                TransitionComponent={Slide}
                TransitionProps={{
                    direction: 'left'
                }}
                aria-describedby="create-report-dialog-content"
            >
                <DialogTitle id="customized-dialog-title">
                    Add Visual to Story Collections(S){' '}
                </DialogTitle>
                <DialogContent dividers id="create-report-dialog-content">
                    <>
                        <Grid container spacing={3}>
                            {!toggleState ? (
                                <Button
                                    className={classes.backIconWrapper}
                                    onClick={() => setToggleState(true)}
                                    variant="text"
                                >
                                    <span className={classes.backText}>
                                        Create new data story from selected items
                                    </span>
                                </Button>
                            ) : null}
                            {props.app_info?.story_count && toggleState && !fromStoriesPage ? (
                                <Grid item xs={12}>
                                    <span className={classes.selectedItemsTitle}>
                                        Add selected items to an existing story Collection
                                    </span>
                                </Grid>
                            ) : null}

                            <Grid item xs={12}>
                                {!storiesLoading && (
                                    <div>
                                        {!fromStoriesPage &&
                                        toggleState &&
                                        (storiesList?.my_stories?.length ||
                                            storiesList?.accessed_stories?.length) ? (
                                            <Grid item xs={12}>
                                                <input
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="Search for a Collection"
                                                    onChange={(e) =>
                                                        setFilterStoryValue(e.target.value)
                                                    }
                                                    className={classes.filterInput}
                                                />
                                            </Grid>
                                        ) : (
                                            toggleState && (
                                                <div className={classes.noStoryContainer}>
                                                    <InfoIcon className={classes.infoIcon} />
                                                    <Typography className={classes.noStoriesTitle}>
                                                        There are no existing data stories. Please
                                                        create a new one to add selected items
                                                    </Typography>
                                                </div>
                                            )
                                        )}
                                        {!fromStoriesPage && toggleState && storiesList ? (
                                            <div className={classes.storiesList}>
                                                <ul className={classes.listStories}>
                                                    {_.filter(
                                                        storiesList.my_stories,
                                                        function (story) {
                                                            return story.story_name
                                                                .toLowerCase()
                                                                .includes(
                                                                    filterStoryValue.toLowerCase()
                                                                );
                                                        }
                                                    ).map(function (story, index) {
                                                        return (
                                                            <li
                                                                key={'list_key' + index}
                                                                className={classes.listStyle}
                                                            >
                                                                <Checkbox
                                                                    checked={checkedItems.get(
                                                                        story.story_id
                                                                    )}
                                                                    name={story.story_id}
                                                                    className={
                                                                        classes.storyListCheckbox
                                                                    }
                                                                    disableRipple={true}
                                                                    onChange={(event) => {
                                                                        onStorySelection(event);
                                                                    }}
                                                                />
                                                                {story.story_name}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                        {fromStoriesPage && toggleState && appList ? (
                            <div>
                                <span className={classes.selectedItemsTitle}>
                                    {' '}
                                    Select Application(s) :{' '}
                                </span>
                                <ul>
                                    {appList
                                        .filter((app) => app.data_story_enabled)
                                        .map((app, index) => {
                                            return (
                                                <li
                                                    key={'app_list' + index}
                                                    className={classes.listStyle}
                                                >
                                                    <Checkbox
                                                        checked={selectedApps.get(app.id)}
                                                        name={app.id}
                                                        className={classes.storyListCheckbox}
                                                        disableRipple={true}
                                                        onChange={(event) => {
                                                            onAppSelection(event);
                                                        }}
                                                    />
                                                    {app.name}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        ) : (
                            appsLoading && (
                                <CircularProgress
                                    className={classes.iconButtonProgress}
                                    size={40}
                                />
                            )
                        )}

                        {!toggleState || (!fromStoriesPage && !props.app_info?.story_count) ? (
                            <div>
                                <TextField
                                    id="story-name"
                                    fullWidth
                                    placeholder="Story Name"
                                    className={classes.storyName}
                                    value={values.storyName}
                                    onChange={handleChange('storyName')}
                                    InputProps={{
                                        className: classes.storyName
                                    }}
                                    inputProps={{
                                        className: classes.storyNameInput,
                                        'aria-label': 'story-name'
                                    }}
                                    error={Boolean(errors?.storyName)}
                                    helperText={errors?.storyName}
                                />
                                <TextField
                                    placeholder="Add story description"
                                    multiline
                                    value={values.storyDescription}
                                    className={classes.textArea}
                                    onChange={handleChange('storyDescription')}
                                    variant="filled"
                                    fullWidth
                                    InputProps={{
                                        className: classes.textArea
                                    }}
                                    inputProps={{
                                        className: classes.filledInputArea,
                                        'aria-label': 'story-description'
                                    }}
                                    id="add story description"
                                />
                                <FormLabel className={classes.storyTypeLabel} component="legend">
                                    Story Type
                                </FormLabel>
                                <RadioGroup
                                    className={classes.radioGroup}
                                    aria-label="Story Type"
                                    name="storyType"
                                    value={values.storyType}
                                    onChange={handleChange('storyType')}
                                >
                                    <Tooltip
                                        classes={{
                                            tooltip: classes.storyTypeTooltip,
                                            arrow: classes.arrow
                                        }}
                                        title="A one-off story, choose this if you dont want any changes to happen to your story, even after the data updates."
                                        arrow
                                    >
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="static"
                                            control={<Radio />}
                                            label="Static"
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        classes={{
                                            tooltip: classes.storyTypeTooltip,
                                            arrow: classes.arrow
                                        }}
                                        title="This story can be scheduled, and therefore will generate a new copy with the latest data on the scheduled date."
                                        arrow
                                    >
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="recurring"
                                            control={<Radio />}
                                            label="Recurring"
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        classes={{
                                            tooltip: classes.storyTypeTooltip,
                                            arrow: classes.arrow
                                        }}
                                        title="The content of this story is always to fetch a new, choose this if the main use is for reporting."
                                        arrow
                                    >
                                        <FormControlLabel
                                            className={classes.radioLabel}
                                            value="dynamic"
                                            control={<Radio />}
                                            label="Dynamic"
                                        />
                                    </Tooltip>
                                </RadioGroup>
                            </div>
                        ) : null}
                        {!fromStoriesPage ? (
                            <>
                                <Grid item xs={12} className={classes.selectedItemText}>
                                    Selected Items ({getCreateStoriesPayload().length})
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.selectedItems}>
                                        {getCreateStoriesPayload().map((el, index) => (
                                            <Grid
                                                key={'key' + index}
                                                container
                                                item
                                                xs={12}
                                                className={classes.singleItem}
                                            >
                                                <Grid item xs={9}>
                                                    <VisualContents item={el} />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <div className={classes.deleteIcon}>
                                                        <RemoveCircleOutlineIcon
                                                            onClick={() =>
                                                                deleteItem(
                                                                    el.app_screen_widget_value_id
                                                                )
                                                            }
                                                            className={classes.deleteIcon}
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </div>
                                </Grid>
                            </>
                        ) : null}
                    </>
                </DialogContent>
                <DialogActions>
                    {toggleState && fromStoriesPage
                        ? [
                              <Button
                                  key="cancel"
                                  onClick={handleClose}
                                  variant="outlined"
                                  size="large"
                                  className={classes.buttonCancel}
                                  aria-label="Cancel"
                              >
                                  Cancel
                              </Button>,
                              <Button
                                  key="next"
                                  onClick={togglePage}
                                  disabled={selectedAppCount}
                                  variant="outlined"
                                  size="large"
                                  className={classes.button}
                                  aria-label="Next"
                              >
                                  Next
                              </Button>
                          ]
                        : null}

                    {(fromStoriesPage && !toggleState) || !fromStoriesPage
                        ? [
                              <Button
                                  key="cancel2"
                                  onClick={handleClose}
                                  variant="outlined"
                                  size="large"
                                  className={classes.buttonCancel}
                                  aria-label="Cancel"
                              >
                                  Cancel
                              </Button>,
                              <Button
                                  key="add"
                                  onClick={submit}
                                  disabled={loading}
                                  variant="contained"
                                  size="large"
                                  className={classes.button}
                                  aria-label={
                                      props.app_info?.story_count && toggleState && !fromStoriesPage
                                          ? 'Add'
                                          : 'Create'
                                  }
                              >
                                  {props.app_info?.story_count && toggleState && !fromStoriesPage
                                      ? 'Add'
                                      : 'Create'}
                              </Button>
                          ]
                        : null}
                </DialogActions>
            </Dialog>

            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
        </>
    );
};
export default withStyles(styles)(CreateReportsDialog);
