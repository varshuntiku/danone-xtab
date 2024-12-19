import React, { useRef, useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import useLazyLoad from './useLazyLoad';
import CodxCircularLoader from '../../CodxCircularLoader';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { checkImageUri } from 'common/utils';
import videoSampleImage from 'assets/img/video_image.png';
import imageSample from 'assets/img/image_sample.png';

const useStyles = makeStyles((theme) => ({
    icon: {
        width: '3rem',
        height: '3rem',
        padding: '.5rem',
        cursor: 'pointer'
    },
    popover: {
        pointerEvents: 'none'
    },
    paper: {
        // padding: theme.spacing(1),
        maxHeight: '30vh',
        maxWidth: '15vw',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 'max-content',
        overflow: 'visible',
        background: theme.palette.background.dialogBody,
        backdropFilter: 'blur(2rem)'
    },
    metaData: {
        color: theme.palette.text.default,
        fontSize: '1.25rem'
    }
}));

const calculateDataPerPage = (params) => {
    if (params.options?.data_per_page !== undefined && params.itemData) {
        return params.options?.data_per_page || params.itemData.length;
    } else {
        const pivot = 5;
        if (params.itemData.length > pivot) {
            return 10;
        } else {
            return params.itemData.length;
        }
    }
};

/**
 * NEEDS REFACTORING FOR THE STYLES
 * ALSO MAKE SURE THIS DESCRIPTION IS FILLED CORRECTLY
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
 * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
 */
export default function CodxComponentCarousel({ inputs, setSelectedValues, ...props }) {
    //Material UI Styling
    const classes = useStyles();

    //Pagination
    const NUM_PER_PAGE = useMemo(() => {
        return calculateDataPerPage(inputs);
    }, [inputs]);

    //Lazy Loading Using useRef Hook
    const images = inputs.itemData;
    const triggerRef = useRef(null);
    const onGrabData = (currentPage) => {
        // This would be where you'll call your API
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = images.slice(
                    (currentPage - 1) * NUM_PER_PAGE,
                    NUM_PER_PAGE * currentPage
                );
                resolve(data);
            }, 100);
        });
    };
    const { data, loading } = useLazyLoad({ triggerRef, onGrabData }); //Data Which Is Lazy Loaded/Paginated Data

    //States
    const [allImages, setAllImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [length, setLength] = useState(0);
    const [maxLength, setMaxLength] = useState(0);
    const [show] = useState(inputs.options?.show || 3);
    const [selectedID, setSelectedID] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [currentDescription, setCurrentDescription] = React.useState('');
    const [direction, setDirection] = React.useState('row');
    const [dataLoadCount, setDataLoadCount] = React.useState(0);

    const setSliderMode = () => {
        let defaultSliderMode = 'row';
        if (inputs?.options?.sliderMode !== undefined) {
            if (inputs.options.sliderMode.toLowerCase().includes('vertical')) {
                defaultSliderMode = 'column';
            }
        }
        setDirection(defaultSliderMode);
    };

    const handleDefaultSelection = () => {
        if (dataLoadCount === 0) {
            setCurrentIndex(props.firstSelectedIndex * show - show);
            setSelectedID(props.selectedObjs);
        }
    };

    useEffect(() => {
        //Handling Setting Images Loaded From Lazy Loading to State
        if (data.length > 0) {
            setAllImages(data);
            const currentValuePlus = data.length * show + show - show * show;
            if (currentValuePlus === maxLength) {
                const currentValueMinus = data.length * show - show * show;
                //Handling Length By Show Value
                setLength(currentValueMinus);
                setMaxLength(currentValueMinus);
            } else {
                setLength(currentValuePlus);
            }
            //Handling Paginated Data Load Count
            handleDefaultSelection();
            setDataLoadCount((prevState) => prevState + 1);
        }
    }, [data]);

    useEffect(() => {
        const currentItemLength = inputs.itemData.length * show + show - show * show;
        //Handling Max Length By Show Value
        setMaxLength(currentItemLength);
        //Handling Slider Mode(Horizontal/Vertical)
        setSliderMode();
    }, [inputs.itemData]);

    const next = () => {
        //Show Next
        if (currentIndex < length) {
            setCurrentIndex((prevState) => prevState + show);
        }
    };

    const prev = () => {
        //Show Previous
        if (currentIndex > 0) {
            setCurrentIndex((prevState) => prevState - show);
        }
    };

    const handleOnSelect = (obj, type) => {
        let selectedData = selectedID.map((a) => {
            return { ...a };
        });
        if (type === 'single') {
            //Handling Single Select
            if (selectedData.length > 0) {
                if (selectedData[0].sku_id === obj.sku_id) {
                    selectedData.pop();
                } else {
                    selectedData.pop();
                    selectedData.push(obj);
                }
            } else {
                selectedData.push(obj);
            }
        } else if (type === 'multiple') {
            //Handling Multiple Select
            const index = selectedData.findIndex((each) => each.sku_id === obj.sku_id);
            if (index > -1) {
                selectedData.splice(index, 1);
            } else {
                selectedData.push(obj);
            }
        }
        setSelectedID(selectedData);
        setSelectedValues(selectedData);
    };

    const handlePopoverOpen = (event, description) => {
        //Handling Mouse Hover Enter On Image
        if (description) {
            setAnchorEl(event.currentTarget);
            setCurrentDescription(description);
        }
    };

    const handlePopoverClose = () => {
        //Handling Mouse Hover Leave The Image
        setAnchorEl(null);
    };

    const open = useMemo(() => {
        return Boolean(anchorEl);
    }, [anchorEl]);

    const getImage = (obj) => {
        //Handling Default Image And Video Thumbnail
        if (Object.prototype.hasOwnProperty.call(obj, 'img')) {
            if (obj.img) {
                return checkImageUri(obj.img);
            }
        }
        if (obj.contentType?.toLowerCase().includes('video'))
            return checkImageUri(videoSampleImage);
        return checkImageUri(imageSample);
    };

    return (
        <Box width="100%" display="flex" justifyContent="center" height="100%">
            <Box width="100%" display="flex" flexDirection={direction} height="100%">
                <div
                    style={{
                        height: direction.includes('row') ? '100%' : '10%',
                        width: direction.includes('row') ? '10%' : '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {currentIndex > 0 &&
                        (direction.includes('row') ? (
                            <ArrowBackIosIcon onClick={prev} className={classes.icon} />
                        ) : (
                            <KeyboardArrowUpIcon onClick={prev} className={classes.icon} />
                        ))}
                </div>
                <Box overflow="hidden" height="100%" width="inherit">
                    <Box
                        display="flex"
                        flexDirection={direction}
                        flexShrink={0}
                        style={{
                            transform: direction.includes('row')
                                ? `translateX(-${currentIndex * (100 / show)}%)`
                                : `translateY(-${currentIndex * (100 / show)}%)`,
                            transition: `transform ${1000}ms cubic-bezier(0.15, 0.3, 0.25, 1) 0s`,
                            willChange: 'transform',
                            width: direction.includes('row') ? `calc(100% / ${show})` : `100%`,
                            height: direction.includes('row') ? `100%` : `calc(100% / ${show})`
                        }}
                    >
                        {allImages.map((el, i) => (
                            <Box
                                key={'img' + el.title + i}
                                flexShrink={0}
                                width="100%"
                                height="100%"
                            >
                                <img
                                    onMouseEnter={(e) => handlePopoverOpen(e, el?.description)}
                                    onMouseLeave={handlePopoverClose}
                                    src={getImage(el)}
                                    alt={el.title}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        padding: '5px',
                                        cursor: 'pointer',
                                        border:
                                            selectedID.find((obj) => {
                                                return obj.sku_id === el.sku_id;
                                            }) !== undefined
                                                ? '3px solid #6DF0C2'
                                                : 'none'
                                    }}
                                    onClick={() =>
                                        handleOnSelect(
                                            el,
                                            inputs.options?.selection_type || 'single'
                                        )
                                    }
                                />
                                {/* Popover Start */}
                                <PopoverComponent
                                    open={open}
                                    anchorEl={anchorEl}
                                    handlePopoverClose={handlePopoverClose}
                                    currentDescription={currentDescription}
                                    classes={classes}
                                />
                                {/* Popover End */}
                            </Box>
                        ))}
                        {/* Loader With Lazy Load Start */}
                        {length !== maxLength && !loading ? (
                            <Box width="100%" height="100%" ref={triggerRef}>
                                <Box
                                    width={direction.includes('row') ? '50px' : '100%'}
                                    height={direction.includes('row') ? '100%' : '50px'}
                                    style={{ position: 'relative' }}
                                >
                                    <CodxCircularLoader size={25} center />
                                </Box>
                            </Box>
                        ) : (
                            ''
                        )}
                        {/* Loader With Lazy Load end */}
                    </Box>
                </Box>
                <div
                    style={{
                        height: direction.includes('row') ? '100%' : '10%',
                        width: direction.includes('row') ? '10%' : '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {currentIndex < maxLength &&
                        (direction.includes('row') ? (
                            <ArrowForwardIosIcon onClick={next} className={classes.icon} />
                        ) : (
                            <KeyboardArrowDownIcon onClick={next} className={classes.icon} />
                        ))}
                </div>
            </Box>
        </Box>
    );
}

const PopoverComponent = ({ open, anchorEl, handlePopoverClose, currentDescription, classes }) => {
    return (
        <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
                paper: classes.paper
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <Box style={{ whiteSpace: 'pre-line' }}>
                <Typography className={classes.metaData}>{currentDescription}</Typography>
            </Box>
        </Popover>
    );
};
