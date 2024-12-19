import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import { Typography, Grid /*, Paper*/, Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// import { getObjectivesList } from "services/dashboard.js";

import { connect } from 'react-redux';
import { getObjectives, getMatomoPvid } from 'store/index';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { ReactComponent as ExitButton } from 'assets/img/exit-button.svg';
import { createBrowserHistory } from 'history';
import { logMatomoEvent } from '../../services/matomo';
import * as _ from 'underscore';

class ObjectivesList extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            objectives: false,
            objectiveClicked: {}
        };
    }

    componentDidMount() {
        const payload = {
            app_id: this.props.app_info.id
        };

        this.props.getObjectives(payload);
        logMatomoEvent({
            action_name: 'Navigator',
            url: window.location.href,
            urlref: window.location.href,
            pv_id: this.props.matomo.pv_id
        });
    }

    objectiveClickedHandler(objective) {
        let objectivesList = _.pluck(this.props.objectives, 'objectives_list');
        let objectives = _.union(...objectivesList);
        var nextObjective = _.where(objectives, {
            objective_id: objective.next_recommended_objective
        });

        this.setState({
            objectiveClicked: {
                objective_Id: objective.objective_id,
                objective_name: objective.objective_name
            },
            nextObjective: nextObjective
        });
    }

    exitHandler() {
        this.setState({
            objectiveClicked: {}
        });
    }

    navigateTo() {
        this.props.history.push({
            pathname:
                '/app/' +
                this.props.app_info.id +
                '/objectives/' +
                this.state.objectiveClicked.objective_Id +
                '/steps',
            nextObjective: this.state.nextObjective
        });
    }

    exitObjectiveHandler() {
        const history = createBrowserHistory();
        history.goBack();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.body}>
                <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.back}>
                        {!_.isEmpty(this.state.objectiveClicked) && (
                            <Button
                                startIcon={<ExitButton style={{ color: 'inherit' }} />}
                                className={classes.exitButton}
                                onClick={() => this.exitHandler()}
                                aria-label="Exit"
                            >
                                Exit
                            </Button>
                        )}
                        {_.isEmpty(this.state.objectiveClicked) && (
                            <Button
                                startIcon={<ArrowBackIosIcon style={{ color: 'inherit' }} />}
                                className={classes.exitObjectiveButton}
                                onClick={() => this.exitObjectiveHandler()}
                                aria-label="Back to application details"
                            >
                                Back to Application Details
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={10}>
                        {_.isEmpty(this.state.objectiveClicked) && (
                            <Fragment>
                                <div>
                                    <Typography className={classes.heading} variant="h2">
                                        Hi, Mr Oscar, Welcome to Portfolio Planner with Codx
                                    </Typography>
                                    <Typography className={classes.summary} variant="h3">
                                        We have tailored the best objectives for you to plan your
                                        portfolio for the next session 2021-22
                                    </Typography>
                                </div>

                                {this.props.objectives &&
                                    this.props.objectives.map((objective, i) => (
                                        <section key={'objective' + i} className={classes.category}>
                                            <header className={classes.title}>
                                                {objective.group_name}
                                            </header>
                                            <Typography
                                                className={classes.description}
                                                variant="h4"
                                            >
                                                {objective.description}
                                            </Typography>
                                            <div className={classes.cardWrapper}>
                                                {objective.objectives_list.map((list, j) => (
                                                    <Card
                                                        key={'list' + j}
                                                        className={classes.card}
                                                        onClick={() => {
                                                            this.objectiveClickedHandler(list);
                                                        }}
                                                    >
                                                        <CardContent
                                                            className={classes.CardContent}
                                                        >
                                                            <Typography
                                                                className={classes.objective}
                                                                gutterBottom
                                                            >
                                                                {list.objective_name}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                            </Fragment>
                        )}
                        {!_.isEmpty(this.state.objectiveClicked) && (
                            <div className={classes.objectiveInfo}>
                                <Typography variant="h3" className={classes.objectiveInfoText}>
                                    {this.state.objectiveClicked?.objective_name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        this.navigateTo();
                                    }}
                                    className={classes.objectiveInfoBtn}
                                    aria-label="More info"
                                >
                                    More Info
                                </Button>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

ObjectivesList.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        objectives: state.navigator.objectives,
        matomo: state.matomo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getObjectives: (payload) => dispatch(getObjectives(payload)),
        getMatomoPvid: (pageType) => dispatch(getMatomoPvid(pageType))
    };
};

const styles = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative',
        overflowX: 'hidden',
        background: theme.palette.primary.main
    },
    body: {
        // height: "calc(100% - " + theme.spacing(12) + ")",
        height: '100%',
        overflow: 'hidden'
    },

    heading: {
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(4.25),
        fontWeight: 500,
        fontStyle: 'normal',
        letterSpacing: '0.1rem',
        lineHeight: theme.spacing(5),
        marginTop: '7.5rem'
    },
    summary: {
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(3.75),
        fontWeight: 300,
        letterSpacing: '0.1rem',
        lineHeight: theme.spacing(4.25),
        marginTop: '2rem'
    },
    category: {
        marginTop: '8rem'
    },
    title: {
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(4.25),
        fontWeight: 300,
        fontStyle: 'normal',
        lineHeight: theme.spacing(5)
    },
    objective: {
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(2.5),
        fontWeight: 300,
        fontStyle: 'normal',
        display: 'flex',
        height: '100%',
        alignItems: 'center'
    },
    description: {
        color: theme.palette.text.titleText,
        fontSize: theme.spacing(3.25),
        fontStyle: 'italic',
        fontWeight: 300,
        lineHeight: theme.spacing(5)
    },
    cardWrapper: {
        marginTop: '4rem',
        display: 'flex'
    },
    card: {
        maxWidth: 160,
        minHeight: 120,
        margin: '2rem',
        border: '1px solid' + theme.palette.primary.contrastText,
        borderRadius: '2rem',
        cursor: 'pointer'
    },
    CardContent: {
        height: '100%'
    },
    objectiveInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '14.5rem',
        marginLeft: '10rem',
        width: '60vw',
        height: '60vh'
    },
    objectiveInfoText: {
        position: 'relative',
        textAlign: 'center',
        paddingBottom: '4rem',
        color: theme.palette.text.titleText,
        animation: `$pullupobjectiveinfo 0.5s ease-out forwards`
    },
    '@keyframes pullupobjectiveinfo': {
        '0%': {
            width: '50rem',
            top: '5rem',
            opacity: '50%'
        },
        '25%': {
            width: '51rem',
            top: '4rem',
            opacity: '60%'
        },
        '50%': {
            width: '52rem',
            top: '3rem',
            opacity: '70%'
        },
        '75%': {
            width: '53rem',
            top: '1rem',
            opacity: '90%'
        },
        '100%': {
            width: '54rem',
            top: '0',
            opacity: '100%'
        }
    },
    objectiveInfoBtn: {
        position: 'relative',
        paddingLeft: '5rem',
        paddingRight: '5rem',
        borderRadius: '5rem',
        animation: `$zoominobjectivebtn 0.45s ease-out forwards`
    },
    '@keyframes zoominobjectivebtn': {
        '0%': {
            top: '-3rem',
            transform: 'scale(0.5,0.5)'
        },
        '100%': {
            top: '0',
            transform: 'scale(1,1)'
        }
    },
    back: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '5rem !important'
    },
    exitButton: {
        color: theme.palette.text.contrastText,
        textTransform: 'none',
        animation: `$exitbtnappear 0.45s ease-out forwards`
    },
    '@keyframes exitbtnappear': {
        '0%': {
            opacity: 0
        },
        '50%': {
            opacity: 0.5
        },
        '100%': {
            opacity: 1
        }
    },
    exitObjectiveButton: {
        color: theme.palette.text.titleText,
        textTransform: 'none'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ObjectivesList));
