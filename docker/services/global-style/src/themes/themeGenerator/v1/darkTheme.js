import { createTheme } from '@material-ui/core/styles';
import { createChartTheme } from '../utils';
import { GLOBAL_FONT_FAMILY, GLOBAL_FONT_FAMILY_ARRAY } from '../../../util/fontFamilyConfig';
export default function (
    contrast_color,
    chartColors,
    { mainColor, lightColor, darkColor, textColor }
) {
    const CODX_CYAN_LIGHT = contrast_color + '25';
    const CODX_CYAN = contrast_color;
    const CODX_BLUE_DARK = darkColor;
    const CODX_BLUE_NORMAL = mainColor;
    const CODX_BLUE_LIGHT = lightColor;
    const CODX_GREY_TEXT = textColor;
    const CODX_GREY_LIGHT_TEXT = '#FFFFFF50';
    const CODX_AQUA = '#9afedb';
    const CODX_GREEN_TEXT = '#67F1C1';
    // const CODX_TITLE_TEXT = "#FFFFFF";
    const CODX_WHITE = '#FFFFFF';
    const CODX_WHITE_HOVER = '#FFFFFF07';
    const CODX_WHITE_SELECTED = '#FFFFFF12';
    const CODX_WHITE_TEXT = '#D5D5D5';
    const CODX_BLUE_OPAQUE = '#1F3E5E';
    const CODX_YELLOW_LIGHT = '#E1AD01';
    const CODX_BLUE_DARK_BACKGROUND = '#004084';
    const CODX_BLUE_DARK_BORDER = '#005EC2';
    const CODX_NOBEL = '#989898';
    const CODX_NILE_BLUE = '#193554';
    const CODX_JAVA = '#339F9B';
    const CODX_DARK_GREY = '#282c34';
    const CODX_ALTERNATE_LIGHT_BG = '#fcfcfc';
    const CODX_TOOLTIP_BACKGROUND = '#112C4D';
    const CODX_BLUE_NEW_OPAQUE = '#011E3B';
    const CODX_BLUE_SKY = '#7ACFFF';
    const CODX_BLACK = '#000000';
    const CODX_LIGHT_GRAY = '#7ACFFF';
    const CODX_MODEL_BLUE_DARK = '#011932';
    const CODX_MODEL_BLUE_LIGHT = '#1E3E5F';
    const CODX_MODEL_BLUE_HIGHLIGHT = '#07203b';
    const CODX_MODEL_BLUE_DARKER = '#051729';
    const CODX_CONN_GOAL = '#A4CC0480';

    const materialTheme = createTheme({
        palette: {
            primary: {
                main: CODX_BLUE_NORMAL,
                light: CODX_BLUE_LIGHT,
                dark: CODX_BLUE_DARK,
                altDark: CODX_BLUE_DARK,
                contrastText: CODX_CYAN,
                alternateLightBg: CODX_ALTERNATE_LIGHT_BG,
                tooltip: CODX_TOOLTIP_BACKGROUND,
                contrastTextLight: CODX_CYAN_LIGHT,
                highlight: CODX_NILE_BLUE
            },
            background: {
                paper: CODX_BLUE_DARK,
                default: CODX_BLUE_NORMAL,
                hover: CODX_WHITE_HOVER,
                selected: CODX_WHITE_SELECTED,
                info: CODX_BLUE_OPAQUE,
                input: 'rgba(0, 0, 0, 0.05)', // NOTE: WHY IS THIS HARDCODED HERE?
                table: CODX_CYAN,
                message: CODX_BLUE_DARK_BACKGROUND,
                icon: CODX_NOBEL,
                button: CODX_BLUE_DARK,
                tab: CODX_BLUE_NORMAL,
                details: CODX_BLUE_LIGHT,
                dialogTitle: CODX_NILE_BLUE,
                dialogBody:
                    'linear-gradient(111.81deg, rgba(56, 98, 141, 0.8) 2.32%, rgba(56, 98, 141, 0.15) 100.61%)',
                dialogInput: CODX_NILE_BLUE,
                chip: 'rgba(25, 53, 84, 0.4)',
                scrollbar: CODX_JAVA,
                markdownCode: CODX_DARK_GREY,
                alternateLightBg: CODX_ALTERNATE_LIGHT_BG,
                linearBackground:
                    'linear-gradient(123deg, #020E1B 0%, rgba(11, 18, 27, 0.00) 100%)',
                connectedSysBusinessUserLinearBackground: `linear-gradient(131deg, #0B121B 0%, rgba(11, 18, 27, 0.00) 100%)`,
                flowNode: CODX_BLUE_NEW_OPAQUE,
                modelsView: CODX_MODEL_BLUE_DARK,
                modelsViewLight: CODX_MODEL_BLUE_LIGHT,
                modelsViewHighLight: CODX_MODEL_BLUE_HIGHLIGHT,
                modelsViewDark: CODX_MODEL_BLUE_DARKER,
                dashboard: '#fbf2f2',
                envLabel: '#FFC700',
                prodEnvLabel: '#AA7EF0'
            },
            text: {
                default: CODX_GREY_TEXT,
                green: CODX_GREEN_TEXT,
                breadcrumbText: CODX_BLUE_DARK,
                contrastText: CODX_CYAN,
                titleText: CODX_WHITE,
                headingText: CODX_WHITE,
                buttonText: CODX_YELLOW_LIGHT,
                light: CODX_GREY_LIGHT_TEXT,
                inlineCode: CODX_AQUA,
                codxDefault: CODX_WHITE_TEXT,
                categoryText: '#D28B1F',
                unsavedText: '#e66e19',
                white: CODX_WHITE,
                black: '#000000'
            },
            textColor: CODX_GREY_TEXT,
            border: {
                color: CODX_AQUA,
                colorWithOpacity: 'rgba(154, 254, 219, 0.2)',
                button: CODX_YELLOW_LIGHT,
                dashed: CODX_BLUE_DARK_BORDER,
                tab: CODX_CYAN,
                light: 'rgba(255,255,255,0.5)',
                dialogBorder: 'rgba(95, 146, 198, 0.5)',
                chip: 'rgba(109, 240, 194, 0.3)',
                scroll: 'rgba(103, 241, 193, 0.6)',
                buttonOutline: CODX_CYAN,
                flowEdge: CODX_BLUE_SKY,
                nodeBorder: CODX_LIGHT_GRAY,
                goalCardBorder: CODX_CONN_GOAL,
                dashboard: '#979797',
                toolBar: '#617890'
            },
            icons: {
                color: CODX_BLUE_DARK,
                border: CODX_YELLOW_LIGHT,
                background: CODX_BLUE_DARK,
                backgroundColorWithOpacity: CODX_BLUE_NORMAL,
                nofile: CODX_WHITE
            },
            action: {
                disabled: CODX_BLUE_DARK,
                disabledBackground: CODX_CYAN_LIGHT
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
            color: CODX_GREY_TEXT,
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
                        backgroundColor: '#456990',
                        borderRadius: '2rem'
                        // border: '0.2rem solid ' + CODX_CYAN
                    }
                }
            },
            MuiSvgIcon: {
                root: {
                    color: CODX_GREY_TEXT
                }
            },
            MuiFormControlLabel: {
                label: {
                    color: CODX_GREY_TEXT
                }
            },
            MuiSwitch: {
                thumb: {
                    color: CODX_CYAN
                },
                root: {
                    '& span.Mui-checked + span.MuiSwitch-track': {
                        backgroundColor: CODX_CYAN + ' !important'
                    }
                },
                track: {
                    backgroundColor: CODX_BLUE_LIGHT + ' !important'
                }
            },
            MuiTabs: {
                root: {},
                indicator: {
                    backgroundColor: CODX_CYAN
                }
            },
            MuiTab: {
                root: {
                    color: CODX_GREY_TEXT + ' !important',
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
                    color: CODX_GREY_TEXT,
                    backgroundColor: 'transparent',
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_GREY_TEXT,
                        backgroundColor: 'transparent'
                    },
                    '&.Mui-disabled': {
                        color: CODX_GREY_TEXT,
                        opacity: '0.5'
                    }
                },
                contained: {
                    color: CODX_BLUE_DARK,
                    backgroundColor: CODX_CYAN,
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_BLUE_DARK,
                        backgroundColor: CODX_CYAN
                    },
                    '& svg': {
                        color: CODX_BLUE_DARK
                    }
                },
                outlined: {
                    backgroundColor: 'transparent',
                    border: '1px solid ' + CODX_CYAN,
                    color: CODX_CYAN,
                    '&:hover': {
                        opacity: '0.75',
                        backgroundColor: CODX_BLUE_LIGHT,
                        border: '1px solid ' + CODX_CYAN,
                        color: CODX_CYAN
                    }
                },
                text: {
                    color: CODX_CYAN,
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_CYAN
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
                        color: CODX_CYAN,
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
                    color: CODX_WHITE
                }
            },
            MuiAccordion: {
                root: {
                    color: CODX_GREY_TEXT,
                    backgroundColor: 'transparent',
                    fontSize: '1.5rem',
                    boxShadow: 'none',
                    '&:before': {
                        backgroundColor: CODX_GREY_TEXT
                    },
                    '&:hover': {
                        opacity: '0.75',
                        color: CODX_CYAN,
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
                    backgroundColor: CODX_BLUE_LIGHT,
                    '& ul li': {
                        fontSize: '1.5rem',
                        color: CODX_GREY_TEXT
                    }
                }
            },
            MuiDialog: {
                paper: {
                    background:
                        'linear-gradient(111.81deg, rgba(56, 98, 141, 0.8) 2.32%, rgba(56, 98, 141, 0.15) 100.61%)',
                    backdropFilter: 'blur(2rem)',
                    border: '1px solid ' + 'rgba(95, 146, 198, 0.5)'
                }
            },
            MuiDialogTitle: {
                root: {
                    '& .MuiTypography-caption': {
                        fontSize: '1.75rem'
                    },
                    background: CODX_NILE_BLUE,
                    '& .MuiTypography-h6': {
                        fontSize: '2.2rem',
                        letterSpacing: '0.2rem',
                        color: CODX_WHITE,
                        opacity: '0.8',
                        alignSelf: 'center'
                    }
                }
            },
            MuiDialogContent: {
                dividers: {
                    borderBottomColor: 'rgba(154, 254, 219, 0.2)'
                }
            },
            MuiDialogContentText: {
                root: {
                    color: CODX_WHITE,
                    fontSize: '1.75rem'
                }
            },
            MuiChip: {
                root: {
                    color: CODX_WHITE,
                    fontSize: '1.2em'
                }
            },
            MuiContainer: {
                root: {
                    background: CODX_BLUE_NORMAL,
                    color: CODX_WHITE
                }
            }
        },
        spacing: (factor) => `${0.8 * factor}rem`, // ex: = 0.8 * 1rem = 0.8rem = 8px
        htmlFontSize: 10,
        props: {
            mode: 'dark'
        },
        HealthCareDashboard: {
            White: '#ffffff',
            Black: '#000000',
            BackgroundDark: CODX_BLUE_NORMAL,
            BackgroundLight: '#fcfcfc',
            RootBg: CODX_BLUE_DARK,
            PopoverBorder: '#6ef0c2',
            PopoverFill: '#1f3e5e',
            edgelineLight: '#3277B3',
            labelDark: '#E5E5E5'
        },
        ConnectedSystemDashboard: {
            text: CODX_GREY_TEXT,
            border: '#02E0FE',
            borderSecondary: '#008BB7',
            shadow: CODX_BLACK,
            banner: {
                yellow: '#CD9400',
                green: '#00CD2D',
                blue: '#06A2C5'
            },
            reactflow: {
                edgeOne: '#6DF0C2',
                edgeTwo: '#FFFFFF80',
                handleConnectable: '#0C8DB9'
            },
            sideDrawer: {
                border: '0.5px solid #02E0FE80',
                background: '#091F3A',
                edge: '#7ACFFF'
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
                header: 'rgba(129, 181, 188, 1)'
            },
            intellegence: {
                border: '1px solid #023973',
                rowLightBorder: 'rgba(9, 31, 58, 0.30)',
                rowLightBackground: '#F6F6F6'
            },
            popUp: {
                background:
                    'linear-gradient(134deg, rgba(56, 98, 141, 0.80) 0%, rgba(56, 98, 141, 0.15) 100%)',
                textColor: '#FFFFFF',
                highlightedText: '#6DF0C2',
                nodeBackground: '#091F3A',
                nodeBorder: '#6DF0C290',
                highlightedBackground: '#173554',
                headingColor: '#FFFFFF80',
                headingBackground: '#193554',
                baseBackground: 'linear-gradient(131deg, #0B121B 0%, rgba(11, 18, 27, 0.00) 100%)',
                baseColor: '#FFFFFF',
                nodeBottom: '#FFFFFF80',
                secondHeading: '#6DF0C2',
                iconA: '#FFFFFF60',
                iconB: '#6DF0C290',
                boxShadow: 'none'
            },
            kpiCard: {
                boxShadow: '0px 0px 11px 0px rgba(0, 0, 0, 0.40)',
                upArrow: '#81D290',
                downArrow: '#FF0000',
                infoIcon: '#42E4BC',
                labelText: 'rgba(255, 255, 255, 0.7)'
            },
            buttonContained: {
                textColor: '#091F3A',
                background: '#5BCBA4'
            },
            buttonOutlined: {
                textColor: CODX_CYAN
            },
            buttonContainedBusinessProcess: {
                textColor: '#091F3A',
                background: '#5BCBA4'
            }
        },
        Nofilesfiller: {
            icon: CODX_WHITE + 30,
            text: CODX_WHITE + 80
        }
    });

    const chartTheme = createChartTheme(
        chartColors,
        CODX_WHITE,
        CODX_BLUE_DARK,
        CODX_BLUE_LIGHT,
        contrast_color
    );

    return { materialTheme, chartTheme };
}
