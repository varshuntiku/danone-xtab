import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getIndustries, getConnectedSystems } from 'store/index';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tabs, Tab } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import dashboardStyle from 'assets/jss/newDashboardStyle.jsx';
import { getDashboardByIndustryId } from 'services/dashboard.js';
import { IndustrySpecs } from '../assets/data/indusrySpecs';
import NucliosBox from './NucliosBox';
import industryDashboard from '../assets/img/industry-dashboard.png';
import { ReactComponent as ResultNotFound } from 'assets/img/result-not-found.svg';
import SearchBar from './CustomSearchComponent/SearchComponent';

const NewPlatformDashboard = (props) => {
    const classes = props.classes;
    const [verticalIndustries, setVerticalIndustries] = useState(null);
    const [horizontalIndustries, setHorizontalIndustries] = useState(null);
    const [connectedSystems, setConnectedSystems] = useState(null);
    const [clickedIndustry, setClickedIndustry] = useState(null);
    const [clickedConnectedSystem, setClickedConnectedSystem] = useState(null);
    const [value, setValue] = useState(0);
    const [searchText, setSearchText] = useState('');
    const industrySpecs = IndustrySpecs;
    const industries = value === 0 ? verticalIndustries : horizontalIndustries;

    const getIndustriesPerHorizon = (horizon) => {
        const currentIndustries = props.industryData.filter(
            (industry) =>
                industry?.horizon === horizon &&
                industry?.industry_name &&
                industry.industry_name.toLowerCase().includes(searchText.toLowerCase())
        );
        let rem = currentIndustries.length % 4;
        while (rem !== 0) {
            currentIndustries.push(...Array(4 - rem).fill(null));
            rem = currentIndustries.length % 4;
        }
        return currentIndustries;
    };

    useEffect(() => {
        if (props.industryData?.length === 0) props.getIndustries({});
        else {
            const verticalIndustries = getIndustriesPerHorizon('vertical');
            const horizontalIndustries = getIndustriesPerHorizon('horizontal');
            setVerticalIndustries(verticalIndustries);
            setHorizontalIndustries(horizontalIndustries);
        }
    }, [props.industryData, searchText]);

    useEffect(() => {
        if (props.connectedSystemData?.length === 0) props.getConnectedSystems({});
    }, []);

    useEffect(() => {
        setConnectedSystems(props.connectedSystemData);
    }, [props.connectedSystemData]);

    useEffect(() => {
        if (clickedIndustry) {
            getDashboardByIndustryId({
                industryId: clickedIndustry.id,
                callback: getDashboardByIndustryIdCallback
            });
        }
    }, [clickedIndustry]);

    useEffect(() => {
        if (clickedConnectedSystem) {
            let linkPath = `/connected-system/${clickedConnectedSystem?.id}`;
            props.history.push(linkPath);
        }
    }, [clickedConnectedSystem]);

    const getDashboardByIndustryIdCallback = (dashboardDetails) => {
        let linkPath = `/dashboard/${clickedIndustry?.industry_name}`;
        if (dashboardDetails) {
            linkPath = dashboardDetails.url
                ? `/custom-dashboards/${dashboardDetails.url}`
                : `/dashboards/${dashboardDetails.id}`;
        }
        props.history.push(linkPath);
    };

    const clickHandler = (industry) => setClickedIndustry(industry);

    const clickConnSystemHandler = (connected_system) =>
        setClickedConnectedSystem(connected_system);

    const handleChange = (event, newValue) => setValue(newValue);

    const handleIndustrySearch = (v) => {
        setSearchText(v);
    };

    const tabProps = (index) => ({
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    });

    const renderCard = (item, index, loading = false) => {
        const hideBorder = [0, 1, 2, 3].includes(index) ? [] : ['top'];
        if (index % 4 !== 0) {
            hideBorder.push('left');
        }

        return (
            <Grid key={'platform_grid_item_' + index} item xs={3} className={classes.cardParent}>
                <NucliosBox wrapperClasses={classes.card} hideBorder={hideBorder}>
                    <div className={classes.cardWrapper} onClick={() => clickHandler(item)}>
                        {loading && (
                            <div className={classes.skeletonLoaderWrapper}>
                                <Skeleton
                                    variant="circle"
                                    className={classes.skeletonLoaderCircle}
                                />
                                <Skeleton variant="rect" className={classes.skeletonLoaderText} />
                            </div>
                        )}
                        {item && !loading && (
                            <>
                                <div className={classes.iconsWrapper}>
                                    {industrySpecs[item.logo_name]}
                                    {industrySpecs[item.logo_name]}
                                </div>
                                {item.industry_name}
                            </>
                        )}
                    </div>
                </NucliosBox>
            </Grid>
        );
    };

    const renderConnSystemCard = (item, index, loading = false) => {
        const hideBorder = [0, 1, 2, 3].includes(index) ? [] : ['top'];
        if (index % 4 !== 0) {
            hideBorder.push('left');
        }

        return (
            <Grid key={'platform_grid_item_' + index} item xs={3} className={classes.cardParent}>
                <NucliosBox wrapperClasses={classes.card} hideBorder={hideBorder}>
                    <div
                        className={classes.cardWrapper}
                        onClick={() => clickConnSystemHandler(item)}
                    >
                        {loading && (
                            <div className={classes.skeletonLoaderWrapper}>
                                <Skeleton
                                    variant="circle"
                                    className={classes.skeletonLoaderCircle}
                                />
                                <Skeleton variant="rect" className={classes.skeletonLoaderText} />
                            </div>
                        )}
                        {item && !loading && item.name}
                    </div>
                </NucliosBox>
            </Grid>
        );
    };

    const renderNotFoundCard = () => {
        return (
            <NucliosBox>
                <div className={classes.notFound}>
                    <ResultNotFound />
                    <div>Result not found</div>
                </div>
            </NucliosBox>
        );
    };

    return (
        <NucliosBox
            hideBorder={['top', 'bottom', 'left', 'right']}
            hideSpacing={['top', 'bottom']}
            spacing={16}
            wrapperClasses={classes.parent}
        >
            <div className={classes.parentContainer}>
                <NucliosBox>
                    <div className={classes.topbarWrapper}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="standard"
                            aria-label="full width tabs example"
                            className={classes.tabs}
                        >
                            <Tab label="Verticals" {...tabProps(0)} />
                            <Tab label="Horizontals" {...tabProps(1)} />
                            <Tab label="Connected Systems" {...tabProps(2)} />
                        </Tabs>
                        <div className={classes.searchWrapper}>
                            <SearchBar
                                value={searchText}
                                onChangeWithDebounce={handleIndustrySearch}
                                placeholder="Search by name"
                                variant="filled"
                            />
                        </div>
                    </div>
                </NucliosBox>
                <NucliosBox hideBorder={['top']} wrapperClasses={classes.content}>
                    <div className={classes.contentWrapper}>
                        <NucliosBox hideBorder={['bottom']}>
                            <div className={classes.contentHead}>
                                <div className={classes.headText}>
                                    <div>Helping enterprises across</div>
                                    <div>industries to own their intelligence</div>
                                </div>
                                <div className={classes.industryDashboardImgContainer}>
                                    <img
                                        loading="lazy"
                                        src={industryDashboard}
                                        alt="IndustryDashboardImg"
                                        className={classes.industryDashboardImg}
                                    />
                                </div>
                            </div>
                            <div></div>
                        </NucliosBox>
                        <Grid container id={`full-width-tabpanel-${value != null ? value : 0}`}>
                            {value === 2
                                ? props.connsystem_loading
                                    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) =>
                                          renderCard(item, index, true)
                                      )
                                    : connectedSystems?.length > 0
                                    ? connectedSystems.map((item, index) =>
                                          renderConnSystemCard(item, index)
                                      )
                                    : connectedSystems?.length == 0
                                    ? renderNotFoundCard()
                                    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) =>
                                          renderCard(item, index, true)
                                      )
                                : props.loading
                                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) =>
                                      renderCard(item, index, true)
                                  )
                                : industries?.length > 0
                                ? industries.map((item, index) => renderCard(item, index))
                                : industries?.length == 0
                                ? renderNotFoundCard()
                                : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) =>
                                      renderCard(item, index, true)
                                  )}
                        </Grid>
                    </div>
                </NucliosBox>
            </div>
        </NucliosBox>
    );
};

const mapStateToProps = (state) => {
    return {
        industryData: state.industryData.list,
        loading: state.industryData.loading,
        connectedSystemData: state.connectedSystemData.list,
        connsystem_loading: state.connectedSystemData.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getIndustries: (payload) => dispatch(getIndustries(payload)),
        getConnectedSystems: (payload) => dispatch(getConnectedSystems(payload))
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
    )(NewPlatformDashboard)
);
