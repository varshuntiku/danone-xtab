import {
    alpha,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@material-ui/core';
import { ContextOnboardTypeJSON, getContextTemplate, requiredField } from '../../util';
import copilotConfiguratorStyle from '../../styles/copilotConfiguratorStyle';
import clsx from 'clsx';
import { ReactComponent as TemplateDownloadIcon } from 'assets/img/template-download-icon.svg';
import { Fragment, useEffect, useState } from 'react';
import CustomSnackbar from 'components/CustomSnackbar';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import RestorePageIcon from '@material-ui/icons/RestorePage';
import CopilotFileUpload from '../CopilotFileUpload';

const useStyles = makeStyles((theme) => ({
    dataMetaDataContainer: {},
    halfWidth: {
        maxWidth: theme.layoutSpacing(400),
        flex: 1
    },
    fileItem: {
        backgroundColor: theme.palette.background.chipRevampBg,
        display: 'flex',
        alignItems: 'center',
        padding: theme.layoutSpacing(16),
        fontSize: theme.layoutSpacing(14),
        color: 'white',
        borderRadius: theme.layoutSpacing(4.74),
        marginTop: theme.layoutSpacing(16),
        justifyContent: 'space-between',
        cursor: 'default'
    },
    fileName: {
        color: theme.palette.text.revamp
    },
    templateFont: {
        fontWeight: 500
    },
    downloadTemplatecontainer: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(6),
        '& svg': {
            '& path': {
                stroke: theme.palette.text.contrastText
            }
        }
    },
    fileUploadWrapper: {
        width: '100%',
        marginTop: theme.layoutSpacing(24),
        '& > *': {
            marginBottom: theme.spacing(1)
        }
    },
    actionButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.layoutSpacing(8.3)
    },
    uploadedFileSectionLabel: {
        paddingTop: theme.layoutSpacing(23)
    },
    documentList: {
        maxHeight: theme.layoutSpacing(311.04),
        overflow: 'auto',
        gap: theme.layoutSpacing(16),
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(16.6),
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiListItemText-secondary': {
            fontSize: theme.layoutSpacing(12.442),
            opacity: '0.7'
        },
        '& .MuiListItem-root:hover': {
            background: theme.palette.background.hover
        },
        '& .MuiListItem-container .MuiListItem-root .MuiListItemIcon-root': {
            color: theme.palette.text.contrastText,
            padding: theme.layoutSpacing(0, 12)
        },
        '& .MuiListItem-root': {
            border: '1px solid',
            borderColor: alpha(theme.palette.border.loginGrid, 0.4),
            padding: theme.layoutSpacing(15, 12)
        }
    },
    inputWrapper: {
        display: 'flex',
        gap: theme.layoutSpacing(24)
    },
    downloadIcon: {
        '& path': {
            stroke: theme.palette.icons.grey
        }
    }
}));

export default function DataMetaDataContext({
    context,
    onContextChange,
    onContextDocChange,
    isUpdateDisabled,
    // config,
    onConfigChange,
    contextSourceType,
    ...props
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const [acceptedFileExtensions, setAcceptedFileExtensions] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const getDefaultSourceType = (type) => {
        const configdata = ContextOnboardTypeJSON.find((obj) => obj.value === type);
        return configdata.defaultSourceType;
    };

    useEffect(() => {
        if (!context?.id) {
            onConfigChange(getDefaultSourceType(context?.type), 'source_type');
            //remove all selected files on changing context without saving
            setSelectedFiles([]);
        }
    }, [context?.type]);

    useEffect(() => {
        const contextdata = ContextOnboardTypeJSON.find(
            (obj) => obj.value === context?.type
        ).sourceTypeOptions?.find((item) => item.value === contextSourceType);
        setAcceptedFileExtensions(contextdata?.accepted_files);
    }, [contextSourceType]);

    const getSourceTypeOptions = () => {
        const contextdata = ContextOnboardTypeJSON.find((obj) => obj.value === context.type);
        return contextdata.sourceTypeOptions;
    };

    const handleDownloadTemplate = (url) => {
        window.location.href = url;
    };

    const handleSelectedFileChange = (files) => {
        setSelectedFiles(files);
        onContextDocChange(files);
    };

    const handleFileDelete = (i) => {
        context.context_documents[i].deleted = true;
        props.onUpdateExistingDocument(context);
    };

    const handleFileRestore = (index) => {
        context.context_documents[index].deleted = false;
        props.onUpdateExistingDocument(context);
    };

    const handleFilesSave = async () => {
        if (context.id) {
            await props.onUpdateUploadContext();
            setSelectedFiles([]);
        } else {
            await props.onSaveUploadContext();
            setSelectedFiles([]);
        }
    };

    const isValidContextDoc =
        context?.context_documents?.some(
            (obj) => !Object.prototype.hasOwnProperty.call(obj, 'deleted') || obj.deleted === false
        ) || selectedFiles.length > 0;

    const saveBtnDisableCheck = context?.name && selectedFiles.length > 0;

    return (
        <Fragment>
            <div className={classes.inputWrapper}>
                <div className={classes.halfWidth}>
                    <InputLabel id="context-name" className={configClasses.inputLabel}>
                        Enter Context Name{requiredField}
                    </InputLabel>
                    <TextField
                        classes={{ root: configClasses.formControl }}
                        size="small"
                        fullWidth
                        value={context['name']}
                        variant="outlined"
                        onChange={(e) => onContextChange(e.target.value, 'name')}
                        required
                        placeholder="Context Name"
                    />
                </div>
                <div className={classes.halfWidth}>
                    <InputLabel id="source-type" className={configClasses.inputLabel}>
                        Select Source Type{requiredField}
                    </InputLabel>
                    <FormControl
                        size="small"
                        variant="outlined"
                        className={configClasses.formControl}
                        fullWidth
                    >
                        <Select
                            size="small"
                            labelId="datasource-type"
                            value={contextSourceType}
                            onChange={(e) => {
                                onConfigChange(e.target.value, 'source_type');
                            }}
                            fullWidth
                            disabled={true}
                            MenuProps={{
                                MenuListProps: {
                                    classes: {
                                        root: configClasses.inputDropdownSelect
                                    }
                                },
                                disableAutoFocusItem: true
                            }}
                        >
                            {getSourceTypeOptions().map((item) => (
                                <MenuItem key={item.label} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            {getContextTemplate({ type: context?.type })?.map((item) => (
                <div key={'template-container'} className={classes.fileItem}>
                    <span className={classes.fileName}>
                        To ensure your Assistant&apos;s accuracy, we recommend you to upload the
                        provided template
                    </span>
                    <div
                        className={classes.downloadTemplatecontainer}
                        onClick={() => handleDownloadTemplate(item.url)}
                    >
                        <TemplateDownloadIcon />
                        <sapn className={clsx(classes.fileName, classes.templateFont)}>
                            {item.label}
                        </sapn>
                    </div>
                </div>
            ))}
            {(contextSourceType === 'csv' || contextSourceType === 'upload') && (
                <div className={classes.fileUploadWrapper}>
                    <CopilotFileUpload
                        acceptedFileExtensions={acceptedFileExtensions}
                        addedDocuments={context?.context_documents}
                        selectedFiles={selectedFiles}
                        required={true}
                        multiple={true}
                        onFileChange={handleSelectedFileChange}
                        primaryLabel="Upload Context"
                        secondaryLabel="Added Documents"
                        enableFileDownload={true}
                        warningLabel="Please add or restore atleast one document to proceed to the next step"
                    />
                    {context.id && context.context_documents[0].name && (
                        <Typography
                            variant="h6"
                            className={clsx(
                                configClasses.inputLabel,
                                classes.uploadedFileSectionLabel
                            )}
                        >
                            Existing Documents
                        </Typography>
                    )}
                    <List className={classes.documentList}>
                        {context.context_documents?.map((item, i) => (
                            <ListItem key={i} className={item.deleted ? classes.deletedDoc : ''}>
                                <ListItemIcon>
                                    <DescriptionOutlinedIcon fontSize="large" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.deleted ? 'Deleted' : ''}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        size="medium"
                                        title="download"
                                        aria-label="download"
                                        onClick={() => handleDownloadTemplate(item?.url)}
                                        className={classes.downloadIcon}
                                    >
                                        <TemplateDownloadIcon />
                                    </IconButton>

                                    {item.deleted ? (
                                        <IconButton
                                            edge="end"
                                            size="medium"
                                            title={
                                                item.disableRestore
                                                    ? "can't be restored"
                                                    : 'restore'
                                            }
                                            aria-label="restore"
                                            onClick={() => handleFileRestore(i)}
                                            className={classes.iconBtn}
                                            disabled={
                                                item.disableRestore ? item.disableRestore : false
                                            }
                                        >
                                            <RestorePageIcon fontSize="large" />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            edge="end"
                                            size="medium"
                                            title="delete"
                                            aria-label="delete"
                                            onClick={() => handleFileDelete(i)}
                                            className={configClasses.deleteButton}
                                        >
                                            <DeleteOutlineOutlinedIcon fontSize="large" />
                                        </IconButton>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
            <div className={classes.actionButtonContainer}>
                <Button
                    className={configClasses.button}
                    variant="contained"
                    size="small"
                    onClick={handleFilesSave}
                    disabled={
                        context?.id ? isUpdateDisabled || !isValidContextDoc : !saveBtnDisableCheck
                    }
                >
                    {context.id ? 'Update' : 'Save'}
                </Button>
            </div>
            <CustomSnackbar
                key="doc-context-snackbar"
                open={snackbar?.open}
                message={snackbar?.message}
                autoHideDuration={2000}
                onClose={() => {
                    setSnackbar({ open: false });
                }}
                severity={snackbar?.severity}
            />
        </Fragment>
    );
}
