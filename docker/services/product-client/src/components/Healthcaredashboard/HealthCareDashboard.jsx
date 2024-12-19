// import "./styles.css";
import { Fragment, useState } from 'react';
import React from 'react';
import Industries from './components/Industries';
import Home from './components/Home';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import { Button, makeStyles, ButtonGroup, CssBaseline } from '@material-ui/core';
import HirarchyTable from './hirarchyTable/HirarchyTable';
import NavBar from '../NavBar';

const useStyles = makeStyles(() => ({
    f1: {
        fontWeight: '1.6rem'
    },
    actionContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '1rem'
    },
    homeHexagon: {
        backgroundColor: 'blue'
    }
}));
export default function HealthCareDashboard() {
    const classes = useStyles();
    const [showChild, setShowChild] = useState({
        show: false,
        selectedCategory: ''
    });
    const [view, setView] = useState('hexagon');

    const clickedHexagon = (value) => {
        if (value.name !== 'Health care') {
            setShowChild((prevstate) => ({
                ...prevstate,
                show: true,
                selectedCategory: value
            }));
        } else {
            setShowChild((prevstate) => ({
                ...prevstate,
                show: false,
                selectedCategory: ''
            }));
        }
    };

    return (
        <Fragment>
            <CssBaseline />
            <NavBar />
            <div className={classes.actionContainer}>
                <ButtonGroup value={view}>
                    <Button
                        onClick={() => {
                            setView('hexagon');
                            setShowChild((prevstate) => ({ ...prevstate, show: false }));
                        }}
                        variant={view === 'hexagon' ? 'contained' : 'outlined'}
                        value="grid"
                        aria-label="Apps"
                    >
                        <AppsIcon />
                    </Button>
                    <Button
                        onClick={() => {
                            setView('list');
                        }}
                        variant={view === 'list' ? 'contained' : 'outlined'}
                        value="list"
                        aria-label="List view"
                    >
                        <ListIcon />
                    </Button>
                </ButtonGroup>
            </div>
            {view === 'list' ? (
                <div>
                    <HirarchyTable />
                </div>
            ) : (
                <div>
                    {' '}
                    {!showChild.show ? (
                        <div className={classes.homeHexagon}>
                            <Home clickedHexagon={clickedHexagon} />
                        </div>
                    ) : (
                        <Industries
                            clickedHexagon={clickedHexagon}
                            category={showChild.selectedCategory}
                        />
                    )}
                </div>
            )}
        </Fragment>
    );
}
