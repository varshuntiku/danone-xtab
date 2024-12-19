import React, { useEffect, useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    alpha,
    makeStyles,
    withStyles
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Typography from 'components/elements/typography/typography';
import {
    getExperimentChecpointResultsById,
    getExperimentTrainingResultById
} from 'services/llmWorkbench/llm-workbench';
import CodxCircularLoader from 'components/CodxCircularLoader';

const useStyles = makeStyles((theme) => ({
    text: {
        textTransform: 'none!important',
        color: theme.palette.primary.contrastText
    },
    dialog: {
        margin: 'auto',
        maxWidth: '75%'
    },
    dialogContent: {
        height: '75vh',
        maxHeight: '75vh',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    },
    code: {
        flex: 1,
        whiteSpace: 'pre-wrap',
        '&::before': {
            counterReset: 'listing'
        },
        '& code': {
            fontSize: theme.spacing(2),
            color: theme.palette.text.contrastText,
            counterIncrement: 'listing',
            textAlign: 'left',
            float: 'left',
            clear: 'left',
            padding: `${theme.spacing(1)}`,
            '&::before': {
                content: 'counter(listing) ". "',
                display: 'inline-block',
                float: 'left',
                height: theme.spacing(4),
                paddingLeft: 'auto',
                marginLeft: 'auto',
                textAlign: 'right'
            }
        }
    }
}));

const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.primary.contrastText,
        fontSize: theme.spacing(2),
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        wordBreak: 'break-word',
        verticalAlign: 'top'
    },
    head: {
        background: theme.palette.background.tableHeader,
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        lineHeight: theme.spacing(3),
        borderBottom: '1px solid ' + alpha(theme.palette.border.dashboard, 0.4),
        '& span:hover': {
            color: theme.palette.primary.contrastText
        },
        minWidth: theme.spacing(60)
    }
}))(TableCell);

const TrainingResults = ({ open, closeDialog, modelId, checkpointId, expTraining }) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        const loadData = async () => {
            if (modelId) {
                try {
                    setLoading(true);
                    let result;
                    if (expTraining) result = await getExperimentTrainingResultById(modelId);
                    else if (checkpointId)
                        result = await getExperimentChecpointResultsById(modelId, checkpointId);
                    setData(result);
                    setError('');
                } catch (error) {
                    // console.error(error);
                    setData([]);
                    setError('The training result does not exist or is been generated!');
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
        return () => {
            setData([]);
            setError('');
        };
    }, [modelId, checkpointId, expTraining]);
    return (
        <Dialog fullWidth className={classes.dialog} open={open}>
            <DialogContent className={classes.dialogContent}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h1" className={classes.text}>
                        Results
                    </Typography>
                    <IconButton onClick={closeDialog}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                <Divider />
                <Box
                    display={error ? 'flex' : 'none'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flex={1}
                    overflow={'auto'}
                >
                    <Typography variant="h3" className={classes.text}>
                        {error}
                    </Typography>
                </Box>
                <Box
                    display={loading ? 'flex' : 'none'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    flex={1}
                    overflow={'auto'}
                >
                    <CodxCircularLoader size={60} center />;
                </Box>
                <Box display={!loading && !error ? 'box' : 'none'} flex={1} overflow={'auto'}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Instructions</StyledTableCell>
                                <StyledTableCell>Actual Response</StyledTableCell>
                                <StyledTableCell>Model Response</StyledTableCell>
                                <StyledTableCell>Untrained Model Response</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((row, i) => (
                                <TableRow key={i}>
                                    <StyledTableCell>{row.instructions}</StyledTableCell>
                                    <StyledTableCell>{row.actual_response}</StyledTableCell>
                                    <StyledTableCell>{row.model_response}</StyledTableCell>
                                    <StyledTableCell>{row.untrained_response}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TrainingResults;
