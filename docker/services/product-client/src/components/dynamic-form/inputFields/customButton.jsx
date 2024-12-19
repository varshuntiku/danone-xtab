import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: theme.spacing(1.875),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    }
}));

export default function CustomButton(props) {
    const { classes, field_info, buttonName } = props;
    const className = useStyles();

    const triggerOnClick = () => {
        props.onClickFunction();
    };

    return (
        <Button
            onClick={triggerOnClick}
            variant={field_info.variant}
            size={field_info.size}
            disabled={field_info.disabled}
            className={classes.button ? classes.button : className.button}
            aria-label={buttonName}
        >
            {buttonName}
        </Button>
    );
}
