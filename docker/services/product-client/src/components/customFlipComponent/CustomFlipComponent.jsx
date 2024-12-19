import { makeStyles } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
    initialFlip: {
        transform: 'rotateY(360deg)'
    },
    root: {
        width: '100%',
        height: '100%'
    },
    wrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transitionDuration: '0.5s',
        transformStyle: 'preserve-3d',
        transitionTimingFunction: 'ease-out'
    },
    flip: {
        transform: 'rotateY(180deg)'
    },
    back: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: 'rotateY(180deg)'
        // transformStyle: "preserve-3d"
    },
    backTwo: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: 'rotateY(360deg)'
    },
    front: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    inActive: {
        pointerEvents: 'none !important',
        zIndex: -1,
        animation: '$hidden 0.25s linear',
        animationFillMode: 'forwards',
        '& *': {
            pointerEvents: 'none !important'
        }
    },
    '@keyframes hidden': {
        '0%': { visibility: 'visible' },
        '100%': { visibility: 'hidden' }
    }
}));

/**
 * Renders a customized flip component
 * @summary Renders a component with 2 views, front and back view which can viewed by flipping the component
 * @param {object} props - ref, frontComp, backComp
 */
const CustomFlipComponent = React.forwardRef(
    ({ frontComp, backComp, elivated, enableIntialFlipAnimation, widgetData }, ref) => {
        const isHoverLabel = widgetData?.back?.data?.value?.layout?.hoverlabel;
        const classes = useStyles();
        const [flipState, setFlipState] = React.useState(false);
        const [startAnimation, setStartAnimaton] = React.useState(false);

        React.useEffect(() => {
            setTimeout(() => {
                setStartAnimaton(enableIntialFlipAnimation);
            }, 1000);
        }, [enableIntialFlipAnimation]);

        const flip = React.useCallback(() => {
            setFlipState((f) => !f);
        }, []);
        React.useImperativeHandle(
            ref,
            () => ({
                flip,
                flipState,
                setFlipState
            }),
            [flip, flipState, setFlipState]
        );

        return (
            <div className={clsx({ 'custom-flip-root': true, [classes.root]: true })}>
                <div
                    className={clsx({
                        'custom-flip-wrapper': true,
                        [classes.wrapper]: true,
                        [classes.flip]: flipState && !isHoverLabel,
                        [classes.elivated]: elivated,
                        [classes.initialFlip]: startAnimation
                    })}
                >
                    <div
                        className={clsx({
                            'custom-flip-back': true,
                            [!isHoverLabel ? classes.back : classes.backTwo]: true,
                            [classes.inActive]: !flipState
                        })}
                    >
                        {backComp}
                    </div>
                    <div
                        className={clsx({
                            'custom-flip-front': true,
                            [classes.front]: true,
                            [classes.inActive]: flipState
                        })}
                    >
                        {frontComp}
                    </div>
                </div>
            </div>
        );
    }
);

CustomFlipComponent.displayName = 'CustomFlipComponent';

export default CustomFlipComponent;
