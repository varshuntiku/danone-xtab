import React, { useState } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { ReactComponent as OpenLink } from '../../../assets/img/OpenLink.svg';
import { ReactComponent as ExpansionIcon } from '../../../assets/img/ExpansionIcon.svg';
import VerticalCarousel from './VerticalCarousel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Rating from './Rating';
import sanitizeHtml from 'sanitize-html-react';

const useStyles = makeStyles((theme) => ({
    productContainer: {
        padding: '2rem',
        background: 'white',
        position: 'relative',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        width: '140rem',
        height: '73rem',
        border: `1px solid ${theme.palette.border.productBorder}`,
        cursor: 'default'
    },
    backButton: {
        position: 'absolute',
        top: '2rem',
        right: '1rem',
        padding: '0.5rem',
        '& svg': {
            width: '3rem',
            height: '3rem'
        }
    },
    shoeNameMain: {
        fontSize: '2.2rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        position: 'absolute',
        fontWeight: 500,
        top: 20,
        left: '8rem'
    },
    productRow: {
        margin: '0.5rem',
        display: 'flex',
        alignItems: 'center'
    },
    carouselColumn: {
        display: 'flex',
        position: 'relative',
        top: 20,
        flexDirection: 'column',
        width: '28rem',
        borderRight: `1px solid ${theme.palette.border.productBorder}`
    },
    productColumn: {
        display: 'flex',
        position: 'relative',
        top: 10,
        flexDirection: 'column',
        width: '108rem',
        gap: '1rem',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '1rem'
    },
    strechedImage: {
        height: '25rem',
        outline: 'none',
        objectFit: 'contain'
        //  border: `1px solid ${ theme.palette.border.productBorder}`,
    },
    link: {
        fontSize: '1.8rem',
        color: `${theme.palette.text.anchorLink} !important`,
        fontWeight: 500,
        fontFamily: 'Graphik',
        display: 'flex',
        alignItems: 'end',
        gap: '1rem',
        textDecoration: 'underline',
        '& a': {
            color: `${theme.palette.text.anchorLink} !important`
        },

        '& svg': {
            width: '1.8rem',
            height: '1.8rem',
            display: 'inline',
            fill: theme.palette.text.anchorLink
        },
        marginLeft: '2rem'
    },
    descriptionContainer: {
        padding: '1rem',
        height: '32rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: '0rem'
        // border: `1px solid ${ theme.palette.border.productBorder}`
    },
    descriptionHeaderWrapper: {
        fontSize: '2rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-between',
        fontWeight: 450,
        width: '100%',
        borderTop: `1px solid ${theme.palette.border.productBorder}`,
        borderBottom: `1px solid ${theme.palette.border.productBorder}`
    },
    descriptionHeaderPane: {
        fontSize: '2rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        height: '6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 450,
        width: '100%'
    },
    expanded: {
        marginRight: '2rem',
        transition: 'transform 1s',
        '& svg': {
            width: '1.8rem !important',
            height: '1.8rem !important'
        }
    },
    retracted: {
        marginRight: '2rem',
        '& svg': {
            width: '1.8rem !important',
            height: '1.8rem !important',
            transform: 'rotate(+90deg)'
        }
    },
    descriptionTitle: {
        fontSize: '1.8rem',
        lineHeight: '2.4rem',
        color: 'black',
        fontWeight: '500',
        marginTop: '1rem',
        textAlign: 'left',
        textTransform: 'capitalize',
        marginLeft: '2rem'
    },
    summaryText: {
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        textAlign: 'left',
        fontWeight: '400',
        color: 'black',
        marginBottom: '1rem',
        fontFamily: 'inherit'
    },
    descriptionText: {
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        textAlign: 'left',
        fontWeight: '400',
        color: 'black',
        marginBottom: '1rem',
        fontFamily: 'inherit'
    },
    carouselImage: {
        width: '20rem',
        height: '18rem',
        objectFit: 'contain'
    },
    descriptionHeader: {
        marginLeft: '2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    expandedSection: {
        marginLeft: '2rem'
    },
    descriptionBox: {
        marginLeft: '2rem',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        overflow: 'scroll'
    },
    summaryBox: {
        marginLeft: '2rem',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    aiTitle: {
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: '#8C8C8C'
    },
    imageContainer: {
        width: '104rem',
        marginLeft: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '30rem',
        overFlow: 'hidden',
        backgroundColor: '#EAEEEF'
    },
    sentimentContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        gap: '1.5rem',
        marginBottom: '1rem',
        position: 'relative'
    },
    red: {
        position: 'relative',
        display: 'inline-block',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        borderRadius: '4px',
        padding: '0.7rem',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(252, 146, 153, 0.5)',
            borderRadius: 'inherit',
            zIndex: 1
        }
    },
    green: {
        position: 'relative',
        display: 'inline-block',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        borderRadius: '4px',
        padding: '0.7rem',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(46, 205, 170, 0.5)',
            borderRadius: 'inherit',
            zIndex: 1
        }
    },
    grey: {
        position: 'relative',
        display: 'inline-block',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        borderRadius: '4px',
        padding: '0.7rem',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(242, 188, 92, 0.4)',
            borderRadius: 'inherit',
            zIndex: 1
        }
    },
    text: {
        position: 'relative',
        zIndex: 100
    }
}));

// api response structure
//  { most_similar_images_df:
//       {
//         Cluster_All_Images:{}
//         Shoe Reviews Summary:{}
//         Shoe_Description:{}
//         Shoe_ID:{}
//         Shoe_link:{}
//         Top_Shoe_Similarity_Score:{}
//       }
//      most_similar_images_urls:[]
//   }

const ProductPage = (props) => {
    const { data, selectedIndex, setSelectedIndex } = props;
    const [retracted, setRetracted] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const classes = useStyles();

    const keys = Object.keys(data?.['most_similar_images_df']['Shoe_ID']);
    const stringImageList =
        data?.most_similar_images_df?.Cluster_All_Images?.[keys[selectedIndex]] ?? [];
    const currentDescription =
        data?.most_similar_images_df?.Filtered_Shoe_Description?.[keys[selectedIndex]] ??
        'No description available';
    const currentTagLine =
        data?.most_similar_images_df?.Shoe_Title?.[keys[selectedIndex]] ??
        'No description available';
    const currentSummary =
        data?.most_similar_images_df?.['Shoe Reviews Summary']?.[keys[selectedIndex]] ??
        'No Reviews Yet';
    const currentShoeLink =
        data?.most_similar_images_df?.Shoe_link?.[keys[selectedIndex]] ?? 'No link available';
    const sanitizedCurrentShoeLink = sanitizeHtml(currentShoeLink);
    const currentShoeName =
        data?.most_similar_images_df?.['Shoe Name']?.[keys[selectedIndex]] ?? 'Adidas Shoes';
    const reaImagesJSON = stringImageList.replace(/'/g, '"');
    const currentImages = JSON.parse(reaImagesJSON);
    const currentImageLink = JSON.parse(reaImagesJSON)?.[selectedImage];
    const sanitizedSrc = sanitizeHtml(currentImageLink);

    const sentiments = data?.most_similar_images_df?.['Review_Themes_Sentiments'];
    const currentSentimentKeys =
        sentiments?.[keys[selectedIndex]] !== 'None'
            ? Object.keys(JSON.parse(JSON.stringify(sentiments?.[keys[selectedIndex]])))
            : null;
    const currentSentimentValues =
        sentiments?.[keys[selectedIndex]] !== 'None'
            ? Object.values(JSON.parse(JSON.stringify(sentiments?.[keys[selectedIndex]])))
            : null;

    const closeHandler = () => {
        setSelectedIndex(-1);
    };

    return (
        <div className={classes.productContainer}>
            {<span className={classes.shoeNameMain}>{currentShoeName}</span>}

            <div className={classes.productRow}>
                <div className={classes.carouselColumn}>
                    <VerticalCarousel
                        images={currentImages}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                    ></VerticalCarousel>{' '}
                </div>

                <div className={classes.productColumn}>
                    <div className={classes.imageContainer}>
                        <img className={classes.strechedImage} src={sanitizedSrc}></img>
                    </div>

                    <div className={classes.descriptionContainer}>
                        <div className={classes.descriptionHeaderWrapper}>
                            <div className={classes.descriptionHeaderPane}>
                                <div className={classes.descriptionHeader}>
                                    {`Reviews (${props?.ratingsCount[selectedIndex]}) - ${props.ratings[selectedIndex]}`}{' '}
                                    <Rating value={props.ratings[selectedIndex]} />
                                    <span></span>{' '}
                                </div>{' '}
                                <span
                                    onClick={() => {
                                        setRetracted((prev) => !prev);
                                    }}
                                    className={retracted ? classes.expanded : classes.retracted}
                                >
                                    <ExpansionIcon />
                                </span>
                            </div>

                            {!retracted && (
                                <div className={classes.summaryBox}>
                                    <span className={classes.aiTitle}>Summarised Through AI</span>
                                    <span className={classes.summaryText}>{`${currentSummary?.slice(
                                        0,
                                        500
                                    )}${currentSummary?.length < 500 ? '' : '...'}`}</span>
                                    {currentSentimentKeys?.length &&
                                    currentSentimentValues?.length ? (
                                        <div className={classes.sentimentContainer}>
                                            {currentSentimentKeys?.map((sentiment, index) => {
                                                return (
                                                    <span
                                                        className={
                                                            currentSentimentValues?.[index] ==
                                                            'positive'
                                                                ? classes.green
                                                                : currentSentimentValues?.[index] ==
                                                                  'negative'
                                                                ? classes.red
                                                                : classes.grey
                                                        }
                                                        key={index}
                                                    >
                                                        <span className={classes.text}>
                                                            {sentiment}
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                        <span className={classes.descriptionTitle}>
                            {currentTagLine?.length ? currentTagLine : 'Review Summary'}.
                        </span>
                        <div className={classes.descriptionBox}>
                            {retracted && (
                                <span className={classes.descriptionText}>
                                    {currentDescription?.length
                                        ? currentDescription?.slice(0, 700) + '.'
                                        : null}
                                </span>
                            )}
                        </div>
                        <span className={classes.link}>
                            <a
                                href={currentShoeLink ? sanitizedCurrentShoeLink : ''}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Get it from Adidas{' '}
                            </a>
                            <OpenLink></OpenLink>
                        </span>
                    </div>
                </div>
            </div>
            {
                <IconButton className={classes.backButton} onClick={closeHandler}>
                    <ArrowBackIcon></ArrowBackIcon>
                </IconButton>
            }
        </div>
    );
};

export default ProductPage;
