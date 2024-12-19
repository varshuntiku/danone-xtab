import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
    editBox: {
        marginTop: '1.2rem',
        width: '100%',
        border: '1px solid black',
        borderRadius: '2px',
        padding: '1.6rem',
        paddingTop: '1.2rem',
        boxSizing: 'border-box',
        transition: 'border 0.3s, height 0.3s',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    textFieldWrapper: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    textField: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontSize: '1.6rem',
        lineHeight: '1.9rem',
        '& .MuiInputBase-root': {
            fontSize: '1.6rem',
            lineHeight: '1.9rem',
            padding: 0,
            alignItems: 'flex-start'
        },
        '& .MuiInputBase-input': {
            minHeight: '6rem'
        },
        '&::placeholder': {
            color: 'black',
            fontSize: '1.5rem'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
        }
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '3rem',
        marginTop: '1rem'
    },
    iconButton: {
        padding: theme.spacing(1)
    }
}));

const CommentEdit = ({ commentText, onChange, onSave, onCancel }) => {
    const classes = useStyles();

    return (
        <div className={classes.editBox}>
            <div className={classes.textFieldWrapper}>
                <TextField
                    value={commentText}
                    onChange={onChange}
                    multiline
                    className={classes.textField}
                    placeholder="Edit your comment"
                    InputProps={{
                        disableUnderline: true,
                        classes: { root: classes.textField }
                    }}
                />
            </div>
            <div className={classes.actionButtons}>
                <div>
                    <IconButton className={classes.iconButton} data-testid="attachIcon">
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton className={classes.iconButton} data-testid="InsertEmotionIcon">
                        <InsertEmoticonIcon />
                    </IconButton>
                </div>
                <div>
                    <IconButton
                        className={classes.iconButton}
                        onClick={onSave}
                        data-testid="DoneIcon"
                    >
                        <DoneIcon />
                    </IconButton>
                    <IconButton
                        className={classes.iconButton}
                        onClick={onCancel}
                        data-testid="cancelIcon"
                    >
                        <CancelIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default CommentEdit;
