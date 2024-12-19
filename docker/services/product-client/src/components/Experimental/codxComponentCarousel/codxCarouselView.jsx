import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, alpha } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { checkImageUri } from 'common/utils';
import CodxComponentCarousel from './codxComponentCarousel';
import CodxCircularLoader from '../../CodxCircularLoader';
const VideoJS = lazy(() => import('components/videojsStreamer.jsx'));
import ImageZoomIn from 'components/ImageZoomIn';
import StopIcon from '@material-ui/icons/Stop';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper
    },
    carouselBtn: {
        '& svg': {
            fontSize: '5rem',
            color: alpha(grey[400], 0.4)
        }
    },
    formControl: {
        width: '50%',
        marginLeft: '1rem',
        '& label.Mui-focused': {
            color: theme.palette.text.default,
            fontSize: '2rem'
        },
        '& label': {
            fontSize: '1.5rem',
            color: theme.palette.text.default
        },
        '& .MuiSvgIcon-root': {
            fontSize: '25px',
            color: theme.palette.text.titleText
        },
        marginBottom: '1rem'
    },
    selectEmpty: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        borderBottom: '2px solid ' + theme.palette.text.default
    },
    previewImage: {
        borderColor: theme.palette.primary.contrastText + 'cc',
        marginBottom: '2rem'
    },
    paper: {
        padding: theme.spacing(1),
        width: (params) => params.zoom_popup_width || '25vw',
        height: (params) => params.zoom_popup_height || '32vh'
    },
    gridContainer: {
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContianer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        '& svg': {
            cursor: 'pointer',
            fontSize: theme.layoutSpacing(22)
        }
    },
    StopIcon: {
        '& svg': {
            cursor: 'pointer',
            fontSize: theme.layoutSpacing(26)
        }
    },
    lastSynchedTime: {
        position: 'absolute',
        left: 0,
        top: -2,
        opacity: '0.5'
    }
}));

/**
 * NEEDS REFACTORING FOR THE STYLES
 * ALSO MAKE SURE THIS DESCRIPTION IS FILLED CORRECTLY
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
export default function CodxCarouselView({
    params,
    onEventTrigger,
    onIntialEventTrigger,
    handleImageCompAction
}) {
    //Material UI Styling
    const classes = useStyles(params);
    //States
    const [selectedObjs, setSelectedObjs] = useState([]);
    const [selectionTimer, setSelectionTimer] = useState(0);
    const [direction, setDirection] = useState('column');
    const [firstSelectedIndex, setFirstSelectedIndex] = useState(0); //Considering first element
    const [lastCallTime, setLastCallTime] = useState(new Date().toLocaleTimeString());
    const imagepreviewref = useRef(null);
    const imagezoominref = useRef(null);
    // const apiCallCount = useRef(0)
    const [startTrigger, setStartTrigger] = useState(false);

    const renderCurrentSelection = (element) => {
        let contentType = element.contentType !== undefined ? element.contentType : 'image';
        //Conditionally Rendering Component
        switch (contentType) {
            case 'image':
                return <ImageComponent element={element} />;
            case 'video':
                return <VideoComponent element={element} />;
            default:
                return null;
        }
    };

    const setSelectedValues = (objs) => {
        setSelectedObjs(objs);
        if (selectionTimer) {
            clearTimeout(selectionTimer);
        }
        setSelectionTimer(
            setTimeout(() => {
                onEventTrigger(objs); //Callback To Provide Selected Data To Parent Component
            }, params.inputs.options?.interval || 2000)
        );
    };
    const handleDropDown = (option) => {
        onEventTrigger(option);
    };

    const getValueByComponent = (optionType, columnDefault, rowDefault) => {
        if (!params.inputs?.options[optionType]) {
            if (direction.includes('column')) {
                return columnDefault;
            }
            return rowDefault;
        }
        return params.inputs.options[optionType];
    };

    const getHeight = (componentType) => {
        if (componentType.includes('selectOptions')) {
            return getValueByComponent('selectOptionsHeight', '10%', '20%');
        } else if (componentType.includes('viewer')) {
            return getValueByComponent('viewerHeight', '70%', '90%');
        } else if (componentType.includes('slider')) {
            return getValueByComponent('sliderHeight', '15%', '40%');
        }
    };

    const getWidth = (componentType) => {
        if (componentType.includes('selectOptions')) {
            return getValueByComponent('selectOptionsWidth', '100%', '10%');
        } else if (componentType.includes('viewer')) {
            return getValueByComponent('viewerWidth', '100%', '30%');
        } else if (componentType.includes('slider')) {
            return getValueByComponent('sliderWidth', '100%', '60%');
        }
    };

    const handleDefaultSelection = () => {
        if (params.inputs?.itemData.length > 0) {
            //Handling Default Selected Items
            let defaultSelected = params.inputs.itemData.filter((x) => x.selected === 1);
            //Getting First Selected Index
            if (defaultSelected.length > 0) {
                setSelectedObjs(defaultSelected);
                onIntialEventTrigger
                    ? onIntialEventTrigger(defaultSelected)
                    : onEventTrigger(defaultSelected); //Callback To Provide Selected Data To Parent Component
                let firstIndex = params.inputs.itemData.findIndex(
                    (each) => each.sku_id === defaultSelected[0].sku_id
                );
                setFirstSelectedIndex(firstIndex);
            } else {
                //Default 1st Item Selected
                setSelectedObjs([params.inputs?.itemData[0]]);
                onIntialEventTrigger
                    ? onIntialEventTrigger([params.inputs?.itemData[0]])
                    : onEventTrigger([params.inputs?.itemData[0]]); //Callback To Provide Selected Data To Parent Component
            }
        }
    };
    const VideoComponent = ({ element }) => {
        const getVideoData = () => {
            return {
                width: element.width !== undefined ? element.width : '200px',
                height: element.height !== undefined ? element.height : '200px',
                autoplay: element.autoplay !== undefined ? element.autoplay : false,
                controls: element.controls !== undefined ? element.controls : true,
                responsive: true,
                preload: true,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                sources: [
                    {
                        src: element.video
                    }
                ]
            };
        };
        return (
            <Suspense fallback={<CodxCircularLoader center size={60} />}>
                <VideoJS options={getVideoData()} />
            </Suspense>
        );
    };
    const ImageComponent = ({ element }) => {
        return (
            <React.Fragment style={{ position: 'relative' }}>
                <img
                    src={checkImageUri(element.img)}
                    alt={element.title}
                    style={{
                        height: element?.height !== undefined ? element.height : '100%',
                        width: element?.width !== undefined ? element.width : '100%',
                        position: 'relative'
                    }}
                    ref={imagepreviewref}
                    onMouseMove={mousemove}
                    onMouseLeave={mouseleave}
                />
            </React.Fragment>
        );
    };

    const mousemove = (e) => {
        imagepreviewref.current = e.target;
        if (params?.enable_zoom) {
            if (imagezoominref.current) {
                imagezoominref.current.handlePopoverOpen(e);
            }
        }
    };
    const mouseleave = (e) => {
        if (imagezoominref.current) {
            imagezoominref.current.handlePopoverClose(e);
        }
    };
    useEffect(() => {
        //Handling Component Direction By UIaC Input
        if (params.inputs?.options?.direction !== undefined) {
            setDirection(params.inputs.options.direction);
        }
        //Handling Default Selected Items
        handleDefaultSelection();
    }, [params.inputs]);

    useEffect(() => {
        if (!startTrigger) return;
        const intervalId = setInterval(
            () => {
                // apiCallCount.current += 1
                // if (apiCallCount.current > 4) {
                //     clearInterval(intervalId);
                // }
                setLastCallTime(new Date().toLocaleTimeString());
                handleImageCompAction(params);
            },
            params.interval * 1000 || 30000
        );
        return () => clearInterval(intervalId);
    }, [startTrigger]);

    return (
        <Box height="100%" width="100%" position="relative">
            {params.inputs.selectOptions && (
                <Box width="100%" height="10%" style={{ marginBottom: '3%' }}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="image-options">Select</InputLabel>
                        <Select
                            labelId="image-options"
                            id="image-options"
                            className={classes.selectEmpty}
                            onChange={(e) => handleDropDown(e.target.value)}
                            label="Age"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {params.inputs.selectOptions.map((el, i) => (
                                <MenuItem key={'selectOptions' + i} value={el}>
                                    {el.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}
            <Box
                className={classes.gridContainer}
                flexDirection={direction}
                height={params.inputs.selectOptions ? '87%' : '95%'}
            >
                <Box
                    className={classes.previewImage}
                    overflow="hidden"
                    width={getWidth('viewer')}
                    display="flex"
                    height={getHeight('viewer')}
                    justifyContent="center"
                    position="relative"
                >
                    <ImageList
                        cols={1}
                        gap={5}
                        style={{
                            height: params.inputs?.options?.selectedItemHeight
                                ? params.inputs?.options?.selectedItemHeight
                                : 'auto',
                            width: params.inputs?.options?.selectedItemWidth
                                ? params.inputs?.options?.selectedItemWidth
                                : 'auto',
                            display: 'inline',
                            position: 'relative'
                        }}
                    >
                        {selectedObjs.map((item) => (
                            <ImageListItem
                                key={item.sku_id}
                                style={{
                                    height: item?.height !== undefined ? item.height : '100%',
                                    width: item?.width !== undefined ? item.width : '100%',
                                    // marginLeft: 'auto',
                                    // marginRight: 'auto',
                                    position: 'relative'
                                }}
                            >
                                {/* Conditional Component Start */}
                                {renderCurrentSelection(item)}
                                {/* Conditional Component End */}
                            </ImageListItem>
                        ))}
                    </ImageList>
                    {params?.enable_zoom && (
                        <ImageZoomIn
                            ref={imagezoominref}
                            params={params}
                            previewImageRef={imagepreviewref}
                        />
                    )}
                </Box>
                <Box
                    width={getWidth('slider')}
                    display="flex"
                    flexDirection="column"
                    height={getHeight('slider')}
                    alignItems="center"
                    justify="center"
                    margin="auto"
                >
                    {params?.custom_trigger ? (
                        <Box className={classes.btnContianer}>
                            <div onClick={() => setStartTrigger(true)}>
                                <PlayCircleFilledWhiteIcon fontSize="medium" />
                            </div>
                            <div
                                onClick={() => setStartTrigger(false)}
                                className={classes.StopIcon}
                            >
                                <StopIcon fontSize="large" color="secondary" />
                            </div>
                        </Box>
                    ) : null}
                    {params?.inputs?.options?.slider === false ? null : (
                        <CodxComponentCarousel
                            inputs={params.inputs}
                            setSelectedValues={setSelectedValues}
                            selectedObjs={selectedObjs}
                            firstSelectedIndex={firstSelectedIndex}
                        />
                    )}
                </Box>
            </Box>
            {params?.custom_trigger ? (
                <Box className={classes.lastSynchedTime}>
                    <Typography variant="h4">last synced at {lastCallTime} </Typography>
                </Box>
            ) : null}
        </Box>
    );
}
