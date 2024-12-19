import React, { useRef, useState } from 'react';
import {
    ButtonBase,
    IconButton,
    InputAdornment,
    TextField,
    alpha,
    makeStyles
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';
import { makeQuery } from '../../store/thunks/minervaThunk';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { ReactComponent as AudioWave } from 'assets/img/audio_animated.svg';

const useStyles = makeStyles((theme) => ({
    queryContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    searchInput: {
        flex: 1,
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.6rem',
            padding: '2rem 1.5rem'
        },
        '& button': {
            padding: '1.3rem'
        },
        '& button svg': {
            color: alpha(theme.palette.text.default, 0.7)
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.3)
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.text.default, 0.4)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.contrastText,
            borderWidth: 1
        }
    },
    audiodWave: {
        height: '4rem',
        width: '4rem',
        marginRight: '1rem',
        fill: theme.palette.background.connQueryInput,
        '&> path:nth-child(1)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '0'
        },
        '&> path:nth-child(2)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '.15s'
        },
        '&> path:nth-child(3)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '.30s'
        },
        '&> path:nth-child(4)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '0.45s'
        },
        '&> path:nth-child(5)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '0.60s'
        },
        '&> path:nth-child(6)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '1.15s'
        },
        '&> path:nth-child(7)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '1.30s'
        },
        '&> path:nth-child(8)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '1.45s'
        },
        '&> path:nth-child(9)': {
            animation: `$pulse 1s infinite`,
            animationDelay: '2s'
        }
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scaleY(1)',
            transformOrigin: '50% 50%'
        },
        '50%': {
            transform: 'scaleY(.7)',
            transformOrigin: '50% 50%'
        },
        '100%': {
            transform: 'scaleY(1)',
            transformOrigin: '50% 50%'
        }
    },
    suggestionContianer: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'end'
    },
    suggestionItem: {
        padding: '0.6rem 2rem',
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.7),
        opacity: 0.7,
        background: theme.palette.primary.light,
        boxShadow: '0px 2px 2px 0px rgba(0,0,0, 0.2)',
        borderRadius: '5rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transitionDuration: '200ms',
        '&:hover': {
            opacity: 1,
            boxShadow: '2px 4px 4px 2px rgba(0,0,0, 0.2)'
        }
    },
    micIcon: {
        fill: theme.palette.background.connQueryInput
    },
    sendIcon: {
        fill: theme.palette.background.connQueryInput
    }
}));

export default function QueryInput({ minervaAppId, handleQuerySubmit }) {
    const classes = useStyles();
    const [textQuery, setTextQuery] = useState('');
    const dispatch = useDispatch();
    const [listening, setListening] = useState(false);
    const inputRef = useRef();
    const { selectedWindowId } = useSelector((s) => s.minerva);
    // const suggestedQuestions = ["What can you do for me?", "Average sales of last year", "Last three year's sales data"];
    const suggestedQuestions = [];
    const [recognization] = useState(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            return new SpeechRecognition();
        }
    });

    const handeSendQuery = () => {
        // if (textQuery.trim()) {
        //     dispatch(
        //         makeQuery({ input: textQuery.trim(), minervaAppId, window_id: selectedWindowId })
        //     );
        //     setTextQuery('');
        // }
        handleQuerySubmit(textQuery);
        setTextQuery('');
    };

    const handleVoicetoCommand = () => {
        if (listening) {
            recognization.stop();
            setListening(false);
            return;
        }

        recognization.onstart = () => {
            setListening(true);
        };
        recognization.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setTextQuery((s) => s + ' ' + transcript);
            setListening(false);
            inputRef.current?.focus();
        };
        recognization.start();
    };

    const handleSuggestedQuestion = (q) => {
        dispatch(makeQuery({ input: q, minervaAppId, window_id: selectedWindowId }));
    };

    return (
        <div className={classes.queryContainer}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handeSendQuery();
                }}
                style={{ width: '100%', display: 'flex', gap: '1rem' }}
            >
                <TextField
                    inputRef={inputRef}
                    autoFocus
                    variant="outlined"
                    placeholder="Ask NucliOS"
                    className={classes.searchInput}
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                    {listening ? (
                                        <AudioWave className={classes.audiodWave} />
                                    ) : null}
                                    <IconButton
                                        title={listening ? 'stop' : 'speak'}
                                        onClick={handleVoicetoCommand}
                                    >
                                        {listening ? (
                                            <MicOffIcon
                                                fontSize="large"
                                                className={classes.micIcon}
                                            />
                                        ) : (
                                            <MicIcon fontSize="large" className={classes.micIcon} />
                                        )}
                                    </IconButton>
                                    <IconButton title="send" onClick={handeSendQuery}>
                                        <SendIcon fontSize="large" className={classes.sendIcon} />
                                    </IconButton>
                                </div>
                            </InputAdornment>
                        )
                    }}
                    id="ask minerva"
                />
            </form>
            <div className={classes.suggestionContianer}>
                {suggestedQuestions.map((el) => (
                    <ButtonBase
                        key={el}
                        className={classes.suggestionItem}
                        onClick={() => handleSuggestedQuestion(el)}
                        aria-label="Suggesions"
                    >
                        {el}
                    </ButtonBase>
                ))}
            </div>
        </div>
    );
}
