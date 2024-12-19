import { Container, Grid, makeStyles, Button, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import { getProcessedQuestion } from 'services/minerva';
import { UserMessage, MinervaMessage, RecommendationCards } from './chatMessages';
import MicIcon from '@material-ui/icons/Mic';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import StopIcon from '@material-ui/icons/Stop';
import CloseIcon from '@material-ui/icons/Close';
//import SendIcon from '@material-ui/icons/Send';
// import { ReactComponent as SendIcon } from 'assets/img/send-icon.svg';
const useStyles = makeStyles((theme) => ({
    container: {
        background: theme.palette.background.paper,
        width: '100%',
        height: '100%',
        padding: '0 1em'
    },
    chatContainer: {
        height: '85%',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    textField: {
        border: '1px solid' + theme.palette.primary.contrastText,
        fontSize: '2rem',
        height: '5.7rem',
        borderRadius: '0.5rem'
    },
    resize: {
        fontSize: '2rem',
        padding: '1.5rem 2rem',
        color: theme.palette.text.titleText
    },
    voiceText: {
        fontSize: '2rem',
        color: 'white'
    },
    btn: {
        height: '5.7rem',
        minWidth: '5.5rem !important',
        width: '100%',
        backgroundColor: theme.palette.primary.contrastText
    },
    MicIcon: {
        color: theme.palette.primary.main,
        transform: 'scale(1.8)'
    },
    SendIcon: {
        '& path': {
            fill: theme.palette.primary.main + ' !important'
        }
    },
    exitBlock: {
        color: theme.palette.text.titleText,
        fontSize: '2.5rem',
        alignItems: 'center'
    },
    voiceInput: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.dialogTitle,
        padding: '1.2rem 3rem',
        position: 'relative',
        height: 'max-content',
        justifyContent: 'center',
        width: '100%',
        top: '-10.8rem'
    },
    voiceCloseButton: {
        marginLeft: 'auto',
        cursor: 'pointer'
    },
    voiceTranscript: {
        color: '#cfd0d0',
        padding: '1.15rem 0',
        fontSize: '1.2em'
    },
    voiceTranscriptPlaceholder: {
        paddingTop: '1rem',
        paddingBottom: '2rem',
        fontSize: '1.2em',
        fontStyle: 'italic',
        color: '#7c8684'
    },
    voiceStopButton: {
        color: theme.palette.text.titleText,
        transform: 'scale(1.4)'
    },
    stopButtonContainer: {
        paddingTop: '1rem'
    },
    stopButton: {
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        background: `${theme.palette.primary.main} !important`
    },
    animationBarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '5rem'
    },
    animationBar: {
        background: '#60D8C5',
        bottom: '0.063rem',
        height: '0.188rem',
        width: '0.625rem',
        margin: '0 0.25rem',
        borderRadius: '0.313rem',
        animation: 'sound 1ms -0.6s linear infinite alternate'
    },
    '@global @keyframes sound': {
        '0%': {
            opacity: '.35',
            height: '0.188rem'
        },
        '50%': {
            opacity: '1',
            height: '4.375rem'
        }
    },
    animationBar1: {
        left: '1px',
        animationDuration: '474ms'
    },
    animationBar2: {
        left: '15px',
        animationDuration: '433ms'
    },
    animationBar3: {
        left: '29px',
        animationDuration: '407ms'
    },
    animationBar4: {
        left: '43px',
        animationDuration: '458ms'
    },
    animationBar5: {
        left: '57px',
        animationDuration: '400ms'
    },
    animationBar6: {
        left: '71px',
        animationDuration: '427ms'
    },
    animationBar7: {
        left: '85px',
        animationDuration: '441ms'
    },
    animationBar8: {
        left: '99px',
        animationDuration: '419ms'
    },
    animationBar9: {
        left: '113px',
        animationDuration: '487ms'
    },
    animationBar10: {
        left: '127px',
        animationDuration: '442ms'
    }
}));

export default function ChatView({ ...props }) {
    const classNames = useStyles();
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState(
        props.messageList
            ? props.messageList
            : [
                  {
                      author: 'info',
                      text: 'Hi! I am your AI Assistant Ask NucliOS. I will answer your query here. You can type your question in the input bar below '
                  }
              ]
    );
    const vizMetaData = props.location?.state?.vizMetaData ? props.location.state.vizMetaData : [];
    const [visualizationList, setVisualizationList] = useState(vizMetaData);
    const [listening, setListening] = useState(false);
    const [speechRecongnition, setSpeechRecongnition] = useState(null);
    const [voices, setVoices] = useState([]);
    const tenantId = props.app_info?.modules.minerva.tenant_id;
    const [voiceInputFlag, setVoiceInputFlag] = useState(false);
    const messagesEndRef = useRef(null);

    const listVoices = () => {
        new Promise((resolve) => (window.speechSynthesis.onvoiceschanged = resolve)).then(() => {
            let voiceList = speechSynthesis.getVoices();
            setVoices(voiceList.find((v) => v.lang === 'en-GB'));
        });
    };

    const handleMessage = (message, voiceInput) => {
        if (voiceInput === true) {
            setVoiceInputFlag(true);
        }
        setMessageList((messageList) => [...messageList, { author: 'user', text: message }]);
        getProcessedQuestion({
            payload: {
                minervaAppId: tenantId,
                userQuery: message
            },
            callback: handleQueryResponse,
            failureCallback: handleFailureResponse
        });
        setMessage('');
    };

    const handleQueryResponse = (question, response) => {
        setMessageList((messageList) => [
            ...messageList,
            {
                author: 'minerva',
                text: response['output']['response']['text']
            }
        ]);
        if (response['output']['type'] === 'sql') {
            let chartList = response['output']['response']['chart_objects'].map((o) => o.name);
            setVisualizationList((visualizationList) => [
                ...visualizationList,
                {
                    question: question,
                    sqlQuery: response['output']['response']['sql_query'],
                    selectedChart: chartList[0],
                    chartList: chartList,
                    chartObject: response['output']['response']['chart_objects']
                }
            ]);
        }
    };

    useEffect(() => {
        if (visualizationList.length > 0) {
            props.setVizMetaData(visualizationList);
        }

        if (props.parent === 'chatBot') {
            props.setMessageList(messageList);
        }
    }, [visualizationList]);

    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    useEffect(() => {
        // Anything in here is fired on component mount.
        listVoices();
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return;
        }
        let recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        function onResult(event) {
            let tempString = '';
            for (let res = 0; res < event.results.length; res++) {
                tempString = tempString + event.results[res][0].transcript + '';
            }
            setMessage(tempString);
        }
        recognition.addEventListener('result', onResult);
        setSpeechRecongnition(recognition);
        return () => {
            // Anything in here is fired on component unmount.
            speechSynthesis.cancel();
        };
    }, []);

    const navigateBack = () => {
        props.history.goBack();
    };

    const handleFailureResponse = () => {
        setMessageList((messageList) => [
            ...messageList,
            {
                author: 'minerva',
                text: "I'm sorry, I did not understand that. Can you please try again."
            }
        ]);
    };

    const viewDetails = () => {
        props.history.push({
            pathname: '/app/' + props.app_info.id + '/ask-nuclios',
            state: { vizMetaData: visualizationList, messageList: messageList }
        });
    };

    const startRecognition = () => {
        setListening(true);
        speechRecongnition.start();
    };

    const stopRecognition = () => {
        handleInput(true);
        setListening(false);
        speechRecongnition.stop();
    };

    const exitSpeechToText = () => {
        speechRecongnition.stop();
        setListening(false);
        setMessage('');
    };

    const handleTextChange = (e) => {
        var searchString = e.target.value;
        setMessage(searchString);
    };

    const speech = (message) => {
        let voiceChoosen = voices;
        let utterance;
        speechSynthesis.cancel();
        utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = voiceChoosen;
        speechSynthesis.speak(utterance);
    };

    const keyPress = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleInput(false);
        }
    };

    const handleInput = (voiceInput) => {
        if (message !== '') {
            let inputMessage = message;
            if (voiceInput === true) {
                handleMessage(inputMessage, true);
            } else {
                handleMessage(inputMessage, false);
            }
            setMessage('');
        }
    };

    const getChatMessages = (messages) => {
        let temp = '';
        const chatItems = messages.map((msg, index) => {
            if (msg.author === 'user') {
                let flag = temp === 'user' ? false : true;
                temp = 'user';
                return <UserMessage key={index} text={msg.text} icon={flag} />;
            } else if (msg.author === 'minerva' && 'text' in msg) {
                if (voiceInputFlag === true) {
                    speech(msg.text);
                    setVoiceInputFlag(false);
                }
                let flag = temp === 'minerva' ? false : true;
                temp = 'minerva';
                return (
                    <MinervaMessage
                        key={index}
                        text={msg.text}
                        icon={flag}
                        parent={props.parent}
                        viewDetails={viewDetails}
                    />
                );
            } else if (props.parent === 'chatBot' && msg.author === 'info' && 'text' in msg) {
                let flag = temp === 'minerva' ? false : true;
                temp = 'minerva';
                return <MinervaMessage key={index} text={msg.text} icon={flag} />;
            } else if (msg.author === 'minerva' && 'recommendations' in msg) {
                return (
                    <RecommendationCards
                        key={index}
                        recommendations={msg.recommendations}
                        onClickFn={handleMessage}
                    />
                );
            }
        });
        return chatItems;
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Container className={classNames.container}>
            {props.parent === 'dashboard' ? (
                <Grid container>
                    <div className={classNames.exitBlock}>
                        <IconButton
                            aria-label="ArrowBackIos"
                            className={classNames.alignLeft}
                            onClick={() => navigateBack()}
                        >
                            <ArrowBackIos className={classNames.backIcon} />
                        </IconButton>
                        <span>Exit Details Screen</span>
                    </div>
                </Grid>
            ) : null}
            <Grid container spacing={1} className={classNames.chatContainer}>
                <div className={classNames.chatBody}>
                    {getChatMessages(messageList)}
                    <div ref={messagesEndRef} />
                </div>
            </Grid>

            {props.info === false || props.parent === 'dashboard' ? (
                listening === false ? (
                    <Grid container direction="row" spacing={1}>
                        <Grid item xs={10} align="center" style={{ display: 'flex' }}>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                fullWidth
                                inputProps={{ 'data-testid': 'query' }}
                                value={message}
                                className={classNames.textField}
                                InputProps={{
                                    classes: {
                                        input: classNames.resize
                                    }
                                }}
                                placeholder="Type your question here"
                                autoComplete="off"
                                onKeyDown={keyPress}
                                onChange={handleTextChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                aria-label="send-query"
                                onClick={() => {
                                    startRecognition();
                                }}
                                size="small"
                                className={classNames.btn}
                            >
                                <MicIcon className={classNames.MicIcon} />
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    <div className={classNames.voiceInput}>
                        <CloseIcon
                            className={classNames.voiceCloseButton}
                            onClick={exitSpeechToText}
                        />
                        {message.length > 0 ? (
                            <div className={classNames.voiceTranscript}>
                                <Typography className={classNames.voiceText}>
                                    {'"' + message + '"'}
                                </Typography>
                            </div>
                        ) : (
                            <div className={classNames.voiceTranscriptPlaceholder}>
                                <Typography className={classNames.voiceText}>
                                    Please ask your query
                                </Typography>
                            </div>
                        )}
                        <div className={classNames.animationBarContainer}>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar1}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar2}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar3}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar4}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar5}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar6}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar7}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar8}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar9}`}
                            ></div>
                            <div
                                className={`${classNames.animationBar} ${classNames.animationBar10}`}
                            ></div>
                        </div>
                        <div className={classNames.stopButtonContainer}>
                            <button
                                onClick={() => {
                                    stopRecognition();
                                }}
                                className={classNames.stopButton}
                            >
                                <StopIcon className={classNames.voiceStopButton} />
                            </button>
                        </div>
                    </div>
                )
            ) : (
                <span></span>
            )}
        </Container>
    );
}
