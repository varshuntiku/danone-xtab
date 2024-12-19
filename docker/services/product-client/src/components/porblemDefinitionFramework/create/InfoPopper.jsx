import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { ButtonBase, Popover, Typography } from '@material-ui/core';
import CloseIcon from 'assets/img/Ic_Close.svg';
import clsx from 'clsx';
import MarkdownRenderer from '../../MarkdownRenderer';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline'
    },
    popperContent: {
        padding: '1.4rem 1.4rem 1.4rem 1.4rem',
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'linear-gradient(111.81deg, rgba(56, 98, 141, 0.8) 2.32%, rgba(56, 98, 141, 0.15) 100.61%)'
                : 'linear-gradient(111.81deg, #EAEDF3 2.32%, rgba(234, 237, 243, 0.4) 100.61%)',
        minwidth: '312px',
        textAlign: 'justify',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(25px)',
        minHeight: '146px',
        maxWidth: '450px'
    },
    colorContrast: {
        color: 'orange', //theme.palette.primary.contrastText
        '& svg': {
            fill: 'orange !important', //theme.palette.primary.contrastText,
            stroke: 'orange !important' //theme.palette.primary.contrastText,
        }
    },
    colorDefault: {
        color: theme.palette.text.default
    },
    letterSpacing1: {
        letterSpacing: '0.02em'
    },
    fontSize1: {
        fontSize: '1.6rem'
    },
    fontSize2: {
        fontSize: '1.2rem'
    },
    triggerIcon: {
        fontSize: '1.8rem'
    },
    infoIcon: {
        fill: 'orange !important', //theme.palette.primary.contrastText,
        stroke: 'orange !important', //theme.palette.primary.contrastText,
        width: '2.2rem',
        height: '2.2rem',
        '& svg': {
            fill: 'orange !important', //theme.palette.primary.contrastText,
            stroke: 'orange !important' //theme.palette.primary.contrastText,
        }
    },
    title: {
        margin: '1rem'
    },
    desc: {
        margin: '1.5rem',
        padding: '1rem'
    },
    closeIcon: {
        maskSize: '100%',
        webkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        minWidth: '2.4rem',
        minHeight: '2.4rem',
        maskImage: `url(${CloseIcon})`,
        background: theme.palette.text.secondaryText
    }
}));

export default function InfoPopper({
    title,
    desc,
    content,
    popOverInfo,
    classes: classes1,
    size,
    Img,
    anchorOrigin,
    transformOrigin,
    ...props
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
        <div className={clsx(classes.root, classes1?.root)} {...props}>
            <ButtonBase
                aria-describedby={id}
                onClick={handleClick}
                className={classes1?.triggerButton}
                aria-label="info"
            >
                {!Img ? (
                    <InfoOutlinedIcon
                        fontSize={size}
                        className={clsx(
                            classes.colorContrast,
                            size ? '' : classes.triggerIcon,
                            classes1?.triggerIcon
                        )}
                    />
                ) : (
                    <Img className={classes.infoIcon} />
                )}
            </ButtonBase>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={
                    anchorOrigin || {
                        vertical: 'center',
                        horizontal: 'center'
                    }
                }
                transformOrigin={
                    transformOrigin || {
                        vertical: 'top',
                        horizontal: 'left'
                    }
                }
                onClose={() => setAnchorEl(null)}
            >
                <div
                    className={clsx(classes.popperContent, classes1?.popperContent)}
                    style={{ minHeight: props.minHeight }}
                >
                    <ButtonBase
                        style={{
                            position: 'absolute',
                            top: '0rem',
                            right: '0rem',
                            margin: '1.2rem'
                        }}
                        onClick={() => setAnchorEl(null)}
                        aria-label="Close"
                    >
                        <div className={classes.closeIcon}></div>
                    </ButtonBase>
                    {content ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <React.Fragment>
                            <Typography
                                gutterBottom
                                variant="h5"
                                className={clsx(
                                    classes.title,
                                    classes.colorContrast,
                                    classes1?.title
                                )}
                            >
                                {title}
                            </Typography>
                            {popOverInfo ? (
                                <div style={{ padding: '1rem' }}>
                                    <MarkdownRenderer markdownContent={popOverInfo} />
                                </div>
                            ) : Array.isArray(desc) ? (
                                <ListItem items={desc} />
                            ) : (
                                <Typography
                                    variant="h5"
                                    className={clsx(
                                        classes.desc,
                                        classes.colorDefault,
                                        classes1?.desc
                                    )}
                                >
                                    {desc}
                                </Typography>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </Popover>
        </div>
    );
}

function ListItem({ items }) {
    const classes = useStyles();
    return (
        <ul style={{ padding: '1rem', margin: '1.3rem' }}>
            {items.map((el, i) =>
                Array.isArray(el) ? (
                    <ListItem key={'listItem' + i} items={el} />
                ) : (
                    <li key={'listItem' + i}>
                        <Typography variant="h5" className={classes.colorDefault}>
                            {el}
                        </Typography>
                    </li>
                )
            )}
        </ul>
    );
}
