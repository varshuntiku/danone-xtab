import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { axiosClient } from 'services/httpClient';
// import PublishIcon from '@material-ui/icons/Publish';
// import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
import { Box, Button, createTheme, ThemeProvider, Typography, useTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import UploadIcon from '../../../assets/Icons/UploadIcon';
import { CircularProgress } from '@material-ui/core';
import clsx from 'clsx';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1)
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
        backgroundColor: theme.palette.background.uploadBg,
        // marginLeft:'4rem',
        display: 'flex',
        alignItems: 'center',
        height: '35px',
        fontSize: '1.8rem',
        color: 'white',
        borderRadius: '2rem',
        minWidth: '10rem',
        flexBasis: 'content !important'
        // marginTop: '2rem',
        // marginBottom: '1rem'
    },
    fileName: {
        margin: '0 1rem',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: theme.palette.text.default,
        fontFamily: theme.body.B5.fontFamily
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
        width: '100%',
        '& input': {
            width: 0
        }
    },
    Button: {
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.contrastText,
        fontSize: '1rem'
    },
    btnWithUploadIcon: {
        border: 'none'
    },
    Box: {
        // minWidth:"20rem",
        minHeight: '18rem',
        padding: '2rem',
        width: '100%',
        border: '1px dashed' + theme.palette.border.grey,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        gap: '1rem',
        borderRadius: '2px',
        marginBottom: '3rem'
    },
    BoxText: {
        margin: '1rem',
        color: theme.palette.text.default,
        fontWeight: 500,
        fontFamily: theme.body.B5.fontFamily
    },
    uploadLabel: {
        margin: '1rem',
        color: theme.palette.text.default,
        fontWeight: 400,
        marginTop: '-3rem',
        fontFamily: theme.body.B5.fontFamily
    },
    labelAfterUpload: {
        marginTop: '0rem'
    },
    btnTextStyle: {
        textTransform: 'none'
    },
    higlightText: {
        color: theme.palette.text.chooseFileText,
        fontWeight: 600
    }
}));

const imageUploadTheme = (theme) =>
    createTheme({
        ...theme,
        overrides: {
            ...theme.overrides,
            MuiInputBase: {
                root: {
                    color: theme.palette.text.titleText,
                    fontSize: '1.6rem'
                    // marginLeft: '4rem',
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
                    color: theme.palette.text.titleText,
                    margin: '1rem'
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

export default function ImageUpload({
    onChange,
    fieldInfo,
    editDisabled = false,
    addFilesToRemove = null
}) {
    const classes = useStyles();
    const [files, setFiles] = React.useState([]);
    const fileRef = React.createRef();
    const [loading, setLoading] = React.useState(false);
    const themeGlobal = useTheme();

    const handleChange = (event) => {
        event.preventDefault();
        let files = event.target.files;
        if (fieldInfo.inputprops.multiple) {
            for (let i = 0; i < files.length; i++) {
                upload_file(files[i]);
            }
        } else {
            upload_file(files[0]);
        }
    };

    const handleUploadedFileChange = (files) => {
        let tempFiles = fieldInfo.inputprops.multiple
            ? files
            : files.length > 0
            ? [files[files.length - 1]]
            : [];
        setFiles(tempFiles);
        onChange(tempFiles);
    };

    const triggerClick = () => {
        fileRef.current.children[0].children[1].click();
    };

    const upload_file = async (file) => {
        try {
            const Compressor = await (await import('compressorjs')).default;
            const formData = new FormData();
            let compressedFile;
            new Compressor(file, {
                quality: 0.8,
                success: (compressedResult) => {
                    compressedFile = new File([compressedResult], file.name, { type: file.type });
                    formData.append('file', compressedFile);
                    persistFileOnBlob(formData);
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const persistFileOnBlob = (formData) => {
        setLoading((s) => s + 1);
        axiosClient
            .post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                files.push(res.data);
                setFiles([...files]);
                handleUploadedFileChange(files);
            })
            .catch(() => {})
            .finally(() => {
                setLoading((s) => s - 1);
            });
    };

    const remove_file = (e, file, index) => {
        e.preventDefault();
        files.splice(index, 1);
        handleUploadedFileChange([...files]);
        if (!addFilesToRemove) {
            const body = { file: file };
            axiosClient
                .post('/file/delete', body)
                .then(() => {
                    //TODO
                })
                .catch(() => {});
        } else {
            let tempFiles = fieldInfo.inputprops.multiple
                ? files
                : files.length > 0
                ? [files[files.length - 1]]
                : [];
            addFilesToRemove(file, tempFiles);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        let files = event.dataTransfer.files;
        if (fieldInfo.inputprops.multiple) {
            for (let i = 0; i < files.length; i++) {
                upload_file(files[i]);
            }
        } else {
            upload_file(files[0]);
        }
    };

    const isValidImageUrl = (url) => {
        const imgRegex = /\.(jpeg|jpg|gif|png|svg)$/;
        return imgRegex.test(url);
    };

    return (
        <ThemeProvider theme={imageUploadTheme}>
            {/* <Grid container direction="row" wrap="wrap" className={classes.container}>
      <Grid item > */}
            <TextField
                ref={fileRef}
                error={fieldInfo.error}
                multiline={fieldInfo.multiple}
                required={fieldInfo.required}
                id={fieldInfo.id + fieldInfo.name}
                name={fieldInfo.name}
                // label={fieldInfo.label}
                helperText={fieldInfo.helperText}
                fullWidth={fieldInfo.fullWidth}
                placeholder={fieldInfo.placeholder}
                // variant={fieldInfo.variant}
                margin={fieldInfo.margin}
                inputProps={fieldInfo.inputprops}
                onChange={handleChange}
                InputLabelProps={fieldInfo.InputLabelProps}
                multiple={fieldInfo.multiple}
                className={classes.textfiled}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <Box
                            className={classes.Box}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!fieldInfo.admin ? (
                                <Typography className={classes.BoxText} variant={'h4'}>
                                    {fieldInfo?.label || 'Upload'}
                                </Typography>
                            ) : null}
                            <Button
                                aria-label="publish"
                                onClick={triggerClick}
                                disabled={loading || fieldInfo?.disableButton}
                                // size="small"
                                variant="outlined"
                                className={clsx(
                                    classes.Button,
                                    fieldInfo.textTransform === 'none'
                                        ? classes.btnTextStyle
                                        : 'none',
                                    fieldInfo?.admin ? classes.btnWithUploadIcon : ''
                                )}
                            >
                                {loading ? (
                                    <CircularProgress size={20} className={classes.loader} />
                                ) : // <PublishIcon fontSize="large"></PublishIcon>
                                !fieldInfo?.admin ? (
                                    'Upload'
                                ) : (
                                    <UploadIcon color={themeGlobal.palette.icons.uploadIcon} />
                                )}
                            </Button>
                            {fieldInfo.admin ? (
                                <Typography
                                    className={clsx(
                                        classes.uploadLabel,
                                        files.length ? classes.labelAfterUpload : ''
                                    )}
                                    variant={'h4'}
                                >
                                    Drag & Drop or{' '}
                                    <span className={classes.higlightText}>Choose file</span> to
                                    upload
                                </Typography>
                            ) : null}
                            {files.map((item, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    key={item.path + index}
                                    className={classes.fileItem}
                                >
                                    <img
                                        alt={item.filename}
                                        height="50px"
                                        width="50px"
                                        src={
                                            isValidImageUrl(sanitizeHtml(item.path))
                                                ? sanitizeHtml(item.path)
                                                : ''
                                        }
                                    />
                                    <span className={classes.fileName} title={item.filename}>
                                        {item.filename}
                                    </span>
                                    {!editDisabled && (
                                        <CloseIcon
                                            title="remove"
                                            className={classes.closeIcon}
                                            onClick={(e) => remove_file(e, item.filename, index)}
                                        ></CloseIcon>
                                    )}
                                </Grid>
                            ))}
                            {(!files || files.length === 0) &&
                                fieldInfo.value &&
                                fieldInfo.value.map((item, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        key={item.path + index}
                                        className={classes.fileItem}
                                    >
                                        <img
                                            alt={item.filename}
                                            height="50px"
                                            width="50px"
                                            src={
                                                isValidImageUrl(item.path)
                                                    ? sanitizeHtml(item.path)
                                                    : ''
                                            }
                                        />
                                        <span className={classes.fileName} title={item.filename}>
                                            {item.filename}
                                        </span>
                                        {!editDisabled && (
                                            <CloseIcon
                                                title="remove"
                                                className={classes.closeIcon}
                                                onClick={(e) =>
                                                    remove_file(e, item.filename, index)
                                                }
                                            ></CloseIcon>
                                        )}
                                    </Grid>
                                ))}
                        </Box>
                    )
                }}
            />
            {/* </Grid>

    </Grid> */}
        </ThemeProvider>
    );
}
