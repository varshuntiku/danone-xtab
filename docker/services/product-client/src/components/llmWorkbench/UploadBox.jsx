import React, { useRef } from 'react';
import { Box, Button, IconButton, LinearProgress, makeStyles } from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import { Delete, Publish, Clear } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        border: `dashed 1px ${theme.palette.border.dashboard}`,
        '& svg': {
            fontSize: '10rem',
            strokeWidth: '0.5rem'
        }
    },
    uploadButton: {
        display: 'none'
    },
    browse: {
        padding: 0,
        minWidth: 0,
        textTransform: 'capitalize',
        '&.Mui-disabled': {
            color: theme.palette.border.dashboard
        }
    },
    fileBox: {
        border: `1px solid ${theme.palette.border.dashboard}`,
        '& .delete-icon': { color: '#E13655' }
    },
    progressBar: {
        backgroundColor: theme.palette.primary.main,
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: theme.palette.text.default
        }
    }
}));

const UploadBox = ({
    disabled = false,
    uploadAgain = false,
    multiple = false,
    onChange = () => {},
    onUpload = () => {},
    onDelete = () => {},
    onDrop = () => {},
    files = [],
    accept = '*'
}) => {
    const fileRef = useRef(null);
    const classes = useStyles();

    const dialogOpen = () => {
        if (disabled) return;
        fileRef.current.value = null;
        fileRef.current.click();
    };

    return (
        <Box display="flex" flexDirection="column" gridGap="2.4rem">
            <Box
                className={classes.wrapper}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                padding="4rem"
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <BackupOutlinedIcon fontSize="large" />
                <input
                    type="file"
                    ref={fileRef}
                    multiple={multiple}
                    className={classes.uploadButton}
                    disabled={disabled || uploadAgain}
                    onChange={onChange}
                    accept={accept}
                />
                <Box display="flex" gridGap="0.5rem" alignItems="center">
                    <Typography variant="b7">Drag & drop a file or</Typography>
                    <Button
                        className={classes.browse}
                        variant="text"
                        disabled={disabled || uploadAgain}
                        onClick={dialogOpen}
                    >
                        Browse
                    </Button>
                </Box>
            </Box>
            {!!files.length && (
                <Box display="flex" flexDirection="column" gridGap="1.2rem">
                    {files.map(({ file, uploaded, uploading, loaded, status }, index) => {
                        let button = [];

                        if (uploaded) {
                            button = [
                                <IconButton
                                    size="small"
                                    disabled={disabled}
                                    key={`delete`}
                                    onClick={() => onDelete(index)}
                                >
                                    <Delete className="delete-icon" fontSize="medium" />
                                </IconButton>
                            ];
                        } else if (uploading) {
                            button = [];
                        } else if (loaded) {
                            button = [
                                <IconButton
                                    size="small"
                                    disabled={disabled}
                                    key={`cancel`}
                                    onClick={() => onDelete(index)}
                                >
                                    <Clear className="delete-icon" fontSize="medium" />
                                </IconButton>,
                                <IconButton
                                    size="small"
                                    key={`upload`}
                                    onClick={() => onUpload(index)}
                                >
                                    <Publish fontSize="medium" />
                                </IconButton>
                            ];
                        }
                        return (
                            <Box className={classes.fileBox} key={`${file.name}_${file.size}`}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    paddingY="0.5rem"
                                    paddingLeft="1rem"
                                >
                                    <Typography variant="b7" style={{ textTransform: 'none' }}>
                                        {file.name}
                                    </Typography>
                                    <Box>{button}</Box>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    className={classes.progressBar}
                                    value={status}
                                    color="primary"
                                />
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default UploadBox;
