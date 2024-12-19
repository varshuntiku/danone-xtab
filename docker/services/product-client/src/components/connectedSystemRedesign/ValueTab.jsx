import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IntiativeValue from './ValueTab/IntiativeValue';
import ValueTabDrivers from './ValueTab/ValueTabDrivers';
import ValueSolutions from './ValueTab/ValueSolutions';
import HorizontalScroll from 'components/connectedSystemRedesign/HorizontalScrollNew';
import BorderContainer from './ValueTab/BorderContainer';
// import ConnSystemsContext from './ConnectedSystemsContext';
import Close from '@material-ui/icons/Close';
import Person from '@material-ui/icons/Person';
import Send from '@material-ui/icons/Send';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getGoalDetails } from 'services/connectedSystem_v2';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        paddingTop: theme.layoutSpacing(8),
        paddingBottom: theme.layoutSpacing(8),
        paddingLeft: theme.layoutSpacing(32),
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(2)
    },
    headingInsight: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        paddingTop: theme.layoutSpacing(8),
        paddingBottom: theme.layoutSpacing(8),
        paddingLeft: theme.layoutSpacing(32),
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(2)
    },
    headingSection: {
        borderTop: `1px solid ${theme.palette.separator.grey}`,
        marginRight: '1%',
        marginLeft: '0.5%'
    },
    initiatives: {
        display: 'flex',
        gap: theme.layoutSpacing(32),
        overflow: 'hidden',
        height: '84%',
        '@media (max-width: 1600px)': {
            height: '84%'
        },
        paddingBottom: '1rem'
    },
    initiativesSection: {
        borderTop: `1px solid ${theme.palette.separator.grey}`,
        borderBottom: `1px solid ${theme.palette.separator.grey}`,
        minHeight: theme.layoutSpacing(136)
    },
    separtor: {
        backgroundColor: theme.palette.separator.grey,
        width: '1px',
        marginBottom: '1rem',
        height: 'auto'
    },
    initiativesSection2: {
        marginTop: theme.layoutSpacing(10),
        marginBottom: theme.layoutSpacing(10),
        width: 'calc(100% + 1.5%)',
        paddingLeft: theme.layoutSpacing(25),
        height: '100%'
    },
    insightsSection: {
        display: 'flex',
        flexGrow: '1'
    },
    heading2: {
        fontSize: '2rem',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.layoutSpacing(1),
        lineHeight: theme.layoutSpacing(35),
        color: theme.palette.text.default
    },
    initiativesection: {
        display: 'flex',
        gap: theme.layoutSpacing(30),
        height: '100%'
    },
    insights: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
    },
    insightsSection2: {
        display: 'flex',
        marginTop: '1rem',
        overflow: 'hidden',
        flexGrow: '1'
    },
    initiativeData: {
        paddingLeft: theme.layoutSpacing(32),
        paddingRight: theme.layoutSpacing(24)
    },
    insightData: {
        paddingLeft: theme.layoutSpacing(24),
        paddingRight: theme.layoutSpacing(24)
    },
    insightDisplaySection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'space-between'
    },
    intiativeContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
    },
    valueTabTop: {
        display: 'flex',
        position: 'relative'
    },
    insightContainer: {
        display: 'flex',
        height: '100%'
    },
    leftContainer: {
        display: 'flex',
        flexGrow: '1'
    },
    bottomContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    chatPopUp: {
        width: '32rem',
        height: '35rem',
        background: theme.palette.background.white,
        right: '35%',
        position: 'absolute',
        top: '105%',
        zIndex: 100,
        borderRadius: '8px',
        border: '2px solid rgba(95, 0, 89, 0.25)'
    },
    chatPopUpHeading: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight
    },
    closeIcon: {
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        width: '2.4rem',
        height: '2.4rem',
        marginRight: '1rem',
        cursor: 'pointer'
    },
    chatHeadingContainer: {
        display: 'flex',
        width: 'auto',
        margin: '0.5rem 2rem',
        borderBottom: '1px solid rgba(34, 0, 71, 0.15)',
        alignItems: 'center'
    },
    chatAvatar: {
        width: '2rem',
        height: '2rem',
        color: 'transparent',
        padding: 0,
        stroke: theme.palette.text.peachText
    },
    chatAvatarContainer: {
        background: theme.palette.text.default,
        borderRadius: '50%',
        padding: '0.8rem'
    },
    chatTextContainer: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginTop: '1rem',
        marginRight: '.8rem'
    },
    chatContentContainer: {
        marginLeft: '2rem',
        overflowY: 'scroll',
        height: '22rem',
        marginTop: '1rem',
        '&::-webkit-scrollbar': {
            width: `${8 / 10.368}rem`,
            height: '0.8rem'
        },
        '&::-webkit-scrollbar-track': {
            borderRadius: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            border: '1px solid ' + theme.palette.text.default,
            borderRadius: '2rem'
        }
    },
    chatHeadingGreen: {
        color: theme.palette.background.successDark,
        fontSize: theme.title.h5.fontSize,
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h6.fontWeight
    },
    chatHeadingOrange: {
        color: '#FF8674',
        fontSize: theme.title.h5.fontSize,
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h6.fontWeight
    },
    chatHeadingBlue: {
        color: theme.palette.background.infoBgDark,
        fontSize: theme.title.h5.fontSize,
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h6.fontWeight
    },
    chatQuestion: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h1.fontWeight
    },
    separator: {
        background: theme.palette.separator.grey,
        width: '1px',
        marginBottom: '1rem',
        height: 'auto',
        marginRight: '1rem',
        marginLeft: '1rem'
    },
    chatQueryContainer: {
        marginLeft: '2rem',
        borderRadius: '6px',
        marginTop: '1rem',
        border: `1px solid ${theme.palette.separator.grey}`,
        height: '4.2rem',
        marginRight: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        alignItems: 'center'
    },
    queryText: {
        color: theme.palette.text.default,
        fontSize: theme.title.h7.fontSize,
        fontFamily: theme.body.B1.fontFamily,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginRight: '2rem'
    },
    sendIcon: {
        width: '2rem',
        height: '2rem'
    }
}));

import * as _ from 'underscore';

function ValueTab(props) {
    const { connSystemDashboardId, dashboardCode, selectedInitiative } = props;
    const classes = useStyles();
    // const connSystemData = useContext(ConnSystemsContext);
    const [initiative, setInitiative] = useState({});
    const [loadingGoals, setLoadingGoals] = useState(true);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [openChat, setOpenChat] = useState(false);
    const [actions, setActions] = useState({
        action: { app_id: null },
        ask: false,
        solutions: false
    });
    const [selectedNode, setSelectedNode] = useState(null);
    const [solutions, setSolutions] = useState([]);

    useEffect(() => {
        fetchGoals();
    }, []);
    useEffect(() => {
        selectedNode?.solutions
            ? setSolutions(selectedNode?.solutions)
            : setSolutions(selectedProcess?.process_config?.solutions);
    }, [selectedNode]);
    useEffect(() => {
        setSelectedNode(null);
        selectedNode?.solutions
            ? setSolutions(selectedNode?.solutions)
            : setSolutions(selectedProcess?.process_config?.solutions);
    }, [selectedProcess]);

    const fetchGoals = async () => {
        getGoalDetails({
            connSystemDashboardId: connSystemDashboardId,
            callback: onResponseGoals
        });
    };

    const onResponseGoals = (response) => {
        if (response.length > 0 && response[0].initiatives.length > 0) {
            if (selectedInitiative) {
                const selected_initiative_obj = _.find(
                    response[0].initiatives,
                    function (initiative_item) {
                        return initiative_item.id == selectedInitiative;
                    }
                );

                if (selected_initiative_obj) {
                    setInitiative(selected_initiative_obj);
                    setLoadingGoals(false);
                    return;
                }
            }
            setInitiative(response[0].initiatives[0]);
        }
        setLoadingGoals(false);
    };

    // const VerticalLinearProgress = (props) => {
    //     return <LinearProgress {...props} className={classes.root} variant="determinate" />;
    // };

    return loadingGoals ? (
        <>
            <Skeleton
                variant="rect"
                animation="wave"
                component="div"
                width="100%"
                height="100%"
                className={classes.skeletonWave}
            />
            <CodxCircularLoader center size={60} />
        </>
    ) : (
        <>
            <div className={classes.valueTabTop}>
                <div className={classes.intiativeContainer}>
                    <BorderContainer left right top>
                        <Typography className={classes.heading}>Initiatives</Typography>
                    </BorderContainer>
                    <BorderContainer left right top bottom classesProp={classes.leftContainer}>
                        <div className={classes.initiativesSection2}>
                            <Typography className={classes.heading2}>{initiative.name}</Typography>
                            <div className={classes.initiatives}>
                                {initiative.objectives?.data.map((el, index) => (
                                    <div
                                        className={classes.initiativesection}
                                        key={`initiative${index}`}
                                    >
                                        <IntiativeValue el={el} data={'initiatives'} />
                                        {index + 1 !== initiative.objectives?.data.length && (
                                            <div className={classes.separtor}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BorderContainer>
                </div>
                <div className={classes.insights}>
                    <BorderContainer right top>
                        <Typography className={classes.headingInsight}>Insights</Typography>
                    </BorderContainer>

                    <BorderContainer
                        left={false}
                        right
                        top
                        bottom
                        classesProp={classes.insightsSection}
                    >
                        <div className={classes.insightsSection2}>
                            <HorizontalScroll initiatives={true}>
                                {initiative.objectives?.insights?.map((el, index) => (
                                    <div
                                        className={classes.insightDisplaySection}
                                        key={`insights${index}`}
                                    >
                                        <div className={classes.insightContainer}>
                                            <div className={classes.insightData}>
                                                <IntiativeValue
                                                    el={el}
                                                    data={'insights'}
                                                    openChat={openChat}
                                                    setOpenChat={setOpenChat}
                                                    index={index}
                                                />
                                            </div>

                                            {index + 1 !==
                                                initiative.objectives?.insights.length && (
                                                <div className={classes.separtor}></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </HorizontalScroll>
                        </div>
                    </BorderContainer>
                </div>
                {openChat ? (
                    <div className={classes.chatPopUp}>
                        <div className={classes.chatHeadingContainer}>
                            <Typography className={classes.chatPopUpHeading}>Notes</Typography>
                            <div onClick={() => setOpenChat(false)}>
                                <Close className={classes.closeIcon} />
                            </div>
                        </div>
                        <div className={classes.chatContentContainer}>
                            <div className={classes.chatTextContainer}>
                                <span className={classes.chatAvatarContainer}>
                                    <Person className={classes.chatAvatar} />
                                </span>
                                <div>
                                    <Typography className={classes.chatHeadingGreen}>
                                        Senior Manager Pricing
                                    </Typography>
                                    <Typography className={classes.chatQuestion}>
                                        What is the outcome of the decision{' '}
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.chatTextContainer}>
                                <span className={classes.chatAvatarContainer}>
                                    <Person className={classes.chatAvatar} />
                                </span>
                                <div>
                                    <Typography className={classes.chatHeadingOrange}>
                                        Senior Director Pricing
                                    </Typography>
                                    <Typography className={classes.chatQuestion}>
                                        What is the outcome of the decision{' '}
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.chatTextContainer}>
                                <span className={classes.chatAvatarContainer}>
                                    <Person className={classes.chatAvatar} />
                                </span>
                                <div>
                                    <Typography className={classes.chatHeadingBlue}>
                                        Director Pricing
                                    </Typography>
                                    <Typography className={classes.chatQuestion}>
                                        What is the outcome of the decision{' '}
                                    </Typography>
                                </div>
                            </div>
                            <div className={classes.chatTextContainer}>
                                <span className={classes.chatAvatarContainer}>
                                    <Person className={classes.chatAvatar} />
                                </span>
                                <div>
                                    <Typography className={classes.chatHeadingBlue}>
                                        Manager Pricing
                                    </Typography>
                                    <Typography className={classes.chatQuestion}>
                                        What is the outcome of the decision{' '}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className={classes.chatQueryContainer}>
                            <Typography className={classes.queryText}>
                                How can I alert the owner of the decision...
                            </Typography>
                            <Send className={classes.sendIcon} />
                        </div>
                    </div>
                ) : null}
            </div>
            <div className={classes.bottomContainer}>
                <ValueTabDrivers
                    connSystemDashboardId={connSystemDashboardId}
                    actions={actions}
                    setActions={setActions}
                    selectedProcess={selectedProcess}
                    setSelectedProcess={setSelectedProcess}
                    setSelectedNode={setSelectedNode}
                />
                {selectedProcess && (
                    <ValueSolutions
                        dashboardCode={dashboardCode}
                        actions={actions}
                        setActions={setActions}
                        insightsData={solutions}
                        selectedTab="value"
                    />
                )}
            </div>
        </>
    );
}

export default ValueTab;
