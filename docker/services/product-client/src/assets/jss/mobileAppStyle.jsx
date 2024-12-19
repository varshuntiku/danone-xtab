const mobileAppStyle = (theme) => ({
    mDomContainer: {
        height: '100%',
        position: 'relative'
    },
    mBodyContainer: {
        height: '100%',
        position: 'relative'
    },
    mWrapper: {
        display: 'flex',
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            height: '82.5vh'
        },
        [theme.breakpoints.up('sm')]: {
            height: '80.5vh'
        },
        [theme.breakpoints.up('xl')]: {
            height: '87vh'
        }
    },
    mBodyContent: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
        paddingLeft: '0.7rem',
        paddingRight: '0.7rem'
    },
    mAppLoader: {
        marginTop: theme.spacing(2)
    },
    mBody: {
        height: 'calc(100% - ' + theme.spacing(13) + ')',
        marginBottom: theme.spacing(5),
        overflowY: 'auto',
        position: 'relative',
        transition: 'all 500ms'
    }
});

export default mobileAppStyle;
