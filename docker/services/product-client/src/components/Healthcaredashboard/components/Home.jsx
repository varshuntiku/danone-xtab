import { data } from '../data1';
import './home.css';
import svg from '../connectors/landingconnector.svg';
import Hexagon from './hexagon';
import React from 'react';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles(() => ({
    home: {
        display: 'flex',
        flexDirection: 'column',
        width: 'max-content'
    },
    svg: {
        marginLeft: '90px',
        position: 'relative',
        display: 'flex'
    },
    svg1: {
        transform: 'rotate(180deg)'
    },
    healthcare: {
        position: 'relative',
        right: '16px',
        top: '15px'
    },
    hexagon1: {
        position: 'relative',
        top: '28px',
        left: '12px'
    },
    hexagon2: {
        position: 'relative',
        bottom: '28px',
        left: '10px'
    },
    hexagon3: {
        position: 'relative',
        top: '23px',
        left: '50px'
    },
    hexagon4: {
        position: 'relative',
        bottom: '33px',
        left: '46px'
    },
    secondconnector: {
        // transform:"rotate(180deg)",
        position: 'relative',
        right: '32px',
        bottom: '5px'
    },
    row1: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    row2: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    landing: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100vw',
        height: '100vh'
    }
}));
const Home = ({ clickedHexagon }) => {
    const classes = useStyles();
    const categories = data.filter((el) => el.parent_id === 0);
    return (
        <>
            <div className={classes.landing}>
                <div className={classes.home}>
                    <div className={classes.row1}>
                        <div className={classes.hexagon1}>
                            <Hexagon clickedHexagon={clickedHexagon} category={categories[2]} />
                        </div>
                        <div className={classes.hexagon3}>
                            <Hexagon clickedHexagon={clickedHexagon} category={categories[3]} />
                        </div>
                    </div>
                    <div className="svg">
                        <img src={svg} className={classes.svg1} alt="connector" />
                        <div className={classes.healthcare}>
                            <Hexagon
                                clickedHexagon={clickedHexagon}
                                category={{
                                    id: 1,
                                    name: 'Health care',
                                    color: '#68E1BD',
                                    parent_id: null
                                }}
                            />
                        </div>
                        <img className={classes.secondconnector} alt="connector" src={svg} />
                    </div>
                    <div className={classes.row2}>
                        <div className={classes.hexagon2}>
                            <Hexagon clickedHexagon={clickedHexagon} category={categories[1]} />
                        </div>
                        <div className={classes.hexagon4}>
                            <Hexagon clickedHexagon={clickedHexagon} category={categories[0]} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Home;
