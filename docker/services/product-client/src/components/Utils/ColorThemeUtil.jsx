import {
    Button,
    Grid,
    IconButton,
    TextField,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import { CustomThemeContext } from '../../themes/customThemeContext';
import ThemeEditor from './ThemeEditor';
import clsx from 'clsx';
import {
    getAllAppThemes,
    updateAppTheme,
    createAppTheme,
    deleteTheme,
    getAppsUnderThemeId
} from '../../services/theme';
import CodxCircularLoader from '../CodxCircularLoader';
import defaultTheme from '../../themes/themeData/default';
import CustomSnackbar from '../../components/CustomSnackbar';
import AddIcon from '@material-ui/icons/Add';
import WizardComponent from '../WizardComponent';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { ReactComponent as CopyIcon } from '../../assets/img/duplicateTheme.svg';
import { ReactComponent as LockIcon } from '../../assets/img/themeLock.svg';
import { ReactComponent as NoThemeIcon } from '../../assets/img/noThemeSelected.svg';
import { ReactComponent as Redo } from '../../assets/img/Redo.svg';
import { ReactComponent as Undo } from '../../assets/img/Undo.svg';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Prompt } from 'react-router-dom';
import CodxPopupDialog from '../../components/custom/CodxPoupDialog';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    pageHeader: {},
    pageTitle: {
        flex: 1
    },
    textDefault: {
        color: theme.palette.text.default
    },
    title: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        fontWeight: '400'
    },
    themeListNav: {
        minWidth: '40rem',
        borderRight: `1px solid ${alpha(theme.palette.border.light, 0.2)}`
    },
    themeList: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '2rem',
        gap: '1rem',
        maxHeight: '70rem',
        overflowY: 'auto',
        padding: '1rem 4rem 1rem 3rem'
    },
    themeNavTitleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 4rem 1rem 3rem'
    },
    themeItemRoot: {
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        padding: '1rem',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: '1rem',
        cursor: 'pointer',
        position: 'relative',
        '& button': {
            visibility: 'hidden'
        },
        '&:hover button': {
            visibility: 'visible',
            display: 'block'
        },
        '&:hover': {
            outline: `1px solid ${theme.palette.border.inputOnHover}`,
            border: 'none'
        }
    },
    copyButton: {
        padding: '0',
        backgroundColor: 'transparent !important',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.hover, 0.2)
        },
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '3.2rem',
            height: '3.2rem',
            borderRadius: '50%',
            '&:hover': {
                backgroundColor: alpha(theme.palette.background.hover, 0.2)
            }
        }
    },
    redo: {
        fontSize: '1.6rem',
        gap: '1rem',
        '& svg': {
            width: '1.2rem',
            height: '1.2rem',
            fill: theme.palette.text.contrastText
        }
    },
    undo: {
        fontSize: '1.6rem',
        '& svg': {
            width: '1.2rem',
            height: '1.2rem',
            fill: theme.palette.text.contrastText
        }
    },
    discard: {
        fontSize: '1.6rem'
    },

    lockButton: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        padding: '0',
        visibility: 'visible !important',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'transparent !important'
        },

        '& svg': {
            width: '1.6rem',
            height: '1.6rem'
        }
    },
    deleteIcon: {
        padding: '0.5rem',
        display: 'none',
        '&:hover': {
            backgroundColor: alpha(theme.palette.background.hover, 0.2)
        },

        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },

    themeItemSelected: {
        outline: `none`,
        border: `1px solid ${theme.palette.border.inputOnFoucs}`
    },
    themeListItemTitleInput: {
        flex: 1,
        '& .MuiInputBase-root': {
            fontSize: '1.4rem',
            color: theme.palette.text.default,
            '&:before': {
                display: 'none'
            },
            '&:after': {},
            '&:hover:before': {
                display: 'unset'
            }
        },
        '& .MuiInput-underline:before': {
            borderBottom: 'none'
        },
        '& .MuiInput-underline:hover:before': {
            borderBottom: 'none'
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'none'
        }
    },
    mainColorThumbnailContainer: {
        width: '3.6rem',
        height: '2.8rem',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative'
    },
    mainColorThumbnail: {
        flex: 1,
        background: 'var(--mainColor)'
    },
    themeEditorRoot: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column'
    },
    tabSectionRoot: {
        borderBottom: `1px solid ${alpha(theme.palette.border.light, 0.2)}`,
        display: 'flex',
        alignItems: 'center'
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5rem',
        alignItems: 'center',
        justifyContent: 'between'
    },
    tabs: {
        flex: 1,
        '& button': {
            // borderRadius: 0,
            letterSpacing: '1px'
        }
    },
    actionButtonsWrapper: {
        padding: '0px 2rem',
        height: '100%',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        borderTop: `2px solid ${theme.palette.primary.dark}`,
        borderBottom: `2px solid ${theme.palette.primary.dark}`
    },
    unsavedIndicator: {
        position: 'absolute',
        right: '0',
        top: '0',
        color: theme.palette.text.unsavedText
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        width: '60%',
        letterSpacing: '1.5px',
        color: theme.palette.text.default,
        display: 'flex',
        opacity: '0.8'
    },
    closeButton: {
        width: '4rem',
        height: '4rem',
        padding: '0',
        margin: '0',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2.4rem',
            height: '2.4rem'
        }
    },
    dialogPaper: {
        width: '30%',
        backdropFilter: 'blur(2rem)',
        borderRadius: 'unset'
    },
    dialogRoot: {
        margin: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    dialogContentSection: {
        padding: '1.6rem'
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.67rem'
    },
    dialogLines: {
        fontSize: '1.67rem',
        fontWeight: '400',
        '& span': {
            fontWeight: '500'
        }
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        marginLeft: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
        }
    },
    assumptionsIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: '2rem !important',
        width: '2rem !important',
        '& svg': {
            fill: `${theme.palette.primary.contrastText} !important`
        }
    },
    themeInfo: {
        fontSize: '1.4rem',
        lineHeight: '2rem',
        letterSpacing: theme.layoutSpacing(0.5),
        fontWeight: 400
    },
    themeInfoName: {
        fontWeight: 500
    },
    themeInfoWrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '1.2rem',
        height: '4.4rem',
        backgroundColor:
            theme.props.mode === 'light'
                ? theme.palette.background.themeInfoBg
                : theme.palette.background.overviewSelected
    },
    themeNote: {
        color: theme.palette.text.default,
        lineHeight: '1.6rem',
        fontSize: '1.4rem',
        fontWeight: '400'
    },
    themeNoteBold: {
        fontWeight: '500',
        lineHeight: '1.6rem',
        fontSize: '1.4rem'
    },
    themeUnselectedWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    themeUnselected: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    themeSelectTextIcon: {
        marginBottom: '1rem',
        '&:hover': {
            background: 'none',
            cursor: 'default'
        },
        '& svg': {
            fill: theme.palette.text.default,
            width: '9.2rem',
            height: '9.2rem',
            '&:hover': {
                cursor: 'default'
            }
        }
    },

    themeSelectText: {
        fontFamily: 'Graphik Compact',
        fontWeight: '400',
        fontSize: '2.4rem',
        lineHeight: '2.8rem',
        color: theme.palette.text.default
    },
    add: {
        fontSize: '1.6rem !important',
        '& svg': {
            width: '1rem',
            height: '1rem'
        }
    },
    inputOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '60%',
        cursor: 'pointer',
        zIndex: 2
    }
}));
const deleteActions = (cancelLabel, confirmLabel, setOpen, deleteAlertHandler) => (
    <React.Fragment>
        <Button variant="outlined" onClick={() => setOpen(false)} aria-label="Cancel Delete">
            {cancelLabel}
        </Button>
        <Button variant="contained" onClick={deleteAlertHandler} aria-label="Confirm Delete">
            {confirmLabel}
        </Button>
    </React.Fragment>
);
export default function ColorThemeUtil() {
    const classes = useStyles();
    const { refreshAppThemes } = useContext(CustomThemeContext);
    const [themes, setThemes] = useState([defaultTheme]);
    const [initialThemes, setInitialThemes] = useState([defaultTheme]);
    const [recentThemes, setRecentThemes] = useState([defaultTheme]);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedMode, setSelectedMode] = useState('light');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({});
    const [saveInProgress, setSaveInProgress] = useState(false);
    const [cloneOpen, setCloneOpen] = useState(false);
    const [copySource, setCopySource] = useState(null);
    let dialogContent = `Clicking on clone theme will create a copy of the selected ${themes?.[copySource]?.name} theme. Would you like to proceed?`;
    const themeListRef = useRef();

    useEffect(() => {
        setLoading(true);
        getAllAppThemes()
            .then((themes) => {
                const themesWithDefaults = [defaultTheme, ...themes];
                setThemes(themesWithDefaults);
                //deepy copying to mitigate referencing
                setInitialThemes(
                    themesWithDefaults.map((theme) => JSON.parse(JSON.stringify(theme)))
                );
            })
            .catch((error) => {
                setSnackbar({
                    open: true,
                    message: error?.response?.data?.error || 'Failed to get all themes.Try again!',
                    severity: 'error'
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const fetchedThemes = await getAllAppThemes();
            const themesWithDefaults = [defaultTheme, ...fetchedThemes];
            setThemes(themesWithDefaults.map((theme) => JSON.parse(JSON.stringify(theme))));
            setInitialThemes(themesWithDefaults.map((theme) => JSON.parse(JSON.stringify(theme))));
            setRecentThemes(themesWithDefaults.map((theme) => JSON.parse(JSON.stringify(theme))));
            setSelectedTheme(0);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error?.response?.data?.error || 'Failed to get all themes. Try again!',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (index, name) => {
        themes[index].name = name;
        themes[index].unsaved = true;
        setThemes([...themes]);
        setRecentThemes(themes.map((theme) => JSON.parse(JSON.stringify(theme))));
    };

    const handleThemeSelection = (index) => {
        setSelectedTheme(index);
    };

    const handleThemeModeChange = (mode) => {
        setSelectedMode(mode);
        // setTheme(getTheme(mode, themeId))
    };

    const handleThemeChange = (themeData) => {
        const newThemes = [...themes];
        newThemes[selectedTheme] = { ...newThemes[selectedTheme], ...themeData, unsaved: true };
        setThemes(newThemes);
        setRecentThemes(newThemes.map((theme) => JSON.parse(JSON.stringify(theme))));
    };

    const undo = () => {
        // Deep copying the selected theme to prevent reference sharing
        const updatedThemes = themes.map((theme, index) => {
            if (index === selectedTheme) {
                return JSON.parse(JSON.stringify(initialThemes[selectedTheme]));
            }
            return theme;
        });
        updatedThemes[selectedTheme].unsaved = true;
        setThemes(updatedThemes);
    };

    const redo = () => {
        // Deep copying the selected theme from recentThemes to prevent reference sharing
        const updatedThemes = themes.map((theme, index) => {
            if (index === selectedTheme) {
                return JSON.parse(JSON.stringify(recentThemes[selectedTheme]));
            }
            return theme;
        });
        setThemes(updatedThemes);
    };

    const discard = () => {
        // check if it's a newly added theme that you want to discard,
        // if yes, then process for removing it and set the selected theme to the default which is at index 0
        if (!initialThemes[selectedTheme]) {
            // Here we need to ensure that we reset themes based on a deep copy of initialThemes
            const updatedThemes = initialThemes.map((theme) => JSON.parse(JSON.stringify(theme)));
            setThemes(updatedThemes);
            setRecentThemes(updatedThemes);
            setSelectedTheme(0);
            setSnackbar({
                open: true,
                message: 'Changes discarded',
                severity: 'success'
            });
        } else {
            const updatedThemes = initialThemes.map((theme) => JSON.parse(JSON.stringify(theme)));
            setThemes(updatedThemes);
            setRecentThemes(updatedThemes);
            //check if the discard removed the
            setSelectedTheme(selectedTheme);
            setSnackbar({
                open: true,
                message: 'Changes discarded',
                severity: 'success'
            });
        }
    };

    const handleDelete = async (id, deleteConfirm) => {
        if (!deleteConfirm) {
            if (!themes[selectedTheme].unsaved && id !== null) {
                try {
                    const apps = await getAppsUnderThemeId(id);
                    return apps;
                } catch (err) {
                    setSnackbar({
                        open: true,
                        message: 'Error while processing deletion',
                        severity: 'error'
                    });
                    setLoading(false);
                    throw err;
                }
            }
        }
        if (deleteConfirm && id !== null) {
            try {
                await deleteTheme(id);
                setSnackbar({
                    open: true,
                    message: 'Theme successfully deleted',
                    severity: 'success'
                });
                refreshAppThemes();
                await fetchThemes();
                return;
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: 'Error while deleting the theme',
                    severity: 'error'
                });
            }
        }
    };

    const handleSave = async () => {
        const theme = themes[selectedTheme];

        if (!theme.name) {
            setSnackbar({
                open: true,
                message: 'Please add the Theme name!',
                severity: 'error'
            });
            document
                .getElementById('theme-item-' + selectedTheme)
                .getElementsByTagName('input')[0]
                ?.focus();
            return;
        }

        try {
            setSaveInProgress(true);
            if (theme.id) {
                await updateAppTheme(theme);
                setInitialThemes(themes.map((theme) => JSON.parse(JSON.stringify(theme))));
                setRecentThemes(themes.map((theme) => JSON.parse(JSON.stringify(theme))));
                themes[selectedTheme].unsaved = false;
            } else {
                const resp = await createAppTheme(theme);
                themes[selectedTheme].id = resp.id;
                themes[selectedTheme].unsaved = false;
                setThemes([...themes]);
                setInitialThemes(themes.map((theme) => JSON.parse(JSON.stringify(theme))));
                setRecentThemes(themes.map((theme) => JSON.parse(JSON.stringify(theme))));
            }
            setSnackbar({
                open: true,
                message: 'Theme saved Successfully!',
                severity: 'success'
            });
            await fetchThemes();
            refreshAppThemes();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.response?.data?.error || 'Failed to save!',
                severity: 'error'
            });
        } finally {
            setSaveInProgress(false);
        }
    };

    const handleCloneOpen = (i) => {
        try {
            if (i >= 0) {
                setCopySource(i);
                setCloneOpen(true);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Error while cloning',
                severity: 'error'
            });
        }
    };

    const handleAddTheme = (sourceIndex) => {
        try {
            const newAppTheme = JSON.parse(JSON.stringify(themes[sourceIndex]));
            newAppTheme.name = '';
            newAppTheme.readOnly = false;
            newAppTheme.id = null;
            newAppTheme.unsaved = true;
            const i = themes.length;
            setThemes((s) => [...s, newAppTheme]);
            setSelectedTheme(i);
            setTimeout(() => {
                themeListRef.current.scrollTo({
                    top: themeListRef.current.scrollHeight,
                    behavior: 'smooth'
                });
                document
                    .getElementById('theme-item-' + i)
                    .getElementsByTagName('input')[0]
                    ?.focus();
                document
                    .getElementById('theme-item-' + i)
                    .getElementsByTagName('input')[0]
                    ?.select();
            }, 300);
        } catch (err) {
            console.error('Error adding new theme: ', err);
            setSnackbar({
                open: true,
                message: 'There was an error adding the new theme.',
                severity: 'error'
            });
        }
    };

    if (loading) {
        return <CodxCircularLoader center />;
    }

    return (
        <div aria-label="root" className={classes.root}>
            <div aria-label="page-header" className={classes.pageHeader}>
                {/* if it's a read only theme, display that it can't be edited */}
                {themes?.[selectedTheme]?.readOnly ? (
                    <UtilsNavigation
                        path="/platform-utils"
                        backTo="Platform Utils"
                        title="Color Palette Generator"
                    >
                        <div className={classes.themeInfoWrapper}>
                            <div className={classes.iconContainer}>
                                <IconButton size="small" aria-label={'theme-info'}>
                                    <InfoOutlinedIcon
                                        fontSize="small"
                                        className={clsx(classes.assumptionsIcon)}
                                    />
                                </IconButton>
                            </div>
                            <Typography className={classes.themeInfo}>
                                {' '}
                                The selected theme{' '}
                                <span className={classes.themeInfoName}>
                                    {themes?.[selectedTheme]?.name}
                                </span>{' '}
                                cannot be edited. Clone theme to customize the color theme settings
                            </Typography>
                        </div>
                    </UtilsNavigation>
                ) : (
                    <UtilsNavigation
                        path="/platform-utils"
                        backTo="Platform Utils"
                        title="Color Palette Generator"
                    ></UtilsNavigation>
                )}
            </div>
            <Grid container aria-label="theme utils body" style={{ flex: 1 }} wrap="nowrap">
                <Grid
                    aria-label="theme list container"
                    item
                    xs={2}
                    className={classes.themeListNav}
                >
                    <div className={classes.themeNavTitleContainer}>
                        <Typography className={clsx(classes.textDefault, classes.title)}>
                            Theme List
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            title="add new app theme"
                            onClick={() => handleAddTheme(0)}
                            startIcon={<AddIcon className={classes.add} />}
                            aria-label="Add theme"
                        >
                            Add
                        </Button>
                    </div>
                    <div
                        aria-label="theme list"
                        className={classes.themeList}
                        key={themes.length + 'list'}
                        ref={themeListRef}
                    >
                        <Typography className={classes.themeNote}>
                            <span className={classes.themeNoteBold}></span>Note: Locked themes are
                            not editable.
                            <br></br> Clone the theme to customize it.
                        </Typography>

                        {themes?.map((el, i) => (
                            <ThemeListItem
                                key={el.id + i}
                                id={'theme-item-' + i}
                                theme={el}
                                classes={classes}
                                readOnly={el.readOnly}
                                selected={selectedTheme === i}
                                onNameChange={handleNameChange.bind(null, i)}
                                onSelect={handleThemeSelection.bind(null, i)}
                                onCopy={() => {
                                    console.log(i);
                                    handleCloneOpen(i);
                                }}
                                onDelete={handleDelete.bind(null, el?.id)}
                            />
                        ))}
                    </div>
                </Grid>
                {selectedTheme == null && (
                    <div className={classes.themeUnselectedWrapper}>
                        <div className={classes.themeUnselected}>
                            <IconButton
                                size="medium"
                                title="Select Themes"
                                className={classes.themeSelectTextIcon}
                                aria-label="locked"
                            >
                                <NoThemeIcon fontSize="medium"></NoThemeIcon>
                            </IconButton>
                            <Typography className={classes.themeSelectText}>
                                Select a theme to continue
                            </Typography>
                        </div>
                    </div>
                )}
                {selectedTheme !== null && (
                    <Grid item={9} className={classes.themeEditorRoot}>
                        <div className={classes.tabSectionRoot}>
                            <div style={{ flexShrink: 0, flex: 1 }}>
                                <WizardComponent
                                    selected={selectedMode}
                                    wizardItems={[
                                        {
                                            value: 'light',
                                            title: 'Light Mode',
                                            label: 'Light Mode'
                                        },
                                        { value: 'dark', title: 'Dark Mode', label: 'Dark Mode' }
                                    ]}
                                    onSelect={(e, v) => handleThemeModeChange(v)}
                                />
                            </div>
                            <div className={classes.actionButtonsWrapper}>
                                {themes?.[selectedTheme]?.readOnly ? null : (
                                    <Button
                                        disabled={saveInProgress || !themes[selectedTheme]?.unsaved}
                                        className={classes.undo}
                                        variant="text"
                                        size="small"
                                        onClick={undo}
                                        aria-label="Undo changes"
                                    >
                                        <Undo></Undo> &nbsp;<span> Undo</span>
                                    </Button>
                                )}
                                {themes?.[selectedTheme]?.readOnly ? null : (
                                    <Button
                                        disabled={saveInProgress || !themes[selectedTheme]?.unsaved}
                                        variant="text"
                                        size="small"
                                        onClick={redo}
                                        aria-label="Redo changes"
                                        className={classes.redo}
                                    >
                                        <Redo></Redo> &nbsp;<span>Redo</span>
                                    </Button>
                                )}
                                {themes?.[selectedTheme]?.readOnly ? null : (
                                    <Button
                                        disabled={!themes[selectedTheme]?.unsaved || saveInProgress}
                                        variant="outlined"
                                        size="small"
                                        onClick={discard}
                                        aria-label="Discard changes"
                                        className={classes.discard}
                                    >
                                        Discard
                                    </Button>
                                )}
                                {themes?.[selectedTheme]?.readOnly && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            handleCloneOpen(selectedTheme);
                                        }}
                                        aria-label="Clone Theme"
                                        className={classes.discard}
                                    >
                                        Clone Theme
                                    </Button>
                                )}
                                {themes && themes[selectedTheme]?.readOnly ? null : (
                                    <Button
                                        disabled={saveInProgress}
                                        variant="contained"
                                        size="small"
                                        onClick={handleSave}
                                        aria-label="Save theme"
                                        className={classes.discard}
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <ThemeEditor
                                themeData={themes[selectedTheme]}
                                readOnly={themes[selectedTheme]?.readOnly}
                                defaultObject={themes[selectedTheme]?.defaultObject}
                                mode={selectedMode}
                                onChange={handleThemeChange}
                            />
                        </div>
                    </Grid>
                )}
            </Grid>
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
                severity={snackbar.severity}
            />
            <CodxPopupDialog
                open={cloneOpen}
                setOpen={setCloneOpen}
                onClose={() => {
                    setCloneOpen(false);
                }}
                dialogTitle="Clone Theme"
                dialogContent={dialogContent}
                dialogActions={deleteActions(
                    'Cancel',
                    'Proceed',
                    () => {
                        setCloneOpen(false);
                        setCopySource(null);
                    },
                    () => {
                        handleAddTheme(copySource);
                        setCloneOpen(false);
                        setCopySource(null);
                    }
                )}
                maxWidth="xs"
                dialogClasses={classes}
            />
            <Prompt
                when={themes.some((el) => el.unsaved)}
                message="You have unsaved changes. If you exit page, the changes will be lost."
            />
        </div>
    );
}

function ThemeListItem({
    theme,
    classes,
    selected,
    readOnly,
    onNameChange,
    onSelect,
    onCopy,
    onDelete,
    ...props
}) {
    const [deleteOpen, setOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(
        'Are you sure you want to delete this alert'
    );
    const [hasUserEdited, setUserEdited] = useState(false);

    const deleteConfirmHandler = async () => {
        onDelete(true);
        setOpen(false);
    };

    const handleDeleteOpen = async () => {
        let values;
        try {
            values = await onDelete();
            if (values && values.length > 0) {
                getDialogContent(theme?.name);
                setDialogContent(getDialogContent(theme?.name, values));
                setOpen(true);
            } else {
                setOpen(true);
                setDialogContent('Are you sure you want to delete this theme?');
            }
        } catch (err) {
            setOpen(false);
            console.error(err);
            return;
        }
    };

    const getDialogContent = (themeName, values) => {
        return (
            <Fragment>
                <Typography className={classes.dialogLines}>
                    Deleting the theme{' '}
                    <span className={classes.dialogLines}>{themeName ? themeName : ''}</span> will
                    revert back the following applications&apos; theme settings to{' '}
                    <span>NucliOS Default</span>
                </Typography>
                <ul className={classes.dialogLines}>
                    {values?.map((el, index) => (
                        <li key={index}>{el}</li>
                    ))}
                </ul>
                <Typography
                    className={classes.dialogLines}
                >{`Are you sure you want to proceed ?`}</Typography>
            </Fragment>
        );
    };
    const handleSelect = () => {
        onSelect();
    };

    const handleChange = (e) => {
        if (!hasUserEdited) {
            setUserEdited(true);
        }
        onNameChange(e.target.value);
    };

    return (
        <div
            className={clsx(classes.themeItemRoot, selected && classes.themeItemSelected)}
            onClick={handleSelect}
            {...props}
        >
            <TextField
                className={classes.themeListItemTitleInput}
                value={theme?.name == '' && hasUserEdited == false ? 'Enter Name' : theme.name}
                onChange={handleChange}
                inputProps={{ 'aria-label': `color-select-${theme.name ? theme.name : 'theme'}` }}
                disabled={readOnly}
                id={`color ${theme.name ? theme.name : 'theme'}`}
            />

            {readOnly && (
                <div
                    className={classes.inputOverlay}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelect();
                    }}
                ></div>
            )}
            <IconButton
                title="clone"
                size="medium"
                onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                }}
                className={classes.copyButton}
                aria-label="Clone"
            >
                {' '}
                <CopyIcon fontSize="medium" />
            </IconButton>
            {!theme?.readOnly && !theme.unsaved ? (
                <IconButton
                    size="medium"
                    title="delete"
                    className={classes.deleteIcon}
                    aria-label="locked"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOpen();
                    }}
                >
                    <DeleteOutlineIcon fontSize="large"></DeleteOutlineIcon>
                </IconButton>
            ) : null}

            <div className={classes.mainColorThumbnailContainer} title="select">
                {theme.modes.map((el) => (
                    <div
                        key={el.mode}
                        style={{ '--mainColor': el.contrast_color }}
                        className={classes.mainColorThumbnail}
                    />
                ))}
                {theme?.readOnly ? (
                    <IconButton
                        size="medium"
                        title="lock"
                        className={classes.lockButton}
                        aria-label="locked"
                    >
                        <LockIcon fontSize="medium"></LockIcon>
                    </IconButton>
                ) : null}
            </div>

            {theme.unsaved ? (
                <FiberManualRecordIcon
                    title="Unsaved changes"
                    fontSize="small"
                    className={classes.unsavedIndicator}
                    color="inherit"
                />
            ) : null}
            <CodxPopupDialog
                open={deleteOpen}
                setOpen={setOpen}
                onClose={() => setOpen(false)}
                dialogTitle="Warning"
                dialogContent={dialogContent}
                dialogActions={deleteActions(
                    'Cancel',
                    'Yes, Proceed',
                    setOpen,
                    deleteConfirmHandler
                )}
                maxWidth="xs"
                dialogClasses={classes}
            />
        </div>
    );
}
