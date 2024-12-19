import { Box, Button, IconButton, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import customModelsStyle from '../../assets/jss/llmWorkbench/customModelsStyle';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles(customModelsStyle);

const CustomModels = () => {
    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <Typography variant="h4" className={classes.text}>
                Upload Model
            </Typography>
            <Box className={classes.uploadContainer}>
                <Box
                    className={classes.wrapper}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    padding="4rem"
                >
                    <BackupOutlinedIcon fontSize="large" />
                    <input type="file" multiple={true} className={classes.uploadButton} />
                    <Box display="flex" gridGap="0.5rem" alignItems="center">
                        <Typography variant="h5" className={classes.text}>
                            Drag & drop a file or
                        </Typography>
                        <Button
                            className={classes.browse}
                            variant="text"
                            disabled={false}
                            onClick={() => {}}
                        >
                            Browse
                        </Button>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY="0.5rem"
                    paddingLeft="1rem"
                    className={classes.fileBox}
                >
                    <Typography variant="h5" className={classes.text}>
                        File_one
                    </Typography>
                    <IconButton size="small" disabled={false}>
                        <Delete className="delete-icon" fontSize="medium" />
                    </IconButton>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY="0.5rem"
                    paddingLeft="1rem"
                    className={classes.fileBox}
                >
                    <Typography variant="h5" className={classes.text}>
                        File_two
                    </Typography>
                    <IconButton size="small" disabled={false}>
                        <Delete className="delete-icon" fontSize="medium" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default CustomModels;
