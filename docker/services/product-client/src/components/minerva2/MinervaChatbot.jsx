import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Typography, alpha } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import backImg from 'assets/img/connChatPopUpBackground.jpg';
import QueryInput from './QueryInput';
import QueryOutput from './QueryOutput';
import { grey } from '@material-ui/core/colors';
// import RemoveIcon from '@material-ui/icons/Remove';
// import { ReactComponent as AskNucliOS } from 'assets/img/askNuclios.svg';
// import { ReactComponent as CloseIcon } from 'assets/img/connCloseIcon.svg';
// import { ReactComponent as ExpandIcon } from 'assets/img/connExpandIcon.svg';
import MinervaChatbot2 from '../minerva/MinervaChatbot';

// const emails = ['username@gmail.com', 'user02@gmail.com'];

const useStyles = makeStyles((theme, themeMode = localStorage.getItem('codx-products-theme')) => ({
    dialogSize: {
        width: theme.layoutSpacing(555),
        height: theme.layoutSpacing(798),
        position: 'absolute',
        bottom: '2px',
        left: '2px',
        margin: '0',
        overflow: 'visible',
        border: `2px solid ${theme.palette.text.connNucliosBorder}`,
        borderRadius: theme.layoutSpacing(8)
    },
    root: {
        zIndex: '999999 !important'
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
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#6DF0C2' : '#4560D7',
        textTransform: 'capitalize',
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
    buttonIcon: {
        padding: 0,
        marginRight: 0
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
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    chatHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${alpha(grey[500], 0.2)}`,
        '& svg': {
            color: theme.palette.text.default
        },
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(16),
        paddingTop: theme.layoutSpacing(20),
        paddingBottom: theme.layoutSpacing(20),
        height: theme.layoutSpacing(64),
        backgroundColor: theme.palette.background.white
    },
    title: {
        fontSize: theme.layoutSpacing(18),
        color: theme.palette.text.default,
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(21.6),
        letterSpacing: theme.layoutSpacing(0.5),
        fontFamily: theme.title.h1.fontFamily
    },
    chatBody: {
        flex: '1',
        overflow: 'hidden',
        height: '16rem',
        marginTop: theme.layoutSpacing(24),
        maxHeight: theme.layoutSpacing(230)
    },
    chatInput: {
        marginTop: theme.layoutSpacing(30),
        marginRight: theme.layoutSpacing(24),
        marginLeft: theme.layoutSpacing(20)
    },
    windowName: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.5),
        marginLeft: '1.6rem'
    },
    contentBoxSuggestion: {
        width: '97%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(24),
        marginTop: theme.layoutSpacing(110),
        marginLeft: theme.layoutSpacing(45)
    },
    contentBoxSuggestionHeader: {
        height: '3rem',
        width: '100%',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(18),
        fontWeight: 500,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: '0.5px',
        lineHeight: theme.layoutSpacing(21.6)
    },
    contentBoxSuggestionMain: {
        width: '100%',
        display: 'flex'
    },
    contentBoxRecommendSolutionContent: {
        width: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16),
        marginLeft: theme.layoutSpacing(20)
    },
    suggestionOption: {
        borderRadius: theme.layoutSpacing(50),
        backgroundColor: themeMode === 'dark' ? '#091F3A' : alpha(theme.palette.primary.light, 0.5),
        border: `1px solid ${theme.palette.background.white}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        textAlign: 'center',
        letterSpacing: theme.layoutSpacing(0.5),
        fontWeight: 400,
        width: 'fit-content',
        paddingBottom: theme.layoutSpacing(16),
        paddingTop: theme.layoutSpacing(16),
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(24),
        boxShadow: `1px 1px 1px 1px ${theme.palette.background.connBoxShadow}`,
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: theme.layoutSpacing(16.8)
    },
    verticalLine: {
        height: 'inherit',
        minWidth: theme.layoutSpacing(3),
        borderRadius: '99px',
        marginLeft: theme.layoutSpacing(-25),
        background: 'linear-gradient(180deg, #FFA497 0%, #4788D8 100%)'
    },
    secondSection: {
        backgroundImage: `url(${backImg})`,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    askLogo: {
        width: '2.4rem',
        height: '2.4rem',
        fill: theme.palette.text.default
    },
    minerva: {
        display: 'flex',
        padding: '8px 12px',
        border: `1px solid ${theme.palette.text.default}30`,
        borderRadius: '44px',
        gap: '1rem',
        alignItems: 'center',
        width: 'fit-content',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    minervaHidden: {
        cursor: 'pointer',
        padding: '8px',
        border: `1px solid ${theme.palette.text.default}30`,
        borderRadius: '44px',
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    minerva_text: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: '500',
        lineHeight: '2.1rem',
        letterSpacing: '1px'
    },
    drawerCollapseHidden: {
        display: 'none'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.layoutSpacing(18)
    }
}));

const env = import.meta.env['REACT_APP_ENV'].toLowerCase();
const getAppIdByEnv = () => {
    let val = 115;
    // TODO
    // Change minerva app_id values for qa and uat.
    switch (env) {
        case 'dev':
            val = 115;
            break;
        case 'qa':
            val = 115;
            break;
        case 'uat':
            val = 115;
            break;
        case 'prod':
            val = 242;
            break;
        default:
            val = 115;
    }
    return val;
};

const appIdByEnv = getAppIdByEnv();

const json = [
    {
        id: 1,
        text: 'How can I create a plan based on the outcome',
        app_id: appIdByEnv
    },
    {
        id: 2,
        text: 'How can I alert the owner of the decision',
        app_id: appIdByEnv
    },
    {
        id: 3,
        text: 'Investigate to analyze',
        app_id: appIdByEnv
    }
];

function ChatPopup(props) {
    const classNames = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const navigateToMinervaDashboard = () => {
        window.open('/app/' + json[0].app_id, '_blank');
        // props.history.push({
        //     pathname: '/app/' + json[0].app_id + '/minerva-v2'
        // });
    };

    const handleClick = (obj) => {
        // if (obj?.app_id) {
        //     if (typeof window !== undefined) window.open(`${window.location.origin}/app/${obj.app_id}/minerva-v2`, '_self');
        // }
        if (obj?.app_id) {
            window.open('/app/' + obj.app_id, '_blank');
            // props.history.push({
            //     pathname: '/app/' + obj.app_id + '/minerva-v2'
            // });
        }
    };

    return (
        <Dialog
            classes={{
                paper: classNames.dialogSize,
                root: classNames.root
            }}
            onClose={handleClose}
            aria-labelledby="minerva-dialog-title"
            open={open}
        >
            <div className={classNames.chatBoxContainer}>
                <div className={classNames.chatHeader}>
                    <div>
                        <Typography variant="h4" className={classNames.title}>
                            Ask Nuclios
                        </Typography>
                    </div>
                    {/* <div className={classNames.actions}>
                        <IconButton
                            size="medium"
                            title="minimize"
                            className={classNames.buttonIcon}
                        >
                            <RemoveIcon fontSize="large" />
                        </IconButton>
                        <IconButton
                            size="medium"
                            onClick={navigateToMinervaDashboard}
                            title="Open minerva on full screen"
                            aria-label="full-screen"
                            className={classNames.buttonIcon}
                        >
                            <ExpandIcon />
                        </IconButton>
                        <IconButton onClick={handleClose} className={classNames.buttonIcon}>
                            <CloseIcon />
                        </IconButton>
                    </div> */}
                </div>
                <div
                    style={{ display: 'flex', flexDirection: 'column' }}
                    className={classNames.secondSection}
                >
                    <div className={classNames.chatBody}>
                        <QueryOutput
                            appId={props.app_info?.id}
                            minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
                            showPeriod={false}
                            chatPopperView
                            navigateToMinervaDashboard={navigateToMinervaDashboard}
                        />
                    </div>
                    <div className={classNames.contentBoxSuggestion}>
                        <div className={classNames.contentBoxSuggestionHeader}>
                            Recommended Questions
                        </div>
                        <div className={classNames.contentBoxSuggestionMain}>
                            <div className={classNames.verticalLine}></div>
                            <div className={classNames.contentBoxRecommendSolutionContent}>
                                {json &&
                                    json.map((element, index) => (
                                        <div
                                            key={element.id + ' ' + index}
                                            className={classNames.suggestionOption}
                                            onClick={() => handleClick(element)}
                                        >
                                            {element.text}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className={classNames.chatInput}>
                        <QueryInput />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

ChatPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
};

function MinervaChatbot() {
    // const classNames = useStyles();
    // const [open, setOpen] = React.useState(false);
    // const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = (value) => {
    //     setOpen(false);
    //     setSelectedValue(value);
    // };

    return (
        // <div>
        //     <div
        //         className={!props.hideSideBar ? classNames.minerva : classNames.minervaHidden}
        //         onClick={handleClickOpen}
        //         aria-label="minerva"
        //     >
        //         <AskNucliOS className={classNames.askLogo} />
        //         {!props?.noLabel && (
        //             <Typography
        //                 className={
        //                     !props.hideSideBargit
        //                         ? classNames.minerva_text
        //                         : classNames.drawerCollapseHidden
        //                 }
        //             >
        //                 Ask NucliOSssssss
        //             </Typography>
        //         )}
        //     </div>
        //     <ChatPopup {...props} selectedValue={selectedValue} open={open} onClose={handleClose} />
        // </div>

        // TODO: Remove env === prod condition after demo release
        <MinervaChatbot2
            app_info={{
                modules: {
                    minerva: {
                        enabled: true,
                        tenant_id: env === 'prod' ? 115 : appIdByEnv,
                        server_url:
                            env === 'prod' ? 'https://nuclios-minerva-dev.mathco.com' : undefined
                    }
                }
            }}
        />
    );
}

export default withRouter(MinervaChatbot);
