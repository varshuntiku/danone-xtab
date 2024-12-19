import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import copilotConfiguratorStyle from '../../styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { DataSourceTypeJSON, requiredField } from '../../util';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16.6)
    },
    fileStorageTitle: {
        color: theme.palette.text.revamp
    },
    fileStorageOptionGroup: {
        width: '100%',
        display: 'flex',
        gap: theme.layoutSpacing(16.6),
        flexWrap: 'wrap'
    },
    fileStorageOption: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '2px',
        cursor: 'pointer',
        flexDirection: 'column',
        gap: theme.layoutSpacing(8.3),

        '&:hover': {
            '& $fileStorageIcon': {
                backgroundColor:
                    theme.props.mode === 'light'
                        ? theme.palette.background.cardItemHover
                        : theme.palette.background.cardItemHover
            }
        }
    },
    disabledOption: {
        pointerEvents: 'none'
    },
    fileStorageIcon: {
        padding: theme.layoutSpacing(16.6),
        // background: "#DADEE6",
        borderRadius: theme.layoutSpacing(4),
        border: '1px solid',
        borderColor: alpha(theme.palette.text.black, 0.2),
        '& svg': {
            width: theme.layoutSpacing(51.84),
            height: theme.layoutSpacing(51.84)
        }
    },
    fileStorageOptionSelected: {
        // outline: `1px solid #220047`,
        // boxShadow: theme.shadows[2],
        '&$fileStorageIcon': {
            backgroundColor: alpha(theme.palette.background.cardItemFocus, 0.1),
            borderColor: theme.palette.border.LoginInpBorder
        }
    },
    fileStorageLabel: {
        fontWeight: 500,
        color: theme.palette.text.revamp
    },
    actionButtonSection: {
        alignSelf: 'flex-end'
    },
    fileStorageInputContainer: {
        padding: theme.layoutSpacing(24),
        display: 'flex',
        flexDirection: 'column',
        // gap: theme.layoutSpacing(16.6),
        gap: theme.layoutSpacing(16),
        alignItems: 'flex-start',
        backgroundColor:
            theme.props.mode === 'light' ? '#FBFBFB' : alpha(theme.palette.text.white, 0.04)
    },
    fullWidthContainer: {
        width: '100%'
    },
    disabledInputField: {
        '& input': {
            paddingLeft: 0
        },
        '& fieldset': {
            border: 0
        }
    },
    validatedInputLabel: {
        marginBottom: 0
    },
    editButtonIcon: {
        padding: theme.layoutSpacing(4)
    },
    validatedLabelAction: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        alignSelf: 'flex-end',
        color: theme.palette.text.revamp,
        fontFamily: 'Graphik Compact',
        fontSize: theme.layoutSpacing(16),
        fontWeight: 400,
        lineHeight: theme.layoutSpacing(19),
        letterSpacing: theme.layoutSpacing(1.5)
    },
    verifyIcon: {
        color: theme.palette.icons.successIconFill
    },
    validationPanelInputContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    fileStorageValidInputContainer: {
        padding: theme.layoutSpacing(16.6),
        display: 'flex',
        flexDirection: 'column',
        // gap: theme.layoutSpacing(68),
        gap: theme.layoutSpacing(28),
        alignItems: 'flex-start',
        backgroundColor:
            theme.props.mode === 'light' ? '#FBFBFB' : alpha(theme.palette.text.white, 0.04)
    },
    uneditableFieldsContainer: {
        width: theme.layoutSpacing(778)
        // paddingLeft: theme.layoutSpacing(4)
    },
    inputConfigFieldsContainer: {
        width: theme.layoutSpacing(778)
    },
    infoButton: {
        padding: theme.layoutSpacing(8),
        '& .MuiIconButton-label': {
            '& svg': {
                color: theme.palette.text.chooseFileText,
                width: theme.layoutSpacing(16),
                height: theme.layoutSpacing(16)
            }
        }
    },
    listItemsContainer: {
        listStyle: 'disc',
        paddingLeft: theme.layoutSpacing(32),

        '& > li': {
            display: 'list-item',
            paddingTop: theme.layoutSpacing(5),
            paddingBottom: theme.layoutSpacing(5),

            '& .MuiListItemText-root': {
                margin: 0,

                '& span': {
                    fontSize: theme.layoutSpacing(12),
                    fontWeight: 400,
                    lineHeight: theme.layoutSpacing(20),
                    letterSpacing: theme.layoutSpacing(0),

                    '& a': {
                        color: 'inherit'
                    }
                }
            }
        }
    },
    adornmentButton: {
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    passwordInputType: {
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: 0
        }
    }
}));

export default function CopilotFileStorageDatasource({
    datasource,
    config,
    onChange,
    onValidateDatasourceConfig,
    onSaveDatasource
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const [isValid, setIsValid] = useState(false);

    const fileStorageOptions = DataSourceTypeJSON.find((obj) => obj.value === 'file_storage')?.[
        'options'
    ];
    const fileStorageConfig = {
        ...config
    };
    const [fileStorageInputConfig, setFileStorageInputConfig] = useState({ ...config });
    const [hasFileStorageConfigChanged, setHasFileStorageConfigChanged] = useState(false);
    const [isValidateInProgress, setIsValidateInProgress] = useState(false);

    const handleFileStorageTypeChange = (event, type) => {
        onChange({ file_storage_type: type });
        setIsValid(false);
        setFileStorageInputConfig({});
        setHasFileStorageConfigChanged(false);
    };

    const handleConfigChange = (value, key) => {
        if (key === 'blob_container_ids' || key === 'aws_bucket_ids') {
            config[key] = [value];
        } else {
            config[key] = value;
        }
        onChange({ ...config });
        setHasFileStorageConfigChanged(true);
    };

    const handleEditConfig = () => {
        setIsValid(false);
        const updatedConfig = {
            file_storage_type: config.file_storage_type,
            ...(config.file_storage_type === 'azure_blob_storage'
                ? { blob_connection_string: config.blob_connection_string }
                : {}),
            ...(config.file_storage_type === 'amazon_s3'
                ? {
                      aws_access_key_id: config.aws_access_key_id,
                      aws_secret_access_key: config.aws_secret_access_key
                  }
                : {}),
            ...(config.file_storage_type === 'microsoft_sharepoint'
                ? {
                      sharepoint_site_url: config.sharepoint_site_url,
                      sharepoint_client_id: config.sharepoint_client_id,
                      sharepoint_client_secret: config.sharepoint_client_secret
                  }
                : {})
        };
        onChange(updatedConfig);
    };

    const handleButtonAction = async () => {
        if (!isValid) {
            try {
                setIsValidateInProgress(true);
                const res = await onValidateDatasourceConfig();
                setIsValid(true);
                setFileStorageInputConfig({
                    ...res
                });
                onChange({
                    ...config,
                    ...res
                });
            } catch (err) {
                // console.log(err);
            } finally {
                setIsValidateInProgress(false);
            }
        }
        if (isValid) {
            onSaveDatasource();
        }
    };

    const isSaveConfigPresent = () => {
        if (config.file_storage_type === 'azure_blob_storage') {
            return config.blob_connection_string && config.blob_container_ids;
        } else if (config.file_storage_type === 'amazon_s3') {
            return (
                config.aws_access_key_id && config.aws_secret_access_key && config.aws_bucket_ids
            );
        } else if (config.file_storage_type === 'microsoft_sharepoint') {
            return (
                config.sharepoint_site_url &&
                config.sharepoint_client_id &&
                config.sharepoint_client_secret &&
                config.sharepoint_folder_path
            );
        }
    };

    const isValidateConfigPresent = () => {
        let isValidButtonDisabled = isValidateInProgress;
        if (config.file_storage_type === 'azure_blob_storage') {
            isValidButtonDisabled = isValidButtonDisabled || !config.blob_connection_string;
        } else if (config.file_storage_type === 'amazon_s3') {
            isValidButtonDisabled =
                isValidButtonDisabled ||
                !(config.aws_access_key_id && config.aws_secret_access_key);
        } else if (config.file_storage_type === 'microsoft_sharepoint') {
            isValidButtonDisabled =
                isValidButtonDisabled ||
                !(
                    config.sharepoint_site_url &&
                    config.sharepoint_client_id &&
                    config.sharepoint_client_secret
                );
        }

        return isValidButtonDisabled;
    };

    const isSaveButtonDisabled = !(datasource?.name && isSaveConfigPresent());

    const isValidateDisabled = isValidateConfigPresent();
    return (
        <div className={classes.root}>
            {/* {!datasource.id && ( */}
            <Fragment>
                {!datasource.id && (
                    <Fragment>
                        <Typography
                            variant="h5"
                            className={clsx(configClasses.fontStyle2, classes.fileStorageTitle)}
                        >
                            Select File Storage
                        </Typography>
                        <div className={classes.fileStorageOptionGroup}>
                            <ConfirmPopup
                                onConfirm={handleFileStorageTypeChange}
                                title="Change Data Storage"
                                subTitle="Changing the data storage will result in the removal of any additional information added to the dataset. Are you certain you wish to proceed?"
                                classes={{
                                    dialogPaper: configClasses.confirmDialog
                                }}
                                confirmText="Proceed"
                            >
                                {(triggerConfirm) =>
                                    fileStorageOptions.map((el) => (
                                        <div
                                            className={
                                                datasource.id
                                                    ? clsx(
                                                          classes.fileStorageOption,
                                                          classes.disabledOption
                                                      )
                                                    : classes.fileStorageOption
                                            }
                                            key={el.label}
                                            onClick={(e) => {
                                                if (hasFileStorageConfigChanged) {
                                                    triggerConfirm(el.name);
                                                } else {
                                                    handleFileStorageTypeChange(e, el.name);
                                                }
                                            }}
                                        >
                                            <div
                                                className={clsx(
                                                    classes.fileStorageIcon,
                                                    el.name === fileStorageConfig?.file_storage_type
                                                        ? classes.fileStorageOptionSelected
                                                        : ''
                                                )}
                                            >
                                                {el.icon}
                                            </div>
                                            <div
                                                className={clsx(
                                                    classes.fileStorageLabel,
                                                    configClasses.fontStyle1,
                                                    el.name === fileStorageConfig?.file_storage_type
                                                        ? classes.fileStorageOptionSelected
                                                        : ''
                                                )}
                                            >
                                                {el.label}
                                            </div>
                                        </div>
                                    ))
                                }
                            </ConfirmPopup>
                            {/* {fileStorageOptions.map((el) => (
                                <div
                                    className={
                                        datasource.id
                                            ? clsx(classes.fileStorageOption, classes.disabledOption)
                                            : classes.fileStorageOption
                                    }
                                    key={el.label}
                                    onClick={() => handleFileStorageTypeChange(el.name)}
                                >
                                    <div
                                        className={clsx(
                                            classes.fileStorageIcon,
                                            el.name === fileStorageConfig?.file_storage_type ? classes.fileStorageOptionSelected : ''
                                        )}
                                    >
                                        {el.icon}
                                    </div>
                                    <div
                                        className={clsx(
                                            classes.fileStorageLabel,
                                            configClasses.fontStyle1,
                                            el.name === fileStorageConfig?.file_storage_type ? classes.fileStorageOptionSelected : ''
                                        )}
                                    >
                                        {el.label}
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </Fragment>
                )}
                <div className={classes.configContainer}>
                    {fileStorageConfig.file_storage_type === 'azure_blob_storage' ? (
                        <AzureBlobFileStorage
                            classes={classes}
                            configClasses={configClasses}
                            datasource={datasource}
                            config={config}
                            isValidated={datasource?.id || isValid}
                            inputConfig={fileStorageInputConfig}
                            handleConfigChange={handleConfigChange}
                            handleEditConfig={handleEditConfig}
                        />
                    ) : null}
                    {fileStorageConfig.file_storage_type === 'amazon_s3' ? (
                        <AmazonS3FileStorage
                            classes={classes}
                            configClasses={configClasses}
                            datasource={datasource}
                            config={config}
                            isValidated={datasource?.id || isValid}
                            inputConfig={fileStorageInputConfig}
                            handleConfigChange={handleConfigChange}
                            handleEditConfig={handleEditConfig}
                        />
                    ) : null}
                    {fileStorageConfig.file_storage_type === 'microsoft_sharepoint' ? (
                        <MicrosoftSharepointFileStorage
                            classes={classes}
                            configClasses={configClasses}
                            datasource={datasource}
                            config={config}
                            isValidated={datasource?.id || isValid}
                            inputConfig={fileStorageInputConfig}
                            handleConfigChange={handleConfigChange}
                            handleEditConfig={handleEditConfig}
                        />
                    ) : null}
                </div>
                {fileStorageConfig.file_storage_type && !datasource?.id ? (
                    <div className={classes.actionButtonSection}>
                        <Button
                            variant="contained"
                            className={configClasses.button}
                            onClick={handleButtonAction}
                            disabled={!isValid ? isValidateDisabled : isSaveButtonDisabled}
                            //Add disable check for datasource name, and different input based on storage type
                        >
                            {!isValid ? 'Validate' : 'Add Datasource'}
                        </Button>
                    </div>
                ) : null}
            </Fragment>
            {/* )} */}
        </div>
    );
}

function DataInputValidationPanel({ classes, onClick }) {
    return (
        <div className={classes.validatedLabelAction}>
            <VerifiedUserIcon fontSize="large" className={classes.verifyIcon} />
            Validated
            <IconButton size="medium" onClick={onClick} className={classes.editButtonIcon}>
                <EditIcon fontSize="large" />
            </IconButton>
        </div>
    );
}

//AzureBlobFileStorage
function AzureBlobFileStorage({
    classes,
    configClasses,
    datasource,
    config,
    isValidated,
    inputConfig,
    handleConfigChange,
    handleEditConfig
}) {
    const renderContainerName = (containerId) => {
        return inputConfig?.blob_containers?.find((item) => item.id === containerId)?.name;
    };

    return (
        <Fragment>
            {!isValidated ? (
                <div className={classes.fileStorageInputContainer}>
                    <InputLabel id="blob-connection-string" className={configClasses.inputLabel}>
                        Connection String{requiredField}
                    </InputLabel>
                    <TextField
                        classes={{ root: configClasses.formControl }}
                        size="small"
                        fullWidth
                        value={config?.blob_connection_string}
                        variant="outlined"
                        onChange={(e) =>
                            handleConfigChange(e.target.value, 'blob_connection_string')
                        }
                        disabled={datasource?.id ? true : false}
                        placeholder="Enter Blob Connection String"
                    />
                </div>
            ) : null}
            {isValidated ? (
                <div className={classes.fileStorageValidInputContainer}>
                    <div className={classes.uneditableFieldsContainer}>
                        <div
                            className={clsx(
                                classes.fullWidthContainer,
                                classes.validationPanelInputContainer
                            )}
                        >
                            {!datasource?.id ? (
                                <DataInputValidationPanel
                                    classes={classes}
                                    onClick={handleEditConfig}
                                />
                            ) : null}
                            <InputLabel
                                id="blob-connection-string"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Connection String{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.blob_connection_string}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'blob_connection_string')
                                }
                                placeholder="Enter Blob Connection String"
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </div>
                    </div>
                    <div className={classes.inputConfigFieldsContainer}>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel
                                id="datasource-container-name"
                                className={configClasses.inputLabel}
                            >
                                Container Name<sup></sup>
                            </InputLabel>
                            <FormControl
                                size="small"
                                variant="outlined"
                                className={configClasses.formControl}
                                fullWidth
                            >
                                <Select
                                    size="small"
                                    labelId="blob-container-name"
                                    value={config?.blob_container_ids?.[0]}
                                    onChange={(e) =>
                                        handleConfigChange(e.target.value, 'blob_container_ids')
                                    }
                                    fullWidth
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        },
                                        disableAutoFocusItem: true
                                    }}
                                    displayEmpty={true}
                                    renderValue={(value) =>
                                        value ? renderContainerName(value) : 'Select Container'
                                    }
                                >
                                    {inputConfig?.blob_containers?.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
}

//AmazonS3FileStorage
function AmazonS3FileStorage({
    classes,
    configClasses,
    datasource,
    config,
    isValidated,
    inputConfig,
    handleConfigChange,
    handleEditConfig
}) {
    const [showPassword, setShowPassword] = useState(false);

    const renderBucketName = (bucketId) => {
        return inputConfig?.bucket_names?.find((item) => item.name === bucketId)?.name;
    };

    const tooltipInfo = (
        <List className={classes.listItemsContainer}>
            <ListItem disableGutters>
                <ListItemText>
                    Navigate to the{' '}
                    <a href="https://portal.azure.com/" target="_blank" rel="noreferrer">
                        Azure portal
                    </a>
                    .
                </ListItemText>
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='In the left-hand navigation pane, select "Azure Active Directory."' />
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='Under "Manage," select "App registrations".' />
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='Click on "New registration" to register a new application.' />
            </ListItem>
        </List>
    );

    return (
        <Fragment>
            {!isValidated ? (
                <div className={classes.fileStorageInputContainer}>
                    <div className={classes.fullWidthContainer}>
                        <InputLabel id="aws-access-key-id" className={configClasses.inputLabel}>
                            Key Id{requiredField}
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            size="small"
                            fullWidth
                            value={config?.aws_access_key_id}
                            variant="outlined"
                            onChange={(e) =>
                                handleConfigChange(e.target.value, 'aws_access_key_id')
                            }
                            disabled={datasource?.id ? true : false}
                            placeholder="Enter AWS Access Key ID"
                        />
                    </div>
                    <div className={classes.fullWidthContainer}>
                        <InputLabel id="aws-secret-access-key" className={configClasses.inputLabel}>
                            Secret Key{requiredField}{' '}
                            <span>
                                <Tooltip
                                    title={tooltipInfo}
                                    arrow
                                    placement="right"
                                    interactive
                                    classes={{ tooltip: configClasses.tooltip }}
                                >
                                    <IconButton
                                        aria-label="input-info"
                                        className={classes.infoButton}
                                    >
                                        <InfoOutlinedIcon fontSize="medium" />
                                    </IconButton>
                                </Tooltip>
                            </span>
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            className={classes.passwordInputType}
                            size="small"
                            fullWidth
                            value={config?.aws_secret_access_key}
                            variant="outlined"
                            onChange={(e) =>
                                handleConfigChange(e.target.value, 'aws_secret_access_key')
                            }
                            disabled={datasource?.id ? true : false}
                            placeholder="Enter AWS Secret Access Key"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password" //to restrict browser to use saved password
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="aws_secret_access_key"
                                            className={classes.adornmentButton}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </div>
            ) : null}
            {isValidated ? (
                <div className={classes.fileStorageValidInputContainer}>
                    <div className={classes.uneditableFieldsContainer}>
                        <div
                            className={clsx(
                                classes.fullWidthContainer,
                                classes.validationPanelInputContainer
                            )}
                        >
                            {!datasource?.id ? (
                                <DataInputValidationPanel
                                    classes={classes}
                                    onClick={handleEditConfig}
                                />
                            ) : null}
                            <InputLabel
                                id="aws-access-key-id"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Key Id{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.aws_access_key_id}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'aws_access_key_id')
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                                placeholder="Enter AWS Access Key ID"
                            />
                        </div>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel
                                id="aws-secret-access-key"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Secret Key{requiredField}{' '}
                                <span>
                                    <Tooltip
                                        title={tooltipInfo}
                                        arrow
                                        placement="right"
                                        interactive
                                        classes={{ tooltip: configClasses.tooltip }}
                                    >
                                        <IconButton
                                            aria-label="input-info"
                                            className={classes.infoButton}
                                        >
                                            <InfoOutlinedIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.aws_secret_access_key}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'aws_secret_access_key')
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                                placeholder="Enter AWS Secret Access Key"
                                type="password"
                                autoComplete="new-password" //to restrict browser to use saved password
                            />
                        </div>
                    </div>
                    <div className={classes.inputConfigFieldsContainer}>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel
                                id="datasource-bucket-name"
                                className={configClasses.inputLabel}
                            >
                                Bucket Name<sup></sup>
                            </InputLabel>
                            <FormControl
                                size="small"
                                variant="outlined"
                                className={configClasses.formControl}
                                fullWidth
                            >
                                <Select
                                    size="small"
                                    labelId="aws-bucket-names"
                                    value={config?.aws_bucket_ids?.[0]}
                                    onChange={(e) =>
                                        handleConfigChange(e.target.value, 'aws_bucket_ids')
                                    }
                                    fullWidth
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                root: configClasses.inputDropdownSelect
                                            }
                                        },
                                        disableAutoFocusItem: true
                                    }}
                                    displayEmpty={true}
                                    renderValue={(value) =>
                                        value ? renderBucketName(value) : 'Select Bucket'
                                    }
                                >
                                    {inputConfig?.bucket_names?.map((item) => (
                                        <MenuItem key={item.name} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
}

//MicrosoftSharepoint
function MicrosoftSharepointFileStorage({
    classes,
    configClasses,
    datasource,
    config,
    isValidated,
    handleConfigChange,
    handleEditConfig
}) {
    const [showPassword, setShowPassword] = useState(false);

    const tooltipInfo = (
        <List className={classes.listItemsContainer}>
            <ListItem disableGutters>
                <ListItemText>
                    Navigate to the{' '}
                    <a href="https://portal.azure.com/" target="_blank" rel="noreferrer">
                        Azure portal
                    </a>
                    .
                </ListItemText>
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='In the left-hand navigation pane, select "Azure Active Directory."' />
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='Under "Manage," select "App registrations".' />
            </ListItem>
            <ListItem disableGutters>
                <ListItemText primary='Click on "New registration" to register a new application.' />
            </ListItem>
        </List>
    );

    return (
        <Fragment>
            {!isValidated ? (
                <div className={classes.fileStorageInputContainer}>
                    <div className={classes.fullWidthContainer}>
                        <InputLabel id="sharepoint-site-url" className={configClasses.inputLabel}>
                            Site URL{requiredField}
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            size="small"
                            fullWidth
                            value={config?.sharepoint_site_url}
                            variant="outlined"
                            onChange={(e) =>
                                handleConfigChange(e.target.value, 'sharepoint_site_url')
                            }
                            disabled={datasource?.id ? true : false}
                            placeholder="Enter Site URL"
                        />
                    </div>
                    <div className={classes.fullWidthContainer}>
                        <InputLabel id="sharepoint-client-id" className={configClasses.inputLabel}>
                            Client ID{requiredField}
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            size="small"
                            fullWidth
                            value={config?.sharepoint_client_id}
                            variant="outlined"
                            onChange={(e) =>
                                handleConfigChange(e.target.value, 'sharepoint_client_id')
                            }
                            disabled={datasource?.id ? true : false}
                            placeholder="Enter Client ID"
                        />
                    </div>
                    <div className={classes.fullWidthContainer}>
                        <InputLabel
                            id="sharepoint-client-secret"
                            className={configClasses.inputLabel}
                        >
                            Secret Key{requiredField}{' '}
                            <span>
                                <Tooltip
                                    title={tooltipInfo}
                                    arrow
                                    placement="right"
                                    interactive
                                    classes={{ tooltip: configClasses.tooltip }}
                                >
                                    <IconButton
                                        aria-label="input-info"
                                        className={classes.infoButton}
                                    >
                                        <InfoOutlinedIcon fontSize="medium" />
                                    </IconButton>
                                </Tooltip>
                            </span>
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            className={classes.passwordInputType}
                            size="small"
                            fullWidth
                            value={config?.sharepoint_client_secret}
                            variant="outlined"
                            onChange={(e) =>
                                handleConfigChange(e.target.value, 'sharepoint_client_secret')
                            }
                            disabled={datasource?.id ? true : false}
                            placeholder="Enter Secret Key"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password" //to restrict browser to use saved password
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="aws_secret_access_key"
                                            className={classes.adornmentButton}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </div>
            ) : null}
            {isValidated ? (
                <div className={classes.fileStorageValidInputContainer}>
                    <div className={classes.uneditableFieldsContainer}>
                        <div
                            className={clsx(
                                classes.fullWidthContainer,
                                classes.validationPanelInputContainer
                            )}
                        >
                            {!datasource?.id ? (
                                <DataInputValidationPanel
                                    classes={classes}
                                    onClick={handleEditConfig}
                                />
                            ) : null}
                            <InputLabel
                                id="sharepoint-site-url"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Site URL{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.sharepoint_site_url}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'sharepoint_site_url')
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                                placeholder="Enter Site URL"
                            />
                        </div>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel
                                id="sharepoint-client-id"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Client ID{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.sharepoint_client_id}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'sharepoint_client_id')
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                                placeholder="Enter Client ID"
                            />
                        </div>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel
                                id="sharepoint-client-secret"
                                className={clsx(
                                    configClasses.inputLabel,
                                    classes.validatedInputLabel
                                )}
                            >
                                Secret Key{requiredField}{' '}
                                <span>
                                    <Tooltip
                                        title={tooltipInfo}
                                        arrow
                                        placement="right"
                                        interactive
                                        classes={{ tooltip: configClasses.tooltip }}
                                    >
                                        <IconButton
                                            aria-label="input-info"
                                            className={classes.infoButton}
                                        >
                                            <InfoOutlinedIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                className={classes.disabledInputField}
                                size="small"
                                fullWidth
                                value={config?.sharepoint_client_secret}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'sharepoint_client_secret')
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                                placeholder="Enter Secret Key"
                                type="password"
                                autoComplete="new-password" //to restrict browser to use saved password
                            />
                        </div>
                    </div>
                    <div className={classes.inputConfigFieldsContainer}>
                        <div className={classes.fullWidthContainer}>
                            <InputLabel id="sharepoint-path" className={configClasses.inputLabel}>
                                Path{requiredField}
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                size="small"
                                fullWidth
                                value={config?.sharepoint_folder_path}
                                variant="outlined"
                                onChange={(e) =>
                                    handleConfigChange(e.target.value, 'sharepoint_folder_path')
                                }
                                placeholder="Enter Sharepoint Folder Path"
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
}
