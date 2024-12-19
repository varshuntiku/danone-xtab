import React, { useEffect, useState } from 'react';
import { makeStyles, Button, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios';
import ClearAllOutlinedIcon from '@material-ui/icons/ClearAllOutlined';
import ReplayOutlined from '@material-ui/icons/ReplayOutlined';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import TextField from '@material-ui/core/TextField';
import ImageCarousel from './ImageCarousel';
import AdvancedSettings from './AdvanceSettings';
import ImageOutlined from '@material-ui/icons/ImageOutlined';
import ArrowBack from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForward from '@material-ui/icons/ArrowForwardIosOutlined';
import SearchBackground from 'assets/img/productsBackground.png';
import Instructions from './Instructions';
import { triggerWidgetActionHandler } from 'services/widget.js';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    uploadButton: {
        background: theme.palette.background.default,
        opacity: 0,
        cursor: 'pointer',
        position: 'absolute',
        width: '15rem',
        height: '5rem'
    },
    customButton: {
        display: 'inline-block',
        cursor: 'pointer'
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: '2rem',
        width: '50%',
        border: `1px solid ${theme.palette.text.default}40`,
        padding: '1rem',
        borderRadius: '2px'
    },
    clearIcon: {
        width: '3rem',
        height: '3rem',
        cursor: 'pointer'
    },
    imageOutlined: {
        width: '3rem',
        minHeight: '30vh',
        display: 'flex',
        justifyContent: 'center'
    },
    buttonsContainer: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    inputContainer: {
        display: 'inline-block',
        cursor: 'pointer'
    },
    coordinateAnimation: {
        opacity: 1,
        animation: '$coordinateAnimation 2s  infinite',
        transition: 'transform 0.5s',
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderBottom: '14px solid green'
    },
    '@keyframes coordinateAnimation': {
        '0%': {
            transform: 'scale(0.7)'
        },
        '50%': {
            transform: 'scale(1)'
        },
        '100%': {
            transform: 'scale(0.7)'
        }
    },
    tooltip: {
        fontSize: '1.5rem'
    },
    mainContainer: {
        display: 'flex',
        gap: '1rem',
        height: '100%',
        backgroundImage: `url(${SearchBackground})`
    },
    separator: {
        width: '2px',
        height: '100%',
        background: `${theme.palette.text.default}30`
    },
    separatorHorizontal: {
        width: '100%',
        height: '2px',
        background: `${theme.palette.text.default}30`
    },
    button: {
        '& svg': {
            fontSize: 16
        },
        marginLeft: '20%',
        width: '50%'
    },
    AnalyseButton: {
        '& svg': {
            fontSize: 16
        },
        marginLeft: '3%',
        width: '50%'
    },
    wrapFormVertical: {
        display: 'flex',
        justifyContent: 'center',
        width: '95%',
        margin: `${theme.spacing(2)} auto`,
        flexDirection: 'column',
        gap: '1rem',
        marginTop: 0
    },
    wrapForm: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: `${theme.spacing(2)} auto`,
        borderRadius: 2,
        outline: 0
    },
    wrapText: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: 'transparent'
            }
        },
        '& .MuiOutlinedInput-root:hover': {
            '& > fieldset': {
                borderColor: 'transparent'
            }
        }
    },
    inlineTextEdit: {
        width: '300px',
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.contrastText
            }
        },
        '& .MuiOutlinedInput-root:hover': {
            '& > fieldset': {
                borderColor: theme.palette.primary.contrastText
            }
        }
    },
    textInput: {
        color: theme.palette.text.default,
        fontSize: '1.75rem',
        border: `1px solid ${theme.palette.text.default}80`,
        borderRadius: 2,
        padding: '2rem',
        '& .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${theme.palette.text.default}80`
        }
    },
    infoButton: {
        '& svg': {
            fontSize: 12
        },
        marginLeft: '1.3rem',
        float: 'left'
    },
    outputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'fit-content',
        flexDirection: 'column',
        gap: '2rem',
        width: '50%',
        border: `1px solid ${theme.palette.text.default}40`,
        padding: '1rem',
        borderRadius: '2px'
    },
    loaderHolder: {
        height: '30vh',
        display: 'flex',
        alignItems: 'center'
    },
    outputHeader: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h2.fontFamily,
        color: theme.palette.text.default,
        float: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '2rem'
    },
    arrowIcon: {
        width: '3rem',
        height: '3rem',
        cursor: 'pointer'
    },
    textHeader: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h2.fontFamily,
        color: theme.palette.text.default,
        float: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '2rem'
    },
    imageContainer: {
        position: 'relative',
        display: 'block',
        cursor: 'pointer',
        marginBottom: '4rem',
        minHeight: '10vh'
    },
    imageHolder: { display: 'block', width: '100%', height: '100%' }
}));

export default function UploadImage(params) {
    const classes = useStyles();
    const [mainSrc, setMainSrc] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [maskimageSrc, setMaskImageSrc] = useState(null);
    const [outputgenerationMask, setOutputGenerationMask] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [loader, setLoader] = useState(false);
    const [outputLoader, setOutputLoader] = useState(false);
    const [input, setInput] = useState('');
    const [prompt1, setPrompt1] = useState('');
    const [prompt2, setPrompt2] = useState('');
    const [prompt3, setPrompt3] = useState('');
    const [templateIndex, setTemplateIndex] = useState(0);
    const [outIndex, setOutIndex] = useState(0);
    const [outBannerIndex, setOutBannerIndex] = useState(0);
    const [output, setOutput] = useState([]);
    const [bannerOutput, setBannerOutput] = useState([]);
    const [negativePrompt, setNegativePrompt] = useState(null);
    const [gs, setGs] = useState(10);
    const [steps, setSteps] = useState(30);
    const [ccs, setCcs] = useState(0.5);
    const [outputIndex, setOutputIndex] = useState(0);
    const [resizeParam, setResizeParam] = useState(1);
    const [resizeParamHeight, setResizeParamHeight] = useState(1);
    const [isAnalyseDisabled, setIsAnalyseDisabled] = useState(true);
    const [notificationOpen, setnotificationOpen] = useState(false);
    const [notification, setnotification] = useState({});

    useEffect(() => {
        const img = document.getElementById('imageSrc');
        if (img) {
            const resizeRatio = img.naturalWidth / img.offsetWidth;
            const resizeRatioHeight = img.naturalHeight / img.offsetHeight;
            setResizeParam(resizeRatio);
            setResizeParamHeight(resizeRatioHeight);
        }
    }, [mainSrc]);
    const handleImageUpload = (event) => {
        coordinates && setCoordinates(null);
        if (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMainSrc(reader.result.split(',')[1]);

                    setImageSrc(reader.result.split(',')[1]);
                };
                reader.readAsDataURL(file);
            }
        }
        event.target.value = '';
    };

    const handleUndo = async () => {
        setOutput([]);
        setBannerOutput([]);
        setLoader(true);
        let newCoordinates = [...coordinates];
        newCoordinates.pop();
        setCoordinates(newCoordinates);
        if (newCoordinates.length > 0) {
            const body = {
                input_img: mainSrc,
                point_coords: [
                    [
                        Math.round(newCoordinates[newCoordinates.length - 1]['x'] * resizeParam),
                        Math.round(
                            newCoordinates[newCoordinates.length - 1]['y'] * resizeParamHeight
                        )
                    ]
                ]
            };
            await axios
                .post(params.params.mask_url, body)
                .then((result) => {
                    setImageSrc(
                        result.data?.colored_base64_image || result.data.normal_base64_image
                    );
                    setOutputGenerationMask(result.data?.inv_base64_image);
                    setMaskImageSrc(result.data.normal_base64_image);
                    setLoader(false);
                })
                .catch(() => {
                    setLoader(false);
                });
        } else {
            setImageSrc(mainSrc);
            setMaskImageSrc(null);
            setLoader(false);
        }
    };

    const buttonClick = () => {
        document.getElementById('fileInput').click();
    };

    const getPointCords = (x, y) => {
        if (!resizeParam || isNaN(resizeParam)) {
            const img = document.getElementById('imageSrc');
            const resizeRatio = img.naturalWidth / img.offsetWidth;
            const resizeRatioHeight = img.naturalHeight / img.offsetHeight;
            return [Math.round(x * resizeRatio), Math.round(y * resizeRatioHeight)];
        }
        return [Math.round(x * resizeParam), Math.round(y * resizeParamHeight)];
    };
    const handleMouseMove = async (event) => {
        setOutput([]);
        setBannerOutput([]);
        setLoader(true);
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let newCoordinates = coordinates ? [...coordinates] : [];
        newCoordinates.push({ x, y });
        setCoordinates(newCoordinates);
        const body = {
            input_img: mainSrc,
            point_coords: [getPointCords(x, y)]
        };
        await axios
            .post(params.params.mask_url, body)
            .then((result) => {
                setImageSrc(result.data?.colored_base64_image || result.data.normal_base64_image);
                setMaskImageSrc(
                    result.data?.colored_base64_image || result.data.normal_base64_image
                );
                setOutputGenerationMask(result.data?.inv_base64_image);
                setLoader(false);
            })
            .catch(() => {
                setLoader(false);
            });
    };
    const onClear = () => {
        setImageSrc(null);
        setMainSrc(null);
        setOutput([]);
        setBannerOutput([]);
        setMaskImageSrc(null);
    };

    const handleInputChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleTemplatePrompt = (e, type) => {
        e.preventDefault();
        switch (type) {
            case 'prompt1':
                setPrompt1(e.target.value);
                break;
            case 'prompt2':
                setPrompt2(e.target.value);
                break;
            case 'prompt3':
                setPrompt3(e.target.value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (output.length != 0 && output.length < 3) {
            handleRunClick();
        }
        if (output.length >= 1) {
            setIsAnalyseDisabled(false);
        } else {
            setIsAnalyseDisabled(true);
        }
    }, [output]);

    const handleRunClick = async () => {
        if (output.length < 2 && !outputLoader) {
            setOutputLoader(true);
        } else {
            setOutputLoader(false);
        }
        let reqJson = {
            prompt: input,
            image_path: mainSrc,
            neg_prompt:
                negativePrompt ||
                'blurry, bad anatomy, bad hands, three hands, three legs, bad arms, missing legs, missing arms, poorly drawn face, bad face, fused face, cloned face, worst face, three crus, extra crus, fused crus, worst feet, three feet, fused feet, fused thigh, three thigh, fused thigh, extra thigh, worst thigh, missing fingers, extra fingers, ugly fingers, long fingers, horn, extra eyes, huge eyes, 2girl, amputation, disconnected limbs, cartoon, cg, 3d, unreal, animate.',
            inf: steps,
            gui: gs,
            ccs: ccs,
            mask_image_base64: outputgenerationMask,
            prompt1: prompt1,
            prompt2: prompt2,
            prompt3: prompt3,
            templateIndex: templateIndex
        };
        await axios
            .post(params.params.generation_url, reqJson)
            .then((result) => {
                let newOutput = [...output];
                newOutput.push(result.data.base64_image);
                setOutput(newOutput);
                let newBannerOutput = [...bannerOutput];
                newBannerOutput.push(result.data?.banner_base64_image || result.data.base64_image);
                setBannerOutput(newBannerOutput);
            })

            .catch(() => {});
    };

    const handleArrowClick = () => {
        outputIndex == 0 ? setOutputIndex(1) : setOutputIndex(0);
    };

    const handleAnalyse = () => {
        try {
            triggerWidgetActionHandler({
                screen_id: params.app_details.screen_id,
                app_id: params.app_details.app_id,
                payload: {
                    widget_value_id: params.app_details.widget_value_id,
                    action_type: 'Analyse',
                    data: {
                        banner_output: bannerOutput[outBannerIndex]
                    },
                    filters: JSON.parse(
                        sessionStorage.getItem(
                            'app_screen_filter_info_' +
                                params.app_details.app_id +
                                '_' +
                                params.app_details.screen_id
                        )
                    )
                },
                callback: () => {
                    setnotificationOpen(true),
                        setnotification({
                            message: 'Action triggered successfully!',
                            severity: 'success'
                        });
                }
            });
        } catch (err) {
            setnotificationOpen(true),
                setnotification({
                    message: 'Action triggered failed!',
                    severity: 'error'
                });
        }
    };

    const isValidBase64Image = (data) => {
        return /^data:image\/(jpeg|jpg|png|gif);base64,[A-Za-z0-9+/=]+$/.test(data);
    };

    return (
        <>
            <Instructions />
            <div className={classes.mainContainer}>
                <div className={classes.buttonContainer}>
                    <Typography className={classes.textHeader}>
                        {params?.params?.input_title || 'Input Image'}
                    </Typography>
                    <div className={classes.imageContainer}>
                        {imageSrc &&
                            (loader ? (
                                <div className={classes.loaderHolder}>
                                    {' '}
                                    <CodxCircularLoader center size={50} />{' '}
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={
                                            isValidBase64Image(
                                                `data:image/jpg;base64,${sanitizeHtml(imageSrc)}`
                                            )
                                                ? `data:image/jpg;base64,${sanitizeHtml(imageSrc)}`
                                                : ''
                                        }
                                        alt="Uploaded"
                                        onClick={handleMouseMove}
                                        className={classes.imageHolder}
                                        id="imageSrc"
                                    />
                                    {/* {coordinates &&
                                        coordinates.map((val, index) => (
                                            <span
                                                key={`coordinate${index}`}
                                                className={classes.coordinateAnimation}
                                                style={{ left: val?.x, top: val?.y }}
                                            ></span>
                                        ))} -*/}
                                </>
                            ))}
                    </div>
                    <div className={classes.buttonsContainer}>
                        <div className={classes.inputContainer}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={classes.uploadButton}
                                id="fileInput"
                            />
                            <Button
                                className={classes.customButton}
                                onClick={buttonClick}
                                variant="contained"
                            >
                                Upload Image
                            </Button>
                        </div>
                        <Tooltip
                            title="ClearImage"
                            placement="top"
                            classes={{ tooltip: classes.tooltip }}
                        >
                            <ClearAllOutlinedIcon onClick={onClear} className={classes.clearIcon} />
                        </Tooltip>
                        {coordinates?.length ? (
                            <Tooltip
                                title="Undo Segmentation"
                                placement="top"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <ReplayOutlined
                                    className={classes.clearIcon}
                                    onClick={handleUndo}
                                />
                            </Tooltip>
                        ) : null}
                    </div>
                    <form
                        className={classes.wrapForm}
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <TextField
                            data-testid="outlined-basic"
                            className={classes.wrapText}
                            inputProps={{ className: classes.textInput }}
                            InputLabelProps={{ style: { fontSize: '2rem' } }}
                            variant="outlined"
                            onChange={handleInputChange}
                            defaultValue={''}
                            placeholder="Enter your prompt"
                            InputProps={{
                                classes: {
                                    root: classes.contrastColor,
                                    notchedOutline: classes.contrastColor
                                }
                            }}
                            id="comment"
                        />
                    </form>
                    <AdvancedSettings
                        setCcs={setCcs}
                        setGs={setGs}
                        setSteps={setSteps}
                        setNegativePrompt={setNegativePrompt}
                    />
                </div>
                <div className={classes.separator}> </div>
                <div className={classes.buttonContainer}>
                    <Typography className={classes.textHeader}>
                        {params?.params?.template_title || 'Input Templates'}
                    </Typography>
                    <ImageCarousel
                        images={params.params.template_images}
                        index={templateIndex}
                        setIndex={setTemplateIndex}
                    />
                    {/* <div className={classes.separatorHorizontal}></div> */}
                    <form
                        className={classes.wrapFormVertical}
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <TextField
                            data-testid="outlined-basic"
                            className={classes.wrapText}
                            inputProps={{ className: classes.textInput }}
                            InputLabelProps={{ style: { fontSize: '2rem' } }}
                            variant="outlined"
                            onChange={(e) => handleTemplatePrompt(e, 'prompt1')}
                            defaultValue={''}
                            placeholder="eg:Low prices?love it! (or) Light Up"
                            InputProps={{
                                classes: {
                                    root: classes.contrastColor,
                                    notchedOutline: classes.contrastColor
                                }
                            }}
                            id="comment"
                        />
                        <TextField
                            data-testid="outlined-basic"
                            className={classes.wrapText}
                            inputProps={{ className: classes.textInput }}
                            InputLabelProps={{ style: { fontSize: '2rem' } }}
                            variant="outlined"
                            onChange={(e) => handleTemplatePrompt(e, 'prompt2')}
                            defaultValue={''}
                            placeholder="eg:Spring break; word limit:2 (or) Your home"
                            InputProps={{
                                classes: {
                                    root: classes.contrastColor,
                                    notchedOutline: classes.contrastColor
                                }
                            }}
                            id="comment"
                        />
                        <TextField
                            data-testid="outlined-basic"
                            className={classes.wrapText}
                            inputProps={{ className: classes.textInput }}
                            InputLabelProps={{ style: { fontSize: '2rem' } }}
                            variant="outlined"
                            onChange={(e) => handleTemplatePrompt(e, 'prompt3')}
                            defaultValue={''}
                            placeholder="eg:7 (or) Up to 25% off Sale"
                            InputProps={{
                                classes: {
                                    root: classes.contrastColor,
                                    notchedOutline: classes.contrastColor
                                }
                            }}
                            id="comment"
                        />
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            onClick={handleRunClick}
                            disabled={!input?.length || maskimageSrc == null}
                            title="sendbutton"
                            aria-label="sendbutton"
                        >
                            Run
                        </Button>
                    </form>
                </div>
                <div className={classes.separator}> </div>
                <div className={classes.outputContainer}>
                    <Typography className={classes.outputHeader}>
                        <ArrowBack onClick={handleArrowClick} className={classes.arrowIcon} />
                        {outputIndex == 0
                            ? params?.params?.output_title?.[0] || 'Inpaint Output'
                            : params?.params?.output_title?.[1] || 'Banner Output'}
                        <ArrowForward onClick={handleArrowClick} className={classes.arrowIcon} />
                    </Typography>
                    {outputLoader ? (
                        <div className={classes.loaderHolder}>
                            <CodxCircularLoader size={30} />
                        </div>
                    ) : output.length > 0 ? (
                        <ImageCarousel
                            images={outputIndex == 0 ? output : bannerOutput}
                            index={outputIndex == 0 ? outIndex : outBannerIndex}
                            setIndex={outputIndex == 0 ? setOutIndex : setOutBannerIndex}
                            base64={true}
                            output={true}
                        />
                    ) : (
                        <ImageOutlined className={classes.imageOutlined} />
                    )}
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.AnalyseButton}
                        onClick={handleAnalyse}
                        disabled={isAnalyseDisabled}
                        title="analysebutton"
                        aria-label="analysebutton"
                    >
                        Analyse
                    </Button>
                </div>
                <CustomSnackbar
                    key="app-admin-screen-notification-container"
                    open={notificationOpen && notification?.message ? true : false}
                    autoHideDuration={3000}
                    onClose={() => setnotificationOpen(false)}
                    severity={notification?.severity || 'success'}
                    message={notification?.message}
                />
            </div>
        </>
    );
}
