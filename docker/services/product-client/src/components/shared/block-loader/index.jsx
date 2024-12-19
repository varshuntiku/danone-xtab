import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Box, makeStyles, useTheme } from '@material-ui/core';

import blockLoaderStyles from './styles';

const useStyles = makeStyles(blockLoaderStyles);

const LoadedBox = () => {
    const classes = useStyles();
    return <Box className={clsx(classes.loader, classes.loaded)}></Box>;
};

const UnloadedBox = () => {
    const classes = useStyles();
    return <Box className={classes.loader}></Box>;
};

const BlockLoader = ({ progress = 0, blockCount = 20 }) => {
    const theme = useTheme();
    const progressBlockCount = useMemo(() => {
        const realProgress = Math.max(0, Math.min(100, Math.max(5, progress)));
        const _progressBlockCount = Math.floor((realProgress * blockCount) / 100);
        return _progressBlockCount;
    }, [progress, blockCount]);
    return (
        <Box display="flex" gridGap={theme.spacing(0.315)}>
            {[...Array(parseInt(blockCount))].map((_, i) =>
                i + 1 <= progressBlockCount ? <LoadedBox key={i} /> : <UnloadedBox key={i} />
            )}
        </Box>
    );
};

export default BlockLoader;
