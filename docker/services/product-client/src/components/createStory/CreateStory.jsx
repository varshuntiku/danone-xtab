import {
    Box,
    Grid,
    makeStyles,
    Typography,
    Paper,
    Button,
    alpha,
    IconButton,
    createTheme,
    ThemeProvider,
    ButtonBase,
    CircularProgress
} from '@material-ui/core';
import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { NewPage } from './config';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import clsx from 'clsx';
import AddCharts from './dialog/addChart';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { createBrowserHistory } from 'history';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getStory, updateStory } from 'services/reports';
// import _ from 'underscore';
import CustomSnackbar from '../CustomSnackbar';
import { grey } from '@material-ui/core/colors';
import { StoryContext } from './storyContext';
import PageDetails from './PageDetails';
import { PreviewStory } from './PreviewStory';
import ShareStory from './ShareStory';
import DownloadStory from './downloadStory';
// import { useMatomo } from '@datapunt/matomo-tracker-react'
import { logMatomoEvent } from '../../services/matomo';
import { connect } from 'react-redux';

export const storytheme = (t) =>
    createTheme({
        ...t,
        overrides: {
            ...t.overrides,
            MuiTypography: {
                root: {
                    color: t.palette.text.default
                }
            },
            MuiButton: {
                ...t.overrides.MuiButton,
                root: {
                    color: t.palette.primary.contrastText,
                    '&.Mui-disabled': { color: grey[850] }
                },
                disabled: {
                    color: grey[850]
                }
            }
        }
    });

const useStyle = makeStyles(() => ({
    sectionTools: {
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
}));

const useStyle1 = makeStyles((theme) => ({
    root: {},
    container: {
        flex: 1
    },
    loader: {
        position: 'absolute',
        top: '50%',
        right: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.palette.primary.contrastText
    }
}));

export function CreateStory({ logged_in_user_info, ...props }) {
    const classes = useStyle1();
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState();
    const [story, setStory] = useState({});
    const [savedState, setSavedState] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false });
    const [modified, setModified] = useState(false);
    // const { trackEvent } = useMatomo()

    const [loading, setLoading] = useState(true);

    const initiate = useCallback((story = { pages: [], layouts: [], content: [] }) => {
        let pages;
        if (story) {
            setStory(story);
            if (story.pages && story.pages.length) {
                pages = story.pages;
            } else {
                const newPage = JSON.parse(JSON.stringify(NewPage));
                pages = [newPage];
            }
        } else {
            setStory(null);
        }
        setSelectedPage(pages[0]);
        setPages(pages);
        setSavedState(JSON.parse(JSON.stringify(pages)));
        setLoading(false);
    }, []);

    useEffect(() => {
        getStory({
            story_id: props.match.params.story_id,
            callback: initiate
        });
    }, [initiate, props.match.params.story_id]);

    const layoutSlectionHandler = useCallback(
        ({ style, id, layoutProps }) => {
            if (selectedPage.layoutId !== id) {
                selectedPage.style = { ...style };
                selectedPage.layoutId = id;
                selectedPage.layoutProps = layoutProps;
                const newPage = { ...selectedPage };
                setSelectedPage(newPage);
                pages[pages.indexOf(selectedPage)] = newPage;
                setPages([...pages]);
                setModified(true);
            }
        },
        [selectedPage, pages]
    );

    const handleAddPage = useCallback(() => {
        const newPage = JSON.parse(JSON.stringify(NewPage));
        const { pIndex = -1 } = pages[pages.length - 1] || {};
        newPage.pIndex = pIndex + 1;
        const newPages = [...pages, newPage];
        setPages(newPages);
        setSelectedPage(newPage);
    }, [pages]);

    const handleRemovePage = useCallback(
        (page) => {
            const newPages = [...pages];
            newPages.splice(pages.indexOf(page), 1);
            setPages(newPages);
            if (selectedPage.pIndex === page.pIndex) {
                setSelectedPage(newPages[0]);
            }
        },
        [pages, selectedPage]
    );

    const dataChangeHandler = useCallback((dataKey, value) => {
        setSelectedPage((selectedPage) => {
            selectedPage.data[dataKey] = value;
            const newPage = { ...selectedPage };
            setPages((pages) => {
                pages[pages.indexOf(selectedPage)] = newPage;
                return [...pages];
            });
            setModified(true);
            return newPage;
        });
    }, []);

    const handleUpdateResponse = useCallback(({ message, severity = 'success' }) => {
        setSnackbar({ open: true, severity, message });
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const email = logged_in_user_info;
            await updateStory({
                payload: {
                    email,
                    name: story.name,
                    description: story.description,
                    story_id: story.story_id,
                    app_id: story.app_id,
                    update: { pages },
                    delete: [],
                    add: []
                },
                callback: () => {
                    logMatomoEvent({
                        e_c: 'Story',
                        e_a: 'success-event-of-update-story',
                        ca: 1,
                        url: window.location.href,
                        // urlref: window.location.href,
                        pv_id: props?.matomo?.pv_id
                    });
                    setSavedState(JSON.parse(JSON.stringify(pages)));
                    handleUpdateResponse({ message: 'Updated successfully!' });
                }
            });
        } catch (err) {
            logMatomoEvent({
                e_c: 'Story',
                e_a: 'error-event-of-update-story',
                ca: 1,
                url: window.location.href,
                // urlref: window.location.href,
                pv_id: props.matomo.pv_id
            });
            handleUpdateResponse({
                message: 'Failed to update. Please try again.',
                severity: 'error'
            });
        }
    }, [pages, story, handleUpdateResponse, logged_in_user_info]);

    const handleUndo = useCallback(() => {
        const newPages = JSON.parse(JSON.stringify(savedState));
        setPages(newPages);
        setSelectedPage(newPages[0]);
        setModified(false);
    }, [savedState]);

    if (loading) {
        return <CircularProgress className={classes.loader} size={40} />;
    }

    return (
        <ThemeProvider theme={storytheme}>
            <StoryContext.Provider value={{ contents: story.content, story: story }}>
                <CustomSnackbar
                    message={snackbar.message}
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                    severity={snackbar.severity}
                />
                <Box width="100%" height="100%" display="flex" padding={2} className={classes.root}>
                    <Grid
                        container
                        direction="column"
                        wrap="nowrap"
                        alignContent="flex-start"
                        spacing={2}
                        className={classes.container}
                    >
                        <Grid item xs={12} style={{ flex: 0 }}>
                            <HeaderTool
                                activeSave={modified}
                                pages={pages}
                                story={story}
                                onSave={handleSave}
                                onUndo={handleUndo}
                                logged_in_user_info={logged_in_user_info}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} style={{ height: '100%' }}>
                                <Grid item xs={2}>
                                    <PageSelector
                                        selectedPage={selectedPage}
                                        pages={pages}
                                        onRemovePage={handleRemovePage}
                                        onPageSelection={setSelectedPage}
                                        onAddPage={handleAddPage}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <PageDetails
                                        page={selectedPage}
                                        onDataChange={dataChangeHandler}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <LayoutSelector
                                        selectedPage={selectedPage}
                                        onLayoutSelection={layoutSlectionHandler}
                                        layouts={story.layouts || []}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </StoryContext.Provider>
        </ThemeProvider>
    );
}

const useHeaderToolStyle = makeStyles((theme) => ({
    root: {
        borderBottom: `1px solid ${alpha(theme.palette.primary.contrastText, 0.5)}`,
        padding: theme.spacing(0, 1, 1)
    },
    backButton: {
        '& svg': {
            color: theme.palette.text.default,
            fontSize: '4rem'
        }
    },
    headerText: {
        letterSpacing: '0.3rem',
        textAlign: 'center'
    },
    actionIcon: {
        '& svg': {
            color: theme.palette.text.default,
            fontSize: '3rem'
        }
    }
}));

function HeaderTool({ pages, story, onSave, onUndo, activeSave, logged_in_user_info }) {
    const classes = useHeaderToolStyle();
    const history = createBrowserHistory();
    const { contents } = useContext(StoryContext);
    const handleRouteBack = useCallback(() => {
        history.goBack();
    }, [history]);

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item style={{ flex: 'auto' }}>
                <IconButton
                    onClick={handleRouteBack}
                    size="small"
                    className={classes.backButton}
                    aria-label="Back"
                >
                    <ArrowBackIosIcon fontSize="large" />
                </IconButton>
            </Grid>
            <Grid item style={{ flex: 'auto' }}>
                <Typography variant="h2" className={classes.headerText}>
                    {story.name}
                </Typography>
            </Grid>
            <Grid item>
                <Grid container alignItems="center" spacing={2} justify="flex-end" wrap="nowrap">
                    {/* needs to be optimized useEffect Object.values goes there. AddCharts selectedGraph => contents */}
                    {contents ? <AddCharts selectedGraph={contents} nameFlag={true} /> : ''}
                    <Button
                        title="Save your changes"
                        disabled={!activeSave}
                        variant={activeSave ? 'contained' : null}
                        onClick={onSave}
                        aria-label="Save"
                    >
                        Save
                    </Button>
                    <Button title="Undo your changes" onClick={onUndo} aria-label="Undo">
                        Undo
                    </Button>
                    <PreviewStory pages={pages} story={story} />
                    <Button disabled aria-label="Publish">
                        {' '}
                        Publish
                    </Button>
                    <DownloadStory story={story.story_id} />
                    {/* <IconButton disabled className={classes.actionIcon}><VerticalAlignBottomIcon fontSize="large" /></IconButton> */}
                    <ShareStory
                        story={story}
                        classes={{ iconBtn: classes.actionIcon }}
                        logged_in_user_info={logged_in_user_info}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

const useStyle3 = makeStyles((theme) => ({
    commonPageRoot: {
        width: '100%',
        padding: theme.spacing(0.5),
        cursor: 'pointer',
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`,
        backgroundColor: theme.palette.primary.main,
        paddingTop: '64%',
        position: 'relative'
    },
    selected: {
        border: `4px solid ${theme.palette.primary.contrastText}`
    },
    pagesContainer: {
        maxHeight: 'calc(100vh - 215px)',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    addBtn: {
        borderRadius: '20px',
        border: `1px dashed ${alpha(theme.palette.primary.contrastText, 0.5)}`,
        borderWidth: '1px',
        background: alpha(theme.palette.primary.dark, 0.5),
        '&:hover': {
            border: `1px dashed ${alpha(theme.palette.primary.contrastText, 0.5)}`
        }
    },
    deleteIcon: {
        opacity: 0.4,
        '& svg': {
            color: theme.palette.text.default
        },
        '&:hover': {
            opacity: 0.8
        }
    },
    layoutExpandMoreIcon: {
        color: theme.palette.primary.contrastText,
        fontSize: '4rem'
    },
    layoutRoot: {
        backgroundRepeat: 'round',
        backgroundSize: 'cover'
    },
    thumbnailMode: {
        zoom: '0.20',
        '-moz-transform': 'scale(0.20)',
        pointerEvents: 'none',
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        top: 0
    },
    layoutSection: {
        background: theme.palette.primary.light
    }
}));

function PageSelector({ pages, onPageSelection, selectedPage, onAddPage, onRemovePage }) {
    const classes = useStyle3();
    const commonClases = useStyle();
    return (
        <Grid direction="column" container spacing={2}>
            <Grid item xs={12} className={commonClases.sectionTools} style={{ flex: 0 }}>
                <Button
                    aria-label="add-page"
                    fullWidth
                    variant="outlined"
                    onClick={onAddPage}
                    className={classes.addBtn}
                >
                    + Add Page
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    className={classes.pagesContainer}
                    wrap="nowrap"
                    direction="column"
                    container
                    spacing={3}
                >
                    {pages.map((p) => (
                        <Grid item key={p.pIndex}>
                            <PageThumbnail
                                page={p}
                                selected={selectedPage.pIndex === p.pIndex}
                                onPageSelection={onPageSelection}
                                onRemovePage={onRemovePage}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

function LayoutSelector({ layouts, selectedPage, onLayoutSelection }) {
    const classes = useStyle3();
    const commonClases = useStyle();
    const [layoutPages, setLayoutPages] = useState([]);

    useEffect(() => {
        if (layouts) {
            setLayoutPages(
                layouts.map((l, i) => ({
                    l: l,
                    p: {
                        ...NewPage,
                        pIndex: i,
                        style: l.style,
                        layoutId: l.id,
                        layoutProps: l.layoutProps
                    }
                }))
            );
        } else {
            setLayoutPages([]);
        }
    }, [layouts]);

    return (
        <Grid direction="column" container spacing={2}>
            <Grid item xs={12} className={commonClases.sectionTools}>
                <Typography variant="h4">Select Layout</Typography>
                <ExpandMoreIcon className={classes.layoutExpandMoreIcon} />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    className={classes.pagesContainer}
                    wrap="nowrap"
                    direction="column"
                    container
                    spacing={3}
                >
                    {layoutPages.map(({ l, p }) => (
                        <Grid item key={l.id}>
                            <PageThumbnail
                                page={p}
                                selected={selectedPage && selectedPage.layoutId === l.id}
                                onPageSelection={onLayoutSelection.bind(null, l)}
                                suppressDelete={true}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

const PageThumbnail = React.memo(function ({
    page,
    selected,
    onPageSelection,
    onRemovePage,
    suppressDelete
}) {
    const classes = useStyle3();
    const memoizedPage = useMemo(
        () => (
            <PageDetails
                page={page}
                previewMode={true}
                classNames={{ root: classes.thumbnailMode, layoutSection: classes.layoutSection }}
            />
        ),
        [page, classes]
    );

    return (
        <Box position="relative">
            {!suppressDelete && (
                <Box aria-label="action" position="absolute" zIndex={2} right={-3} top={2}>
                    <IconButton
                        aria-label="delete"
                        title="delete"
                        className={classes.deleteIcon}
                        size="medium"
                        onClick={onRemovePage.bind(null, page)}
                    >
                        <DeleteOutlineOutlinedIcon color="action" fontSize="large" />
                    </IconButton>
                </Box>
            )}
            <Paper
                variant="outlined"
                aria-label="thumbnail"
                className={clsx(classes.commonPageRoot, classes.clickable, {
                    [classes.selected]: selected
                })}
                onClick={onPageSelection.bind(null, page)}
            >
                {memoizedPage}
                <ButtonBase
                    title="Select"
                    focusRipple
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }}
                />
            </Paper>
        </Box>
    );
});

PageThumbnail.displayName = 'PageThumbnail';

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

connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateStory);
