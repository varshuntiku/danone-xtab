import React from 'react';
import { makeStyles } from '@material-ui/core';
import SearchBackground from 'assets/img/productsBackground.png';
import SearchMain from './SearchMain';

const useStyles = makeStyles((theme) => ({
    body: {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundImage: `url(${SearchBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed'
    },
    mainWrapper: {
        width: '120rem',
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
        color: theme.palette.text.default
    },
    headerRed: {
        fontSize: '3.6rem',
        lineHeight: '3.2rem',
        fontWeight: 700,
        fontFamily: 'Graphik Compact',
        color: theme.palette.text.headerOrange
    },
    adidasLogo: {
        width: '12rem',
        height: '6rem'
    },
    searchInput: {
        width: '120rem !important',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '10px 15px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        '& input::placeholder': {
            color: 'grey',
            fontSize: '1.8rem',
            opacity: 1
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '12.5%',
            right: 0,
            width: '2px',
            height: '75%',
            backgroundColor: 'black',
            zIndex: 1
        }
    },
    inputRoot: {
        borderRadius: '0',
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
        border: ''
    },
    iconButton: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: 0,
            width: '1px',
            height: '60%',
            backgroundColor: theme.palette.border.searchBorder,
            zIndex: 1
        }
    },
    searchIcon: {
        '& svg': {
            width: '2rem',
            height: '2rem'
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
            marginRight: '1rem'
        },
        '&:hover': {
            background: 'none'
        }
    }
}));
const ProductSearch = () => {
    const classes = useStyles();
    return (
        <main className={classes.body}>
            <SearchMain />
        </main>
    );
};

export default ProductSearch;
