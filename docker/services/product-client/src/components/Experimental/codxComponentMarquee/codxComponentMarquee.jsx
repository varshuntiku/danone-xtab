import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Marquee from 'react-fast-marquee';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PopupForm from '../../screenActionsComponent/actionComponents/PopupForm';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        color: theme.palette.text.default,
        backgroundColor: theme.palette.background.paper
    },
    icon: {
        width: '4rem',
        color: 'white',
        height: '4rem',
        padding: '.5rem',
        cursor: 'pointer',
        border: '1px solid #0C2744',
        borderRadius: '4px',
        backgroundColor: '#0C2744'
    },
    marqueeHeader: {
        height: '80%',
        width: '10%',
        // color: 'white',
        fontSize: '3rem',
        borderRight: '1px solid white',
        opacity: '0.4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marqueeMain: {
        height: '100%',
        width: '90%',
        display: 'flex',
        alignItems: 'center'
        // paddingLeft: '5%'
    },
    marqueeContainer: {
        height: '100%',
        width: '95%',
        display: 'flex',
        justifyContent: 'center'
        // alignItems: 'center'
    },
    playPauseButtonContainer: {
        height: '100%',
        width: '5%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    marqueeInfoCardContainer: {
        // color: 'white',
        fontSize: '12px',
        lineHeight: '14px',
        width: '13vw',
        maxWidth: '13vw',
        height: '8vh',
        maxHeight: '8vh',
        padding: '0px 10px',
        textOverflow: 'ellipsis'
    }
}));

/**
 * NEEDS REFACTORING FOR THE STYLES
 * ALSO MAKE SURE THIS DESCRIPTION IS FILLED CORRECTLY
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
export default function CodxComponentMarquee({ params, ...props }) {
    //Material UI Styling
    const classes = useStyles(params);

    //States
    const [isPlaying, setIsPlaying] = useState(true);

    const handlePlayPauseButton = (value) => {
        setIsPlaying(value);
    };

    return (
        <Grid container className={classes.root}>
            <Box className={classes.marqueeHeader}>
                <p
                    style={{
                        color: params.inputs.title_color,
                        fontSize: '2.2rem',
                        fontWeight: 500
                    }}
                >
                    {params.inputs.title}
                </p>
            </Box>
            <Box className={classes.marqueeMain}>
                <Box className={classes.marqueeContainer}>
                    <Marquee
                        play={isPlaying}
                        direction={params.inputs.direction || 'left'}
                        speed={params.inputs.speed || 50}
                        pauseOnHover={params.inputs.pauseOnHover || false}
                    >
                        {params.inputs.itemData.map((el, i) => (
                            <MarqueeCardComponent
                                key={'item' + el.id + i}
                                data={el}
                                classes={classes}
                                handlePlayPauseButton={handlePlayPauseButton}
                                {...props}
                            />
                        ))}
                    </Marquee>
                </Box>
                <Box className={classes.playPauseButtonContainer}>
                    {isPlaying ? (
                        <PauseIcon
                            onClick={() => handlePlayPauseButton(false)}
                            className={classes.icon}
                        />
                    ) : (
                        <PlayArrowIcon
                            onClick={() => handlePlayPauseButton(true)}
                            className={classes.icon}
                        />
                    )}
                </Box>
            </Box>
        </Grid>
    );
}

const MarqueeCardComponent = ({ data, classes, ...props }) => {
    //States
    const [isOpen, setIsOpen] = useState(false);

    const handleIsOpen = (value) => {
        setIsOpen(value);
        if (data.popup_details) {
            if (value === true) {
                props.handlePlayPauseButton(false);
            } else {
                props.handlePlayPauseButton(true);
            }
        }
    };

    return (
        <React.Fragment>
            <Box
                className={classes.marqueeInfoCardContainer}
                style={{ cursor: data.popup_details ? 'pointer' : '' }}
                onClick={() => {
                    handleIsOpen(true);
                }}
            >
                <Typography
                    style={{
                        fontSize: '1.5rem',
                        color: data.value_color,
                        paddingBottom: '0.2rem'
                    }}
                >
                    {data.value}
                </Typography>
                <Box display="flex">
                    <Typography
                        style={{
                            fontSize: '1.6rem',
                            color: data.sub_value_color,
                            fontWeight: 700
                        }}
                    >
                        {data.sub_value}
                    </Typography>
                    {data.direction !== undefined && (
                        <Box>
                            {data.direction === 'up' ? (
                                <KeyboardArrowUpIcon
                                    style={{ fontSize: '2.5rem', color: data.direction_color }}
                                />
                            ) : (
                                <KeyboardArrowDownIcon
                                    style={{ fontSize: '2.5rem', color: data.direction_color }}
                                />
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
            {isOpen && data.popup_details && (
                <PopupForm
                    key={'popup_form'}
                    screen_id={props.screen_id}
                    app_id={props.app_id}
                    action_type={'check'}
                    params={data.popup_details || ''}
                    isOutSideTrigger={true}
                    handleIsOpen={handleIsOpen}
                />
            )}
        </React.Fragment>
    );
};
