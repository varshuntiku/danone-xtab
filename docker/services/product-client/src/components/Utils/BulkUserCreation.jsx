import React, { useState, Fragment, useEffect } from 'react';
import {
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Switch,
    ListItemText,
    ThemeProvider,
    Tooltip,
    Chip,
    makeStyles,
    Radio,
    Popper
} from '@material-ui/core';
import UserTable from './UserTable.jsx';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
    bulkUserUpload,
    addUser,
    getUsers,
    getUserGroups,
    getAllApps
} from '../../services/dashboard.js';
import { createAppUser } from '../../services/admin_users.js';

import CodxPopupDialog from '../custom/CodxPoupDialog';
import { Close } from '@material-ui/icons';
import clsx from 'clsx';
import { textCompTheme } from '../../components/dynamic-form/inputFields/textInput';
import { selectCompTheme } from '../../components/dynamic-form/inputFields/select';
import CodxCircularLoader from '../../components/CodxCircularLoader.jsx';
import { logMatomoEvent } from '../../services/matomo.js';
import { getMatomoPvid } from 'store/index';
import { connect } from 'react-redux';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { getAllRoles } from 'services/role';
import { useDebouncedEffect } from 'hooks/useDebounceEffect.js';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
const checkedIcon = <CheckBoxIcon fontSize="medium" />;

const useStyles = makeStyles((theme) => ({
    fontSize1: {
        fontSize: '2rem',
        marginBottom: '1%'
    },
    fontSize2: {
        fontSize: '2rem'
    },
    fontSize3: {
        fontSize: '2rem',
        marginTop: '4%',
        marginBottom: '1.5%'
    },
    fontSize4: {
        fontSize: '1.75rem',
        letterSpacing: '0.07rem'
    },
    fontSize5: {
        fontSize: '1.5rem',
        letterSpacing: '0.07rem'
    },
    fontColor: {
        color: theme.palette.text.default
    },

    dialogRoot: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.paper
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        letterSpacing: '0.094rem',
        color: theme.palette.primary.contrastText,
        opacity: '0.8'
    },
    uploadButton: {
        width: '15rem',
        height: '4rem',
        fontSize: '0.75rem'
    },

    formBodyHeading: {
        marginBottom: '1.5rem'
    },
    formFontStyle: {
        alignSelf: 'center'
    },

    textField: {
        fontSize: '2rem',
        marginBottom: '1%',
        color: theme.palette.text.default,
        padding: '0.625rem',
        '& .Mui-disabled': {
            opacity: '0.3'
        },
        '& .MuiFilledInput': {
            backgroundColor: 'transparent !important'
        },
        '& .MuiInputBase-input': {
            backgroundColor: 'transparent !important'
        }
    },

    iconColor: {
        color: theme.palette.primary.contrastText
    },
    dialogSpan: {
        display: 'flex'
    },

    option: {
        fontSize: 15,
        color: theme.palette.primary.contrastText
    },
    chip: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText
    },
    noOptions: {
        fontSize: 15,
        color: theme.palette.text.default
    },
    loading: {
        fontSize: 15,
        color: theme.palette.text.default
    },
    clearSearch: {
        color: 'red',
        fontSize: '1.2rem',
        float: 'right',
        fontWeight: 600
    },
    clearBtnIcon: {
        color: 'red !important'
    }
}));

const dialogStyle = makeStyles((theme) => ({
    dialogRoot: {
        margin: 0,
        padding: '1rem 1rem 1rem 3.1rem',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        background: theme.palette.background.modelBackground,
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: `0.5px solid ${theme.palette.border.light}`
    },
    dialogTitle: {
        fontSize: '2.2rem',
        letterSpacing: '0.2rem',
        color: theme.palette.text.titleText,
        opacity: '0.8',
        alignSelf: 'center'
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.75rem',
        marginBottom: 0
    }
}));

const defaultValues = {};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    variant: 'menu',
    getContentAnchorEl: null
};

const CustomPopper = (props) => {
    return <Popper {...props} placement="top" />;
};

const BulkUserCreation = (props) => {
    const [data, setData] = useState(0);
    const [open, setOpen] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [snackbar, setSnackbarState] = useState({
        open: false
    });
    const [formValues, setFormValues] = useState(defaultValues);
    const [selectedGroup, setSelectedGroup] = React.useState([]);
    const [checked, setChecked] = useState(false);
    const [userGroups, setUserGroups] = useState([]);
    const [rowsData, setRowsData] = useState([]);
    const [appsData, setAppsData] = useState([]);
    const [selectedApps, setSelectedApps] = React.useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userCount, setuserCount] = useState(0);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedRoleList, setSelectedRoleList] = useState([]);
    const [fetchData, setFetchData] = useState(true);
    const [enableNacRole, setEnableNacRole] = useState(false);
    const [appLoader, setAppLoader] = useState(false);
    const [scrollPage, setScrollPage] = useState({
        default: 0,
        search: 0
    });
    const [perPageOptions] = useState(20);
    const [hasNext, setHasNext] = useState({
        default: false,
        search: false
    });
    const [searchText, setSearchText] = useState('');
    const [searchedApp, setSearchedApp] = useState([]);
    const [error, setError] = useState({
        first_name: false,
        last_name: false,
        email_address: false
    });
    const [restrictedAccess, setRestrictedAccess] = useState(true);

    useEffect(() => {
        props.setActionButtons(
            <>
                <Tooltip
                    title={
                        <Typography
                            variant="subtitle2"
                            className={clsx(classes.fontSize5, classes.fontColor)}
                        >
                            Create New User
                        </Typography>
                    }
                >
                    <Button
                        variant="contained"
                        component="label"
                        className={classes.uploadButton}
                        startIcon={<AccountCircleIcon className={classes.iconColor} />}
                        onClick={handleFormModalOpen}
                        aria-label="Single user"
                    >
                        Single
                    </Button>
                </Tooltip>

                <Tooltip
                    title={
                        <Typography
                            variant="subtitle2"
                            className={clsx(classes.fontSize5, classes.fontColor)}
                        >
                            Upload bulk users
                        </Typography>
                    }
                >
                    <Button
                        variant="contained"
                        component="label"
                        className={classes.uploadButton}
                        startIcon={<SupervisedUserCircleIcon className={classes.iconColor} />}
                        aria-label="Bulk user"
                    >
                        Bulk
                        <input
                            id="handle-file-upload"
                            type="file"
                            hidden
                            accept="application/vnd.ms-excel"
                            onChange={handleFileChange}
                        />
                    </Button>
                </Tooltip>

                <Tooltip
                    title={
                        <Typography
                            variant="subtitle2"
                            className={clsx(classes.fontSize5, classes.fontColor)}
                        >
                            Download sample user upload template
                        </Typography>
                    }
                >
                    <Button
                        variant="contained"
                        className={classes.uploadButton}
                        onClick={downloadTemplate}
                        startIcon={<GetAppIcon className={classes.iconColor} />}
                        aria-label="Download"
                    >
                        Download
                    </Button>
                </Tooltip>
            </>
        );

        props.getMatomoPvid('bulkUserUpload');
        // fetchAllUsers();
        // fetchApps();
        getUserGroups()
            .then((res) => {
                setUserGroups([...res]);
            })
            .catch(() => {
                setSnackbarState({
                    open: true,
                    message: `Error Fetching user Group!Please try again`,
                    severity: 'error'
                });
            });
        getAllRoles()
            .then(({ data }) => setUserRoles(data))
            .catch(() => {
                setSnackbarState({
                    open: true,
                    message: `Error Fetching user roles! Please try again`,
                    severity: 'error'
                });
            });
    }, []);

    useEffect(() => {
        if (props.matomo?.pv_id) {
            logMatomoEvent({
                action_name: 'BulkUserModule',
                url: window.location.href,
                urlref: window.location.href,
                pv_id: props.matomo.pv_id
            });
        }
    }, [props.matomo.pv_id]);

    useDebouncedEffect(
        () => {
            if (searchText) {
                onSearchWithDebounce();
            }
            if (!searchText && appLoader) {
                setAppLoader(false);
            }
        },
        [searchText],
        2000
    );

    const onSearchWithDebounce = () => {
        if (!appLoader) {
            setAppLoader(true);
        }
        if (searchedApp) {
            setSearchedApp([]);
        }
        setScrollPage({
            ...scrollPage,
            search: 0
        });
        fetchApps(searchText);
    };

    const fetchAllUsers = (payloadData = { pageSize: 10, page: 0, filtered: [], sorted: [] }) => {
        //needs to be dynamic
        if (open) {
            setOpen(false);
        }
        setLoading(true);
        const payload = {
            pageSize: payloadData.pageSize,
            page: payloadData.page,
            filtered: payloadData.filtered.length ? JSON.stringify(payloadData.filtered) : null,
            sorted: payloadData.sorted.length ? JSON.stringify(payloadData.sorted) : null,
            user_type: 'active'
        };
        getUsers(payload)
            .then((response) => {
                setRowsData([...response.data]);
                setuserCount(response.count);
                setFetchData(false);
                setLoading(false);
            })
            .catch(() => {
                setSnackbarState({
                    open: true,
                    message: `Error Fetching Users! Please try again.`,
                    severity: 'error'
                });
                setLoading(false);
            });
    };

    const fetchApps = async (value = '') => {
        if (!appLoader) {
            setAppLoader(true);
        }
        const payload = {
            page: value ? scrollPage.search : scrollPage.default,
            pageSize: perPageOptions,
            filtered: value ? JSON.stringify({ id: 'name', value: value }) : null
        };
        try {
            await getAllApps({
                industry: decodeURIComponent('CPG'),
                payload: payload,
                callback: onResponseGetApps
            });
        } catch (error) {
            setSnackbarState({
                open: true,
                message: `Error Fetching All App. Try again.`,
                severity: 'error'
            });
            setLoading(false);
        }
    };

    const onResponseGetApps = (response_data) => {
        let appArray = [];
        response_data.data.forEach(function (item) {
            appArray.push({ id: item.id, name: item.name });
        });
        if (searchText === '') {
            const updatedAppList = appsData.length ? appsData.concat(appArray) : appArray;
            setAppsData(updatedAppList);
            setHasNext({
                ...hasNext,
                default: response_data.hasNext
            });
            setScrollPage({
                ...scrollPage,
                default: scrollPage.default + 1
            });
        } else {
            const updatedAppList = searchedApp.length ? searchedApp.concat(appArray) : appArray;
            setSearchedApp(updatedAppList);
            setHasNext({
                ...hasNext,
                search: response_data.hasNext
            });
            setScrollPage({
                ...scrollPage,
                search: scrollPage.search + 1
            });
        }
        setAppLoader(false);
    };

    const handleFormModalOpen = () => setOpenFormModal(true);

    const classes_dialog = dialogStyle();
    const classes = useStyles();

    const handleFileChange = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setOpen(true);
        let file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        bulkUserUpload({
            payload: formData
        })
            .then((response) => {
                logMatomoEvent({
                    e_c: 'BulkUserUpload',
                    e_a: 'success-bulk-upload-file-action',
                    ca: 1,
                    url: window.location.href,
                    // urlref: window.location.href,
                    pv_id: props.matomo.pv_id
                });
                setData(response);
                document.getElementById('handle-file-upload').value = null;
                setIsLoading(false);
            })
            .catch((err) => {
                logMatomoEvent({
                    e_c: 'BulkUserUpload',
                    e_a: 'error-bulk-upload-file-action',
                    ca: 1,
                    url: window.location.href,
                    // urlref: window.location.href,
                    pv_id: props.matomo.pv_id
                });

                setSnackbarState({
                    open: true,
                    message: `${err.response?.data?.message || 'Error,Please try again'}`,
                    severity: 'error'
                });
                document.getElementById('handle-file-upload').value = null;
                setIsLoading(false);
            });
    };

    const downloadTemplate = () => {
        logMatomoEvent({
            e_c: 'BulkUserUpload',
            e_a: 'download-template-action',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });
        window.location.href = `${
            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
        }/codex-data-static-assets/user_creation_template.xls`;
    };

    const ValidateEmail = (input) => {
        if (input) return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]+)+$/.test(input);
        return true;
    };

    const handleAppChange = (event, values) => {
        setSelectedApps(values);
    };

    const dialogActions = (
        <Fragment>
            <Button variant="outlined" onClick={() => fetchAllUsers()} aria-label="Okay">
                Okay
            </Button>
        </Fragment>
    );
    const validateMandatoryInputs = () => {
        const { first_name, last_name, email_address } = formValues;
        let newError = {};
        if (!first_name) newError.first_name = true;
        if (!last_name) newError.last_name = true;
        if (!email_address) newError.email_address = true;
        if (Object.keys(newError).length === 0) return true;
        setError(newError);
        return false;
    };
    const handleSubmit = async (event) => {
        logMatomoEvent({
            e_c: 'BulkUserUpload',
            e_a: 'file-upload-form-submit-action',
            ca: 1,
            url: window.location.href,
            // urlref: window.location.href,
            pv_id: props.matomo.pv_id
        });

        formValues.email_address = event.target.elements.email_address.value;
        formValues.first_name = event.target.elements.first_name.value;
        formValues.last_name = event.target.elements.last_name.value;
        formValues.userCred = event.target.elements.userCred.value;

        event.preventDefault();

        let newarr = selectedGroup.map((name) => {
            let obj = userGroups.find((x) => x.name === name);
            return obj.id;
        });

        formValues.user_groups = newarr;

        newarr = selectedRoleList.map((name) => {
            let obj = userRoles.find((x) => x.name === name);
            return obj.id;
        });

        formValues.nac_user_roles = newarr;

        let appArr = [];
        selectedApps.forEach(function (item) {
            appArr.push(item.id);
        });

        formValues.user_apps = appArr;
        formValues.restricted_user = checked;
        formValues.restricted_access = checked && restrictedAccess;
        if (validateMandatoryInputs()) {
            try {
                const { first_name, last_name, email_address, user_apps } = formValues;
                setLoading(true);
                await addUser({ ...formValues, password: formValues.userCred });
                user_apps.forEach(async (app) => {
                    await createAppUser({
                        payload: {
                            app_id: app,
                            first_name: first_name,
                            last_name: last_name,
                            email_address: email_address
                        }
                    });
                });
                setSnackbarState({
                    open: true,
                    message: `User Succesully Added`,
                    severity: 'success'
                });
                setOpenFormModal(false);
                setFormValues(defaultValues);
                setSelectedGroup([]);
                setSelectedRoleList([]);
                setChecked(false);
                setEnableNacRole(false);
                fetchAllUsers();
                document.getElementById('handle-file-upload').value = null;
            } catch (err) {
                setSnackbarState({
                    open: true,
                    message: `${err.response ? err.response.data.error : 'Error,Please try again'}`,
                    severity: 'error'
                });
                document.getElementById('handle-file-upload').value = null;
            } finally {
                setLoading(false);
            }
        }
        // else {
        //     setSnackbarState({
        //         open: true,
        //         message: `Provide correct email format`,
        //         severity: 'error'
        //     });
        // }
    };
    const handleErrors = (value, name) => {
        let newError = { ...error };
        if (!value || (name === 'email_address' && !ValidateEmail(value))) {
            newError[name] = true;
        } else {
            newError[name] = false;
        }
        setError(newError);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleErrors(value, name);
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleToggleChange = (event, label) => {
        label === 'user'
            ? setChecked(event.target.checked)
            : setRestrictedAccess(event.target.checked);
        if (label === 'user' && !event.target.checked) {
            setSelectedApps([]);
        }
    };

    const handleMultiSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        let curUserGroups = typeof value === 'string' ? value.split(',') : value;
        setSelectedGroup(curUserGroups);
        let appPublishRole = userGroups
            .map((group) => group.app_publish === true && group.name)
            .filter(Boolean);
        const isNacUser = curUserGroups.some((group) => appPublishRole.includes(group));
        if (!isNacUser) {
            setSelectedRoleList([]);
        }
        setEnableNacRole(curUserGroups.some((group) => appPublishRole.includes(group)));
    };
    const handleRoleSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        setSelectedRoleList(typeof value === 'string' ? value.split(',') : value);
    };
    const postUploadDialogContent = (
        <Fragment>
            {isLoading ? (
                <Fragment>
                    <CodxCircularLoader size={60} />
                </Fragment>
            ) : (
                <Fragment>
                    <span className={classes.dialogSpan}>
                        No. of users added: {data.users_added}
                    </span>
                    <span className={classes.dialogSpan}>
                        No. of users ignored: {data.users_ignored}
                    </span>
                    <span className={classes.dialogSpan}>
                        No. of users access reinstated: {data.user_access_reinstated}
                    </span>
                </Fragment>
            )}
        </Fragment>
    );

    const handleAppListScroll = (e) => {
        const { scrollTop, scrollHeight, offsetHeight } = e.target;
        const hasScrollReachedBottom = offsetHeight + scrollTop > scrollHeight - 40;
        const next = searchText ? hasNext.search : hasNext.default;
        if (hasScrollReachedBottom && !appLoader && next) {
            setAppLoader(true);
            fetchApps(searchText);
        }
    };

    const handleAppFilter = () => {
        // if(!appLoader && searchText){
        //     setAppLoader(true)
        // }
        return searchText ? searchedApp : appsData;
    };

    const handleAppListClose = () => {
        setSearchText('');
        setSearchedApp([]);
        setScrollPage({
            ...scrollPage,
            search: 0
        });
        setHasNext({
            ...hasNext,
            search: false
        });
    };

    const handleApplicationSearch = (e) => {
        const value = e.target.value;
        if (value !== searchText) {
            setSearchText(e.target.value);
            setSearchedApp([]);
            setScrollPage({
                ...scrollPage,
                search: 0
            });
        }
        setAppLoader(true);
    };
    const handleBlur = (event) => {
        const { name, value } = event.target;
        handleErrors(value, name);
    };

    return (
        <>
            <UserTable
                rowsData={rowsData}
                fetchAllUsers={fetchAllUsers}
                userGroups={userGroups}
                userCount={userCount}
                userRoles={userRoles}
                dataFetch={fetchData}
                dataLoading={loading}
            />
            <CodxPopupDialog
                open={open}
                setOpen={setOpen}
                dialogTitle="Users Added"
                dialogContent={postUploadDialogContent}
                dialogActions={dialogActions}
                dialogClasses={classes_dialog}
                maxWidth="xs"
            />

            <Dialog
                key={3}
                open={openFormModal}
                maxWidth="md"
                classes={{ paper: classes.dialogPaper }}
                aria-labelledby="create-new-user"
                aria-describedby="user-form-content"
            >
                <DialogTitle
                    disableTypography
                    className={classes_dialog.dialogRoot}
                    title="create-new-user"
                    id="create-new-user"
                >
                    <Typography
                        variant="subtitle1"
                        className={clsx(
                            classes.fontSize2,
                            classes.fontColor,
                            classes.formBodyHeading
                        )}
                    >
                        Create New User
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            setOpenFormModal(false);
                            setFormValues(defaultValues);
                            setSelectedGroup([]);
                            setSelectedRoleList([]);
                            setChecked(false);
                            setEnableNacRole(false);
                        }}
                        style={{ position: 'absolute', top: '4px', right: 0 }}
                        aria-label="Close"
                    >
                        <Close fontSize="large" />
                    </IconButton>
                </DialogTitle>
                <form id="user-create-form" onSubmit={handleSubmit}>
                    <DialogContent id="user-form-content">
                        <Grid key="form-body" container spacing={2}>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    First Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        label="Enter First Name*"
                                        id="first_name"
                                        name="first_name"
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.first_name || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={error.first_name}
                                        helperText={
                                            error.first_name ? 'First Name is Mandatory' : ''
                                        }
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Last Name:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        label="Enter last name*"
                                        id="last_name"
                                        name="last_name"
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.last_name || ''}
                                        onChange={handleInputChange}
                                        onBlur={(e) => handleBlur(e)}
                                        error={error.last_name}
                                        helperText={error.last_name ? 'Last Name is Mandatory' : ''}
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Email Address:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        label="Enter email address*"
                                        id="email_address"
                                        name="email_address"
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.email_address || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        error={error.email_address}
                                        helperText={
                                            error.email_address
                                                ? formValues.email_address &&
                                                  !ValidateEmail(formValues.email_address)
                                                    ? 'Enter a valid email'
                                                    : 'Email is Mandatory'
                                                : ''
                                        }
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Password:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={textCompTheme}>
                                    <TextField
                                        label="Enter password"
                                        id="userCred"
                                        name="userCred"
                                        type="password"
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.userCred}
                                        onChange={handleInputChange}
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Select User Groups:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl
                                        id="multi-select-user-group"
                                        variant="filled"
                                        fullWidth
                                        className={clsx(classes.textField)}
                                    >
                                        <InputLabel id="demo-multiple-checkbox-label">
                                            Select User Groups
                                        </InputLabel>
                                        <Select
                                            labelId="multiple-checkbox-label"
                                            name="user_groups"
                                            id="multiple-checkbox"
                                            inputProps={{ 'data-name-access-group': 'user-group' }}
                                            multiple
                                            value={selectedGroup}
                                            onChange={handleMultiSelectChange}
                                            MenuProps={MenuProps}
                                            renderValue={(selected) => selected.join(', ')}
                                            fullWidth
                                        >
                                            {userGroups?.map((name) => (
                                                <MenuItem key={name.id} value={name.name}>
                                                    <Checkbox
                                                        checked={
                                                            selectedGroup?.indexOf(name.name) > -1
                                                        }
                                                    />
                                                    <ListItemText primary={name.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Select Solution Workbench Role:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl
                                        id="select-user-role"
                                        variant="filled"
                                        fullWidth
                                        className={clsx(classes.textField)}
                                        disabled={!enableNacRole}
                                    >
                                        <InputLabel id="demo-checkbox-label">
                                            Select Solution Workbench Role
                                        </InputLabel>
                                        <Select
                                            labelId="checkbox-label"
                                            name="user_role"
                                            id="checkbox"
                                            inputProps={{ 'data-name-access-group': 'user-role' }}
                                            value={selectedRoleList}
                                            onChange={handleRoleSelectChange}
                                            MenuProps={MenuProps}
                                            renderValue={(selected) => selected.join(', ')}
                                            fullWidth
                                            disabled={!enableNacRole}
                                        >
                                            {userRoles?.map((name) => (
                                                <MenuItem key={name.id} value={name.name}>
                                                    <Radio
                                                        checked={
                                                            selectedRoleList?.indexOf(name.name) >
                                                            -1
                                                        }
                                                    />
                                                    <ListItemText primary={name.name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Restricted User:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Switch
                                    id="switch"
                                    checked={checked}
                                    onChange={(e) => handleToggleChange(e, 'user')}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </Grid>
                            {checked && (
                                <>
                                    <Grid item xs={4} className={classes.formFontStyle}>
                                        <Typography
                                            variant="subtitle2"
                                            className={clsx(classes.fontSize4, classes.fontColor)}
                                        >
                                            Choose Default 14 Days Window:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Switch
                                            id="switchAccess"
                                            checked={restrictedAccess}
                                            onChange={(e) => handleToggleChange(e, 'access')}
                                            inputProps={{ 'aria-label': 'controlledAccess' }}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={4} className={classes.formFontStyle}>
                                <Typography
                                    variant="subtitle2"
                                    className={clsx(classes.fontSize4, classes.fontColor)}
                                >
                                    Select Apps:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <Autocomplete
                                        disabled={!checked}
                                        multiple
                                        fullWidth
                                        limitTags={3}
                                        id="checkboxes-tags-demo"
                                        options={searchText ? searchedApp : appsData}
                                        onChange={handleAppChange}
                                        disableCloseOnSelect
                                        classes={{
                                            option: classes.option,
                                            noOptions: classes.noOptions,
                                            loading: classes.loading
                                        }}
                                        getOptionLabel={(option) =>
                                            `${option.name} - ${option.id.toString()}`
                                        }
                                        renderTags={(value, getTagProps) =>
                                            checked
                                                ? value.map((option, index) => (
                                                      <Chip
                                                          key={'chip' + index}
                                                          classes={{ root: classes.chip }}
                                                          variant="outlined"
                                                          label={option.name}
                                                          size="medium"
                                                          {...getTagProps({ index })}
                                                      />
                                                  ))
                                                : []
                                        }
                                        renderOption={(option, { selected }) => (
                                            <React.Fragment>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {`${option.name} - (${option.id})`}
                                            </React.Fragment>
                                        )}
                                        renderInput={(params) => (
                                            <Fragment>
                                                <TextField
                                                    {...params}
                                                    variant="filled"
                                                    placeholder="Select Apps"
                                                    onChange={handleApplicationSearch}
                                                    id="select apps"
                                                />
                                                {searchText && (
                                                    <Button
                                                        className={classes.clearSearch}
                                                        onClick={() => setSearchText('')}
                                                        startIcon={
                                                            <CancelOutlinedIcon
                                                                className={classes.clearBtnIcon}
                                                            />
                                                        }
                                                        aria-label="Clear search"
                                                    >
                                                        Clear Search
                                                    </Button>
                                                )}
                                            </Fragment>
                                        )}
                                        ListboxProps={{
                                            onScroll: handleAppListScroll
                                        }}
                                        onOpen={
                                            appsData.length === 0 ? fetchApps.bind(null, '') : null
                                        }
                                        filterOptions={handleAppFilter}
                                        onClose={handleAppListClose}
                                        getOptionSelected={(option, value) =>
                                            option.id === value.id
                                        }
                                        loading={appLoader}
                                        noOptionsText={'No Application Found'}
                                        inputValue={searchText}
                                        openOnFocus
                                        PopperComponent={CustomPopper}
                                    />
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions style={{ padding: '1rem' }}>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={() => {
                                setOpenFormModal(false);
                                setFormValues(defaultValues);
                                setSelectedGroup([]);
                                setSelectedRoleList([]);
                                setChecked(false);
                                setSelectedApps([]);
                                setEnableNacRole(false);
                            }}
                            aria-label="Cancel"
                            data-testid="cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="medium"
                            variant="contained"
                            type="submit"
                            disabled={
                                loading ||
                                error.first_name ||
                                error.last_name ||
                                error.email_address
                            }
                            aria-label="Save"
                            data-testid="save-button"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => {
                    setSnackbarState({
                        open: false
                    });
                }}
                severity={snackbar.severity}
            />
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    BulkUserCreation
);
