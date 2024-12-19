import React, { useEffect, useState, useRef } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider, Typography, useTheme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PdfIcon from '../../../assets/Icons/Pdf';
import DocIcon from '../../../assets/Icons/Doc';
import CsvIcon from '../../../assets/Icons/Csv';
import PptIcon from '../../../assets/Icons/Ppt';
import Mp4Icon from '../../../assets/Icons/Mp4';
import NofileIcon from '../../../assets/Icons/Nofile';
import LinearProgressBar from 'components/LinearProgressBar.jsx';
import CustomSnackbar from 'components/CustomSnackbar';
import { calculateSize, acceptValues, remove_file, upload_file } from '../../../common/utils';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch'
        }
    },
    filesList: {
        display: 'flex',
        alignItems: 'center'
    },
    upload: {
        border: `1px dashed ${theme.palette.primary.contrastText}`,
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
    },
    fileItem: {
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        height: '35px',
        fontSize: '1.8rem',
        color: 'white',
        borderRadius: '2rem',
        minWidth: '10rem',
        maxWidth: '22rem',
        padding: '1rem'
    },
    imageType: {
        border: `1px solid ${theme.palette.icons.nofile + 80}`,
        display: 'flex',
        padding: '1rem',
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content'
    },
    fileName: {
        margin: '0 2rem',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    closeIcon: {
        cursor: 'pointer'
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
        }
    },
    noFileContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    noFileLogo: {
        border: `1px solid ${theme.palette.icons.nofile + 80}`,
        borderRadius: '50%',
        padding: '0.8rem',
        width: '109px',
        height: '109px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noFileFillerText: {
        color: theme.palette.icons.nofile + 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    dropZone: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dragContent: {
        color: theme.palette.primary.contrastText,
        transitionDuration: '1s'
    },
    linearBar: {
        color: theme.palette.primary.contrastText
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dropZoneBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        margin: '1rem'
    },
    progressBar: {
        width: '100%',
        paddingTop: '0.5rem'
    },
    preview: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '50rem',
        objectFit: 'contain'
    },
    noFileFiller: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIconImage: {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '20px',
        height: '20px',
        cursor: 'pointer'
    },
    alignment: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        overflowY: 'scroll',
        marginTop: '2rem'
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
                    fontSize: '1.6rem'
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

export default function FileUpload2({ onChange, fieldInfo }) {
    const classes = useStyles();
    const theme = useTheme();
    const [files, setFiles] = useState(fieldInfo.value || []);
    const fileRef = useRef();
    const [loading, setLoading] = useState(0);
    const [accept, setAccept] = useState(0);
    const [notificationopen, setNotificationOpen] = useState();
    const [content, setContent] = useState('Drag & Drop your file(s) here');
    const max_size = fieldInfo?.max_size || 200;
    const handleChange = (event) => {
        event.preventDefault();
        let files = event.target.files;
        const filesSize = calculateSize(files);
        if (filesSize >= max_size) {
            setAccept((s) => s + 1);
            setContent(`Files size excluded ${max_size}mb`);
            return;
        }

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
        let type = file.type.split('/')[1];
        if (accept) {
            setAccept((s) => s - 1);
        }
        setLoading((s) => s + 1);
        try {
            const res = await upload_file(file);
            const newFiles = fieldInfo.multiple
                ? [...files, { ...res.data, type: type }]
                : [{ ...res.data, type: type }];
            handleUploadedFileChange(newFiles);
        } catch (error) {
            // console.warn(error);
        } finally {
            setLoading((s) => s - 1);
            setNotificationOpen(true);
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
        remove_file(file);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleOnDrop = (e) => {
        e.preventDefault();
        let acceptance = fieldInfo.inputprops.accept.split(',').map((item) => {
            return acceptValues[item] ? acceptValues[item] : item;
        });
        const files = e.dataTransfer.files;
        const filesSize = calculateSize(files);

        if (filesSize >= max_size) {
            setAccept((s) => s + 1);
            setContent(`Files size excluded ${max_size}mb`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            let fileType = '.' + files[i].type.split('/')[1];
            if (!acceptance.includes(fileType)) {
                setAccept((s) => s + 1);
                setContent(`Please drag & drop ${fieldInfo.inputprops.accept} format file(s)`);
                return;
            } else {
                uploadFile(files[i]);
            }
        }
    };
    useEffect(() => {
        setTimeout(() => {
            setContent('Drag & Drop your file(s) here');
        }, 3000);
    }, [loading, accept]);
    return (
        <ThemeProvider theme={fileUploadTheme}>
            <Grid container direction="column" wrap className={classes.container} spacing={2}>
                <Grid item>
                    <div
                        className={classes.upload}
                        onDragOver={handleDragOver}
                        onDrop={handleOnDrop}
                    >
                        <div className={classes.dropZoneBox}>
                            <div className={classes.dropZone}>
                                <div className={classes.content}>
                                    <Typography className={classes.dragContent}>
                                        {content}
                                    </Typography>
                                </div>
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment
                                                position="start"
                                                onClick={triggerClick}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span>{fieldInfo?.label || 'Upload'}</span>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.progressBar}>
                            {loading ? <LinearProgressBar /> : null}
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid style={{ display: 'flex' }}>
                <CustomSnackbar
                    open={notificationopen && 'uploaded successfully'}
                    autoHideDuration={2000}
                    severity={'success'}
                    message={'Uploaded successfully'}
                    onClose={() => {
                        setNotificationOpen(false);
                    }}
                />
            </Grid>
            <Grid container spacing={2} wrap className={classes.alignment}>
                {files.length > 0 ? (
                    files.map((item, index) => (
                        <Grid item={2} key={item.path}>
                            <div className={classes.preview}>
                                <div
                                    className={
                                        item.type === 'pdf' ||
                                        item.type === 'csv' ||
                                        item.type === 'msword' ||
                                        item.type === 'ppt' ||
                                        item.type === 'mp4' ||
                                        item.type === 'x-matroska'
                                            ? classes.fileItem
                                            : null
                                    }
                                >
                                    {item.type === 'pdf' && (
                                        <div className={classes.icon}>
                                            <PdfIcon color={theme.palette.primary.contrastText} />
                                        </div>
                                    )}
                                    {item.type === 'csv' && (
                                        <div className={classes.icon}>
                                            <CsvIcon color={theme.palette.primary.contrastText} />
                                        </div>
                                    )}
                                    {item.type === 'msword' && (
                                        <div className={classes.icon}>
                                            <DocIcon color={theme.palette.primary.contrastText} />
                                        </div>
                                    )}
                                    {item.type === 'ppt' && (
                                        <div className={classes.icon}>
                                            {' '}
                                            <PptIcon color={theme.palette.primary.contrastText} />
                                        </div>
                                    )}
                                    {(item.type === 'mp4' || item.type === 'x-matroska') && (
                                        <div className={classes.icon}>
                                            <Mp4Icon color={theme.palette.primary.contrastText} />
                                        </div>
                                    )}
                                    {(item.type === 'pdf' ||
                                        item.type === 'csv' ||
                                        item.type === 'msword' ||
                                        item.type === 'ppt' ||
                                        item.type === 'mp4' ||
                                        item.type === 'x-matroska') && (
                                        <span className={classes.fileName} title={item.filename}>
                                            <Typography
                                                style={{ color: theme.palette.primary.titleText }}
                                            >
                                                {item.filename}
                                            </Typography>
                                        </span>
                                    )}
                                    {(item.type === 'pdf' ||
                                        item.type === 'csv' ||
                                        item.type === 'msword' ||
                                        item.type === 'ppt' ||
                                        item.type === 'mp4' ||
                                        item.type === 'x-matroska') && (
                                        <CloseIcon
                                            title="remove"
                                            className={classes.closeIcon}
                                            onClick={(e) => delete_file(e, item.filename, index)}
                                        ></CloseIcon>
                                    )}
                                    {(item.type === 'png' || item.type === 'jpeg') && (
                                        <div>
                                            <div className={classes.imageType}>
                                                <div className={classes.imageContainer}>
                                                    <img
                                                        src={item.path}
                                                        alt="imagefile"
                                                        className={classes.image}
                                                    />
                                                    <Typography title={item.filename}>
                                                        {item.filename}
                                                    </Typography>
                                                </div>
                                                <CloseIcon
                                                    title="remove"
                                                    className={classes.closeIconImage}
                                                    onClick={(e) =>
                                                        delete_file(e, item.filename, index)
                                                    }
                                                ></CloseIcon>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    ))
                ) : (
                    <Grid>
                        <div className={classes.noFileContainer}>
                            <div className={classes.noFileLogo}>
                                <NofileIcon color={theme.palette.icons.nofile + 30} />
                            </div>
                            <div className={classes.noFileFiller}>
                                <Typography
                                    variant="h3"
                                    style={{ color: theme.palette.icons.nofile + 80 }}
                                >
                                    No files Uploaded yet
                                </Typography>
                                <Typography className={classes.noFileFillerText}>
                                    Your Uploaded file(s) will appear here, click on the upload
                                    button (or) drag & drop <br></br>
                                    <span style={{ textAlign: 'center' }}>
                                        to upload your file(s).
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                )}
            </Grid>
        </ThemeProvider>
    );
}
