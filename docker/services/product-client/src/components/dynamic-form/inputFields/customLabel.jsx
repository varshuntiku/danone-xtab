import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LabelSuggestionInfo from './LabelSuggestionInfo';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            width: '100%'
        }
    },
    asterisk: {
        color: theme.palette.icons.errorIconFill
    },
    infoIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: '2rem !important',
        width: '2rem !important',
        '& svg': {
            fill: `${theme.palette.primary.contrastText} !important`
        }
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        display: 'inline',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        marginLeft: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
        }
    },
    iconButton: {
        margin: 0
    },
    popOverTitleWrapper: {
        display: 'flex',
        width: 'calc(100% - ' + theme.spacing(3.2) + ')',
        left: theme.spacing(1.6),
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        height: '5rem',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    popOverTitleText: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: '1.67rem',
        color: theme.palette.text.titleText
    },
    popOverTitleSet: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    closeIcon: {
        fontSize: '0.5rem !important',
        position: 'absolute',
        right: 0,
        marginRight: `-${theme.spacing(1)}`,
        '& svg': {
            width: '90%',
            fill: `${theme.palette.icons.closeIcon}!important`,
            padding: '1px'
        }
    },
    bulbIcon: {
        stroke: theme.palette.text.contrastText
    },

    popOverContainer: {
        marginTop: '0.5rem'
    },
    popOverPaper: {
        width: '35rem',
        minHeight: '16rem',
        marginLeft: '1rem'
    },
    contentText: {
        margin: theme.spacing(1.6),
        color: theme.palette.text.default,
        maxHeight: theme.spacing(29),
        lineHeight: theme.layoutSpacing(19),
        fontSize: '1.6rem',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        fontWeight: '400'
    },
    filed: (params) => ({
        borderBottom: params.underline
            ? `1px solid ${alpha(theme.palette.text.default, 0.4)}`
            : null,
        padding: `${theme.layoutSpacing(20)} ${theme.layoutSpacing(0)}`,
        paddingRight: `0!important`,
        color: theme.palette.text.revamp,
        fontFamily: theme.body.B1.fontFamily,
        lineHeight: 'normal',
        '&.MuiTypography-h5': {
            fontSize: theme.layoutSpacing(14),
            letterSpacing: '0.5px',
            fontWeight: '500'
        },
        '&.MuiTypography-h4': {
            fontSize: theme.layoutSpacing(15),
            letterSpacing: '0.5px',
            fontWeight: '500'
        },
        '&.MuiTypography-h3': {
            fontSize: theme.layoutSpacing(18),
            letterSpacing: '0.5px',
            fontWeight: '500'
        }
    })
}));

export default function CustomLabel({ fieldInfo }) {
    const classes = useStyles(fieldInfo);

    return (
        <Typography
            {...fieldInfo.InputLabelProps}
            style={fieldInfo.style}
            className={classes.filed}
        >
            {fieldInfo.value}
            {fieldInfo?.asterisk && <span className={classes.asterisk}>*</span>}
            {fieldInfo?.infoPopover && (
                <LabelSuggestionInfo
                    classes={classes}
                    fieldInfo={fieldInfo}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left'
                    }}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right'
                    }}
                />
            )}
        </Typography>
    );
}
