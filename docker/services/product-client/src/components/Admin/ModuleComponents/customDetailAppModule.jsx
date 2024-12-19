import React, { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    makeStyles,
    alpha,
    Button,
    Select,
    MenuItem,
    ListItemText,
    FormControl,
    Input,
    InputLabel
} from '@material-ui/core';
import UserMgmtIcon from '@material-ui/icons/People';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import DescriptionIcon from '@material-ui/icons/Description';
import DashboardIcon from '@material-ui/icons/Dashboard';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FilterListIcon from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import DynamicFormModal from '../../dynamic-form/inputFields/DynamicFormModal';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { getApplications } from '../../../services/minerva_utils';
import { getCopilotApplications } from '../../../services/copilotServices/copilot_app.js';
import SimpleSelect from '../../dynamic-form/inputFields/select';
import Switch from '@material-ui/core/Switch';
import { ReactComponent as MinervaAvatarIcon } from 'assets/img/MinervaAvatarIcon.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '30rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: theme.palette.background.greyishBlue,
        border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.4)}`
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        padding: '2rem 2rem 0rem 2rem'
    },
    moduleStateButton: {
        // padding: "1.5rem",
        // fontWeight: 700,
        backgroundColor: theme.palette.background.moduleBtn + '!important',
        borderRadius: 0,
        color: theme.palette.text.moduleBtnText,
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5)
    },
    enabledState: {
        background: theme.palette.primary.contrastText,
        color: theme.palette.text.peachText
    },
    disabledState: {
        background: `${theme.palette.background.disabledBg} !important`,
        color: `${theme.palette.text.moduleBtnText} !important`,
        opacity: 0.5
    },
    disabledButtom: {
        opacity: 0.5
    },
    iconContianer: {
        padding: '2rem',
        background: theme.palette.primary.dark,
        borderRadius: '50%',
        '& svg': {
            width: '3rem',
            height: '3rem',
            fill: theme.palette.primary.contrastText
        }
    },
    moduleName: {
        fontSize: '2.2rem',
        textAlign: 'center',
        color: theme.palette.icons.contrast,
        textTransform: 'capitalize',
        fontFamily: theme.title.h1.fontFamily,
        marginTop: theme.layoutSpacing(18)
    },
    viewDetials: {
        fontWeight: 100,
        paddingBottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `${theme.palette.primary.contrastText} !important`,
        '& .MuiButton-label': {
            fontSize: '1.5rem'
        },
        '& svg': {
            color: `${theme.palette.icons.contrast} !important`,
            fontSize: '2.3rem',
            cursor: 'pointer'
        },
        '&:hover': {
            backgroundColor: 'transparent',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        }
    },
    formControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        marginTop: theme.spacing(1),
        '& .MuiInputBase-input': {
            padding: 0
        }
    },
    selectFormControl: {
        padding: theme.spacing(1),
        '&.MuiInput-root': {
            borderRadius: 0,
            marginTop: 0,
            padding: `${theme.layoutSpacing(14)} ${theme.layoutSpacing(6)}`,
            backgroundColor: theme.palette.background.greyishBlue,
            border: `1px solid ${theme.palette.border.grey}`
        },
        '& .MuiSelect-select': {
            padding: theme.layoutSpacing(7),
            backgroundColor: theme.palette.background.greyishBlue,
            border: `1px solid ${theme.palette.border.grey}`,
            borderRadius: 0
        },
        '& .MuiInput-underline': {
            '&:after': {
                display: 'none'
            },
            '&:before': {
                display: 'none'
            }
        },
        '& .MuiInputBase-input.Mui-disabled': {
            opacity: 0.5,
            color: theme.palette.text.default
        }
    },
    formControlLabel: {
        padding: theme.spacing(1),
        color: theme.palette.text.default + ' !important',
        fontSize: '1.5rem',
        width: '17vw',
        top: theme.spacing(-0.5),
        zIndex: 1,
        pointerEvents: 'none'
    },
    selectIcon: {
        color: theme.palette.text.default,
        width: '3rem',
        height: '3rem'
    },
    selectListItem: {
        color: theme.palette.text.default,
        fontSize: '1.5rem'
    },
    selected: {
        backgroundColor: `${theme.palette.background.menuItemFocus} !important`
    },
    input: {
        '& .MuiInputBase-input.Mui-disabled': {
            opacity: 0.5,
            color: theme.palette.text.default
        }
    },
    inputDetailContainer: {
        width: '82%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'start',
        flex: 1
    },
    resButton: {
        marginTop: theme.layoutSpacing(16),
        '& .MuiButton-label': {
            letterSpacing: '.9px'
        },
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            color: theme.palette.icons.closeIcon,
            border: 'none !important',
            boxShadow: 'none !important',
            opacity: 1,
            '& svg': {
                color: `${theme.palette.text.peachText} !important`
            }
        },
        '@media (max-width: 1500px)': {
            marginTop: theme.layoutSpacing(10)
        }
    },
    minervaAppOptions: {
        '& div#minerva-selectdemo-simple-select-outlined': {
            padding: theme.layoutSpacing(17),
            backgroundColor: theme.palette.background.greyishBlue,
            borderRadius: 0
        },
        '& div': {
            '&:before': {
                border: `1px solid ${theme.palette.border.grey}`,
                top: 0,
                left: 0
            },
            '&:hover:not(.Mui-disabled):before': {
                borderBottom: `1px solid ${theme.palette.border.grey}`
            },
            '& svg': {
                fill: theme.palette.text.default,
                width: '3rem',
                height: '3rem'
            }
        }
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0rem 2rem 0rem 2rem',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            bottom: -7,
            left: '5%',
            width: '90%',
            height: '1px',
            backgroundColor: theme.IndustryDashboard.border.light
        }
    },
    rootSwitch: {
        width: theme.layoutSpacing(60),
        height: theme.layoutSpacing(28),
        padding: 0,
        margin: theme.spacing(1),
        '& .Mui-checked .MuiSwitch-thumb': {
            backgroundColor: theme.palette.background.greyishBlue + ' !important',
            opacity: 1
        }
    },
    switchBase: {
        padding: 0,
        left: theme.layoutSpacing(2),
        top: theme.layoutSpacing(2),
        '&$checked': {
            transform: `translateX(${theme.layoutSpacing(35)})`,
            '& + $track': {
                backgroundColor: theme.palette.text.default,
                opacity: 1,
                border: 'none'
            }
        }
    },
    thumb: {
        width: theme.layoutSpacing(22),
        height: theme.layoutSpacing(22),
        backgroundColor: theme.palette.background.pureWhite + '!important'
    },
    track: {
        borderRadius: 24 / 2,
        borderColor: 'transparent !important',
        backgroundColor: theme.palette.background.customSwitchBg + '!important',
        opacity: 1
    },
    checked: {},
    focusVisible: {}
}));

export function CustomDetailAppModule({
    module,
    detail,
    enabled,
    handleChange,
    handleDetailChange,
    module_header,
    module_backside_config,
    editDisabled = false,
    onAddResponsibilities,
    handleRoute,
    buttonDisabled,
    buttonText
}) {
    const classes = useStyles();
    const [minervaApplications, setMinervaApplications] = useState([]);
    const [copilotApplications, setCopilotApplications] = useState([]);

    if (module_header === 'User Management' && detail === 0) detail = true;
    useEffect(() => {
        if (module_header === 'Ask NucliOS') {
            getMinervaApplications();
        }
        if (module_header === 'Ask NucliOS - Copilot') {
            loadCopilotApplications();
        }
    }, [module_header]);

    const modelIcon = () => {
        const _module_header = module_header.toLowerCase();
        switch (_module_header) {
            case 'user management':
                return <UserMgmtIcon />;
            case 'ask nuclios':
                return <MinervaAvatarIcon />;
            case 'application manual':
                return <ImportContactsIcon />;
            case 'dashboard':
                return <DashboardIcon />;
            case 'alerts and notifications':
                return <NotificationImportantIcon />;
            case 'data story':
                return <DescriptionIcon />;
            case 'full screen mode':
                return <FullscreenIcon />;
            case 'retain filters':
                return <FilterListIcon />;
            case 'user guide':
                return <ImportContactsIcon />;
            case 'slicing filters':
                return <FilterListIcon />;
            case 'ask nuclios - copilot':
                return <MinervaAvatarIcon />;
            default:
                return null;
        }
    };

    const getMinervaApplications = () => {
        getApplications({
            callback: onResponseGetMinervaApplications
        });
    };

    const loadCopilotApplications = async () => {
        const apps = await getCopilotApplications();
        setCopilotApplications(apps);
    };

    const onResponseGetMinervaApplications = (response_data, status = 'success') => {
        if (status !== 'error') {
            setMinervaApplications(response_data.minerva_apps);
        }
    };

    const get_input_detail_field = (module_header) => {
        module_header = module_header.toLowerCase();
        switch (module_header) {
            case 'user management':
                return (
                    <FormControl
                        fullWidth
                        className={clsx(classes.formControl, classes.selectFormControl)}
                    >
                        <Select
                            classes={{
                                icon: classes.selectIcon
                            }}
                            placeholder="Select associated Screen Level"
                            labelId="demo-simple-select-label"
                            disabled={editDisabled}
                            defaultValue={module.app_screen_level || 0}
                            onChange={(e) => handleDetailChange(+e.target.value)}
                        >
                            <MenuItem value={0} classes={{ selected: classes.selected }}>
                                <ListItemText
                                    primary="Screen Level"
                                    classes={{ primary: classes.selectListItem }}
                                />
                            </MenuItem>
                            <MenuItem value={1} classes={{ selected: classes.selected }}>
                                <ListItemText
                                    primary="Sub-Screen Level"
                                    classes={{ primary: classes.selectListItem }}
                                />
                            </MenuItem>
                            <MenuItem value={2} classes={{ selected: classes.selected }}>
                                <ListItemText
                                    primary="Tab Level"
                                    classes={{ primary: classes.selectListItem }}
                                />
                            </MenuItem>
                        </Select>
                        <Button
                            className={classes.resButton}
                            onClick={onAddResponsibilities}
                            aria-label="Manage responsibilities"
                        >
                            Manage Responsibilities
                        </Button>
                    </FormControl>
                );
            case 'ask nuclios':
                return (
                    <FormControl
                        fullWidth
                        className={clsx(
                            classes.formControl,
                            classes.selectFormControl,
                            classes.minervaAppOptions
                        )}
                    >
                        <SimpleSelect
                            onChange={(v) => {
                                handleDetailChange(v);
                            }}
                            fieldInfo={{
                                options: minervaApplications,
                                optionValueKey: 'id',
                                optionLabelKey: 'name',
                                fullWidth: true,
                                value: module.tenant_id,
                                search: true,
                                id: 'minerva-select',
                                style: { marginTop: 0 }
                            }}
                        />
                    </FormControl>
                );
            case 'ask nuclios - copilot':
                return (
                    <FormControl
                        fullWidth
                        className={clsx(
                            classes.formControl,
                            classes.selectFormControl,
                            classes.minervaAppOptions
                        )}
                    >
                        <InputLabel
                            id="demo-simple-input-label-minerva"
                            shrink
                            className={classes.formControlLabel}
                        >
                            Select Ask NucliOS Application
                        </InputLabel>
                        <SimpleSelect
                            onChange={(v) => {
                                handleDetailChange(v);
                            }}
                            fieldInfo={{
                                options: copilotApplications,
                                optionValueKey: 'id',
                                optionLabelKey: 'name',
                                variant: 'standard',
                                fullWidth: true,
                                value: module.app_id,
                                search: true,
                                id: 'minerva-select'
                            }}
                        />
                    </FormControl>
                );
            case 'application manual':
                return (
                    <FormControl
                        fullWidth
                        className={clsx(classes.formControl, classes.selectFormControl)}
                    >
                        <Input
                            placeholder="Enter application manual url"
                            labelId="demo-simple-input-label-app-manual-url"
                            defaultValue={module.manual_url}
                            onChange={(e) => handleDetailChange(e.target.value)}
                            disabled={editDisabled}
                            className={classes.input}
                            classes={{
                                formControl: clsx(classes.formControl, classes.selectFormControl)
                            }}
                            fullWidth
                        />
                    </FormControl>
                );
            default:
                return null;
        }
    };
    return (
        <Paper className={classes.root}>
            <div className={classes.actionContainer}>
                <Switch
                    disableRipple
                    classes={{
                        root: classes.rootSwitch,
                        switchBase: classes.switchBase,
                        thumb: classes.thumb,
                        track: classes.track,
                        checked: classes.checked
                    }}
                    inputProps={{
                        'aria-label': `select - ${module_header != null ? module_header : ''}`
                    }}
                    checked={enabled}
                    onChange={handleChange}
                />
                <DynamicFormModal
                    params={module_backside_config}
                    triggerButton={(onClick) => (
                        <div
                            onClick={onClick}
                            className={classes.viewDetials}
                            aria-label="View Details"
                        >
                            <InfoOutlinedIcon />
                        </div>
                    )}
                />
            </div>
            <div className={classes.content}>
                <div className={classes.iconContianer}>{modelIcon()}</div>
                <Typography variant="h5" className={classes.moduleName}>
                    {module_header}
                </Typography>
                {enabled ? (
                    <div className={classes.inputDetailContainer}>
                        {get_input_detail_field(module_header)}
                    </div>
                ) : null}
            </div>

            {!buttonDisabled ? (
                <Button
                    variant="contained"
                    className={clsx(
                        classes.moduleStateButton,
                        !(handleDetailChange ? !(detail && enabled) : !enabled)
                            ? classes.enabledState
                            : classes.disabledState,
                        editDisabled ? classes.disabledButtom : ''
                    )}
                    disabled={handleDetailChange ? !(detail && enabled) : !enabled}
                    onClick={handleRoute}
                >
                    {buttonText}
                </Button>
            ) : null}
        </Paper>
    );
}
