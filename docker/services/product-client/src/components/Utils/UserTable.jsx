import React, { useState, Fragment, useEffect } from 'react';
import CustomSnackbar from '../../components/CustomSnackbar.jsx';
import CodxPopupDialog from '../custom/CodxPoupDialog';
import {
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    Typography,
    DialogContent,
    Button,
    Switch,
    FormControl,
    InputLabel,
    Select,
    ListItemText,
    MenuItem,
    Checkbox,
    Radio,
    ThemeProvider,
    Grid,
    Chip,
    Popper,
    alpha
} from '@material-ui/core';
import {
    deleteUser,
    editUser,
    getUserDetails,
    getUserAppDetails,
    getAllApps,
    updateUserAppDetails
} from '../../services/dashboard.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { makeStyles } from '@material-ui/styles';
import CodxCircularLoader from '../../components/CodxCircularLoader.jsx';
import clsx from 'clsx';
import { textCompTheme } from '../../components/dynamic-form/inputFields/textInput';
import { selectCompTheme } from '../../components/dynamic-form/inputFields/select';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useDebouncedEffect } from 'hooks/useDebounceEffect.js';
import UtilsDataTable from './UtilsDataTable';
import CloseIcon from '../../assets/Icons/CloseBtn';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />;
const checkedIcon = <CheckBoxIcon fontSize="medium" />;

const useStyles = makeStyles((theme) => ({
    paginationWrapper: {
        '& .MuiToolbar-root': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7),
            borderTop: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
            backgroundColor: theme.palette.primary.light
        },
        '& .MuiTablePagination-caption': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        },
        '& .MuiTablePagination-selectIcon': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(1.7)
        }
    },
    root: {
        '& label.Mui-focused': {
            color: theme.palette.text.default
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.text.default
        },
        '& .MuiInput:after': {
            borderBottomColor: 'transparent'
        },
        '& svg': {
            color: theme.palette.text.default
        },

        padding: theme.spacing(1),
        fontSize: '1.50rem',
        width: '30vw',
        backgroundColor: theme.palette.primary.dark,
        borderRadius: theme.spacing(0.5),
        color: theme.palette.text.default,
        marginBottom: theme.spacing(2),
        '& .MuiFormHelperText-root': {
            color: theme.palette.text.default,
            fontSize: '1.25rem',
            fontStyle: 'italic'
        },
        '& .MuiInputBase-input': {
            color: 'white',
            fontSize: '2rem'
        }
    },
    searchIcon: {
        width: '2.25rem',
        height: '2.25rem',
        alignSelf: 'center'
    },
    main: {
        margin: '10px'
    },
    dialogContentText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem'
    },
    textField: {
        fontSize: '2rem',
        marginBottom: '1%',
        color: theme.palette.text.default,
        padding: '0.625rem',
        '& .Mui-disabled': {
            // color: 'rgba(0, 0, 0, 0.38)'
            opacity: '0.3'
        }
    },
    tableSearchField: {
        fontSize: '2rem',
        color: theme.palette.text.default
    },

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
    fontColor: {
        color: theme.palette.text.default
    },
    dialogTitle: {
        fontSize: theme.spacing(2.5),
        letterSpacing: '0.094rem',
        color: theme.palette.primary.contrastText,
        opacity: '0.8'
    },
    formFontStyle: {
        alignSelf: 'center'
    },

    uploadButton: {
        color: '#6DF0C2',
        width: '15rem',
        height: '4rem',
        fontSize: '0.75rem',
        margin: theme.spacing(2, 2)
    },
    formBodyHeading: {
        marginBottom: '1.5rem'
    },
    option: {
        fontSize: 15,
        color: theme.palette.primary.contrastText
    },
    chip: {
        fontSize: '1.5rem',
        color: theme.palette.primary.contrastText
    },

    tableHeader: {
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        verticalAlign: 'top',
        '& div': {
            marginTop: '0.5rem',
            marginBottom: '0.2rem',
            '& div.MuiInput-underline:before': {
                borderColor:
                    theme.props.mode === 'dark'
                        ? 'rgba(255,255,255,0.6)'
                        : theme.palette.border.light
            }
        },
        background: theme.palette.primary.light
    },
    sortedLabel: {
        '&.MuiTableSortLabel-active ': {
            color: theme.palette.text.titleText
        },
        '&.MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon':
            {
                color: theme.palette.text.titleText
            }
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
    },
    iconStyle: {
        '& .MuiSvgIcon-root': {
            color: `${theme.palette.icons.closeIcon} !important`
        }
    }
}));

const dialogStyle = makeStyles((theme) => ({
    dialogRoot: {
        margin: 0,
        background: theme.palette.background.modelBackground,
        padding: theme.layoutSpacing(20),
        '& .MuiTypography-subtitle1': {
            color: theme.palette.text.titleText,
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            opacity: 0.8,
            fontFamily: theme.title.h1.fontFamily
        },
        display: 'flex',
        justifyContent: 'space-between'
    },
    dialogTitle: {
        fontSize: '2.2rem',
        letterSpacing: '0.2rem',
        color: theme.palette.text.titleText,
        opacity: '0.8',
        alignSelf: 'center'
    },
    dialogPaper: {
        background: theme.palette.background.modelBackground,
        backdropFilter: 'blur(2rem)',
        borderRadius: 0,
        border: 'none'
    },
    dialogContent: {
        paddingLeft: theme.layoutSpacing(44),
        paddingRight: theme.layoutSpacing(44),
        paddingTop: theme.layoutSpacing(40)
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
        '& svg': {
            fill: `${theme.palette.icons.closeIcon}!important`
        }
    }
}));

const defaultValues = {
    first_name: '',
    last_name: '',
    email_address: ''
};

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

const tableHeaderCells = [
    {
        id: 'first_name',
        label: 'First Name',
        enableSorting: true,
        enableSearching: true
    },
    {
        id: 'last_name',
        label: 'Last Name',
        enableSorting: true,
        enableSearching: true
    },
    {
        id: 'email_address',
        label: 'Email Address',
        enableSorting: true,
        enableSearching: true
    },
    {
        id: 'created_at',
        label: 'Created At',
        enableSorting: false,
        enableSearching: false
    },
    {
        id: 'restricted_user',
        label: 'Restricted Access',
        enableSorting: false,
        enableSearching: false
    },
    {
        id: 'user_group',
        label: 'User Groups',
        enableSorting: false,
        enableSearching: false
    },
    {
        id: 'nac_user_roles',
        label: 'User Role',
        enableSorting: false,
        enableSearching: false
    },
    {
        id: 'actions',
        label: 'Actions',
        enableSorting: false,
        enableSearching: false
    }
];

const CustomPopper = (props) => {
    return <Popper {...props} placement="top" />;
};

export default function UserTable(props) {
    const { rowsData, userGroups, userRoles, fetchAllUsers, userCount, dataLoading } = props;
    const classes = useStyles();
    const [userDetailsData, setUserDetailsData] = useState([]);
    const [snackbar, setSnackbarState] = useState({});
    const [checked, setChecked] = useState(false);
    const [paginationInfo, setPaginationInfo] = useState({
        page: 0,
        rowsPerPage: 10
    });
    const [formValues, setFormValues] = useState(defaultValues);
    const [selectedGroup, setSelectedGroup] = React.useState([]);
    const [selectedIdforDelete, setSelectedIdforDelete] = useState();
    const [open, setOpen] = useState(false);
    const [openEditUserModal, setOpenEditUserModal] = useState(false);
    const [appsData, setAppsData] = useState([]);
    const [selectedApps, setSelectedApps] = React.useState([]);
    const [defaultAppIds, setDefaultAppIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchInfo, setSearchInfo] = useState({ searchId: '', searchValue: '' });

    const [selectedRoleList, setSelectedRoleList] = useState([]);
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
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [restrictedAccess, setRestrictedAccess] = useState(true);

    useEffect(() => {
        fetchAllUsers({
            pageSize: paginationInfo.rowsPerPage,
            page: paginationInfo.page,
            filtered: [{ id: searchInfo.searchId, value: searchInfo.searchValue }],
            sorted: []
        });
    }, [
        searchInfo.searchId,
        searchInfo.searchValue,
        paginationInfo.rowsPerPage,
        paginationInfo.page
    ]);

    useEffect(() => {
        setLoading(false);
    }, [rowsData]);

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

    const onHandleSearch = (searchId, searchValue) => {
        setSearchInfo((prevState) => ({
            ...prevState,
            searchId,
            searchValue
        }));
    };

    const classes_dialog = dialogStyle();

    const removeUser = (row) => {
        setSelectedIdforDelete(row);
        setOpen(true);
    };

    const handleAppChange = (event, values) => {
        setSelectedApps(values);
    };

    const processSelectedGroupIdsforNames = (user_group_ids) => {
        let newarr = user_group_ids.map((id) => {
            let obj = userGroups.find((x) => x.id === id);
            return obj.name;
        });
        let appPublishRole = userGroups
            .map((group) => group.app_publish === true && group.name)
            .filter(Boolean);
        const isNacUser = newarr.some((group) => appPublishRole.includes(group));
        setSelectedGroup(newarr);
        setEnableNacRole(isNacUser);
    };

    const fetchApps = async (value = '') => {
        // TODO: FIXIT
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
            setNotificationOpen(true);
            setSnackbarState({
                message: error?.message || 'Failed to get All Apps',
                severity: 'error'
            });
            setAppLoader(false);
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

    const editUserModalOpen = (row) => {
        setLoading(true);
        // fetchApps();
        getUserDetails({
            id: row.id
        })
            .then((response) => {
                setUserDetailsData(response);
                setChecked(response.restricted_user);
                setRestrictedAccess(response.restricted_access);
                processSelectedGroupIdsforNames(response.user_groups);
                processSelectedRolesforNames(response.nac_user_roles);
                setFormValues({
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email_address: response.email_address
                });
                setOpenEditUserModal(true);
                setLoading(false);
            })
            .catch((error) => {
                setNotificationOpen(true);
                setSnackbarState({
                    message:
                        error.response?.data?.error || `Failed to fetch user details.Try again`,
                    severity: 'error'
                });
                setOpenEditUserModal(true);
                setLoading(false);
            });
        getUserAppDetails({
            email_address: row.email_address
        })
            .then((response) => {
                const onlyIds = [];
                const selectedAppsData = [];
                response.forEach((item) => {
                    onlyIds.push(item.id);
                    selectedAppsData.push({ id: item.id, name: item.name });
                });
                setSelectedApps(selectedAppsData);
                setDefaultAppIds(onlyIds);
            })
            .catch((error) => {
                setNotificationOpen(true);
                setSnackbarState({
                    message: error.response?.data?.error || `Failed to fetch user app details`,
                    severity: 'error'
                });
                setLoading(false);
            });
    };

    const handleToggleChange = (event, label) => {
        switch (label) {
            case 'user':
                setChecked(event.target.checked);
                setRestrictedAccess(event.target.checked);
                if (!event.target.checked) {
                    setSelectedApps([]);
                }
                break;
            case 'access':
                setRestrictedAccess(event.target.checked);
                break;
            default:
                break;
        }
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
        setEnableNacRole(isNacUser);
    };

    const ValidateEmail = (input) => {
        if (input) return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]+)+$/.test(input);
        return true;
    };
    const handleBlur = (event) => {
        const { name, value } = event.target;
        handleErrors(value, name);
    };
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
        event.preventDefault();
        formValues.restricted_user = checked;
        formValues.user_id = userDetailsData.id;
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
        formValues.restricted_access = checked && restrictedAccess;
        if (validateMandatoryInputs()) {
            try {
                const {
                    user_id,
                    first_name,
                    last_name,
                    email_address,
                    restricted_user,
                    user_groups,
                    user_apps,
                    nac_user_roles,
                    restricted_access
                } = formValues;
                setLoading(true);
                await editUser({
                    payload: {
                        first_name: first_name,
                        last_name: last_name,
                        user_id: user_id,
                        email_address: email_address,
                        restricted_user: restricted_user,
                        user_groups: user_groups,
                        nac_user_roles,
                        restricted_access: restricted_access
                    }
                });
                await updateUserAppDetails({
                    first_name: first_name,
                    last_name: last_name,
                    user_id: user_id,
                    email_address: email_address,
                    user_apps: user_apps,
                    default_apps: defaultAppIds
                });
                fetchAllUsers();
                setEnableNacRole(false);
                setNotificationOpen(true);
                setSnackbarState({
                    message: `User ${formValues.first_name} ${formValues.last_name} updated successfully!`,
                    severity: 'success'
                });
            } catch (err) {
                setNotificationOpen(true);
                setSnackbarState({
                    message: `${
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        'Error Updating User:Email might already exist/Update access blocked'
                    }`,
                    severity: 'error'
                });
            } finally {
                setOpenEditUserModal(false);
                setLoading(false);
            }
        }
        setSearchInfo({ ...searchInfo, searchValue: '' });
    };

    const processSelectedRolesforNames = (selectedRoles) => {
        let newarr = selectedRoles.map((id) => {
            let obj = userRoles.find((x) => x.id === id);
            return obj.name;
        });
        setSelectedRoleList(newarr);
        if (newarr.length) {
            setEnableNacRole(true);
        }
    };

    const handleRoleSelectChange = (event) => {
        const {
            target: { value }
        } = event;
        setSelectedRoleList(typeof value === 'string' ? value.split(',') : value);
    };

    const dialogActions = (
        <Fragment>
            <Button
                variant="outlined"
                onClick={() => {
                    deleteUser({
                        user_id: selectedIdforDelete.id
                    })
                        .then(() => {
                            setNotificationOpen(true);
                            setSnackbarState({
                                message: `User ${selectedIdforDelete.first_name} ${selectedIdforDelete.last_name} removed Succesfully!`,
                                severity: 'success'
                            });
                            fetchAllUsers();
                        })
                        .catch(() => {
                            setNotificationOpen(true);
                            setSnackbarState({
                                message: `User ${selectedIdforDelete.first_name} ${selectedIdforDelete.last_name} could not be deleted.Please try again!`,
                                severity: 'error'
                            });
                        });
                    setSearchInfo({ ...searchInfo, searchValue: '' });
                    setOpen(false);
                }}
                aria-label="confirm delete"
            >
                Okay
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    setOpen(false);
                    setSelectedApps([]);
                    setEnableNacRole(false);
                }}
                aria-label="Cancel delete"
            >
                Cancel
            </Button>
        </Fragment>
    );

    const dialogContent = (
        <Fragment>
            <div className={classes.dialogContentText}>
                <Typography
                    variant="subtitle1"
                    className={clsx(classes.fontSize1, classes.fontColor, classes.formBodyHeading)}
                >
                    Are you sure?
                </Typography>
            </div>
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

    const tableActions = (row) => (
        <>
            <IconButton
                aria-label="edit-user"
                title="Edit User"
                style={{ margin: 0 }}
                onClick={() => {
                    editUserModalOpen(row);
                }}
            >
                <EditIcon
                    style={{
                        width: '2.25rem',
                        height: '2.25rem'
                    }}
                />
            </IconButton>
            <IconButton
                aria-label="delete-user"
                style={{ margin: 0 }}
                onClick={() => {
                    removeUser(row);
                }}
            >
                <DeleteOutlinedIcon
                    style={{
                        color: 'red',
                        width: '2.25rem',
                        height: '2.25rem'
                    }}
                />
            </IconButton>
        </>
    );

    return (
        <>
            <UtilsDataTable
                tableHeaderCells={tableHeaderCells}
                tableData={rowsData}
                tableActions={tableActions}
                searchValue={searchInfo.searchValue}
                searchId={searchInfo.searchId}
                setStateInfo={setPaginationInfo}
                onHandleSearch={onHandleSearch}
                page="users"
                paginationInfo={{
                    page: paginationInfo.page,
                    rowsPerPage: paginationInfo.rowsPerPage,
                    totalCount: userCount
                }}
                loader={loading || dataLoading}
            />

            <CustomSnackbar
                message={snackbar.message}
                open={notificationOpen && snackbar.message}
                autoHideDuration={2000}
                onClose={() => {
                    setNotificationOpen(false);
                }}
                severity={snackbar.severity}
            />
            <CodxPopupDialog
                open={open}
                setOpen={setOpen}
                dialogContent={dialogContent}
                dialogActions={dialogActions}
                dialogClasses={classes_dialog}
                maxWidth="xs"
            />
            <Dialog
                key={3}
                open={openEditUserModal}
                maxWidth="md"
                aria-labelledby="manage-user"
                aria-describedby="user-form-content"
                classes={{ paper: classes_dialog.dialogPaper }}
            >
                <DialogTitle
                    disableTypography
                    className={classes_dialog.dialogRoot}
                    id="manage-user"
                >
                    <Typography variant="subtitle1">Edit User</Typography>
                    <IconButton
                        title="Close"
                        onClick={() => {
                            setOpenEditUserModal(false);
                            setEnableNacRole(false);
                        }}
                        className={classes_dialog.closeIcon}
                        style={{ position: 'absolute', right: 0 }}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes_dialog.sepratorLine} />
                <form onSubmit={handleSubmit}>
                    <DialogContent id="user-form-content" className={classes_dialog.dialogContent}>
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
                                        label="Enter First Name"
                                        name="first_name"
                                        variant="filled"
                                        fullWidth
                                        required
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.first_name}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        onBlur={handleBlur}
                                        error={error.first_name}
                                        helperText={
                                            error.first_name ? 'First Name is Mandatory' : ''
                                        }
                                        id="first_name"
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
                                        label="Enter Last Name"
                                        id="last_name"
                                        name="last_name"
                                        required
                                        variant="filled"
                                        fullWidth
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.last_name}
                                        onChange={handleInputChange}
                                        autoComplete="off"
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
                                        id="Email"
                                        label="Enter Email address"
                                        name="email_address"
                                        variant="filled"
                                        required
                                        fullWidth={true}
                                        color="primary"
                                        className={clsx(classes.textField)}
                                        value={formValues.email_address}
                                        onChange={handleInputChange}
                                        autoComplete="off"
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
                                    Select User Groups:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl
                                        id="multi-select-user-group"
                                        fullWidth
                                        variant="filled"
                                        className={clsx(classes.textField)}
                                    >
                                        <InputLabel id="demo-multiple-checkbox-label">
                                            Select User Groups
                                        </InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            name="user_groups"
                                            id="demo-multiple-checkbox"
                                            inputProps={{ 'data-name-access-group': 'user-group' }}
                                            multiple
                                            value={selectedGroup}
                                            onChange={handleMultiSelectChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                            required
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
                                    Select App Configurator Role:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <ThemeProvider theme={selectCompTheme}>
                                    <FormControl
                                        id="select-user-role"
                                        fullWidth
                                        variant="filled"
                                        className={clsx(classes.textField)}
                                        disabled={!enableNacRole}
                                    >
                                        <InputLabel id="demo-multiple-checkbox-label">
                                            Select App Configurator Role
                                        </InputLabel>
                                        <Select
                                            labelId="demo-checkbox-label"
                                            name="user_role"
                                            id="demo-checkbox"
                                            inputProps={{ 'data-name-access-group': 'user-role' }}
                                            value={selectedRoleList}
                                            onChange={handleRoleSelectChange}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
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
                                    Restricted Access:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Switch
                                    id="switch"
                                    checked={checked}
                                    size="small"
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
                                            size="small"
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
                                        value={selectedApps}
                                        disableCloseOnSelect
                                        classes={{
                                            option: classes.option,
                                            noOptions: classes.noOptions,
                                            loading: classes.loading
                                        }}
                                        getOptionSelected={(option, value) =>
                                            option.id === value.id
                                        }
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
                                                    data-testid="select apps"
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

                    <DialogActions className={classes_dialog.dialogAction}>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={() => {
                                setOpenEditUserModal(false);
                                setSelectedApps([]);
                            }}
                            aria-label="cancel edit"
                            data-testId="cancel-edit-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="medium"
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                error.first_name ||
                                error.last_name ||
                                error.email_address
                            }
                            aria-label="Save"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
                {loading ? <CodxCircularLoader size={60} center /> : null}
            </Dialog>
        </>
    );
}
