import React, { useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { CustomThemeContext } from 'themes/customThemeContext';
import { AuthContext } from 'auth/AuthContext';
import backImg from 'assets/img/Nuclios_Background.svg';
import darkBackground from 'assets/img/minerva-dark-bg.png';

const useStyles = makeStyles((theme) => ({
    minervaWrapper: {
        height: '100%',
        '& minerva-wc': {
            fontSize: theme.layoutSpacing(16)
        },
        '& .MinervaFont-2': {
            fontFamily: 'Graphik Compact'
        },
        '& .MinervaButton': {
            fontFamily: 'Graphik Compact'
        },
        '& .MinervaWC .MinervaPopperDialog': {
            top: '100% !important',
            transform: 'translateY(-100%) !important'
        },
        '& .MinervaWC dialog[open].MinervaPopperDialog:not(.MinervaPopperDialog-expanded)': {
            marginLeft: theme.layoutSpacing(-12),
            marginTop: theme.layoutSpacing(-4)
        },
        '& .MinervaFullScreen-chat-section': {
            backgroundImage: `url(${
                theme.props.mode === 'light' ? backImg : darkBackground
            }) !important`,
            backgroundSize: 'cover !important',
            backgroundPosition: 'center !important',
            backgroundRepeat: 'no-repeat !important'
        },
        '& .MinervaPopper-floater-btn': {
            position: 'static !important',
            background: theme.palette.primary.dark + ' !important',
            boxShadow: 'none !important',
            transitionDuration: '500ms !important',
            '& svg': {
                fill: theme.palette.primary.contrastText + ' !important'
            }
        },
        '& .MinervaPopper-trigger-btn': {
            width: 'max-content'
        }
    }
}));

function Preview({ match, history }) {
    const classNames = useStyles();

    const copilotAppId = match.params.copilot_app_id;
    const userName = sessionStorage.getItem('user_name');
    const greet_message = `Hey ${userName}`;

    const { theme, plotTheme } = useContext(CustomThemeContext);
    const { getToken } = useContext(AuthContext);
    const minervaRef = useRef();

    const theme_values = JSON.stringify({
        bgMain: theme.palette.primary.dark,
        bgSecondaryBlue: theme.palette.background.menuItemFocus,
        bgSecondaryLightBlue: theme.palette.background.navLinkBackground,
        borderBlue: theme.palette.border.inputOnFoucs,
        textColor: theme.palette.text.default,
        contrastColor: theme.palette.primary?.contrastText,
        fontFamily: theme.typography?.fontFamily,
        chartColors: plotTheme?.chartDefaultColors?.['range-10'],
        mode: theme.props?.mode
    });

    const auth_token_getter = async () => {
        let token = localStorage.getItem('local.access.token.key');
        if (token) {
            return token;
        } else {
            return await getToken();
        }
    };

    const setMinervaRef = (ref) => {
        if (ref && minervaRef.current !== ref) {
            minervaRef.current = ref;
            minervaRef.current.auth_token_getter = auth_token_getter;
        }
    };

    const handleGoBack = () => {
        history.goBack();
    };

    useEffect(() => {
        if (minervaRef.current) {
            minervaRef.current.auth_token_getter = auth_token_getter;
            minervaRef.current.addEventListener('external:go-back', handleGoBack);
        }
        return () => {
            if (minervaRef.current) {
                minervaRef.current.removeEventListener('external:go-back', handleGoBack);
                minervaRef.current.auth_token_getter = '';
            }
        };
    }, []);

    if (!copilotAppId) {
        return null;
    }

    return (
        <div className={classNames.minervaWrapper}>
            <minerva-wc
                variant="fullscreen"
                copilot_app_id={copilotAppId}
                server_url={import.meta.env['REACT_APP_MINERVA_BACKEND_URL']}
                ref={setMinervaRef}
                empty_state_message_greet={greet_message}
                init_with_new_window={true}
                theme_values={theme_values}
                external_go_back={true}
            ></minerva-wc>
        </div>
    );
}

export default withRouter(Preview);
