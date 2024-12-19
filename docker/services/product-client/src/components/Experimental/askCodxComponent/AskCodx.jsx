import React, { useEffect, useState } from 'react';
import {
    Typography,
    makeStyles,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ChatbotIcon from 'assets/Icons/Chatbot_ic';
import MarkdownRenderer from '../../MarkdownRenderer';
import SendPromptIcon from 'assets/Icons/SendPrompt';
import axios from 'axios';

const AskCodx = ({ params }) => {
    params = params.elements;
    const useStyles = makeStyles((theme) => ({
        root: {
            color: theme.palette.text.default,
            height: '100%',
            letterSpacing: '2px'
        },
        landingHolder: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingBottom: '1rem'
        },
        landingView: {
            paddingLeft: '25%',
            paddingRight: '25%',
            letterSpacing: '2px',
            textAlign: 'center',
            color: theme.palette.text.default
        },
        heading: {
            fontWeight: 500
        },
        subHeading: {
            fontWeight: 200,
            opacity: 0.85,
            marginTop: '1rem',
            letterSpacing: '2px'
        },
        suggestionContainer: {
            padding: '4rem 4rem 1rem 4rem',
            fontWeight: 200,
            fontSize: '3rem',
            letterSpacing: '2px',
            display: 'flex',
            flexDirection: 'column'
        },
        actionButton: {
            color: theme.palette.text.default,
            padding: '2rem',
            fontSize: '2rem',
            border: `1px solid  ${theme.palette.background.details}`,
            background: theme.palette.background.details,
            marginTop: '1rem',
            cursor: 'pointer'
        },
        iconHolder: {
            border: `1px solid ${theme.palette.text.default}`,
            height: '12rem',
            borderRadius: '100%',
            width: '12rem',
            marginBottom: '1rem',
            top: 0
        },
        promptContainer: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '80%',
            overflowY: 'scroll',
            padding: '3rem'
        },
        question: {
            minHeight: '1rem',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            position: 'relative',
            marginTop: '1rem',
            marginRight: '1rem'
        },
        answer: {
            height: 'auto',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            position: 'relative',
            marginTop: '2rem'
        },
        answerIcon: {
            position: 'absolute',
            width: '3rem',
            height: '3rem',
            left: '-3rem',
            top: '-2rem',
            paddingRight: '2rem',
            fill: theme.palette.text.contrastText
        },
        answerText: {
            backgroundColor: `${params?.params?.responseBackgroundColor || 'transparent'}`,
            height: 'auto',
            fontSize: `${params?.params?.responseFontSize || 1.35}rem`,
            minWidth: '50%',
            maxWidth: '60%',
            display: 'flex',
            alignItems: 'center',
            padding: '0rem 2rem 2rem 3rem',
            margin: '1rem 2rem 1rem 2rem',
            fontWeight: 'light',
            textAlign: 'justify',
            fontStyle: `${params?.params?.responseFontStyle || 'normal'}`
        },
        questionText: {
            backgroundColor: `${
                params?.params?.promptBackgroundColor || theme.palette.background.details
            }`,
            color: `${params?.params?.promptFontColor || theme.palette.text.default}`,
            height: '100%',
            minWidth: '50%',
            maxWidth: '60%',
            display: 'flex',
            alignItems: 'center',
            fontSize: `${params?.params?.promptFontSize || 2.25}rem`,
            borderTopRightRadius: '10rem',
            borderTopLeftRadius: '5rem',
            borderBottomLeftRadius: '5rem',
            padding: `${params?.params?.promptBoxSize || 2.5}rem`,
            margin: '0.5rem',
            fontWeight: 'light',
            fontStyle: `${params?.params?.promptFontStyle || 'normal'}`
        },
        profileIcon: {
            position: 'absolute',
            width: `${params?.params?.promptIconWidth || 3.5}rem`,
            height: `${params?.params?.promptIconHeight || 3.5}rem`,
            right: '-3.2rem',
            bottom: '-2.7rem',
            fill: `${params?.params?.promptIconColor || theme.palette.text.contrastText}`
        },
        skelton: {
            borderTopRightRadius: '10rem',
            borderTopLeftRadius: '5rem',
            borderBottomLeftRadius: '5rem',
            opacity: '40%',
            '&:after': {
                animation: 'MuiSkeleton-keyframes-wave 0.2s linear 0.5s infinite'
            }
        },
        loader: {
            width: '10rem',
            height: '3rem',
            position: 'relative',
            padding: '0.5rem',
            marginLeft: '1rem',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'space-between'
        },
        loader__dot: {
            float: 'left',
            width: '1.5rem',
            height: '1.5rem',
            background: theme.palette.text.contrastText,
            borderRadius: '50%',
            opacity: 0,
            animation: '$loadingFade 1s infinite',
            '&:nth-child(1)': {
                animationDelay: '0s'
            },
            '&:nth-child(2)': {
                animationDelay: '0.2s'
            },
            '&:nth-child(3)': {
                animationDelay: '0.4s'
            }
        },
        '@keyframes loadingFade': {
            '0%': {
                opacity: 0
            },
            '50%': {
                opacity: 0.8
            },
            '100%': {
                opacity: 0
            }
        },
        clearChat: {
            color: theme.palette.text.contrastText,
            fontSize: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 'auto',
            marginBottom: 'auto',
            cursor: 'pointer'
        },
        clearChatIcon: {
            width: '2rem',
            marginRight: '1rem',
            height: '2rem',
            fill: theme.palette.text.contrastText
        },
        formControl: {
            marginTop: '2rem',
            width: '100%',
            '& label.Mui-focused': {
                color: theme.palette.text.default,
                fontSize: '2rem'
            },
            '& label': {
                fontSize: '1.5rem',
                color: theme.palette.text.default
            },
            '& .MuiSvgIcon-root': {
                fontSize: '25px',
                color: theme.palette.text.titleText
            },
            marginBottom: '1rem'
        },
        selectEmpty: {
            color: theme.palette.text.default,
            fontSize: '1.5rem',
            backgroundColor: theme.palette.background.details
        },
        promptHolder: {
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            width: '100%',
            minHeight: '6rem',
            marginTop: 'auto',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            backgroundColor: theme.palette.background.details
        },
        inputField: {
            minWidth: '95%',
            width: 'auto',
            fontSize: '1.8rem',
            backgroundColor: theme.palette.background.details,
            color: theme.palette.text.default,
            border: 'none',
            '&::placeholder': {
                color: theme.palette.text.default,
                opacity: 0.75
            },
            '&:focus': {
                outline: 'none'
            },
            marginRight: '1rem'
        },
        sendIcon: {
            position: 'absolute',
            right: '2rem',
            cursor: 'pointer',
            paddingRight: '1rem',
            paddingLeft: '1rem',
            top: 10
        }
    }));
    const classes = useStyles();
    const username = sessionStorage.getItem('user_name');
    const suggestions = params.options;
    const [openChat, setOpenChat] = useState(false);
    const [chatQuestions, setChatQuestions] = useState([]);
    const [chatAnswers, setChatAnswers] = useState([]);

    const OpenChat = (label) => {
        //handling empty prompts
        if ((label?.suggestion || label).trim() !== '') {
            let questionArray = [...chatQuestions];
            questionArray.push(label?.suggestion || label);
            setChatQuestions(questionArray);
            setOpenChat(true);
            fetchResult(label?.prompt || label?.suggestion || label);
        }
    };

    const clearChat = () => {
        let questionArray = [];
        let answerArray = [];
        setChatQuestions(questionArray);
        setChatAnswers(answerArray);
    };

    const fetchResult = async (prompt) => {
        let url = params?.url || 'https://gai-experimentation.azurewebsites.net/query';
        let data = { query: prompt };
        let body = JSON.stringify(data);
        let chatAnswersArray = [...chatAnswers];
        await axios
            .post(url, body, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((response) => {
                if (response.status == 200) {
                    const jsonData = response.data;
                    let result = jsonData.response.result;
                    //handling incomplete responses
                    let index = result.lastIndexOf('.');
                    let isNum = !isNaN(result[index - 1]);
                    if (isNum && result[index - 2] == '\n') {
                        let newIndex = result.slice(0, index - 2).lastIndexOf('.');
                        result = result.slice(0, newIndex + 1);
                    } else {
                        result = result.slice(0, index + 1);
                    }
                    chatAnswersArray.push(result.replace('<|im_end|>', ''));
                } else {
                    chatAnswersArray.push('Cannot find the result for your prompt.');
                }
                setChatAnswers(chatAnswersArray);
            })
            .catch(() => {});
    };
    const handleDropDown = (prompt) => {
        if (prompt !== '') OpenChat(prompt);
    };

    const ActionButton = (props) => {
        return (
            <button onClick={() => OpenChat(props.label)} className={classes.actionButton}>
                {props.label.suggestion}
            </button>
        );
    };

    const PromptComponent = () => {
        const [promptText, setPromptText] = useState('');
        const iconColor =
            localStorage.getItem('codx-products-theme') === 'light'
                ? params?.params?.iconColorLight || '#3277B3'
                : params?.params?.iconColor || '#6DF0C2';
        const handleChange = (event) => {
            setPromptText(event.target.value);
        };
        {
            /* ask prompt */
        }
        return (
            <div className={classes.promptHolder}>
                <input
                    className={classes.inputField}
                    placeholder={params?.params?.promptLabel || 'Ask co.dx'}
                    value={promptText}
                    onChange={handleChange}
                />
                <span onClick={() => OpenChat(promptText)} className={classes.sendIcon}>
                    <SendPromptIcon
                        height={params?.params?.sendIconHeight || null}
                        width={params?.params?.sendIconWidth || null}
                        color={iconColor}
                    />
                </span>
            </div>
        );
    };

    const ChatComponent = () => {
        {
            /* chat section */
        }
        return (
            <div className={classes.promptContainer} id="scrollContainer">
                <div onClick={clearChat} className={classes.clearChat}>
                    <CancelIcon className={classes.clearChatIcon} />
                    Clear Chat
                </div>
                {chatQuestions.map((value, index) => (
                    <div
                        key={'chatQuestions' + index}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div className={classes.question}>
                            <p className={classes.questionText}>{value}</p>
                            <AccountCircleIcon className={classes.profileIcon} />
                        </div>
                        {chatAnswers[index] ? (
                            <div className={classes.answer}>
                                <p className={classes.answerText}>
                                    {/* {chatAnswers[index]} */}
                                    <MarkdownRenderer markdownContent={chatAnswers[index]} />
                                </p>
                                <span className={classes.answerIcon}>
                                    <ChatbotIcon
                                        teritiaryColor={
                                            params?.params?.responseIconTeritiaryColor || null
                                        }
                                        secondaryColor={
                                            params?.params?.responseIconSecondaryColor || null
                                        }
                                        color={params?.params?.responseIconColor || null}
                                        width={params?.params?.responseIconWidth || '45'}
                                        heihgt={params?.params?.responseIconHeight || '45'}
                                    />
                                </span>
                            </div>
                        ) : (
                            <div className={classes.loader}>
                                <div className={classes.loader__dot}></div>
                                <div className={classes.loader__dot}></div>
                                <div className={classes.loader__dot}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    useEffect(() => {
        let scrollBody = document.querySelector('#scrollContainer');
        if (scrollBody) scrollBody.scrollTop = scrollBody.scrollHeight - scrollBody.clientHeight;
    }, [chatQuestions, chatAnswers]);

    return (
        <div className={classes.landingHolder}>
            {openChat ? (
                <React.Fragment>
                    <ChatComponent />
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="common-question-dropdown">Common Questions</InputLabel>
                        <Select
                            labelId="common-question-dropdown"
                            id="common-question-dropdown"
                            label="Age"
                            className={classes.selectEmpty}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {suggestions?.map((question, i) => (
                                <MenuItem
                                    key={'suggestions' + i}
                                    onClick={() => handleDropDown(question)}
                                    value={question?.prompt || question.suggestion}
                                >
                                    {question.suggestion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </React.Fragment>
            ) : (
                <div className={classes.landingView}>
                    <ChatbotIcon
                        teritiaryColor={params?.params?.chatbotIconTeritiaryColor || null}
                        secondaryColor={params?.params?.chatbotIconSecondaryColor || null}
                        color={params?.params?.chatbotIconColor || null}
                        className={classes.iconHolder}
                    />
                    <Typography className={classes.heading} variant="h2">
                        {params?.params?.MainHeading || 'Hey! Good Morning'} {username}
                    </Typography>
                    <Typography className={classes.subHeading} variant="h3">
                        {params?.params?.SubHeading ||
                            "I am Co.dx Ask - Your Intelligent Conversational Assistant. I'm here to Empower Data Professionals with AI-Powered Insights and Expertise"}
                    </Typography>
                    <div className={classes.suggestionContainer}>
                        <p>
                            {params?.params?.SuggestionHeading || 'You can ask me questions like :'}
                        </p>
                        {suggestions?.map((value, i) => (
                            <ActionButton key={'suggestions2' + i} label={value} />
                        ))}
                    </div>
                </div>
            )}
            <PromptComponent />
        </div>
    );
};

export default AskCodx;
