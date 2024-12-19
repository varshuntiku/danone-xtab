import React, { useEffect, useState } from 'react';
import {
    createTheme,
    Grid,
    IconButton,
    makeStyles,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import ApplicationList from './card/ApplicationList';
import applicationDashboardStyle from 'assets/jss/applicationDashboardStyle.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries, getFunctions } from 'store/index';
import SearchIcon from '@material-ui/icons/Search';
import NucliosBox from './NucliosBox';

const theme = (t) =>
    createTheme({
        ...t,
        overrides: {
            ...t.overrides,
            MuiTypography: {
                root: {
                    color: t.palette.text.default
                }
            },
            MuiPaper: {
                ...t.overrides.MuiPaper,
                root: {
                    backgroundColor: t.palette.primary.light
                }
            },
            MuiButton: {
                ...t.overrides.MuiButton,
                root: {
                    color: t.palette.text.default
                }
            }
        }
    });

const useStyles = makeStyles(applicationDashboardStyle);

const ApplicationDashboard = (props) => {
    const classes = useStyles();
    const [dashboardType] = useState(
        props.user_permissions?.app_publish
            ? localStorage.getItem('dashboard_view_type') || 'admin'
            : 'user'
    );
    const [searchValue, setSearchValue] = useState('');

    const industryData = useSelector((st) => st.industryData.list);
    const functionData = useSelector((st) => st.functionData.list);
    const dispatch = useDispatch();

    useEffect(() => {
        if (industryData.length === 0) {
            dispatch(getIndustries({}));
        }
        if (functionData.length === 0) {
            dispatch(getFunctions({}));
        }
    }, []);

    const navigate = () => {
        props.history.push({
            pathname: '/dashboard/' + props.match.params.industry
        });
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container direction="row" className={classes.appContainer}>
                <Grid item xs={12}>
                    <NucliosBox hideBorder={['bottom']} wrapperClasses={classes.headSection}>
                        <div className={classes.appHeaderInnerBox}>
                            <Typography
                                variant="h3"
                                component="div"
                                className={classes.appContainerHeader}
                            >
                                {!props.forRestrictedUser && (
                                    <IconButton
                                        aria-label="ArrowBackIos"
                                        onClick={navigate}
                                        classes={{ root: classes.iconBtn }}
                                    >
                                        <ArrowBackIos className={classes.backIcon} />
                                    </IconButton>
                                )}
                                {props.match.params.industry}
                            </Typography>
                            <div className={classes.inputConatiner}>
                                <input
                                    className={classes.searchInput}
                                    placeholder="Search by Name"
                                    value={searchValue}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <div>
                                    <SearchIcon className={classes.searchIcon} />
                                </div>
                            </div>
                        </div>
                    </NucliosBox>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.appCard}>
                        <ApplicationList
                            view={dashboardType}
                            user_permissions={props.user_permissions}
                            searchValue={searchValue}
                            {...props}
                        />
                    </div>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default ApplicationDashboard;
