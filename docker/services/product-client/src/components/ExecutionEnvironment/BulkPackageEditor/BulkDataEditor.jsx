import React from 'react';
import Editor, { loader } from '@monaco-editor/react';

if (loader) {
    loader.config({
        paths: {
            vs: '/monaco-editor/min/vs'
        }
    });
}

function BulkDataEditor({ config }) {
    return (
        <React.Fragment>
            <Editor
                key={config.key}
                width={config.width}
                language={config.language}
                theme={config.theme}
                value={config.value}
                options={config.options}
                onChange={config.onChange}
            />
        </React.Fragment>
    );
}

export default BulkDataEditor;
