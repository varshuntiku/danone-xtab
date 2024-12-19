import React from 'react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import clsx from 'clsx';
import useLazyLoad from './useLazyLoad';
import CodxCircularLoader from '../../CodxCircularLoader';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    horizontalSlider: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)'
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' +
            'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)'
    }
}));

const calculateDataPerPage = (params) => {
    if (params.layouts?.data_per_page !== undefined && params.itemData) {
        return params.layouts?.data_per_page || params.itemData.length;
    } else {
        const pivot = 5;
        if (params.itemData.length > pivot) {
            return 10;
        } else {
            return params.itemData.length;
        }
    }
};

export default function ImageGallary({ params }) {
    //Material UI Styling
    const classes = useStyles();

    //Pagination
    const NUM_PER_PAGE = useMemo(() => {
        return calculateDataPerPage(params);
    }, [params]);

    //Lazy Loading Using useRef Hook
    const images = params.itemData;
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
            }, 500);
        });
    };
    const { data, loading } = useLazyLoad({ triggerRef, onGrabData }); //Data Which Is Lazy Loaded/Paginated Data

    //States
    const [allImages, setAllImages] = useState(data);

    useEffect(() => {
        //Handling Setting Images Loaded From Lazy Loading to State
        if (data.length > 0) {
            const newData = data.map(function (image) {
                if ('id' in image) {
                    image.is_checked = false;
                    return image;
                } else {
                    image.id = Math.random().toString(16).slice(2);
                    image.us_checked = false;
                    return image;
                }
            });
            setAllImages(newData);
        }
    }, [data]);

    const handleSelect = (id) => {
        let images = allImages;
        let newImages = [];
        images.map((element) => {
            if (element.id === id) {
                var updated_element = {
                    ...element,
                    is_checked: !element.is_checked
                };
                newImages.push(updated_element);
            } else {
                newImages.push(element);
            }
        });
        setAllImages(newImages);
    };

    return (
        <div className={classes.root}>
            <ImageList
                className={{
                    [classes.horizontalSlider]: params.layouts?.view === 'horizontal'
                }}
                rowHeight={params.layouts?.rowHeight || 160}
                cols={params.layouts?.totalCols || 1}
                gap={5}
            >
                {allImages.map((item) => (
                    <ImageListItem
                        key={item.id}
                        cols={item.style?.width ? item.style.width : 1}
                        rows={item.style?.height ? item.style.width : 1}
                        onClick={() => handleSelect(item.id)}
                    >
                        {/* Image Start */}
                        <img
                            src={item.img}
                            alt={item.title}
                            style={{ border: item.is_checked ? '3px solid #D6F0C2' : 'none' }}
                        />
                        {/* Image End */}
                        {/* Image Title Start */}
                        <ImageListItemBar
                            title={params.layouts?.title && (item.title || '')}
                            position="top"
                            actionIcon={
                                item.is_checked && (
                                    <IconButton>
                                        <CheckCircleIcon />
                                    </IconButton>
                                )
                            }
                            actionPosition="left"
                            className={classes.titleBar}
                        />
                        {/* Image Title End */}
                    </ImageListItem>
                ))}
                {/* Loader For Horizontal View Start */}
                {params.layouts?.view === 'horizontal' &&
                    params.itemData.length !== data.length && (
                        <div
                            ref={triggerRef}
                            style={{
                                position: 'relative',
                                height: '100%',
                                width: '100%',
                                paddingLeft: '5vw'
                            }}
                            className={clsx('trigger', { visible: loading })}
                        >
                            {allImages.length > 0 && <CodxCircularLoader size={60} center />}
                        </div>
                    )}
                {/* Loader For Horizontal View End */}
            </ImageList>
            {/* Loader For Vertical View Start */}
            {params.layouts?.view === 'vertical' && params.itemData.length !== data.length && (
                <div
                    ref={triggerRef}
                    style={{
                        position: 'relative',
                        height: '8vh',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    className={clsx('trigger', { visible: loading })}
                >
                    {allImages.length > 0 && <CodxCircularLoader size={60} center />}
                </div>
            )}
            {/* Loader For Vertical View End */}
        </div>
    );
}

/*
- JSON Structure to load the component
- Also, available configurations
    - Component loads list of images
    - Uses Lazy Load to load images in parts. Configuration for data per load.
    - Vertical and Horizontal view.
    - For Vertical, colums are configurable like 3 images in each row.
    - Image sizes and styling for sizes can be configurable based on grid design which cols and rows.
    - Multiselect checkboxes
    - Submit button
    - Set Title ON/OFF
{
  itemData: [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
        style: {
          height: 2,
          width: 3,
        },
    },
    {
      img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      title: "Basketball",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      title: "Tomato basil",
      style: {
        height: 2,
        width: 3,
      },
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ],

  layouts: {
    totalCols: 3, //Columns per row
    view: "vertical", //vertical and horizontal view
    title: true, //Title to show
    data_per_page: 6, //Load data per page(Pagination and Lazy Load)
  },
};
*/
