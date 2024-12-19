import React, { useEffect, useState } from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KpiCard from 'components/connectedSystem/KpiCard';
import { springConfig } from 'util/spring-config';
import { animated, useSpring } from '@react-spring/web';
import Goals from 'components/connectedSystem/Goals';
import source_database from './icons/SourceDatabase.svg';
import source_file from './icons/SourceCSVFile.svg';
import source_facebook from './icons/SourceFacebook.svg';
import source_google from './icons/SourceGoogle.svg';
import datawarehouse from './icons/DataWarehouse.svg';
import datamart from './icons/DataMart.svg';
import datalake from './icons/DataLake.svg';
import {
    getInitiativesAndGoals,
    getArchitectureData,
    getProblemOverview
} from 'services/connectedSystem';
import connSystemFoundationTabstyle from 'assets/jss/connSystemFoundationTabstyle.jsx';
import HorizontalScroll from 'components/connectedSystem/HorizontalScroll';
import { ReactComponent as ScatterGraphSvg } from 'assets/img/scatterGraph.svg';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';

function DataUser(props) {
    const data_user_classes = props.classes;
    const classes = props.data.classList;
    const [openwarehouse, setOpenwarehouse] = useState(false);
    const [opendatamart, setOpendatamart] = useState(false);
    const [openapp, setOpenapp] = useState(false);
    const { data } = props;
    const [goalData, setGoalData] = useState([]);
    const [appData, setAppData] = useState([]);
    const [goal, setGoal] = useState({});
    const [architectureData, setArchitectureData] = useState([]);
    const [architectureDataConfig, setArchitectureDataConfig] = useState({});
    const codexTheme = localStorage.getItem('codx-products-theme');
    const [goalSprings, goalApi] = useSpring(() => ({
        from: { x: -300, opacity: 0 }
    }));
    const [goalDataSprings, goalDataApi] = useSpring(() => ({
        from: { x: 900, opacity: 0 }
    }));

    const fetchGoalsAndInitiativesData = async () => {
        getInitiativesAndGoals(data.code, 2, 'data').then((response) => {
            setGoal(response.goals);
            setGoalData(response.initiatives);
        });
    };
    const fetchArchitectureData = async () => {
        getArchitectureData(data.code).then((response) => {
            setArchitectureData(response.data);
            if (response.config) setArchitectureDataConfig(response.config);
        });
    };

    const fetchAppData = async () => {
        getProblemOverview(data.code, 2, 'data').then((response) => {
            setAppData(response.analysisData);
        });
    };
    useEffect(() => {
        fetchGoalsAndInitiativesData();
        fetchArchitectureData();
        fetchAppData();
    }, []);

    const startNodeAnimation = (api, animationObj = {}, customSpringConfig = {}) => {
        api.start({
            from: {
                ...(animationObj.x && { x: animationObj.x[0] }),
                ...(animationObj.opacity && { opacity: animationObj.opacity[0] })
            },
            to: {
                ...(animationObj.x && { x: animationObj.x[1] }),
                ...(animationObj.opacity && { opacity: animationObj.opacity[1] })
            },
            config: {
                ...springConfig,
                ...customSpringConfig
            }
        });
    };
    useEffect(() => {
        startNodeAnimation(goalApi, { x: [-300, 0], opacity: [0, 1] });
        startNodeAnimation(goalDataApi, { x: [900, 0], opacity: [0, 1] });
    }, []);

    const dataRow = (heading, dataArray) => {
        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <Typography className={data_user_classes.data_qualityText}>
                        {heading}
                    </Typography>
                </Grid>
                {dataArray.map((val, key) => (
                    <Grid item xs={6} key={`appData${key}`}>
                        <KpiCard
                            item={val}
                            title={{
                                fontStyle: 'Roboto',
                                fontSize: '0.9rem',
                                fontSizeLg: '1.4rem',
                                fontSizeXl: '1.75rem',
                                fontWeight: 500,
                                letterSpacing: '1px'
                            }}
                            graphmarginTop={'-1.5rem'}
                            graphHeight={'80%'}
                            graphWidth={'150%'}
                            height={'13rem'}
                            rightContainerBottomPadding="0rem"
                            bottomPadding="0rem"
                            bottomDivMarginTop="1rem"
                            cardBoxShadow={
                                codexTheme == 'dark'
                                    ? '0px 0px 11px 0px rgba(0, 0, 0, 0.40)'
                                    : 'none'
                            }
                            border={
                                codexTheme === 'dark'
                                    ? '0.5px solid #02E0FE80'
                                    : '0.5px solid #220047'
                            }
                        />
                    </Grid>
                ))}
            </React.Fragment>
        );
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedBusinessFunction, setSelectedBusinessFunction] = React.useState('Marketing');

    const handleDropDownOpen = (event) => {
        if (anchorEl === null) setAnchorEl(event.currentTarget);
    };

    const handleDropdownClose = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (value) => {
        setSelectedBusinessFunction(value);
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <div className={classes.connSystemGridTop}>
                <animated.div className={classes.connSystemGoals} style={goalSprings}>
                    <Goals goals={goal} fit={true} />
                </animated.div>
                <animated.div
                    className={data_user_classes.goalDataContainer}
                    style={goalDataSprings}
                >
                    {goalData ? (
                        <HorizontalScroll>
                            {goalData.map((item, index) => (
                                <KpiCard
                                    item={item}
                                    key={index}
                                    marginLeft={'40%'}
                                    width={'18.58vw'}
                                    minWidth="250px"
                                    border={
                                        codexTheme === 'dark'
                                            ? '2px solid #A4CC0480'
                                            : '2px solid #94B80480'
                                    }
                                    background={
                                        codexTheme !== 'dark'
                                            ? 'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)'
                                            : ''
                                    }
                                    title={{
                                        fontStyle: 'Roboto',
                                        fontWeight: 400,
                                        letterSpacing: '1px',
                                        paddingLeft: '1rem'
                                    }}
                                    graphHeight={index === 2 || index === 0 ? '100%' : '100%'}
                                    graphWidth={index === 2 || index === 0 ? '110%' : '100%'}
                                    graphMarginLeft={index === 2 || index === 0 ? '0rem' : '1rem'}
                                    {...(index === 1 ? { graphmarginTop: '0rem' } : {})}
                                />
                            ))}
                        </HorizontalScroll>
                    ) : null}
                </animated.div>
            </div>
            <animated.div
                className={`${classes.connSystemGridMiddle} ${data_user_classes.data_midGrid}`}
                style={goalSprings}
            >
                <div className={data_user_classes.data_processHolder}>
                    <div className={data_user_classes.data_headingHolder}>
                        <Typography className={data_user_classes.data_mainHeading}>
                            Architecture Flow
                        </Typography>
                        <div className={data_user_classes.data_dropdownHolder}>
                            <div
                                className={
                                    anchorEl !== null
                                        ? `${data_user_classes.businessFunctionDropdown} ${data_user_classes.businessFunctionDropdownBorder}`
                                        : `${data_user_classes.businessFunctionDropdown}`
                                }
                                onClick={handleDropDownOpen}
                            >
                                <p>Business Function: </p>
                                <p className={data_user_classes.businessFunctionSelectedValue}>
                                    {selectedBusinessFunction
                                        ? selectedBusinessFunction
                                        : 'select option'}
                                </p>
                                {anchorEl !== null ? (
                                    <ExpandLessIcon className={data_user_classes.expandLessIcon} />
                                ) : (
                                    <ExpandMoreIcon className={data_user_classes.expandMoreIcon} />
                                )}
                            </div>
                            <Menu
                                className={data_user_classes.businessFunctionMenu}
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleDropdownClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                getContentAnchorEl={null}
                            >
                                <MenuItem
                                    className={data_user_classes.businessFunctionMenuItem}
                                    onClick={() => handleOptionClick('Marketing')}
                                >
                                    <p>Marketing</p>
                                </MenuItem>
                                <MenuItem
                                    className={data_user_classes.businessFunctionMenuItem}
                                    onClick={() => handleOptionClick('Supply Chain')}
                                >
                                    <p>Supply Chain</p>
                                </MenuItem>
                                <MenuItem
                                    className={data_user_classes.businessFunctionMenuItem}
                                    style={{ border: 'none' }}
                                    onClick={() => handleOptionClick('Finance')}
                                >
                                    <p>Finance</p>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>

                    <div className={data_user_classes.data_stepsHolder}>
                        <div
                            className={`${data_user_classes.data_sourceContainer} ${data_user_classes.data_visible}`}
                        >
                            <Typography className={data_user_classes.data_titleText}>
                                DATA SOURCE
                            </Typography>
                            <img
                                src={source_database}
                                className={data_user_classes.data_sourceImage}
                                style={{
                                    '--width': architectureDataConfig?.data_source?.icon_width,
                                    '--height': architectureDataConfig?.data_source?.icon_height
                                }}
                                alt="database"
                            />
                            <Typography className={data_user_classes.data_sourceText}>
                                Source
                            </Typography>
                            <img
                                src={source_file}
                                className={data_user_classes.data_sourceImage}
                                style={{
                                    '--width': architectureDataConfig?.data_source?.icon_width,
                                    '--height': architectureDataConfig?.data_source?.icon_height
                                }}
                                alt="file"
                            />
                            <Typography className={data_user_classes.data_sourceText}>
                                Source
                            </Typography>
                            <div
                                className={data_user_classes.data_sourceImage}
                                style={{
                                    '--width': architectureDataConfig?.data_source?.icon_width,
                                    '--height': architectureDataConfig?.data_source?.icon_height
                                }}
                            >
                                <img
                                    className={data_user_classes.data_googleImage}
                                    src={source_facebook}
                                    alt="facebook"
                                />
                                <img
                                    className={data_user_classes.data_googleImage}
                                    src={source_google}
                                    alt="google"
                                />
                            </div>
                            <Typography className={data_user_classes.data_sourceText}>
                                Source
                            </Typography>
                        </div>
                        <div
                            className={`${data_user_classes.data_arrow} ${data_user_classes.data_visible}`}
                        ></div>
                        <div
                            className={`${data_user_classes.data_sourceContainer} ${data_user_classes.data_visible}`}
                        >
                            <Typography className={data_user_classes.data_titleText}>
                                DATA LAKE
                            </Typography>
                            <img
                                onClick={() => {
                                    if (openwarehouse && opendatamart) {
                                        setOpendatamart(false);
                                        setOpenapp(false);
                                    }
                                    setOpenwarehouse(!openwarehouse);
                                }}
                                src={datalake}
                                className={data_user_classes.data_dataLake}
                                style={{
                                    '--width': architectureDataConfig?.data_lake?.icon_width,
                                    '--height': architectureDataConfig?.data_lake?.icon_height
                                }}
                                alt="data lake"
                            />
                            <Typography className={data_user_classes.data_sourceTextHighlighted}>
                                Data Lake
                            </Typography>
                        </div>
                        <div
                            className={
                                openwarehouse
                                    ? `${data_user_classes.data_arrow} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_arrow
                            }
                        ></div>
                        <div
                            className={
                                openwarehouse
                                    ? `${data_user_classes.data_sourceContainer} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_sourceContainer
                            }
                        >
                            <Typography
                                className={clsx(
                                    data_user_classes.data_titleText,
                                    data_user_classes.data_datawarehouse_titletext
                                )}
                            >
                                DATA WAREHOUSE
                            </Typography>
                            {architectureData.map((val) => (
                                <React.Fragment key={val?.name}>
                                    <img
                                        onClick={() => {
                                            if (opendatamart && openapp) {
                                                setOpenapp(false);
                                            }
                                            setOpendatamart(!opendatamart);
                                        }}
                                        src={datawarehouse}
                                        className={data_user_classes.data_dataWarehouse}
                                        style={{
                                            '--width':
                                                architectureDataConfig?.data_warehouse?.icon_width,
                                            '--height':
                                                architectureDataConfig?.data_warehouse?.icon_height
                                        }}
                                        alt="data warehouse"
                                    />
                                    <Typography
                                        className={
                                            val?.isActive
                                                ? data_user_classes.data_sourceTextHighlighted
                                                : data_user_classes.data_sourceTextUnderlined
                                        }
                                    >
                                        {val?.name}
                                    </Typography>
                                </React.Fragment>
                            ))}
                        </div>
                        <div
                            className={
                                opendatamart
                                    ? `${data_user_classes.data_arrow} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_arrow
                            }
                        ></div>
                        <div
                            className={
                                opendatamart
                                    ? `${data_user_classes.data_sourceContainer} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_sourceContainer
                            }
                        >
                            <Typography className={data_user_classes.data_titleText}>
                                DATA MART
                            </Typography>
                            {architectureData[0]?.dataMart.map((val) => (
                                <React.Fragment key={val?.name}>
                                    <img
                                        onClick={() => setOpenapp(!openapp)}
                                        src={datamart}
                                        className={data_user_classes.data_dataMart}
                                        style={{
                                            '--width':
                                                architectureDataConfig?.data_mart?.icon_width,
                                            '--height':
                                                architectureDataConfig?.data_mart?.icon_height
                                        }}
                                        alt="data mart"
                                    />
                                    <Typography
                                        className={
                                            val?.isActive
                                                ? data_user_classes.data_sourceTextHighlighted
                                                : data_user_classes.data_sourceTextUnderlined
                                        }
                                    >
                                        {val?.name}
                                    </Typography>
                                </React.Fragment>
                            ))}
                        </div>
                        <div
                            className={
                                openapp
                                    ? `${data_user_classes.data_arrow} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_arrow
                            }
                        ></div>
                        <div
                            className={
                                openapp
                                    ? `${data_user_classes.data_sourceContainer} ${data_user_classes.data_visible}`
                                    : data_user_classes.data_sourceContainer
                            }
                        >
                            <Typography className={data_user_classes.data_titleText}>
                                APPLICATION
                            </Typography>
                            <Typography className={data_user_classes.data_appText}>
                                {architectureData[0]?.dataMart[0]?.app}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Grid container spacing={1} className={data_user_classes.data_kpiHolder}>
                    <ScatterGraphSvg className={data_user_classes.svgHolder} />
                    {dataRow('QUALITY', appData.slice(0, 2))}
                    {dataRow('CONSUMPTION', appData.slice(2, 4))}
                    {dataRow('LINEAGE & METADATA', appData.slice(4, 6))}
                </Grid>
            </animated.div>
        </React.Fragment>
    );
}

export default withStyles(connSystemFoundationTabstyle, { withTheme: true })(DataUser);
