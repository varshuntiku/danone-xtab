import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import error_icon from 'assets/img/alertDescription/error_icon.svg';
import warning_icon from 'assets/img/alertDescription/warning_icon.svg';
import info_icon from 'assets/img/alertDescription/info_icon.svg';
import success_icon from 'assets/img/alertDescription/success_icon.svg';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
    alertMessage: {
        display: 'flex',
        padding: '0.5rem',
        gap: '1rem',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },

    alignRight: {
        alignSelf: 'flex-end'
    },
    label: {
        color: `var(--label-color, ${theme.palette.text.default})`,
        fontSize: '1.5rem',
        padding: '1.5rem'
    }
}));
var textColor = '';
const getAlertIcon = (severity) => {
    switch (severity) {
        case 'error':
            textColor = '#FE6A9C';
            return error_icon;
        case 'warning':
            textColor = '#EB8734';
            return warning_icon;
        case 'info':
            textColor = '#4763DA';
            return info_icon;
        case 'success':
            textColor = '#00A11E';
            return success_icon;
        default:
            return false;
    }
};
export default function DescriptionAlerts({ alertInfo, alignRight }) {
    const classes = useStyles();

    if (!alertInfo) {
        return null;
    }

    return (
        <div className={clsx(classes.alertMessage, alignRight ? classes.alignRight : '')}>
            {
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={getAlertIcon(alertInfo.severity)} alt={alertInfo.severity} />
                    <span className={classes.label} style={{ '--label-color': textColor }}>
                        {alertInfo.label}
                    </span>
                </div>
            }
        </div>
    );
}
