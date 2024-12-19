import React, { useCallback, useEffect, useState } from 'react';
import {
    alpha,
    Box,
    Button,
    CircularProgress,
    ClickAwayListener,
    Divider,
    Grow,
    IconButton,
    makeStyles,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import CodxCircularLoader from '../../CodxCircularLoader';
import DefaultProjectData from './defaultProject.json';
import LinearProgressBar from '../../LinearProgressBar';
import { red /*, yellow*/ } from '@material-ui/core/colors';
import HistoryIcon from '@material-ui/icons/History';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import clsx from 'clsx';
import PDFrameworkSection from './PDFramewokSection';
import {
    deleteAttachment,
    downloadPPT,
    getProject,
    getUsers,
    saveProject,
    getReviewers,
    createNewVersion,
    setAsCurrentVersion,
    getVersionData
} from '../../../services/project';
import { getDeepValue, setDeepValue } from '../../../util';
import { useDebouncedEffect } from '../../../hooks/useDebounceEffect';
import { isSubSectionCompleted } from './util';
import CustomSnackbar from '../../CustomSnackbar';
import ConfirmPopup from '../../confirmPopup/ConfirmPopup';
import DownloadButton from './DownloadButton';
import { Prompt } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRef } from 'react';
import { PDFrameworkContextProvider } from './PDFrameworkContext';
import { logMatomoEvent } from '../../../services/matomo';
import { connect } from 'react-redux';
import CodxPopupDialog from '../../custom/CodxPoupDialog';
import CustomTextField from '../../Forms/CustomTextField';
import PDFrameworkVersions from '../PDFrameworkVersions';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from '../../../util/decodeHtmlEntities';
const useStyles = makeStyles((theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative'
    },
    body: {
        height: `calc(100% - ${theme.spacing(12)})`
    },
    selectedTab: {
        background: theme.palette.primary.dark,
        maxWidth: 'unset'
    },
    tabRoot: {
        borderRadius: 0,
        padding: '1rem 2rem'
    },
    progressStatus: {
        color: theme.props?.mode === 'dark' ? '#FFB547' : '#6883F7',
        position: 'relative',
        top: '-0.5em',
        fontSize: '2rem',
        fontWeight: 500
    },
    tabPanel: {
        flex: 1,
        background: theme.palette.primary.dark
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.4rem'
    },
    bold: {
        fontWeight: 700
    },
    pale: {
        fontWeight: 100
    },
    cancelBtn: {
        textTransform: 'none',
        color: red['A100'],
        fontWeight: '400',
        '& svg': {
            color: red['A100']
        },
        '&:hover': {
            color: red['A100']
        }
    },
    saveBtn: {
        textTransform: 'none',
        color: theme.palette.primary.contrastText,
        fontWeight: '400',
        '& svg': {
            color: theme.palette.primary.contrastText
        },
        '&:hover': {
            color: theme.palette.text.peachText
        },
        '&.Mui-disabled': {
            '& svg': {
                color: 'inherit'
            }
        }
    },
    pastVersion: {
        textTransform: 'none',
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(4),
        border: 'none',
        zIndex: 1,
        '& svg': {
            color: theme.palette.primary.contrastText
        },
        '&:hover': {
            '& svg': {
                color: theme.palette.primary.dark
            }
        }
    },
    lastUpdate: {
        position: 'absolute',
        zIndex: 1,
        top: theme.spacing(4),
        left: theme.spacing(24)
    },
    layout: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(1)
    },
    textStyle: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        letterSpacing: '0.2rem'
    },
    currentVersion: {
        textTransform: 'none',
        position: 'absolute',
        top: theme.spacing(1.5),
        right: theme.spacing(40),
        zIndex: 1
    },
    viewVersionName: {
        color:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? theme.palette.text.peachText
                : theme.palette.text.default,
        backgroundColor:
            localStorage.getItem('codx-products-theme') !== 'dark'
                ? theme.palette.text.default
                : theme.palette.primary.contrastText,
        padding: '1rem 2rem 1rem 2rem',
        position: 'absolute',
        top: theme.spacing(2),
        left: '50%',
        fontSize: theme.spacing(1.6),
        borderRadius: '0.6rem',
        letterSpacing: '0.1rem',
        zIndex: 1100
    },
    verticlaDivider: {
        background: alpha(theme.palette.text.default, 0.4),
        height: '2em',
        alignSelf: 'center'
    },
    progressBar: {
        borderRadius: '4px',
        '& .MuiLinearProgress-bar': {
            boxShadow: '0px 0px 1px 0px black inset',
            backgroundColor: theme.props?.mode === 'dark' ? '#FFB547' : '#6883F7'
        }
    },
    menuItem: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.text.primary
        }
    },
    loader: {
        color: theme.palette.primary.contrastText
    }
}));
const dialogStyles = makeStyles((theme) => ({
    dialogContent: {
        border: 'none',
        marginTop: theme.spacing(5)
    },
    dialogRoot: {
        background: theme.palette.background.dialogTitle,
        display: 'flex',
        justifyContent: 'space-between'
    }
}));
const historyDialogStyles = makeStyles((theme) => ({
    dialogContent: {
        border: 'none'
    },
    dialogContentSection: {
        marginBottom: 0,
        padding: theme.spacing(1),
        width: '100%'
    },
    dialogRoot: {
        background: theme.palette.background.dialogTitle,
        display: 'flex',
        justifyContent: 'space-between'
    }
}));
const TotalSteps = (() => {
    let steps = 0;
    DefaultProjectData.sections.forEach((s) => s.subSections.forEach(() => (steps += 1)));
    return steps;
})();

const Project = {
    id: 0,
    name: '',
    industry: '',
    project_status: 1,
    assignees: null,
    reviewer: null,
    account: '',
    problem_area: '',
    content: {},
    origin: 'PDF'
};

const UnsavedPrompt = 'Changes you made may not be saved.';

function PDFrameworkCreateProject({ user_info, ...props }) {
    const classes = useStyles();
    const dialogClasses = dialogStyles();
    const historyDialogClasses = historyDialogStyles();
    let versionData;
    let past_version_id = props.match.params.versionId;
    if (props.location.state?.versionData) versionData = props.location.state.versionData;
    const projectId = props.match.params.projectId;
    const [project, setProject] = useState(JSON.parse(JSON.stringify(Project)));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(JSON.parse(JSON.stringify(DefaultProjectData)));
    const [tab, setTab] = useState(0);
    const [completedSubSteps, setCompletedSubSteps] = useState(0);
    const [completionMap, setCompletionMap] = useState({});
    const [notification, setNotification] = useState({});
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [saveProcessing, setSaveProcessing] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(false);
    const [unsaved, setUnsaved] = useState(false);
    const viewPage = window.location.pathname.includes('/view');
    const [uneditable, setUneditable] = useState(viewPage);
    const [popupDialog, setPopupDialog] = useState(false);
    const [versionName, setVersionName] = useState('');
    const [viewVersionName, setviewVersionName] = useState('');
    const [isCurrentVersion, setIsCurrentVersion] = useState();
    const [historyPopup, setHistoryPopup] = useState(false);
    const [finish, setFinish] = useState(false);
    //For save dropdown
    const saveMenuRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
        setPopupDialog(false);
    };

    const handleClose = (event) => {
        if (saveMenuRef.current && saveMenuRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleNewVersion = async () => {
        setPopupDialog(false);
        const newProject = convertData(data, project, false, uneditable);
        newProject.version_name = versionName;
        if (projectId) newProject.project_id = projectId;
        if (!(newProject.name && newProject.industry)) {
            setNotification({
                message: 'Please fill up the mandatory fields in the Project Details.',
                severity: 'error'
            });
            setNotificationOpen(true);
            setOpen(false);
            return;
        }
        const resp = await handleData(createNewVersion, newProject);
        setVersionName('');
        if (projectId) {
            handleRouteChange(resp.version_id, projectId);
        } else {
            handleRouteChange(resp.version_id, resp.id);
        }
    };

    const handleRouteChange = async (version_id, project_id) => {
        if (finish) {
            setTimeout(() => props.history.push('/projects/'), 2000);
            return;
        }
        try {
            const response = await getVersionData(project_id, version_id);
            setTimeout(() => {
                props.history.push(`/projects/${project_id}/version/${version_id}/edit`, {
                    versionData: response
                });
                setNotification(false);
            }, 1000);
        } catch (error) {
            setNotification({
                message:
                    error.response?.data?.error ||
                    'Failed to load newly created version.Try again!',
                severity: 'error'
            });
            setNotificationOpen(true);
        }
    };
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            saveMenuRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    // const { trackEvent } = useMatomo()

    // clean up unused files at component destroy
    const dataRef = useRef(data);
    const projectRef = useRef(project);
    useEffect(() => {
        return () => {
            const data = dataRef.current;
            const project = projectRef.current;
            deleteUnusedFiles(data, project);
        };
    }, []);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        projectRef.current = project;
    }, [project]);

    useEffect(() => {
        if (unsaved) {
            window.onbeforeunload = () => {
                return UnsavedPrompt;
            };
        }
        return () => {
            window.onbeforeunload = null;
        };
    }, [unsaved]);

    useEffect(() => {
        (async () => {
            const [{ value: users }, { value: reviewers }] = await Promise.allSettled([
                getUsers({
                    _end: 10,
                    _order: 'ASC',
                    _sort: 'name',
                    _start: 0
                }),
                getReviewers({
                    _end: 10,
                    _order: 'ASC',
                    _sort: 'name',
                    _start: 0
                })
            ]);
            setData((d) => {
                d.sections[0].subSections[0].content.fields.forEach((el) => {
                    if (el.name === 'assignees') {
                        el.options = users;
                    } else if (el.name === 'reviewer') {
                        el.options = reviewers;
                    }
                });
                return { ...d };
            });
        })();
    }, []);

    const handleSetAsCurrentVersion = async () => {
        try {
            const payload = {
                version_id: past_version_id
            };
            await setAsCurrentVersion(projectId, payload);
            setIsCurrentVersion(true);
            setNotification({ message: 'Current version changed successfully' });
            setNotificationOpen(true);
        } catch (error) {
            setNotification({
                message: error.response?.data?.error || 'Failed to set. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        }
    };

    const sanitizeHTML = (Html) => {
        return sanitizeHtml(Html);
    };

    const sanitizeContent = (content) => {
        let newContent = {};
        for (const key in content) {
            if (typeof content[key] === 'object' && key !== 'attachments') {
                newContent[key] = { ...sanitizeContent(content[key]) };
            } else if (key === 'attachments') {
                newContent[key] = content[key];
            } else {
                newContent[key] = content[key] !== 'undefined' ? sanitizeHTML(content[key]) : '';
            }
        }
        return newContent;
    };

    const sanitizeProject = (project) => {
        return {
            ...project,
            content: sanitizeContent(project.content)
        };
    };

    const loadProjectData = useCallback(
        async (projectId) => {
            try {
                setLoading(true);
                const project = await getProject(projectId);
                if (versionData) {
                    project.content = versionData.content;
                    setIsCurrentVersion(versionData.is_current);
                    setviewVersionName(versionData.version_name);
                } else {
                    setIsCurrentVersion(project.is_current);
                    setviewVersionName(project.version_name);
                }
                let sanitizedProject = decodeHtmlEntities(sanitizeProject(project));
                setProject(sanitizedProject);
                const uneditable = viewPage ? true : !project?.user_access?.edit;
                setUneditable(uneditable);
                const d = convertData(data, sanitizedProject, true, uneditable);
                if (project.version_id) {
                    d.version_id = project.version_id;
                }
                setData(d);
            } catch (err) {
                setNotification({
                    message: err.response?.data?.error || 'Failed to load project. Try again.',
                    severity: 'error'
                });
                setNotificationOpen(true);
            } finally {
                setLoading(false);
            }
        },
        [past_version_id, projectId]
    );

    useEffect(() => {
        if (projectId || past_version_id) {
            loadProjectData(projectId, past_version_id);
        }
    }, [projectId, past_version_id]);

    useDebouncedEffect(
        () => {
            const completionMap = {};
            let completedSubSteps = 0;
            data.sections.forEach((section) => {
                section.subSections.forEach((subSection) => {
                    const completed = isSubSectionCompleted(subSection);
                    completionMap[subSection.name] = completed;
                    if (completed) {
                        completedSubSteps += 1;
                    }
                });
            });
            setCompletedSubSteps(completedSubSteps);
            setCompletionMap(completionMap);
        },
        [data],
        1000
    );

    const handleTabChange = (e, v) => {
        setTab(v);
    };
    const handleNext = useCallback(() => {
        setTab((s) => s + 1);
    }, []);

    const handleSaveNewVersion = (event) => {
        if (saveMenuRef.current && saveMenuRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
        setPopupDialog(true);
    };

    const dialogContent = (
        <CustomTextField
            field_info={{
                label: 'Version name',
                id: 'version_name',
                fullWidth: true,
                required: true,
                onChange: (value) => setVersionName(value),
                value: versionName
            }}
        ></CustomTextField>
    );

    const dialogActions = (
        <>
            <Button
                variant="outlined"
                onClick={() => setPopupDialog(false)}
                aria-label="Cancel Save"
            >
                Cancel
            </Button>
            <Button
                variant="contained"
                onClick={() => handleNewVersion()}
                aria-label="Confirm Save"
                disabled={!versionName}
            >
                Save
            </Button>
        </>
    );
    const cancelBtn = (
        <>
            <Divider orientation="vertical" flexItem className={classes.verticlaDivider} />
            <ConfirmPopup
                onConfirm={() => props.history.push('/projects')}
                subTitle="Cancel and move to projects list."
            >
                {(triggerConfirm) => (
                    <Button
                        className={classes.cancelBtn}
                        onClick={triggerConfirm}
                        aria-label="Cancel"
                    >
                        Cancel
                    </Button>
                )}
            </ConfirmPopup>
        </>
    );
    const saveBtn = (
        <>
            <Button
                className={classes.saveBtn}
                onClick={() => handleSave()}
                disabled={saveProcessing}
                aria-label="Save"
            >
                Save
            </Button>
            {props.match.path === '/projects/create' ? (
                <CodxPopupDialog
                    open={popupDialog}
                    setOpen={setPopupDialog}
                    dialogTitle="Save as"
                    dialogContent={dialogContent}
                    dialogActions={dialogActions}
                    maxWidth="xs"
                    dialogClasses={dialogClasses}
                    onClose={() => setPopupDialog(false)}
                />
            ) : null}
        </>
    );
    const historyDialogTitle = (
        <>
            <Box className={clsx(classes.backButton, classes.layout)} component={'span'}>
                <Typography className={classes.textStyle}>{project.name}, </Typography>
                <Typography className={classes.textStyle}>{project.industry}</Typography>
            </Box>
        </>
    );
    const handleData = async (api, newProject) => {
        try {
            setOpen(false);
            setSaveProcessing(true);
            let sanitizedProject = sanitizeProject(newProject);
            const resp = await api(sanitizedProject);
            setProject(sanitizedProject);
            logMatomoEvent({
                e_c: 'PDFramework',
                e_a: 'success-event-of-finish-project',
                action_name: 'PDFramework',
                ca: 1,
                url: window.location.href,
                // urlref: window.location.href,
                pv_id: props.matomo.pv_id
            });
            setNotification({ message: 'Saved Successfully' });
            setNotificationOpen(true);
            setUnsaved(false);
            return resp;
        } catch (err) {
            logMatomoEvent({
                e_c: 'PDFramework',
                e_a: 'failed-event-of-finish-project',
                action_name: 'PDFramework',
                ca: 1,
                url: window.location.href,
                // urlref: window.location.href,
                pv_id: props.matomo.pv_id
            });
            setNotification({
                message: err.response?.data?.error || 'Failed to save. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        } finally {
            setSaveProcessing(false);
        }
    };
    const handleSave = async (finish) => {
        const newProject = convertData(data, project, false, uneditable);
        newProject.version_id = past_version_id;
        if (!(newProject.name && newProject.industry)) {
            setNotification({
                message: 'Please fill up the mandatory fields in the Project Details.',
                severity: 'error'
            });
            setNotificationOpen(true);
            setOpen(false);
            return;
        }
        if (props.match.path === '/projects/create') {
            if (finish) setFinish(true);
            setPopupDialog(true);
            return;
        }
        const resp = await handleData(saveProject, newProject);
        setTimeout(() => {
            if (finish) {
                props.history.push(`/projects`);
            } else if (!newProject.id) {
                props.history.push(`/projects/${resp.id}/version/${resp.version_id}/edit`);
                //To remove notification after changing pathname
                setNotification(false);
            }
        }, 1000);
    };

    const handleFinish = () => {
        logMatomoEvent({
            e_c: 'PDFramework',
            e_a: 'click-event-of-finish-project',
            action_name: 'PDFramework',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        handleSave(true);
    };
    const handleDownload = async () => {
        setDownloadProgress(true);
        const downloaded_by =
            user_info.first_name || user_info.last_name
                ? user_info.first_name + ' ' + user_info.last_name
                : '--';
        try {
            const resp = await downloadPPT({ ...project, downloaded_by });
            saveData(resp.data, project.name + '.pptx');
        } catch (err) {
            setNotification({
                message: err.response?.data?.error || 'Failed to download. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        } finally {
            setDownloadProgress(false);
        }
    };

    if (loading) {
        return <CodxCircularLoader data-testid="circularload" size={60} center />;
    }

    const completionPercentage = Math.round((100 * completedSubSteps) / TotalSteps) || 0;

    return (
        <PDFrameworkContextProvider uneditable={uneditable} hideFinishButton={uneditable}>
            <div
                aria-label="pd framework create root"
                style={{
                    padding: '0 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                {viewVersionName ? (
                    <Typography variant="container" className={classes.viewVersionName}>
                        You are viewing{' '}
                        <strong>
                            {viewVersionName} {isCurrentVersion ? '(current version)' : ''}
                        </strong>
                    </Typography>
                ) : null}
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            zIndex: 1
                        }}
                    >
                        <IconButton
                            title="go back"
                            onClick={() => props.history.push('/projects/list')}
                            size="small"
                            className={classes.backButton}
                            aria-label="go back"
                        >
                            <ArrowBackIosIcon fontSize="large" />
                        </IconButton>
                    </div>
                    {props.match.path !== '/projects/create' ? (
                        <Button
                            variant="contained"
                            className={classes.pastVersion}
                            startIcon={<HistoryIcon />}
                            onClick={() => setHistoryPopup(true)}
                            aria-label="Version History"
                        >
                            Version History
                        </Button>
                    ) : null}
                    <CodxPopupDialog
                        open={historyPopup}
                        setOpen={setHistoryPopup}
                        dialogContent={
                            <PDFrameworkVersions
                                projectId={projectId}
                                setHistoryPopup={setHistoryPopup}
                                user_access={project.user_access}
                            />
                        }
                        dialogTitle={historyDialogTitle}
                        dialogClasses={historyDialogClasses}
                        onClose={() => setHistoryPopup(false)}
                        maxWidth="md"
                    ></CodxPopupDialog>
                    {!isCurrentVersion && props.match.path !== '/projects/create' && !uneditable ? (
                        <Button
                            variant="outlined"
                            className={classes.currentVersion}
                            onClick={handleSetAsCurrentVersion}
                            aria-label="Set as current version"
                        >
                            Set as current version
                        </Button>
                    ) : null}

                    <Tabs aria-label="tabs" value={tab} onChange={handleTabChange} centered>
                        {data?.sections.map((section, index) => (
                            <Tab
                                key={section.title + index}
                                data-testid={section.title + ' tab'}
                                label={
                                    <div style={{ textTransform: 'none' }}>
                                        <Typography
                                            variant="h5"
                                            align="center"
                                            noWrap
                                            className={clsx(
                                                classes.colorContrast,
                                                classes.fontSize1,
                                                classes.letterSpacing1,
                                                classes.bold
                                            )}
                                            title={section.title}
                                        >
                                            {section.title}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            align="center"
                                            noWrap
                                            className={clsx(
                                                classes.colorDefault,
                                                classes.letterSpacing1,
                                                classes.fontSize2,
                                                classes.pale
                                            )}
                                            title={section.desc}
                                        >
                                            {index === tab ? section.desc : ''}
                                        </Typography>
                                    </div>
                                }
                                classes={{
                                    selected: classes.selectedTab,
                                    root: classes.tabRoot
                                }}
                            />
                        ))}
                    </Tabs>
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {uneditable ? null : tab === 0 ? (
                            <>
                                {saveBtn}
                                {cancelBtn}
                            </>
                        ) : props.match.path === '/projects/create' ? (
                            <>
                                {saveBtn}
                                {cancelBtn}
                            </>
                        ) : (
                            <>
                                <Button
                                    className={classes.saveBtn}
                                    disabled={saveProcessing}
                                    ref={saveMenuRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleToggle}
                                    aria-label="Save"
                                >
                                    Save
                                    <IconButton size="small" aria-label="Save dropdown">
                                        <KeyboardArrowDownIcon fontSize="large" />
                                    </IconButton>
                                </Button>
                                <Popper
                                    open={open}
                                    anchorEl={saveMenuRef.current}
                                    role={undefined}
                                    transition
                                    disablePortal
                                    style={{ zIndex: '10' }}
                                >
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin:
                                                    placement === 'bottom'
                                                        ? 'center top'
                                                        : 'center bottom'
                                            }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MenuList
                                                        autoFocusItem={open}
                                                        id="menu-list-grow"
                                                        onKeyDown={handleListKeyDown}
                                                    >
                                                        <MenuItem
                                                            onClick={() => handleSave()}
                                                            className={classes.menuItem}
                                                        >
                                                            Save
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={(e) => handleSaveNewVersion(e)}
                                                            className={classes.menuItem}
                                                        >
                                                            Save new version
                                                        </MenuItem>
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                                <CodxPopupDialog
                                    open={popupDialog}
                                    setOpen={setPopupDialog}
                                    dialogTitle="Save as"
                                    dialogContent={dialogContent}
                                    dialogActions={dialogActions}
                                    maxWidth="xs"
                                    dialogClasses={dialogClasses}
                                    onClose={() => setPopupDialog(false)}
                                />

                                {cancelBtn}
                            </>
                        )}
                        {downloadProgress ? (
                            <CircularProgress
                                title="Downlaod in progress"
                                size={20}
                                className={classes.loader}
                            />
                        ) : (
                            <DownloadButton disabled={!project.id} onDownload={handleDownload} />
                        )}
                    </div>
                </div>
                <div
                    aria-label="porgress status"
                    style={{ display: 'flex', flexWrap: 'nowrap', gap: '1rem', height: '1rem' }}
                >
                    <Typography variant="h5" className={clsx(classes.progressStatus)}>
                        {completedSubSteps}/{TotalSteps} Steps ({completionPercentage}%)
                    </Typography>
                    <div style={{ flex: 1 }}>
                        <LinearProgressBar
                            variant="determinate"
                            value={completionPercentage}
                            className={classes.progressBar}
                        />
                    </div>
                </div>
                <div aria-label="tab panel" className={classes.tabPanel}>
                    {data?.sections.map((section, index) => (
                        <TabPanel
                            key={section.title}
                            value={tab}
                            index={index}
                            style={{ height: '100%' }}
                        >
                            <PDFrameworkSection
                                section={section}
                                project={project}
                                last={index === data.sections.length - 1}
                                onNext={handleNext}
                                onChange={(e) => {
                                    data.sections[index] = e;
                                    setData({ ...data });
                                    setUnsaved(true);
                                }}
                                completionMap={completionMap}
                                saveProcessing={saveProcessing}
                                onFinish={handleFinish}
                            />
                        </TabPanel>
                    ))}
                </div>
                <CustomSnackbar
                    open={notificationOpen && notification?.message}
                    autoHideDuration={3000}
                    onClose={setNotificationOpen.bind(null, false)}
                    severity={notification?.severity || 'success'}
                    message={notification?.message}
                />
                <Prompt when={unsaved} message={() => UnsavedPrompt} />
            </div>
        </PDFrameworkContextProvider>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index ? children : null}
        </div>
    );
}

function saveData(attachment, fileName) {
    const data = Uint8Array.from(attachment.data);
    const content = new Blob([data.buffer], { type: attachment.type });

    const encodedUri = window.URL.createObjectURL(content);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);

    link.click();
}

function convertData(data, project, parse, uneditable) {
    data = JSON.parse(JSON.stringify(data));
    project = JSON.parse(JSON.stringify(project));
    data.sections.forEach((section) => {
        section.subSections.forEach((subSection) => {
            if (subSection.contentType === 'project-details-form') {
                subSection.content.fields.forEach((el) => {
                    if (el.name) {
                        if (parse) {
                            el.value = project[el.name];
                            el.disabled = uneditable;
                        } else {
                            project[el.name] = el.value;
                        }
                    }
                });
            } else if (subSection.contentType === 'grid-layout') {
                subSection.content.sections.forEach((sec) => {
                    if (['rich-text-box', 'rich-text-box:header1'].includes(sec.component)) {
                        if (parse) {
                            sec.params.content = project.content[sec.dataKey];
                            sec.params.readOnly = uneditable;
                        } else {
                            project.content[sec.dataKey] = sec.params.content;
                        }
                    }
                    if ('rich-text-box:attachment' === sec.component) {
                        if (parse) {
                            sec.params.content = project.content[sec.dataKey]?.content;
                            sec.params.attachments = project.content[sec.dataKey]?.attachments;
                            sec.params.readOnly = uneditable;
                        } else {
                            const data = {
                                content: sec.params.content,
                                attachments: sec.params.attachments
                            };

                            // removing files those were presnt in last saved version but not in the current version
                            if (project.content[sec.dataKey]?.attachments?.length) {
                                const oldAttachments = project.content[sec.dataKey].attachments.map(
                                    (el) => el.filename
                                );
                                const newAttachments = sec.params.attachments.map(
                                    (el) => el.filename
                                );
                                const deletedAttachments = oldAttachments.filter(
                                    (el) => !newAttachments.includes(el)
                                );
                                deletedAttachments.forEach((el) => {
                                    deleteAttachment(el);
                                });
                            }
                            project.content[sec.dataKey] = data;
                        }
                    }
                });
            } else if (subSection.contentType === 'constraints-table') {
                subSection.content.tableParams.rowData.forEach((row) => {
                    if (parse) {
                        row['desc'] = getDeepValue(project.content, row.descDataKey);
                        row['descParams']['coldef']['cellEditorParams']['readOnly'] = uneditable;
                    } else {
                        setDeepValue(project.content, row.descDataKey, row['desc']);
                    }
                });
            }
        });
    });
    if (parse) {
        return data;
    } else {
        return project;
    }
}

function deleteUnusedFiles(data, project) {
    data.sections.forEach((section) => {
        section.subSections.forEach((subSection) => {
            if (subSection.contentType === 'grid-layout') {
                subSection.content.sections.forEach((sec) => {
                    if ('rich-text-box:attachment' === sec.component) {
                        // removing files those were not present in last saved version
                        if (project.content && project.content[sec.dataKey]?.attachments?.length) {
                            const oldAttachments = project.content[sec.dataKey].attachments.map(
                                (el) => el.filename
                            );
                            const newAttachments = sec.params.attachments.map((el) => el.filename);
                            const unsavedNewAttachments = newAttachments.filter(
                                (el) => !oldAttachments.includes(el)
                            );
                            unsavedNewAttachments.forEach((el) => {
                                deleteAttachment(el);
                            });
                        } else {
                            const newAttachments = sec.params.attachments?.map((el) => el.filename);
                            if (newAttachments?.length) {
                                newAttachments.forEach((el) => {
                                    deleteAttachment(el);
                                });
                            }
                        }
                    }
                });
            }
        });
    });
}

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
    PDFrameworkCreateProject
);
