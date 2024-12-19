import React from 'react';
import Hexagon from './Hexagon';
import { makeStyles } from '@material-ui/core';
import { DashboardSpecs } from '../../../../assets/data/dashboardSpecs';
const useStyles = makeStyles((theme) => ({
    f1: {
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    lefthexagons: {
        padding: '5px',
        // backgroundColor:'orange'
        marginTop: '8rem'
    },
    leftmenu: {
        position: 'relative',
        left: '30px',
        padding: '2.7rem',
        // boxSizing: "border-box",
        border: '1px dashed',
        borderRadius: '5px',
        borderColor: theme.palette.primary.contrastText + 'cc',
        minHeight: '85vh',
        minWidth: '20rem',
        display: 'flex',
        justifyContent: 'flex-center',
        alignItems: 'center'
    },
    rootIcon: {
        height: '5rem',
        width: '10rem',
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark' ? '#0C2744' : '#fcfcfc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-center',
        alignItems: 'center',
        position: 'absolute',
        top: '-3rem',
        // top:'-40px',
        left: '5rem',
        cursor: 'pointer'
    },
    f4: {
        fontSize: '1.5rem',
        fontWeight: '620',
        color: theme.palette.primary.contrastText,
        position: 'relative',
        top: '-1.4rem'
    }
}));
const LeftMenu = ({ setMenu, handleMenu, menu, apiData }) => {
    const classes = useStyles();
    const rootNode = apiData.filter((el) => el.parent_id === null);
    const categories = apiData.filter((el) => el.parent_id === rootNode[0].id);

    var rootLabel;
    // eslint-disable-next-line no-unused-vars
    var rootId;
    var root;
    if (rootNode.length) {
        var label = rootNode[0].label.toUpperCase();
        rootLabel = rootNode[0].logo_name;
        // eslint-disable-next-line no-unused-vars
        rootId = rootNode[0].id;
        root = rootNode;
    }

    return (
        <React.Fragment>
            <div className={classes.leftmenu}>
                <div
                    className={classes.rootIcon}
                    onClick={() => {
                        setMenu(rootLabel);
                        handleMenu(root[0]);
                    }}
                >
                    <img src={DashboardSpecs[rootLabel]} alt="root icon" />
                    <p className={classes.f4}>{label}</p>
                </div>
                <div className={classes.lefthexagons}>
                    {categories.map((el, i) => (
                        <div key={i}>
                            <Hexagon
                                category={el}
                                setMenu={setMenu}
                                handleMenu={handleMenu}
                                menu={menu}
                                rootNode={rootNode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
};
export default LeftMenu;
