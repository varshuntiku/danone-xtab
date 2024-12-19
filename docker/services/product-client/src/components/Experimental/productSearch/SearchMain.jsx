import React, { useRef, useState } from 'react';
import { Button, CircularProgress, FormControl, IconButton, makeStyles } from '@material-ui/core';
import AdidasLogo from 'assets/img/AdidasLogo.png';
import Input from '@material-ui/core/Input';

import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ReactComponent as ImageIcon } from 'assets/img/ImageUpload.svg';
import SearchCarousel from './SearchCarousel';
import { getAdidasSuggestions } from '../../../services/adidas';
const useStyles = makeStyles((theme) => ({
    mainWrapper: {
        width: '140rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start',
        gap: '1rem'
    },
    headerCommon: {
        fontSize: '3.6rem',
        lineHeight: '3.2rem',
        fontWeight: 700,
        fontFamily: 'Graphik Compact',
        color: theme.palette.text.default,
        letterSpacing: '2px'
    },
    headerRed: {
        fontSize: '3.6rem',
        lineHeight: '3.2rem',
        fontWeight: 700,
        fontFamily: 'Graphik Compact',
        color: theme.palette.text.headerOrange,
        letterSpacing: '2px'
    },
    adidasLogo: {
        width: '12rem',
        height: '6rem'
    },
    searchInput: {
        width: '140rem !important',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '10px 15px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        '& input::placeholder': {
            color: 'grey',
            fontSize: '1.8rem',
            opacity: 1
        }
    },
    inputRoot: {
        borderRadius: 0,
        '&:before, &:after': {
            borderBottom: 'none !important'
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottom: 'none !important'
        }
    },
    inputAdornment: {
        position: 'relative'
    },
    formControl: {
        position: 'relative',
        border: `1px solid ${theme.palette.border.searchBorder}`,
        '&:focus-within': {
            border: `1px solid ${theme.palette.text.contrastText}`
        }
    },
    iconButton: {
        padding: '1rem',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: 0,
            width: '1px',
            height: '60%',
            backgroundColor: theme.palette.border.searchBorder,
            zIndex: 1
        },
        '& svg': {
            width: '3rem',
            height: '3rem',
            willChange: 'transform'
        }
    },
    uploadButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        gap: '2rem',
        fontSize: '1.6rem',
        lineHeight: '2.4rem',
        fontFamily: 'Gaphik Compact !important',
        '& svg': {
            width: '2.2rem',
            height: '2.2rem',
            fill: theme.palette.text.contrastText,
            stroke: theme.palette.text.contrastText,
            marginRight: '1rem',
            willChange: 'transform'
        },
        '&:hover': {
            background: 'none'
        }
    },
    inputElement: {
        fontSize: '1.6rem',
        color: theme.palette.text.default
        // padding: "10px 0",
    },
    uploadedImage: {
        width: '23rem',
        height: '22.7rem',
        objectFit: 'cover'
    },
    constricted: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'end'
    },
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    error: {
        fontSize: '1.6rem',
        color: 'red'
    },
    searchInputError: {
        width: '140rem !important',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '10px 15px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        '& input::placeholder': {
            color: theme.palette.error.main,
            fontSize: '1.6rem',
            opacity: 1
        }
    }
}));
const SearchMain = () => {
    const [value, setValue] = useState('');
    const [searchText, setSearchText] = useState('');
    const classes = useStyles();
    const inputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageName, setImageName] = useState('');
    const [carouselOpen, setOpen] = useState(false);
    const [responseData, setResponseData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const searchRef = useRef(null);

    const fileUploadHandler = (event) => {
        const file = event.target?.files?.[0];
        if (file) {
            setError(false);
            const reader = new FileReader();
            setImageName(file?.name);
            reader.onloadend = () => {
                let base64String = reader.result.split(',')[1]; // Removing the prefix
                imageSearchHandler(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('file not valid');
        }
        event.target.value = null;
    };

    const imageSearchHandler = async (base64URL) => {
        try {
            setError(false);
            setLoading(true);
            setValue('');
            setSearchText('');
            let params = {
                type: 'image',
                payload: {
                    image: base64URL,
                    top_k: 5
                }
            };
            const data = await getAdidasSuggestions(params);
            setResponseData(data);
            setLoading(false);
            setOpen(true);
            setImageUrl(base64URL);
        } catch (err) {
            setLoading(false);
        }
    };

    const textSearchHandler = async () => {
        if (!value?.length) {
            setError(true);
            searchRef?.current?.focus();
            return;
        }

        try {
            setLoading(true);
            setImageUrl('');
            let params = {
                type: 'text',
                payload: {
                    text: value,
                    top_k: 5
                }
            };
            const data = await getAdidasSuggestions(params);
            setResponseData(data);
            setLoading(false);
            setOpen(true);
            setSearchText(value);
        } catch (err) {
            console.log(err);
        }
    };

    const openHandler = () => {
        setOpen(false);
        setImageUrl('');
        setSearchText('');
        setResponseData({});
    };

    return (
        <div className={classes.mainWrapper}>
            <div className={classes.constricted}>
                <img src={AdidasLogo} alt="adidas" className={classes.adidasLogo} />
                {responseData?.['most_similar_images_df'] ? (
                    <span className={classes.headerCommon}>ASK ADIDAS</span>
                ) : null}
            </div>
            {!responseData?.['most_similar_images_df'] ? (
                <span>
                    <span className={classes.headerCommon}>Use</span>{' '}
                    <span className={classes.headerRed}>&nbsp;ASK ADIDAS&nbsp;</span>{' '}
                    <span className={classes.headerCommon}>to Search Anything</span>
                </span>
            ) : null}
            <FormControl className={classes.formControl}>
                <Input
                    id="standard-adornment-search"
                    type="text"
                    className={!error ? classes.searchInput : classes.searchInputError}
                    placeholder={
                        !error ? 'What are you looking for?' : 'Please type something to search'
                    }
                    value={value}
                    autoComplete="off"
                    inputRef={searchRef}
                    onChange={(e) => {
                        if (e.target.value?.length) setError(false);
                        setValue(e?.target?.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            textSearchHandler();
                        }
                    }}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputElement
                    }}
                    endAdornment={
                        <InputAdornment position="end" className={classes.inputAdornment}>
                            <IconButton
                                aria-label="toggle search visibility"
                                onClick={textSearchHandler}
                                className={classes.iconButton}
                            >
                                {!loading && <SearchIcon fontSize="large" />}
                                {loading && (
                                    <CircularProgress
                                        size={24}
                                        className={classes.loader}
                                        style={{ color: 'red' }}
                                    ></CircularProgress>
                                )}
                            </IconButton>
                            <Button
                                className={classes.uploadButton}
                                onClick={() => {
                                    inputRef?.current?.click();
                                }}
                                disabled={loading}
                            >
                                <ImageIcon />
                                <span>Search by image</span>
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={inputRef}
                                onChange={fileUploadHandler}
                            />
                        </InputAdornment>
                    }
                />
            </FormControl>
            {carouselOpen && !loading && responseData['most_similar_images_df'] && (
                <SearchCarousel
                    imageUrl={imageUrl}
                    imageName={imageName}
                    onImageClick={() => {
                        inputRef?.current?.click();
                    }}
                    searchText={searchText}
                    setOpen={openHandler}
                    responseData={responseData}
                />
            )}
        </div>
    );
};

export default SearchMain;
