import { makeStyles, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import loginLayoutStyles from './styles';
import Nuclios from 'components/Nuclios/assets/Nuclios';
import { useTheme } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Footer from 'components/Footer';
import clsx from 'clsx';

const useStyles = makeStyles(loginLayoutStyles);
let listenersAdded = false;
const LoginLayout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    useEffect(() => {
        if (!listenersAdded) {
            listenersAdded = true;
            document.body.addEventListener('click', handleBodyClick);
            try {
                window.zE('webWidget', 'hide');
                if (window.zE) {
                    window.zE('webWidget', 'updateSettings', {
                        position: { horizontal: 'left', vertical: 'bottom' }
                    });
                }
                window.zE('webWidget:on', 'close', () => {
                    // window.zE('webWidget', 'hide');
                    const state = window.zE('webWidget:get', 'display');
                    if (state == 'launcher') {
                        window.zE('webWidget', 'reset');
                        window.zE('webWidget', 'hide');
                    } else {
                        window.zE('webWidget', 'hide');
                    }
                });
            } catch (err) {
                console.error('Error while adding helpdesk service', err);
            }
        }

        return () => {
            //we are closing the helpdesk widget if the navbar is unmounted...
            if (typeof window.zE === 'function') {
                try {
                    if (window.zE) {
                        window.zE('webWidget', 'updateSettings', {
                            position: { horizontal: 'right', vertical: 'top' }
                        });
                    }
                    window.zE('webWidget', 'close');
                } catch (err) {
                    console.error('Error toggling the web widget:', err);
                }
                // We can remove the zendesk listeners here, if the API supports it in the future.
            }
            //we are removing the click listener
            document.body.removeEventListener('click', handleBodyClick);
            listenersAdded = false;
        };
    }, []);

    const handleBodyClick = (event) => {
        let launcherIframe = document.getElementById('webWidget');
        let helpButton = document.querySelector('.helpButton');

        if (event.target === launcherIframe || launcherIframe?.contains(event.target)) {
            //we don't want anything to happen if the click was made inside the launcher or widget, we just stop the event propogation
            event.stopPropagation();
            return;
        }
        if (helpButton && !helpButton.contains(event.target)) {
            //this is when  the click truly occurs outside i.e outside both, the help button and the zendesk widget
            //we will now close the widget
            window.zE('webWidget', 'close');
            event.stopPropagation();
        }
    };

    const handleHelpIconClick = () => {
        //as we are hiding the original launcher inside  pageInit file.. we must show it before toggling to open
        if (window.zE) {
            window.zE('webWidget', 'show');
            setTimeout(() => {
                window.zE('webWidget', 'toggle');
            }, 1000);
        } else {
            console.warn('Zendesk widget is not initialized yet.');
        }
    };
    return (
        <div className={classes.redesignLayoutContainer}>
            <Grid container className={classes.topSection}>
                <Grid item xs={8} className={classes.leftContainer}>
                    <div className={`${classes.borderTopContainer} ${classes.logoContainer}`}>
                        <div className={classes.separatorContainer}>
                            <span className={classes.codxLogo}>
                                {' '}
                                <Nuclios
                                    alt="Nuclios-logo"
                                    color={theme.palette.primary.contrastText}
                                />
                            </span>
                            <div className={classes.separatorVerticalTransparent}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4} className={classes.rightContainer}>
                    <div className={classes.borderTopContainer}>
                        <div className={classes.separatorContainerRight}>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                            <div className={classes.separatorVertical}></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container className={classes.midSection}>
                <Grid item xs={8} className={classes.leftContainer}>
                    <div className={`${classes.borderTopContainer} ${classes.titleContainer}`}>
                        <div className={classes.gridsContainer}>
                            {/* <div className={classes.leftGridsTop}></div> */}
                            <div className={classes.separatorContainerMidSection}>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                            </div>
                            <div className={classes.separatorHorizontalContainer}>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                            </div>
                        </div>
                        <div className={classes.textHolder}>
                            <Typography className={classes.loginTitle}>
                                Helping enterprises across <br></br>
                                industries to own their intelligence
                            </Typography>
                            <Typography className={classes.loginSubTitle}>
                                An AI-powered platform with fully customisable
                                <span className={classes.gapProvider}>{}</span>
                                frameworks to build data products for powerful business integration
                            </Typography>
                        </div>

                        <div className={classes.gridsContainerBottom}>
                            {/* <div className={classes.leftGrids} style={{'--marginBottom':'-0.2rem'}}></div> */}
                            <div className={classes.separatorHorizontalContainer}>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                                <div className={classes.separatorHorizontal}></div>
                            </div>
                            <div className={classes.separatorContainerMidSectionBottom}>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                                <div className={classes.separatorVertical}></div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4} className={classes.rightContainer}>
                    <div className={classes.borderTopContainer}>
                        <div
                            className={`${classes.formContainer} ${classes.redesignFormContainer}`}
                        >
                            {children}
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container className={classes.bottomSection}>
                <Grid item xs={8} className={classes.leftContainer}>
                    <div
                        className={`${classes.borderTopContainer} ${classes.borderBottomContainer} ${classes.helpContainer}`}
                    >
                        <div className={classes.separatorContainerBottom}>
                            <div
                                onClick={() => handleHelpIconClick()}
                                className={clsx(classes.helpIconHolder, 'helpButton')}
                            >
                                <HelpOutlineIcon className={classes.helpIcon} />
                                <Typography className={classes.helpText}>Help</Typography>
                            </div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4} className={classes.rightContainer}>
                    <div
                        className={`${classes.borderTopContainer} ${classes.borderBottomContainer}`}
                    >
                        <div className={classes.separatorContainerRight}>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                            <div className={classes.separatorVerticalBottom}></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <Footer login={true} />
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginLayout;
