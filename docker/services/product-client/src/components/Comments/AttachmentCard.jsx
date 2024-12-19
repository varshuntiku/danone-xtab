import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
    attachmentCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
        height: '4rem',
        border: 'none',
        backgroundColor: `${theme.palette.background.attachment}`,
        borderRadius: '2px',
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        fontSize: '1.3rem',
        gap: '0.5rem'
    },
    fileIcon: {
        width: '1.6rem',
        height: '1.6rem'
    },
    fileName: {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '60%'
    },
    downloadIcon: {
        width: '1.7rem',
        height: '1.7rem'
    },
    downloadButton: {
        marginLeft: 'auto'
    }
}));

const AttachmentCard = ({ fileUrl, fileName, fileSize }) => {
    const classes = useStyles();
    const trimmedFileName = fileName.length > 40 ? fileName.substring(0, 40) + '...' : fileName;
    return (
        <div className={classes.attachmentCard}>
            <DescriptionIcon className={classes.fileIcon} data-testid="DescriptionIcon" />
            <span className={classes.fileName}>{trimmedFileName}</span>
            <span>{fileSize}</span>
            <IconButton size="small" href={fileUrl} download className={classes.downloadButton}>
                <GetAppIcon className={classes.downloadIcon} />
            </IconButton>
        </div>
    );
};

export default AttachmentCard;
