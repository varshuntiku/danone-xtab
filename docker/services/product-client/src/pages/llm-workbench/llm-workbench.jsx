import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
    makeStyles,
    Box,
    CssBaseline,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography
} from '@material-ui/core';
import { ArrowBackIos, Assignment, DataUsage, Launch, Tune } from '@material-ui/icons';
import Navbar from 'components/NavBar';
import PageNotFound from 'components/PageNotFound';
import LLMWorkbenchDashboard from 'pages/llm-workbench/dashboard';
// import DataQualityPage from 'pages/llm-workbench/data-quality';
import style from 'assets/jss/llmWorkbench/homeStyle';
import NucliosBox from 'components/NucliosBox';

const pages = [
    {
        title: 'Add and validate data',
        icon: DataUsage,
        link: '/llmworkbench'
    },
    {
        title: 'Finetune',
        icon: Tune,
        link: '/llmworkbench/finetunedmodels'
    },
    {
        title: 'Deploy base models',
        icon: Launch,
        link: '/llmworkbench/models'
    },
    {
        title: 'View deployed models',
        icon: Assignment,
        link: '/llmworkbench/deployments'
    }
];

const useStyles = makeStyles(style);

const AccessDenied = () => {
    const classes = useStyles();
    return (
        <Box display="flex" flexDirection="column" height={'100vh'} className={classes.container}>
            <Box width={'100%'}>
                <Navbar />
            </Box>
            <PageNotFound message="You don't have access to this page" />
        </Box>
    );
};

const Landing = (props) => {
    const classes = useStyles();
    const navigate = (pathname) => {
        props.history.push({
            pathname
        });
    };
    const backNavigate = () => {
        navigate('/platform-utils');
    };
    return (
        <div>
            <CssBaseline />
            <Navbar />
            <div className={classes.body}>
                <div className={classes.heading}>
                    <div className={classes.backIcon} onClick={backNavigate}>
                        <ArrowBackIos />
                    </div>
                    <span>LLM Workbench</span>
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.gridBody}>
                        <Grid container className={classes.container}>
                            {pages.map((page, index) => {
                                const Icon = page.icon;
                                const hideBorder = [];
                                switch (true) {
                                    case window.innerWidth >= 1900:
                                        if ((index + 1) % 3 !== 0 && index != 3) {
                                            hideBorder.push('right');
                                        }
                                        if (index / 3 >= 1) {
                                            hideBorder.push('top');
                                        }
                                        break;
                                    default:
                                        if ((index + 1) % 4 !== 0) {
                                            hideBorder.push('right');
                                        }
                                        if (index / 4 >= 1) {
                                            hideBorder.push('top');
                                        }
                                }
                                return (
                                    <NucliosBox
                                        key={page.title}
                                        wrapperClasses={classes.cardContainer}
                                        hideBorder={hideBorder}
                                    >
                                        <Grid item xs={3} aria-label="grid-view-container">
                                            <Card
                                                aria-label="function-card"
                                                className={classes.card}
                                                style={{ position: 'relative' }}
                                                onClick={() => navigate(page.link)}
                                            >
                                                <CardActionArea
                                                    aria-label="fun-navigation1"
                                                    className={classes.actionArea}
                                                >
                                                    <CardContent>
                                                        <div
                                                            id="logoWrapper"
                                                            className={classes.logoWrapper}
                                                        >
                                                            <Icon
                                                                fontSize="large"
                                                                style={{ transform: 'scale(3.2)' }}
                                                            />
                                                        </div>
                                                        <Typography
                                                            variant="h4"
                                                            className={classes.textContent}
                                                        >
                                                            {page.title}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    </NucliosBox>
                                );
                            })}
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LLMWorkbench = (props) => {
    const classes = useStyles();
    if (props.user_permissions && !props.user_permissions.admin) {
        return <AccessDenied />;
    }
    return (
        <div className={classes.bodyContainer}>
            <Switch>
                <Route exact path="/llmworkbench" component={() => <Landing {...props} />} />
                {/* <Route
                    exact
                    path="/llmworkbench/dataquality"
                    component={(_props) => <DataQualityPage {..._props} {...props} />}
                /> */}
                <Route
                    path="/llmworkbench"
                    component={(_props) => <LLMWorkbenchDashboard {...props} {..._props} />}
                />
            </Switch>
        </div>
    );
};

export default LLMWorkbench;
