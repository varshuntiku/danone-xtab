import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid, IconButton, Button } from '@material-ui/core';
import NoKpi from '../../assets/img/nokpi.png';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import * as _ from 'underscore';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.dark,
        border: '0.5px solid ' + theme.palette.border.color,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2.5)
    },
    root1: {
        fontSize: '1.2rem',
        marginTop: theme.spacing(1)
    },
    root2: {
        fontSize: '1.4rem'
    },
    content: {
        flex: '1 0 auto'
    },
    box: {
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.contrastText,
        height: theme.spacing(14),
        width: theme.spacing(14),
        padding: theme.spacing(1)
    },

    img: {
        // height: theme.spacing(10),
        // width: theme.spacing(10),
        paddingTop: theme.spacing(2),
        width: '100%'
    },
    arrow: {
        float: 'right',
        // padding: theme.spacing(6, 2, 5, 10),
        color: theme.palette.primary.contrastText
        // fontSize: '24px'
    },
    icon: {
        // fontSize: '40px',
        // color: '#67F1C1',
    },
    actionsButton: {
        borderRadius: theme.spacing(3),
        marginRight: theme.spacing(1),
        fontSize: '1.5rem'
    },
    title: {
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        fontSize: '2rem',
        fontWeight: 300,
        '&:hover': {
            opacity: '0.75'
        }
    },
    description: {
        fontSize: '1.6rem',
        fontWeight: 400,
        opacity: '60%',
        paddingTop: theme.spacing(1)
    }
}));

export default function StrategyPlanningCard(props) {
    const classes = useStyles();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    var data = props.apps;
    var functionName = props.function;

    const onClickAppConfigure = (app_id) => {
        var found_app = _.find(data, function (app_item) {
            return app_item.id === parseInt(app_id);
        });
        if (found_app && found_app.config_link) {
            window.open(import.meta.env['REACT_APP_PLATFORM'] + found_app.config_link, '_blank');
        }
    };

    const onClickAppSolution = (app_id) => {
        var found_app = _.find(data, function (app_item) {
            return app_item.id === parseInt(app_id);
        });

        if (found_app && found_app.blueprint_link) {
            window.open(import.meta.env['REACT_APP_PLATFORM'] + found_app.blueprint_link, '_blank');
        }
    };

    const onClickAppApproach = (app_id) => {
        var found_app = _.find(data, function (app_item) {
            return app_item.id === parseInt(app_id);
        });

        if (found_app && found_app.approach_url) {
            var office_view_url =
                'https://view.officeapps.live.com/op/view.aspx?src=' +
                encodeURIComponent(found_app.approach_url);
            window.open(office_view_url, '_new');
        }
    };

    return (
        <div>
            {_.map(
                _.filter(data, function (item) {
                    return item.function === functionName;
                }),
                function (app_data) {
                    return (
                        <Card className={classes.root} key={app_data.id}>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Grid item xs={4}>
                                    <div
                                        className={classes.title}
                                        onClick={
                                            app_data.app_link
                                                ? () => props.history.push('/app/' + app_data.id)
                                                : void null
                                        }
                                    >
                                        {app_data.name}
                                    </div>
                                    <div className={classes.description}>
                                        {app_data.description}
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div className={classes.box}>
                                        <img
                                            src={NoKpi}
                                            alt="No KPIs found"
                                            className={classes.img}
                                        />
                                    </div>
                                    <div className={classes.root1}>Identify main KPI to show </div>
                                </Grid>
                                <Grid item xs>
                                    <div className={classes.actionsContainer}>
                                        <Button
                                            variant="outlined"
                                            className={classes.actionsButton}
                                            aria-label="Action"
                                        >
                                            <StarBorderIcon
                                                fontSize={'large'}
                                                className={classes.icon}
                                            />
                                        </Button>
                                        <Button
                                            aria-label="customize"
                                            variant="outlined"
                                            className={classes.actionsButton}
                                            onClick={() => onClickAppSolution(app_data.id)}
                                        >
                                            Customize
                                        </Button>
                                        <Button
                                            aria-label="configure"
                                            variant="outlined"
                                            className={classes.actionsButton}
                                            onClick={() => onClickAppConfigure(app_data.id)}
                                        >
                                            Configure
                                        </Button>
                                        <Button
                                            aria-label="wiki"
                                            variant="outlined"
                                            className={classes.actionsButton}
                                            onClick={() => onClickAppApproach(app_data.id)}
                                        >
                                            Wiki
                                        </Button>
                                        <IconButton
                                            aria-label="forward"
                                            className={classes.arrow}
                                            onClick={
                                                app_data.app_link
                                                    ? () =>
                                                          props.history.push('/app/' + app_data.id)
                                                    : void null
                                            }
                                        >
                                            <ArrowForwardIosIcon className={classes.icon} />
                                        </IconButton>
                                        <br />
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                    );
                },
                this
            )}
        </div>
    );
}
