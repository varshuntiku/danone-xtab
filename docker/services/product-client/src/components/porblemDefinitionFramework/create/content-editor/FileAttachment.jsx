import { alpha, Chip, CircularProgress } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { uploadAttachment, deleteAttachment } from '../../../../services/project';
import { makeStyles } from '@material-ui/styles';
import AttachmentIcon from '@material-ui/icons/Attachment';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    chip: {
        fontSize: '1.6rem',
        color: alpha(theme.palette.text.default, 0.7),
        maxWidth: '10rem',
        borderColor: alpha(theme.palette.text.default, 0.7),
        cursor: 'pointer',
        '& svg': {
            color: alpha(theme.palette.text.default, 0.7)
        }
    },
    button: {
        background: theme.palette.primary.dark,
        border: 'none',
        color: theme.palette.primary.contrastText,
        borderRadius: '1rem',
        padding: '0.75rem 3rem',
        position: 'relative',
        cursor: 'pointer',
        '&:disabled': {
            pointerEvents: 'none'
        }
    },
    loader: {
        color: theme.palette.primary.contrastText,
        position: 'absolute',
        left: '0.6rem'
    }
}));

export default function FileAttachment({ onChange, attachments, savedAttachments, readOnly }) {
    const classes = useStyles();
    const [files, setFiles] = useState(attachments || []);
    const [loading, setLoading] = useState(0);
    const inputRef = useRef();
    const handleBtnClick = () => {
        inputRef.current.click();
    };
    const handleUploadedFileChange = (files) => {
        setFiles(files);
        onChange(files);
    };
    const handleChange = (event) => {
        event.preventDefault();
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            upload_file(files[i]);
        }
    };
    const upload_file = async (file) => {
        setLoading((s) => s + 1);
        try {
            const data = await uploadAttachment(file);
            const newFiles = [...files, data];
            setFiles([...newFiles]);
            handleUploadedFileChange(newFiles);
        } catch (err) {
            // console.error(err);
        } finally {
            setLoading((s) => s - 1);
        }
    };
    const remove_file = (e, fileName, index) => {
        e.preventDefault();
        const deletedFileName = files[index].filename;
        const newFiles = files.filter((el, i) => i !== index);
        handleUploadedFileChange(newFiles);

        // removing files those are not present in last saved version
        // this check is required because, if user removes a file and then don't save the project then also it will remove the file form blob, which is not expected.
        let shouldDeleteFromBlob = true;
        if (savedAttachments?.length) {
            shouldDeleteFromBlob = !savedAttachments.find((el) => el.filename === deletedFileName);
        }
        if (shouldDeleteFromBlob) {
            deleteAttachment(deletedFileName);
        }
    };
    const isValidImageUrl = (url) => {
        const imgRegex = /\.(jpeg|jpg|gif|png|svg)$/;
        return imgRegex.test(url);
    };

    const sanitizedPath = (url) => {
        if (isValidImageUrl(url)) {
            return sanitizeHtml(url);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                alignItems: 'center'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flex: '1',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    justifyContent: 'flex-end'
                }}
            >
                {files?.map((el, index) => (
                    <Chip
                        key={'files' + index}
                        size="small"
                        className={classes.chip}
                        icon={<AttachmentIcon />}
                        label={el.filename}
                        title={el.filename}
                        onDelete={readOnly ? undefined : (e) => remove_file(e, el.filename, index)}
                        variant="outlined"
                        href={sanitizedPath(el.path)}
                        target="blank"
                        download
                        component={'a'}
                    />
                ))}
            </div>
            <input
                type="file"
                value={''}
                id="file"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={handleChange}
                multiple
            />
            {readOnly ? null : (
                <button
                    id="button"
                    name="button"
                    value="Upload"
                    onClick={handleBtnClick}
                    className={classes.button}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={6} className={classes.loader} /> : null}
                    Upload File
                </button>
            )}
        </div>
    );
}
