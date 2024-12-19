import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%'
    },
    magnifylens: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '20%',
        height: '17%',
        backgroundColor: '#00008b30',
        border: '.1px solid #00008b',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '9999'
    },
    popover: {
        pointerEvents: 'none'
    },
    paper: {
        padding: theme.spacing(1),
        width: (params) => params.zoom_popup_width || '25vw',
        height: (params) => params.zoom_popup_height || '32vh'
    },
    magnifiedImage: {
        position: 'absolute',
        width: (params) => params.zoom_popup_width || '25vw',
        height: (params) => params.zoom_popup_height || '32vh',
        left: '0',
        top: '0',
        opacity: '0',
        pointerEvents: 'none'
    }
}));

// eslint-disable-next-line react/display-name
const ImageZoomIn = forwardRef((props, ref) => {
    const { params, previewImageRef } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const magnifiedImageRef = useRef(null);

    const handlePopoverOpen = (e) => {
        if (params.enable_zoom) {
            const imagePreview = previewImageRef.current;
            let magnifylens = document.getElementById('img-magnifier');
            if (!magnifylens) {
                magnifylens = document.createElement('div');
                magnifylens.classList = [classes.magnifylens];
                magnifylens.setAttribute('id', 'img-magnifier');
                magnifylens.setAttribute('data-testid', 'magnify-lens');
                document.body.appendChild(magnifylens);
            }
            const magnifyImage = magnifiedImageRef.current;
            const rectImage = imagePreview.getBoundingClientRect();
            let x = e.clientX - magnifylens.offsetWidth / 2;
            let y = e.clientY - magnifylens.offsetHeight / 2;
            let maxX = rectImage.x + rectImage.width - magnifylens.offsetWidth;
            let maxY = rectImage.y + rectImage.height - magnifylens.offsetHeight;
            let minX = rectImage.x;
            let minY = rectImage.y;
            ///limiting the lens position
            if (x > maxX) x = maxX;
            if (x < minX) x = minX;
            if (y > maxY) y = maxY;
            if (y < minY) y = minY;
            magnifylens
                ? (magnifylens.style.cssText = `top:${y}px; left:${x}px; opacity:1; `)
                : null;
            let cx = magnifyImage?.offsetWidth / magnifylens?.offsetWidth;
            let cy = magnifyImage?.offsetHeight / magnifylens?.offsetHeight;
            //Setting the magnified image x and y
            let xd = e.pageX - rectImage.left - magnifylens?.offsetWidth / 2;
            let yd = e.pageY - rectImage.top - magnifylens?.offsetHeight / 2;
            magnifyImage
                ? (magnifyImage.style.cssText = `background:url('${
                      previewImageRef.current?.src
                  }')-${xd * cx}px -${yd * cy}px / ${rectImage.width * cx}px ${
                      rectImage.height * cy
                  }px no-repeat; opacity:1;`)
                : null;
            setAnchorEl(true);
            let magnifieddiv = document.getElementById('magnifiedimage');
            let backgroundimage = '';
            magnifieddiv
                ? (backgroundimage = window.getComputedStyle(magnifieddiv).backgroundImage)
                : null;
            if (magnifieddiv) {
                if (backgroundimage === 'none') {
                    setAnchorEl(null);
                    magnifylens ? (magnifylens.style.opacity = '0') : null;
                } else {
                    setAnchorEl(true);
                }
            }
        }
    };
    const handlePopoverClose = () => {
        const magnifylens = document.getElementById('img-magnifier');
        const magnifyImage = magnifiedImageRef.current;
        magnifyImage ? (magnifyImage.style.opacity = '0') : null;
        magnifylens ? (magnifylens.style.opacity = '0') : null;
        if (magnifylens) {
            magnifylens.remove();
        }
        setAnchorEl(null);
    };
    useImperativeHandle(ref, () => ({
        handlePopoverOpen,
        handlePopoverClose
    }));
    const verticalPosition =
        params.zoom_vertical_position == 'bottom'
            ? { anchor: 'bottom', transform: 'top' }
            : { anchor: 'top', transform: 'bottom' };
    const horizontalPosition =
        params.zoom_horizontal_position == 'right'
            ? { anchor: 'right', transform: 'left' }
            : { anchor: 'left', transform: 'right' };

    const classes = useStyles(params);
    return (
        <>
            {params.enable_zoom ? (
                <Popover
                    style={{ zIndex: '13000' }}
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                        paper: classes.paper
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: verticalPosition.anchor,
                        horizontal: horizontalPosition.anchor
                    }}
                    transformOrigin={{
                        vertical: verticalPosition.transform,
                        horizontal: horizontalPosition.transform
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                    data-testid="mouse-over-popover"
                >
                    <div
                        className={classes.magnifiedImage}
                        ref={magnifiedImageRef}
                        id="magnifiedimage"
                        data-testid="magnified-image"
                    ></div>
                </Popover>
            ) : null}
        </>
    );
});

export default ImageZoomIn;
