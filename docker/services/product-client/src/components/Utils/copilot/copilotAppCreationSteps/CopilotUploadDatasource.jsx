import {
    Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    alpha,
    makeStyles,
    useTheme
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import RestorePageIcon from '@material-ui/icons/RestorePage';
import CloseIcon from '@material-ui/icons/Close';
import CustomSnackbar from 'components/CustomSnackbar';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { ReactComponent as CloudUploadIconLight } from 'assets/img/datasource-upload-icon-light.svg';
import { ReactComponent as CloudUploadIconDark } from 'assets/img/datasource-upload-icon-dark.svg';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import clsx from 'clsx';
import { requiredField } from '../util';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginBottom: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    },
    uploadSection: {
        padding: theme.spacing(2.5),
        border: '1px dashed',
        borderColor: theme.palette.border.grey,
        '& label': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
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
    iconBtn: {
        '& .MuiIconButton-label svg': {
            color: theme.palette.text.contrastText
        },
        '&:disabled svg': {
            opacity: 0.4,
            cursor: 'not-allowed'
        },
        '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto'
        }
    },
    fileItem: {
        backgroundColor: theme.palette.background.chipRevampBg,
        display: 'flex',
        alignItems: 'center',
        height: theme.layoutSpacing(32),
        fontSize: theme.layoutSpacing(14),
        color: 'white',
        borderRadius: theme.layoutSpacing(20.74),
        minWidth: theme.layoutSpacing(103.68),
        maxWidth: theme.layoutSpacing(228.1),
        justifyContent: 'space-between',
        cursor: 'default'
    },
    fileName: {
        color: theme.palette.text.revamp,
        margin: theme.layoutSpacing(0, 20.74),
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    closeIcon: {
        cursor: 'pointer',
        marginRight: theme.layoutSpacing(10.37),
        color: theme.palette.text.revamp
    },
    actionButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.layoutSpacing(8.3)
    },
    hyperLinkLabel: {
        fontSize: theme.layoutSpacing(12),
        fontWeight: 600,
        lineHeight: theme.layoutSpacing(16),
        color: '#4788D8',
        cursor: 'pointer'
    },
    selectedFileSection: {
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: theme.layoutSpacing(10.368),
        columnGap: theme.layoutSpacing(12),
        // maxHeight: theme.layoutSpacing(170),
        overflowY: 'scroll'
    },
    filesSectionLabel: {
        paddingTop: theme.layoutSpacing(7)
    },
    uploadedFileSectionLabel: {
        paddingTop: theme.layoutSpacing(23)
    },
    uploadBtn: {
        aspectRatio: 1
    },
    docWarningLabel: {
        paddingTop: theme.layoutSpacing(23),
        color: theme.palette.error.dark
    }
}));

export default function UploadDatasourceConfigurator({
    datasource,
    config,
    onChange,
    onFileChange,
    acceptedFileExtensions,
    isUpdateDisabled,
    isLoading,
    ...props
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const theme = useTheme();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files;
        if (!props.multiple && file.length > 1) {
            setSnackbar({
                message: `Upload upto 1 file`,
                open: true,
                severity: 'error'
            });
            return;
        }

        const fileList = [...file];

        const isAnyFileUnspported = fileList.some((item) => {
            const fileExtension = '.' + item.name.split('.').at(-1);
            return !acceptedFileExtensions.includes(fileExtension);
        });

        if (isAnyFileUnspported) {
            setSnackbar({
                message: `Unsupported file types`,
                open: true,
                severity: 'error'
            });
            return;
        }

        const newFiles = props.multiple ? [...selectedFiles, ...file] : [...file];
        handleSelectedFileChange([...newFiles]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const handleInputChange = (e, fileInput) => {
        e.preventDefault();
        // let inputFiles = e.target.files;
        if (
            !props.multiple &&
            (selectedFiles.length === 1 || datasource?.datasource_documents?.length > 0) &&
            datasource.type === 'csv'
        ) {
            datasource?.datasource_documents?.map((_, i) => {
                datasource.datasource_documents[i].disableRestore = true;
                handleFileDelete(i);
            });
        }
        let inputFiles = fileInput;

        const fileList = [...inputFiles];

        const isAnyFileUnspported = fileList.some((item) => {
            const fileExtension = '.' + item.name.split('.').at(-1);
            return !acceptedFileExtensions.includes(fileExtension);
        });

        if (isAnyFileUnspported) {
            setSnackbar({
                message: `Unsupported file types`,
                open: true,
                severity: 'error'
            });
            return;
        }

        const newFiles = props.multiple ? [...selectedFiles, ...inputFiles] : [...inputFiles];
        handleSelectedFileChange([...newFiles]);
    };

    const handleSelectedFileChange = (files) => {
        setSelectedFiles(files);
        onChange({
            ...config
        });
        onFileChange(files);
    };

    const handleFileDelete = (i) => {
        datasource.datasource_documents[i].deleted = true;
        props.onUpdateExistingDocument(datasource);
    };

    const handleFileRestore = (index) => {
        datasource.datasource_documents[index].deleted = false;
        props.onUpdateExistingDocument(datasource);
    };

    const handleFilesSave = () => {
        if (datasource.id) {
            props.onUpdateUploadDatasource();
            setSelectedFiles([]);
        } else {
            props.onSaveUploadDatasource();
            setSelectedFiles([]);
        }
    };

    const handleRemoveFile = (e, index) => {
        e.preventDefault();
        if (
            !props.multiple &&
            selectedFiles.length === 1 &&
            datasource?.datasource_documents?.length > 0 &&
            datasource.type === 'csv'
        ) {
            datasource?.datasource_documents?.map((_, i) => {
                delete datasource.datasource_documents[i].disableRestore;
                handleFileRestore(i);
            });
        }

        const updatedSelectedFiles = selectedFiles.slice();
        updatedSelectedFiles.splice(index, 1);
        // setSelectedFiles(updatedSelectedFiles);
        handleSelectedFileChange([...updatedSelectedFiles]);
    };

    const saveBtnDisableCheck =
        datasource?.name &&
        (selectedFiles.length > 0 ||
            datasource?.datasource_documents?.some(
                (doc) => Object.keys(doc).includes('deleted') && doc.deleted === true
            ));

    const renderUploadButtonIcon =
        theme.props.mode === 'light' ? <CloudUploadIconLight /> : <CloudUploadIconDark />;

    const isValidDatasourceDoc =
        datasource?.datasource_documents?.some(
            (obj) => !Object.prototype.hasOwnProperty.call(obj, 'deleted') || obj.deleted === false
        ) || selectedFiles.length > 0;
    return (
        <Fragment>
            <div className={classes.root}>
                <Typography variant="h5" className={configClasses.inputLabel}>
                    {props.multiple ? 'Upload Files' : 'Upload File'}
                    {requiredField}
                </Typography>
                <div
                    className={classes.uploadSection}
                    onDrop={(e) => handleDrop(e)}
                    onDragOver={handleDrag}
                >
                    <ConfirmPopup
                        onConfirm={handleInputChange}
                        title="Warning"
                        subTitle="Selected file will be replaced. Do you want to continue?"
                        classes={{
                            dialogPaper: configClasses.confirmDialog
                        }}
                        enableCloseButton
                    >
                        {(triggerConfirm) => (
                            <input
                                accept={acceptedFileExtensions}
                                className={classes.input}
                                id="upload-datasource-file"
                                type="file"
                                multiple={props.multiple || false}
                                onChange={(e) => {
                                    if (
                                        !props.multiple &&
                                        (selectedFiles.length === 1 ||
                                            datasource?.datasource_documents?.length > 0) &&
                                        datasource.type === 'csv'
                                    ) {
                                        if (e.target.files?.length > 0) {
                                            triggerConfirm(e.target.files);
                                        }
                                    } else {
                                        handleInputChange(e, e.target.files);
                                    }
                                }}
                            />
                        )}
                    </ConfirmPopup>
                    <label htmlFor="upload-datasource-file">
                        <IconButton
                            aria-label="upload"
                            component="span"
                            className={classes.uploadBtn}
                        >
                            {renderUploadButtonIcon}
                        </IconButton>
                        <Typography variant="h5" className={configClasses.helperLabel}>
                            Drag & Drop or
                            <span className={classes.hyperLinkLabel}> Choose file </span>
                            to upload analytics
                        </Typography>
                    </label>
                </div>
                <Typography variant="h5" className={configClasses.helperLabel}>
                    {!props.multiple
                        ? 'You can upload one file in either ' +
                          acceptedFileExtensions.map((item) => item.substring(1)).join(' or ') +
                          ' format'
                        : 'You can upload ' +
                          acceptedFileExtensions.map((item) => item.substring(1)).join(', ') +
                          ' file formats'}
                </Typography>
                {!isValidDatasourceDoc && !isLoading && datasource?.id && (
                    <Typography
                        variant="h5"
                        className={clsx(classes.docWarningLabel, configClasses.inputLabel)}
                    >
                        Please add or restore at least one document to proceed to the next step.
                    </Typography>
                )}

                {datasource.id && selectedFiles.length !== 0 && (
                    <Typography
                        variant="h6"
                        className={clsx(configClasses.inputLabel, classes.filesSectionLabel)}
                    >
                        Added Documents
                    </Typography>
                )}
                <Grid container className={classes.selectedFileSection} wrap="wrap">
                    {selectedFiles.map((item, index) => (
                        <Grid
                            item={2}
                            key={item.path + index}
                            className={classes.fileItem}
                            title={item.name}
                        >
                            <span className={classes.fileName}>{item.name}</span>
                            <CloseIcon
                                titleAccess="remove"
                                className={classes.closeIcon}
                                onClick={(e) => handleRemoveFile(e, index)}
                            ></CloseIcon>
                        </Grid>
                    ))}
                </Grid>

                {datasource.id && datasource.datasource_documents && (
                    <Typography
                        variant="h6"
                        className={clsx(configClasses.inputLabel, classes.uploadedFileSectionLabel)}
                    >
                        Existing Documents
                    </Typography>
                )}
                <List className={classes.documentList}>
                    {datasource.datasource_documents?.map((item, i) => (
                        <ListItem key={i} className={item.deleted ? classes.deletedDoc : ''}>
                            <ListItemIcon>
                                <DescriptionOutlinedIcon fontSize="large" />
                            </ListItemIcon>
                            <ListItemText
                                primary={item.name}
                                secondary={item.deleted ? 'Deleted' : ''}
                            />
                            <ListItemSecondaryAction>
                                {item.deleted ? (
                                    <IconButton
                                        edge="end"
                                        size="medium"
                                        title={
                                            item.disableRestore ? "can't be restored" : 'restore'
                                        }
                                        aria-label="restore"
                                        onClick={() => handleFileRestore(i)}
                                        className={classes.iconBtn}
                                        disabled={item.disableRestore ? item.disableRestore : false}
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
                <div className={classes.actionButtonContainer}>
                    <Button
                        className={configClasses.button}
                        variant="contained"
                        size="small"
                        onClick={handleFilesSave}
                        disabled={
                            datasource?.id
                                ? isUpdateDisabled || !isValidDatasourceDoc
                                : !saveBtnDisableCheck
                        }
                    >
                        {datasource.id ? 'Update' : 'Save'}
                    </Button>
                </div>
            </div>
            <CustomSnackbar
                key="doc-datasource-snackbar"
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
