import React, { useEffect, useState } from 'react';
import { IconButton, Typography, makeStyles, CircularProgress } from '@material-ui/core';
import CloseIcon from '../../../assets/Icons/CloseBtn';
import ProductPage from './ProductPage';
import { getAdidasInsights } from '../../../services/adidas';
import { ReactComponent as InsightsBulb } from '../../../assets/img/InsightsBulb.svg';
import InfoPop from './InfoPop';
import Rating from './Rating';
import sanitizeHtml from 'sanitize-html-react';
const useStyles = makeStyles((theme) => ({
    uploadedImage: {
        width: '23rem',
        height: '22.7rem',
        objectFit: 'contain'
    },
    carouselRow: {
        padding: '2rem',
        background: 'white',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '140rem',
        height: '42rem',
        border: `1px solid ${theme.palette.border.productBorder}`,
        '& img': {
            borderRadius: '2px'
        }
    },
    closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        '& svg': {
            width: '2rem',
            height: '2rem'
        }
    },
    uploadedImageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'start',
        gap: '1rem',
        paddingRight: '2rem',
        color: theme.palette.text.default,
        alignSelf: 'center'
    },
    sourceTextContainer: {
        width: '23rem',
        lineHeight: '1.8rem',
        wordBreak: 'break-all'
    },

    fileName: {
        fontSize: '1.4rem',
        lineHeight: '2.4rem',
        display: 'inline',
        alignItems: 'start'
    },
    sourceText: {
        fontSize: '1.4rem',
        lineHeight: '2.4rem',
        fontWeight: '500'
    },
    border: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '5%',
            left: '27rem',
            width: '1px',
            height: '90%',
            backgroundColor: theme.palette.border.productBorder,
            zIndex: 1
        }
    },
    imagesList: {
        padding: '2rem',
        display: 'flex',
        gap: '4rem',
        alignItems: 'start',
        justifyContent: 'center',
        marginTop: '2rem',
        '& img': {
            width: '18rem',
            height: '20rem',
            objectFit: 'contain',
            cursor: 'pointer'
        }
    },
    card: {
        width: '17rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    description: {
        fontSize: '1.35rem',
        color: theme.palette.text.default,
        textAlign: 'start',
        cursor: 'default',

        '&::first-letter': {
            textTransform: 'capitalize'
        }
    },
    shoeNameContainer: {
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'start',
        width: '100%',
        position: 'relative'
    },

    shoeName: {
        width: '80%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        textAlign: 'start',
        fontWeight: 500,
        marginTop: '1rem',
        marginBottom: '2rem',
        cursor: 'default'
    },
    shoeNameFull: {
        width: '100%',
        fontSize: '1.5rem',
        color: theme.palette.text.default,
        textAlign: 'start',
        fontWeight: 500,
        marginTop: '1rem',
        marginBottom: '2rem',
        cursor: 'default'
        // wordBreak: 'break-all',
        // overflowWrap: 'break-word',
    },
    shoeNameIcon: {
        position: 'absolute',
        bottom: '1rem',
        right: '0',
        width: '3rem',
        height: '3rem',
        display: 'flex',
        marginTop: '0.7rem',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '0.4rem',
        background: '#E5F3FA',
        borderRadius: '50%',
        '& svg': {
            padding: 0,
            width: '2.5rem',
            height: '2.5rem',
            stroke: theme.palette.text.contrastText
        }
    },

    textDisplay: {
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        position: 'absolute',
        fontWeight: 500,
        top: 25,
        left: 30
    },
    textDisplayImage: {
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        position: 'absolute',
        fontWeight: 500,
        top: 25,
        left: '30rem'
    },
    imageWrapper: {
        position: 'relative',
        top: 5
    },
    percentage: {
        position: 'absolute',
        fontSize: '1.4rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        top: '80%',
        zIndex: 2,
        width: '10rem',
        background: 'linear-gradient(90deg, #FBD3D1 0%, #E5F3FA 100%)',
        border: '1px solid white',
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
        cursor: 'default'
    },
    imageContainer: {
        width: '18rem',
        minHeight: '20rem',
        maxheight: '25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.contrastText
    },
    loaderContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default
    },
    asterisk: {
        color: theme.palette.icons.errorIconFill
    },
    infoIcon: {
        cursor: 'pointer',
        zIndex: 2,
        height: '2rem !important',
        width: '2rem !important',
        '& svg': {
            fill: `${theme.palette.primary.contrastText} !important`
        }
    },
    iconContainer: {
        position: 'relative',
        width: theme.layoutSpacing(30),
        height: theme.layoutSpacing(30),
        display: 'inline',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        marginLeft: '1rem',
        '&:hover': {
            backgroundColor: theme.palette.background.plainBtnBg,
            cursor: 'pointer'
        }
    },
    iconButton: {
        margin: 0
    },
    popOverTitleWrapper: {
        display: 'flex',
        width: 'calc(100% - ' + theme.spacing(3.2) + ')',
        left: theme.spacing(1.6),
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        height: '5rem',
        borderBottom: `1px solid ${theme.palette.border.loginGrid}`
    },
    popOverTitleText: {
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontSize: '1.67rem',
        color: theme.palette.text.titleText,
        display: 'flex',
        alignItems: 'center'
    },
    popOverTitleSet: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    closeIcon: {
        fontSize: '0.5rem !important',
        position: 'absolute',
        right: 0,
        marginRight: `-${theme.spacing(0.5)}`,
        padding: '0.5rem',
        '& svg': {
            width: '2rem',
            fill: `${theme.palette.icons.closeIcon}!important`,
            padding: '1px'
        }
    },
    bulbIcon: {
        stroke: theme.palette.text.contrastText
    },

    popOverContainer: {
        marginTop: '0.5rem'
    },
    popOverPaper: {
        width: '35rem',
        minHeight: '16rem',
        marginLeft: '1rem'
    },
    contentText: {
        margin: theme.spacing(1.6),
        color: theme.palette.text.default,
        lineHeight: theme.layoutSpacing(19),
        fontSize: '1.4rem',
        overflow: 'hidden',
        overflowWrap: 'break-word',
        fontWeight: '400'
    },
    insightsBar: {
        height: '5rem',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        color: theme.palette.text.default,
        fontWeight: '400',
        background: '#F2BC5C',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '140rem',
        border: `1px solid ${theme.palette.border.productBorder}`
    },
    insightsIcon: {
        '& svg': {
            width: '2.5rem',
            height: '2.5rem',
            stroke: theme.palette.text.contrastText
        }
    },
    insightsIconPop: {
        marginBottom: '-0.5rem',
        '& svg': {
            width: '2.5rem',
            height: '2.5rem',
            stroke: theme.palette.text.contrastText
        }
    },
    ratingContainer: {
        marginTop: '0.5rem',
        fontSize: '1.6rem',
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const SearchCarousel = (props) => {
    const { imageUrl, imageName, onImageClick, searchText, setOpen, responseData } = props;
    const [data, setData] = useState(responseData);
    const [anchorEl, setAnchorEL] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [insight, setInsight] = useState('');
    const [keyIds, setKeyIds] = useState([]);
    const isValidResponseData =
        Object.prototype.hasOwnProperty.call(responseData, 'most_similar_images_df') &&
        Object.prototype.hasOwnProperty.call(responseData, 'most_similar_images_urls');
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [insightsResponse, setInsightsResponse] = useState(null);
    const keys = Object.keys(responseData?.['most_similar_images_df']['Shoe_ID']);

    const [ratings] = useState([...Array(5)].map(() => (Math.random() * 1 + 3.8).toFixed(1)));
    const [ratingsCount] = useState(
        [...Array(5)].map(() => Math.floor(Math.random() * (1000 - 80 + 1)) + 8)
    );

    useEffect(() => {
        if (isValidResponseData) {
            setKeyIds(() => {
                const keys = Object.keys(responseData['most_similar_images_df']['Shoe_ID']);
                return keys;
            });
            setData(responseData);
        }
    }, [imageUrl?.length, searchText?.length, responseData]);

    const handleProductClick = (index) => {
        setSelectedIndex(index);
    };

    const isValidImageUrl = (url) => {
        const imgRegex = /\.(jpeg|jpg|gif|png|svg)$/;
        return imgRegex.test(url);
    };

    const getSanitizedUrl = (url) => {
        if (isValidImageUrl(url)) {
            return sanitizeHtml(url);
        }
    };

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setLoadingInsights(true);
                let params = {
                    payload: {
                        input_image_base64: imageUrl,
                        shoe_name: Object.values(
                            responseData?.['most_similar_images_df']?.['Shoe Name']
                        ),
                        most_similar_images_urls_list: responseData['most_similar_images_urls']
                    }
                };
                const insightsReponse = await getAdidasInsights(params);
                setInsightsResponse(() => {
                    return insightsReponse['similarity_insight'];
                });
                setLoadingInsights(false);
            } catch (err) {
                // console.error(err);
                setLoadingInsights(false);
            }
        };

        if (imageUrl?.length && responseData?.['most_similar_images_urls']) fetchInsights();
    }, []);

    /*
      api response structure
    { most_similar_images_df:
      {
        Cluster_All_Images:{}
        Shoe Reviews Summary:{}
        Shoe_Description:{}
        Shoe_ID:{}
        Shoe_link:{}
        Top_Shoe_Similarity_Score:{}
      }
     most_similar_images_urls:[]
  }
     */
    if (isValidResponseData && selectedIndex == -1) {
        return (
            <>
                <div className={classes.carouselRow}>
                    {/* image search preview box */}
                    <div style={{ display: 'flex' }}>
                        {imageUrl?.length ? (
                            <>
                                <div className={classes.uploadedImageContainer}>
                                    <img
                                        src={`data:image/jpeg;base64,${getSanitizedUrl(imageUrl)}`}
                                        className={classes.uploadedImage}
                                        onClick={onImageClick}
                                    />
                                    {imageName?.length ? (
                                        <span className={classes.sourceTextContainer}>
                                            <span className={classes.sourceText}>
                                                Image Source -{' '}
                                            </span>
                                            <Typography className={classes.fileName}>
                                                {' '}
                                                {imageName}
                                            </Typography>
                                        </span>
                                    ) : null}
                                </div>
                                <div className={classes.border}>{''}</div>
                            </>
                        ) : null}

                        {/* renderin the response response items list */}
                        {/* onClick={()=>{
                      window.open(responseData["most_similar_images_df"]["Shoe_link"][`${keyIds[index]}`])
                    }} */}

                        <div className={classes.imagesList}>
                            {responseData['most_similar_images_urls']?.map((url, index) => (
                                <div className={classes.card} key={index}>
                                    <div className={classes.imageWrapper}>
                                        <div
                                            className={classes.imageContainer}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(index);
                                            }}
                                        >
                                            <img
                                                className={classes.image}
                                                src={getSanitizedUrl(url)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductClick(index);
                                                }}
                                            />
                                        </div>

                                        {imageUrl?.length ? (
                                            <div className={classes.percentage}>
                                                {Math.floor(
                                                    Number(
                                                        responseData['most_similar_images_df']?.[
                                                            'Top_Shoe_Similarity_Score'
                                                        ]?.[keys[index]]
                                                    ) * 100
                                                )}
                                                %
                                            </div>
                                        ) : null}
                                        {!loadingInsights && insightsResponse?.length ? (
                                            <span
                                                className={classes.shoeNameIcon}
                                                title="insights"
                                                onClick={(e) => {
                                                    setAnchorEL(e?.currentTarget);
                                                    setInsight(insightsResponse[index]);
                                                    setInfoOpen(true);
                                                }}
                                            >
                                                <InsightsBulb></InsightsBulb>
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className={classes.ratingContainer}>
                                        <span>
                                            {' '}
                                            <span> {ratings[index]}</span>
                                        </span>{' '}
                                        <Rating value={ratings[index]}></Rating>
                                    </div>

                                    <div className={classes.shoeNameContainer}>
                                        <span className={classes.shoeNameFull}>
                                            {
                                                responseData['most_similar_images_df']['Shoe Name'][
                                                    `${keyIds[index]}`
                                                ]
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loadingInsights ? (
                        <div className={classes.loaderContainer}>
                            <CircularProgress
                                size={24}
                                className={classes.loader}
                            ></CircularProgress>
                            <span>Generating Insights, please wait</span>
                        </div>
                    ) : null}
                    {
                        <InfoPop
                            infoOpen={infoOpen}
                            setInfoOpen={setInfoOpen}
                            insight={insight}
                            classes={classes}
                            anchorEl={anchorEl}
                        />
                    }

                    {/* absolute close icon */}
                    {
                        <IconButton
                            className={classes.closeButton}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon></CloseIcon>
                        </IconButton>
                    }

                    {/* absolute search  text */}
                    {
                        <span
                            className={searchText ? classes.textDisplay : classes.textDisplayImage}
                        >{`${
                            searchText ? `"${searchText}" -` : ''
                        } Here are a few options you might love`}</span>
                    }
                </div>
                {!loadingInsights && insightsResponse?.length ? (
                    <div className={classes.insightsBar}>
                        Click the &nbsp;{' '}
                        <span className={classes.insightsIconPop}>
                            <InsightsBulb />
                        </span>
                        &nbsp; icon to access AI Insights. And see why we recommend the selected
                        shoes.
                    </div>
                ) : null}
            </>
        );
    } else if (isValidResponseData && selectedIndex !== -1) {
        return (
            <ProductPage
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                data={data}
                ratings={ratings}
                ratingsCount={ratingsCount}
            ></ProductPage>
        );
    }
};

export default SearchCarousel;
