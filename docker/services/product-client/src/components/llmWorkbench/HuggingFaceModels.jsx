import React from 'react';
import huggingFaceModelsStyle from 'assets/jss/llmWorkbench/huggingFaceModelsStyle';
import { Box, makeStyles } from '@material-ui/core';
import Tasks from './Tasks';
import Models from './Models';

const useStyles = makeStyles(huggingFaceModelsStyle);
const HuggingFaceModels = () => {
    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <Box className={classes.tasks}>
                <Tasks />
            </Box>
            <Box className={classes.models}>
                <Models />
            </Box>
        </Box>
    );
};

export default HuggingFaceModels;
