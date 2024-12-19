import React, { useEffect, useState, createRef } from 'react';
import { Box, Button, Grid, TextField, Typography, makeStyles, useTheme } from '@material-ui/core';
import UtilsNavigation from 'components/shared/platform-utils-nav-header/platform-utils-nav-header';
import clsx from 'clsx';
import { saveLoginConfig, getLoginConfig } from 'services/auth';
import UploadIcon from 'assets/Icons/UploadIcon';
import CloseIcon from '@material-ui/icons/Close';
import { Switch } from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        height: '90%',
        justifyContent: 'start',
        alignItems: 'center',
        flexDirection: 'column',
        color: theme.palette.text.revamp,
        maxWidth: '600px',
        margin: 'auto',
        gap: theme.layoutSpacing(10),
        padding: theme.layoutSpacing(10),
        overflow: 'auto'
    },
    header: {
        fontSize: theme.layoutSpacing(26),
        fontWeight: 500,
        padding: theme.layoutSpacing(10),
        width: '100%'
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: theme.layoutSpacing(10)
    },
    configContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.layoutSpacing(15, 45),
        border: '1px solid' + theme.IndustryDashboard.border.light,
        fontSize: theme.layoutSpacing(22),
        fontWeight: 400,
        borderRadius: '5px'
    },
    loginConfigContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.layoutSpacing(15, 45),
        border: '1px solid' + theme.IndustryDashboard.border.light,
        fontSize: theme.layoutSpacing(22),
        fontWeight: 400,
        borderRadius: '5px'
    },
    loginHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    loginBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(20)
    },
    seperator: {
        borderBottom: '1px solid' + theme.IndustryDashboard.border.light,
        paddingTop: theme.layoutSpacing(20)
    },
    textField: {
        marginBottom: '1%',
        backgroundColor: 'transparent !important',
        padding: '0.625rem',
        '& .Mui-disabled': {
            color: theme.palette.text.revamp
        },
        '& .MuiInputLabel-root': {
            fontSize: '1.5rem'
        },
        '& .MuiFilledInput': {
            backgroundColor: 'transparent !important'
        },
        '& .MuiInputBase-input': {
            backgroundColor: 'transparent !important',
            fontSize: '1.5rem',
            color: theme.palette.text.revamp
        },
        '& .MuiFormLabel-root': {
            color: theme.palette.text.revamp
        }
    },
    fileField: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid' + theme.IndustryDashboard.border.light,
        padding: theme.layoutSpacing(20),
        borderStyle: 'dashed',
        '& input': {
            width: 0
        }
    },
    uploadContainer: {
        color: theme.palette.text.revamp,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: theme.layoutSpacing(10)
    },
    fontSize4: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: '0.07rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },
    formFontStyle: {
        alignSelf: 'center'
    },
    saveButton: {
        width: '100%'
    },
    saveSamlButton: {
        width: '66%',
        fontSize: theme.layoutSpacing(15),
        fontWeight: 500,
        padding: '3px 9px',
        marginLeft: 'auto'
    },
    message: {
        background: 'yellow',
        padding: '10px',
        color: 'black',
        borderRadius: '5px',
        width: 'fit-content',
        fontSize: '1.5em',
        fontWeight: '900',
        position: 'absolute',
        bottom: '10px',
        right: '10px'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    fileName: {
        color: theme.palette.text.revamp,
        fontSize: '2rem'
    },
    docsButton: {
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    samlSwitch: {
        display: 'flex',
        gap: theme.layoutSpacing(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        width: theme.layoutSpacing(50),
        height: theme.layoutSpacing(24),
        padding: '0px !important',
        margin: theme.layoutSpacing(1)
    },
    switchBase: {
        left: theme.layoutSpacing(4),
        top: theme.layoutSpacing(4),
        padding: 0,
        '&$checked': {
            transform: `translateX(${theme.layoutSpacing(26)})`,
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                '&:before': {
                    content: '""',
                    zIndex: '1000000',
                    position: 'absolute',
                    border: `1px solid ${theme.palette.icons.closeIcon}`,
                    top: '0px',
                    left: '0',
                    height: '100%',
                    width: '100%',
                    padding: '0px',
                    borderRadius: theme.layoutSpacing(12)
                }
            }
        }
    },
    thumb: {
        width: theme.layoutSpacing(17),
        height: theme.layoutSpacing(17),
        boxShadow: 'none'
    },
    track: {
        borderRadius: theme.layoutSpacing(12),
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border'])
    },
    checked: {}
}));

const LoginConfig = () => {
    const classes = useStyles();
    const [fields, setFields] = useState({
        ssoDisplayName: '',
        samlDisplayName: '',
        callbackUrl: ''
    });
    const [metadataFile, setMetadataFile] = useState(null);
    const [newMetadataFile, setNewMetadataFile] = useState(false);
    const fileRef = createRef();
    const themeGlobal = useTheme();
    const [notification, setNotification] = useState({ message: null, severity: null });
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [enabledLogin, setEnabledLogin] = useState({
        email_password: false,
        sso: false,
        saml: false
    });
    const [loading, setLoading] = useState(true);
    const saml_docs =
        'https://willbedeletedsoon.blob.core.windows.net/nuclios-docs/SAML_configuration_guide.pdf';

    useEffect(() => {
        getLoginConfig({
            callback: (response) => {
                const newLoginConfig = {};
                response.map((config) => (newLoginConfig[config.config_name] = config.is_enabled));

                setLoading(false);

                setEnabledLogin(newLoginConfig);

                let ssoConfig = getConfigByName(response, 'sso');
                let samlConfig = getConfigByName(response, 'saml');

                if (samlConfig.config_data?.metadata_blob_name) {
                    let metadataFile = new File([''], samlConfig.config_data?.metadata_blob_name);
                    setMetadataFile(metadataFile);
                }

                setFields({
                    callbackUrl: samlConfig.config_data?.callback_url,
                    samlDisplayName: samlConfig.config_data?.display_name,
                    ssoDisplayName: ssoConfig.config_data?.display_name
                });
            }
        });
    }, []);

    const getConfigByName = (configObject, configName) => {
        return configObject.filter((config) => {
            return config.config_name === configName;
        })[0];
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'samlDisplayName') {
            setFields({ ...fields, samlDisplayName: e.target.value });
        } else if (e.target.name === 'ssoDisplayName') {
            setFields({ ...fields, ssoDisplayName: e.target.value });
        }
    };

    const handleFileInputChange = (e) => {
        e.preventDefault();
        let files = e.target.files;
        setMetadataFile(files[0]);
        setNewMetadataFile(true);
    };

    const saveConfig = () => {
        if (!enabledLogin.sso && !enabledLogin.saml && !enabledLogin.email_password) {
            setNotificationOpen(true);
            setNotification({
                message: 'Please enable atleast one login method',
                severity: 'error'
            });
            return;
        }
        let formData = new FormData();
        if (enabledLogin.saml && !metadataFile) {
            setNotificationOpen(true);
            setNotification({
                message: 'Metadata file is required for SAML',
                severity: 'error'
            });
            return;
        }
        if (enabledLogin.saml && newMetadataFile) {
            formData.append('metadata_file', metadataFile);
        }
        formData.append(
            'sso',
            JSON.stringify({ enabled: enabledLogin.sso, display_name: fields.ssoDisplayName })
        );
        formData.append('email_password', JSON.stringify({ enabled: enabledLogin.email_password }));
        formData.append(
            'saml',
            JSON.stringify({ enabled: enabledLogin.saml, display_name: fields.samlDisplayName })
        );
        saveLoginConfig({
            formData: formData,
            callback: (response) => {
                setNotificationOpen(true);
                setNotification({
                    message: response.message,
                    severity: response.status === 'error' ? 'error' : 'success'
                });
            }
        });
    };

    const triggerClick = () => {
        fileRef.current.children[0].children[1].click();
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        let files = event.dataTransfer.files;
        // console.log(files)
        setMetadataFile(files[0]);
    };

    const remove_file = () => {
        fileRef.current.children[0].children[1].type = '';
        fileRef.current.children[0].children[1].type = 'file';
        setMetadataFile(null);
    };

    const handleConfigChange = (e, config_name) => {
        setEnabledLogin({ ...enabledLogin, [config_name]: !enabledLogin[config_name] });
    };

    if (loading) {
        return <CodxCircularLoader center size={60} />;
    }

    return (
        <>
            <UtilsNavigation
                path="/platform-utils"
                backTo="Platform Utils"
                title="Login Config"
                actionButtons={
                    <Button
                        variant="contained"
                        className={classes.saveButton}
                        aria-label="Save Login Config"
                        onClick={saveConfig}
                    >
                        Save Login Config
                    </Button>
                }
            />
            <CustomSnackbar
                open={notificationOpen && notification?.message}
                autoHideDuration={2000}
                onClose={() => setNotificationOpen(false)}
                severity={notification.severity || 'success'}
                message={notification.message}
            />
            <div className={classes.container}>
                <div className={classes.header}>Select your preferred login settings</div>
                <div className={classes.body}>
                    <div className={classes.configContainer}>
                        <span>Email Password Login</span>
                        <Switch
                            focusVisibleClassName={classes.focusVisible}
                            disableRipple
                            checked={enabledLogin.email_password}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(e) => handleConfigChange(e, 'email_password')}
                            classes={{
                                root: classes.root,
                                switchBase: classes.switchBase,
                                thumb: classes.thumb,
                                track: classes.track,
                                checked: classes.checked
                            }}
                        />
                    </div>
                    <div className={classes.loginConfigContainer}>
                        <div className={classes.loginHeader}>
                            <span>Microsoft Login</span>
                            <Switch
                                focusVisibleClassName={classes.focusVisible}
                                disableRipple
                                checked={enabledLogin.sso}
                                onChange={(e) => handleConfigChange(e, 'sso')}
                                classes={{
                                    root: classes.root,
                                    switchBase: classes.switchBase,
                                    thumb: classes.thumb,
                                    track: classes.track,
                                    checked: classes.checked
                                }}
                            />
                        </div>
                        {enabledLogin.sso && (
                            <div className={classes.loginBody}>
                                <div className={classes.seperator} />
                                <Grid key="form-body" container>
                                    <Grid item xs={4} className={classes.formFontStyle}>
                                        <Typography
                                            variant="subtitle1"
                                            className={clsx(classes.fontSize4, classes.fontColor)}
                                        >
                                            Display Name:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            label="Enter display name"
                                            id="ssoDisplayName"
                                            name="ssoDisplayName"
                                            variant="filled"
                                            fullWidth
                                            color="primary"
                                            className={classes.textField}
                                            value={fields.ssoDisplayName}
                                            onChange={handleInputChange}
                                            autoComplete="false"
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                    </div>
                    <div className={classes.loginConfigContainer}>
                        <div className={classes.loginHeader}>
                            <span>SAML Login</span>
                            <div className={classes.samlSwitch}>
                                <a
                                    className={classes.docsButton}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={saml_docs}
                                >
                                    View Docs
                                </a>
                                <Switch
                                    focusVisibleClassName={classes.focusVisible}
                                    disableRipple
                                    checked={enabledLogin.saml}
                                    onChange={(e) => handleConfigChange(e, 'saml')}
                                    classes={{
                                        root: classes.root,
                                        switchBase: classes.switchBase,
                                        thumb: classes.thumb,
                                        track: classes.track,
                                        checked: classes.checked
                                    }}
                                />
                            </div>
                        </div>
                        {enabledLogin.saml && (
                            <div className={classes.loginBody}>
                                <div className={classes.seperator} />
                                <Grid key="form-body" container spacing={2}>
                                    <Grid item xs={4} className={classes.formFontStyle}>
                                        <Typography
                                            variant="subtitle1"
                                            className={clsx(classes.fontSize4, classes.fontColor)}
                                        >
                                            Callback Url:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            id="callbackUrl"
                                            name="callbackUrl"
                                            variant="standard"
                                            fullWidth
                                            color="primary"
                                            className={classes.textField}
                                            value={fields.callbackUrl}
                                            disabled
                                            autoComplete="false"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid key="form-body" container spacing={2}>
                                    <Grid item xs={4} className={classes.formFontStyle}>
                                        <Typography
                                            variant="subtitle1"
                                            className={clsx(classes.fontSize4, classes.fontColor)}
                                        >
                                            Display Name:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            label="Enter display name"
                                            id="samlDisplayName"
                                            name="samlDisplayName"
                                            variant="filled"
                                            fullWidth
                                            color="primary"
                                            className={classes.textField}
                                            value={fields.samlDisplayName}
                                            onChange={handleInputChange}
                                            autoComplete="false"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid key="form-body" container spacing={2}>
                                    <Grid item xs={4} className={classes.formFontStyle}>
                                        <Typography
                                            variant="subtitle1"
                                            className={clsx(classes.fontSize4, classes.fontColor)}
                                        >
                                            Metadata File* :
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            ref={fileRef}
                                            id="metadataFile"
                                            name="metadataFile"
                                            onChange={handleFileInputChange}
                                            className={classes.fileField}
                                            type="file"
                                            InputProps={{
                                                disableUnderline: true,
                                                startAdornment: (
                                                    <>
                                                        {!metadataFile && (
                                                            <Box
                                                                onDragOver={handleDragOver}
                                                                onDrop={handleDrop}
                                                                className={classes.uploadContainer}
                                                            >
                                                                <Button
                                                                    aria-label="publish"
                                                                    onClick={triggerClick}
                                                                    variant="text"
                                                                >
                                                                    <UploadIcon
                                                                        color={
                                                                            themeGlobal.palette
                                                                                .icons.uploadIcon
                                                                        }
                                                                    />
                                                                </Button>
                                                                <Typography variant={'h4'}>
                                                                    <b>Drag & Drop</b> or{' '}
                                                                    <b>Choose file</b> to upload
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                        {metadataFile && (
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                className={classes.fileName}
                                                            >
                                                                <span title={metadataFile.name}>
                                                                    {metadataFile.name}
                                                                </span>
                                                                <CloseIcon
                                                                    title="remove"
                                                                    className={classes.closeIcon}
                                                                    onClick={() => remove_file()}
                                                                ></CloseIcon>
                                                            </Grid>
                                                        )}
                                                    </>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginConfig;
