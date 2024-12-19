import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Menu, MenuItem } from '@material-ui/core';
import { getScreenUserGuide } from 'services/screen.js';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import UserGuideIcon from '../assets/img/userguideIcon.svg'

const useStyles = makeStyles((theme) => ({
    guideButton: {
        width: '100%',
        border: 'none',
        padding: 0,
        fontSize: theme.layoutSpacing(13.1),
        fontFamily: theme.body.B5.fontFamily,
        height: theme.layoutSpacing(38.2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&:hover': {
            boxShadow: 'none',
            border: 'none'
        }
    },
    menu: {
        '& .MuiList-padding': {
            padding: '0 !important'
        }
    },
    menuItem: {
        paddingTop: theme.layoutSpacing(10.5),
        paddingBottom: theme.layoutSpacing(17.5),
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(13.9)}`,
        fontSize: theme.layoutSpacing(13.1),
        fontFamily: theme.body.B5.fontFamily,
        fontWeight: '400',
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        },
        '&:last-child': {
            paddingBottom: theme.layoutSpacing(10.5)
        }
    },
    icon: {
        fontSize: theme.layoutSpacing(18),
        marginLeft: theme.layoutSpacing(18)
    },
    disabled: {
        opacity: '0.6',
        cursor: 'default'
    }
}));

const UserGuide = (props) => {
    const classes = useStyles();
    const [guideList, setGuideList] = useState('');
    const [guideNames, setGuideNames] = useState([]);
    const userGudieRef = useRef();
    useEffect(() => {
        getScreenUserGuide({
            app_id: props.app_id,
            screen_id: props.screen_id,
            callback: displayNames
        });
    }, []);

    const displayNames = (response_data) => {
        if (response_data.data.length !== 0) {
            setGuideList(response_data.data);
            const names = response_data.data.map((guide) => guide.guide_name);
            setGuideNames(names);
        }
    };

    const dropdownClick = (value) => {
        const selectedGuide = guideList.filter((guide) => guide.guide_name == value);
        if (selectedGuide[0].guide_type !== 'video') {
            window.open(selectedGuide[0].guide_url, '_blank');
        } else {
            props.onData({
                autoplay: false,
                controls: true,
                responsive: true,
                fluid: true,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                sources: [{ src: selectedGuide[0].guide_url }]
            });
        }
        props.closeMoreOptions();
    };

    return (
        <div>
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        {guideNames.length == 0 ? (
                            <div
                                variant="outlined"
                                className={`${classes.guideButton} ${classes.disabled}`}
                                disabled={true}
                                aria-label="User Guide"
                            >
                                User Guide
                                <ChevronRightIcon className={classes.icon} />
                            </div>
                        ) : (
                            <React.Fragment>
                                <div
                                    variant="outlined"
                                    className={classes.guideButton}
                                    {...bindTrigger(popupState)}
                                    aria-label="User Guide"
                                    ref={userGudieRef}
                                >
                                    User Guide <ChevronRightIcon className={classes.icon} />
                                </div>
                                <Menu
                                    {...bindMenu(popupState)}
                                    anchorEl={userGudieRef.current}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    PaperProps={{
                                        style: {
                                            marginLeft: '-45px'
                                        }
                                    }}
                                    classes={{ paper: classes.menu }}
                                >
                                    {guideNames.map((option) => (
                                        <MenuItem
                                            key={option}
                                            value={option}
                                            className={classes.menuItem}
                                            onClick={() => {
                                                dropdownClick(option);
                                                popupState.close();
                                            }}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </PopupState>
        </div>
    );
};

export default UserGuide;
