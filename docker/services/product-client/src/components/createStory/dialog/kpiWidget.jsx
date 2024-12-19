import React from 'react';
import { CircularProgress, withStyles } from '@material-ui/core';
import appWidgetLabelStyle from '../../../assets/jss/appWidgetLabelStyle';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Grid from '@material-ui/core/Grid';

class KpiWidget extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        const { params, item, classes } = this.props;

        var extra_label_class = classes.graphDataExtraLabel;
        var extra_label = '';

        if (params) {
            if (params.extra_label) {
                extra_label = params.extra_label;
            }

            if (params.extra_dir) {
                if (params.extra_dir === 'up') {
                    extra_label_class = classes.graphDataExtraLabelUp;
                    if (!params.extra_label) {
                        extra_label = <ArrowUpwardIcon className={classes.kpiDataExtraIcon} />;
                    }
                } else if (params.extra_dir === 'down') {
                    extra_label_class = classes.graphDataExtraLabelDown;
                    if (!params.extra_label) {
                        extra_label = <ArrowDownwardIcon className={classes.kpiDataExtraIcon} />;
                    }
                }
            }
        }

        return (
            //   <div className={classes.graphLabelContainer}>

            //     <div className={classes.graphLabel}>
            //         <React.Fragment>
            //               <Typography color="initial" variant="h5">{item.name}</Typography>
            //         </React.Fragment>
            //     </div>
            //       <div className={classes.graphDataContainer}>
            //         <div className={params ? classes.graphDataExtra : classes.graphData}>
            //           <Typography color="initial" className={classes.graphDataLabel} variant="h4" >
            //           </Typography>
            //           <Typography color="initial" className={classes.graphDataLabel} variant="h5" >
            //           </Typography>
            //         </div>
            //       </div>
            //       <div className={classes.graphDataContainer}>
            //         <div className={params ? classes.graphDataExtra : classes.graphData}>
            //           <Typography color="initial" className={classes.graphDataLabel} variant="h4">

            //           </Typography>
            //           <Typography color="initial" className={extra_label_class} variant="h5">
            //             {extra_label} {params.extra_value}
            //           </Typography>
            //         </div>
            //         <br clear="all" />
            //       </div>
            //   </div>
            item.variant !== 'percentage' ? (
                <Paper
                    elevation={3}
                    className={`${classes.graphLabelContainer} ${classes.kpiGrpahCont}`}
                >
                    <Grid container direction="row" style={{ padding: '18px' }}>
                        <Grid item xs={12}>
                            <Typography color="initial" variant="h5" className={classes.kpiTitle}>
                                {item.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography color="initial" className={extra_label_class} variant="h5">
                                {extra_label}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="initial"
                                className={classes.graphDataLabel}
                                variant="h5"
                            >
                                {params.value}
                            </Typography>
                            <br />
                            <Typography color="initial" className={extra_label_class} variant="h6">
                                {params.extra_value}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ) : (
                <Paper
                    elevation={3}
                    className={`${classes.graphLabelContainer} ${classes.kpiGrpahCont}`}
                >
                    <div>
                        <Typography
                            color="initial"
                            variant="h5"
                            className={classes.kpiTitle}
                            style={{ padding: '1rem' }}
                        >
                            {item.name}
                        </Typography>
                    </div>
                    <div
                        id={'percentageVariant' + item.name}
                        className={classes.percentageVariantKpi}
                    >
                        <div className={classes.extraTitle}>
                            <div>
                                <Typography color="initial" variant="h5">
                                    {params.extra_title ? params.extra_title : ''}
                                </Typography>
                            </div>
                            <div id={'percentageVariant_textcontainer' + item.name}>
                                <div>
                                    <Typography
                                        color="initial"
                                        className={classes.variantPercentageExtraLabel}
                                        style={{
                                            color: params.extra_value_color
                                        }}
                                        variant="h5"
                                    >
                                        {params.extra_value}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className={classes.circularProgress}>
                            <div>
                                <Typography className={classes.variantPercentageValue} variant="h4">
                                    {params.extra_dir &&
                                        (params.extra_dir == 'down' ? (
                                            <ArrowDownwardIcon
                                                className={classes.variantPercentageExtraIcon}
                                                style={{
                                                    color: params.extra_dir_color
                                                }}
                                            />
                                        ) : (
                                            <ArrowUpwardIcon
                                                className={classes.variantPercentageExtraIcon}
                                                style={{
                                                    color: params.extra_dir_color
                                                }}
                                            />
                                        ))}
                                    {item.value + '%'}
                                </Typography>
                            </div>
                            <div className={classes.circular}>
                                <CircularProgress
                                    variant="determinate"
                                    className={classes.bottom}
                                    size={'8rem'}
                                    thickness={6}
                                    value={100}
                                />
                                <CircularProgress
                                    className={classes.variantPercentageProgress}
                                    style={{
                                        color: params.variant_color
                                    }}
                                    thickness={6}
                                    size={'8rem'}
                                    variant="determinate"
                                    value={item.value}
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
            )
        );
    }
}

export default withStyles(
    (theme) => ({
        ...appWidgetLabelStyle(theme)
    }),
    { useTheme: true }
)(KpiWidget);
