import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import clsx from 'clsx';
import CodxPopupDialog from 'components/custom/CodxPoupDialog';
import { Button } from '@material-ui/core';
import { ReactComponent as Warning } from 'assets/img/WarningGroup.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    inline: {
        display: 'inline-flex'
    },
    formControl: {
        // margin: theme.spacing(3),
    },
    defaultColor: {
        color: theme.palette.text.default
    },
    label: {
        fontSize: '1.6rem',
        color: `${theme.palette.text.default} !important`
    },
    helperTextFont: {
        fontSize: '1.2rem'
    },
    font1: {
        fontSize: '1.6rem'
    },
    iconSize: {
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    dialogPaper: {
        width: '30%',
        backdropFilter: 'blur(2rem)',
        borderRadius: 'unset'
    },
    dialogRoot: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        justifyContent: 'space-between',
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        },
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    dialogTitle: {
        fontSize: '2.6rem',
        width: '60%',
        letterSpacing: '1.5px',
        color: theme.palette.text.default,
        display: 'flex',
        fontFamily: 'Graphik Compact',
        alignItems: 'center',
        gap: '1rem',
        '& svg': {
            width: '2.6rem',
            height: '2.6rem',
            fill: theme.palette.text.contrastText
        }
    },
    closeButton: {
        width: '4rem',
        height: '4rem',
        padding: '0',
        marginRight: '-0.4rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '2rem',
            height: '2rem'
        }
    },
    dialogContent: {
        color: theme.palette.text.titleText,
        fontSize: '1.67rem'
    },
    content: {
        fontSize: '1.67rem',
        fontWeight: '400',
        lineHeight: '2rem',
        letterSpacing: '0.5px'
    },
    proceed: {
        marginBottom: '2.4rem',
        marginRight: '1.6rem'
    },
    cancel: {
        marginBottom: '2.4rem'
    }
}));

export default function SpecialRadio({ onChange, params }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(params?.value);
    const [dialogOpen, setOpen] = React.useState(false);
    let dialogContent = (
        <span className={classes.content}>
            <span>{`Changing the navigation placement from ${
                params?.from == 'left' ? 'top' : 'left'
            } to ${
                params?.from == 'left' ? 'left' : 'top'
            } will affect the initial screen design`}</span>
            <br></br>
            <br></br>
            <span>Are you sure you want to proceed?</span>
        </span>
    );

    let dialogTitle = (
        <span className={classes.dialogTitle}>
            <Warning></Warning> Warning
        </span>
    );

    const handleChange = () => {
        setOpen(true);
    };
    const confirmHandler = () => {
        setValue(true);
        onChange(true, params?.from);
        setOpen(false);
    };
    const alertDialogActions = (
        <Fragment>
            <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                className={classes.cancel}
                aria-label="Cancel"
            >
                Cancel
            </Button>
            <Button
                aria-label="Create Alert"
                variant="contained"
                className={classes.proceed}
                onClick={() => {
                    confirmHandler();
                }}
            >
                yes, Proceed
            </Button>
        </Fragment>
    );

    useEffect(() => {
        setValue(params?.value);
    }, [params]);

    return (
        <div className={clsx(classes.root, { [classes.inline]: params?.inline })}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormControlLabel
                    control={
                        <Radio
                            checked={params?.falsy ? !value : value}
                            onChange={handleChange}
                            name={params.name}
                            className={classes.iconSize}
                            disabled={params.disabled}
                        />
                    }
                    classes={{
                        label: clsx(classes.defaultColor, classes.font1)
                    }}
                    label={params?.label}
                />
                <FormHelperText className={clsx(classes.helperTextFont, classes.defaultColor)}>
                    {params?.helperText}
                </FormHelperText>
            </FormControl>
            <CodxPopupDialog
                open={dialogOpen}
                setOpen={setOpen}
                onClose={() => setOpen(false)}
                dialogTitle={dialogTitle}
                dialogContent={dialogContent}
                dialogActions={alertDialogActions}
                maxWidth="xs"
                dialogClasses={classes}
            />
        </div>
    );
}
