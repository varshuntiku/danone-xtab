import React from 'react';
import { data } from '../data1';
import MenuHexagon from './MenuHexagon';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    f1: {
        fontSize: '1.3rem',
        fontWeight: '500'
    },
    lefthexagons: {
        padding: '5px'
    },
    leftmenu: {
        position: 'relative',
        left: '30px',
        padding: '5px',
        boxSizing: 'border-box',
        border: '1px dashed',
        borderRadius: '5px',
        borderColor: theme.palette.primary.contrastText
    }
}));
const LeftMenu = ({ clickedHexagon, setShow, setPosition }) => {
    const classes = useStyles();

    const categories = data.filter((el) => el.parent_id === 0);
    return (
        <React.Fragment>
            <div className={classes.leftmenu}>
                <div style={{ padding: '5px' }}>
                    <MenuHexagon
                        clickedHexagon={clickedHexagon}
                        category={{
                            id: 1,
                            name: 'Health care',
                            color: 'transparent',
                            parent_id: null
                        }}
                        setShow={setShow}
                        setPosition={setPosition}
                    />
                </div>
                {categories.map((el, i) => (
                    <div key={'lefthexagons' + i} className={classes.lefthexagons}>
                        <MenuHexagon
                            clickedHexagon={clickedHexagon}
                            category={el}
                            setShow={setShow}
                            setPosition={setPosition}
                        />
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};
export default LeftMenu;
