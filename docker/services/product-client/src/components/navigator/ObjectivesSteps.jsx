import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles, Typography, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
// import Paper from "@material-ui/core/Paper";
import { getObjectivesSteps } from 'store/index';
// import AppWidgetPlot from "components/AppWidgetPlot.jsx";
import CodxStepper from 'components/custom/CodxStepper.jsx';
import appScreenStyle from 'assets/jss/appScreenStyle.jsx';
import { connect } from 'react-redux';
import AppScreen from 'components/AppScreen.jsx';
import appWidgetGraphStyle from 'assets/jss/appWidgetGraphStyle.jsx';
// import AppScreenFilters from "components/AppScreenFilters.jsx";
import { ReactComponent as ExitButton } from 'assets/img/exit-button.svg';
import CreateReportsDialog from 'components/CreateReportsDialog.jsx';
import { getStory, updateStory } from 'services/reports';
import { NewPage } from '../createStory/config';

import * as _ from 'underscore';
class ObjectivesSteps extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loading: true,
            objectivesSteps: false,
            activeStep: 0,
            step: {},
            isDisabled: true,
            storyCreated: false
        };
    }

    setActiveStep = (step) => {
        this.setState({ activeStep: step });
    };

    componentDidMount() {
        this.props.getObjectivesSteps({
            objective_id: this.props.match.params.objective_id,
            callback: this.onResponseGetApps
        });
    }

    onResponseGetApps = (response_data) => {
        this.setState({
            objectivesSteps: response_data,
            loading: false
        });
    };

    handleNext = () => {
        this.setActiveStep(this.state.activeStep + 1);
    };

    handleBack = () => {
        this.setActiveStep(this.state.activeStep - 1);
    };

    StepContent = (step) => {
        const { classes } = this.props;
        const nextObjective = this.props.location?.nextObjective;

        if (step || this.state.activeStep) {
            if (this.state.activeStep !== this.state.objectivesSteps.length - 1) {
                return (
                    <Fragment>
                        <Typography className={classes.heading}>{step.title}</Typography>
                        <Typography className={classes.contentText}>{step.description}</Typography>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <Typography className={classes.heading}>{step.title}</Typography>
                        <Typography className={classes.contentText}>{step.description}</Typography>

                        {nextObjective && (
                            <div>
                                <hr />
                                <Typography className={classes.heading}>{'Next'}</Typography>
                                <Typography className={classes.contentText}>
                                    {nextObjective[0].objective_name}
                                </Typography>
                                <Button
                                    className={classes.button}
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname:
                                                '/app/' +
                                                this.props.app_info.id +
                                                '/objectives/' +
                                                nextObjective[0].objective_id +
                                                '/steps'
                                        });
                                    }}
                                    aria-label="View"
                                >
                                    View
                                </Button>
                            </div>
                        )}
                        <hr />
                        <Typography className={classes.heading}>
                            {'You may also want to'}
                        </Typography>
                        <Typography className={classes.contentText}>
                            {'Add charts to data stories to discuss with your stakeholders'}
                        </Typography>

                        {!this.state.storyCreated ? (
                            <Button
                                className={classes.button}
                                onClick={() => this.addToStories()}
                                aria-label="Add to stories"
                            >
                                Add to stories
                            </Button>
                        ) : (
                            <Button
                                className={classes.button}
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: '/stories/' + this.state.story_id + '/edit'
                                    });
                                }}
                                aria-label="View created stories"
                            >
                                View Created Stories
                            </Button>
                        )}
                    </Fragment>
                );
            }
        }
    };

    // getWidgetData = (selected_filters) => {
    //     this.setState({
    //         //   selected_filters: selected_filters
    //     });
    // };

    closeCreateStoriesDialog = () => {
        this.setState({
            createStoriesDialog: false
        });
        localStorage.removeItem('create-stories-payload');
    };

    exitHandler = () => {
        this.props.history.goBack();
    };

    getCreateStoriesPayload = (widgetValue, graphValue) => {
        return {
            name: widgetValue.widget_key,
            description: '',
            app_id: this.props.app_info.id,
            app_screen_id: '',
            app_screen_widget_id: '',
            app_screen_widget_value_id: '',
            graph_data: graphValue.value,
            filter_data: ''
        };
    };

    getPayloadMap = () => {
        var payloadMap = new Map(JSON.parse(localStorage.getItem('create-stories-payload')));
        if (!payloadMap && !payloadMap.size) {
            payloadMap = new Map();
        }
        return payloadMap;
    };

    getPayloadArray = () => {
        var payloadMap = this.getPayloadMap();
        var payloadObject;
        if (payloadMap && payloadMap.size) {
            payloadObject = payloadMap.get(this.props.app_info.id);
        }
        if (!payloadObject) {
            payloadObject = [];
        }
        return payloadObject;
    };

    addToStories = () => {
        localStorage.removeItem('create-stories-payload');

        var payloadMap = this.getPayloadMap();
        var payloadObject = this.getPayloadArray();

        let graphData = _.union(...this.props.graphData);
        let widgetData = _.union(...this.props.widgetData);

        _.each(graphData, (graphValue, index) => {
            var requestPayload = this.getCreateStoriesPayload(widgetData[index], graphValue);
            payloadObject.push(requestPayload);
        });

        payloadMap.set(this.props.app_info.id.toString(), payloadObject);
        localStorage.setItem(
            'create-stories-payload',
            JSON.stringify(Array.from(payloadMap.entries()))
        );
        this.setState({ createStoriesDialog: true });
        // this.props.updateStoriesCount();
    };

    onResponseAddORCreateStory = (response) => {
        this.setState({
            storyCreated: true,
            story_id: response.id
        });
        this.generatePages();
    };

    generatePages = async () => {
        var story;
        var layout;
        var pages = [];

        await getStory({
            story_id: this.state.story_id,
            callback: function (response) {
                story = response;
            }
        });

        if (story) {
            _.each(this.state.objectivesSteps, (step, index) => {
                const page = JSON.parse(JSON.stringify(NewPage));
                layout = this.getLayout(story, index);

                page.pIndex = index;
                page.layoutId = layout.id;
                page.style = layout.style;
                page.layoutProps = layout.layoutProps;

                page.data = this.setPageData(step, story, index);
                pages.push(page);
            });
        }

        try {
            const email = this.props.logged_in_user_info;
            updateStory({
                payload: {
                    email,
                    name: story.name,
                    description: story.description,
                    story_id: story.story_id,
                    app_id: story.app_id,
                    update: { pages },
                    delete: [],
                    add: []
                },
                callback: () => {
                    // handleUpdateResponse({message: 'Updated successfully!'})
                }
            });
        } catch (err) {
            // handleUpdateResponse({message: 'Failed to update. Please try again.', severity: 'error'})
        }
    };

    getLayout = (story, index) => {
        let widget = _.where(this.props.widgetData[index], { is_label: false });
        if (widget.length > 1) {
            return _.findWhere(story.layouts, { id: 4 });
        } else {
            return _.findWhere(story.layouts, { id: 10 });
        }
    };

    setPageData = (step, story, index) => {
        var pageObject = {
            h1: {
                html:
                    "<p style='text-align:center; font-size: 18px;'>" + step.description + '</p>↵',
                rootStyle: {}
            }
        };

        let indexes = _.map(this.props.widgetData[index], (value, index) => {
            if (value.is_label === false) {
                return index;
            }
        });

        let indexValues = _.compact(indexes);

        let widget = this.props.graphData[index];

        _.each(indexValues, (value, index) => {
            _.each(story.content, (content) => {
                if (value && _.isEqual(widget[value].value, JSON.parse(content.value))) {
                    pageObject['v' + (index + 1)] = content.content_id;
                }
            });
        });

        return pageObject;
    };

    render() {
        const { classes } = this.props;
        const { objectivesSteps } = this.state;
        const { activeStep } = this.state;
        // const steps = objectivesSteps;
        const steps = ['1', '2', '3', '4', '5'];
        const maxSteps = objectivesSteps.length;
        const stepContent = this.StepContent(objectivesSteps[activeStep]);
        const stepTooltipContent = [
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability',
            'This is how your brands have performed in terms of Investment vs Profitability'
        ];

        return (
            <div className={classes.body}>
                <Grid container spacing={1} className={classes.body}>
                    <Grid item xs={3} className={classes.sidebar}>
                        <Button
                            startIcon={<ExitButton style={{ color: 'inherit' }} />}
                            className={classes.exitButton}
                            onClick={() => this.exitHandler()}
                            aria-label="Exit"
                        >
                            Exit
                        </Button>
                        {objectivesSteps.length && (
                            <div className={classes.sidebarStepper}>
                                <CodxStepper
                                    category="hybrid"
                                    steps={steps}
                                    activeStep={activeStep}
                                    maxSteps={maxSteps}
                                    stepContent={stepContent}
                                    stepTooltipContent={stepTooltipContent}
                                    handleNext={this.handleNext}
                                    handleBack={this.handleBack}
                                    position="static"
                                    variant="text"
                                />
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={9}>
                        {objectivesSteps.length && (
                            <AppScreen
                                navigator={true}
                                objectivesSteps={objectivesSteps}
                                activeStep={activeStep}
                                app_info={this.state.app_info}
                                handleStoriesCount={this.handleStoriesCount}
                                setGPTinfo={this.props.setGPTinfo && this.props.setGPTinfo}
                                {...this.props}
                            />
                        )}

                        {this.state.createStoriesDialog ? (
                            <CreateReportsDialog
                                onClose={this.closeCreateStoriesDialog}
                                app_info={this.props.app_info}
                                onResponseAddORCreateStory={this.onResponseAddORCreateStory}
                            ></CreateReportsDialog>
                        ) : null}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

ObjectivesSteps.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const styles = (theme) => ({
    bodyContainer: {
        height: '100%',
        position: 'relative',
        overflowX: 'hidden',
        background: theme.palette.primary.main
    },
    body: {
        height: '100%',
        // height: "calc(100% - " + theme.spacing(12) + ")",
        overflowX: 'hidden'
        // background: theme.palette.primary.dark
    },
    chatBox: {
        height: '100%'
    },

    root: {
        marginTop: '5%'
    },
    heading: {
        color: '#EF8911',
        fontSize: '1.5rem'
    },
    subHeading: {
        fontSize: '1.5rem'
    },
    contentText: {
        color: theme.palette.text.titleText,
        fontSize: '1.5rem'
    },
    hrStyle: {
        border: 'none',
        borderTop: '1px dashed #FFFFFF !important',
        opacity: '0.3'
    },
    button: {
        // margin: '5% 0% 5% 0%',
        borderRadius: '1rem',
        color: 'white',
        backgroundColor: theme.palette.primary.main
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
    },
    sidebar: {
        paddingLeft: '2rem !important',
        paddingRight: '2rem !important',
        background: theme.palette.primary.dark
    },
    sidebarStepper: {
        marginTop: '2rem'
    }
});

const mapStateToProps = (state) => {
    return {
        objectives: state.navigator.objectives,
        widgetData: state.appScreen.widgetData,
        graphData: state.appScreen.graphData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getObjectivesSteps: (widgets) => dispatch(getObjectivesSteps(widgets))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...appScreenStyle(theme),
            ...appWidgetGraphStyle(theme),
            ...styles(theme)
        }),
        { useTheme: true }
    )(ObjectivesSteps)
);
