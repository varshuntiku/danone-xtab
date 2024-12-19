import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
    Grid,
    Card,
    CardHeader,
    CardActionArea,
    Avatar,
    Typography
    // Button,
} from '@material-ui/core';

import LinearProgressBar from 'components/LinearProgressBar.jsx';

import dashboardStyle from 'assets/jss/dashboardStyle.jsx';

import { getDashboardByIndustryId } from 'services/dashboard.js';
import { IndustrySpecs } from '../assets/data/indusrySpecs';

import { connect } from 'react-redux';
import { getIndustries } from 'store/index';

import CodxCircularLoader from 'components/CodxCircularLoader.jsx';

import * as _ from 'underscore';

class PlatformDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.industry_specs = IndustrySpecs;

        this.state = {
            industries: false,
            clickedIndustry: null
        };
    }

    componentDidMount() {
        if (this.props.industryData.length === 0) {
            this.props.getIndustries({});
        }
    }

    getDashboardByIndustryIdCallback = (dashboardDetails) => {
        let linkPath = `/dashboard/${this.state.clickedIndustry.industry_name}`;
        if (dashboardDetails) {
            linkPath = dashboardDetails.url
                ? `/custom-dashboards/${dashboardDetails.url}`
                : `/dashboards/${dashboardDetails.id}`;
        }
        this.props.history.push(linkPath);
    };

    clickHandler = (industry) => {
        this.setState({
            clickedIndustry: industry
        });

        getDashboardByIndustryId({
            industryId: industry.id,
            callback: this.getDashboardByIndustryIdCallback
        });
    };

    renderCard = (item) => {
        const { classes } = this.props;

        return [
            <Grid key={'industry_grid_' + item.industry_name.toLowerCase()} item xs={3}>
                <Card className={classes.industryCard}>
                    <CardActionArea onClick={() => this.clickHandler(item)}>
                        <CardHeader
                            titleTypographyProps={{ variant: 'h4' }}
                            title={item.industry_name}
                            avatar={
                                <Avatar className={classes.industryAvatar}>
                                    {this.industry_specs[item.logo_name]}
                                </Avatar>
                            }
                        />
                    </CardActionArea>
                </Card>
            </Grid>
        ];
    };

    render() {
        const { classes } = this.props;

        return !this.props.industryData ? (
            <LinearProgressBar />
        ) : (
            <div className={classes.gridBody}>
                <Grid container spacing={2}>
                    <React.Fragment>
                        <Grid key={'industry_grid_horizontals'} item xs={12}>
                            <Typography variant="h4" className={classes.textColor}>
                                {'Verticals'}
                            </Typography>
                            <hr />
                        </Grid>
                    </React.Fragment>
                    {this.props.loading && <CodxCircularLoader size={60} center />}
                    {_.map(this.props.industryData, (item) => {
                        if (item.horizon === 'vertical') {
                            return this.renderCard(item);
                        }
                    })}
                    <React.Fragment>
                        <Grid key={'industry_grid_horizontals'} item xs={12}>
                            <Typography variant="h4" className={classes.textColor}>
                                {'Horizontals'}
                            </Typography>
                            <hr />
                        </Grid>
                    </React.Fragment>
                    {_.map(this.props.industryData, (item) => {
                        if (item.horizon === 'horizontal') {
                            return this.renderCard(item);
                        }
                    })}
                </Grid>
            </div>
        );
    }
}

PlatformDashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list,
        loading: state.industryData.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getIndustries: (payload) => dispatch(getIndustries(payload))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    withStyles(
        (theme) => ({
            ...dashboardStyle(theme)
        }),
        { withTheme: true }
    )(PlatformDashboard)
);
