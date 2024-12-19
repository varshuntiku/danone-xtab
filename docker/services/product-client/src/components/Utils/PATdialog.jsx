import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Checkbox,
    Divider
} from '@material-ui/core';
import CloseIcon from '../../assets/Icons/CloseBtn';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getJwtToken } from '../../services/alerts';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles((theme) => ({
    user: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
    },
    heading: {
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: '2.5rem'
    },
    text: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    textField: {
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '1.8rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.default
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.text.default
            },
            '&:hover fieldset': {
                borderColor: theme.palette.text.default
            }
        },
        '& .MuiInputBase-input': {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.default
        }
    },
    paper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    title: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20)
    },
    actions: {
        float: 'right',
        gap: '2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    copy: {
        cursor: 'pointer',
        paddingLeft: '1rem'
    },
    copymessage: {
        color: theme.palette.text.default,
        fontSize: '1.4rem',
        marginLeft: '1.5rem'
    },
    copysection: {
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        width: '3rem',
        height: '3rem',
        color: theme.palette.primary.contrastText
    },
    popoverText: {
        textAlign: 'center',
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    copyDiv: {
        borderRadius: 'none',
        width: 'fit-content',
        padding: '1rem'
    },
    actionIcon: {
        position: 'absolute',
        top: '4px',
        right: 0
    },
    checkbox: {
        display: 'flex',
        alignItems: 'center'
    },
    tokendisplay: {
        display: 'flex',
        alignItems: 'center'
    },
    copyicon: {
        width: '3rem',
        height: '3rem',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        marginLeft: '2rem'
    },
    popovertoken: {
        pointerEvents: 'none'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40),
        overflow: 'hidden'
    },
    dialogAction: {
        paddingBottom: theme.layoutSpacing(28),
        paddingTop: theme.layoutSpacing(48),
        paddingRight: theme.layoutSpacing(44)
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        width: 'calc(100% - 32px)'
    },
    closeIcon: {
        position: 'absolute',
        top: theme.layoutSpacing(12),
        right: 0,
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
}));

function PATdialog({ showDialog, setTokendialog, reloadData }) {
    const classes = useStyles();
    const userName = sessionStorage.getItem('user_name');
    const userEmail = sessionStorage.getItem('user_email');
    const [accesslist] = useState(['trigger_notification', 'trigger_email_notification']);
    const [access, setAccess] = useState({
        trigger_notification: false,
        trigger_email_notification: false
    });
    const [notification, setNotification] = useState({ shownotification: false, message: '' });
    const [token, setToken] = useState({ showToken: false, token: '' });
    const [copyhover, setCopyhover] = useState(null);
    const [copycontent, setCopycontent] = useState('Copy the PAT to Clipboard');

    const open = Boolean(copyhover);

    const updateAccess = ({ target }) => {
        const { checked } = target;
        const accessName = target.getAttribute('access-name');
        setAccess((prevstate) => ({ ...prevstate, [accessName]: checked }));
    };

    const generateToken = () => {
        setNotification((prevstate) => ({ ...prevstate, shownotification: true }));
        getJwtToken({
            payload: { access: access, user_name: userName, user_email: userEmail },
            callback: generateTokenResponse
        });
    };

    const generateTokenResponse = (response) => {
        if (response) {
            setNotification((prevstate) => ({
                ...prevstate,
                shownotification: false,
                message: response.message
            }));
            setToken((prevstate) => ({ ...prevstate, token: response.token, showToken: true }));
        }
        reloadData();
    };

    const copy = () => {
        const token = document.getElementById('tokenvalue');
        navigator.clipboard.writeText(token.value);
        if (navigator.clipboard) {
            setCopycontent('Copied to clipboard !');
        }
    };
    const toPascalCase = (string) =>
        (string.match(/[a-zA-Z0-9]+/g) || [])
            .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
            .join(' ');

    const mouseenter = (event) => {
        setCopyhover(event.currentTarget);
    };
    const mouseleave = () => {
        setCopyhover(null);
    };
    return (
        <div>
            <Dialog
                key={1}
                open={showDialog}
                fullWidth
                maxWidth="md"
                aria-labelledby="generate-token"
                aria-describedby="token"
                classes={{ paper: classes.paper }}
            >
                <DialogTitle disableTypography id="generate-token" className={classes.title}>
                    <Typography variant="h4" className={classes.heading}>
                        Generate Token
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            setAccess({
                                trigger_notification: false,
                                trigger_email_notification: false
                            });
                            setTokendialog(false);
                            setToken(() => ({ token: '', showToken: false }));
                            setCopycontent('Copy the PAT to clipboard');
                        }}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorLine} />
                {token.showToken ? (
                    <DialogContent id="token" className={classes.dialogContent}>
                        <div className={classes.user}>
                            <Typography className={classes.text}>Token</Typography>
                            <div className={classes.tokendisplay}>
                                <TextField
                                    variant="outlined"
                                    value={token.token}
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                    className={classes.textField}
                                    id="tokenvalue"
                                />
                                <FileCopyOutlinedIcon
                                    size="large"
                                    onClick={copy}
                                    className={classes.copyicon}
                                    onMouseEnter={mouseenter}
                                    onMouseLeave={mouseleave}
                                />
                            </div>
                            <div className={classes.copysection}>
                                <WarningRoundedIcon size="large" className={classes.icon} />
                                <Popover
                                    id="mouse-over-popover"
                                    className={classes.popovertoken}
                                    open={open}
                                    anchorEl={copyhover}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    onClose={mouseleave}
                                    disableRestoreFocus
                                >
                                    <div className={classes.copyDiv}>
                                        <Typography className={classes.popoverText}>
                                            {copycontent}
                                        </Typography>
                                    </div>
                                </Popover>
                                <Typography className={classes.copymessage}>
                                    {"Copy the token now. You won't be able to see it again"}
                                </Typography>
                            </div>
                        </div>
                        <div className={classes.actions}>
                            <Button
                                onClick={() => {
                                    setTokendialog(false);
                                    setCopycontent('Copy the PAT to clipboard');
                                }}
                                variant="outlined"
                                aria-label="Cancel"
                            >
                                Cancel
                            </Button>
                            <div>
                                {notification.shownotification ? (
                                    <div>
                                        <CodxCircularLoader size={25} />
                                    </div>
                                ) : (
                                    <Button
                                        onClick={generateToken}
                                        variant="contained"
                                        aria-label="Generate"
                                    >
                                        Generate
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                ) : (
                    <DialogContent className={classes.dialogContent}>
                        <div className={classes.section}>
                            <div className={classes.user}>
                                <Typography className={classes.text}>User Name</Typography>
                                <TextField
                                    variant="outlined"
                                    value={userName}
                                    InputProps={{ readOnly: true }}
                                    className={classes.textField}
                                    id="user name"
                                />
                            </div>
                            <div className={classes.user}>
                                <Typography className={classes.text}>User Email</Typography>
                                <TextField
                                    variant="outlined"
                                    value={userEmail}
                                    InputProps={{ readOnly: true }}
                                    className={classes.textField}
                                    id="user email"
                                />
                            </div>
                            <div>
                                <Typography className={classes.text}>Access</Typography>
                                <Divider></Divider>
                                <div onClick={updateAccess}>
                                    {accesslist.map((el) => {
                                        return (
                                            <span className={classes.checkbox} key={el}>
                                                <Checkbox
                                                    fontSize="large"
                                                    inputProps={{
                                                        'tag-name': 'access-checkbox',
                                                        'access-name': el,
                                                        'aria-label': `access-${el.toLowerCase()}`
                                                    }}
                                                />
                                                <Typography className={classes.text}>
                                                    {toPascalCase(el)}
                                                </Typography>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={classes.actions}>
                                <Button
                                    onClick={() => {
                                        setTokendialog(false);
                                        setCopycontent('Copy the PAT to clipboard');
                                    }}
                                    variant="outlined"
                                    aria-label="Cancel"
                                >
                                    Cancel
                                </Button>
                                <div>
                                    {notification.shownotification ? (
                                        <div>
                                            <CodxCircularLoader size={50} />
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={generateToken}
                                            variant="contained"
                                            aria-label="Generate"
                                        >
                                            Generate
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

export default PATdialog;
