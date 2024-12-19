import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto'
    },
    carouselContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '50rem', // 3 images (15rem each) + 1rem gap * 2
        overflow: 'hidden'
    },
    carousel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        transition: 'transform 0.5s ease-in-out'
    },
    image: {
        width: '20rem',
        height: '15rem',
        marginBottom: theme.spacing(1),
        objectFit: 'cover'
    },
    selected: {
        width: '20rem',
        height: '15rem',
        marginBottom: theme.spacing(1),
        objectFit: 'cover',
        border: '2px solid ' + theme.palette.text.contrastText,
        padding: '3px',
        borderRadius: '3px'
    },
    iconButton: {
        padding: 0,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    icon: {
        width: '5rem',
        height: '5rem'
    }
}));

const VerticalCarousel = ({ images, setSelectedImage, selectedImage }) => {
    const classes = useStyles();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleUpClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleDownClick = () => {
        if (currentIndex < images.length - 3) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className={classes.root}>
            <IconButton
                className={classes.iconButton}
                onClick={handleUpClick}
                disabled={currentIndex === 0}
            >
                <ExpandLessIcon className={classes.icon} />
            </IconButton>
            <div className={classes.carouselContainer}>
                <div
                    className={classes.carousel}
                    style={{ transform: `translateY(-${currentIndex * 16}rem)` }} // Adjust translate based on image height plus margin
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`carousel-${index}`}
                            className={index == selectedImage ? classes.selected : classes.image}
                            onClick={() => {
                                setSelectedImage(index);
                            }}
                        />
                    ))}
                </div>
            </div>
            <IconButton
                className={classes.iconButton}
                onClick={handleDownClick}
                disabled={currentIndex === images.length - 3}
            >
                <ExpandMoreIcon className={classes.icon} />
            </IconButton>
        </div>
    );
};

export default VerticalCarousel;
