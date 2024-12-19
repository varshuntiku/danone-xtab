import React, { useEffect, useRef, useState, Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronLeft } from '@material-ui/icons';
import horizontalScrollStyle from 'assets/jss/horizontalScrollStyle';

const useStyles = makeStyles((theme) => ({
    ...horizontalScrollStyle(theme)
}));

const HorizontalScroll = (props) => {
    const classes = useStyles();
    const [scrollAmount, setScrollAmount] = useState(200);
    const [scrollValue, setScrollValue] = useState(0);
    const [hideLeftButton, setHideLeftButton] = useState(true);
    const [hideRightButton, setHideRightButton] = useState(true);
    const [scrollLeftMax, setScrollLeftMax] = useState(0);

    const childrenArray = Children.toArray(props.children);

    const scrollRef = useRef();
    useEffect(() => {
        if (props?.scrollPopUp) {
            scrollRef.current.scrollLeft = 0;
            setScrollValue(0);
            childrenArray.length <= 2 ? setHideRightButton(true) : setHideRightButton(false);
        }
        const timer = setTimeout(() => {
            if (scrollRef.current && scrollRef.current.scrollLeft == 0) {
                setHideLeftButton(true);
            }
            if (props.scrollAmount) {
                setScrollAmount(props.scrollAmount);
            } else {
                setNewScrollAmount();
            }
            setScrollLeftMax(scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth);
            if (
                childrenArray.length > 2 &&
                scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth > 0
            ) {
                setHideRightButton(false);
            }
            if (
                childrenArray.length &&
                scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth == 0
            ) {
                setHideRightButton(true);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [props.children]);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            let scroll = 0;
            if (direction === 'left') {
                scroll = scrollValue - scrollAmount;
            } else {
                scroll = scrollValue + scrollAmount;
            }
            if (scroll >= scrollLeftMax) {
                scroll = scrollLeftMax;
                setHideRightButton(true);
                setHideLeftButton(false);
            }
            if (scroll <= 0) {
                scroll = 0;
                setHideLeftButton(true);
                setHideRightButton(false);
            }
            if (scroll > 0 && scroll < scrollLeftMax) {
                setHideLeftButton(false);
                setHideRightButton(false);
            }
            setScrollValue(scroll);
            scrollRef.current.scrollLeft = scroll;
        }
    };
    const setNewScrollAmount = () => {
        if (childrenArray.length && scrollRef.current) {
            if (scrollRef.current.children[0] !== undefined) {
                let scrollAmount = scrollRef.current.children[0].clientWidth;
                setScrollAmount(scrollAmount);
            }
        }
    };
    return (
        <div className={classes.container}>
            {!hideRightButton && (
                <button
                    className={`${classes.scrollButton} ${
                        props.intiatives
                            ? classes.scrollRightButtonInitiatives
                            : classes.scrollRightButton
                    }  ${props.disableScroll ? classes.scrollButtonDisabled : ''}`}
                    onClick={() => handleScroll('right')}
                    disabled={props.disableScroll}
                >
                    <ChevronLeft />
                </button>
            )}
            <div ref={scrollRef} className={classes.scrollContainer}>
                {Children.map(childrenArray, (item, index) => {
                    const extraClass = item.props.extraClass || '';
                    return (
                        <div
                            className={`${classes.cardContainer} ${extraClass}`}
                            key={`childeren ${index}`}
                        >
                            {item}
                        </div>
                    );
                })}
            </div>
            {!hideLeftButton && (
                <button
                    className={`${classes.scrollButton} ${
                        props.disableScroll ? classes.scrollButtonDisabled : ''
                    }`}
                    onClick={() => handleScroll('left')}
                    disabled={props.disableScroll}
                >
                    <ChevronLeft />
                </button>
            )}
        </div>
    );
};

export default HorizontalScroll;
