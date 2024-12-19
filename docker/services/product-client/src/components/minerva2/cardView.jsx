import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import { Typography, withStyles } from '@material-ui/core';

const styles = (theme) => ({
    gridContainer: {
        flexGrow: 1,
        padding: '5rem'
    },
    cardStyle1: {
        backgroundColor: theme.palette.primary.main,
        width: 340,
        height: 280,
        borderRadius: '1rem'
        // boxShadow: '0px 7px 29px 0px #0000006e'
    },
    cardStyle2: {
        backgroundColor: theme.palette.primary.main,
        width: '63rem',
        height: '40.5rem',
        borderRadius: '1rem'
        // boxShadow: '0px 7px 29px 0px #0000006e'
    },
    cardContentTextSection: {
        backgroundColor: theme.palette.primary.contrastText,
        paddingBottom: '5rem',
        paddingTop: '5rem',
        marginLeft: '-3rem',
        marginRight: '-3rem',
        marginTop: '-2rem'
    },
    cardContentText: {
        fontSize: '2.5rem',
        color: theme.palette.primary.dark
    },
    cardContentGridSection: {
        marginLeft: '-2rem',
        marginRight: '-2rem',
        paddingBottom: '0.2rem'
    },
    cardContentGridContainer1: {
        height: '185px'
    },
    cardContentGridContainer2: {
        height: '27.5rem'
    },
    cardContentGridItem: {
        height: 'min-content'
    },
    cardContentGridText1: {
        fontSize: '6.75rem',
        color: theme.palette.text.default
    },
    cardContentGridText2: {
        fontSize: '6.75rem',
        color: theme.palette.text.default,
        marginBottom: '2.5rem'
    }
});
class CardView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { classes } = this.props;
        var newArray = this.props.graphData.data.values.map((e, i) => [
            e,
            this.props.graphData.data.columns[i]
        ]);
        return (
            <React.Fragment>
                <Grid
                    container
                    className={classes.gridContainer}
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                >
                    {newArray.map((value) => (
                        <Grid key={value} item>
                            <Card
                                elevation={0}
                                className={
                                    this.props.graphData.data.columns.length > 4
                                        ? classes.cardStyle1
                                        : classes.cardStyle2
                                }
                            >
                                <CardContent>
                                    <div className={classes.cardContentTextSection}>
                                        <Typography
                                            className={classes.cardContentText}
                                            align="center"
                                        >
                                            {value[1]}
                                        </Typography>
                                    </div>
                                    <div className={classes.cardContentGridSection}>
                                        <Grid
                                            direction="row"
                                            container
                                            spacing={0}
                                            alignItems="center"
                                            justifyContent="center"
                                            className={
                                                this.props.graphData.data.columns.length > 4
                                                    ? classes.cardContentGridContainer1
                                                    : classes.cardContentGridContainer2
                                            }
                                        >
                                            <Grid
                                                item
                                                className={classes.cardContentGridItem}
                                                align="center"
                                            >
                                                {new Intl.NumberFormat('en-US').format(value[0]) !==
                                                    'NaN' && value[1] !== 'year' ? (
                                                    <Typography
                                                        className={classes.cardContentGridText1}
                                                    >
                                                        {new Intl.NumberFormat('en-US').format(
                                                            value[0]
                                                        )}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        className={classes.cardContentGridText2}
                                                    >
                                                        {value[0]}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(
    (theme) => ({
        ...styles(theme)
    }),
    { withTheme: true }
)(CardView);
