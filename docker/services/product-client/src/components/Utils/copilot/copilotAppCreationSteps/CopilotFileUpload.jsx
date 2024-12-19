import { Grid, IconButton, Typography, alpha, makeStyles, useTheme } from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import CustomSnackbar from 'components/CustomSnackbar';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { ReactComponent as CloudUploadIconLight } from 'assets/img/datasource-upload-icon-light.svg';
import { ReactComponent as CloudUploadIconDark } from 'assets/img/datasource-upload-icon-dark.svg';
import clsx from 'clsx';
import ConfirmPopup from 'components/confirmPopup/ConfirmPopup';
import { requiredField } from '../util';
import { ReactComponent as TemplateDownloadIcon } from 'assets/img/template-download-icon.svg';

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
        margin: theme.layoutSpacing(0, 16.74),
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    closeIcon: {
        cursor: 'pointer',
        marginRight: theme.layoutSpacing(10.37),
        color: theme.palette.text.revamp
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
        color: theme.palette.error.dark,
        fontSize: theme.layoutSpacing(14),
        fontWeight: 500,
        lineHeight: theme.layoutSpacing(16.8)
    },
    downloadIcon: {
        marginRight: theme.layoutSpacing(6),
        '& svg': {
            width: theme.layoutSpacing(28),
            '& path': {
                stroke: theme.palette.text.contrastText
            }
        },
        cursor: 'pointer'
    }
}));

export default function CopilotFileUpload({
    acceptedFileExtensions,
    addedDocuments,
    required,
    onFileChange,
    primaryLabel,
    secondaryLabel,
    selectedFiles,
    enableFileDownload = false,
    ...props
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const theme = useTheme();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files;
        if (!props.multiple && file.length > 1) {
            setSnackbar({
                message: 'Upload up to 1 file',
                open: true,
                severity: 'error'
            });
            return;
        }

        const fileList = [...file];

        const isAnyFileUnsupported = fileList.some((item) => {
            const fileExtension = '.' + item.name.split('.').at(-1);
            return !acceptedFileExtensions.includes(fileExtension);
        });

        if (isAnyFileUnsupported) {
            setSnackbar({
                message: 'Unsupported file types',
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
        const inputFiles = fileInput;

        const fileList = [...inputFiles];

        const isAnyFileUnsupported = fileList.some((item) => {
            const fileExtension = '.' + item.name.split('.').at(-1);
            return !acceptedFileExtensions.includes(fileExtension);
        });

        if (isAnyFileUnsupported) {
            setSnackbar({
                message: 'Unsupported file types',
                open: true,
                severity: 'error'
            });
            return;
        }

        const newFiles = props.multiple ? [...selectedFiles, ...inputFiles] : [...inputFiles];
        handleSelectedFileChange([...newFiles]);
    };

    const handleSelectedFileChange = (files) => {
        onFileChange(files);
    };

    const handleRemoveFile = (e, index) => {
        e.preventDefault();
        const updatedSelectedFiles = selectedFiles.slice();
        updatedSelectedFiles.splice(index, 1);
        handleSelectedFileChange([...updatedSelectedFiles]);
    };

    const renderUploadButtonIcon =
        theme.props.mode === 'light' ? <CloudUploadIconLight /> : <CloudUploadIconDark />;

    const isNotValidDoc =
        addedDocuments?.some(
            (doc) => Object.keys(doc).includes('deleted') && doc.deleted === true
        ) && selectedFiles.length === 0;

    const handleFileDownload = (file) => {
        const blob = new Blob([file], { type: file.type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    };

    return (
        <Fragment>
            <div className={classes.root}>
                <Typography variant="h5" className={configClasses.inputLabel}>
                    {primaryLabel || 'Upload'}
                    {required ? requiredField : null}
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
                                        (selectedFiles.length === 1 || addedDocuments?.length > 0)
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
                          acceptedFileExtensions?.map((item) => item.substring(1)).join(' or ') +
                          ' format'
                        : 'You can upload ' +
                          acceptedFileExtensions?.map((item) => item.substring(1)).join(', ') +
                          (acceptedFileExtensions?.length > 1 ? ' file formats' : ' file format')}
                </Typography>

                {selectedFiles.length !== 0 && (
                    <Typography
                        variant="h6"
                        className={clsx(configClasses.inputLabel, classes.filesSectionLabel)}
                    >
                        {secondaryLabel}
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
                            {enableFileDownload ? (
                                <div className={classes.downloadIcon}>
                                    <TemplateDownloadIcon
                                        onClick={() => handleFileDownload(item)}
                                    />
                                </div>
                            ) : null}
                            <CloseIcon
                                titleAccess="remove"
                                className={classes.closeIcon}
                                onClick={(e) => handleRemoveFile(e, index)}
                            ></CloseIcon>
                        </Grid>
                    ))}
                </Grid>
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

            {isNotValidDoc && props.warningLabel && (
                <Typography variant="h5" className={classes.docWarningLabel}>
                    {props.warningLabel}
                </Typography>
            )}
        </Fragment>
    );
}
