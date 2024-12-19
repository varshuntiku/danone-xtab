
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import customSnackbarStyles from './CustomSnackbar.module.css';
import CustomCloseIcon from './assets/CustomCloseIcon';
import CheckCircleIcon from './assets/CheckCircleIcon';
import ErrorIcon from './assets/ErrorIcon';
import WarningIcon from './assets/WarningIcon';

const severityStyles = {
    success: {
        backgroundColor: '#00A582', // Green
        icon: <CheckCircleIcon />,
    },
    warning: {
        backgroundColor: '#FF9800', // Orange
        icon: <WarningIcon />,
    },
    error: {
        backgroundColor: '#F44336', // Red
        icon: <ErrorIcon />,
    },
};

const CustomSnackbar = ({ message, severity, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message?.length) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                const closeTimer = setTimeout(() => {
                    onClose();
                }, 500); // Delay to allow animation to complete
                return () => clearTimeout(closeTimer);
            }, 2000); // Duration for showing message
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    const handleCloseClick = () => {
        setShow(false);
        setTimeout(() => {
            onClose();
        }, 500); // Delay to allow closing animation to complete
    };

    const { backgroundColor, icon } = severityStyles[severity] || severityStyles.error;

    return (
        <div
            className={`${customSnackbarStyles.customSnackbar} ${show ? customSnackbarStyles.customSnackbarShow : ''}`}
            style={{ backgroundColor }}
        >
            <span className={customSnackbarStyles.snackbarIcon}>{icon}</span>
            <span className={customSnackbarStyles.snackbarMessage}>{message}</span>
            <div className={customSnackbarStyles.snackbarClose} onClick={handleCloseClick}>
                <CustomCloseIcon />
            </div>
        </div>
    );
};

CustomSnackbar.propTypes = {

    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['success', 'warning', 'error']),
    onClose: PropTypes.func.isRequired,
};

export default CustomSnackbar;
