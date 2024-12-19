const releaseBannerStyles = (theme) => ({
    bannerContainer: {
        margin: '0 10px 0 ' + theme.spacing(10),
        background:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
        padding: theme.spacing(1) + ' ' + theme.spacing(2),
        borderRadius: '100px',
        fontSize: theme.spacing(1.5),
        display: 'flex',
        gap: '10px',
        '& a': {
            color: theme.palette.text.contrastText
            // fontWeight: 'bold'
        },
        '& a:visited': {
            color: theme.palette.text.contrastText
        }
    },
    closeButton: {
        cursor: 'pointer'
    },
    bannerContent: {}
});

export default releaseBannerStyles;
