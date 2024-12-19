import React, { useCallback, useEffect, useRef, useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid } from '@material-ui/core';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import clsx from 'clsx';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';

const useStyles = makeStyles((theme) => ({
    demoToolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        width: '100%',
        background: theme.palette.primary.light,
        borderColor: alpha(theme.palette.text.default, 0.4),
        transform: 'translateY(calc(-100% - 10px))',
        '& button': {
            color: theme.palette.primary.contrastText
        },
        '& .rdw-option-active': {
            background: alpha(theme.palette.primary.contrastText, 0.8),
            borderColor: theme.palette.primary.contrastText,
            boxShadow: 'none'
        }
    },
    demoEditor: (props) => ({
        fontSize: '12px',
        background: theme.palette.primary.dark,
        color: theme.palette.text.default,
        overflow: 'hidden',
        '& .public-DraftEditor-content': {
            ...(props.rootStyle && props.rootStyle.css)
        },
        '& .public-DraftStyleDefault-orderedListItem.public-DraftStyleDefault-listLTR:before': {
            top: 'calc(74% - 1em)'
        },
        '& .public-DraftStyleDefault-ltr': {
            textAlign: 'inherit'
        }
    }),
    demoWrapper: {
        position: 'relative',
        border: '1px solid #fff',
        padding: theme.spacing(1),
        width: '100%',
        borderColor: 'transparent',
        background: theme.palette.primary.dark
    },
    actionWrapper: {
        border: '1px solid #fff',
        padding: theme.spacing(1),
        position: 'relative'
    },
    addBtn: {
        margin: theme.spacing(1),
        color: '#000'
    },
    cancelBtn: {
        margin: theme.spacing(1),
        color: '#000'
    },
    bold: {
        background: 'none',
        border: '1px solid none'
    },
    icon: {
        fontSize: '2.5rem',
        color: '#000'
    }
}));

const toolbarConfig = {
    options: ['inline', 'fontSize', 'colorPicker', 'list', 'textAlign', 'remove'],
    inline: {
        options: ['bold', 'italic', 'underline']
    },
    list: {
        options: ['unordered', 'ordered', 'indent', 'outdent']
    },
    colorPicker: {
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        colors: [
            'transparent',
            'rgb(141,230,231)',
            'rgb(211,166,238)',
            'rgb(247,196,61)',
            'rgb(129,210,144)',
            'rgb(1,135,134)',
            'rgb(122,207,255)',
            'rgb(254,106,255)',
            'rgb(255,173,105)',
            'rgb(50,199,179)',
            'rgb(127,211,190)',
            'rgb(211,198,247)',
            'rgb(170,126,240)',
            'rgb(245,224,126)',
            'rgb(66, 228, 188)',
            'rgb(104,131,247)',
            'rgb(242,114,35)',
            'rgb(12,39,68)',
            'rgb(111,180,255)',
            'rgb(245,33,84)',
            'rgb(131,80,215)',
            'rgb(25,165,164)',
            'rgb(209,113,255)',
            'rgb(146,169,55)',
            'rgb(228,161,60)',
            'rgb(98,74,244)',
            'rgb(48,219,218)',
            'rgb(213,234,132)',
            'rgb(250,217,133)',
            'rgb(165,152,244)'
        ]
    }
};

// content.html
// content.rootStyle

export default function TextEditor({ viewMode, content, onAdd, onCancle }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorRef, setEditorRef] = useState();
    const { html: contentHtml } = content || {};
    const [rootStyle, setRootStyle] = useState((content && content.rootStyle) || {});
    const classes = useStyles({ rootStyle });
    const wrapperRef = useRef();
    const [toolbarStyle, setToolbarStyle] = useState();
    useEffect(() => {
        if (contentHtml) {
            const blocksFromHTML = htmlToDraft(contentHtml);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [contentHtml]);

    useEffect(() => {
        if (editorRef) {
            editorRef.focus();
            if (editorRef.update instanceof Function) {
                editorRef.update(editorState);
            }
        }
    }, [editorRef, editorState]);

    useEffect(() => {
        let t;
        if (!viewMode && wrapperRef.current) {
            t = setTimeout(() => {
                const element = wrapperRef.current;
                const rect = element.wrapper.getBoundingClientRect();
                const style = {
                    position: 'fixed',
                    top: `${rect.top - 10}px`,
                    left: `${rect.x - 8}px`,
                    width: `${rect.width + 5}px`
                };
                setToolbarStyle(style);
            }, 100);
        }
        return () => {
            clearTimeout(t);
        };
    }, [wrapperRef, viewMode]);

    const handleClose = useCallback(() => {
        onCancle();
    }, [onCancle]);

    const handleAdd = useCallback(() => {
        const data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        onAdd({ html: data, rootStyle });
        handleClose();
    }, [editorState, handleClose, onAdd, rootStyle]);

    const onEditorStateChange = useCallback((editorState) => {
        setEditorState(editorState);
    }, []);

    return (
        <Grid container direction="row" style={{ height: '100%' }}>
            <Grid item xs={12} style={{ height: '100%', display: 'flex' }}>
                <Editor
                    editorState={editorState}
                    toolbarClassName={classes.demoToolbar}
                    wrapperClassName={classes.demoWrapper}
                    editorClassName={classes.demoEditor}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={toolbarConfig}
                    editorRef={(ref) => setEditorRef(ref)}
                    toolbarHidden={viewMode}
                    readOnly={viewMode}
                    ref={wrapperRef}
                    toolbarStyle={toolbarStyle}
                    stripPastedStyles={true}
                    toolbarCustomButtons={[
                        <VerticalAlignment
                            rootStyle={rootStyle}
                            key="action-btn1"
                            onRootStyleChange={setRootStyle}
                        />,
                        <Box key="action-btn2" marginBottom="6px">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleAdd}
                                className={classes.addBtn}
                                aria-label="Add"
                            >
                                Add
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => handleClose(e)}
                                className={classes.cancelBtn}
                                aria-label="Cancel"
                            >
                                Cancel
                            </Button>
                        </Box>
                    ]}
                />
            </Grid>
        </Grid>
    );
}

function VerticalAlignment({ onRootStyleChange, rootStyle }) {
    const classes = useStyles();
    const handleStyleChange = useCallback(
        (vPos) => {
            switch (vPos) {
                case 'top':
                    onRootStyleChange({
                        vPos,
                        css: {
                            display: 'grid',
                            alignItems: 'flex-start'
                        }
                    });
                    break;
                case 'center':
                    onRootStyleChange({
                        vPos,
                        css: {
                            display: 'grid',
                            alignItems: 'center'
                        }
                    });
                    break;
                case 'bottom':
                    onRootStyleChange({
                        vPos,
                        css: {
                            display: 'grid',
                            alignItems: 'flex-end'
                        }
                    });
                    break;
                default:
                    onRootStyleChange({
                        vPos,
                        css: {
                            display: 'unset',
                            alignItems: 'unset'
                        }
                    });
                    break;
            }
        },
        [onRootStyleChange]
    );
    return (
        <Box key="action-btn" marginBottom="6px" display="flex" alignItems="center" flexWrap="wrap">
            <div
                className={clsx(
                    'rdw-option-wrapper',
                    rootStyle.vPos === 'top' ? 'rdw-option-active' : ''
                )}
                onClick={handleStyleChange.bind(null, rootStyle.vPos !== 'top' ? 'top' : null)}
                title="Align Top"
            >
                <VerticalAlignTopIcon className={classes.icon} fontSize="large" />
            </div>
            <div
                className={clsx(
                    'rdw-option-wrapper',
                    rootStyle.vPos === 'center' ? 'rdw-option-active' : ''
                )}
                onClick={handleStyleChange.bind(
                    null,
                    rootStyle.vPos !== 'center' ? 'center' : null
                )}
                title="Align Center"
            >
                <VerticalAlignCenterIcon className={classes.icon} fontSize="large" />
            </div>
            <div
                className={clsx(
                    'rdw-option-wrapper',
                    rootStyle.vPos === 'bottom' ? 'rdw-option-active' : ''
                )}
                onClick={handleStyleChange.bind(
                    null,
                    rootStyle.vPos !== 'bottom' ? 'bottom' : null
                )}
                title="Align Bottom"
            >
                <VerticalAlignBottomIcon className={classes.icon} fontSize="large" />
            </div>
        </Box>
    );
}
