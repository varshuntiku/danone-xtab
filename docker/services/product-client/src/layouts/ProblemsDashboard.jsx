import React, { useEffect, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardActionArea } from '@material-ui/core';

import problemsDashboardStyle from 'assets/jss/problemsDashboardStyle.jsx';
import functionSpecs from 'assets/data/functionSpecs.jsx';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { getIndustries, getFunctions } from 'store/index';
import NucliosBox from '../components/NucliosBox.jsx';
import sanitizeHtml from 'sanitize-html-react';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(problemsDashboardStyle);

const ProblemsDashboardNew = (props) => {
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [functions_list, setFunctionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const industryData = useSelector((st) => st.industryData.list);
    const functionData = useSelector((st) => st.functionData.list);

    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (industryData.length === 0) {
            dispatch(getIndustries({}));
        }
        if (industryData.length) {
            getSelectedIndustryDetails();
        }
        if (functionData.length === 0) {
            dispatch(getFunctions({}));
        }
    }, []);

    useEffect(() => {
        getSelectedFunctionDetails();
    }, [selectedIndustry, functionData]);

    useEffect(() => {
        getSelectedIndustryDetails();
    }, [industryData]);

    const getSelectedIndustryDetails = () => {
        if (props.match?.params?.industry) {
            const currentIndustry = industryData.filter((industry) => {
                if (industry.industry_name === props.match.params.industry) return industry;
            });
            setSelectedIndustry(currentIndustry[0]);
        }
    };

    const getSelectedFunctionDetails = () => {
        if (selectedIndustry?.id && functionData.length) {
            const functionList = functionData.filter(
                (el) => el.industry_id === selectedIndustry?.id
            );
            let n =
                functionList.length % 4 != 0 && functionList.length > 4
                    ? 4 - (functionList.length % 4)
                    : 0;
            functionList.length
                ? setFunctionList([...functionList, ...Array(n).fill({})])
                : setFunctionList([...functionList]);

            if (functionList.length == 0) setLoading(false);
        }
    };

    const onClickNavigate = (function_name) => {
        props.history.push({
            pathname: '/dashboard/' + selectedIndustry?.industry_name + '/' + function_name
        });
    };

    const backNavigate = () => {
        props.history.push({
            pathname: '/dashboard'
        });
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const renderFunctionLoader = (index) => {
        const hideBorders = () => {
            let borders_to_hide = [];
            if (index > 4) borders_to_hide.push('top');
            if (index % 4 !== 1) borders_to_hide.push('left');
            return borders_to_hide;
        };

        return (
            <NucliosBox
                key={'function_loader_' + index}
                wrapperClasses={`${classes.functionCardContainer} ${classes.functionContainerLoader}`}
                hideBorder={hideBorders()}
            >
                <Grid item xs={3} key={index} aria-label="grid-view-container">
                    <Card aria-label="function-card" className={classes.functionCard}></Card>
                </Grid>
            </NucliosBox>
        );
    };

    const renderFunction = (function_key, index) => {
        const hideBorders = () => {
            let borders_to_hide = [];
            if (index > 4) borders_to_hide.push('top');
            if (index % 4 !== 1) borders_to_hide.push('left');
            return borders_to_hide;
        };

        var found_function_spec = function_key;

        if (!found_function_spec) {
            return '';
        } else {
            return (
                <NucliosBox
                    key={'problem_item_' + index}
                    wrapperClasses={classes.functionCardContainer}
                    hideBorder={hideBorders()}
                >
                    <Grid item xs={3} key={index} aria-label="grid-view-container">
                        <Card
                            aria-label="function-card"
                            className={classes.functionCard}
                            onClick={() =>
                                onClickNavigate(
                                    decodeHtmlEntities(
                                        sanitizeHtml(found_function_spec.function_name)
                                    )
                                )
                            }
                        >
                            <CardActionArea
                                aria-label="fun-navigation1"
                                className={classes.actionArea}
                            >
                                <CardContent>
                                    <div
                                        id="logoWrapper"
                                        className={
                                            functionSpecs[found_function_spec.logo_name]?.icon
                                                ? classes.functionLogoWrapper
                                                : ''
                                        }
                                    >
                                        {functionSpecs[found_function_spec.logo_name]?.icon}
                                    </div>
                                    <Typography variant="h4" className={classes.textContent}>
                                        {`${decodeHtmlEntities(
                                            sanitizeHtml(found_function_spec.function_name || '')
                                        )}`}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </NucliosBox>
            );
        }
    };

    return (
        <div className={functions_list.length ? classes.problemDashboardContainer : ''}>
            <div className={classes.functionHeading}>
                <div onClick={backNavigate} className={classes.backIcon}>
                    <ArrowBackIosIcon />
                </div>
                <span>{selectedIndustry?.industry_name}</span>
                <div className={classes.inputConatiner}>
                    <input
                        className={classes.searchInput}
                        placeholder="Search by function or application name"
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div>
                        <SearchIcon className={classes.searchIcon} />
                    </div>
                </div>
            </div>
            <div
                key="dashboard_vertical_grid"
                className={functions_list.length > 4 ? '' : classes.container}
            >
                <div className={classes.gridBody}>
                    <Grid container className={classes.functionContainer}>
                        {functions_list.length ? (
                            functions_list
                                .filter((el) =>
                                    el?.function_name
                                        ?.toLowerCase()
                                        ?.includes(searchValue.toLowerCase())
                                )
                                .map((func, function_index) =>
                                    renderFunction(func, function_index + 1)
                                )
                        ) : !loading ? (
                            <Typography className={classes.notFound}>No Functions</Typography>
                        ) : (
                            [1, 2, 3, 4, 5, 6, 7, 8].map((func) => renderFunctionLoader(func))
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default ProblemsDashboardNew;
