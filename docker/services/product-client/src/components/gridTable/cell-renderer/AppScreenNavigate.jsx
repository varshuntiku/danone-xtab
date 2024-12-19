import React from 'react';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Link, matchPath, withRouter } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    icon: {
        fontSize: '2.5rem'
    },
    link: {
        color: theme.palette.text.titleText,
        fontSize: '1.6rem',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    colorContrast: {
        color: theme.palette.primary.contrastText
    }
}));

function AppScreenNavigate({ params, ...props }) {
    const appId = getAppId();

    const classes = useStyles();

    const handleClick = () => {
        props.history.push('/app/' + appId + '/' + params.value, {
            filterState: params.filterState,
            hideFilter: params.hideFilter
        });
    };
    if (params.button) {
        return (
            <Button
                onClick={handleClick}
                variant={params.button?.variant || 'outlined'}
                size={params.button?.size || 'small'}
                aria-label={params.button?.text || 'Click'}
            >
                {params.button?.text || 'Click'}
            </Button>
        );
    } else if (params.link) {
        return (
            <Link
                to="#"
                onClick={handleClick}
                title={params.title}
                style={params.style}
                className={clsx({
                    [classes.link]: true,
                    [classes.colorContrast]: params.color === 'contrast'
                })}
            >
                {params.text}
            </Link>
        );
    }
    return (
        <IconButton size="small" onClick={handleClick}>
            <PlayCircleOutlineIcon fontSize={params.size || 'large'} />
        </IconButton>
    );
}

function getAppId() {
    const match = matchPath(window.location.pathname, {
        path: '/app/:app_id'
    });
    return match?.params?.app_id;
}

export default withRouter(AppScreenNavigate);
