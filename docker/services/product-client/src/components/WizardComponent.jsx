import { ButtonBase, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    wizardContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        border: `2px solid ${theme.palette.primary.dark}`,
        borderRight: 0,
        borderLeft: 0,
        overflow: 'hidden'
    },
    wizardItem: {
        border: `0.4rem solid ${theme.palette.primary.dark}`,
        padding: '0rem 2rem 0rem 4.2rem',
        position: 'relative',
        background:
            theme.props.mode === 'light'
                ? theme.palette.primary.light
                : theme.palette.background.overviewTabBg,
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            '& $screenTabHeader': {
                opacity: 0.5
            }
        },
        '&::after': {
            top: '50%',
            right: '-0.4rem',
            content: '""',
            position: 'absolute',
            transform: 'translate(100%, -50%)',
            borderWidth: '2.5rem',
            borderColor: `transparent transparent transparent ${theme.palette.primary.dark}`,
            borderStyle: 'solid',
            zIndex: 1,
            pointerEvents: 'none'
        },
        '&::before': {
            top: '50%',
            right: 0,
            content: '""',
            zIndex: 2,
            position: 'absolute',
            transform: 'translate(100%, -50%)',
            borderWidth: '2.1rem',
            borderColor: `transparent transparent transparent ${
                theme.props.mode === 'light'
                    ? theme.palette.primary.light
                    : theme.palette.background.overviewTabBg
            }`,
            borderStyle: 'solid',
            pointerEvents: 'none'
        },
        '&:disabled': {
            opacity: 0.5
        }
    },
    selectedWizardItem: {
        '&$wizardItem': {
            background:
                theme.props.mode === 'light'
                    ? theme.palette.background.wizardBackground
                    : theme.palette.background.overviewSelected,

            '&::before': {
                borderLeft: `2.4rem solid ${
                    theme.props.mode === 'light'
                        ? theme.palette.background.wizardBackground
                        : theme.palette.background.overviewSelected
                }`
            },
            '& $screenTabHeader': {
                color: theme.palette.primary.contrastText,
                fontWeight: '500',
                opacity: 1
            }
        }
    },
    screenTabHeader: {
        float: 'left',
        cursor: 'pointer',
        fontSize: '1.75rem',
        color:
            theme.props.mode === 'light'
                ? theme.palette.text.default
                : theme.palette.text.overviewTabText,
        opacity: '0.7',
        fontFamily: theme.title.h1.fontFamily
    }
}));

export default function WizardComponent({ wizardItems = [], selected, onSelect }) {
    const classes = useStyles();
    return (
        <div className={classes.wizardContainer}>
            {wizardItems.map((el) => (
                <ButtonBase
                    key={el.name}
                    centerRipple
                    className={clsx(
                        classes.wizardItem,
                        selected === el.value ? classes.selectedWizardItem : null
                    )}
                    onClick={(e) => onSelect(e, el.value)}
                    title={el.title || el.value}
                    disabled={el.disabled}
                    aria-label={el.label || el.value}
                >
                    <Typography className={classes.screenTabHeader}>
                        {el.label || el.value}
                    </Typography>
                </ButtonBase>
            ))}
        </div>
    );
}
