import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    InsightContent: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
    },
    InsinghtContainer: {
        backgroundColor: theme.palette.primary.light,
        maxWidth: '35rem',
        padding: '1rem 2rem',
        margin: '2rem 0rem'
    },
    status: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 500
    },
    label: {
        fontSize: '1.5rem',
        color: theme.palette.text.default
    },
    approved: {
        color: theme.palette.primary.contrastText,
        fontSize: '2rem'
    },
    pending: {
        color: theme.palette.error.main,
        fontSize: '2rem'
    }
}));

const checkStatus = (str) => {
    const arr = ['published', 'approved'];
    return arr.some((element) => (str?.toLowerCase().includes(element) ? true : false));
};

const InsightStatus = ({ data }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.InsinghtContainer}>
                <div className={classes.InsightContent}>
                    <Typography variant="h4" className={classes.status}>
                        Status:
                    </Typography>
                    <Typography
                        variant="h4"
                        className={checkStatus(data?.status) ? classes.approved : classes.pending}
                    >
                        {data?.status}
                    </Typography>
                </div>
                <div className={classes.InsightContent}>
                    <Typography variant="h4" className={classes.label}>
                        Updated On:
                    </Typography>
                    <Typography variant="h4" className={classes.label}>
                        {data?.updated_on || '-'}
                    </Typography>
                </div>
                <div className={classes.InsightContent}>
                    <Typography variant="h4" className={classes.label}>
                        Updated By:
                    </Typography>
                    <Typography variant="h4" className={classes.label}>
                        {data?.updated_by || '-'}
                    </Typography>
                </div>
            </div>
        </>
    );
};

export default InsightStatus;
