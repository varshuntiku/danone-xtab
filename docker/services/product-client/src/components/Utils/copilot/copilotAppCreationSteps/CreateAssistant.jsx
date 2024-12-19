import React, { useEffect, useRef, useState } from 'react';
import {
    // Checkbox,
    // FormControl,
    // FormControlLabel,
    IconButton,
    // Link,
    // MenuItem,
    // Select,
    TextField,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import { grey } from '@material-ui/core/colors';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { defaultLLMModelName, defaultTTSModelName } from '../util';
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(20.74),
        margin: theme.layoutSpacing(20.74, 0),
        marginRight: theme.layoutSpacing(103.7),
        marginTop: theme.layoutSpacing(83)
    },
    imageUpload: {
        width: theme.layoutSpacing(103.7),
        height: theme.layoutSpacing(103.7),
        border: `1px solid ${alpha(theme.palette.text.default, 0.2)}`,
        borderRadius: '4px',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '& img': {
            position: 'absolute',
            left: '0',
            top: 0,
            height: '100%',
            width: '100%',
            objectFit: 'cover'
            // padding: theme.layoutSpacing(4)
        },
        '& button': {
            margin: 0
        },
        '& svg': {
            color: alpha(theme.palette.primary.contrastText, 0.4),
            width: theme.layoutSpacing(41.5),
            height: theme.layoutSpacing(41.5)
        },
        '& #removeAvatar': {
            opacity: 0
        },
        '&:hover': {
            '& #removeAvatar': {
                opacity: 1
            }
        }
    },
    imageBg: {
        background: '#cdddf3'
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: '0',
        margin: 0,
        padding: 0,
        '& svg': {
            color: grey[700],
            width: theme.layoutSpacing(20),
            height: theme.layoutSpacing(20)
        }
    },
    additionalSettingsTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(10.37),
        cursor: 'pointer',
        '& $title1': {
            textDecoration: 'underline'
        },
        '& svg': {
            fontSize: theme.layoutSpacing(31.104)
        },
        marginLeft: theme.layoutSpacing(-8.2944)
    }
}));

export default function CreateAssistant({
    appData,
    llmModels,
    textToSpeechModels,
    onChange,
    onAvatarChange
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    // const [additionalSettingOpen, setAdditionalSettingOpen] = useState(false);

    useEffect(() => {
        if (!appData?.config?.lang_model) {
            const defaultLLMModelIndex = llmModels?.findIndex(
                (model) => model.name === defaultLLMModelName
            );
            if (defaultLLMModelIndex !== -1) {
                const data = {
                    ...appData,
                    config: {
                        ...appData.config,
                        lang_model: llmModels[defaultLLMModelIndex].id
                    }
                };
                onChange(data);
            } else {
                const data = {
                    ...appData,
                    config: {
                        ...appData.config,
                        lang_model: llmModels[0]?.id
                    }
                };
                onChange(data);
            }
        }
    }, [llmModels]);

    useEffect(() => {
        if (!appData?.config?.text_to_speech_model) {
            const textToSpeechModelIndex = textToSpeechModels?.findIndex(
                (model) => model.name === defaultTTSModelName
            );
            const text_to_speech_model =
                textToSpeechModelIndex > -1
                    ? textToSpeechModels[textToSpeechModelIndex].id
                    : textToSpeechModels[0]?.id;
            const data = {
                ...appData,
                config: {
                    ...appData.config,
                    text_to_speech_model: text_to_speech_model
                }
            };
            onChange(data);
        }
    }, [textToSpeechModels]);

    const handleConfigChange = (event) => {
        const data = {
            ...appData,
            config: {
                ...appData.config,
                [event.target.name]:
                    event.target.type === 'checkbox' ? event.target.checked : event.target.value
            }
        };
        onChange(data);
    };
    return (
        <div className={classes.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Typography variant="subtitle1" className={configClasses.title2}>
                        Add Avatar
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        className={configClasses.typography}
                        gutterBottom
                    >
                        Personalize your assistant by giving it an avatar.
                    </Typography>
                    <Typography variant="subtitle2" className={configClasses.typography}>
                        Allowed file formats - jpg, png or gif.
                    </Typography>
                </div>
                <div>
                    <ImageUpload
                        classes={classes}
                        onChange={onAvatarChange}
                        imgSource={appData.config?.avatar_url}
                    />
                </div>
            </div>
            <div>
                <Typography variant="subtitle1" className={configClasses.inputLabel}>
                    Give an Identity to your Assistant
                </Typography>
                <TextField
                    classes={{ root: configClasses.formControl }}
                    size="small"
                    label=""
                    fullWidth
                    variant="outlined"
                    name="identity"
                    value={appData.config.identity}
                    onChange={handleConfigChange}
                    placeholder="Ask NucliOS"
                />
            </div>
            {/* <div>
                <Typography variant="subtitle1" className={configClasses.inputLabel}>
                    Copilot Persona
                </Typography>
                <FormControl
                    size="small"
                    variant="outlined"
                    className={configClasses.formControl}
                    fullWidth
                >
                    <Select
                        size="small"
                        name="persona"
                        value={appData.config.persona || []}
                        onChange={handleConfigChange}
                        fullWidth
                        MenuProps={{
                            MenuListProps: {
                                classes: {
                                    root: configClasses.inputDropdownSelect
                                }
                            }
                        }}
                        displayEmpty={true}
                        renderValue={(value) =>
                            value.length !== 0 ? value : 'Select Persona'
                        }
                    >
                        <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                        <MenuItem value="Data Scientist Manager">Data Scientist Manager</MenuItem>
                    </Select>
                </FormControl>
            </div> */}
            {/* <div
                className={classes.additionalSettingsTitle}
                onClick={() => setAdditionalSettingOpen((s) => !s)}
            >
                {additionalSettingOpen ? (
                    <KeyboardArrowDownIcon fontSize="large" />
                ) : (
                    <ChevronRightIcon fontSize="large" />
                )}
                <Link>
                    <Typography variant="subtitle1" className={configClasses.linkActionButton}>
                        Additional Settings
                    </Typography>
                </Link>
            </div> */}
            {/* {additionalSettingOpen ? (
                <>
                    <div>
                        <Typography variant="subtitle1" className={configClasses.title2}>
                            Capabilities
                        </Typography>
                        <FormControlLabel
                            className={configClasses.formControlLabel}
                            control={
                                <Checkbox
                                    name="capabilities"
                                    value={appData.config.capabilities}
                                    onChange={handleConfigChange}
                                    size="large"
                                />
                            }
                            label="Conversation context and memory"
                        />
                    </div>
                </>
            ) : null} */}
        </div>
    );
}

function ImageUpload({ imgSource, classes, onChange }) {
    const inputRef = useRef();
    const [imageSrc, setImageSrc] = useState(imgSource);
    const [, setFile] = useState();
    const handleUploadButtonClick = () => {
        inputRef.current.click();
    };
    const displayImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            setFile(file);
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
            onChange(file);
        }
    };

    const handleRemoveLink = () => {
        onChange(null);
        setImageSrc(null);
    };
    return (
        <div
            className={imageSrc ? clsx(classes.imageUpload, classes.imageBg) : classes.imageUpload}
        >
            {imageSrc ? <img src={imageSrc} /> : null}
            <input
                type="file"
                ref={inputRef}
                onChange={displayImagePreview}
                id="uploadInput"
                style={{ display: 'none' }}
                accept="image/*"
            />
            <IconButton
                id="uploadBtn"
                className={classes.uploadButton}
                onClick={handleUploadButtonClick}
                style={{
                    ...(imageSrc ? { display: 'none' } : {})
                }}
                title="Choose avatar"
            >
                <CameraAltOutlinedIcon fontSize="large" />
            </IconButton>
            {imageSrc ? (
                <IconButton
                    id="removeAvatar"
                    className={classes.removeButton}
                    onClick={handleRemoveLink}
                    title="delete"
                >
                    <DeleteOutlineOutlinedIcon fontSize="large" />
                </IconButton>
            ) : null}
        </div>
    );
}
