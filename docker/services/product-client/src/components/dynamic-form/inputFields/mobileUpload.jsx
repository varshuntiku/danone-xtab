import React, { useEffect, useState } from 'react';
import { Button, Drawer, IconButton, List, ListItem, alpha, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DynamicForm, { mapValue } from '../dynamic-form';
import { upload_file } from '../../../common/utils';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LinearProgressBar from 'components/LinearProgressBar';
import { setDirectoryData } from 'store/index';
import { useDispatch } from 'react-redux';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CancelIcon from '@material-ui/icons/Cancel';

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

const useStyles = makeStyles((theme) => ({
    uploadContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem'
    },
    drawerTrigger: {
        width: 'calc(100vw - 30rem)',
        height: 'auto',
        fontSize: '1.9rem',
        padding: '1.5rem 2rem',
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    drawerCloseBtn: {
        display: 'flex',
        justifyContent: 'center',
        '& .MuiIconButton-root': {
            padding: '1.5rem',
            marginRight: '0rem'
        }
    },
    icon: {
        fontSize: '5rem'
    },
    drawerList: {
        justifyContent: 'center',
        '& label': {
            '& .MuiButton-root': {
                width: '50rem',
                height: '7rem',
                '& .MuiButton-label': {
                    fontSize: '1.5rem',
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '1.8rem'
                    },
                    [theme.breakpoints.down('xs')]: {
                        fontSize: '2.2rem'
                    }
                }
            }
        }
    },
    stepContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1.6, 5),
        height: '70vh',
        flexDirection: 'column',
        alignItems: 'center',
        gridGap: '1.5rem',
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    imgContainer: {
        height: '100%',
        width: '100%',
        padding: '0rem 1rem 1rem 0rem',
        // for multiple image navigation
        display: 'flex',
        flexDirection: 'column',
        gridGap: '2.5rem',
        overflow: 'auto',
        alignItems: 'center'
    },
    imageGrid: {
        gap: '1rem',
        display: 'flex',
        height: '100%',
        paddingTop: '1.5rem',
        position: 'relative',
        width: '75rem'
    },
    previewImage: {
        objectFit: 'cover',
        width: '100%',
        height: `var(--previewHeight, '100%')`,
        borderRadius: '3px',

        flex: 1,
        overflow: 'hidden'
    },
    imgNavigator: {
        justifyContent: 'space-between'
    },
    uploadBtn: {
        width: '50rem',
        height: '7rem',
        fontSize: '1.9rem',
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    list: {
        width: 250
    },
    fullList: {
        width: 'auto'
    },
    uploadResponse: {
        height: '100%',
        width: '75rem',
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiSvgIcon-root': {
            width: '20rem',
            height: '50%'
        }
    },
    btnGroup: {
        '& .MuiButtonGroup-groupedVertical:not(:last-child)': {
            borderRadius: '0.5rem'
        }
    },
    homeBtn: {
        width: '30rem',
        height: '7rem',
        fontSize: '1.9rem',
        '& .MuiButton-label': {
            fontSize: '1.5rem',
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.8rem'
            },
            [theme.breakpoints.down('xs')]: {
                fontSize: '2.2rem'
            }
        }
    },
    uploadSucess: {
        color: '#27AE60'
    },
    uploadError: {
        color: '#ff655a'
    },
    removeFile: {
        position: 'absolute',
        right: '-3rem',
        top: '-1.5rem',
        width: 'min-content',
        padding: '1rem',
        '& .MuiIconButton-label svg': {
            fontSize: '4.5rem',
            color: alpha(theme.palette.text.default, '0.65')
        }
    },
    imageContainerAction: {
        display: 'flex',
        gap: '2rem',
        justifyContent: 'space-evenly',
        width: '100%',
        padding: '0 4rem'
    },
    btnIcon: {
        color: theme.palette.text.contrastText
    }
}));

export default function MobileUpload({ params, onChange, onUpload, app_id, onFetchFormData }) {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filesList, setFilesList] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [blobFiles, setBlobFiles] = useState(params.value || []);
    const [activeStep, setActiveStep] = useState(0);
    const [fileForm, setFileForm] = useState(deepClone(params?.form_config) || false);
    const [error, setError] = useState(false);
    const [key, setKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (drawerOpen) {
            setFileForm(deepClone(params?.form_config));
        }
    }, [drawerOpen]);

    const updateFormState = React.useCallback((d) => {
        if (d?.form_config) {
            setFileForm(deepClone(d?.form_config));
            setLoading(false);
            setKey((s) => s + 1);
        }
    }, []);

    const handleInputChange = (event) => {
        event.preventDefault();
        let inputFiles = event.target.files;

        let newFiles = [];
        for (let file of inputFiles) {
            const fileItem = {
                file: file,
                previewUrl: URL.createObjectURL(file)
            };
            newFiles.push(fileItem);
        }

        setFilesList(params?.multiple ? [...filesList, ...newFiles] : newFiles);
        setActiveStep(1);
    };

    const uploadClickHandler = (el) => {
        filesList.map((item) => {
            if (item.previewUrl) {
                window.URL.revokeObjectURL(item.previewUrl);
                delete item.previewUrl;
            }
        });
        if (fileForm) {
            setActiveStep(2);
        } else {
            const fileItems = filesList.flatMap((item) => item.file);

            Promise.all(fileItems.map((item) => uploadFile(item, false)))
                .then((values) => {
                    setBlobFiles(values);
                    onChange(values);
                    onUpload(el);
                    setActiveStep(3);
                })
                .catch((error) => {
                    setError(error.message);
                    setActiveStep(3);
                });
        }
    };

    const formActionHandler = async (el) => {
        let customBlobPath = false;

        if (params.custom_blob_path) {
            customBlobPath = prepareBlobPath(fileForm.fields, params);
        }

        const fileItems = filesList.flatMap((item) => item.file);

        Promise.all(fileItems.map((item) => uploadFile(item, { filePath: customBlobPath })))
            .then(async (values) => {
                setBlobFiles(values);
                onChange(values);
                if (params.save_image_data) {
                    await onUpload(el);
                }
                setActiveStep(3);
                if (params?.update_directory) {
                    dispatch(
                        setDirectoryData({
                            updatedStorageUrl:
                                params?.dynamic_storage['BLOB_ROOT_URL'] +
                                params?.dynamic_storage['CONTAINER']
                        })
                    );
                }
            })
            .catch((error) => {
                setError(error.message);
                setActiveStep(3);
            });
    };

    const uploadFile = async (file, fileInfo) => {
        let uploadParams = {};
        if (params.dynamic_storage && app_id) {
            uploadParams['dynamic_storage'] = params.dynamic_storage;
            uploadParams['app_id'] = app_id;
        }
        uploadParams = {
            ...uploadParams,
            ...(params.blobIncludeTimeStamp && { blobIncludeTimeStamp: true }),
            ...(fileInfo.filePath && { file_path: fileInfo.filePath })
        };
        try {
            setLoading(true);
            const res = await upload_file(file, false, uploadParams);
            if (!res.error) {
                setLoading(false);
                const newFiles = res?.data;
                return newFiles;
            } else {
                setLoading(false);
                setError(res.error);
            }
        } catch (err) {
            setError(err);
        }
    };

    const fileFormChangeHandler = (formItems) => {
        setFileForm(formItems);
    };

    const handleFormValidation = async (action) => {
        const d = mapValue(fileForm?.fields);
        onChange(d);
        setLoading(true);
        const res = await onFetchFormData(action);
        updateFormState(res);
    };

    const closeDrawerHandler = () => {
        setActiveStep(0);
        setBlobFiles([]);
        setFilesList([]);
        setFileForm(params?.form_config);
        setError(false);
        setLoading(false);
        setDrawerOpen(false);
    };

    const fileRemoveHandler = (item, id) => {
        const updatedFiles = filesList.filter((element) => element.previewUrl !== item.previewUrl);
        const removedFile = filesList[id];
        window.URL.revokeObjectURL(removedFile.previewUrl);
        setFilesList(updatedFiles);
    };

    return (
        <div className={classes.uploadContainer}>
            <Button
                onClick={() => {
                    setDrawerOpen(true);
                }}
                variant="contained"
                className={classes.drawerTrigger}
                size="small"
            >
                {params.label}
            </Button>
            {drawerOpen && (
                <Drawer
                    anchor={params.anchor}
                    open={drawerOpen}
                    onClose={closeDrawerHandler}
                    onOpen={() => setDrawerOpen(true)}
                >
                    <div
                        className={clsx(classes.list, {
                            [classes.fullList]:
                                params.anchor === 'top' || params.anchor === 'bottom'
                        })}
                        role="presentation"
                    >
                        {loading && <LinearProgressBar />}
                        <div className={classes.drawerCloseBtn}>
                            <IconButton onClick={closeDrawerHandler}>
                                <KeyboardArrowDownIcon className={classes.icon} />
                            </IconButton>
                        </div>
                        {activeStep === 0 && (
                            <List>
                                <ListItem className={classes.drawerList}>
                                    <input
                                        className={classes.input}
                                        id="contained-button-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleInputChange}
                                        multiple={params.multiple}
                                        accept={params.accept}
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button variant="contained" component="span" size="small">
                                            Upload from Gallery
                                        </Button>
                                    </label>
                                </ListItem>
                            </List>
                        )}
                        {activeStep === 1 && (
                            <div className={classes.stepContainer}>
                                <div className={classes.imgContainer}>
                                    {filesList.map((item, id) => (
                                        <div key={item.file.name} className={classes.imageGrid}>
                                            <img
                                                src={item['previewUrl']}
                                                className={classes.previewImage}
                                                style={{
                                                    '--previewHeight': params.multiple
                                                        ? '50rem'
                                                        : ''
                                                }}
                                            />
                                            {params?.multiple && (
                                                <IconButton
                                                    className={classes.removeFile}
                                                    onClick={() => fileRemoveHandler(item, id)}
                                                >
                                                    <CancelIcon fontSize="large" />
                                                </IconButton>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className={classes.imageContainerAction}>
                                    {params?.multiple && (
                                        <React.Fragment>
                                            <input
                                                className={classes.input}
                                                id="contained-button-file"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={handleInputChange}
                                                multiple={params.multiple}
                                                accept={params.accept}
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Button
                                                    component="span"
                                                    variant="outlined"
                                                    startIcon={
                                                        <AddPhotoAlternateIcon
                                                            fontSize="small"
                                                            className={classes.btnIcon}
                                                        />
                                                    }
                                                    size="small"
                                                >
                                                    Add more
                                                </Button>
                                            </label>
                                        </React.Fragment>
                                    )}
                                    <Button
                                        variant="contained"
                                        onClick={uploadClickHandler}
                                        disabled={filesList.length === 0}
                                        size="small"
                                        style={{ flex: 1 }}
                                    >
                                        {fileForm ? 'Next' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {activeStep === 2 && (
                            <div className={classes.stepContainer}>
                                <DynamicForm
                                    key={key}
                                    params={fileForm}
                                    onChange={fileFormChangeHandler}
                                    onClickActionButton={formActionHandler}
                                    onValidation={handleFormValidation}
                                />
                            </div>
                        )}
                        {activeStep === 3 && (
                            <div className={classes.stepContainer}>
                                <div className={classes.uploadResponse}>
                                    {!error ? (
                                        <CheckCircleOutlineIcon
                                            className={classes.uploadSucess}
                                            fontSize="large"
                                        />
                                    ) : (
                                        <ErrorOutlineIcon className={classes.uploadError} />
                                    )}
                                </div>
                                <Button
                                    variant="contained"
                                    onClick={closeDrawerHandler}
                                    className={classes.homeBtn}
                                    size="small"
                                >
                                    Ok
                                </Button>
                            </div>
                        )}
                    </div>
                </Drawer>
            )}
        </div>
    );
}

const prepareBlobPath = (formData, params) => {
    let blobPath = '';
    if (params.blob_path_prefix) {
        blobPath += params.blob_path_prefix + '/';
    }
    formData.forEach((item) => {
        if (typeof item.value === 'string') {
            blobPath += item.value + '/';
        }
    });
    if (params.blob_include_user_info) {
        const userId = sessionStorage.getItem('user_email');
        blobPath += userId + '/';
    }
    return blobPath;
};
