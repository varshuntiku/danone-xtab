import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import TabView from './tabView';

import ChatView from './chatView.jsx';

class MinervaDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            vizMetaData: this.props.location?.state?.vizMetaData
                ? this.props.location.state.vizMetaData
                : false,
            messageList: this.props.location?.state?.messageList
                ? this.props.location.state.messageList
                : false
        };
    }

    setVizMetaData = (vizData) => {
        this.setState({
            vizMetaData: vizData
        });
    };

    deleteViz = (index) => {
        var data = [...this.state.vizMetaData];
        if (index !== -1) {
            data.splice(index, 1);
            this.setState({ vizMetaData: data });
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bodyContainer}>
                <Grid container spacing={1} className={classes.body}>
                    <Grid item xs={3} className={classes.chatBox}>
                        <ChatView
                            {...this.props}
                            parent={'dashboard'}
                            setVizMetaData={this.setVizMetaData}
                            messageList={this.state.messageList}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TabView
                            {...this.props}
                            vizMetaData={this.state.vizMetaData}
                            deleteViz={this.deleteViz}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

MinervaDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    app_info: PropTypes.object.isRequired
};

const styles = (theme) => ({
    bodyContainer: {
        height: 'calc(100% - 1rem)',
        position: 'relative',
        overflowX: 'hidden',
        // zIndex: '999999',
        background: theme.palette.primary.main
    },
    body: {
        height: 'calc(100% - ' + theme.spacing(3) + ')'
    },
    chatBox: {
        height: '100%'
    }
});

export default withStyles(styles)(MinervaDashboard);
