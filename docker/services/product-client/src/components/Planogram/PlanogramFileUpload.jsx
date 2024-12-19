import React, { useState, useRef, useEffect } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { CircularProgress } from '@material-ui/core';
import { remove_file, upload_file } from 'common/utils';
import DocumentRenderer from 'components/document-renderer/DocumentRederer';
import UploadAnalytics from 'assets/img/upload_analytics_contrast.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch'
        }
    },
    container: {
        gap: '1rem',
        alignItems: 'center',
        width: '42rem'
    },
    filesList: {
        display: 'flex',
        alignItems: 'center'
    },
    fileItem: {
        backgroundColor: theme.palette.primary.main,
        // marginLeft:'2rem',
        display: 'flex',
        alignItems: 'center',
        height: '35px',
        fontSize: '1.8rem',
        color: 'white',
        borderRadius: '2rem',
        minWidth: '10rem',
        maxWidth: '22rem'
    },
    fileName: {
        margin: '0 2rem',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
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
        width: '44rem',
        '& input': {
            width: 0
        }
    },
    uploadAnalyticsIcon: {
        height: '3rem',
        width: '3rem',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
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

export default function PlanogramFileUpload({ onChange, fieldInfo, ...props }) {
    const classes = useStyles();
    const [files, setFiles] = useState(fieldInfo.value || []);
    const fileRef = useRef();
    const [loading, setLoading] = useState(0);
    const handleChange = (event) => {
        event.preventDefault();
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }
    };

    const handleUploadedFileChange = (files) => {
        setFiles(files);
        onChange(files);
    };

    const triggerClick = () => {
        fileRef.current.children[0].children[1].click();
    };

    const uploadFile = async (file) => {
        if (fieldInfo.preventAutoUpload) {
            const newFiles = fieldInfo.multiple ? [...files, file] : [file];
            handleUploadedFileChange([...newFiles]);
        } else {
            setLoading((s) => s + 1);
            try {
                const res = await upload_file(file, fieldInfo.uploadWithContentType);
                const newFiles = fieldInfo.multiple ? [...files, res.data] : [res.data];
                handleUploadedFileChange(newFiles);
            } catch (error) {
                //TODO
            } finally {
                setLoading((s) => s - 1);
            }
        }
    };

    const delete_file = (e, file, index) => {
        e.preventDefault();
        files.splice(index, 1);
        handleUploadedFileChange([...files]);

        const dt = new DataTransfer();
        const inputFiles = fileRef.current.children[0].children[1].files;
        for (let i = 0; i < inputFiles.length; i++) {
            const file = inputFiles[i];
            if (index !== i) dt.items.add(file);
        }

        fileRef.current.children[0].children[1].files = dt.files;
        if (!fieldInfo.preventAutoUpload) {
            remove_file(file);
        }
    };

    useEffect(() => {
        if (props?.reset === true) {
            let file = files[0]?.filename;
            let index = 0;
            files.splice(index, 1);
            handleUploadedFileChange([...files]);

            const dt = new DataTransfer();
            const inputFiles = fileRef.current.children[0].children[1].files;
            for (let i = 0; i < inputFiles.length; i++) {
                const file = inputFiles[i];
                if (index !== i) dt.items.add(file);
            }

            fileRef.current.children[0].children[1].files = dt.files;
            if (!fieldInfo.preventAutoUpload) {
                remove_file(file);
            }
        }
    }, [props.reset]);

    return (
        <ThemeProvider theme={fileUploadTheme}>
            <Grid container direction="row" wrap className={classes.container}>
                <Grid item>
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
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="publish"
                                        disabled={loading}
                                        size="small"
                                    >
                                        {loading ? (
                                            <CircularProgress
                                                size={20}
                                                className={classes.loader}
                                            />
                                        ) : (
                                            <img
                                                src={UploadAnalytics}
                                                className={classes.uploadAnalyticsIcon}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="start">
                                    <span>{fieldInfo?.label || 'Upload'}</span>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                {files.map((item, index) => (
                    <Grid item={2} key={item.path + index} className={classes.fileItem}>
                        <span className={classes.fileName} title={item.filename}>
                            {fieldInfo.preventAutoUpload ? item.name : item.filename}
                        </span>
                        <CloseIcon
                            title="remove"
                            className={classes.closeIcon}
                            onClick={(e) => delete_file(e, item.filename, index)}
                        ></CloseIcon>
                    </Grid>
                ))}
            </Grid>
            {fieldInfo.filePreview ? (
                <div style={{ height: '60rem', width: '80rem', marginTop: '10rem' }}>
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
