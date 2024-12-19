import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function Followup() {
    return (
        <React.Fragment>
            <Grid container direction="row" className="layoutSize">
                <Grid item xs={12} className="layoutSize">
                    <Typography variant="h2">FOLLOW UP - IN PROGRESS</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
