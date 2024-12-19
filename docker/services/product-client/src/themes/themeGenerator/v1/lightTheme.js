import { createTheme } from '@material-ui/core/styles';
import { createChartTheme } from '../utils';
import { GLOBAL_FONT_FAMILY, GLOBAL_FONT_FAMILY_ARRAY } from 'util/fontFamilyConfig';
export default function (
    contrast_color,
    chartColors,
    { mainColor, lightColor, darkColor, textColor }
) {
    const CODX_CONTRAST_LIGHT = contrast_color + '25';
    const CODX_CONTRAST = contrast_color;
    const CODX_WHITE = darkColor;
    const CODX_GREY_BKGD = mainColor;
    const CODX_BLUE_LIGHT = lightColor;
    const CODX_BLACK_TEXT = textColor;
    const CODX_BLACK_LIGHT_TEXT = '#00000050';
    const CODX_BORDER_COLOR = '#4767f5';
    const CODX_GREEN_TEXT = '#67F1C1';
    const CODX_BLACK_HOVER = '#00000007';
    const CODX_BLACK_SELECTED = '#00000012';
    const CODX_BLUE_NORMAL = '#0C2744';
    const CODX_BLUE_OPAQUE = '#E7F4FF';
    const CODX_BLUE_GREY = '#E9F0FD';
    const CODX_SPEECH_BLUE = '#3A54C1';
    // const CODX_HAWKES_BLUE = "#CEDDFB";
    const CODX_WILD_BLUE_YONDER = '#7F8CC9';
    const CODX_ROYAL_BLUE = '#4560D7';
    const CODX_MOON_RAKER = '#C5CEF2';
    const CODX_BLACK = '#000000';
    const CODX_BLUE_SKY_LIGHT = '#04B7CF';
    const CODX_LIGHT_GRAY = '#605C5C';
    const CODX_MODEL_LIGHTER = '#F6F6F6'; //'#E5E5E5';
    const CODX_MODEL_LIGHT = '#4560D722'; //#F5F5F5';
    const CODX_MODEL_LIGHT_BG = '#F1F3F4';
    const CODX_CONN_GOAL = '#94B804';

    const materialTheme = createTheme({
        palette: {
            primary: {
                main: CODX_GREY_BKGD,
                light: CODX_BLUE_LIGHT,
                dark: CODX_WHITE,
                altDark: CODX_GREY_BKGD,
                contrastText: CODX_CONTRAST,
                tooltip: CODX_WHITE,
                contrastTextLight: CODX_CONTRAST_LIGHT,
                highlight: CODX_BLUE_GREY
            },
            background: {
                paper: CODX_WHITE,
                default: CODX_GREY_BKGD,
                hover: CODX_BLACK_HOVER,
                selected: CODX_BLACK_SELECTED,
                info: CODX_BLUE_OPAQUE,
                input: CODX_BLUE_GREY,
                table: CODX_CONTRAST,
                message: CODX_SPEECH_BLUE,
                icon: CODX_WHITE,
                button: CODX_SPEECH_BLUE,
                tab: CODX_WHITE,
                details: CODX_GREY_BKGD,
                dialogTitle: CODX_MOON_RAKER,
                dialogBody:
                    'linear-gradient(111.81deg, rgba(234, 237, 243, 1) 2.32%, rgba(234, 237, 243, 0.4) 100.61%)',
                dialogInput: 'rgba(255, 255, 255, 1)',
                chip: 'rgba(255, 255, 255, 0.45)',
                scrollbar: CODX_WILD_BLUE_YONDER,
                markdownCode: CODX_WHITE,
                flowNode: CODX_WHITE,
                modelsView: CODX_MODEL_LIGHTER,
                modelsViewLight: CODX_MODEL_LIGHT,
                modelsViewHighLight: CODX_MODEL_LIGHT,
                modelsViewDark: CODX_MODEL_LIGHT_BG,
                dashboard: '#fbf2f2',
                envLabel: '#FFC700',
                prodEnvLabel: '#AA7EF0'
            },
            text: {
                default: CODX_BLACK_TEXT,
                green: CODX_GREEN_TEXT,
                breadcrumbText: CODX_WHITE,
                contrastText: CODX_CONTRAST,
                titleText: CODX_BLACK_TEXT,
                headingText: CODX_CONTRAST,
                buttonText: CODX_WHITE,
                light: CODX_BLACK_LIGHT_TEXT,
                inlineCode: CODX_ROYAL_BLUE,
                codxDefault: CODX_BLACK_TEXT,
                categoryText: '#D28B1F',
                unsavedText: '#e66e19',
                white: '#FFFFFF',
                black: '#000000'
            },
            textColor: CODX_BLACK_TEXT,
            border: {
                color: CODX_BORDER_COLOR,
                colorWithOpacity: 'rgba(12, 39, 68, 0.2)',
                button: CODX_SPEECH_BLUE,
                dashed: CODX_SPEECH_BLUE,
                tab: CODX_WHITE,
                light: 'rgba(14, 31, 56, 0.4)',
                dialogBorder: CODX_WHITE,
                chip: 'rgba(69, 96, 215, 0.5)',
                scroll: CODX_WILD_BLUE_YONDER,
                buttonOutline: CODX_ROYAL_BLUE,
                flowEdge: CODX_BLUE_SKY_LIGHT,
                nodeBorder: CODX_LIGHT_GRAY,
                goalCardBorder: CODX_CONN_GOAL,
                dashboard: '#979797',
                toolBar: '#617890'
            },
            icons: {
                color: CODX_BLUE_NORMAL,
                border: CODX_SPEECH_BLUE,
                background: CODX_SPEECH_BLUE,
                backgroundColorWithOpacity: 'rgba(58, 84, 193, 0.6)',
                nofile: CODX_BLACK
            },
            action: {
                disabled: CODX_WHITE,
                disabledBackground: CODX_CONTRAST_LIGHT
            },
            font: {
                roboto: 'Roboto'
            },
            logo: {
                hover: '#CCCCCC'
            },
            shadow: {
                dark: 'rgba(5, 22, 43, 0.5)'
            }
        },
        typography: {
            color: CODX_BLACK_TEXT,
            fonts: GLOBAL_FONT_FAMILY_ARRAY,
            fontFamily: GLOBAL_FONT_FAMILY
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '*::-webkit-scrollbar': {
                        width: '0.8rem',
                        height: '0.8rem'
                    },
                    '*::-webkit-scrollbar-track': {
                        // backgroundColor: CODX_CYAN,
                        borderRadius: '2rem'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#a7a7a7',
                        borderRadius: '2rem'
                        // border: '0.2rem solid ' + CODX_CYAN
                    }
                }
            },
            MuiFormControlLabel: {
                label: {
                    color: CODX_BLACK_TEXT
                }
            },
            MuiSwitch: {
                thumb: {
                    color: CODX_CONTRAST
                },
                root: {
                    '& span.Mui-checked + span.MuiSwitch-track': {
                        backgroundColor: CODX_CONTRAST + ' !important'
                    }
                },
                track: {
                    backgroundColor: CODX_CONTRAST + ' !important'
                }
            },
            MuiTabs: {
                root: {},
                indicator: {
                    backgroundColor: CODX_CONTRAST
                }
            },
            MuiTab: {
                root: {
                    color: CODX_BLACK_TEXT + ' !important',
                    backgroundColor: 'tranparent',
                    fontSize: '1.25rem',
                    '&:hover': {
                        backgroundColor: CODX_BLUE_LIGHT
                    },
                    borderRadius: '2rem'
                }
            },
            MuiButton: {
                root: {
                    color: CODX_CONTRAST,
                    backgroundColor: 'transparent',
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_CONTRAST,
                        backgroundColor: 'transparent'
                    }
                },
                contained: {
                    color: CODX_WHITE,
                    backgroundColor: CODX_CONTRAST,
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_WHITE,
                        backgroundColor: CODX_CONTRAST
                    }
                },
                outlined: {
                    backgroundColor: 'transparent',
                    border: '1px solid ' + CODX_CONTRAST,
                    color: CODX_CONTRAST,
                    '&:hover': {
                        opacity: '0.75',
                        backgroundColor: CODX_BLUE_LIGHT,
                        border: '1px solid ' + CODX_CONTRAST,
                        color: CODX_CONTRAST
                    }
                },
                text: {
                    color: CODX_CONTRAST,
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_CONTRAST
                    }
                },
                label: {
                    fontSize: '1.5rem'
                }
            },
            MuiIconButton: {
                root: {
                    marginRight: '0.8rem',
                    '&:hover': {
                        backgroundColor: CODX_BLUE_LIGHT
                    }
                },
                label: {
                    '& svg': {
                        color: CODX_CONTRAST,
                        cursor: 'pointer'
                    }
                }
            },
            MuiCardActionArea: {
                root: {
                    '&:hover': {
                        // backgroundColor: CODX_BLUE_LIGHT
                    }
                }
            },
            MuiAppBar: {
                colorPrimary: {
                    backgroundColor: CODX_WHITE,
                    color: CODX_BLUE_NORMAL
                }
            },
            MuiAccordion: {
                root: {
                    color: CODX_BLACK_TEXT,
                    backgroundColor: 'transparent',
                    fontSize: '1.5rem',
                    boxShadow: 'none',
                    '&:before': {
                        backgroundColor: CODX_BLACK_TEXT
                    },
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_CONTRAST,
                        backgroundColor: 'transparent'
                    },
                    '&$expanded': {
                        margin: 0
                    }
                }
            },
            MuiAccordionSummary: {
                root: {
                    '&$expanded': {
                        margin: 0,
                        minHeight: 'auto'
                    }
                },
                content: {
                    '&$expanded': {
                        margin: 0
                    }
                }
            },
            MuiAccordionDetails: {
                root: {
                    padding: '0 0 0 0.8rem'
                }
            },
            MuiPopover: {
                paper: {
                    backgroundColor: CODX_WHITE,
                    '& ul li': {
                        fontSize: '1.5rem',
                        color: CODX_CONTRAST
                    }
                }
            },
            MuiDialog: {
                paper: {
                    background:
                        'linear-gradient(111.81deg, rgba(234, 237, 243, 1) 2.32%, rgba(234, 237, 243, 0.4) 100.61%)',
                    backdropFilter: 'blur(2rem)',
                    border: '1px solid ' + CODX_WHITE
                }
            },
            MuiDialogTitle: {
                root: {
                    '& .MuiTypography-caption': {
                        fontSize: '1.75rem'
                    },
                    background: CODX_MOON_RAKER,

                    '& .MuiTypography-h6': {
                        fontSize: '2.2rem',
                        letterSpacing: '0.2rem',
                        color: CODX_BLACK_TEXT,
                        opacity: '0.8',
                        alignSelf: 'center'
                    }
                }
            },
            MuiDialogContent: {
                dividers: {
                    borderBottomColor: 'rgba(12, 39, 68, 0.2)'
                }
            },
            MuiDialogContentText: {
                root: {
                    color: CODX_BLACK_TEXT,
                    fontSize: '1.75rem'
                }
            },
            MuiContainer: {
                root: {
                    background: CODX_WHITE,
                    color: CODX_BLACK_TEXT
                }
            }
        },
        spacing: (factor) => `${0.8 * factor}rem`, // ex: = 0.8 * 1rem = 0.8rem = 8px
        htmlFontSize: 10,
        props: {
            mode: 'light'
        },
        HealthCareDashboard: {
            White: '#ffffff',
            Black: '#000000',
            BackgroundDark: '#0C2744',
            BackgroundLight: '#fcfcfc',
            RootBg: '#091F3A',
            PopoverBorder: '#3376b3',
            PopoverFill: '#eef7ff',
            edgelineLight: '#3277B3',
            labelDark: CODX_GREY_BKGD
        },
        ConnectedSystemDashboard: {
            text: '#091F3A',
            border: '#02E0FE',
            borderSecondary: '#008BB7',
            shadow: CODX_BLACK,
            banner: {
                yellow: '#BD8C0B',
                green: '#00CD2D',
                blue: '#06A2C5'
            },
            reactflow: {
                edgeOne: '#4560D7',
                edgeTwo: '#091F3A80',
                handleConnectable: '#0C8DB9'
            },
            sideDrawer: {
                border: '0.5px solid #091F3A80',
                background: 'rgba(255, 255, 255, 0.90)',
                edge: '#02BFD9'
            },
            decisionFlow: {
                arrowRight: {
                    stroke: {
                        default: '#000000',
                        selected: '#FFFFFF'
                    }
                },
                node: {
                    background: {
                        highlight: 'rgba(212, 223, 249, 0.6)',
                        selected: '#3A75F6'
                    }
                },
                subQuestion: '#D9D9D9',
                currentMarker: '#58B51F',
                excessStakeholder: '#BEC8D3'
            },
            goal: {
                cardBorder: '#B68F08',
                sideTag: 'linear-gradient(to right, #B68F08 40% , rgba(182, 143, 8, 0.2))'
            },
            initiative: {
                header: 'rgba(164, 204, 4, 0.8)'
            },
            intellegence: {
                border: 'none',
                rowLightBorder: 'rgba(9, 31, 58, 0.30)',
                rowLightBackground: '#F6F6F6'
            },
            popUp: {
                background: 'linear-gradient(134deg, #EAEDF3 0%, rgba(234, 237, 243, 0.40) 100%)',
                textColor: '#091F3A',
                highlightedText: '#4560D7',
                nodeBackground: '#F6F6F6',
                nodeBorder: '#4560D780',
                highlightedBackground: '#6883F720',
                headingColor: '#091F3A',
                headingBackground: '#D0DAEF',
                baseBackground:
                    'linear-gradient(131deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
                baseColor: '#091F3A',
                nodeBottom: '#091F3A40',
                secondHeading: '#4560D7',
                iconA: '#091F3A80',
                iconB: '#4560D7',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)'
            },
            kpiCard: {
                boxShadow: 'none',
                upArrow: '#81D290',
                downArrow: '#E1004B',
                infoIcon: '#42E4BC',
                labelText: 'rgba(9, 31, 58, 1)'
            },
            buttonContained: {
                textColor: '#FFFFFF',
                background: '#4560D7'
            },
            buttonOutlined: {
                textColor: '#4560D7'
            },
            buttonContainedBusinessProcess: {
                textColor: '#FFFFFF',
                background: '#3A75F6'
            }
        },

        Nofilesfiller: {
            icon: CODX_BLACK + 30,
            text: CODX_BLACK + 80
        }
    });

    const chartTheme = createChartTheme(
        chartColors,
        CODX_BLACK_TEXT,
        CODX_WHITE,
        CODX_BLUE_LIGHT,
        contrast_color
    );

    return { materialTheme, chartTheme };
}
