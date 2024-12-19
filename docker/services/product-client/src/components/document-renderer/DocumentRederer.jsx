import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    rendererContainer: {
        height: '100%',
        width: 'inherit'
    },
    document: {
        width: '100%',
        height: 'inherit'
    }
}));

export default function DocumentRenderer({ documents }) {
    const classes = useStyles();
    const [documentsList, setDocumentsList] = useState([]);

    useEffect(() => {
        const updatedDocs = documents.map((doc) => {
            return {
                url: doc.path ? doc.path : window.URL.createObjectURL(doc),
                name: doc.path ? doc.filename : doc.name
            };
        });
        setDocumentsList(updatedDocs);
        return () => {
            documents.map((doc, index) => {
                if (!doc.path) {
                    window.URL.revokeObjectURL(updatedDocs[index].url);
                }
            });
        };
    }, [documents]);

    return (
        <div className={classes.rendererContainer}>
            {documentsList.map((doc, i) => {
                return (
                    <embed key={`${doc.name}-${i}`} src={doc.url} className={classes.document} />
                );
            })}
        </div>
    );
}
