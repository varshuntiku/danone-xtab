import { alpha, makeStyles } from '@material-ui/core';
import Editor, { loader } from '@monaco-editor/react';
import { useState } from 'react';
import clsx from 'clsx';

loader.config({
    paths: {
        vs: '/monaco-editor/min/vs'
    }
});

const useStyles = makeStyles((theme) => ({
    jsonEditor: {
        height: theme.layoutSpacing(140),
        border: '1px solid ' + alpha(theme.palette.primary.contrastText, 0.2),
        borderRadius: theme.layoutSpacing(4),
        '& .monaco-scrollable-element>.scrollbar': {
            width: theme.layoutSpacing(8) + '!important',
            '&.vertical': {
                width: theme.layoutSpacing(8) + '!important',
                '& .slider': {
                    width: theme.layoutSpacing(8) + '!important'
                }
            },
            '&.horizontal': {
                height: theme.layoutSpacing(8) + '!important',
                '& .slider': {
                    height: theme.layoutSpacing(8) + '!important'
                }
            },
            '& .slider': {
                border: `1px solid ${theme.palette.primary.contrastText} !important`,
                borderRadius: theme.layoutSpacing(4),
                background: 'transparent !important'
            }
        }
    },
    editorDisabled: {
        opacity: 0.7,
        pointerEvents: 'none'
    }
}));

export default function JSONEditor({ value, onChange, ...props }) {
    const classes = useStyles();
    const [strValue, setStrValue] = useState(value ? JSON.stringify(value) : '');
    const handleChange = (val) => {
        try {
            const parsed = JSON.parse(val || '{}');
            onChange(parsed);
        } catch (err) {
            //** */
        }
        setStrValue(val);
    };
    //     return <TextField
    //     {...props}
    //     value={strValue}
    //     onChange={handleChange}
    // />
    return (
        <Editor
            {...props}
            width="100%"
            language="json"
            theme={
                localStorage.getItem('codx-products-theme', 'dark') === 'dark' ? 'vs-dark' : 'vs'
            }
            value={strValue}
            options={{
                selectOnLineNumbers: true,
                minimap: { enabled: false },
                lineNumbers: 'off',
                placeholder: 'Hello',
                readOnly: props.disabled || false
            }}
            onChange={handleChange}
            className={
                props.disabled
                    ? clsx(classes.jsonEditor, classes.editorDisabled)
                    : classes.jsonEditor
            }
        />
    );
}
