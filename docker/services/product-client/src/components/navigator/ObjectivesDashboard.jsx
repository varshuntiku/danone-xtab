import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';

import ObjectivesList from './ObjectivesList.jsx';
import ObjectivesSteps from './ObjectivesSteps.jsx';

class ObjectivesDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {};
    }

    render() {
        const { app_info } = this.props;

        return (
            <div>
                <Switch>
                    <Route
                        exact
                        path="/app/:app_id/objectives"
                        render={(props) => (
                            <ObjectivesList
                                key={props.location.key}
                                app_info={app_info}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/app/:app_id/objectives-steps/"
                        render={(props) => (
                            <ObjectivesSteps
                                key={props.location.key}
                                app_info={app_info}
                                {...props}
                                logged_in_user_info={this.props.logged_in_user_info}
                                setGPTinfo={this.props.setGPTinfo && this.props.setGPTinfo}
                            />
                        )}
                    />
                    <Redirect to={'/app/' + app_info['id'] + '/objectives'} />
                </Switch>
            </div>
        );
    }
}

ObjectivesDashboard.propTypes = {
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
        height: 'calc(100% - ' + theme.spacing(12) + ')'
    },
    chatBox: {
        height: '100%'
    }
});

export default withStyles(styles)(ObjectivesDashboard);
