import React from 'react';
import Editor, { loader } from '@monaco-editor/react';

const CodePreview = ({ content, fileType }) => {
    if (fileType && fileType === 'ipynb') {
        loader.config({
            paths: {
                vs: '/monaco-editor/vs'
            }
        });
    }

    return (
        <Editor
            height="90vh"
            defaultLanguage="python"
            defaultValue={content}
            options={{
                readOnly: true,
                minimap: {
                    enabled: false
                }
            }}
        />
    );
};

export default CodePreview;
