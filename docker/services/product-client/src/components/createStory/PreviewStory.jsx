import {
    Box,
    makeStyles,
    Typography,
    Button,
    alpha,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ButtonGroup
} from '@material-ui/core';
import React, { useState, useCallback, Fragment } from 'react';
import clsx from 'clsx';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { createBrowserHistory } from 'history';
// import _ from 'underscore';
import CloseIcon from '@material-ui/icons/Close';
import html2pdf from 'html2pdf.js';
import { Add, Remove } from '@material-ui/icons';
import CustomSnackbar from '../CustomSnackbar';
import codx_box_logo from 'assets/img/codx_box_logo.png';
import nucliosBkgd from 'assets/img/empty_bg.png';
import teBg from 'assets/img/te_bg.png';
import teRightImage from 'assets/img/te_right_image.jpg';
import PageDetails from './PageDetails';
import ThemeToggle from '../../themes/ThemeToggle';

const previewStoryStyle = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    previewContainer: {
        '& $previewStoryPage': {
            border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.7)}`,
            borderRadius: theme.spacing(1),
            minHeight: '793.5px',
            width: '29.7cm'
        },
        '& $previewStoryPageTe': {
            border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.7)}`,
            borderRadius: theme.spacing(1),
            width: '29.7cm'
        },
        '& $pagesContainer': {
            gap: theme.spacing(2)
        }
    },
    pagesContainer: {
        background: theme.palette.primary.dark
    },
    previewStoryPage: {
        minHeight: '793.5px',
        width: '29.7cm',
        background: theme.props.mode !== 'dark' ? `url(${nucliosBkgd})` : null,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
    },
    previewStoryPageTe: {
        minHeight: '603.5px',
        width: '29.7cm'
    },
    actionIcon: {
        '& svg': {
            color: theme.palette.text.default,
            fontSize: '3rem'
        }
    },
    containerRoot: {
        background: theme.palette.primary.dark
    },
    layoutSection: {
        border: 'none'
    },
    layoutSectionTe: {
        display: 'none'
    },
    actionTool: {
        padding: theme.spacing(1, 0)
    },
    zoomBtn: {
        '& button': {
            borderColor: theme.palette.primary.contrastText,
            '&:hover': {
                borderColor: theme.palette.primary.contrastText
            }
        },
        '& svg': {
            color: theme.palette.primary.contrastText
        }
    },
    footerLogo: {
        height: '3rem',
        fill: theme.palette.primary.contrastText
    },
    coverInnerBox: {
        border: '1px solid' + theme.palette.text.default,
        borderRadius: theme.spacing(4)
    },
    codxLogo: {
        height: '12rem',
        fill: theme.palette.primary.contrastText
    },
    coverImage: {
        width: '50%'
    },
    coverTitle: {
        fontSize: theme.spacing(7),
        fontWeight: 'normal',
        letterSpacing: '0.75px',
        lineHeight: '0.964',
        color: theme.palette.text.headingText
    },
    coverDesc: {
        fontSize: theme.spacing(3),
        color: theme.palette.text.titleText,
        fontWeight: '200'
    },
    coverUser: {
        fontSize: '1.7rem',
        fontWeight: '200',
        textTransform: 'capitalize'
    },
    coverDarkBG: {
        background: theme.props.mode !== 'dark' ? `url(${nucliosBkgd})` : null,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
    },
    coverDarkBGTe: {
        background: theme.props.mode === 'dark' ? `transparent` : `url(${teBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    },
    previewStoryPageTeMem: {
        minHeight: '703.5px',
        width: '29.7cm',
        background: theme.props.mode === 'dark' ? 'transparent' : `url(${teBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.7)}`,
        borderRadius: theme.spacing(1)
    },
    headerPageName: {
        color: theme.palette.primary.contrastText
    }
}));

export function PreviewStory({
    noModal = false,
    navBackBtn = false,
    themeToggle = false,
    pages = [],
    story = {
        name: '',
        description: '',
        created_by: { first_name: '', last_name: '' },
        app_id: []
    },
    classNames = { actionTool: '', previewContainer: '' }
}) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(75);
    const classes = previewStoryStyle();
    // const theme = useTheme();
    const createdByUserName = story.created_by.first_name + ' ' + story.created_by.last_name;
    // const themeMode = theme.props.mode;
    const [snackbar, setSnackbar] = useState({ open: false });
    const history = createBrowserHistory();
    const handleRouteBack = useCallback(() => {
        history.goBack();
    }, [history]);

    let codxBoxLogo = codx_box_logo;
    // let codxLogo = codx_darkbg_logo;
    // let mathcoLogo = mathco_darkbg_logo;

    // if (themeMode === 'light') {
    //     codxLogo = codx_lightbg_logo;
    //     mathcoLogo = mathco_lightbg_logo;
    // }

    const handleDownloadPDF = useCallback(() => {
        setSnackbar({ open: true, message: 'Downloading in progress!', severity: 'info' });
        setTimeout(() => {
            const clonedElement = document.getElementById('toPdf').cloneNode(true);
            const opt = {
                filename: story.name,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { orientation: 'landscape', format: 'a4' },
                pageBreak: { mode: 'css', after: '.page', before: '.page' }
            };
            html2pdf().from(clonedElement.innerHTML).set(opt).toPdf().save();
        }, 0);
    }, [story]);

    const Footer = function ({ index }) {
        return (
            <Box
                aria-label="page footer"
                display="flex"
                justifyContent={'center'}
                alignItems="center"
                padding="2rem"
            >
                <Typography variant="h4">{index + 1}</Typography>
            </Box>
        );
    };

    const MemoizedPages = React.useMemo(
        () =>
            pages
                .filter((p) => p.layoutId)
                .map((p, i) => (
                    <Box
                        key={p.pIndex}
                        className={
                            story.app_id[0] !== 1838
                                ? classes.previewStoryPage
                                : classes.previewStoryPageTeMem
                        }
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            flex="1"
                            padding={story.app_id[0] !== 1838 ? '6rem' : '0rem'}
                            position="relative"
                        >
                            <PageDetails
                                page={p}
                                previewMode
                                disablePlaceHolder
                                classNames={{
                                    root: classes.root,
                                    containerRoot: classes.containerRoot,
                                    layoutSection: classes.layoutSection
                                }}
                                story={story}
                            ></PageDetails>
                        </Box>
                        <Footer index={i + 1} />
                    </Box>
                )),
        [pages, classes]
    );

    const CoverPage = React.useMemo(
        () => (
            <Box
                className={clsx(
                    story.app_id[0] !== 1838
                        ? classes.previewStoryPage
                        : classes.previewStoryPageTe,
                    story.app_id[0] !== 1838 ? classes.coverDarkBG : classes.coverDarkBGTe
                )}
                display="flex"
                flexDirection="column"
            >
                <Box padding="10%" flex="1" display="flex">
                    <Box
                        className={classes.coverInnerBox}
                        flex="1"
                        display="flex"
                        justifyContent="space-between"
                        padding={2}
                        gridGap="8rem"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            padding={2}
                            justifyContent="center"
                            alignItems="flex-start"
                            gridGap="3rem"
                        >
                            {/* {story.app_id[0] !== 1838 && (
                                <img
                                    src={codxBoxLogo}
                                    alt="codex-logo"
                                    className={classes.codxLogo}
                                />
                            )} */}
                            <div className={classes.coverTitle}>{story.name}</div>
                            <div className={classes.coverDesc}>{story.description}</div>
                            <Typography
                                component="div"
                                variant="body1"
                                className={classes.coverUser}
                            >
                                - {createdByUserName}
                            </Typography>
                        </Box>
                        {story.app_id[0] !== 1838 ? null : (
                            <img
                                className={classes.coverImage}
                                src={teRightImage}
                                alt="cover page"
                            ></img>
                        )}
                    </Box>
                </Box>
                <Footer index={0} />
            </Box>
        ),
        [
            story,
            createdByUserName,
            classes.previewStoryPage,
            classes.coverInnerBox,
            classes.codxLogo,
            classes.coverDarkBG,
            classes.coverImage,
            classes.coverTitle,
            classes.coverDesc,
            classes.coverUser,
            codxBoxLogo
        ]
    );

    const Content = (
        <Fragment>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
            <DialogTitle
                className={clsx(classNames.actionTool, classes.actionTool)}
                id="preview-story-dialog-title"
            >
                <Box
                    width="100%"
                    height="100%"
                    gridGap="2rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    {themeToggle ? <ThemeToggle size="large" /> : null}
                    {navBackBtn ? (
                        <Fragment>
                            <IconButton
                                title="Back"
                                onClick={handleRouteBack}
                                className={classes.actionIcon}
                                aria-label="Back"
                            >
                                <ArrowBackIosIcon fontSize="large" />
                            </IconButton>
                            <Box flex={1} />
                        </Fragment>
                    ) : null}
                    <ButtonGroup
                        className={classes.zoomBtn}
                        size="medium"
                        color="primary"
                        aria-label="Zoom"
                        disableElevation
                    >
                        <Button
                            title="zoom in"
                            onClick={setZoom.bind(null, zoom + 5)}
                            aria-label="Zoom in"
                        >
                            <Add fontSize="large" />
                        </Button>
                        <Button
                            title="zoom out"
                            onClick={setZoom.bind(null, zoom - 5)}
                            aria-label="Zoom out"
                        >
                            <Remove fontSize="large" />
                        </Button>
                    </ButtonGroup>
                    <IconButton
                        title="Download PDF"
                        onClick={handleDownloadPDF}
                        className={classes.actionIcon}
                        aria-label="Download PDF"
                    >
                        <VerticalAlignBottomIcon fontSize="large" />
                    </IconButton>
                    {noModal ? null : (
                        <IconButton
                            title="Close"
                            className={classes.actionIcon}
                            onClick={setOpen.bind(null, false)}
                            aria-label="Close"
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    )}
                </Box>
            </DialogTitle>
            <DialogContent dividers id="preview-story-dialog-content">
                <Box
                    height="100%"
                    className={clsx(classes.previewContainer, classNames.previewContainer)}
                    style={{ zoom: `${zoom}%`, MozTransformStyle: `scale(${zoom / 100})` }}
                >
                    <Box id="toPdf" height="100%">
                        <Box
                            display="flex"
                            className={classes.pagesContainer}
                            flexWrap="nowrap"
                            alignItems="center"
                            flexDirection="column"
                        >
                            {CoverPage}
                            {MemoizedPages}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions></DialogActions>
        </Fragment>
    );

    if (noModal) {
        return Content;
    }

    return (
        <Fragment>
            <Button onClick={setOpen.bind(null, true)} aria-label="Preview story">
                Preview Story
            </Button>
            <Dialog
                open={open}
                maxWidth="lg"
                fullScreen
                fullWidth
                onClose={setOpen.bind(null, false)}
                aria-labelledby="preview-story-dialog-title"
                aria-describedby="preview-story-dialog-content"
            >
                {Content}
            </Dialog>
        </Fragment>
    );
}
