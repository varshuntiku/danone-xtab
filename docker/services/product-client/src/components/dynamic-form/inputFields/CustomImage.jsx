import { useRef, Fragment } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageZoomIn from 'components/ImageZoomIn';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        height: '100%',
        position: 'relative'
    }
}));

export default function CustomImage({ params }) {
    const classes = useStyles();
    const previewimageref = useRef(null);
    const imagezoominref = useRef();

    const mousemove = (e) => {
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
    return (
        <Fragment>
            <img
                src={params.src}
                alt={params.src ? params.alt : 'Image'}
                className={classes.root}
                ref={params?.enable_zoom ? previewimageref : null}
                onMouseMove={params?.enable_zoom ? mousemove : null}
                onMouseLeave={params?.enable_zoom ? mouseleave : null}
            />
            {params?.enable_zoom && (
                <ImageZoomIn
                    ref={imagezoominref}
                    params={params}
                    previewImageRef={previewimageref}
                />
            )}
        </Fragment>
    );
}
