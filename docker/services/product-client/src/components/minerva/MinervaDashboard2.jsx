import React, { useContext, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import { grey } from '@material-ui/core/colors';
// import QueryInput from './QueryInput';
// import QueryOutput from './QueryOutput';
// import ConversationWindows from './ConversationWindows';
import { CustomThemeContext } from 'themes/customThemeContext';
import { AuthContext } from 'auth/AuthContext';
import backImg from 'assets/img/Nuclios_Background.svg';
import darkBackground from 'assets/img/minerva-dark-bg.png';

const useStyles = makeStyles((theme) => ({
    minervaDashboardRoot: {
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${theme.layoutSpacing(10)})`,
        overflow: 'hidden',
        position: 'relative',
        top: theme.layoutSpacing(-10),
        '& minerva-wc': {
            height: '100%',
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
        }
    }
}));

export default function MinervaDashboard2({ ...props }) {
    const classes = useStyles();
    const { theme, plotTheme } = useContext(CustomThemeContext);
    const { getToken } = useContext(AuthContext);
    const userName = sessionStorage.getItem('user_name');
    const message = `Hey ${userName}`;
    const minervaRef = useRef();
    const copilot_id =
        import.meta.env['REACT_APP_ENABLE_COPILOT'] && props.app_info?.modules?.copilot?.enabled
            ? props.app_info?.modules?.copilot?.app_id
            : '';
    let minerva_app_id = '';
    if (!copilot_id) {
        minerva_app_id =
            import.meta.env['REACT_APP_ENABLE_MINERVA'] && props.app_info?.modules?.minerva?.enabled
                ? props.app_info?.modules?.minerva?.tenant_id
                : '';
    }

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

    const goBack = () => {
        props.history.push({
            pathname: '/app/' + props.app_info.id
        });
    };

    const key = copilot_id + '-' + minerva_app_id;
    useEffect(() => {
        if (minervaRef.current) {
            minervaRef.current.auth_token_getter = auth_token_getter;
            minervaRef.current.addEventListener('external:go-back', goBack);
        }
        return () => {
            if (minervaRef.current) {
                minervaRef.current?.removeEventListener('popper:go-back', goBack);
                minervaRef.current.auth_token_getter = '';
            }
        };
    }, [key]);

    return (
        <div className={classes.minervaDashboardRoot}>
            <minerva-wc
                key={key}
                data-testid="minerva-wc"
                app_id={minerva_app_id}
                copilot_app_id={copilot_id}
                skip_loading_plotly={true}
                theme_values={theme_values}
                load_from_cache={true}
                ref={minervaRef}
                empty_state_message_greet={message}
                server_url={
                    props?.app_info?.modules?.minerva?.server_url ||
                    import.meta.env['REACT_APP_MINERVA_BACKEND_URL']
                }
                variant="fullscreen"
                external_go_back={true}
            ></minerva-wc>
        </div>
    );

    // return (
    //     <div className={classes.minervaDashboardRoot}>
    //         <div className={classes.headerPannel}>
    //             <Grid container spacing={2}>
    //                 <Grid sm xs="auto" item>
    //                     <Link component={'button'} onClick={props.history.goBack}>
    //                         <ArrowBackIcon />
    //                         Go back
    //                     </Link>
    //                 </Grid>
    //                 <Grid xs={9} item>
    //                     <Typography variant="h1" className={classes.pageHeader} align="center">
    //                         Minerva
    //                     </Typography>
    //                 </Grid>
    //             </Grid>
    //         </div>
    //         <Grid container spacing={2} className={classes.main}>
    //             <Grid sm xs="auto" item>
    //                 <ConversationWindows
    //                     minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
    //                 />
    //             </Grid>

    //             <Grid xs={9} item>
    //                 <div className={classes.chatSection}>
    //                     <div style={{ flex: 1, maxHeight: 'calc(100vh - 25rem)' }}>
    //                         <QueryOutput
    //                             appId={props.app_info?.id}
    //                             minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
    //                         />
    //                     </div>
    //                     <div style={{ padding: '0 10rem' }}>
    //                         <QueryInput
    //                             minervaAppId={props.app_info?.modules?.minerva?.tenant_id}
    //                         />
    //                     </div>
    //                 </div>
    //             </Grid>
    //         </Grid>
    //     </div>
    // );
}
