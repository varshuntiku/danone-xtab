import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import sanitizeHtml from 'sanitize-html-react';

const useStyle = makeStyles((theme) => ({
    headerInfo: {
        fontSize: '2.2rem',
        color: theme.palette.text.default
    },
    fileContainer: {
        display: 'grid',
        gridGap: theme.spacing(3),
        padding: '1rem 1rem 1rem 0rem',
        width: '100%',
        [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
        },
        [theme.breakpoints.up('sm')]: {
            gridTemplateColumns: 'repeat(3, 1fr)'
        },
        [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(4, 1fr)'
        },
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: 'repeat(5, 1fr)'
        }
    },
    fileGrid: {
        color: theme.palette.text.default,
        height: '25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        overflow: 'hidden'
    },
    fileItem: {
        objectFit: 'cover',
        width: '100%',
        borderRadius: '3px',
        flex: 1,
        overflow: 'hidden'
    },
    fileNameText: {
        fontSize: '1.7rem',
        opacity: '70%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    previewContent: {
        padding: '1rem !important'
    },
    filePreview: {
        objectFit: 'cover',
        width: '100%',
        borderRadius: '3px'
    },
    previewDialogRoot: {
        padding: theme.spacing(2)
    },
    closeButton: {
        padding: '2rem',
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        [theme.breakpoints.down('md')]: {
            top: '0.64rem'
        },
        [theme.breakpoints.down('sm')]: {
            top: '0.32rem'
        }
    }
}));

const DialogTitle = (props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.previewDialogRoot} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon fontSize="large" />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

export default function FileGallery(props) {
    const classes = useStyle();
    const [fileList] = useState(props.params?.filesList || []);
    const [totalItems] = useState(props.params?.totalItems || 0);
    const [previewItem, setPreviewItem] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const fileClickHandler = (item) => {
        setPreviewItem(true);
        setActiveItem({
            url: item.fileUrl || item.url,
            name: item.fileName || item.name
        });
    };

    const handlePreviewClose = () => {
        setPreviewItem(false);
        setActiveItem(null);
    };

    return (
        <React.Fragment>
            <div>
                {totalItems ? (
                    <Typography variant="h4" className={classes.headerInfo}>
                        {totalItems}
                    </Typography>
                ) : (
                    ''
                )}
            </div>
            <div className={classes.fileContainer}>
                {fileList.map((item) => (
                    <FileItem
                        key={item.fileName}
                        item={item}
                        onClickHandler={fileClickHandler.bind(null, item)}
                    />
                ))}
            </div>
            <Dialog
                open={previewItem && activeItem}
                onClose={handlePreviewClose}
                scroll="paper"
                fullWidth
                aria-labelledby={activeItem?.name}
                aria-describedby="file-content"
            >
                <DialogTitle classes={classes} onClose={handlePreviewClose} id={activeItem?.name}>
                    {activeItem?.name}
                </DialogTitle>
                <DialogContent className={classes.previewContent} id="file-content">
                    <img src={activeItem?.url} className={classes.filePreview} alt="" />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export const FileItem = ({ item, onClickHandler }) => {
    const classes = useStyle();
    const santizeFileUrl = (url) => {
        return sanitizeHtml(url);
    };
    return (
        <div key={item.fileName} className={classes.fileGrid}>
            <img
                src={santizeFileUrl(item.fileUrl) || santizeFileUrl(item.url)}
                alt={item.fileName || item.name}
                onClick={onClickHandler}
                className={classes.fileItem}
            />
            <Typography variant="h4" className={classes.fileNameText}>
                {item.fileName || item.name}
            </Typography>
        </div>
    );
};
