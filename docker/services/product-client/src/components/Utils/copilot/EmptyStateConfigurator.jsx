/* eslint-disable react/jsx-key */
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    TextField,
    Typography,
    alpha,
    makeStyles
} from '@material-ui/core';
import { ReactComponent as WavingIcon } from '../../Nuclios/assets/WavingIcon.svg';
import copilotConfiguratorStyle from './styles/copilotConfiguratorStyle';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as BlubIcon } from '../../Nuclios/assets/BulbIcon.svg';
// import {ReactComponent as AddIcon} from '../../Nuclios/assets/AddIcon.svg'
import CloseIcon from '@material-ui/icons/Close';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { grey } from '@material-ui/core/colors';
import { useDebouncedEffect } from 'hooks/useDebounceEffect';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import NucliOSCloseIcon from 'assets/Icons/CloseBtn';
import darkBackground from 'assets/img/minerva-dark-bg.png';
import backImg from 'assets/img/Nuclios_Background.svg';
import MicIcon from '@material-ui/icons/Mic';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.layoutSpacing(16, 16, 25.0112),
        backgroundImage: `url(${
            theme.props.mode === 'light' ? backImg : darkBackground
        }) !important`,
        backgroundSize: 'cover !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important'
    },
    greetMessage: {
        display: 'flex',
        gap: theme.layoutSpacing(16),
        padding: theme.layoutSpacing(80, 0, 24),
        '& svg': {
            width: theme.layoutSpacing(44),
            height: theme.layoutSpacing(44)
        },
        '& span': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.layoutSpacing(4),
            fontSize: theme.layoutSpacing(40) + ' !important',
            fontWeight: 500,
            height: 'auto',
            color: theme.palette.text.revamp
        }
    },
    greetDesc: {
        width: '100%',
        maxWidth: theme.layoutSpacing(723),
        padding: theme.layoutSpacing(12, 40),
        '& .MuiInputBase-input': {
            fontSize: theme.layoutSpacing(15),
            textAlign: 'center'
        },
        '& .MuiOutlinedInput-root': {
            color: alpha(theme.palette.text.revamp, 0.5),

            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.border.grey
            }
        }
    },
    suggestedQueryRoot: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: theme.layoutSpacing(16),
        padding: theme.layoutSpacing(0, 16, 24),
        columnGap: theme.layoutSpacing(24),
        overflow: 'auto',
        width: '100%',
        fontWeight: 500,
        fontSize: theme.layoutSpacing(16)
    },
    suggestedQueryItem: {
        padding: theme.layoutSpacing(12, 16),
        color: alpha(theme.palette.text.default, 0.6),
        fontWeight: 500,
        transitionDuration: '200ms',
        '&:hover': {
            background: alpha(theme.palette.primary.dark, 0.3)
        }
    },
    sampleQuestionContainer: {
        display: 'flex',
        width: '100%',
        alignItems: 'flex-end',
        flexDirection: 'column'
    },
    addSampleQuestionBtn1: {
        padding: theme.layoutSpacing(32, 16),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '& .MuiTypography-root': {
            flex: 1,
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(28),
            color: theme.palette.text.contrastText
        },
        '& .MuiIconButton-root': {
            padding: theme.layoutSpacing(8),
            '& svg': {
                fontSize: theme.layoutSpacing(28)
            }
        }
    },
    addSampleQuestionBtn2: {
        padding: theme.layoutSpacing(8, 16),
        display: 'flex',
        cursor: 'pointer',
        '& .MuiTypography-root': {
            flex: 1,
            fontFamily: theme.title.h1.fontFamily,
            fontSize: theme.layoutSpacing(16),
            color: alpha(theme.palette.text.revamp, 0.9)
        },
        '& .MuiIconButton-root': {
            padding: theme.layoutSpacing(5)
        }
    },
    dummyInput: {
        background: theme.palette.primary.dark,
        borderRadius: theme.layoutSpacing(2),
        '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: grey[300]
        },
        '& .MuiInputBase-input': {
            fontSize: theme.layoutSpacing(18),
            padding: theme.layoutSpacing(12, 0),
            color: theme.palette.text.default
        },
        '& .MuiOutlinedInput-root': {
            boxShadow: '0 0px 4px 2px rgba(0,0,0,0.2)',
            maxHeight: theme.layoutSpacing(50.0156),
            padding: theme.layoutSpacing(12.5056)
        }
    },
    dummyInputAction: {
        display: 'flex',
        gap: theme.layoutSpacing(16),
        '& svg': {
            fill: alpha(theme.palette.text.default, 0.4),
            fontSize: theme.layoutSpacing(24)
        }
    },

    dialog: {
        '& .MuiPaper-root': {
            backdropFilter: 'none',
            width: theme.layoutSpacing(760),
            padding: theme.layoutSpacing(0, 16),
            borderColor: theme.palette.background.modelBackground
        },
        '& .MuiDialogContent-root': {
            padding: theme.layoutSpacing(32, 16, 0)
        }
    },

    sampleQueriesRoot: {
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16)
    },
    sampleQueryItem: {
        '& .MuiInputBase-input': {
            lineHeight: '1.4em',
            fontSize: theme.layoutSpacing(16),
            color: theme.palette.text.revamp
        },
        '& .MuiInputBase-root': {
            padding: theme.layoutSpacing(16, 32, 16, 12),

            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.border.grey
            }
        },
        '& .MuiButtonBase-root': {
            padding: '0',
            position: 'absolute',
            top: theme.layoutSpacing(12),
            right: theme.layoutSpacing(4),
            '& svg': {
                fill: alpha(theme.palette.text.revamp, 0.4),
                fontSize: theme.layoutSpacing(18)
            }
        }
    },
    sampleQueryHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.layoutSpacing(4, 0),
        marginTop: theme.layoutSpacing(24),
        marginBottom: theme.layoutSpacing(8),
        '& .MuiDialogContent-root': {
            padding: 0
        },
        '& .MuiTypography-root': {
            flex: 1,
            fontSize: theme.layoutSpacing(14),
            fontWeight: 500,
            lineHeight: theme.layoutSpacing(16.8),
            color: theme.palette.text.revamp
        },
        '& .MuiIconButton-root': {
            padding: theme.layoutSpacing(1),

            '& .MuiIconButton-label svg': {
                width: theme.layoutSpacing(16),
                height: theme.layoutSpacing(16)
            }
        },
        '& a': {
            fontSize: theme.layoutSpacing(16),
            fontWeight: 500
        }
    },

    modalDesc: {
        borderRadius: theme.layoutSpacing(4),
        display: 'flex',
        flexDirection: 'row',
        gap: theme.layoutSpacing(16),
        alignItems: 'center',
        background:
            theme.props.mode === 'light'
                ? theme.palette.background.info
                : theme.palette.text.hightlightFilter,
        padding: theme.layoutSpacing(32, 16),
        '& .MuiTypography-root': {
            fontSize: theme.layoutSpacing(16),
            color: theme.palette.text.purpleText,
            opacity: 1
        },
        '& svg': {
            fill: theme.palette.text.purpleText
        },
        '& .MuiAvatar-root': {
            background: theme.palette.text.white
        }
    },

    actions: {
        padding: theme.layoutSpacing(32, 28, 24, 0)
    },
    textIconButton: {
        cursor: 'pointer',
        color: theme.palette.text.revamp
    },
    dialogRoot: {
        margin: 0,
        padding: theme.layoutSpacing(20, 0),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    titleWrapper: {
        background: theme.palette.background.modelBackground,
        padding: 0
    },
    innerTitle: {
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(4)}`,
        height: theme.layoutSpacing(76),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        '& .MuiGrid-container': {
            margin: 0
        },
        '& .MuiGrid-item': {
            padding: 0,
            alignItems: 'center'
        }
    },
    title: {
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: 'normal',
        fontSize: theme.layoutSpacing(22),
        letterSpacing: theme.layoutSpacing(1),
        color: theme.palette.text.revamp
    },
    closeButton: {
        '& span': {
            fill: theme.palette.text.contrastText
        }
    },
    disabledButton: {
        opacity: 0.8,
        pointerEvents: 'none'
    }
}));

const DialogTitle = (props) => {
    const { children, classes, onClose, ...other } = props;

    return (
        <MuiDialogTitle
            disableTypography
            className={`${classes.dialogRoot} ${classes.titleWrapper}`}
            {...other}
        >
            <div className={classes.innerTitle}>
                <Grid container spacing={2}>
                    <Grid item xs={true} style={{ display: 'flex' }}>
                        <Typography className={classes.title}>{children}</Typography>
                    </Grid>
                    <Grid item xs="auto">
                        {onClose ? (
                            <IconButton
                                aria-label="close"
                                className={classes.closeButton}
                                onClick={onClose}
                                title="close"
                            >
                                <NucliOSCloseIcon />
                            </IconButton>
                        ) : null}
                    </Grid>
                </Grid>
            </div>
        </MuiDialogTitle>
    );
};

export default function EmptyStateConfigurator({
    appData,
    onChangeSampleQuestions,
    onChangeGreetMsg
}) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();
    const userName = sessionStorage.getItem('user_name');
    const greet_message = `Hey ${userName}`;
    const [greetDesc, setGreetDesc] = useState(appData?.config?.empty_state_message_desc || '');
    const [openModal, setOpenModal] = useState(false);
    const suggestedQueries = appData?.config?.suggested_queries;
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    useDebouncedEffect(
        () => {
            onChangeGreetMsg(greetDesc);
        },
        [greetDesc],
        2000
    );

    useEffect(() => {
        setGreetDesc(appData?.config?.empty_state_message_desc || '');
    }, [suggestedQueries]);

    return (
        <div className={classes.root}>
            <div className={classes.greetMessage}>
                <WavingIcon />
                <Typography variant="h3" component="span" className={configClasses.typography}>
                    {greet_message}
                </Typography>
            </div>

            <TextField
                placeholder="Write your welcome message here. Ex: “Welcome to the world of AI analytics.”"
                className={classes.greetDesc}
                variant="outlined"
                multiline={true}
                value={greetDesc}
                onChange={(e) => setGreetDesc(e.target.value)}
                minRows={1}
            />

            <div style={{ flex: 1 }} />
            {suggestedQueries?.length ? (
                <div className={classes.sampleQuestionContainer}>
                    <a
                        onClick={handleOpenModal}
                        className={clsx(classes.addSampleQuestionBtn2, configClasses.addButton)}
                    >
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="body1">Update Sample Questions</Typography>
                    </a>
                    <div className={classes.suggestedQueryRoot}>
                        {suggestedQueries?.map((el) => (
                            <div
                                key={el}
                                className={clsx(classes.suggestedQueryItem, configClasses.border)}
                            >
                                {el}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <a className={clsx(classes.addSampleQuestionBtn1, configClasses.addButton)}>
                    <IconButton onClick={handleOpenModal}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="body1">Add Sample Questions</Typography>
                </a>
            )}
            <TextField
                variant="outlined"
                disabled
                fullWidth
                placeholder="Type your query... "
                className={classes.dummyInput}
                InputProps={{
                    endAdornment: (
                        <div className={classes.dummyInputAction}>
                            <MicIcon fontSize="large" />
                            <SendOutlinedIcon fontSize="large" />
                        </div>
                    )
                }}
            />
            <SampleQuestionCreateModal
                classes={classes}
                suggestedQueries={suggestedQueries}
                open={openModal}
                setOpen={setOpenModal}
                onChange={onChangeSampleQuestions}
                configClasses={configClasses}
            />
        </div>
    );
}

function SampleQuestionCreateModal({
    classes,
    open,
    suggestedQueries,
    setOpen,
    onChange,
    configClasses
}) {
    const [sampleQuestions, setSampleQuestions] = useState(
        suggestedQueries?.length ? [...suggestedQueries] : ['']
    );
    const handleAddQuestion = () => {
        if (sampleQuestions.length < 6) {
            setSampleQuestions((s) => [...s, '']);
        }
    };
    const handleRemoveItem = (i) => {
        if (sampleQuestions.length === 1) {
            setSampleQuestions(['']);
        } else {
            const s = [...sampleQuestions];
            s.splice(i, 1);
            setSampleQuestions(s);
        }
    };

    useEffect(() => {
        setSampleQuestions(suggestedQueries?.length ? [...suggestedQueries] : ['']);
    }, [suggestedQueries]);

    const handleSave = () => {
        setOpen(false);
        if (sampleQuestions.length === 1 && sampleQuestions[0].trim() == '') {
            onChange([]);
        } else {
            const updatedSampleQuestions = sampleQuestions
                .filter((item) => item.trim())
                .map((item) => item.trim());
            onChange(updatedSampleQuestions);
        }
    };

    return (
        <Dialog open={open} className={classes.dialog}>
            <DialogTitle
                id="customized-dialog-title"
                onClose={() => setOpen(false)}
                classes={classes}
            >
                Add Sample Question
            </DialogTitle>
            <DialogContent>
                <div className={classes.modalDesc}>
                    <Avatar>
                        <BlubIcon />
                    </Avatar>
                    <Typography variant="body1">
                        Use this space to add upto six sample questions and give the users an idea
                        of what they can expect from AI.
                    </Typography>
                </div>
                <div className={classes.sampleQueryHeader}>
                    <Typography variant="subtitle1">Sample Questions</Typography>
                    <a
                        onClick={handleAddQuestion}
                        className={clsx(
                            classes.textIconButton,
                            configClasses.addButton,
                            sampleQuestions.length === 6 && classes.disabledButton
                        )}
                    >
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                        Add Sample Question
                    </a>
                </div>
                <div className={classes.sampleQueriesRoot}>
                    {sampleQuestions?.map((el, i) => (
                        <div className={classes.sampleQueryItem}>
                            <TextField
                                placeholder="Sample Prompt..."
                                className={classes.sampleQueryInput}
                                variant="outlined"
                                multiline={true}
                                value={el}
                                fullWidth
                                autoFocus
                                onChange={(e) =>
                                    setSampleQuestions((s) => {
                                        s[i] = e.target.value;
                                        return [...s];
                                    })
                                }
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => handleRemoveItem(i)}>
                                            <CancelOutlinedIcon />
                                        </IconButton>
                                    )
                                }}
                                minRows={2}
                            />
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpen(false)}
                    className={configClasses.button}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                    className={configClasses.button}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
