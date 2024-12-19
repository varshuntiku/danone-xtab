import React, { useCallback, useEffect, useState } from 'react';
import { Share, Close, Link, AttachFile } from '@material-ui/icons';
import {
    Box,
    Button,
    ButtonBase,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    alpha,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    TextField,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { Autocomplete } from '@material-ui/lab';
import { getShareableUsers, getSharedList, shareReport } from '../../services/reports';
import { capitalizeFirstLetter } from '../../util';
// import { useMatomo } from '@datapunt/matomo-tracker-react'
import { connect } from 'react-redux';
import { logMatomoEvent } from '../../services/matomo';
const useStyles = makeStyles((theme) => ({
    paper: {
        background: theme.palette.primary.main
    },
    mailList: {
        maxHeight: '350px',
        overflowY: 'auto'
    },
    listItem: {
        borderBottom: 'solid 1px black',
        width: '100%',
        paddingLeft: 0
    },
    btn: {
        borderRadius: '100px',
        padding: '0.7rem 5rem'
    },
    formatsFont: {
        fontSize: '1.5rem',
        fontWeight: 100
    },
    format: {
        boxShadow: `0 0 0 1pt transparent`,
        backgroundColor: alpha(theme.palette.primary.light, 0.7),
        borderRadius: '4px',
        padding: '0 1rem',
        '&:disabled': {
            opacity: 0.7
        }
    },
    selected: {
        boxShadow: `0 0 0 1pt ${theme.palette.primary.contrastText}`
    },
    formatTxt: {
        display: 'inline-flex',
        color: theme.palette.primary.contrastText,
        gap: '0.5em',
        alignItems: 'center'
    },
    email: {
        marginBottom: '1rem',
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.75rem'
        }
    },
    cancelBtn: {
        borderRadius: '3px',
        padding: '0.7rem 5rem',
        width: '91px'
    },
    downloadBtn: {
        borderRadius: '3px',
        padding: '0.7rem 5rem',
        width: '111px'
    },
    chip: {
        backgroundColor: theme.palette.primary.light,
        fontSize: '1.5rem',
        height: '24px',
        color: theme.palette.primary.contrastText,
        '& span': {
            lineHeight: '3rem'
        },
        '& svg': {
            fill: theme.palette.text.default,
            background: alpha(theme.palette.primary.contrastText, 0.4),
            borderRadius: '70%',
            padding: '5px'
        }
    },
    autoCompleteOption: {
        color: theme.palette.text.default,
        fontSize: '1.75rem'
    },
    actionDialog: {
        padding: '8px 24px 24px',
        borderTop: 'solid 0.5px black'
    },
    mainLabel: {
        display: 'flex',
        alignItems: 'center'
    },
    mainDiv: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    root: {
        minWidth: '85%',
        marginLeft: '20px'
    },
    formatRoot: {
        marginLeft: '78px'
    }
}));

const theme = (t) =>
    createTheme({
        ...t,
        palette: {
            ...t.palette,
            primary: {
                ...t.palette.primary,
                main: t.palette.primary.contrastText
            }
        }
    });

function ShareStory({ story, classes, ...props }) {
    const classNames = useStyles();
    const [sharedWith, setSharedWith] = useState([]);
    const [open, setOpen] = useState(false);
    const [receipents, setReceipents] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false });
    const [isAttachment, setIsAttachent] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [usersList, setUsersList] = useState([]);
    // const { trackEvent } = useMatomo()

    const userEmail = props.logged_in_user_info;

    useEffect(() => {
        if (open && !usersList.length) {
            getShareableUsers({
                story_id: story.story_id,
                callback: (resp) => setUsersList(resp)
            });
        }
    }, [open, usersList, story]);

    useEffect(() => {
        if (open) {
            getSharedList({
                story_id: story.story_id,
                callback: (resp) => setSharedWith(resp)
            });
        }
    }, [open, story]);

    const handleCancel = useCallback(() => {
        setReceipents([]);
        setOpen(false);
    }, []);

    const getShareLink = useCallback(() => {
        const link = `${window.location.origin}/preview-published-story?id_token=${story.id_token}`;
        return link;
    }, [story]);

    const shareCb = useCallback(() => {
        logMatomoEvent({
            e_c: 'ShareStory',
            e_a: 'success-event-of-share-story',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        setSnackbar({ open: true, message: 'Shared successfully!', severity: 'success' });
    }, []);

    const handleShare = useCallback(() => {
        const params = {
            payload: {
                receipents,
                isLink,
                isAttachment,
                link: getShareLink(),
                story_id: story.story_id
            },
            callback: shareCb
        };
        shareReport(params);
        handleCancel();
    }, [handleCancel, receipents, isLink, isAttachment, getShareLink, story, shareCb]);

    const handleCopyLink = useCallback(() => {
        const link = getShareLink();
        window.navigator.clipboard.writeText(link);
        logMatomoEvent({
            e_c: 'ShareStory',
            e_a: 'link-copied-of-share-story',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        setSnackbar({ open: true, message: 'Link copied!', severity: 'success' });
    }, [getShareLink]);

    const isValidEmail = useCallback((input) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(input).toLowerCase());
    }, []);

    return [
        <IconButton
            key={1}
            title="share story"
            onClick={setOpen.bind(null, true)}
            className={clsx(classes.iconBtn)}
            aria-label="Share"
        >
            <Share fontSize="large" />
        </IconButton>,
        <Dialog
            key={2}
            open={open}
            onClose={setOpen.bind(null, false)}
            fullWidth
            maxWidth="sm"
            aria-labelledby="share-story-dialog-title"
            aria-describedby="share-story-dialog-content"
        >
            <DialogTitle
                className={classNames.title}
                disableTypography
                id="share-story-dialog-title"
            >
                <Typography
                    variant="h4"
                    style={{ fontSize: '2.5rem', letterSpacing: '0.1em', opacity: 0.8 }}
                >
                    Share Story
                </Typography>
                <IconButton
                    title="Close"
                    onClick={setOpen.bind(null, false)}
                    style={{ position: 'absolute', top: '4px', right: 0 }}
                    className={classNames.actionIcon}
                    aria-label="Close"
                >
                    <Close fontSize="large" />
                </IconButton>
            </DialogTitle>
            <DialogContent
                style={{ padding: '8px 12px 70px 24px' }}
                id="share-story-dialog-content"
            >
                <Typography variant="h3" style={{ fontSize: '2.5rem', margin: '1em 0' }}>
                    {story.name}
                </Typography>
                <div className={classNames.mainDiv}>
                    <label htmlFor="email" className={classNames.mainLabel}>
                        <Typography
                            variant="subtitle2"
                            style={{ fontSize: '1.8rem', opacity: 0.8 }}
                        >
                            Share with
                        </Typography>
                    </label>
                    <ThemeProvider theme={theme}>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={usersList}
                            getOptionLabel={(option) => {
                                return option.first_name + option.last_name
                                    ? capitalizeFirstLetter(option.first_name) +
                                          ' ' +
                                          capitalizeFirstLetter(option.last_name)
                                    : option.email;
                            }}
                            value={receipents}
                            freeSolo
                            classes={{
                                option: classNames.autoCompleteOption,
                                root: classNames.root
                            }}
                            onChange={(event, newValues, reason) => {
                                const newValue = newValues.slice(-1)[0];
                                if (newValue) {
                                    if (
                                        (reason === 'create-option' &&
                                            newValue.trim() === userEmail) ||
                                        newValue.email === userEmail
                                    ) {
                                        setSnackbar({
                                            open: true,
                                            message: 'Story can not be shared with yourself.',
                                            severity: 'error'
                                        });
                                        return;
                                    }
                                }
                                switch (reason) {
                                    case 'create-option':
                                        setReceipents((s) => [
                                            ...s,
                                            { name: newValue, email: newValue }
                                        ]);
                                        break;
                                    case 'select-option':
                                        setReceipents(newValues);
                                        break;
                                    case 'remove-option':
                                        setReceipents(newValues);
                                        break;
                                    case 'blur':
                                        setReceipents(newValues);
                                        break;
                                    case 'clear':
                                        setReceipents(newValues);
                                        break;
                                    default:
                                }
                            }}
                            filterOptions={(options, { inputValue }) => {
                                return options.filter((el) => {
                                    return (el.first_name + ' ' + el.last_name + ' ' + el.email)
                                        .toLowerCase()
                                        .includes(inputValue.toLowerCase());
                                });
                            }}
                            ChipProps={{
                                classes: { root: classNames.chip },
                                deleteIcon: <Close fontSize="small" />
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value) {
                                            if (!isValidEmail(e.target.value)) {
                                                e.stopPropagation();
                                                setSnackbar({
                                                    open: true,
                                                    message: 'Please enter a correct email!',
                                                    severity: 'error'
                                                });
                                            }
                                        }
                                    }}
                                    type="email"
                                    placeholder="Add recipient email address"
                                    className={classNames.email}
                                    id="add recipient email address"
                                />
                            )}
                        />
                    </ThemeProvider>
                </div>

                <Box display="flex" align="center" justifyContent="flexStart" gridGap="1rem">
                    <Box display="flex" gridGap="1rem" className={classNames.formatRoot}>
                        <ButtonBase
                            disabled
                            className={clsx(
                                classNames.format,
                                classNames.formatsFont,
                                isAttachment && classNames.selected
                            )}
                            onClick={setIsAttachent.bind(null, !isAttachment)}
                        >
                            <Typography
                                variant="body1"
                                className={clsx(classNames.formatTxt, classNames.formatsFont)}
                            >
                                <AttachFile /> Add as attachment
                            </Typography>
                        </ButtonBase>

                        <ButtonBase
                            disabled
                            className={clsx(
                                classNames.format,
                                classNames.formatsFont,
                                isLink && classNames.selected
                            )}
                            onClick={setIsLink.bind(null, !isLink)}
                        >
                            <Typography
                                variant="body1"
                                className={clsx(classNames.formatTxt, classNames.formatsFont)}
                            >
                                <Link /> Add as Link
                            </Typography>
                        </ButtonBase>
                    </Box>

                    <ButtonBase
                        size="small"
                        onClick={handleCopyLink}
                        className={clsx(
                            classNames.format,
                            classNames.formatsFont,
                            isLink && classNames.selected
                        )}
                        startIcon={<Link />}
                    >
                        <Typography
                            variant="body1"
                            className={clsx(classNames.formatTxt, classNames.formatsFont)}
                        >
                            <Link /> Copy Link
                        </Typography>
                    </ButtonBase>
                </Box>

                <List className={classNames.mailList}>
                    {sharedWith.map((el, i) => (
                        <ListItem key={el.email + i} divider className={classNames.listItem}>
                            <ListItemText
                                primary={
                                    el.first_name + el.last_name
                                        ? capitalizeFirstLetter(el.first_name) +
                                          ' ' +
                                          capitalizeFirstLetter(el.last_name) +
                                          (userEmail === el.email ? ' (you)' : '')
                                        : el.email + (userEmail === el.email ? '(you)' : '')
                                }
                                primaryTypographyProps={{
                                    variant: 'subtitle1',
                                    style: { fontSize: '2rem' }
                                }}
                            />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle1" style={{ fontSize: '2rem' }}>
                                    {el.is_owner ? 'Owner' : null}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions className={classNames.actionDialog}>
                <Button
                    className={classNames.cancelBtn}
                    variant="outlined"
                    onClick={handleCancel}
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button
                    title="share"
                    disabled={!receipents.length}
                    className={classNames.downloadBtn}
                    variant="contained"
                    onClick={handleShare}
                    aria-label="Share"
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>,
        <CustomSnackbar
            key={3}
            message={snackbar.message}
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
            severity={snackbar.severity}
        />
    ];
}

// export default withRouter(ShareStory);

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
    withRouter(ShareStory)
);
