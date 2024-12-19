import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import BorderContainer from '../ValueTab/BorderContainer';
import StrategyRedesignStyle from './StrategyRedesignStyle';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import Projections from './Projections';
// import ConnSystemsContext from '../ConnectedSystemsContext';
import { ReactComponent as Progress } from 'assets/img/connProgressIcon.svg';

import {
    getDashboardTabData,
    getGoalDetails
    // getGoalData
} from 'services/connectedSystem_v2';

const useStyles = makeStyles(StrategyRedesignStyle);

import * as _ from 'underscore';

function StrategyRedesign(props) {
    const {
        setSelectedTab,
        connSystemDashboardId,
        connSystemDashboardTabId,
        setSelectedInitiative
    } = props;
    const classes = useStyles();
    // const connSystemData = useContext(ConnSystemsContext);
    const [loadingStrategy, setLoadingStrategy] = useState(true);
    const [loadingGoals, setLoadingGoals] = useState(true);
    // const [goals, setGoals] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(false);
    const [insights, setInsights] = useState(false);
    const [kpis, setKpis] = useState(false);
    const [openProcess, setOpenProcess] = useState(false);
    const [openIntiative, setOpenintiative] = useState(false);
    const [hover, setHover] = useState(null);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(null);
    const [selectedMomentumTab, setSelectedMomentumTab] = useState(null);

    useEffect(() => {
        fetchStrategy();
        fetchGoals();
    }, []);

    const fetchStrategy = async () => {
        getDashboardTabData({
            connSystemDashboardTabId: connSystemDashboardTabId,
            callback: onResponseStrategy
        });
    };

    const onResponseStrategy = (response) => {
        setInsights(response.insights);
        setKpis(response.kpis);
        setLoadingStrategy(false);
    };

    const fetchGoals = async () => {
        getGoalDetails({
            connSystemDashboardId: connSystemDashboardId,
            callback: onResponseGoals
        });
    };

    const onClickInitiative = (initiative_id) => {
        setSelectedInitiative(initiative_id);
        setSelectedTab(1);
    };

    // const fetchGoalData = async (goal_id) => {
    //     getGoalData({
    //         connSystemGoalId: goal_id,
    //         callback: onResponseGoalData
    //     });
    // };

    const onResponseGoals = (response) => {
        // setGoals(response);
        if (response && response.length > 0) {
            setSelectedGoal(response[0]);
            if (
                response[0].objectives?.timeperiod &&
                response[0].objectives?.timeperiod.length > 0
            ) {
                setSelectedTimePeriod(response[0].objectives.timeperiod[0]);
            }
            if (
                response[0].objectives?.momentum?.tabs &&
                response[0].objectives?.momentum?.tabs.length > 0
            ) {
                setSelectedMomentumTab(response[0].objectives.momentum.tabs[0]);
            }
            // fetchGoalData(response[0]['id']);
        }
        setLoadingGoals(false);
    };

    // const onResponseGoalData = (response) => {

    //     setSelectedGoal({
    //         ...selectedGoal,
    //         objectives: response.objectives
    //     });

    //     setLoadingGoals(false);
    // }

    const VerticalLinearProgress = (props) => {
        return <LinearProgress {...props} className={classes.root} variant="determinate" />;
    };
    return (
        <>
            <BorderContainer top left right classesProp={classes.topSection}>
                <BorderContainer bottom right classesProp={classes.goalSection}>
                    <Typography className={classes.goalText}>Goal</Typography>
                    {!loadingGoals && selectedGoal?.objectives?.timeperiod && (
                        <div className={classes.yearSection}>
                            {selectedGoal.objectives.timeperiod.map((item, i) => (
                                <div
                                    className={classes.year}
                                    key={`timeperiod${i}`}
                                    onClick={() => setSelectedTimePeriod(item)}
                                >
                                    <div className={classes.circle}>
                                        {selectedTimePeriod === item && (
                                            <div className={classes.circleInner}></div>
                                        )}
                                    </div>
                                    <Typography className={classes.yearText}>{item}</Typography>
                                </div>
                            ))}
                        </div>
                    )}
                </BorderContainer>
                <BorderContainer bottom classesProp={classes.headingSection}>
                    <Typography className={classes.heading}>
                        {kpis?.label ? kpis.label : 'Current Performance'}
                    </Typography>
                </BorderContainer>
            </BorderContainer>
            <BorderContainer bottom right left classesProp={classes.intiativeSection}>
                <BorderContainer right classesProp={classes.targetSection}>
                    {!loadingGoals && selectedGoal?.objectives ? (
                        <div
                            className={classes.targetBox}
                            onClick={() => {
                                setOpenProcess(true);
                            }}
                        >
                            <Typography className={classes.targetHeading}>
                                {selectedGoal.objectives.name}
                            </Typography>
                            <div className={classes.targetDataHolder}>
                                {selectedGoal.objectives.targets
                                    .filter((item) => item.timeperiod === selectedTimePeriod)
                                    .map((item, i) => (
                                        <div className={classes.inner} key={`targetholder${i}`}>
                                            <Typography className={classes.targetText}>
                                                {item.name}
                                            </Typography>
                                            <div className={classes.row}>
                                                <Typography className={classes.targetRecord}>
                                                    {item.record}
                                                </Typography>
                                                <div className={classes.outer}>
                                                    <ArrowDropUpIcon className={classes.arrowUp} />
                                                    <Typography className={classes.progressTop}>
                                                        {item.progress}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        loadingGoals && (
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
                        )
                    )}
                </BorderContainer>
                <div className={classes.intiativePart}>
                    {!loadingStrategy && kpis?.items
                        ? kpis.items.map((item, index) => (
                              <div key={`bordercontainer${index}`} className={classes.intiative}>
                                  <div className={classes.intiativeBox}>
                                      <div className={classes.rowSpace}>
                                          <Typography className={classes.intiativeName}>
                                              {item.name}
                                          </Typography>
                                          <Typography className={classes.projectionText}>
                                              {`Projection: ${item?.projection}`}
                                          </Typography>
                                      </div>
                                      <div className={classes.rowSpace2}>
                                          <Typography className={classes.recordText}>
                                              {item?.record}
                                          </Typography>
                                          <div className={classes.progresSection}>
                                              <Progress />
                                              <Typography className={classes.progressText}>
                                                  {item?.progress}
                                              </Typography>
                                          </div>
                                      </div>
                                  </div>
                                  {!(index + 1 === kpis.items.length) && (
                                      <div className={classes.separatorVertical}></div>
                                  )}
                              </div>
                          ))
                        : loadingStrategy && (
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
                          )}
                </div>
            </BorderContainer>
            <div className={classes.row}>
                {!loadingGoals &&
                    selectedGoal?.objectives?.momentum &&
                    selectedGoal?.objectives?.targets &&
                    openProcess && (
                        <div className={classes.processSection}>
                            <BorderContainer
                                left
                                right
                                bottom
                                classesProp={classes.moment}
                                hideRightTop={true}
                            >
                                <Typography className={classes.momentHeading}>
                                    {selectedGoal.objectives.momentum.label}
                                </Typography>
                                <div className={classes.yearSection}>
                                    {_.uniq(selectedGoal.objectives.targets.map((a) => a.name)).map(
                                        (item, i) => (
                                            <div className={classes.year} key={`header${i}`}>
                                                <div className={classes.circle}>
                                                    {i === 0 && (
                                                        <div className={classes.circleInner}></div>
                                                    )}
                                                </div>
                                                <Typography className={classes.selectText}>
                                                    {item}
                                                </Typography>
                                            </div>
                                        )
                                    )}
                                </div>
                            </BorderContainer>
                            <BorderContainer left right bottom classesProp={classes.tabs}>
                                <div className={classes.tabSection}>
                                    {selectedGoal.objectives.momentum.tabs.map((item, index) => (
                                        <Typography
                                            key={`filter${index}`}
                                            className={`${classes.tabItem} ${
                                                selectedMomentumTab === item
                                                    ? classes.tabItemColor
                                                    : ''
                                            }`}
                                            onClick={() => setSelectedMomentumTab(item)}
                                        >
                                            {item}
                                        </Typography>
                                    ))}
                                </div>
                            </BorderContainer>
                            <BorderContainer left right bottom classesProp={classes.quarterSection}>
                                <Typography className={classes.quarterHeading}>
                                    {selectedGoal.objectives.momentum.name}
                                </Typography>
                            </BorderContainer>
                            <BorderContainer
                                right
                                left
                                bottom
                                classesProp={classes.processSectionGraph}
                            >
                                <Projections
                                    setOpenintiative={setOpenintiative}
                                    selectedMomentumTab={selectedMomentumTab}
                                    momentum={selectedGoal.objectives.momentum.items}
                                />
                            </BorderContainer>

                            {!loadingStrategy && insights?.items && (
                                <BorderContainer
                                    left
                                    bottom
                                    right
                                    classesProp={classes.recommends}
                                    hideRightBottom={true}
                                >
                                    <div className={classes.recommedsWrapper}>
                                        <div className={classes.recommendsTop}>
                                            <Typography className={classes.recommendsHeading}>
                                                {insights.label}
                                            </Typography>
                                            <div className={classes.rowHeight}>
                                                {_.map(insights.items, function (item, index) {
                                                    return [
                                                        <div
                                                            className={classes.recommendData}
                                                            key={`insight-item-${index}`}
                                                        >
                                                            <div
                                                                className={classes.recommendContent}
                                                            >
                                                                <Typography
                                                                    className={classes.dataText}
                                                                >
                                                                    {item.data}
                                                                </Typography>
                                                                <div
                                                                    className={
                                                                        classes.actionSection
                                                                    }
                                                                >
                                                                    <Typography
                                                                        className={
                                                                            classes.takeActionText
                                                                        }
                                                                    >
                                                                        Notes
                                                                    </Typography>
                                                                    <Typography
                                                                        className={
                                                                            classes.takeActionText2
                                                                        }
                                                                    >
                                                                        Take Action
                                                                        <ArrowUpwardIcon
                                                                            className={
                                                                                classes.actionIcon
                                                                            }
                                                                        />
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </div>,
                                                        insights.items.length - 1 !== index ? (
                                                            <div
                                                                key={`border2${index}`}
                                                                className={classes.separtorLine}
                                                            ></div>
                                                        ) : null
                                                    ];
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </BorderContainer>
                            )}
                        </div>
                    )}

                {openProcess && (
                    <div className={classes.intiativesSection}>
                        {openProcess && openIntiative && (
                            <div className={classes.intiativeSectionInner}>
                                <BorderContainer
                                    right
                                    bottom
                                    classesProp={classes.intiativeHeadingSection}
                                    hideleftTop={true}
                                >
                                    <Typography className={classes.intiativeHeading}>
                                        Intiatives
                                    </Typography>
                                </BorderContainer>
                                <div className={classes.column}>
                                    {!loadingGoals &&
                                        selectedGoal?.initiatives &&
                                        selectedGoal.initiatives.map((item, index) => (
                                            <BorderContainer
                                                right
                                                bottom
                                                classesProp={classes.intiativeContent}
                                                key={`border3${index}`}
                                            >
                                                <div
                                                    className={`${classes.intiativeContentInner}`}
                                                    onMouseEnter={() => {
                                                        setHover(index);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHover(null);
                                                    }}
                                                    onClick={() => onClickInitiative(item.id)}
                                                >
                                                    <Typography
                                                        className={classes.intiativeContextName}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    <div className={classes.rowGap}>
                                                        {item?.objectives?.data.map((el, i) =>
                                                            i > 1 ? (
                                                                ''
                                                            ) : (
                                                                <div
                                                                    className={classes.row}
                                                                    key={`initiative${i}`}
                                                                >
                                                                    <div
                                                                        className={
                                                                            classes.intiativeData
                                                                        }
                                                                    >
                                                                        <Typography
                                                                            className={
                                                                                classes.dataName
                                                                            }
                                                                        >
                                                                            {el.name}
                                                                        </Typography>
                                                                        <div
                                                                            className={classes.row}
                                                                        >
                                                                            <Typography
                                                                                className={
                                                                                    classes.dataRecord
                                                                                }
                                                                            >
                                                                                {el.record}
                                                                            </Typography>
                                                                            <div
                                                                                className={
                                                                                    classes.progresSection
                                                                                }
                                                                            >
                                                                                <Progress />
                                                                                <Typography
                                                                                    className={
                                                                                        classes.progressText
                                                                                    }
                                                                                >
                                                                                    {el?.progress}
                                                                                </Typography>
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    classes.progressBar
                                                                                }
                                                                            >
                                                                                {' '}
                                                                                <VerticalLinearProgress
                                                                                    variant="determinate"
                                                                                    value={50}
                                                                                />
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    classes.initiativeTargetHolder
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    className={
                                                                                        classes.targetHeading1
                                                                                    }
                                                                                >
                                                                                    Target
                                                                                </Typography>
                                                                                <Typography
                                                                                    className={
                                                                                        classes.targetHeading1
                                                                                    }
                                                                                >
                                                                                    {el.target}
                                                                                </Typography>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {i + 1 !==
                                                                        item.objectives.data
                                                                            .length && (
                                                                        <div
                                                                            className={
                                                                                classes.separtor
                                                                            }
                                                                        ></div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>

                                                    <div className={classes.redirectSection}>
                                                        <Typography
                                                            className={
                                                                hover === index
                                                                    ? `${classes.hoverRedirectToValue}`
                                                                    : `${classes.redirectToValue} ${
                                                                          index === 0
                                                                              ? classes.valueHighlight
                                                                              : classes.valueNormal
                                                                      }`
                                                            }
                                                        >
                                                            View Value dashboard to learn more{' '}
                                                        </Typography>
                                                        <ArrowUpwardIcon
                                                            className={
                                                                hover === index
                                                                    ? classes.hoverValueIcon
                                                                    : classes.valueIcon
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </BorderContainer>
                                        ))}
                                </div>
                                <BorderContainer
                                    bottom
                                    right
                                    stylesProp={{ flex: '1' }}
                                    hideleftBottom={true}
                                    hideleftTop={true}
                                ></BorderContainer>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default StrategyRedesign;
