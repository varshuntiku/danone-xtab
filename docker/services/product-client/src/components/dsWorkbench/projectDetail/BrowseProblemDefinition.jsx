import {
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    TextField,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { getProjects, getProject } from '../../../services/project';
import { useDebouncedCallback } from '../../../hooks/useDebounceCallback';
import clsx from 'clsx';
import { convertData } from './util';
import CustomSnackbar from '../../CustomSnackbar';
import { decodeHtmlEntities } from '../../../util/decodeHtmlEntities';
import sanitizeHtml from 'sanitize-html-react';
import DefaultProjectData from './problemDefinition.json';
import { Search } from '@material-ui/icons';
import { PDFrameworkContextProvider } from '../../porblemDefinitionFramework/create/PDFrameworkContext';
import PDFrameworkSection from '../../porblemDefinitionFramework/create/PDFramewokSection';
import { useDebouncedEffect } from '../../../hooks/useDebounceEffect';
import { isSubSectionCompleted } from '../../porblemDefinitionFramework/create/util';
import CodxCircularLoader from '../../CodxCircularLoader';
import CloseIcon from '../../../assets/Icons/CloseBtn';

const useStyles = makeStyles((theme) => ({
    link: {
        color: theme.palette.background.infoBgDark,
        fontSize: theme.layoutSpacing(16)
    },
    contentRoot: {
        display: 'grid',
        gridTemplateColumns: `${theme.layoutSpacing(380)} 1fr`,
        padding: theme.layoutSpacing(12, 16),
        overflow: 'hidden'
    },
    pdContent: {
        padding: theme.layoutSpacing(16)
    },
    browseRoot: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        padding: theme.layoutSpacing(12, 16),
        overflow: 'hidden',
        borderRight: `1px solid ${theme.palette.separator.grey}`
    },
    dialogPaper: {
        width: `calc(100vw - ${theme.layoutSpacing(40)})`,
        height: `calc(100vh - ${theme.layoutSpacing(40)})`,
        maxHeight: 'none',
        maxWidth: 'none',
        overflow: 'hidden'
    },
    dialogTitle: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: theme.layoutSpacing(24),
            width: `calc(100% - ${theme.layoutSpacing(48)})`,
            height: '1px',
            background: theme.palette.separator.grey
        },
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(22),
            fontFamily: theme.title.h1.fontFamily,
            lineHeight: theme.layoutSpacing(36),
            color: theme.palette.text.default
        },
        '& svg': {
            fill: theme.palette.text.default
        }
    },
    list: {
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        listStyleType: 'none',
        // margin: 0,
        padding: theme.layoutSpacing(0, 2),
        margin: theme.layoutSpacing(0, -2),
        position: 'relative'
    },
    listItem: {
        width: '100%',
        padding: theme.layoutSpacing(16),
        cursor: 'pointer',
        minHeight: theme.layoutSpacing(76),
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 1px 4px 0px #00000040',
        borderRadius: theme.layoutSpacing(4),
        '&:hover': {
            background: alpha(theme.palette.background.navLinkBackground, 0.4)
        },
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(22),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        }
    },
    selectedListItem: {
        background: theme.palette.background.navLinkBackground
    },
    pdRoot: {
        flex: 1,
        padding: '0 3rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    tabs: {
        borderBottom: '1px solid ' + alpha(theme.palette.text.revamp, 0.15)
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
    tabPanel: {
        flex: 1,
        // background: theme.palette.primary.dark,
        position: 'relative'
    },
    emptyMessage: {
        display: 'grid',
        placeItems: 'center',
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(22),
            fontFamily: theme.title.h1.fontFamily,
            color: theme.palette.text.default
        },
        position: 'absolute',
        height: '100%',
        width: '100%',
        border: '1px solid ' + alpha(theme.palette.text.revamp, 0.2)
    },
    searchResult: {
        fontSize: theme.layoutSpacing(15),
        color: theme.palette.text.default,
        padding: theme.layoutSpacing(4, 16)
    },
    searchField: {
        '& svg': {
            fill: theme.palette.text.default,
            height: theme.layoutSpacing(16),
            width: theme.layoutSpacing(16)
        },
        '& .MuiButtonBase-root': {
            padding: theme.layoutSpacing(8)
        },
        '& .MuiSvgIcon-root': {
            height: theme.layoutSpacing(24),
            width: theme.layoutSpacing(24)
        },
        '& .MuiInputBase-root': {
            gap: theme.layoutSpacing(16)
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border.grey
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.border.grey + ' !important',
            borderWidth: '2px'
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default
        },
        '& .MuiInputBase-input': {
            fontSize: theme.layoutSpacing(15),
            color: theme.palette.text.default
        }
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

export default function BrowseProblemDefinition({ onImport, classes: _classes, currentProjectId }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(JSON.parse(JSON.stringify(DefaultProjectData)));
    const [project, setProject] = useState(JSON.parse(JSON.stringify(Project)));
    const [selectedId, setSelectedId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({});
    const [notificationOpen, setNotificationOpen] = useState(false);
    // const [tab, setTab] = useState(1);
    const [completionMap, setCompletionMap] = useState({});

    const handleImport = () => {
        onImport(data);
        setOpen(false);
        setProject(JSON.parse(JSON.stringify(Project)));
        setData(JSON.parse(JSON.stringify(DefaultProjectData)));
        setSelectedId(0);
        // setTab(0);
        setCompletionMap({});
    };

    const handleClose = () => {
        setOpen(false);
        setProject(JSON.parse(JSON.stringify(Project)));
        setData(JSON.parse(JSON.stringify(DefaultProjectData)));
        setSelectedId(0);
        // setTab(0);
        setCompletionMap({});
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

    const loadProjectData = async (projectId) => {
        try {
            setLoading(true);
            const project = await getProject(projectId, { pdfContent: 'true' });
            let sanitizedProject = decodeHtmlEntities(sanitizeProject(project));
            setProject(sanitizedProject);
            const d = convertData(data, sanitizedProject, true, true);
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
    };

    const handleSelect = (id) => {
        if (selectedId !== id) {
            setSelectedId(id);
            loadProjectData(id);
        }
    };

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

    return (
        <>
            <Link onClick={() => setOpen(true)} className={clsx(classes.link, _classes?.link)}>
                Browse Problem Definition
            </Link>
            <Dialog open={open} classes={{ paper: classes.dialogPaper }}>
                <DialogTitle className={classes.dialogTitle} disableTypography>
                    <Typography variant="h3">Browse Problem Definition</Typography>
                    <div style={{ flex: 1 }} />
                    <IconButton size="medium" onClick={handleClose}>
                        <CloseIcon color="black" />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.contentRoot}>
                    <SearchProject
                        selectedId={selectedId}
                        currentProjectId={currentProjectId}
                        onSelect={handleSelect}
                        classes={classes}
                    />
                    <PDFrameworkContextProvider
                        uneditable={true}
                        actionButtonPosition={'bottom'}
                        suppressBackground={true}
                        finishButtonText="Import Project"
                        nextButtonText="Import Project"
                    >
                        <div aria-label="Problem definition create root" className={classes.pdRoot}>
                            <div aria-label="tab panel" className={classes.tabPanel}>
                                {loading ? (
                                    <CodxCircularLoader
                                        data-testid="circularload"
                                        size={60}
                                        center
                                    />
                                ) : null}
                                {selectedId ? (
                                    data?.sections.map((section, index) => (
                                        <PDFrameworkSection
                                            key={project.id}
                                            section={section}
                                            project={project}
                                            last={index === data.sections.length - 1}
                                            completionMap={completionMap}
                                            onNext={handleImport}
                                            onSubSectionNext={handleImport}
                                            onFinish={handleImport}
                                        />
                                    ))
                                ) : (
                                    <div className={classes.emptyMessage}>
                                        <Typography variant="body">
                                            Select a Project to View Problem Definition
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                    </PDFrameworkContextProvider>
                </DialogContent>
            </Dialog>

            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={3000}
                onClose={setNotificationOpen.bind(null, false)}
                severity={notification?.severity || 'success'}
                message={notification?.message}
            />
        </>
    );
}

function SearchProject({ selectedId, onSelect, currentProjectId, classes }) {
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(-1);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState();
    const RowsPerPage = 10;
    const [count, setCount] = useState(RowsPerPage);
    const [foundResult, setFoundResult] = useState(0);

    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const v = projects.map((el) => el.id).includes(currentProjectId)
            ? projects.length - 1
            : projects.length;
        setFoundResult(v);
    }, [projects, currentProjectId]);

    const loadProjects = async (params) => {
        const payload = {
            page: params.page,
            pageSize: params.rowsPerPage,
            sorted: params.orderedColKey
                ? [
                      {
                          id: params.orderedColKey,
                          desc: params.order === 'desc'
                      }
                  ]
                : [],
            filtered: [
                ...Object.keys(params?.colSearch).map((key) => ({
                    id: key,
                    value: params?.colSearch[key]
                }))
            ]
        };
        const resp = await getProjects(payload);
        return {
            rowData: resp.data,
            page: resp.page,
            count: resp.count
        };
    };

    const handleSearch = useDebouncedCallback(
        async (s) => {
            setLoading(true);
            const data = await loadProjects({
                page: 0,
                rowsPerPage: RowsPerPage,
                colSearch: {
                    name: s
                }
            });
            setPage(data.page);
            setProjects(data.rowData);
            setCount(data.count);
            setLoading(false);
        },
        [],
        500
    );

    const handleLoadMore = async () => {
        if (!loading && projects.length < count) {
            setLoading(true);
            const data = await loadProjects({
                page: page + 1,
                rowsPerPage: RowsPerPage,
                colSearch: {
                    name: search
                }
            });
            setPage(data.page);
            setProjects((s) => [...s, ...data.rowData]);
            setCount(data.count);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isIntersecting) {
            handleLoadMore();
        }
    }, [isIntersecting]);

    const observer = useRef();
    const handleRef = (node) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIntersecting(true);
                } else {
                    setIntersecting(false);
                }
            },
            { rootMargin: '0px 0px 50px 0px' }
        );

        if (node) observer.current.observe(node);
    };

    const handleClick = (id) => {
        onSelect(id);
    };

    return (
        <div className={classes.browseRoot}>
            <TextField
                variant="outlined"
                placeholder="Browse"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e.target.value);
                }}
                InputProps={{
                    startAdornment: <Search />,
                    endAdornment: (
                        <IconButton
                            size="medium"
                            onClick={() => {
                                setSearch('');
                                handleSearch('');
                            }}
                        >
                            <CloseIcon color="black" />
                        </IconButton>
                    )
                }}
                className={classes.searchField}
            />
            {foundResult ? (
                <Typography variant="body" className={classes.searchResult}>
                    {search ? (
                        <>
                            {foundResult} result{foundResult > 1 ? 's' : ''} found for &quot;
                            {search}&quot;
                        </>
                    ) : (
                        'All Projects'
                    )}
                </Typography>
            ) : null}
            <ul className={classes.list}>
                {loading ? (
                    <CodxCircularLoader data-testid="circularload" size={60} center />
                ) : null}
                {projects.map((el) =>
                    el.id != currentProjectId ? (
                        <Card
                            elevation={0}
                            component={'li'}
                            key={el.id}
                            onClick={() => handleClick(el.id)}
                            className={clsx(
                                classes.listItem,
                                el.id === selectedId ? classes.selectedListItem : ''
                            )}
                        >
                            <Typography variant="body1">{el.name}</Typography>
                        </Card>
                    ) : null
                )}
                <div ref={handleRef} style={{ minHeight: '1px', visibility: 'hidden' }} />
            </ul>
        </div>
    );
}
