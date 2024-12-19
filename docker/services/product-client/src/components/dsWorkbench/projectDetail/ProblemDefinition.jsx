import React, { useCallback, useEffect, useState } from 'react';
import { alpha, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import CodxCircularLoader from '../../CodxCircularLoader';
import DefaultProjectData from './problemDefinition.json';
import clsx from 'clsx';
import PDFrameworkSection from '../../porblemDefinitionFramework/create/PDFramewokSection';
import { deleteAttachment, getProject, saveProject } from '../../../services/project';
import { useDebouncedEffect } from '../../../hooks/useDebounceEffect';
import { isSubSectionCompleted } from '../../porblemDefinitionFramework/create/util';
import CustomSnackbar from '../../CustomSnackbar';
import { Prompt, withRouter } from 'react-router-dom';
import { useRef } from 'react';
import { PDFrameworkContextProvider } from '../../porblemDefinitionFramework/create/PDFrameworkContext';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from '../../../util/decodeHtmlEntities';
import BrowseProblemDefinition from './BrowseProblemDefinition';
import { convertData } from './util';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        padding: '0 3rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
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
    loader: {
        color: theme.palette.primary.contrastText
    },
    tabs: {
        borderBottom: '1px solid ' + alpha(theme.palette.text.revamp, 0.15)
    },
    link: {
        position: 'absolute',
        top: '50%',
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 1,
        cursor: 'pointer',
        fontWeight: 500
    }
}));

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
    origin: 'DS-Workbench'
};

const UnsavedPrompt = 'Changes you made may not be saved.';

function ProblemDefinition({ ...props }) {
    const classes = useStyles();
    // const historyDialogClasses = historyDialogStyles();
    let versionData;
    let past_version_id = 0;
    if (props.location.state?.versionData) versionData = props.location.state.versionData;
    const projectId = props.match.params.projectId;
    const [project, setProject] = useState(JSON.parse(JSON.stringify(Project)));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(JSON.parse(JSON.stringify(DefaultProjectData)));
    const [tab, setTab] = useState(0);
    const [completionMap, setCompletionMap] = useState({});
    const [notification, setNotification] = useState({});
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [saveProcessing, setSaveProcessing] = useState(false);
    const [unsaved, setUnsaved] = useState(false);
    const viewPage = window.location.pathname.includes('/view');
    const [uneditable, setUneditable] = useState(viewPage);

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
                const project = await getProject(projectId, { pdfContent: 'true' });
                if (versionData) {
                    project.content = versionData.content;
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
            data.sections.forEach((section) => {
                section.subSections.forEach((subSection) => {
                    const completed = isSubSectionCompleted(subSection);
                    completionMap[subSection.name] = completed;
                });
            });
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

    const handleData = async (api, newProject) => {
        try {
            // setOpen(false);
            setSaveProcessing(true);
            let sanitizedProject = sanitizeProject(newProject);
            const resp = await api(sanitizedProject);
            setProject(sanitizedProject);
            setNotification({ message: 'Saved Successfully' });
            setNotificationOpen(true);
            setUnsaved(false);
            return resp;
        } catch (err) {
            setNotification({
                message: err.response?.data?.error || 'Failed to save. Try again.',
                severity: 'error'
            });
            setNotificationOpen(true);
        } finally {
            setSaveProcessing(false);
        }
    };

    const handleSave = async () => {
        const newProject = convertData(data, project, false, uneditable);
        // newProject.version_id = past_version_id;
        if (!(newProject.name && newProject.industry)) {
            setNotification({
                message: 'Please fill up the mandatory fields in the Project Details.',
                severity: 'error'
            });
            setNotificationOpen(true);
            // setOpen(false);
            return;
        }

        await handleData(saveProject, newProject);
        setTimeout(() => {
            props.history.push(`/ds-workbench/project/${projectId}/configure-develop/notebooks`);
            setNotification(false);
        }, 2000);
    };

    const handleFinish = () => {
        handleSave(true);
    };

    const handleImport = (data) => {
        setData(data);
        setLoading(true);
        requestAnimationFrame(() => {
            setLoading(false);
        });
        setUnsaved(true);
    };

    if (loading) {
        return <CodxCircularLoader data-testid="circularload" size={60} center />;
    }

    return (
        <PDFrameworkContextProvider
            uneditable={uneditable}
            actionButtonPosition={'bottom'}
            suppressBackground={true}
        >
            <div aria-label="Problem definition create root" className={classes.root}>
                <div style={{ position: 'relative' }}>
                    <BrowseProblemDefinition
                        classes={{ link: classes.link }}
                        onImport={handleImport}
                        currentProjectId={projectId}
                    />

                    <Tabs
                        aria-label="tabs"
                        value={tab}
                        onChange={handleTabChange}
                        centered
                        className={classes.tabs}
                    >
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

export default withRouter(ProblemDefinition);
