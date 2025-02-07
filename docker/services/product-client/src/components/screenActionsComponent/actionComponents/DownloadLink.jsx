import React, { useState, useRef } from 'react';
import {
    Button,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { ReactComponent as DownloadFileIcon } from '../assets/downloadFileIcon.svg';
import { ReactComponent as DownloadPdfIcon } from '../assets/downloadPdfIcon.svg';
import { ReactComponent as DownloadPngIcon } from '../assets/downloadPngIcon.svg';
import { triggerActionHandler } from '../../../services/screen';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';
import sanitizeHtml from 'sanitize-html-react';
import Tooltip from '@material-ui/core/Tooltip';
import { CloudDownload } from '@material-ui/icons';
import { CustomDialog } from '../../custom/CustomDialog';

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: '2.5rem'
    },
    link: {
        color: theme.palette.text.titleText,
        fontSize: '1.6rem',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    },
    menuDropdown: {
        padding: '1rem'
    },

    menuItem: {
        minHeight: '5rem',
        padding: '1.5rem',
        marginLeft: '-4rem',
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    button: {
        fontSize: '0.75rem',
        padding: theme.spacing(0.5, 1),
        marginLeft: '1.5rem'
    },
    formControlLabel: {
        fontSize: '1rem',
        '& .MuiTypography-root': {
            fontSize: '1rem'
        }
    },
    separatorLine: {
        border: '1px solid #CFB3CD',
        marginLeft: '1rem',
        marginRight: '1rem'
    },
    fileicon: {
        marginLeft: '4.5rem',
        '& path': {
            fill: theme.palette.text.table
        }
    },
    iconTooltip: {
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
    iconButton: {
        '&:hover': {
            background: theme.palette.background.selected,
            borderRadius: '4px'
        },
        '&.MuiIconButton-root.Mui-disabled': {
            '& svg': {
                color: theme.palette.grey[500],
                cursor: 'not-allowed',
                pointerEvents: 'fill'
            }
        }
    },
    cloudDownloadButton: {
        padding: theme.spacing(0.5),
        minWidth: theme.spacing(5),
        backgroundColor: 'transparent',
        border: '1px solid ' + theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(0.5)
    },
    downloadLabel: {
        fontSize: '1.9rem',
        color: theme.palette.primary.contrastText
    },
    textButton: {
        color: theme.palette.text.contrastText,
        display: 'flex',
        right: '1rem',
        // top: "6rem", //
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '2rem',
        fontWeight: '500',
        fontFamily: theme.body.B5.fontFamily,
        // marginRight: "1rem",
        padding: '1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '0rem'
    },
    iconMoreButton: {
        background: 'none',
        '   &:hover': {
            background: 'none'
        }
    },
    Moreicon: {
        fontSize: '2.5rem',
        marginTop: '-1rem'
    }
}));

export function DownloadLink({
    screen_id,
    app_id,
    params,
    action_type,
    onDownloadPDF,
    onDownloadPNG,
    fileName,
    actionSettings,
    commentsOpen,
    askNucliosOpen,
    tabNavBarCount
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const iconButtonRef = useRef(null);
    const [downloading, setDownloading] = useState(0);
    const [open, setOpen] = useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const downloadFile = (url) => {
        const sanitizedUrl = sanitizeHtml(url, {
            allowedTags: [],
            allowedAttributes: {}
        });
        fetch(sanitizedUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                const fileName = url?.split('/')?.pop();
                const sanitizedFileName = sanitizeHtml(fileName, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                link.setAttribute('download', sanitizedFileName);
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(objectUrl);
                }, 1000);
            })
            .catch((error) => {
                return error;
            });
    };

    const handleDownloadClick = async () => {
        try {
            setDownloading((d) => d + 1);
            setOpen(true);
            if (params.fetch_on_click) {
                await triggerActionHandler({
                    screen_id,
                    app_id,
                    payload: {
                        action_type,
                        action_params: null,
                        filter_state: JSON.parse(
                            sessionStorage.getItem(
                                'app_screen_filter_info_' + app_id + '_' + screen_id
                            )
                        )
                    },
                    callback: (d) => {
                        downloadFile(d.url);
                    }
                });
            } else {
                downloadFile(params.url);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setDownloading((d) => d - 1);
        }
    };

    const handleDownload = (format) => {
        if (format === 'file') {
            handleDownloadClick();
        } else if (format === 'pdf') {
            onDownloadPDF();
        } else if (format === 'png') {
            onDownloadPNG();
        }
        handleMenuClose();
    };

    const renderButtonOrLink = () => {
        if (params.is_icon) {
            return actionSettings?.actions.length >= 2 &&
                (commentsOpen || askNucliosOpen) &&
                tabNavBarCount?.length >= 2 ? (
                <Tooltip
                    title="Download"
                    classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                    arrow
                >
                    <IconButton
                        size="small"
                        onClick={handleDownloadClick}
                        title={params.title}
                        className={classes.iconMoreButton}
                    >
                        <SaveAltIcon className={classes.Moreicon} />
                    </IconButton>
                </Tooltip>
            ) : downloading && params?.showDownloadProgress ? (
                <>
                    <IconButton
                        size="small"
                        title={params.title}
                        className={classes.iconButton}
                        disabled={true}
                    >
                        <CloudDownload className={classes.icon} />
                        <Typography class={classes.textButton}>Downloading...</Typography>
                    </IconButton>
                    <CustomDialog
                        title="Info"
                        subtitle="The file download has been initiated. Please check your 'Downloads' folder shortly"
                        isOpen={open}
                        handleClose={() => {
                            setOpen(false);
                        }}
                    />
                </>
            ) : (
                <IconButton
                    size="small"
                    onClick={handleDownloadClick}
                    title={params.title}
                    className={classes.iconButton}
                    disabled={params?.disabled}
                >
                    <SaveAltIcon className={classes.icon} />
                    <Typography class={classes.textButton}>
                        {params.downloadLabel ? params.downloadLabel : 'Download'}
                    </Typography>
                </IconButton>
            );
        } else if (params.is_button) {
            return (
                <Button
                    endIcon={<SaveAltIcon fontSize="large" />}
                    size={params.size}
                    onClick={handleDownloadClick}
                    title={params.title}
                    variant={params.variant || 'outlined'}
                    aria-label={params.title}
                >
                    {params.text}
                </Button>
            );
        } else {
            return (
                <Link
                    to="#"
                    onClick={handleDownloadClick}
                    title={params.title}
                    style={params.style}
                    className={clsx({
                        [classes.link]: true,
                        [classes.colorContrast]: params.color === 'contrast'
                    })}
                >
                    {params.text}
                </Link>
            );
        }
    };

    if (action_type === 'test_download_action') {
        return renderButtonOrLink();
    }

    if (action_type === 'test_download_content') {
        return (
            <>
                {actionSettings?.actions.length >= 2 &&
                (commentsOpen || askNucliosOpen) &&
                tabNavBarCount?.length >= 2 ? (
                    <Tooltip
                        title="Download"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton
                            size="small"
                            onClick={handleMenuClick}
                            title={params.title}
                            ref={iconButtonRef}
                            className={classes.iconMoreButton}
                        >
                            <SaveAltIcon className={classes.Moreicon} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <IconButton
                        size="small"
                        onClick={handleMenuClick}
                        title={params.title}
                        ref={iconButtonRef}
                        className={classes.iconButton}
                    >
                        <SaveAltIcon className={classes.icon} />
                        <Typography class={classes.textButton}>Download</Typography>
                    </IconButton>
                )}
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    className={classes.menuDropdown}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    getContentAnchorEl={null}
                >
                    <MenuItem className={classes.menuItem} onClick={() => handleDownload('pdf')}>
                        <ListItemIcon>
                            <DownloadPdfIcon className={classes.fileicon} />
                        </ListItemIcon>
                        Download Screen as PDF
                    </MenuItem>

                    <MenuItem className={classes.menuItem} onClick={() => handleDownload('png')}>
                        <ListItemIcon>
                            <DownloadPngIcon className={classes.fileicon} />
                        </ListItemIcon>
                        Download Screen as PNG
                    </MenuItem>
                </Menu>
            </>
        );
    }

    if (action_type === 'test_download_file_content') {
        return (
            <>
                {actionSettings?.actions.length >= 2 &&
                (commentsOpen || askNucliosOpen) &&
                tabNavBarCount?.length >= 2 ? (
                    <Tooltip
                        title="Download"
                        classes={{ tooltip: classes.iconTooltip, arrow: classes.arrow }}
                        arrow
                    >
                        <IconButton
                            size="small"
                            onClick={handleMenuClick}
                            title={params.title}
                            ref={iconButtonRef}
                            className={classes.iconMoreButton}
                        >
                            <SaveAltIcon className={classes.Moreicon} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <IconButton
                        size="small"
                        onClick={handleMenuClick}
                        title={params.title}
                        ref={iconButtonRef}
                        className={classes.iconButton}
                    >
                        <SaveAltIcon className={classes.icon} />
                        <Typography class={classes.textButton}>Download</Typography>
                    </IconButton>
                )}
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    className={classes.menuDropdown}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    getContentAnchorEl={null}
                >
                    <MenuItem className={classes.menuItem} onClick={() => handleDownload('file')}>
                        <ListItemIcon>
                            <DownloadFileIcon className={classes.fileicon} />
                        </ListItemIcon>
                        Download {fileName ? fileName : 'File'}
                    </MenuItem>

                    <div className={classes.separatorLine}></div>
                    <MenuItem className={classes.menuItem} onClick={() => handleDownload('pdf')}>
                        <ListItemIcon>
                            <DownloadPdfIcon className={classes.fileicon} />
                        </ListItemIcon>
                        Download Screen as PDF
                    </MenuItem>

                    <MenuItem className={classes.menuItem} onClick={() => handleDownload('png')}>
                        <ListItemIcon>
                            <DownloadPngIcon className={classes.fileicon} />
                        </ListItemIcon>
                        Download Screen as PNG
                    </MenuItem>
                </Menu>
            </>
        );
    }

    return renderButtonOrLink();
}
