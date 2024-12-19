import React, { useEffect, useRef, useState, Children } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronLeft } from '@material-ui/icons';
import HorizontalScrollNewStyle from 'assets/jss/HorizontalScrollNewStyle';
import BorderContainer from '../connectedSystemRedesign/ValueTab/BorderContainer';

const useStyles = makeStyles((theme) => ({
    ...HorizontalScrollNewStyle(theme)
}));

const HorizontalScrollNew = (props) => {
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
            setHideRightButton(childrenArray.length <= 2);
        }
        const timer = setTimeout(() => {
            if (scrollRef.current && scrollRef.current.scrollLeft == 0) {
                setHideLeftButton(true);
            }
            setNewScrollAmount();
            const scrollLeftMaxValue =
                scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth;
            setScrollLeftMax(scrollLeftMaxValue);
            const RightButton = childrenArray.length > 2 && scrollLeftMaxValue > 0;
            setHideRightButton(!RightButton);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [props.children]);

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            let scroll = 0;
            scroll = direction === 'left' ? scrollValue - scrollAmount : scrollValue + scrollAmount;
            if (scroll >= scrollLeftMax) {
                scroll = scrollLeftMax;
                setHideRightButton(true);
                setHideLeftButton(false);
            } else if (scroll <= 0) {
                scroll = 0;
                setHideLeftButton(true);
                setHideRightButton(false);
            } else if (scroll > 0 && scroll < scrollLeftMax) {
                setHideLeftButton(false);
                setHideRightButton(false);
            }
            setScrollValue(scroll);
            scrollRef.current.scrollLeft = scroll;
        }
    };
    const setNewScrollAmount = () => {
        const firstChild = scrollRef.current?.children[0];
        if (childrenArray.length && firstChild) {
            const scrollAmount = firstChild.clientWidth;
            setScrollAmount(scrollAmount);
        }
    };
    return (
        <BorderContainer classesProp={classes.container}>
            <button
                className={`${classes.scrollButton} ${
                    props.intiatives
                        ? classes.scrollRightButtonInitiatives
                        : classes.scrollRightButton
                }  ${props.disableScroll ? classes.scrollButtonDisabled : ''} ${
                    hideRightButton ? classes.disable : ''
                }`}
                onClick={() => handleScroll('right')}
                disabled={props.disableScroll}
            >
                {childrenArray.length > 3 && <ChevronLeft />}
            </button>
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

            <button
                className={`${classes.scrollButton} ${
                    props.disableScroll ? classes.scrollButtonDisabled : ''
                } ${hideLeftButton ? classes.disable : ''}`}
                onClick={() => handleScroll('left')}
                disabled={props.disableScroll}
            >
                {childrenArray.length > 3 && <ChevronLeft />}
            </button>
        </BorderContainer>
    );
};

export default HorizontalScrollNew;
