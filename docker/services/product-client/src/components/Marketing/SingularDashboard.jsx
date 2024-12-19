import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import singularDashboardStyle from './singularDashboardStyle.jsx';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import { Grid, makeStyles, Button, ButtonGroup, CardActionArea } from '@material-ui/core';
import clsx from 'clsx';

import { ReactComponent as PuzzleTop } from './assets/puzzle_top.svg';
import { ReactComponent as PuzzleLeft } from './assets/puzzle_left.svg';
import { ReactComponent as PuzzleRight } from './assets/puzzle_right.svg';
import { ReactComponent as PuzzleBottom } from './assets/puzzle_bottom.svg';
import { ReactComponent as AppListIcon } from './assets/app_list_icon.svg';
import { ReactComponent as CloseIcon } from './assets/close_icon.svg';
import { ReactComponent as NucliosIcon } from './assets/nucliosLogo.svg';

import * as _ from 'underscore';
import { useDispatch, useSelector } from 'react-redux';
import { getFunctions } from 'store/index.js';
import { getApps } from 'services/dashboard.js';
import { decodeHtmlEntities } from 'util/decodeHtmlEntities';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(singularDashboardStyle);

function SingularDashboard(props) {
    const classes = useStyles();

    const [templateView, setTemplateView] = useState('grid');
    const [loading, setLoading] = useState('true');
    const [functionDetails, setFunctions] = useState([]);
    const [apps, setApps] = useState([]);
    const functionData = useSelector((st) => st.functionData.list);

    const dispatch = useDispatch();

    const initialState = {
        positionTopClicked: false,
        positionLeftClicked: false,
        positionRightClicked: false,
        positionBottomClicked: false
    };

    useEffect(() => {
        if (functionData.length === 0) {
            dispatch(getFunctions({}));
        }
        getApps({
            industry: decodeURIComponent('NucilOS Revenue Management'),
            callback: (response_data) => {
                response_data = decodeHtmlEntities(response_data);
                setApps(response_data);
            }
        });
    }, []);

    useEffect(() => {
        let functionsList = functionData.filter((element) => {
            return element.industry_name === 'NucilOS Revenue Management';
        });
        if (functionsList.length > 4) functionsList = functionsList.slice(0, 4);
        setFunctions(functionsList);
    }, [functionData]);

    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 6000);
            return () => clearTimeout(timeout);
        }
    }, [loading]);

    useEffect(() => {
        setLoading(true);
    }, [templateView]);

    const [position, setPosition] = React.useState(initialState);

    const [funcDescription] = React.useState({
        Marketing:
            'Maximize marketing ROI by optimizing investments on high impact channels and driving highly effective campaigns',
        'Distribution and Assortment':
            'Optimize range and plan product allocation to maximize growth ',
        'Growth and Planning':
            'Leverage forecasts to set strategic goals and restructure investments for annual and long range planning ',
        'Pricing and Promotion':
            'Set the right consumer price points, design promo events & optimize return on trade spend'
    });

    const handleClick = (prop) => () => {
        setPosition({ ...position, [prop]: !position[prop] });
    };

    const getApplicationCard = (index) => {
        return [
            <Card key={'applicationCard'} className={classes.applicationCard}>
                <CardHeader
                    title={functionDetails[index]?.function_name}
                    subheader={funcDescription[functionDetails[index]?.function_name]}
                />
                <CardContent>
                    <ul className={classes.appList}>
                        {_.map(
                            _.filter(apps, function (app) {
                                return (
                                    app.function?.toLowerCase() ===
                                    functionDetails[index]?.function_name.toLowerCase()
                                );
                            }),
                            function (app_details, index) {
                                return (
                                    <li
                                        key={'list' + index}
                                        className={classes.list}
                                        onClick={
                                            app_details.app_link
                                                ? () => props.history.push('/app/' + app_details.id)
                                                : void null
                                        }
                                    >
                                        {' '}
                                        <AppListIcon></AppListIcon>
                                        <span className={classes.listTile}>{app_details.name}</span>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </CardContent>
            </Card>
        ];
    };

    return [
        <div key="main" className={classes.main}>
            <Link key={'main_dashboard_link'} to={'/dashboard'}>
                <NucliosIcon className={classes.codxLogoAnimation} />
            </Link>
            <div className={classes.toggleButton}>
                <ButtonGroup value={templateView}>
                    <Button
                        aria-label="grid"
                        onClick={() => setTemplateView('grid')}
                        variant={templateView === 'grid' ? 'contained' : 'outlined'}
                        value="grid"
                    >
                        <AppsIcon />
                    </Button>
                    <Button
                        aria-label="list"
                        onClick={() => {
                            setTemplateView('list');
                            setPosition(initialState);
                        }}
                        variant={templateView === 'list' ? 'contained' : 'outlined'}
                        value="list"
                    >
                        <ListIcon />
                    </Button>
                </ButtonGroup>
            </div>

            {templateView === 'grid' && (
                <div className={classes.contentWrapper}>
                    <div className={classes.content}>
                        {position.positionTopClicked && (
                            <div className={classes.cardTop}>
                                <CloseIcon
                                    className={classes.closeIcon}
                                    onClick={handleClick('positionTopClicked')}
                                ></CloseIcon>
                                {getApplicationCard(0)}
                            </div>
                        )}

                        <Grid container>
                            <Grid item xs>
                                {position.positionLeftClicked && (
                                    <div style={{ position: 'relative' }}>
                                        <div
                                            className={[classes.cardWrapper, classes.cardLeft].join(
                                                ' '
                                            )}
                                        >
                                            <CloseIcon
                                                className={classes.closeIcon}
                                                onClick={handleClick('positionLeftClicked')}
                                            ></CloseIcon>
                                            {getApplicationCard(1)}
                                        </div>
                                    </div>
                                )}
                            </Grid>
                            <Grid item xs={4}>
                                <div className={classes.puzzleBlock}>
                                    <div
                                        className={[
                                            classes.positionTop,
                                            position.positionTopClicked
                                                ? classes.positionTopClicked
                                                : null
                                        ].join(' ')}
                                    >
                                        <p
                                            className={clsx(
                                                classes.functionText,
                                                loading && classes.delayAnimation
                                            )}
                                        >
                                            {functionDetails[0]?.function_name}
                                        </p>
                                        <div
                                            aria-label="position-top"
                                            className={classes.wrapper}
                                            onClick={handleClick('positionTopClicked')}
                                        >
                                            <PuzzleTop className={classes.puzzleIcon}></PuzzleTop>
                                        </div>
                                    </div>

                                    <div
                                        className={[
                                            classes.positionLeft,
                                            position.positionLeftClicked
                                                ? classes.positionLeftClicked
                                                : null
                                        ].join(' ')}
                                    >
                                        <div
                                            className={classes.wrapper}
                                            onClick={handleClick('positionLeftClicked')}
                                        >
                                            <p
                                                className={clsx(
                                                    classes.functionText,
                                                    loading && classes.delayAnimation
                                                )}
                                            >
                                                {functionDetails[1]?.function_name}
                                            </p>
                                            <PuzzleLeft className={classes.puzzleIcon}></PuzzleLeft>
                                        </div>
                                    </div>

                                    <div
                                        className={[
                                            classes.positionRight,
                                            position.positionRightClicked
                                                ? classes.positionRightClicked
                                                : null
                                        ].join(' ')}
                                    >
                                        <div
                                            className={classes.wrapper}
                                            onClick={handleClick('positionRightClicked')}
                                        >
                                            <PuzzleRight
                                                className={classes.puzzleIcon}
                                            ></PuzzleRight>
                                            <p
                                                className={clsx(
                                                    classes.functionText,
                                                    loading && classes.delayAnimation
                                                )}
                                            >
                                                {functionDetails[2]?.function_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={[
                                            classes.positionBottom,
                                            position.positionBottomClicked
                                                ? classes.positionBottomClicked
                                                : null
                                        ].join(' ')}
                                    >
                                        <div
                                            className={classes.wrapper}
                                            onClick={handleClick('positionBottomClicked')}
                                        >
                                            <PuzzleBottom
                                                className={classes.puzzleIcon}
                                            ></PuzzleBottom>
                                        </div>
                                        <p
                                            className={clsx(
                                                classes.functionText,
                                                loading && classes.delayAnimation
                                            )}
                                        >
                                            {functionDetails[3]?.function_name}
                                        </p>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs>
                                {position.positionRightClicked && (
                                    <div className={classes.cardWrapper}>
                                        <CloseIcon
                                            className={classes.closeIcon}
                                            onClick={handleClick('positionRightClicked')}
                                        ></CloseIcon>
                                        {getApplicationCard(2)}
                                    </div>
                                )}
                            </Grid>
                        </Grid>

                        {position.positionBottomClicked && (
                            <div className={classes.cardBottom}>
                                <CloseIcon
                                    className={classes.closeIcon}
                                    onClick={handleClick('positionBottomClicked')}
                                ></CloseIcon>
                                {getApplicationCard(3)}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {templateView === 'list' && (
                <div>
                    <Grid container spacing={3} className={classes.listViewHeader}>
                        <Grid item xs={3}>
                            <div className={classes.wrapper}>
                                <PuzzleTop></PuzzleTop>
                            </div>
                            <p className={classes.functionName}>
                                {functionDetails[0]?.function_name}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <div className={classes.wrapper}>
                                <PuzzleLeft></PuzzleLeft>
                            </div>
                            <p className={classes.functionName}>
                                {functionDetails[1]?.function_name}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <div className={classes.wrapper}>
                                <PuzzleRight></PuzzleRight>
                            </div>
                            <p className={classes.functionName}>
                                {functionDetails[2]?.function_name}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <div className={classes.wrapper}>
                                <PuzzleBottom></PuzzleBottom>
                            </div>
                            <p className={classes.functionName}>
                                {functionDetails[3]?.function_name}
                            </p>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} className={classes.listViewBody}>
                        {_.map(functionDetails, function (detail, index) {
                            return (
                                index < 4 && (
                                    <Grid
                                        key={'column' + index}
                                        item
                                        xs={3}
                                        className={classes.gridBorder}
                                    >
                                        {_.map(
                                            _.filter(apps, function (app) {
                                                return (
                                                    app.function.toLowerCase() ===
                                                    detail.function_name.toLowerCase()
                                                );
                                            }),
                                            function (app_details) {
                                                return (
                                                    <Card
                                                        key={'app_card_' + app_details.id}
                                                        className={classes.applicationList}
                                                    >
                                                        <CardActionArea
                                                            aria-label="card-action"
                                                            onClick={
                                                                app_details.app_link
                                                                    ? () =>
                                                                          props.history.push(
                                                                              '/app/' +
                                                                                  app_details.id
                                                                          )
                                                                    : void null
                                                            }
                                                        >
                                                            <CardHeader
                                                                title={app_details.name}
                                                                subheader={app_details.description}
                                                            />
                                                        </CardActionArea>
                                                    </Card>
                                                );
                                            }
                                        )}
                                    </Grid>
                                )
                            );
                        })}
                    </Grid>
                </div>
            )}
        </div>
    ];
}

export default SingularDashboard;
