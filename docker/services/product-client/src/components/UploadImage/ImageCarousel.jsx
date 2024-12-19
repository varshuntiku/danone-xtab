import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    carousel: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        margin: 'auto',
        borderBottom: `1px solid ${theme.palette.text.default}80`
    },
    carouselOutput: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        margin: 'auto'
    },
    carouselInner: {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        height: 'auto',
        width: '100%',
        transform: `var(--translate)`
    },

    carouselItem: {
        minWidth: '100%',
        height: '100%',
        '& img': {
            width: '100%',
            objectFit: 'contain'
        },
        borderRadius: '2px'
    },
    imageContainer: {
        display: 'flex',
        gap: '2rem',
        marginTop: '2rem'
    },
    parentImage: {
        width: 'auto',
        height: '10rem',
        cursor: 'pointer',
        borderRadius: '2px'
    },
    parentImageSelected: {
        width: 'auto',
        height: '10rem',
        cursor: 'pointer',
        borderRadius: '2px',
        border: `2px solid blue`
    }
}));
const Carousel = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const classes = useStyles();
    const images = props.images;
    const outputCarousel = props?.output || false;
    const handleCarouselImageClick = (index) => {
        setCurrentIndex(index);
        props.setIndex(index);
    };
    return (
        <div className={outputCarousel ? classes.carouselOutput : classes.carousel}>
            <div
                className={classes.carouselInner}
                style={{ '--translate': `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div className={classes.carouselItem} key={index}>
                        <img
                            src={props?.base64 ? `data:image/jpg;base64,${image}` : image}
                            alt={`Slide ${index}`}
                        />
                    </div>
                ))}
            </div>
            <div className={classes.imageContainer}>
                {images.map((val, index) => (
                    <img
                        onClick={() => handleCarouselImageClick(index)}
                        src={props?.base64 ? `data:image/jpg;base64,${val}` : val}
                        key={`image${index}`}
                        className={
                            props?.index == index
                                ? classes.parentImageSelected
                                : classes.parentImage
                        }
                    />
                ))}
            </div>
        </div>
    );
};

const ImageCarousel = (props) => {
    return <Carousel {...props} />;
};

export default ImageCarousel;
