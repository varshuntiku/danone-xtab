import './industries.css';
import React from 'react';
import { Fragment, useState } from 'react';
import { childicons } from '../data';
import { data } from '../data1';
import double from '../manfacuters/singleconnector.svg';
import single from '../connectors/singleconnector1.svg';
import { dataicons } from '../data';
import ChildHexagon from './ChildHexagon';
import LeftMenu from './leftmenu';
import Box from './Box';
import Newhexagon from './newhexagon';
import { makeStyles } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
const useStyles = makeStyles((theme) => ({
    f1: {
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    icon: {
        fill: theme.palette.primary.contrastText + ' !important',
        stroke: theme.palette.primary.contrastText + ' !important'
    },
    level: {
        transform: 'rotate(270deg)'
    },
    lshape: {
        width: '200px',
        height: '150px',
        backgroundColor: 'transparent',
        position: 'absolute',
        borderLeft: '3px dashed orange',
        borderTop: '3px dashed orange',
        bottom: '50px',
        marginBottom: '22px',
        marginLeft: '40px'
    },
    BoxBackground: {
        backgroundColor: theme.palette.background.default
    },
    cancelBtn: {
        fill: theme.palette.primary.contrastText,
        stroke: theme.palette.primary.contrastText
    }
}));
const Lshape = (props) => {
    const classes = useStyles();
    return (
        <div
            className={classes.lshape}
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
        ></div>
    );
};
export default function Industries({ clickedHexagon, category }) {
    const classes = useStyles();

    const [show, setShow] = useState({ displayTop: false, displayBottom: false });
    const [func, setFunc] = useState({ children: [], icon: null });

    const [subfunctions, setSubfunctions] = useState({
        functionheading: '',
        subfunctions: [],
        show: false
    });

    const initialPositions = {
        leftTop: false,
        leftBottom: false,
        rightTop: false,
        rightBottom: false,
        level5: false
    };
    const [position, setPosition] = useState(initialPositions);
    // filtering acc to new data

    const mapping = dataicons[category.name];
    //all keys extracted
    const keys = Object.keys(mapping);

    // const industries = data.filter((el) => el.parent_id === category.id);

    // const max_level = 5;
    const level = childicons[category.name].length;
    let connect1 = null;
    let connect2 = null;
    if (level === 3) {
        connect1 = double;
        connect2 = single;
    } else if (level === 4) {
        connect1 = double;
        connect2 = double;
    } else if (level === 5) {
        connect1 = double;
        connect2 = double;
    }
    const handleIconClick = (value, icon, position) => {
        setSubfunctions({ ...subfunctions, functionheading: '', subfunctions: [], show: false });
        const industry = data.filter((el) => el.name === value);
        const Func = data.filter((el) => el.parent_id === industry[0].id);
        if (position === 'top') {
            setShow({ displayTop: true, displayBottom: false });
        } else {
            setShow({ displayTop: false, displayBottom: true });
        }
        setFunc((prevstate) => ({ ...prevstate, children: Func, icon: icon }));
    };
    function closeBox() {
        setShow({ displayTop: false, displayBottom: false });
        setPosition(initialPositions);
    }

    return (
        <Fragment>
            <div className="child_container">
                <div className="left_menu">
                    <LeftMenu
                        clickedHexagon={clickedHexagon}
                        setShow={setShow}
                        setPosition={setPosition}
                    />
                </div>
                <div className="exceptMenu">
                    <div
                        style={{ border: show.displayTop ? '3px dashed orange' : 'none' }}
                        className={`${classes.BoxBackground} TopFunc`}
                    >
                        {show.displayTop && (
                            <>
                                <button
                                    className={`${classes.cancelBtn} cancelIcon`}
                                    onClick={closeBox}
                                >
                                    <RemoveCircleOutlineIcon fontSize="large" />
                                </button>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: position.leftTop ? 'start' : 'end'
                                    }}
                                    className="boxx"
                                >
                                    <Box
                                        subfunctions={subfunctions}
                                        setSubfunctions={setSubfunctions}
                                        functions={func}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="children">
                        <div className="ro1">
                            {!position.leftTop ? (
                                <div
                                    onClick={() => {
                                        setPosition({ ...initialPositions, leftTop: true });
                                        handleIconClick(keys[0], mapping[keys[0]], 'top');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        className={`${classes.icon} icon1`}
                                        src={mapping[keys[0]]}
                                        alt="child"
                                    />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', bottom: '15px' }}>
                                    <div>
                                        <Lshape />
                                    </div>
                                    <Newhexagon data={mapping[keys[0]]} color={category.color} />
                                </div>
                            )}

                            {!position.leftBottom ? (
                                <div
                                    onClick={() => {
                                        setPosition({ ...initialPositions, leftBottom: true });
                                        handleIconClick(keys[1], mapping[keys[1]], 'bottom');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        // style={{ width: "80px", height: "80px" }}
                                        src={mapping[keys[1]]}
                                        alt="child"
                                    />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', right: '15px' }}>
                                    <div
                                        style={{
                                            transform: 'rotate(270deg)',
                                            position: 'relative',
                                            top: level === 5 ? '400px' : '240px',
                                            left: level === 5 ? '250px' : '220px'
                                        }}
                                    >
                                        {level === 5 ? (
                                            <Lshape width={368} height={180} />
                                        ) : (
                                            <Lshape />
                                        )}
                                    </div>
                                    <Newhexagon data={mapping[keys[1]]} color={category.color} />
                                </div>
                            )}
                            {/* style={{transform :"rotate(270deg)",position:"relative",top:"240px",left:"220px"}} */}
                        </div>
                        <div className="svg1">
                            <img src={connect1} alt="connector" />
                        </div>
                        <ChildHexagon category={category} />
                        <div className="func">
                            <Func
                                connector={connect2}
                                level={level}
                                mapping={mapping}
                                keys={keys}
                                handleIconClick={handleIconClick}
                                initialPositions={initialPositions}
                                position={position}
                                setPosition={setPosition}
                                category={category}
                                classes={classes}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            border: show.displayBottom ? '3px dashed orange' : 'none',
                            marginTop: level === 5 ? '250px' : '0px'
                        }}
                        className={`${classes.BoxBackground} downFunc`}
                    >
                        {show.displayBottom && (
                            <>
                                <button
                                    className={`${classes.cancelBtn} cancelIcon`}
                                    onClick={closeBox}
                                >
                                    <RemoveCircleOutlineIcon fontSize="large" />
                                </button>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: position.leftBottom ? 'start' : 'end'
                                    }}
                                    className="boxx"
                                >
                                    <Box
                                        subfunctions={subfunctions}
                                        setSubfunctions={setSubfunctions}
                                        functions={func}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    {/* displaying bottom at top level */}
                </div>
            </div>
        </Fragment>
    );
}
const Func = ({
    connector,
    level,
    mapping,
    keys,
    handleIconClick,
    initialPositions,
    position,
    setPosition,
    category,
    classes
}) => {
    const singleConnecotStyle = {
        position: 'relative',
        top: '0px',
        right: '33px'
    };
    const conditional = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        // transform: "rotate(-122deg)",
        position: 'relative',
        right: '38px'
    };
    return (
        <Fragment>
            <div className="right">
                <div
                    style={connector === single ? singleConnecotStyle : conditional}
                    className={level === 5 ? 'level5Style' : ' '}
                >
                    <img src={connector} alt="connector" />
                </div>
                <div className="column">
                    {level === 3 ? (
                        !position.rightTop ? (
                            <div
                                style={{ cursor: 'pointer', position: 'relative', right: '25px' }}
                                onClick={() => {
                                    setPosition({ ...initialPositions, rightTop: true });
                                    handleIconClick(keys[2], mapping[keys[2]], 'top');
                                }}
                            >
                                <img src={mapping[keys[2]]} alt="connector" />
                            </div>
                        ) : (
                            <div>
                                <div
                                    style={{
                                        transform: 'rotate(-270deg)',
                                        position: 'relative',
                                        bottom: '160px',
                                        right: '245px'
                                    }}
                                >
                                    <Lshape />
                                </div>
                                <div style={{ position: 'relative', right: '25px' }}>
                                    <Newhexagon data={mapping[keys[2]]} color={category.color} />
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="rs">
                            {!position.rightTop ? (
                                <div
                                    onClick={() => {
                                        setPosition({ ...initialPositions, rightTop: true });
                                        handleIconClick(keys[2], mapping[keys[2]], 'top');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        style={{ width: '80px', height: '80px' }}
                                        src={mapping[keys[2]]}
                                        alt="connector"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            transform: 'rotate(-270deg)',
                                            position: 'relative',
                                            right: '230px',
                                            bottom: '135px'
                                        }}
                                    >
                                        <Lshape />
                                    </div>
                                    <Newhexagon data={mapping[keys[2]]} color={category.color} />
                                </div>
                            )}
                            {!position.rightBottom ? (
                                <div
                                    onClick={() => {
                                        setPosition({ ...initialPositions, rightBottom: true });
                                        handleIconClick(keys[3], mapping[keys[3]], 'bottom');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        // style={{ width: "90px", height: "60px" }}
                                        src={mapping[keys[3]]}
                                        alt="connector"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div
                                        style={{
                                            transform: 'rotate(180deg)',
                                            position: 'relative'
                                        }}
                                    >
                                        {level === 5 ? (
                                            <Lshape width={168} height={370} />
                                        ) : (
                                            <Lshape />
                                        )}
                                    </div>
                                    <Newhexagon data={mapping[keys[3]]} color={category.color} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {level === 5 ? (
                    <div className="level5">
                        <img src={single} alt="connector" />
                        {!position.level5 ? (
                            <div
                                onClick={() => {
                                    setPosition({ ...initialPositions, level5: true });
                                    handleIconClick(keys[4], mapping[keys[4]], 'bottom');
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className="child5" src={mapping[keys[4]]} alt="icon" />
                            </div>
                        ) : (
                            <div
                                style={{
                                    position: 'relative',
                                    bottom: '115px',
                                    left: '125px'
                                }}
                            >
                                <div className={classes.level}>
                                    <Newhexagon data={mapping[keys[4]]} color={category.color} />
                                </div>
                                <div style={{ position: 'relative', top: '85px', left: '90px' }}>
                                    <Lshape width={100} height={0} />
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </Fragment>
    );
};
