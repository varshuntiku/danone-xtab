import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import { Typography, alpha, withStyles } from '@material-ui/core';

const styles = (theme) => ({
    gridContainer: {
        padding: '4rem'
    },
    cardContentText: {
        fontSize: '1.4rem',
        color: alpha(theme.palette.text.default, 0.6)
    },
    cardContentGridText1: {
        fontSize: '3rem',
        color: theme.palette.text.default,
        fontWeight: 300
    },
    cardItem: {
        width: '40rem'
    },
    card: {
        backgroundColor: theme.palette.primary.main,
        '& .MuiCardContent-root': {
            padding: theme.spacing(3)
        },
        '& .MuiCardContent-root:last-child': {
            paddingBottom: theme.spacing(4)
        }
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
                        <Grid key={value} item className={classes.cardItem}>
                            <Card elevation={4} className={classes.card}>
                                <CardContent>
                                    <Typography className={classes.cardContentText} gutterBottom>
                                        {value[1]}
                                    </Typography>
                                    {new Intl.NumberFormat('en-US').format(value[0]) !== 'NaN' &&
                                    value[1]?.toLowerCase() !== 'year' ? (
                                        <Typography className={classes.cardContentGridText1}>
                                            {new Intl.NumberFormat('en-US').format(value[0])}
                                        </Typography>
                                    ) : (
                                        <Typography className={classes.cardContentGridText1}>
                                            {value[0]}
                                        </Typography>
                                    )}
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
