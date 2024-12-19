import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import PersonIcon from '@material-ui/icons/Person';
import EventNoteIcon from '@material-ui/icons/EventNote';

const design_menuitem_styles = (theme) => ({
    menuItemContainer: {
        borderBottom: '1px solid ' + theme.palette.text.default,
        padding: theme.spacing(0.5, 0)
    }
});

class DesignProjectMenuItem extends React.Component {
    render() {
        const { classes, params } = this.props;

        return (
            <Grid container className={classes.menuItemContainer}>
                <Grid item xs={12}>
                    <Typography variant="h4">{params.name}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <PersonIcon fontSize="large" />
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5">{params.created_by}</Typography>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={1}>
                    <EventNoteIcon fontSize="large" />
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5">{params.updated_at}</Typography>
                </Grid>
            </Grid>
        );
    }
}

DesignProjectMenuItem.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(
    (theme) => ({
        ...design_menuitem_styles(theme)
    }),
    { withTheme: true }
)(DesignProjectMenuItem);
