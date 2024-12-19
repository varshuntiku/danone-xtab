import { BorderRight } from '@material-ui/icons';

const SavedScenarioPopupStyle = (theme) => ({
    SavedPopupContainer: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '40vw',
        height: '100vh',
        zIndex: 1300,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.border.loginGrid}`,
        padding: '1.5rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.titleText,
        overflowY: 'scroll'
    },
    SavedScenariosPopupContainer: {
        marginLeft:'1rem',
        marginTop:'1rem',
        position: 'fixed',
        top: '5.1rem',
        width: '92.5vw',
        height: '100vh',
        zIndex: 1200,
        background: theme.palette.background.paper,
        padding: '1.5rem',
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.titleText,
        overflowY: 'scroll',
        overflowX:'wrap',
        transition: 'right 0.3s ease-in-out, width 0.3s ease-in-out', 
      },
    closeButtonIcon: {
        fontSize: '2.5rem',
        marginRight: '1rem',
        cursor: 'pointer'
    },
    closeButton: {
        margin: '0 !important',
        padding: '0.8rem',
        '& svg': {
            fill: theme.palette.text.contrastText,
            width: '1.6rem',
            height: '1.6rem'
        },
        fontSize:'3rem'
    },
    savedScenariosNavbar:{
        display: 'flex',

        width: '100%'
    },
    savedNavbar: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    savedPopupTitle: {
        fontSize: theme.title.h1.fontSize,
        fontWeight: theme.title.h1.fontWeight,
        letterSpacing: theme.title.h1.letterSpacing,
        lineHeight: theme.layoutSpacing(36),
        textTransform: theme.title.h1.textTransform
    },
    sepratorLine: {
        border: `1px solid ${theme.palette.border.loginGrid}`,
        borderBottom: 'none',
        padding: `${theme.layoutSpacing(0)} ${theme.layoutSpacing(20)}`,
        width: 'calc(100% - 0px)'
    },
    savedBaseScenario: {
        display: 'flex',

        marginTop: '2.6rem'
    },

    savedBaseScenarioTitle: {
        fontSize: '2.4rem',
        fontWeight: '500'
    },
    savedBaseScenarioDetail: {
        fontSize: '1.7rem',
        fontWeight: '400',
        marginTop: '0.5rem'
    },
    savedCompareContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    savedScenarioCompareContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    savedCompareScenario: {
        marginTop: theme.layoutSpacing(41),
        display: 'flex',
        flexDirection: 'column',
        width: theme.layoutSpacing(781)
    },
    savedCompareTitle: {
        fontSize: '2.1rem',
        fontWeight: '500',
        marginBottom: theme.layoutSpacing(8)
    },
    savedCompareDetail: {
        fontSize: '1.6rem',
        lineHeight: theme.layoutSpacing(24)
    },
    savedCompareIcons: {
        display: 'flex',
        alignSelf: 'flex-start',
        marginTop:'3.1rem'
    },
    textHeaders:{
        textAlign: 'left',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.title.h6.fontWeight,
        textTransform: 'Capitalize',
        fontFamily: theme.title.h1.fontFamily
    },
    aveddetails:{
        display:'flex !important',
        flexDirection:'row !important',
        fontSize: '2rem',
        fontWeight: '400',
        fontFamily: theme.title.h1.fontFamily

    },
    savedcomparebutton: {
        padding: '12px !important',
        marginRight: '1px !important'
    },
    savedcomparebutton: {
        padding: '12px !important',
        marginRight: '1px !important'
    },
    savedProfileIcon: {
        border: `0.2rem solid ${theme.palette.border.loginGrid}`,
        height: theme.layoutSpacing(26),
        marginTop: theme.layoutSpacing(14)
    },
    savedInput: {
        marginTop: theme.layoutSpacing(20),
    },
    savedVerticalIcon: {
        marginLeft: '-3rem'
    },
    savedInputTable: {
        marginTop: theme.layoutSpacing(12),
    },
    compareButton: {
        minHeight: '2rem',
        padding: '1rem',
        width: 'auto',
        marginTop: '0.5rem',
        height: '5rem',
        minWidth: '12rem',
        marginRight: '2rem'
    },
    collaborateButton: {
        cursor: 'pointer',
        marginLeft: '0.8rem',
        '&.Mui-disabled': {
            color: 'inherit',
            fill: 'none',
            stroke: 'white'
        },
        '& .MuiSvgIcon-root': {
            fill: 'none',
            stroke: '#3f51b5'
        }
    },
    disabled: {
        pointerEvents: 'none',
        opacity: 0.5,
        cursor: 'not-allowed'
    },

    savedScenariosIcons: {
        display: 'flex',
        alignSelf: 'flex-start',
        gap: '0.5rem',
        marginTop: '1rem',
        alignItems: 'center'
    },
    verticalLine: {
        height: '2.75rem',
        width: '1px',
        background: theme.palette.text.default,
        minHeight: '50%'
    },
    savedScenarioDescription: {
        marginTop: theme.layoutSpacing(21),
        display: 'flex',
        flexDirection: 'column',
        width: theme.layoutSpacing(781)
    },
    line: {
        top: '1px',
        height: '20px',
        width: '0.5px',

        background: theme.palette.border.loginGrid,
        marginTop: '10px'
    },
    savedline:{

           position:'relative',
            height: '20px',
            width: '0.5px',
    marginLeft:'1rem',
    marginRight:'1rem',
            background: theme.palette.border.loginGrid,


    },
    editicon: {
        cursor: 'pointer',
        width: '17px',
        height: '17px',
        fill: theme.palette.icons.selectedBlue
    },
    toolStyle: {
        padding: '1rem',
        backgroundColor: theme.palette.background.tooltipBackground,

        top: '3',
        ZIndex: 10,
        height: 'fit-content',
        textAlign: 'start',
        fontSize: theme.layoutSpacing(14),
        borderRadius: '0.5rem',
        color: theme.palette.text.tooltipTextColor,
        fontWeight: '500',
        letterSpacing: '0.35%',

        maxWidth: theme.layoutSpacing(200),
        fontFamily: theme.body.B5.fontFamily
    },
    visualTooltip: {
        fontFamily: theme.body.B5.fontFamily,
        fontSize: '1.6rem',
        maxWidth: '35rem',
        maxHeight: '28rem',
        margin: '0.3rem',
        textAlign: 'left',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 12,
        lineHeight: '2.3rem',
        letterSpacing: theme.title.h1.letterSpacing,
        backgroundColor: theme.palette.background.tooltipBackground,
        color: theme.palette.text.tooltipTextColor,
        padding: '4px 8px'
    },
    tableSimTopSection:{
        marginTop:theme.layoutSpacing(12)
    }
});

export default SavedScenarioPopupStyle;
