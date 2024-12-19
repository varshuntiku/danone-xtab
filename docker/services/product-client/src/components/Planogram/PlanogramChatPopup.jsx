import React, { useEffect } from 'react';
import {
    Dialog,
    IconButton,
    Typography,
    makeStyles,
    Grid,
    alpha,
    TextField,
    InputAdornment,
    Button
} from '@material-ui/core';
// import { IconButton, ListItemIcon, Typography, alpha } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SendIcon from '@material-ui/icons/Send';
import { grey } from '@material-ui/core/colors';

import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddIcon from '@material-ui/icons/Add';
import PlanogramFileUpload from './PlanogramFileUpload';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import MarkdownRenderer from '../MarkdownRenderer';
const useStyles = makeStyles((theme, themeMode = localStorage.getItem('codx-products-theme')) => ({
    dialogSize: {
        width: '50rem',
        height: '75rem',
        position: 'absolute',
        bottom: '15vh',
        right: '8.5rem',
        margin: '0',
        overflow: 'visible',
        overflowY: 'scroll'
    },
    root: {
        zIndex: '999999 !important',
        '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
    },
    button: {
        padding: '1.1rem 2.1rem;',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '44px',
        backdropFilter: 'blur(3px)',
        gap: '12px',
        zIndex: '20000',
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(120deg, rgba(69, 96, 215, 0.70) 0%, rgba(69, 96, 215, 0.14) 100%)'
                : 'linear-gradient(170deg, rgba(109, 240, 194, 0.90) 0%, rgba(109, 240, 194, 0.40) 100%)',
        boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.15)',
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7',
        textTransform: 'capitalize',
        animation: '$borderRotate 1.5s infinite linear, $rotate 2.5s infinite linear',
        border: '1px solid transparent',
        '& span': {
            fontSize: '2rem',
            letterSpacing: '1px',
            lineHeight: 'normal'
        },
        '& span div': {
            minWidth: 'unset'
        }
    },
    '@keyframes rotate': {
        '0%': {
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? 'linear-gradient(90deg, rgba(69, 96, 215, 0.70) 0%, rgba(69, 96, 215, 0.14) 100%)'
                    : 'linear-gradient(90deg, rgba(109, 240, 194, 0.90) 0%, rgba(109, 240, 194, 0.40) 100%)'
        },
        '50%': {
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? 'linear-gradient(180deg, rgba(69, 96, 215, 0.70) 0%, rgba(69, 96, 215, 0.14) 100%)'
                    : 'linear-gradient(180deg, rgba(109, 240, 194, 0.90) 0%, rgba(109, 240, 194, 0.40) 100%)'
        },
        '75%': {
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? 'linear-gradient(270deg, rgba(69, 96, 215, 0.70) 0%, rgba(69, 96, 215, 0.14) 100%)'
                    : 'linear-gradient(270deg, rgba(109, 240, 194, 0.90) 0%, rgba(109, 240, 194, 0.40) 100%)'
        },
        '100%': {
            background:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? 'linear-gradient(360deg, rgba(69, 96, 215, 0.70) 0%, rgba(69, 96, 215, 0.14) 100%)'
                    : 'linear-gradient(360deg, rgba(109, 240, 194, 0.90) 0%, rgba(109, 240, 194, 0.40) 100%)'
        }
    },
    '@keyframes borderRotate': {
        '0%': {
            borderTop:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '1px solid #6DF0C2'
                    : '1px solid #687EDD'
        },
        '50%': {
            borderRight:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '1px solid #6DF0C2'
                    : '1px solid #687EDD'
        },
        '75%': {
            borderBottom:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '1px solid #6DF0C2'
                    : '1px solid #687EDD'
        },
        '100%': {
            borderLeft:
                localStorage.getItem('codx-products-theme') === 'dark'
                    ? '1px solid #6DF0C2'
                    : '1px solid #687EDD'
        }
    },
    minervaLogo: {
        width: '1.9rem',
        height: '1.9rem',
        fill: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7',
        marginRight: '0.8rem'
    },
    chatBoxContainer: {
        height: '75rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'scroll'
    },
    chatHeader: {
        height: '11%',
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: `1px solid ${alpha(grey[500], 0.2)}`,
        '& svg': {
            color: theme.palette.text.default
        }
    },
    backIcon: {
        paddingLeft: '1rem',
        '& svg': {
            cursor: 'pointer'
        }
    },
    resetButton: {
        marginLeft: 'auto',
        '& h4': {
            fontWeight: 'bold',
            fontSize: '1.6rem',
            color: theme.palette.text.contrastText,
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    },
    closeIcon: {},
    title: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        marginLeft: theme.spacing(2),
        textTransform: 'uppercase',
        letterSpacing: '0.2rem'
    },
    chatBody: {
        height: '80%',
        flex: '1',
        maxHeight: '100%',
        overflow: 'hidden'
    },
    chatInput: {
        padding: '0 1rem'
    },
    windowName: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.5),
        marginLeft: '1.6rem'
    },
    contentBoxSuggestion: {
        width: '97%',
        height: '20rem',
        padding: '0rem 1rem',
        marginTop: '1.5rem'
    },
    contentBoxSuggestionHeader: {
        height: '3rem',
        width: '100%',
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        padding: '0px',
        margin: '0px',
        letterSpacing: '0.5px'
    },
    contentBoxSuggestionMain: {
        width: '100%',
        display: 'flex'
    },
    contentBoxRecommendSolutionContent: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    suggestionOption: {
        minHeight: '5.1rem',
        width: '90%',
        borderRadius: '20px',
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        border: `1px solid ${theme.palette.text.contrastText}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: theme.palette.text.default,
        fontSize: '1rem',
        padding: '0.5rem',
        margin: '0rem 0rem 1.5rem 0rem',
        paddingleft: '2rem',
        textAlign: 'center',
        '& p': {
            fontSize: '1.3rem'
        }
    },
    verticalLine: {
        height: 'inherit',
        minWidth: '0.5rem',
        backgroundColor: alpha(theme.palette.text.contrastText, 0.8),
        borderRadius: '99px'
    },
    greetingContainer: {
        height: '75%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    primaryOptionsContainer: {
        height: '25%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    queryInputContainer: {
        height: '25%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    greetingText: {
        color: theme.palette.text.default,
        fontWeight: 600
    },
    greetingSubText: {
        color: theme.palette.text.default,
        fontSize: '1.8rem',
        fontWeight: 300,
        padding: '2rem 2.6rem',
        textAlign: 'center'
    },
    searchInput: {
        width: '47rem',
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.default,
            fontSize: '1.6rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiButtonBase-root': {
            margin: '0px'
        },
        '& input': {
            color: 'red',
            fontSize: '1.6rem',
            padding: '2rem 1.5rem'
        },
        '& button': {
            // padding: '1.3rem'
        },
        '& button svg': {
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText,
            borderWidth: 2
        }
    },
    addRulesContainer: {
        padding: '0rem 2rem 1rem 2rem'
    },
    addRulesHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        margin: '1rem'
    },
    // planogramUploadButton: {
    //     height: '3.5rem',
    //     width: '45rem',
    //     border: '1px solid ' + theme.palette.primary.contrastText,
    //     color: theme.palette.primary.contrastText,
    //     borderRadius: '0px',
    //     margin: '1rem',
    //     textAlign: 'start',
    //     '& svg': {
    //         color: theme.palette.primary.contrastText
    //     },
    //     '& .MuiButton-label': {
    //         justifyContent: 'start'
    //     }
    // },
    planogramUploadButton: {
        minHeight: '6rem',
        height: '6rem',
        color: theme.palette.primary.contrastText,
        margin: '1rem',
        textAlign: 'start',
        '& fieldset': {
            borderColor: theme.palette.primary.contrastText
        },
        '& span': {
            color: theme.palette.primary.contrastText
        }
    },
    planogramUploadButtonLarge: {
        minHeight: '6rem',
        height: '11.5rem',
        color: theme.palette.primary.contrastText,
        margin: '1rem',
        textAlign: 'start',
        '& fieldset': {
            borderColor: theme.palette.primary.contrastText
        },
        '& span': {
            color: theme.palette.primary.contrastText
        }
    },
    uploadAnalyticsIcon: {
        height: '3rem',
        width: '3rem',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    rulesListContainer: {
        height: '20.5rem',
        margin: '1rem',
        marginBottom: '2rem',
        overflowY: 'scroll'
    },
    rulesListContainerLarge: {
        height: '26rem',
        margin: '1rem',
        marginBottom: '2rem',
        overflowY: 'scroll'
    },
    checkBoxItem: {
        '& .MuiTypography-body1': {
            fontSize: '1.5rem'
        },
        '& .MuiSvgIcon-root': {
            width: '2.5rem',
            height: '2.5rem'
        },
        '& .MuiFormControlLabel-label.Mui-disabled': {
            color: theme.palette.primary.contrastText
        }
    },
    ruleInputContainer: {
        width: '45rem',
        display: 'flex',
        alignItems: 'center'
    },
    ruleInput: {
        width: '43rem',
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        color: theme.palette.text.default,
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.default,
            fontSize: '2rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiButtonBase-root': {
            margin: '0px'
        },
        '& input': {
            color: 'red',
            fontSize: '2rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.4)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText,
            borderWidth: 2
        }
    },
    addIcon: {
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    affilityInput: {
        width: '45rem',
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        marginTop: '2rem',
        color: theme.palette.text.default,
        '& .MuiOutlinedInput-root': {
            color: theme.palette.text.default,
            fontSize: '2rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiButtonBase-root': {
            margin: '0px'
        },
        '& input': {
            color: 'red',
            fontSize: '2rem',
            padding: '2rem 1.5rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.4)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText,
            borderWidth: 2
        }
    },
    generatePlanogramButtonContainer: {
        height: '8rem',
        width: '45rem',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
        '& button': {
            height: '3.5rem',
            width: '22rem',
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.dark,
            borderRadius: '2px'
        }
    },
    customThoughtProcess: {
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        marginTop: '2rem',
        maxHeight: '20rem',
        overflowY: 'scroll',
        margin: 'auto',
        color: theme.palette.text.default,
        padding: '1.5rem',
        fontSize: '1.2rem',
        width: '96%'
    },
    affinity_info: {
        backgroundColor: themeMode === 'dark' ? '#1C3C5F' : alpha(theme.palette.primary.light, 0.5),
        marginTop: '1rem',
        maxHeight: '18rem',
        overflowY: 'scroll',
        margin: 'auto',
        color: theme.palette.text.default,
        padding: '0.5rem',
        fontSize: '1.2rem',
        width: '96%'
    }
}));

export default function PlanogramChatPopup(props) {
    const classNames = useStyles();
    const { handleChatPopup, open, thought_process, rules, affinity_info, genAIAnalyticsFile } =
        props;

    const [isMenuPageActive, setIsMenuPageActive] = React.useState(true);
    const [isModifyPlanogramPageActive, setIsModifyPlanogramPageActive] = React.useState(false);
    const [isAutoGeneratePlanogramPageActive, setIsAutoGeneratePlanogramPageActive] =
        React.useState(false);

    const [ruleText, setRuleText] = React.useState('');
    const [affinityText, setAffinityText] = React.useState('');
    const [genAISwapCommand, setGenAISwapCommand] = React.useState('');
    const [reset, setReset] = React.useState(false);
    const handleChange = (event) => {
        const modifiedRules = rules.map((rule) =>
            rule.text === event.target.name ? { ...rule, selected: event.target.checked } : rule
        );
        props.handleAddRule(modifiedRules);
    };

    const handleClose = () => {
        handleChatPopup(false);
        setRuleText('');
        setAffinityText('');
        props.handleAISwapCommandChange('');
    };

    const handleAddRule = () => {
        if (ruleText.length > 0) {
            const newRules = [...rules, { text: ruleText, selected: true }];
            setRuleText('');
            props.handleAddRule(newRules);
        }
    };

    const handleReset = () => {
        setReset(true);
        setRuleText('');
        setAffinityText('');
        props.handleAISwapCommandChange('');
        props.onRestorePlanogram();
        props.handleAddRule(
            rules.map((rule) => {
                return { ...rule, selected: false };
            })
        );
        props.resetChatFeature();
    };

    const handleBack = () => {
        setIsMenuPageActive(true);
        setIsModifyPlanogramPageActive(false);
        setIsAutoGeneratePlanogramPageActive(false);
    };

    const handleOptionClick = (type) => {
        if (type === 'modifyPlanogram') {
            setIsMenuPageActive(false);
            setIsModifyPlanogramPageActive(true);
            setIsAutoGeneratePlanogramPageActive(false);
        } else if (type === 'autoGeneratePlanogram') {
            setIsMenuPageActive(false);
            setIsModifyPlanogramPageActive(false);
            setIsAutoGeneratePlanogramPageActive(true);
        }
    };

    const handleFileUpload = (event) => {
        props.handleAIAnalyticsFileUpload(event);
    };

    const handleGeneratePlanogram = () => {
        props.onCommandGenAIReOrganization();
    };

    // useEffect(() => {
    //     setRules(props.rules);
    // }, [props.rules]);

    const formatRules = () => {
        let newRules = rules;
        let ruleString = '';
        if (newRules?.length > 0) {
            for (let i = 0; i < newRules.length; i++) {
                if (newRules[i].selected === true) {
                    ruleString = ruleString + '- ' + newRules[i].text + '\n';
                }
            }
        }
        return ruleString;
    };

    useEffect(() => {
        props.handleSKUAffinities(affinityText);
    }, [affinityText]);

    useEffect(() => {
        props.handleRearrangementRules(formatRules());
    }, [rules]);

    useEffect(() => {
        if (reset === true) {
            setReset(false);
        }
    }, [reset]);

    return (
        <Dialog
            classes={{
                paper: classNames.dialogSize,
                root: classNames.root
            }}
            handleChatPopup={handleClose}
            aria-labelledby="minerva-dialog-title"
            open={open}
        >
            <div className={classNames.chatBoxContainer}>
                <div className={classNames.chatHeader}>
                    <div className={classNames.backIcon}>
                        {isModifyPlanogramPageActive || isAutoGeneratePlanogramPageActive ? (
                            <ArrowBackIosIcon fontSize="large" onClick={handleBack} />
                        ) : (
                            <React.Fragment></React.Fragment>
                        )}
                    </div>
                    <div>
                        <Typography variant="h4" className={classNames.title}>
                            Planogram AI
                        </Typography>
                    </div>
                    <div className={classNames.resetButton}>
                        {isAutoGeneratePlanogramPageActive && (
                            <Typography variant="h4" onClick={handleReset}>
                                Reset Changes
                            </Typography>
                        )}
                    </div>
                    <IconButton
                        className={classNames.closeIcon}
                        size="medium"
                        onClick={handleClose}
                        title="minimize"
                    >
                        <CloseOutlinedIcon fontSize="large" />
                    </IconButton>
                </div>
                <div className={classNames.chatBody}>
                    {/* First Screen Start */}
                    {isMenuPageActive && (
                        <React.Fragment>
                            <div className={classNames.greetingContainer}>
                                <Typography variant="h3" className={classNames.greetingText}>
                                    Hey Cristina, Greetings!
                                </Typography>
                                <Typography className={classNames.greetingSubText}>
                                    You&apos;ve entered to the Hershey&apos;s Planogram. How can we
                                    help you with your shelf organisation?
                                </Typography>
                            </div>
                            <div className={classNames.primaryOptionsContainer}>
                                <Grid
                                    container
                                    direction="column"
                                    className={classNames.contentBoxRecommendSolutionContent}
                                >
                                    <Grid
                                        item
                                        className={classNames.suggestionOption}
                                        onClick={() => handleOptionClick('modifyPlanogram')}
                                    >
                                        <Typography>Modify Planogram</Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        className={classNames.suggestionOption}
                                        onClick={() => handleOptionClick('autoGeneratePlanogram')}
                                    >
                                        <Typography>Auto-Generate Planogram</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </React.Fragment>
                    )}
                    {/* First Screen End */}
                    {/* Second Screen Start */}
                    {isModifyPlanogramPageActive && (
                        <React.Fragment>
                            <div className={classNames.greetingContainer}>
                                <Typography variant="h3" className={classNames.greetingText}>
                                    Hey Cristina, Greetings!
                                </Typography>
                                <Typography className={classNames.greetingSubText}>
                                    You&apos;ve entered to the Hershey&apos;s Planogram. How can we
                                    help you with your shelf organisation?
                                </Typography>
                            </div>
                            <div className={classNames.queryInputContainer}>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        // this.onCommandSwap();
                                    }}
                                >
                                    <TextField
                                        autoFocus
                                        variant="outlined"
                                        multiline
                                        placeholder="Type the Prompt to Swap, Generate Planogram"
                                        className={classNames.searchInput}
                                        value={genAISwapCommand}
                                        onChange={(e) => {
                                            setGenAISwapCommand(e.target.value);
                                            props.handleAISwapCommandChange(e.target.value);
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0'
                                                        }}
                                                    >
                                                        <IconButton
                                                            title="send"
                                                            onClick={props.onCommandSwap}
                                                        >
                                                            <SendIcon fontSize="large" />
                                                        </IconButton>
                                                    </div>
                                                </InputAdornment>
                                            )
                                        }}
                                        id="planogram genai"
                                    />
                                </form>
                            </div>
                        </React.Fragment>
                    )}
                    {/* Second Screen End */}
                    {/* Third Screen start */}
                    {isAutoGeneratePlanogramPageActive && (
                        <React.Fragment>
                            <div className={classNames.addRulesContainer}>
                                {/* <Button
                                    className={classNames.planogramUploadButton}
                                    startIcon={
                                        <img
                                            src={UploadAnalytics}
                                            className={classNames.uploadAnalyticsIcon}
                                        />
                                    }
                                    size="small"
                                    // onClick={handleCreateNewChat}
                                    aria-label="upload"
                                >
                                    Upload Analytics
                                </Button> */}
                                {!thought_process ? (
                                    <div
                                        className={`${
                                            props.genAIAnalyticsFile !== null
                                                ? classNames.planogramUploadButtonLarge
                                                : classNames.planogramUploadButton
                                        }`}
                                    >
                                        <PlanogramFileUpload
                                            fieldInfo={{
                                                id: 9,
                                                name: 'analytics-upload',
                                                label: 'Upload Analytics',
                                                type: 'upload',
                                                value: '',
                                                variant: 'outlined',
                                                margin: 'none',
                                                inputprops: {
                                                    type: 'file',
                                                    error: 'false',
                                                    multiple: false
                                                    // "accept": "/*"
                                                },
                                                InputLabelProps: {
                                                    disableAnimation: true,
                                                    shrink: true
                                                },
                                                placeholder: 'Enter your Input',
                                                grid: 12
                                            }}
                                            onChange={(v) => {
                                                handleFileUpload(v);
                                            }}
                                            key={'upload'}
                                            reset={reset}
                                        />
                                    </div>
                                ) : null}
                                {!thought_process ? (
                                    <Typography className={classNames.addRulesHeader}>
                                        Add Rules
                                    </Typography>
                                ) : null}
                                {!thought_process ? (
                                    <div
                                        className={`${
                                            props.genAIAnalyticsFile !== null
                                                ? classNames.rulesListContainer
                                                : classNames.rulesListContainerLarge
                                        }`}
                                    >
                                        <FormControl
                                            component="fieldset"
                                            className={classNames.formControl}
                                        >
                                            <FormGroup>
                                                {rules?.map((rule, index) => (
                                                    <FormControlLabel
                                                        key={`${rule}-${index}`}
                                                        className={classNames.checkBoxItem}
                                                        control={
                                                            <Checkbox
                                                                checked={rule?.selected}
                                                                onChange={handleChange}
                                                                name={rule?.text}
                                                            />
                                                        }
                                                        label={rule?.text}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </FormControl>
                                    </div>
                                ) : null}
                                {thought_process ? (
                                    <Typography className={classNames.addRulesHeader}>
                                        Added Rules
                                    </Typography>
                                ) : null}
                                {thought_process ? (
                                    <div>
                                        <FormGroup>
                                            {rules
                                                ?.filter((rule) => rule.selected === true)
                                                .map((rule, index) => (
                                                    <FormControlLabel
                                                        key={`${rule}-${index}`}
                                                        className={classNames.checkBoxItem}
                                                        control={
                                                            <Checkbox
                                                                checked={rule?.selected}
                                                                onChange={handleChange}
                                                                name={rule?.text}
                                                                disabled={true}
                                                            />
                                                        }
                                                        label={rule?.text}
                                                    />
                                                ))}
                                        </FormGroup>
                                    </div>
                                ) : null}
                                {!thought_process ? (
                                    <div className={classNames.ruleInputContainer}>
                                        <TextField
                                            variant="outlined"
                                            multiline
                                            placeholder="+ Type new Rules"
                                            className={classNames.ruleInput}
                                            value={ruleText}
                                            onChange={(e) => setRuleText(e.target.value)}
                                            id="new rule input"
                                        />
                                        <AddIcon
                                            fontSize="large"
                                            className={classNames.addIcon}
                                            onClick={handleAddRule}
                                        />
                                    </div>
                                ) : null}
                                {/* {!affinity_info ? <TextField
                                    variant="outlined"
                                    multiline
                                    placeholder="Add Affinities"
                                    className={classNames.affilityInput}
                                    value={affinityText}
                                    onChange={(e) => setAffinityText(e.target.value)}
                                    id="affility input"
                                /> : null} */}
                            </div>
                            {affinity_info && affinity_info.trim() !== '' ? (
                                <>
                                    <Typography variant="h5" className={classNames.addRulesHeader}>
                                        Affinity Info
                                    </Typography>
                                    <div className={classNames.affinity_info}>
                                        <MarkdownRenderer markdownContent={affinity_info} />
                                    </div>
                                </>
                            ) : null}
                            {thought_process && thought_process.trim() !== '' ? (
                                <>
                                    <Typography variant="h5" className={classNames.addRulesHeader}>
                                        Thought Process
                                    </Typography>
                                    <div className={classNames.customThoughtProcess}>
                                        <MarkdownRenderer markdownContent={thought_process} />
                                    </div>
                                </>
                            ) : null}
                            {!thought_process ? (
                                <div className={classNames.generatePlanogramButtonContainer}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleGeneratePlanogram}
                                        aria-label="upload"
                                        disabled={!genAIAnalyticsFile}
                                    >
                                        Generate Planogram
                                    </Button>
                                </div>
                            ) : null}
                        </React.Fragment>
                    )}
                    {/* Third Screen start */}
                </div>
            </div>
            {props.snackbar.open && (
                <CustomSnackbar
                    open={props.snackbar.open}
                    message={props.snackbar.message}
                    autoHideDuration={2000}
                    onClose={() => {
                        props.handleSnackbarValue(false, '', '');
                    }}
                    severity={props.snackbar.severity}
                />
            )}
        </Dialog>
    );
}
