import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BorderContainer from './ValueTab/BorderContainer';
import MinervaChatbot from 'components/minerva2/MinervaChatbot';

const useStyles = makeStyles((theme) => ({
    driverSection: {
        height: '100%',
        display: 'flex'
    },
    driversList: {
        paddingLeft: theme.layoutSpacing(32),
        paddingTop: '2rem',
        paddingBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(32),
        width: '13.5%',
        justifyContent: 'space-between'
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
        position: 'relative'
    },
    driverListItems: {
        marginLeft: theme.layoutSpacing(30),
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
        fontFamily: theme.title.h1.fontFamily
    },
    driverUnselected: {
        fontSize: theme.title.h3.fontSize,
        lineHeight: theme.layoutSpacing(16),
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily
    },
    driverTop: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(16)
    }
}));

function DriversLeftSection({
    drivers,
    selectedDriver,
    onHandleDriver,
    selected,
    actions,
    setActions
}) {
    const classes = useStyles();
    return (
        <BorderContainer left right bottom classesProp={classes.driversList}>
            <div className={classes.driverTop}>
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
                                        selectedDriver?.id === el.id
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
            </div>

            <div>
                <MinervaChatbot
                    actions={actions ? actions : ''}
                    setActions={setActions ? setActions : ''}
                />
            </div>
        </BorderContainer>
    );
}

export default DriversLeftSection;
