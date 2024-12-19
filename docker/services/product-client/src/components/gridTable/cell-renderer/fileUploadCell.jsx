import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { createTheme, ThemeProvider, Typography, CircularProgress } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import { axiosClient } from '../../../services/httpClient';

const fileUploadCellTheme = (theme) =>
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

const useStyles = makeStyles((theme) => ({
    textfiled: {
        '& input': {
            width: 0
        }
    },
    loader: {
        color: theme.palette.primary.contrastText
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: '8rem',
        height: '8rem'
    },
    smooth: {
        transition: 'opacity 1s',
        '&:hover': {
            '& $downloadIcon': {
                display: 'block'
            }
        }
    },
    fileContainer: {
        marginLeft: '2rem',
        display: 'flex',
        position: 'relative'
    },
    imageVisible: {
        opacity: 1
    },
    imageHidden: {
        opacity: 0
    },
    closeIcon: {
        cursor: 'pointer',
        color: theme.palette.primary.contrastText,
        position: 'absolute',
        right: '-1.2rem',
        top: '-1.3rem'
    },
    downloadIcon: {
        cursor: 'pointer',
        color: theme.palette.primary.contrastText,
        display: 'none',
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        fontSize: '3rem'
    },
    extraFiles: {
        marginLeft: '2rem',
        cursor: 'pointer'
    }
}));
function FileUploadCell({ params, onChange, row, coldef }) {
    const classes = useStyles();
    const [files, setFiles] = React.useState(
        Array.isArray(row.data[coldef?.headerName]) ? row.data[coldef?.headerName] : []
    );
    const [loading, setLoading] = React.useState(0);
    const [imageload, setImageload] = React.useState(false);
    const [expand, setExpand] = React.useState(false);
    const fileRef = React.createRef();
    const triggerClick = () => {
        fileRef.current.children[0].children[1].click();
    };
    const handleChange = (event) => {
        event.preventDefault();
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            upload_file(files[i]);
        }
    };
    const upload_file = (file) => {
        const formData = new FormData();
        let type = file.type.split('/')[1];
        formData.append('file', file);
        setLoading((s) => s + 1);
        axiosClient
            .post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                files.push({ ...res.data, type: type });
                setFiles([...files]);
                onChange([...files]);
            })
            .catch(() => {})
            .finally(() => {
                setLoading((s) => s - 1);
            });
    };
    const remove_file = (e, file, index) => {
        e.preventDefault();
        const body = { file: file };
        files.splice(index, 1);
        setFiles([...files]);
        onChange([...files]);
        axiosClient
            .post('/file/delete', body)
            .then(() => {
                // TODO
            })
            .catch(() => {});
    };

    const download_file = (e, file) => {
        const element = document.createElement('a');
        element.href = file.path;
        element.download = file.filename;
        document.body.appendChild(element);
        element.click();
    };

    const cellImageSizes = {
        small: { width: '5rem', height: '5rem' },
        medium: { width: '8rem', height: '8rem' },
        large: { width: '12rem', height: '12rem' }
    };
    return (
        <ThemeProvider theme={fileUploadCellTheme}>
            <Grid container direction="row" spacing={2} className={classes.container}>
                {!params.readOnly && (
                    <TextField
                        ref={fileRef}
                        variant="outlined"
                        inputProps={{
                            type: 'file',
                            multiple: params.multiple,
                            accept: params.accept
                        }}
                        onChange={handleChange}
                        className={classes.textfiled}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    onClick={triggerClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} className={classes.loader} />
                                    ) : (
                                        <span>{'Upload'}</span>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        id="file upload"
                    />
                )}
                {params.preview && files.length > 0 ? (
                    <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {(expand ? files : files.slice(0, 3)).map((item, index) => (
                            <div key={item.path} className={classes.fileContainer}>
                                <div
                                    className={[
                                        classes.smooth,
                                        `classes.image${imageload ? 'Visible' : 'Hidden'}`
                                    ].join(' ')}
                                >
                                    <img
                                        data-testid="fileupload_img"
                                        src={item.path}
                                        alt={index + `image`}
                                        className={classes.image}
                                        style={{
                                            cursor: params.readOnly ? 'default' : 'pointer',
                                            width: cellImageSizes[params?.imageSize]?.width,
                                            height: cellImageSizes[params?.imageSize]?.height
                                        }}
                                        onLoad={() => {
                                            setImageload(true);
                                        }}
                                    />
                                    {!params.readOnly && imageload && (
                                        <GetAppIcon
                                            onClick={(e) => download_file(e, item)}
                                            className={classes.downloadIcon}
                                        />
                                    )}
                                </div>
                                {imageload && !params.readOnly && (
                                    <CloseIcon
                                        onClick={(e) => remove_file(e, item.filename, index)}
                                        className={classes.closeIcon}
                                    />
                                )}
                            </div>
                        ))}
                        {files.length > 3 ? (
                            <div
                                onClick={() => {
                                    setExpand((s) => !s);
                                }}
                                className={classes.extraFiles}
                            >
                                <Typography>{expand ? '-' : `+${files.length - 3}`}</Typography>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </Grid>
        </ThemeProvider>
    );
}

export default FileUploadCell;
