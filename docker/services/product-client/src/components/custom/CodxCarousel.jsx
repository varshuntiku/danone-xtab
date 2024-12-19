import { Box } from '@material-ui/core';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const CodxCarousel = React.forwardRef(
    (
        {
            children,
            index = 0,
            interval = 3000,
            transitionDuration = 2000,
            slide,
            direction = 'left',
            pauseOnMouseEnter,
            ...props
        },
        ref
    ) => {
        const [current, setCurrent] = useState(index);
        const directionOffset = direction === 'left' ? -1 : 1;
        const childrenLen = children.length;
        const [slideState, setSlideState] = useState(slide);

        useEffect(() => {
            let t;
            if (slideState) {
                const startSlide = () => {
                    setCurrent((current + 1) % childrenLen);
                    t = setTimeout(startSlide, interval);
                };

                t = setTimeout(() => {
                    startSlide();
                }, interval);
            }
            return () => {
                clearTimeout(t);
            };
        }, [interval, slideState, childrenLen, directionOffset, current]);

        const stopSlide = useCallback(() => {
            if (pauseOnMouseEnter) {
                setSlideState(false);
            }
        }, [pauseOnMouseEnter]);
        const startSlide = useCallback(() => {
            if (pauseOnMouseEnter) {
                setSlideState(true && slide);
            }
        }, [pauseOnMouseEnter, slide]);

        const moveRight = useCallback(() => {
            setCurrent((c) => (c + 1) % childrenLen);
        }, [childrenLen]);
        const moveLeft = useCallback(() => {
            setCurrent((c) => (c - 1 < 0 ? childrenLen - 1 : c - 1) % childrenLen);
        }, [childrenLen]);

        useImperativeHandle(ref, () => ({
            current,
            setCurrent,
            moveRight,
            moveLeft,
            setSlideState
        }));

        return (
            <Box
                overflow="hidden"
                width="100%"
                height="100%"
                onMouseEnter={stopSlide}
                onMouseLeave={startSlide}
                {...props}
            >
                <Box
                    display="flex"
                    flexDirection={props?.carouselDir == 'top' ? 'column' : 'row'}
                    style={{
                        transform: `translate${props?.carouselDir == 'top' ? 'Y' : 'X'}(${
                            100 * current * directionOffset
                        }%)`,
                        transition: `transform ${transitionDuration}ms cubic-bezier(0.15, 0.3, 0.25, 1) 0s`,
                        willChange: 'transform',
                        flexDirection:
                            props?.carouselDir != 'top'
                                ? direction === 'left'
                                    ? 'row'
                                    : 'row-reverse'
                                : ''
                    }}
                    width="100%"
                    height="100%"
                >
                    {children.map((el, i) => (
                        <Box key={i} flexShrink={0} width="100%" height="100%" overflow="auto">
                            {el}
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }
);

CodxCarousel.propTypes = {
    index: PropTypes.number,
    interval: PropTypes.number,
    transitionDuration: PropTypes.number,
    autoSlide: PropTypes.bool,
    direction: PropTypes.oneOf(['left', 'right']),
    pauseOnMouseEnter: PropTypes.bool,
    ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({
            current: PropTypes.shape({
                current: PropTypes.number,
                setCurrent: PropTypes.func,
                moveRight: PropTypes.func,
                moveLeft: PropTypes.func
            })
        })
    ])
};

CodxCarousel.displayName = 'CodxCarousel';

export default CodxCarousel;
