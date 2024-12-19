// import "./styles.css";
import { Fragment, useState } from 'react';
import React from 'react';
// import Industries from "./components/Industries";
// import Home from "./components/Home";
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import { Button, makeStyles, ButtonGroup, CssBaseline } from '@material-ui/core';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import Structure from './NetworkGraphDashboard';
import NavBar from '../../NavBar';
import HirarchyTable from '../../Healthcaredashboard/hirarchyTable/HirarchyTable';

const useStyles = makeStyles(() => ({
    f1: {
        fontWeight: '1.6rem'
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1rem'
        // backgroundColor:'white'
    },
    homeHexagon: {
        backgroundColor: 'blue'
    },
    vis: {
        display: 'flex',
        backgroundColor: 'ornage'
    },
    tableView: {
        padding: '2.5rem'
    },
    dashboard: {
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark' ? '#0C2744' : '#fcfcfc',
        minHeight: '100vh'
    }
}));
export default function NetworkDashboard(props) {
    const classes = useStyles();
    // eslint-disable-next-line no-unused-vars
    const [showChild, setShowChild] = useState({
        show: false,
        selectedCategory: ''
    });
    const [view, setView] = useState('hexagon');
    const [section, setSection] = useState('heirarcy');
    const [tabelJosn, setTableJson] = useState({});

    // const clickedHexagon = (value) => {
    //     if (value.name !== "Health care") {
    //         setShowChild((prevstate) => ({
    //             ...prevstate,
    //             show: true,
    //             selectedCategory: value
    //         }));
    //     } else {
    //         setShowChild((prevstate) => ({
    //             ...prevstate,
    //             show: false,
    //             selectedCategory: ""
    //         }));
    //     }
    // };

    return (
        <Fragment>
            <CssBaseline />
            <NavBar />
            <div className={classes.dashboard}>
                <div className={classes.actionContainer}>
                    {view !== 'list' ? (
                        <ButtonGroup style={{ padding: '10px' }}>
                            <Button
                                onClick={() => {
                                    setSection('heirarcy');
                                }}
                                variant={section === 'heirarcy' ? 'contained' : 'outlined'}
                                aria-label="Heirarcy"
                            >
                                <ShowChartIcon />
                            </Button>
                            <Button
                                onClick={() => {
                                    setSection('toptoleaf');
                                }}
                                variant={section === 'toptoleaf' ? 'contained' : 'outlined'}
                                aria-label="toptoleaf"
                            >
                                <AcUnitIcon />
                            </Button>
                        </ButtonGroup>
                    ) : null}
                    {/*  */}
                    <ButtonGroup value={view} style={{ padding: '10px' }}>
                        <Button
                            onClick={() => {
                                setView('hexagon');
                                setShowChild((prevstate) => ({ ...prevstate, show: false }));
                            }}
                            variant={view === 'hexagon' ? 'contained' : 'outlined'}
                            value="grid"
                            aria-label="hexagon view"
                        >
                            <AppsIcon />
                        </Button>
                        <Button
                            onClick={() => {
                                setView('list');
                            }}
                            variant={view === 'list' ? 'contained' : 'outlined'}
                            value="list"
                            aria-label="list view"
                        >
                            <ListIcon />
                        </Button>
                    </ButtonGroup>
                    {/*  */}
                </div>
                {view === 'list' ? (
                    <div className={classes.tableView}>
                        {Object.keys(tabelJosn).length > 1 ? (
                            <HirarchyTable tabelJosn={tabelJosn} />
                        ) : null}
                    </div>
                ) : (
                    <div className={classes.vis}>
                        <Structure
                            section={section}
                            tabelJosn={tabelJosn}
                            setTableJson={setTableJson}
                            dashboardId={props.dashboardId}
                        />
                    </div>
                )}
            </div>
        </Fragment>
    );
}
