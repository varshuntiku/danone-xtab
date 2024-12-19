import { alpha } from '@material-ui/core';
import BG from '../../../assets/img/BG.svg';
import BG_light from '../../../assets/img/BG.svg';

const businessProcessStyles = (theme) => ({
    connSystemDashboardContainer: {
        background: theme.palette.primary.dark,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box',
        '& *': {
            boxSizing: 'border-box'
        }
    },
    connSystemDashboardBody: {
        margin: theme.spacing(0, 2),
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${
            localStorage.getItem('codx-products-theme') == 'dark' ? BG : BG_light
        })`
    },
    connSystemDashboardTabContainer: {
        margin: theme.spacing(0.7, 0)
    },
    connSystemDashboardTabLabel: {
        textAlign: 'center',
        minWidth: theme.spacing(20),
        padding: theme.spacing(2),
        fontSize: '1.8rem',
        fontWeight: '500',
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
        borderBottom: '1px solid ' + theme.palette.text.default,
        float: 'left',
        cursor: 'pointer',
        '&:hover': {
            opacity: '0.5'
        }
    },
    connSystemDashboardTabLabelSelected: {
        textAlign: 'center',
        minWidth: theme.spacing(20),
        fontSize: '1.8rem',
        fontWeight: '500',
        color: localStorage.getItem('codx-products-theme') == 'dark' ? '#6DF0C2' : '#4560D7',
        float: 'left',
        backgroundColor:
            localStorage.getItem('codx-products-theme') == 'dark' ? '#009DF522' : '#4560D722',
        borderBottom: `2px solid ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#6DF0C2' : '#4560D7'
        }`,
        borderBottomStyle: 'inset'
    },
    connSystemGridContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(2),
        boxSizing: 'border-box'
    },
    connSystemGridMiddle: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        gap: theme.spacing(1)
    },
    connSystemGridBottom: {
        flex: 0.9,
        display: 'flex',
        gap: theme.spacing(1)
    },
    connSystemBusinessGridBottom: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        position: 'absolute',
        bottom: '3.25rem',
        zIndex: 10000
    },
    connSystemGoals: {
        width: '22%',
        paddingRight: theme.spacing(2)
    },
    connSystemInitiatives: {
        width: '78%',
        height: '100%'
    },
    connSystemSolutions: {
        width: '100%'
    },
    connSystemBusinessProcess: {
        width: `var(--section-width, 60rem)`,
        position: 'relative',
        height: 'fit-content'
    },
    connSystemDecisionFlow: {
        width: '50%'
    },
    connSystemSideDrawer: {
        width: '50%',
        height: '100%',
        position: 'absolute',
        transform: 'translateX(calc(200% - 2rem))',
        background: theme.palette.primary.dark,
        zIndex: 100
    },
    connSystemSideDrawerToggle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: theme.spacing(5),
        aspectRatio: 1,
        border: '1px solid ' + theme.palette.primary.contrastText,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        opacity: 0.8,
        background: alpha(theme.palette.primary.dark, 0.6),
        backdropFilter: 'blur(1px)',
        transform: 'translateX(' + theme.spacing(2.5) + ')',
        zIndex: 101,

        '&:hover': {
            opacity: '1'
        },
        '& svg': {
            color: theme.palette.primary.contrastText,
            fontSize: theme.spacing(3)
        }
    },
    connSystemCardMain: {
        height: '75%',
        position: 'relative'
    },
    connSystemCardSubMain: {
        height: '100%',
        border: '1px solid ' + theme.palette.primary.contrastTextLight
    },
    connSystemCardSubMainSmallContainer: {
        height: '25%'
    },
    connSystemCardSubMainSmallEnd: {
        padding: theme.spacing(1),
        height: '100%'
    },
    connSystemCardSubMainBigContainer: {
        height: '75%'
    },
    connSystemCardSubMainBig: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    businessProcessHeader: {
        fontSize: theme.spacing(2),
        fontWeight: '400',
        color: localStorage.getItem('codx-products-theme') === 'dark' ? '#02E0FE' : '#02BFD9',
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(0.5),
        position: 'absolute'
    },
    businessProcessDriverHeader: {
        fontSize: '2rem',
        fontWeight: '200',
        color: theme.palette.text.default,
        marginLeft: theme.spacing(2),
        paddingTop: '2rem',
        paddingBottom: '1rem',
        width: '100%',
        height: '1px'
    },
    connSystemCardFlowContainer: {
        position: 'relative',
        flex: 1,
        marginTop: '4rem'
    },
    businessProcessContainer: {
        borderRadius: '100px',
        border: `1px solid ${theme.palette.text.default}`,
        background:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? 'transparent'
                : 'rgba(58, 117, 246, 0.1)',
        marginTop: '2rem',
        color: theme.palette.text.default,
        textAlign: 'center',
        fontSize: '1.75rem',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        width: '30rem',
        padding: '1rem 1rem 1rem 1rem',
        height: '4.5rem',
        marginRight: '2rem',
        cursor: 'pointer',
        '@media (min-width: 768px) and (max-width: 850px) ': {
            height: '6rem'
        }
    },
    businessProcessSelectedContainer: {
        color:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? '#000'
                : theme.palette.text.peachText,
        background:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.text.contrastText
                : theme.palette.text.default
    },
    pricingContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '1.5rem',
        paddingBottom: '1rem'
    },
    midContainer: {
        height: 'fit-content',
        maxHeight: '60rem',
        width: '100%',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    },
    problemAreaContainer: {
        overflowY: 'hidden',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
            width: '7px',
            height: '2rem'
        },
        '&::-webkit-scrollbar-button': {
            width: '7px'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            height: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#7F8CC9',
            borderRadius: '4px',
            height: '2rem'
        }
    },
    pricingKpiHolder: {
        display: 'flex',
        maxWidth: '25%',
        height: 'fit-content',
        flexWrap: 'wrap',
        marginTop: '1rem',
        marginLeft: '2rem',
        // Uncomment the following if required in future
        // background:
        //     localStorage.getItem('codx-products-theme') == 'dark'
        //         ? theme.palette.background.default
        //         : '#ffffff50',
        justifyContent: 'space-between',
        padding: '2rem 1rem',
        '@media (min-width: 768px) and (max-width: 1000px) ': {
            maxWidth: '40%'
        }
    },
    div: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        height: '100%',
        '@media (min-width: 768px) and (max-width: 1500px) ': {
            height: '20rem',
            overflowY: 'scroll',
            flexWrap: 'none',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
                width: '4px',
                height: '3px'
            },
            '&::-webkit-scrollbar-button': {
                width: '2rem',
                height: '0rem'
            },
            '&::-webkit-scrollbar-button:end': {
                width: '32rem',
                height: '2rem'
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                height: '2rem',
                width: '2rem'
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#7F8CC9',
                borderRadius: '4px',
                height: '2rem',
                width: '2rem'
            }
        }
    },
    kpiCardsHolder: {
        height: '35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.75),
        padding: theme.spacing(2),
        paddingTop: '0px',
        marginTop: theme.spacing(2),
        maxWidth: '70%',
        marginLeft: '4rem',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            width: '5.5px',
            height: '2rem'
        },
        '&::-webkit-scrollbar-button': {
            width: '5.5px'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            height: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#7F8CC9',
            borderRadius: '4px',
            height: '2rem'
        }
    },
    kpiCardsItem: {
        flex: 1,
        height: '15rem',
        width: '100%'
    },
    svgStyle: {
        position: 'absolute'
    },
    initialFlowContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    initialFlowHeading: {
        color: theme.palette.text.default,
        fontSize: '2.5rem',
        fontStyle: 'normal',
        fontWweight: 400,
        lineHeight: 'normal'
    },
    selectDriverIcon: {
        height: '25rem',
        width: '25rem'
    },
    businessPricingHeader: {
        color: theme.palette.text.default,
        fontSize: '1.75rem',
        marginLeft: '1rem',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 'normal',
        paddingTop: '0.75rem'
    },
    pricingItemContainer: {
        borderRadius: '4px',
        border: `0.1px solid ${theme.palette.text.contrastText}`,
        background:
            localStorage.getItem('codx-products-theme') == 'dark' ? '#00152D' : 'transparent',
        height: '6rem',
        '& div.MuiAccordionSummary-root': {
            padding: '0rem 1.6rem',
            justifyContent: 'center',
            verticalAlign: 'center'
        },
        '& div.MuiAccordionSummary-content': {
            margin: '0px 0px'
        }
    },
    foundation_buttonGroup: {
        '& .MuiButton-contained': {
            color:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContained.textColor
                    : theme.palette.text.peachText,
            backgroundColor:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContainedBusinessProcess.background
                    : theme.palette.text.default,
            borderColor: theme.ConnectedSystemDashboard.buttonContained.background
        },
        '& .MuiButton-outlined': {
            color:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonOutlined.textColor
                    : theme.palette.text.default,
            backgroundColor: 'transparent',
            borderColor:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.ConnectedSystemDashboard.buttonContainedBusinessProcess.background
                    : theme.palette.text.default
        }
    },
    foundation_buttonGroup_disabled: {
        opacity: '0.5'
    },
    pricingItemContainerEnabled: {
        borderBottom: `0.1px solid ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#ffffff30' : '#00000030'
        }`,
        background: localStorage.getItem('codx-products-theme') == 'dark' ? '#00152D' : '#EBF1FE',
        maxHeight: '6rem',
        '& div.MuiAccordionSummary-root': {
            padding: '0rem 1.6rem',
            justifyContent: 'center',
            verticalAlign: 'center'
        },
        '& div.MuiAccordionSummary-content': {
            margin: '0px 0px'
        },
        '& div.MuiAccordionSummary-content.Mui-expanded': {
            height: 'inherit'
        },
        '@media (min-width: 768px) and (max-width: 1000px) ': {
            maxHeight: '11rem'
        }
    },
    accordionDetailsContainer: {
        background:
            localStorage.getItem('codx-products-theme') == 'dark' ? 'transparent' : '#EBF1FE',
        paddingBottom: '1rem'
    },
    stakeHolderAccordion: {
        width: '100%',
        '&:before': {
            width: 0
        },
        '&:hover': {
            opacity: '1',
            color: theme.palette.text.default,
            background:
                localStorage.getItem('codx-products-theme') == 'dark'
                    ? theme.palette.background.default
                    : 'transparent'
        }
    },
    StakeHolderAccordionContainerMain: {
        background: 'transparent',
        boxShadow: '0px 0px 50px 0px rgba(255, 255, 255, 0.04)',
        fontSize: '1.5rem',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
        padding: '1rem 1rem 1rem 0rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        cursor: 'pointer',
        '@media (min-width: 768px) and (max-width: 1100px) ': {
            fontSize: '1.2rem'
        }
    },
    StakeHolderAccordionContainer: {
        background: 'transparent',
        boxShadow: '0px 0px 50px 0px rgba(255, 255, 255, 0.04)',
        fontSize: '1.5rem',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
        padding: '1.5rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
            background:
                localStorage.getItem('codx-products-theme') == 'dark' ? '#031426' : '#EBF1FE'
        }
    },
    stakeHolderSelected: {
        background: localStorage.getItem('codx-products-theme') == 'dark' ? '#031426' : '#EBF1FE'
    },
    stakeHolderModalSelected: {
        background: '#EBF1FE'
    },
    StakeHolderAccordionModalContainer: {
        width: 'auto',
        '&:hover': {
            background: '#EBF1FE'
        }
    },
    stakeHolderAccordionSummary: {
        height: '46px',
        borderRadius: '2px',
        border: '0.2px solid #FCA786',
        background:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.background.default
                : '#fff',
        pointerEvents: 'all',
        '& div.MuiAccordionSummary-root': {
            padding: '0rem 1.6rem',
            justifyContent: 'center',
            verticalAlign: 'center'
        },
        '& div.MuiAccordionSummary-content': {
            margin: '0px 0px'
        },
        '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: '0px 0px'
        }
    },
    stakeHoldersContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    stakeHolderDetails: {
        width: '100%',
        background:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.background.default
                : '#fff',
        position: 'absolute',
        transform: 'translateY(calc(-100% - 50px))',
        left: 0,
        height: 'fit-content',
        borderRadius: '2px',
        border: '0.2px solid #FCA786',
        paddingBottom: '1rem',
        paddingLeft: 0,
        zIndex: 10,
        '@media (min-width: 768px) and (max-width: 1200px) ': {
            height: '20rem',
            overflowX: 'hidden',
            overflowY: 'scroll',
            '&::-webkit-scrollbar': {
                width: '7px',
                height: '2rem'
            },
            '&::-webkit-scrollbar-button': {
                width: '7px',
                height: '8rem'
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                height: '2rem'
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#7F8CC9',
                borderRadius: '4px',
                height: '2rem'
            }
        }
    },
    solutionsHolder: {
        background: localStorage.getItem('codx-products-theme') == 'dark' ? '#031426;' : '#F4F6FA',
        backdropFilter: 'blur(10px)',
        paddingRight: '5rem',
        height: '3.5rem',
        width: '100%'
    },
    solutionAccordionDetails: {
        paddingLeft: '1rem',
        paddingRight: '2rem',
        height: 'fit-content',
        width: '99vw',
        background: localStorage.getItem('codx-products-theme') == 'dark' ? '#031426;' : '#F4F6FA'
    },

    solutionAccordionContainer: {
        borderRadius: '4px',
        border: '1px solid #B6B9BF',
        background: theme.palette.background.linearBackground,
        boxShadow: '0px 0px 50px 0px rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(8px)',
        fontSize: '1.75rem',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 'normal',
        textAlign: 'center',
        letterSpacing: '1px',
        padding: '1rem',
        marginLeft: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    solutionAccordianHiddenItemNumber: {
        width: '25px',
        height: '25px',
        margin: 'auto 0',
        background: theme.palette.background.linearBackground,
        border: '1px solid #B6B9BF',
        marginLeft: '2rem',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px'
    },
    pricingAccordion: {
        '&:hover': {
            opacity: '1',
            color: theme.palette.text.default
        }
    },
    pricingAccordionContainer: {
        marginBottom: '1rem',
        '& .MuiCollapse-entered': {
            height: '35rem !important'
        }
    },
    pricingAccordionHeading: {
        color: theme.palette.text.default,
        fontSize: '1.75rem',
        textTransform: 'capitalize',
        fontWeight: 500,
        lineHeight: '30px',
        letterSpacing: '1px',
        opacity: 1
    },
    pricingAccordionHeadingEnabled: {
        color:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.text.contrastText
                : theme.palette.text.default,
        fontSize: '1.75rem',
        textTransform: 'capitalize',
        fontWeight: 500,
        lineHeight: '30px',
        letterSpacing: '1px',
        opacity: 1,
        width: '30%',
        '@media (min-width: 768px) and (max-width: 1400px) ': {
            lineHeight: '23px'
        },
        '@media (min-width: 768px) and (max-width: 1200px) ': {
            fontSize: '1.4rem',
            lineHeight: '18px'
        }
    },
    pricingAccordionHeadingDisabled: {
        color: theme.palette.text.default,
        fontSize: '1.75rem',
        textTransform: 'capitalize',
        fontWeight: 500,
        lineHeight: '30px',
        letterSpacing: '1px',
        opacity: 0.7,
        width: '30%'
    },
    expandIcon: {
        fill: theme.palette.text.default,
        height: '3rem',
        width: '3rem'
    },
    expandIconSolution: {
        fill:
            localStorage.getItem('codx-products-theme') == 'dark'
                ? theme.palette.text.default
                : 'rgba(58, 117, 246, 1)',
        height: '4rem',
        width: '4rem'
    },
    stakeHolderName: {
        opacity: 0.8,
        fontWeight: 300,
        display: 'inline',
        width: 'fit-content',
        cursor: 'pointer'
    },
    stakeHolderIcon: {
        height: '3rem',
        width: '3rem',
        background: `var(--background, black)`,
        marginRight: '0.5rem',
        '@media (min-width: 768px) and (max-width: 1200px) ': {
            width: '2.5rem',
            height: '2.5rem'
        }
    },
    selectedIcon: {
        height: '3rem',
        width: '3rem',
        color: theme.palette.text.contrastText,
        marginLeft: '1rem',
        position: 'absolute',
        right: '10px'
    },
    selectedModalIcon: {
        height: '3rem',
        width: '3rem',
        color: '#3277B3',
        marginLeft: '1rem'
    },
    expandIconStakeHolder: {
        fill: theme.palette.text.default,
        height: '3rem',
        width: '3rem'
    },
    expandIconModalStakeHolder: {
        fill: '#000',
        height: '3rem',
        width: '3rem'
    },
    solutionContainer: {
        width: '98vw',
        display: 'flex',
        marginTop: 'auto',
        position: 'relative',
        background: localStorage.getItem('codx-products-theme') == 'dark' ? '#031426;' : '#F4F6FA',
        border: '1.5px solid',
        borderImageSlice: 1,
        borderImageSource: `linear-gradient(to bottom, ${
            localStorage.getItem('codx-products-theme') == 'dark' ? '#043E73' : '#4560D780'
        }, transparent)`,
        paddingLeft: '1rem'
    },
    minervaIcon: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    connSystemBusinessProcessContainer: {
        height: '1000px',
        position: 'absolute',
        '& div.functionLabel': {
            border: `1px solid ${
                localStorage.getItem('codx-products-theme') == 'dark' ? '#02E0FE' : '#687EDD'
            }`,
            color: theme.palette.text.default,
            padding: theme.spacing(1.25),
            borderRadius: '100px'
        },
        '& div.workflowLabel': {
            color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A'
        },
        '& div.workflowchildLabel': {
            color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
            width: 'fit-content'
        },
        '& div.foundationAppLabel': {
            color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
            padding: '1rem',
            border: '0.5px solid #02E0FE70',
            borderRadius: '3px',
            cursor: 'pointer',
            paddingLeft: '3rem',
            paddingRight: '3rem',
            background: theme.palette.background.linearBackground
        },
        '& div.foundationAppLabelSelected': {
            color: localStorage.getItem('codx-products-theme') == 'dark' ? '#FFFFFF' : '#091F3A',
            padding: '1rem',
            border: '0.5px solid #02E0FE70',
            borderRadius: '3px',
            cursor: 'pointer',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            opacity: '0.5'
        }
    },
    dialogTitleCustomStyles: {
        background: '#193554',
        '& > h2': {
            color: '#fff!important',
            fontSize: '2.6rem!important'
        }
    },
    dialogContentCustomStyle: {
        padding: 0,
        margin: 0,
        background: '#fff',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            width: '7px',
            height: '2rem'
        },
        '&::-webkit-scrollbar-button': {
            width: '7px',
            height: '8rem'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            height: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#7F8CC9',
            borderRadius: '4px',
            height: '2rem'
        }
    },
    popupFlowWrapper: {
        padding: '1.5rem 5rem 0'
    },
    decisionsFlowHead: {
        fontSize: '2.42rem',
        fontWeight: 300,
        padding: '1.5rem 5.7rem 0',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    decisionsFlowIcon: {
        fill: theme.palette.text.default,
        cursor: 'pointer'
    },
    dialogIconCustomStyle: {
        position: 'absolute',
        top: '10px',
        right: '0'
    },
    decisionFlowHolder: {
        maxWidth: '75%',
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
            width: '2px',
            height: '7px'
        },
        '&::-webkit-scrollbar-button': {
            width: '2rem',
            height: '2rem'
        },
        '&::-webkit-scrollbar-button:end': {
            width: '32rem',
            height: '2rem'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            height: '2rem',
            width: '2rem'
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#7F8CC9',
            borderRadius: '4px',
            height: '2rem',
            width: '2rem'
        }
    },
    modelWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid black',
        padding: '13px 20px',
        position: 'sticky',
        background: 'white',
        top: 0,
        zIndex: 2000
    },
    modelContainer: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '2rem',
        justifyContent: 'center',
        gap: '30px'
    },
    toolTipStyle: {
        padding: '2rem',
        backgroundColor:
            localStorage.getItem('codx-products-theme') === 'dark'
                ? '#091F3A'
                : theme.palette.text.default,
        position: 'relative',
        top: '-1rem',
        right: '5rem',
        ZIndex: 10,
        width: '250px',
        height: 'fit-content',
        textAlign: 'start',
        fontSize: '1.8rem',
        borderRadius: '0.5rem',
        color: theme.palette.text.peachText,
        fontWeight: '500',
        border: '1px solid' + theme.palette.text.default
    },
    arrowStyle: {
        '&:before': {
            backgroundColor: '#091F3A',
            border: '1px solid ' + theme.palette.text.default
        },
        fontSize: '22px'
    },
    linearProgress: {
        backgroundColor: '#BFBFC0',
        height: '8px',
        borderRadius: '4px',
        '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: '#58B51F',
            borderRadius: '4px'
        }
    },
    progressBarDiv: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '1rem'
    },
    progressBar: {
        width: '54vw',
        '@media (min-width: 768px) and (max-width: 1400px) ': {
            width: '42vw'
        }
    },
    completeText: {
        color: '#58B51F',
        fontSize: '13px',
        fontWeight: '500'
    },
    stakeHolderAccordionSummaryModal: {
        borderRadius: '2px',
        border: '2px solid #6191F8',
        background: '#fff',
        color: '#011E3B'
    },
    stakeHolderDetailsModal: {
        transform: 'none',
        marginTop: '.7rem',
        zIndex: 10,
        borderRadius: '2px',
        border: '1px solid #98B1ED',
        background: '#fff',
        color: '#011E3B'
    },
    modalStakeHolderContainer: {
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'end',
        width: '98%'
    },
    modalStakeHolder: {
        width: '40rem'
    },
    StakeHolderSelected: {
        fontSize: '1.5rem',
        fontStyle: 'normal',
        fontWeight: 200,
        lineHeight: 'normal'
    },
    unactiveStakeholders: {
        color: '#B6C1CD',
        cursor: 'default',
        opacity: localStorage.getItem('codx-products-theme') == 'dark' ? 0.4 : 1,
        '& span': {
            color: '#B6C1CD',
            cursor: 'default'
        },
        '&:hover': {
            background: 'none'
        }
    },
    gridMiddle: {
        // '@media (min-height: 500px) and (max-height: 800px)': {
        //     overflowY:'scroll',
        //     maxHeight:'30rem',
        //     overflowX:'hidden'
        // }
    }
});

export default businessProcessStyles;
