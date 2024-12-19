import React, { useState } from 'react';
import { Typography, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown, KeyboardArrowUp, Info } from '@material-ui/icons';
import { Avatar } from '@material-ui/core';
import { Handle, Position } from 'reactflow';

const useStyles = makeStyles((theme) => ({
    closeIcon: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        float: 'right',
        cursor: 'pointer',
        position: 'absolute',
        right: '1%',
        top: '1%'
    },
    foldIcon: {
        fontSize: '3rem'
    },
    infoIcon: {
        fontSize: '2rem',
        fill: theme.ConnectedSystemDashboard.blockerTextColor
    },
    infoHolder: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        float: 'right',
        cursor: 'pointer',
        marginLeft: 'auto'
    },
    order: {
        float: 'left',
        fontSize: theme.kpi.k5.fontSize,
        color: `var(--color,${theme.palette.text.default})`,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight
    },
    contentHolder: {
        display: 'flex',
        gap: '1rem',
        paddingBottom: '1rem',
        position: 'relative'
    },
    textHolder: {
        marginTop: '1.5rem'
    },
    header: {
        fontSize: theme.title.h2.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight
    },
    description: {
        fontSize: '2rem',
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight,
        paddingRight: '1.5rem',
        maxHeight: theme.layoutSpacing(100),
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        wordBreak: 'break-word'
    },
    stakeHolderDetails: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        borderTop: `1px solid  var(--color,#7DD2B9)`,
        paddingTop: '1rem'
    },
    avatarIcon: {
        width: '2.6rem',
        height: '2.6rem',
        background: 'transparent',
        color: `var(--color,${theme.ConnectedSystemDashboard.avatarNormal})`,
        border: `1px solid var(--color,${theme.ConnectedSystemDashboard.avatarNormal})`
    },
    stakeHolderText: {
        fontSize: theme.title.h4.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight
    },
    moreOptions: {
        display: 'flex',
        gap: '0.5rem'
    },
    referSolutions: {
        borderTop: `0.7px solid var(--color,${theme.ConnectedSystemDashboard.interactionBlue})`,
        width: '50%',
        height: '5rem',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.title.h4.fontSize,
        color: theme.ConnectedSystemDashboard.interactionText,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight,
        cursor: 'pointer',
        paddingLeft: '1rem',
        textAlign: 'center'
    },
    coPilot: {
        borderTop: `0.7px solid var(--color,${theme.ConnectedSystemDashboard.interactionBlue})`,
        borderBottom: `0.7px solid var(--color,${theme.ConnectedSystemDashboard.interactionBlue})`,
        width: '50%',
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        fontSize: theme.title.h4.fontSize,
        color: theme.ConnectedSystemDashboard.interactionText,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight,
        cursor: 'pointer',
        textAlign: 'center'
    },
    detailsSeparator: {
        marginTop: '2px',
        marginBottom: '2px',
        width: '0.7px',
        background: `var(--color,${theme.ConnectedSystemDashboard.interactionBlue})`,
        height: 'auto'
    },
    tabHeaders: {
        width: '50%',
        height: '4rem',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        background: `var(--color,${theme.ConnectedSystemDashboard.interactionBlue})`,
        marginTop: '0.25rem',
        justifyContent: 'center',
        fontSize: theme.title.h4.fontSize,
        color: `var(--textColor,${theme.palette.text.default})`,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight
    },
    customNodeContainer: {
        padding: '1rem',
        paddingRight: '0.75rem',
        borderRadius: '2px',
        background: `var(--background,transparent)`,
        height: 'auto',
        // width: theme.layoutSpacing(330),
        width: '270px',
        '@media (min-width: 1920px)': {
            width: '370px'
        },
        minHeight: theme.layoutSpacing(220),
        border: `var(--border,'1px solid ${theme.palette.text.default}')`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& .react-flow__handle': {
            backgroundColor: 'transparent',
            border: 'none'
        },
        '@media (min-height: 1100px)': {
            minHeight: theme.layoutSpacing(230)
        }
    },
    stepText: {
        color: theme.ConnectedSystemDashboard.text,
        fontFamily: theme.title.h1.fontFamily,
        fontSize: theme.title.h4.fontSize,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight,
        marginTop: '-2rem',
        display: 'flex',
        justifyContent: 'center'
    }
}));

const CustomNode = ({ data }) => {
    const theme = useTheme();
    const classes = useStyles();
    const [nodeExpand, setNodeExpand] = useState(false);
    const TopInteractionTab = ({ val, onClick, className }) => {
        return (
            <React.Fragment>
                <span
                    className={classes.detailsSeparator}
                    style={{
                        '--color':
                            data?.step == 'complete'
                                ? `${theme.ConnectedSystemDashboard.interactionGreen}`
                                : data?.step == 'active'
                                ? `${theme.ConnectedSystemDashboard.interactionBlue}`
                                : `${theme.ConnectedSystemDashboard.avatarNormal}`
                    }}
                ></span>
                <Typography
                    className={className}
                    onClick={onClick}
                    style={{
                        '--color':
                            data?.step == 'complete'
                                ? `${theme.ConnectedSystemDashboard.interactionGreen}`
                                : data?.step == 'active'
                                ? `${theme.ConnectedSystemDashboard.interactionBlue}`
                                : `${theme.ConnectedSystemDashboard.avatarNormal}`
                    }}
                >
                    {val}
                </Typography>
            </React.Fragment>
        );
    };
    const TabButton = ({ val }) => {
        return (
            <Typography
                className={classes.tabHeaders}
                style={{
                    '--color':
                        data?.step == 'complete'
                            ? `${theme.ConnectedSystemDashboard.interactionTabBackgroundGreen}`
                            : data?.step == 'active'
                            ? `${theme.ConnectedSystemDashboard.interactionTabBackgroundBlue}`
                            : `${theme.palette.text.default}30`,
                    '--textColor':
                        data?.step == 'active'
                            ? `${theme.palette.background.pureWhite}`
                            : `${theme.palette.text.default}`
                }}
            >
                {val}
            </Typography>
        );
    };
    const expandNode = () => {
        nodeExpand ? data.setSelectedNode(null) : data.setSelectedNode(data);
        setNodeExpand(!nodeExpand);
    };
    return (
        <React.Fragment>
            {data?.step != 'complete' && data?.step != 'tbd' && (
                <Typography className={classes.stepText}>
                    {data?.step == 'next' ? 'Your Action' : 'Current Step'}
                </Typography>
            )}
            <div
                className={classes.customNodeContainer}
                style={{
                    '--background':
                        data?.step == 'complete'
                            ? `${theme.ConnectedSystemDashboard.interactionGreen}20`
                            : data?.step == 'active'
                            ? `${theme.palette.background.infoBgDark}30`
                            : null,
                    '--border':
                        data?.step == 'next' || data?.step == 'tbd'
                            ? `1px solid ${theme.palette.text.default}40`
                            : 'none'
                }}
                onClick={expandNode}
            >
                <Handle type="source" position={Position.Right}></Handle>
                <Handle type="target" position={Position.Left}></Handle>
                <div className={classes.contentHolder}>
                    <Typography
                        className={classes.order}
                        style={{
                            '--color':
                                data?.step == 'complete'
                                    ? `${theme.ConnectedSystemDashboard.interactionGreen}`
                                    : data?.step == 'active'
                                    ? `${theme.ConnectedSystemDashboard.interactionBlue}`
                                    : `${theme.palette.text.default}50`
                        }}
                    >
                        {data.order}.
                    </Typography>
                    <div className={classes.textHolder}>
                        {data?.showHeader && (
                            <Typography className={classes.header}>{data.heading}</Typography>
                        )}
                        <Typography className={classes.description}>{data.description}</Typography>
                    </div>
                </div>
                <div className={classes.infoHolder}>
                    {data?.step == 'active' && <Info className={classes.infoIcon} />}
                </div>
                {nodeExpand && (
                    <React.Fragment>
                        <div className={classes.moreOptions}>
                            <TopInteractionTab
                                val="Refer Solutions"
                                onClick={() => {
                                    data.setActions((prevstate) => ({
                                        ...prevstate,
                                        solutions: true
                                    }));
                                }}
                                className={classes.referSolutions}
                            />
                            <TopInteractionTab
                                val="View/ Take Actions"
                                onClick={() => {
                                    var action_data = { app_id: 1 };
                                    if (data.solutions[0]?.link) {
                                        action_data = { app_link: data.solutions[0]?.link };
                                    }

                                    data.setActions((prevstate) => ({
                                        ...prevstate,
                                        action: action_data
                                    }));
                                }}
                                className={classes.referSolutions}
                            />
                            <span
                                className={classes.detailsSeparator}
                                style={{
                                    '--color':
                                        data?.step == 'complete'
                                            ? `${theme.ConnectedSystemDashboard.avatarGreen}`
                                            : data?.step == 'active'
                                            ? `${theme.ConnectedSystemDashboard.avatarBlue}`
                                            : `${theme.ConnectedSystemDashboard.avatarNormal}`
                                }}
                            ></span>
                        </div>
                        <div className={classes.moreOptions}>
                            <TopInteractionTab
                                val="Decide with Co-pilot"
                                onClick={() => {
                                    data.setActions((prevstate) => ({
                                        ...prevstate,
                                        action: { ask: true, copilot: data.copilot }
                                    }));
                                }}
                                className={classes.coPilot}
                            />
                            <TopInteractionTab
                                val="Chat with Owner"
                                onClick={() => {}}
                                className={classes.coPilot}
                            />
                            <span
                                className={classes.detailsSeparator}
                                style={{
                                    '--color':
                                        data?.step == 'complete'
                                            ? `${theme.ConnectedSystemDashboard.avatarGreen}`
                                            : data?.step == 'active'
                                            ? `${theme.ConnectedSystemDashboard.avatarBlue}`
                                            : `${theme.ConnectedSystemDashboard.avatarNormal}`
                                }}
                            ></span>
                        </div>
                        <div className={classes.moreOptions}>
                            <TabButton val="Intelligence" />
                            <TabButton val="Foundation" />
                        </div>
                    </React.Fragment>
                )}
                {data?.showStakeHolder && (
                    <div
                        className={classes.stakeHolderDetails}
                        style={{
                            '--color': nodeExpand
                                ? 'transparent'
                                : data?.step == 'complete'
                                ? `${theme.ConnectedSystemDashboard.interactionGreen}`
                                : data?.step == 'active'
                                ? `${theme.ConnectedSystemDashboard.interactionBlue}`
                                : `${theme.palette.text.default}30`
                        }}
                    >
                        <Avatar
                            className={classes.avatarIcon}
                            style={{
                                '--color':
                                    data?.step == 'complete'
                                        ? `${theme.ConnectedSystemDashboard.avatarGreen}`
                                        : data?.step == 'active'
                                        ? `${theme.ConnectedSystemDashboard.avatarBlue}`
                                        : `${theme.ConnectedSystemDashboard.avatarNormal}`
                            }}
                        />
                        <Typography className={classes.stakeHolderText}>
                            {data?.stakeHolder}
                        </Typography>
                    </div>
                )}

                <div onClick={expandNode} className={classes.closeIcon}>
                    {nodeExpand ? (
                        <KeyboardArrowUp className={classes.foldIcon} />
                    ) : (
                        <KeyboardArrowDown className={classes.foldIcon} />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default CustomNode;
