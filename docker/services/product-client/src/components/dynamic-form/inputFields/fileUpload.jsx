import React, { useState, useRef } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { CircularProgress } from '@material-ui/core';
import { remove_file, upload_file } from 'common/utils';
import DocumentRenderer from 'components/document-renderer/DocumentRederer';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch'
        }
    },
    container: {
        gap: '1rem',
        alignItems: 'center'
    },
    filesList: {
        display: 'flex',
        alignItems: 'center'
    },
    fileItem: {
        backgroundColor: `${theme.palette.background.attachment}`,
        borderRadius: '0.5rem',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        height: '5rem',
        fontSize: '1.8rem',
        minWidth: '10rem',
        maxWidth: '22rem'
    },
    fileIcon: {
        width: '1.6rem',
        height: '1.6rem'
    },
    fileName: {
        flexGrow: 1,
        marginLeft: '1.8rem',
        fontSize: '1.5rem',
        marginRight: '1.8rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '15rem',
        color: theme.palette.text.titleText
    },
    cancelIcon: {
        width: '1.6rem',
        height: '1.6rem',
        cursor: 'pointer'
    },
    closeIcon: {
        cursor: 'pointer',
        marginRight: '1rem'
    },
    filesContainer: {
        gap: '0.5rem'
    },
    loader: {
        color: theme.palette.primary.contrastText,
        marginRight: '1rem'
    },
    textfiled: {
        '& input': {
            width: 0
        },
        '& > div': {
            display: 'flex',
            justifyContent: 'space-between'
        }
    },
    uploadIcon: {
        right: 0
    },
    fieldWrapper: {
        width: '100%',
        maxWidth: theme.layoutSpacing(640)
    }
}));

const fileUploadTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem',
                    cursor: 'pointer'
                },
                input: {
                    visibility: 'hidden'
                }
            },
            MuiFormLabel: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem',
                    '&$focused': {
                        color: theme.palette.text.titleText,
                        fontWeight: 'bold'
                    }
                }
            },
            MuiOutlinedInput: {
                root: {
                    '& fieldset': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&$focused $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    },
                    '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                        borderColor: alpha(theme.palette.text.titleText, 0.5)
                    }
                },
                input: {
                    paddingTop: '10px',
                    paddingBottom: '10px'
                },
                adornedEnd: {
                    paddingRight: 0
                }
            },

            MuiSvgIcon: {
                root: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiTypography: {
                body1: {
                    fontSize: '2rem',
                    color: theme.palette.text.titleText
                },
                body2: {
                    fontSize: '1.25rem'
                },
                caption: {
                    fontSize: '1rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersCalendarHeader: {
                dayLabel: {
                    fontSize: '1.25rem',
                    color: theme.palette.text.titleText
                }
            },
            MuiPickersDay: {
                day: {
                    color: theme.palette.text.titleText
                }
            },
            MuiButton: {
                textPrimary: {
                    color: theme.palette.text.titleText,
                    fontSize: theme.spacing(2.5)
                }
            },
            MuiInputLabel: {
                outlined: {
                    transform: ' translate(14px, 12px) scale(1)'
                }
            }
        }
    });

export default function FileUpload({
    onChange,
    handleWidgetEvent,
    fieldInfo,
    app_id,
    notificationOpen = () => {}
}) {
    const classes = useStyles();
    const [files, setFiles] = useState(fieldInfo?.value || []);
    const fileRef = useRef();
    const [loading, setLoading] = useState(0);
    const handleChange = (event) => {
        event.preventDefault();
        let new_files = event.target.files;
        let newFiles = null;
        if (fieldInfo?.location) {
            newFiles = new File([new_files[0]], `${fieldInfo.location}/${new_files[0].name}`, {
                type: new_files[0].type
            });
            fieldInfo['uploadWithContentType'] = new_files[0].type;
        }
        if (fieldInfo.preventAutoUpload) {
            const newFiles = fieldInfo.multiple
                ? [...files, ...new_files]
                : [[...new_files].at(-1)];
            handleUploadedFileChange([...newFiles]);
        } else {
            if (fieldInfo?.location) {
                uploadFile(newFiles);
            } else {
                for (const element of new_files) {
                    uploadFile(element);
                }
            }
        }
    };

    const handleUploadedFileChange = (files, type = 'upload') => {
        setFiles(files);
        if (type === 'upload') {
            onChange(files);
        }
        // Handling Interconnectivity
        handleWidgetEvent ? handleWidgetEvent(files) : null;
    };

    const triggerClick = () => {
        fileRef.current.children[0].children[1].click();
    };
    const uploadFile = async (file) => {
        setLoading((prevLoading) => prevLoading + 1);
        try {
            let uploadParams = {};
            if (fieldInfo?.dynamic_storage) {
                uploadParams['dynamic_storage'] = fieldInfo.dynamic_storage;
                uploadParams['app_id'] = app_id;
            }
            const res = await upload_file(
                file,
                fieldInfo.uploadWithContentType,
                fieldInfo?.dynamic_storage ? uploadParams : false
            );
            if (res && res.data) {
                const newFiles = fieldInfo.multiple ? [...files, res.data] : [res.data];
                handleUploadedFileChange(newFiles);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading((prevLoading) => prevLoading - 1);
        }
    };

    const delete_file = (e, file, index) => {
        e.preventDefault();
        const updatedFiles = files.filter((_, i) => i !== index);
        handleUploadedFileChange(updatedFiles, 'delete');
        notificationOpen({
            notification: {
                message: 'File deleted Successfully !',
                type: 'success'
            }
        });
        const dt = new DataTransfer();
        const inputFiles = fileRef.current.children[0].children[1].files;
        Array.from(inputFiles).forEach((currentFile, i) => {
            if (i !== index) {
                dt.items.add(currentFile);
            }
        });
        fileRef.current.children[0].children[1].files = dt.files;
        if (!fieldInfo.preventAutoUpload) {
            remove_file(file);
        }
    };

    return (
        <ThemeProvider theme={fileUploadTheme}>
            <Grid container direction="row" wrap className={classes.container}>
                <Grid item className={classes.fieldWrapper}>
                    <TextField
                        ref={fileRef}
                        error={fieldInfo.error}
                        required={fieldInfo.required}
                        id={fieldInfo.id + fieldInfo.name}
                        name={fieldInfo.name}
                        // label={fieldInfo.label}
                        helperText={fieldInfo.helperText}
                        fullWidth={fieldInfo.fullWidth}
                        placeholder={fieldInfo.placeholder}
                        variant={fieldInfo.variant}
                        margin={fieldInfo.margin}
                        inputProps={{
                            type: 'file',
                            multiple: fieldInfo.multiple,
                            ...fieldInfo.inputprops
                        }}
                        onChange={handleChange}
                        InputLabelProps={fieldInfo.InputLabelProps}
                        className={classes.textfiled}
                        size={fieldInfo.size}
                        onClick={triggerClick}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span>{fieldInfo?.label || 'Upload'}</span>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="publish"
                                        disabled={loading}
                                        size="small"
                                        className={classes.uploadIcon}
                                    >
                                        {loading ? (
                                            <CircularProgress
                                                size={20}
                                                className={classes.loader}
                                            />
                                        ) : (
                                            <PublishIcon fontSize="large"></PublishIcon>
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                {files.map((item, index) => (
                    <Grid item={2} key={item.path + index} className={classes.fileItem}>
                        <DescriptionIcon className={classes.fileIcon} />
                        <span className={classes.fileName} title={item.filename}>
                            {fieldInfo.preventAutoUpload ? item.name : item.filename}
                        </span>
                        <CancelIcon
                            title="remove"
                            className={classes.cancelIcon}
                            onClick={(e) => delete_file(e, item.filename, index)}
                        ></CancelIcon>
                    </Grid>
                ))}
            </Grid>
            {fieldInfo.filePreview ? (
                <div style={{   height: '60rem',  marginTop: '5rem', flexGrow:'1', flexShrink:'0', flexBasis:'auto' }}>
                    <Typography> Preview :</Typography>
                    {files.length == 0 ? (
                        <Typography>No files to preview</Typography>
                    ) : (
                        <DocumentRenderer documents={files} />
                    )}
                </div>
            ) : null}
        </ThemeProvider>
    );
}
