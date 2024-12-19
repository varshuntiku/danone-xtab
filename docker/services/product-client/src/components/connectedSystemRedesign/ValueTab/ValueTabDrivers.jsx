import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BorderContainer from './BorderContainer';
import DriverProcess from './DriverProcess';
// import MinervaChatbot from 'components/minerva2/MinervaChatbot';
// import ConnSystemsContext from '../ConnectedSystemsContext';
// import LinearProgress from '@material-ui/core/LinearProgress';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import { getDriverDetails } from 'services/connectedSystem_v2';

const useStyles = makeStyles((theme) => ({
    driverSection: {
        height: '100%',
        display: 'flex'
    },
    driversList: {
        paddingLeft: theme.layoutSpacing(24),
        paddingTop: theme.layoutSpacing(14),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(32),
        width: theme.layoutSpacing(285),
        justifyContent: 'space-between',
        '@media (max-width: 1300px)': {
            width: theme.layoutSpacing(285)
        }
    },
    indicator: {
        width: '1rem',
        height: '1rem',
        backgroundColor: theme.palette.text.default,
        borderRadius: '50%'
    },
    driverListSection: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        marginTop: '5rem'
    },
    driverListItems: {
        margin: theme.spacing(0, 2, 0, 5),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        minHeight: theme.layoutSpacing(250)
    },
    driverListItem: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        cursor: 'pointer'
    },
    heading: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing
    },
    driversData: {
        width: '100%',
        height: '100%'
    },
    topBar: {
        width: theme.layoutSpacing(10),
        height: '20%',
        border: `2px solid ${theme.palette.text.black}`,
        position: 'absolute',
        top: '0',
        left: '0',
        borderRadius: '10px',
        transition: '1s'
    },
    bottomBar: {
        width: theme.layoutSpacing(10),
        height: '60%',
        border: `2px solid ${theme.palette.text.black}`,
        position: 'absolute',
        bottom: '0',
        left: '0',
        borderRadius: '5px',
        transition: '1s'
    },
    dotContainer: {
        top: '0%',
        position: 'absolute',
        width: theme.layoutSpacing(14),
        transition: '1s'
    },
    dot: {
        width: theme.layoutSpacing(14),
        aspectRatio: 1,
        position: 'absolute',
        background: theme.palette.text.default,
        borderRadius: '50%',
        top: '50%',
        transform: 'translateY(-50%)',
        animation: '$reveal 1s'
    },
    '@keyframes reveal': {
        '0%': {
            width: 0
        },
        '100%': {
            width: theme.layoutSpacing(14)
        }
    },
    driverSelected: {
        fontSize: theme.layoutSpacing(20),
        lineHeight: theme.layoutSpacing(20),
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default
    },
    driverUnselected: {
        fontSize: theme.title.h3.fontSize,
        lineHeight: theme.layoutSpacing(16),
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default
    },
    askNuclios: {
        marginBottom: '30%'
    }
}));

function ValueTabDrivers({
    connSystemDashboardId,
    actions,
    setActions,
    selectedProcess,
    setSelectedProcess,
    setSelectedNode
}) {
    const classes = useStyles();
    const [selected, setSelected] = useState(null);
    // const connSystemData = useContext(ConnSystemsContext);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState('');

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        getDriverDetails({
            connSystemDashboardId: connSystemDashboardId,
            callback: onResponseDrivers
        });
    };

    const onResponseDrivers = (response) => {
        setDrivers(response);
        setLoading(false);
    };

    const onHandleDriver = (item, index) => {
        setSelected(index);
        setSelectedDriver(item);
        setSelectedProcess(null);
    };

    // const VerticalLinearProgress = (props) => {
    //     return <LinearProgress {...props} className={classes.root} variant="determinate" />;
    // };

    return loading ? (
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
        <div className={classes.driverSection}>
            <BorderContainer left right bottom classesProp={classes.driversList}>
                <Typography variant="h4" className={classes.heading}>
                    Drivers
                </Typography>
                <div className={classes.driverListSection}>
                    <div className={classes.driverListItems}>
                        {drivers.map((el, index) => (
                            <div
                                key={el.id}
                                className={classes.driverListItem}
                                onClick={() => {
                                    onHandleDriver(el, index);
                                }}
                            >
                                <Typography
                                    className={
                                        selectedDriver.id === el.id
                                            ? classes.driverSelected
                                            : classes.driverUnselected
                                    }
                                >
                                    {el.name}
                                </Typography>
                            </div>
                        ))}
                    </div>
                    {selected !== null && (
                        <React.Fragment>
                            <div
                                className={classes.topBar}
                                style={{
                                    height: `${(selected * 100) / drivers.length}%`,
                                    borderWidth: selected == 0 ? 0 : 1
                                }}
                            ></div>
                            <div
                                className={classes.dotContainer}
                                style={{
                                    top: `${(selected * 100) / drivers.length}%`,
                                    height: `${100 / drivers.length}%`,
                                    left: '-1%'
                                }}
                            >
                                <span className={classes.dot}></span>
                            </div>
                        </React.Fragment>
                    )}
                    <div
                        className={classes.bottomBar}
                        style={{
                            height:
                                selected !== null
                                    ? `${
                                          100 -
                                          (selected * 100) / drivers.length -
                                          100 / drivers.length
                                      }%`
                                    : '100%',
                            borderWidth: selected == drivers.length - 1 ? 0 : 1
                        }}
                    ></div>
                </div>
                {/* <div className={classes.askNuclios}>
                    <MinervaChatbot actions={actions} setActions={setActions} />
                </div> */}
            </BorderContainer>
            <BorderContainer right bottom classesProp={classes.driversData}>
                <DriverProcess
                    connSystemDashboardId={connSystemDashboardId}
                    selectedDriver={selectedDriver}
                    actions={actions}
                    setActions={setActions}
                    selectedProcess={selectedProcess}
                    setSelectedProcess={setSelectedProcess}
                    setSelectedNode={setSelectedNode}
                    fetchDrivers={fetchDrivers}
                />
            </BorderContainer>
        </div>
    );
}

export default ValueTabDrivers;
