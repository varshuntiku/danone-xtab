import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Box } from '@material-ui/core';
import LoginFormSSO from '../Forms/LoginFormSSO';
import LoginFormEmail from '../Forms/LoginFormEmail';
import { ReactComponent as CodxLogo } from 'assets/img/codx-new-logo.svg';

import { ReactComponent as PrismLogo } from 'assets/img/prism_white_logo.svg';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'div'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`
    };
}

function LinkTab(props) {
    return (
        <Tab
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        // height: "calc(100% - " + theme.spacing(10) + ")",
        '& a svg': {
            fill: theme.palette.primary.contrastText,
            height: theme.spacing(4)
        }
    },
    tabContainer: {
        // height: '100%'
        // height: "calc(100% - " + theme.spacing(40) + ")",
        '& .MuiBox-root': {
            padding: '2.4rem 0 !important'
        }
    },
    root: {
        flexGrow: 1,
        paddingTop: theme.spacing(2)
    },
    loginLogo: {},
    loginTitle: {
        color: theme.palette.primary.contrastText,
        fontWeight: 300,
        fontSize: theme.spacing(2),
        lineHeight: theme.spacing(2.5),
        letterSpacing: theme.spacing(2),
        paddingLeft: '5px'
    },
    scroller: {
        borderBottom: '1px solid ' + theme.palette.primary.contrastText + ' !important'
    },
    indicator: {
        height: theme.spacing(0.5),
        margin: theme.spacing(0.25, 1),
        backgroundColor: theme.palette.primary.contrastText
    },
    activeText: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(2),
        fontWeight: 700
    },
    deactiveText: {
        color: theme.palette.text.default,
        fontSize: theme.spacing(2),
        fontWeight: 700
    }
}));

export default function NavTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.container}>
            <Link to={'/dashboard'}>
                {props.selected_industry && props.selected_industry === 'Revenue Management' ? (
                    <PrismLogo className={classes.loginLogo} alt="customer logo" />
                ) : (
                    <CodxLogo className={classes.loginLogo} alt="customer logo" />
                )}
            </Link>
            <Typography className={classes.loginTitle}>LOGIN</Typography>
            <Tabs
                variant="fullWidth"
                value={value}
                elevation={0}
                // indicatorColor="primary"
                onChange={handleChange}
                aria-label="Login options"
                // className={classes.tabs}
                classes={{
                    root: classes.root,
                    scroller: classes.scroller,
                    indicator: classes.indicator
                }}
            >
                <LinkTab
                    label="SSO"
                    {...a11yProps(0)}
                    className={value === 0 ? classes.activeText : classes.deactiveText}
                />
                <LinkTab
                    label="email Id"
                    {...a11yProps(1)}
                    className={value === 1 ? classes.activeText : classes.deactiveText}
                />
            </Tabs>
            <TabPanel className={classes.tabContainer} value={value} index={0}>
                <LoginFormSSO
                    history={props.history}
                    selected_industry={props.selected_industry}
                    selected_app_id={props.selected_app_id}
                />
            </TabPanel>
            <TabPanel className={classes.tabContainer} value={value} index={1}>
                <LoginFormEmail
                    history={props.history}
                    selected_industry={props.selected_industry}
                    selected_app_id={props.selected_app_id}
                />
            </TabPanel>
        </div>
    );
}
