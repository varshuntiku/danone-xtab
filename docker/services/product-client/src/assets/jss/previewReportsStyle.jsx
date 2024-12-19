import codxLoginBkgd from 'assets/img/login-bg.png';

const previewReportsStyle = (theme) => ({
    appBar: {
        position: 'relative'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    coverPage: {
        position: 'relative',
        boxShadow: '4px 6px 12px 6px' + theme.palette.shadow.dark,
        padding: theme.spacing(5),
        backgroundColor: theme.palette.background.paper
    },
    codxLogo: {
        height: theme.spacing(5),
        margin: theme.spacing(1, 0),
        fill: theme.palette.primary.contrastText + ' !important'
    },
    backgroundImage: {
        backgroundImage: `url(${codxLoginBkgd})`
    },
    coverImage: {
        width: '100%',
        padding: '15px'
    },
    contentWrapper: {
        width: '90%',
        margin: '0 auto',
        marginTop: '100px'
    },
    root: {
        width: '90%',
        margin: '80px auto',
        border: '1px solid #3277B3',
        borderRadius: '32px',
        position: 'relative'
    },
    snapShot: {
        fontSize: theme.spacing(7),
        fontWeight: 'normal',
        letterSpacing: '0.75px',
        lineHeight: '0.964',
        color: theme.palette.text.headingText
    },
    coverPageContent: {
        marginLeft: '60px',
        marginRight: '60px',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        '& $codxLogo': {
            height: '10rem'
        },
        '& $description': {
            color: theme.palette.text.headingText
        }
    },

    heading: {
        display: 'flex',
        width: theme.spacing(55)
    },
    description: {
        fontSize: theme.spacing(3),
        color: theme.palette.text.titleText,
        fontWeight: '200',
        textAlign: 'justify'
    },
    text: {
        color: theme.palette.primary.contrastText,
        fontSize: '4.4rem',
        marginLeft: '12px',
        letterSpacing: '3px'
    },
    number: {
        fontSize: theme.spacing(16),
        color: '#98AFC4'
    },
    page: {
        padding: theme.spacing(5),
        paddingLeft: '60px',
        paddingRight: '60px',
        paddingBottom: '10px',
        boxShadow: '4px 6px 12px 6px ' + theme.palette.shadow.dark,
        marginTop: '50px',
        backgroundColor: theme.palette.background.paper,
        breakAfter: 'always',
        breakBefore: 'always',
        breakInside: 'avoid'
    },

    subHeading: {
        fontSize: theme.spacing(5)
    },

    overview: {
        margin: '50px',
        '& $description': {
            fontSize: '14px',
            color: theme.palette.text.titleText
        },
        '& $heading': {
            fontSize: '28px',
            color: theme.palette.text.titleText
        },
        '& $subHeading': {
            fontSize: '20px',
            color: theme.palette.text.titleText
        }
    },
    footer: {
        position: 'relative',
        bottom: '0',
        height: theme.spacing(3.5),
        marginTop: '25px',
        display: 'flex'
    },
    footerLeft: {
        height: theme.spacing(3.5),
        fill: theme.palette.primary.contrastText + ' !important',
        left: '0',
        position: 'absolute'
    },
    pageNumber: {
        margin: 'auto',
        color: 'white',
        fontSize: '14px'
    },
    footerRight: {
        height: theme.spacing(3.5),
        position: 'absolute',
        right: '0'
    },
    insight: {
        width: '75%',
        fill: theme.palette.primary.contrastText + ' !important'
    },

    charts: {
        width: '75%',
        fill: theme.palette.primary.contrastText + ' !important',
        float: 'right',
        breakInside: 'avoid'
    },

    percentage: {
        float: 'left',
        fontSize: '84px',
        fontWeight: 500,
        lineHeight: '1',
        marginRight: '20px'
    },
    repute: {
        display: 'block',
        fontSize: '48px',
        fontWeight: 500
    },
    entity: {
        fontSize: '95px',
        fontWeight: 100
    },
    chartWrapper: {
        backgroundColor: '#C6DEF2',
        borderRadius: ' 50%',
        margin: 'auto',
        padding: '10%',
        breakInside: 'avoid'
    },
    chartWrapperColumn: {
        width: '50%',
        backgroundColor: '#C6DEF2',
        borderRadius: ' 50%',
        padding: '10%',
        marginTop: '30px'
    },

    chart: {
        margin: '0 auto',
        display: 'block',
        breakInside: 'avoid'
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    keyFindings: {
        backgroundColor: theme.palette.background.info,
        color: theme.palette.text.titleText,
        padding: '20px',
        breakInside: 'avoid'
    },

    table: {
        width: '100%',
        fontSize: '14px',
        color: theme.palette.text.titleText,
        border: '1px solid' + theme.palette.text.titleText,
        borderCollapse: 'collapse',

        '& th': {
            border: '1px solid',
            padding: '8px'
        },

        '& td': {
            border: '1px solid',
            padding: '8px'
        },
        breakInside: 'avoid'
    },

    plot: {
        position: 'relative',
        width: '100%',
        height: '275px',
        breakInside: 'avoid'
    },

    alignVertical: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    concisedContent: {
        border: '1px dashed' + theme.palette.primary.contrastText,
        borderRadius: '32px',
        padding: '40px',
        margin: '40px'
    }
});

export default previewReportsStyle;
