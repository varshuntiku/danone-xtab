import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import LabelSuggestionInfo from '../dynamic-form/inputFields/LabelSuggestionInfo';
import SpecialRadio from './SpecialRaidio';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        width: 'full',
        background: theme.palette.background.tableSelcted,
        height: theme.layoutSpacing(56),
        marginBottom: theme.layoutSpacing(20),
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    customSelector: {
        marginLeft: '1.5rem'
    },
    label: {
        color: theme.palette.text.default,
        fontSize: '1.44rem',
        fontFamily: theme.body.B1.fontFamily,
        letterSpacing: 0,
        lineHeight: 'normal',
        marginLeft: '1.5rem',
        fontWeight: '500'
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
        position: 'absolute',
        right: 0,
        padding: theme.layoutSpacing(10),
        marginRight: `-${theme.spacing(1)}`,
        '& svg': {
            width: '2rem',
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
        marginLeft: '1rem',
        marginTop: '-4rem'
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
    radioWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '1.5rem',
        gap: '16rem',
        justifyContent: 'start'
    },
    radioContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '-1rem',
        position: 'relative'
    },
    radioLabel: {
        color: theme.palette.text.default,
        display: 'inline',
        lineHeight: theme.layoutSpacing(19),
        fontSize: '1.44rem',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        fontWeight: '400',
        marginLeft: '-3rem',
        marginTop: '-0.5rem'
    }
}));
const PlacementRadio = ({ onChange, params }) => {
    const [left, setLeft] = useState(params?.left);
    const [right, setTop] = useState(params?.top);
    const fieldInfo = {
        infoPopover: {
            title: 'Recommendation',
            info: 'As per design best practices, use top navigation when there are not more than 6 menu items. This enhances user experience and minimizes screen clutter.',
            icon: 'true'
        }
    };

    useEffect(() => {
        setLeft(params?.left);
        setTop(params?.top);
    }, [params]);

    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Typography className={classes.label}>
                Choose Navigation Placement
                <LabelSuggestionInfo
                    fieldInfo={fieldInfo}
                    classes={classes}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                />{' '}
            </Typography>
            <div className={classes.radioWrapper}>
                <span className={classes.radioContainer}>
                    <SpecialRadio
                        onChange={onChange}
                        params={{
                            value: left,
                            name: 'left_placement',
                            disabled: false,
                            inline: true,
                            from: 'left'
                        }}
                    ></SpecialRadio>
                    <Typography className={classes.radioLabel}>Left placement</Typography>
                </span>

                <span className={classes.radioContainer}>
                    <SpecialRadio
                        onChange={onChange}
                        params={{
                            value: right,
                            name: 'left_placement',
                            disabled: false,
                            inline: true,
                            from: 'top'
                        }}
                    ></SpecialRadio>
                    <Typography className={classes.radioLabel}>Top placement</Typography>
                </span>
            </div>
        </div>
    );
};

export default PlacementRadio;
