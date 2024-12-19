import React from 'react';
import { exportApp } from 'services/app.js';
import { Button, makeStyles } from '@material-ui/core';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { ReactComponent as ExportIcon } from '../../assets//img/export.svg';
import CustomSnackbar from '../CustomSnackbar';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    icon: {
        fill:
            theme.props.mode === 'dark'
                ? theme.palette.text.secondaryText
                : theme.palette.primary.contrastText,
        width: '2.5rem',
        height: '2.5rem'
    },
    exportAppButton: {
        textTransform: 'capitalize',
        fontFamily: theme.body.B1.fontFamily,
        fontSize: theme.layoutSpacing(16),
        fontWeight: 500,
        letterSpacing: theme.layoutSpacing(0.5)
    }
}));

export default function ExportApp({ appId, appName }) {
    const classes = useStyles();
    const [snackbar, setSnackbar] = React.useState({ open: false });
    const handleDownload = async () => {
        try {
            const data = await exportApp({ app_id: appId });
            const sanitizedData = sanitizeHtml(data, {
                allowedTags: [],
                allowedAttributes: {}
            });
            const url = window.URL.createObjectURL(new Blob([sanitizedData]));
            const link = document.createElement('a');
            link.href = url;
            const sanitizedFileName = sanitizeHtml(`${appName}.codx`);
            link.setAttribute('download', sanitizedFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setSnackbar({ open: true, severity: 'error', message: error.message });
        }
    };

    return (
        <React.Fragment>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
            <Button
                size="small"
                variant="outlined"
                startIcon={<ExportIcon className={classes.icon} />}
                onClick={handleDownload}
                aria-label="Export application"
                className={classes.exportAppButton}
            >
                Export Application
            </Button>
        </React.Fragment>
    );
}
