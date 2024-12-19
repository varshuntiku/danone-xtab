import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { createChartTheme, getCommonThemeConfig, convertPxToRem } from '../utils';
import { GLOBAL_FONT_FAMILY_ARRAY } from 'util/fontFamilyConfig';
export default function (
    contrast_color,
    chartColors,
    {
        mainColor,
        lightColor,
        darkColor,
        textColor,
        fontFamily,
        secondaryColor,
        gridColor,
        fontWeight,
        textTransform,
        fontSize,
        opacity,
        letterSpacing,
        color,
        lineHeight
    }
) {
    const CODX_CYAN_LIGHT = contrast_color + '25';
    const CODX_CYAN = contrast_color;
    const CODX_BLUE_DARK = darkColor;
    const CODX_BLUE_NORMAL = mainColor;
    const CODX_BLUE_LIGHT = lightColor;
    const CODX_GREY_TEXT = textColor;
    const INFO_BG_DARK = secondaryColor;
    const CODX_GREY = gridColor;
    const CODX_GREY_LIGHT_TEXT = '#FFFFFF50';
    const CODX_AQUA = '#9afedb';
    const CODX_GREEN_TEXT = '#67F1C1';
    const CODX_INDICATOR_GREEN_TEXT = '#2DB183';
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
    const CODX_INDICATOR_RED = '#CF5F6A';
    const CODX_INDICATOR_GREEN = '#2DB183';
    const CODX_BLUE_LIGHTER = '#1E1429';
    const CODX_GREY_DARK = '#FFF0EEE5';
    const CODX_GREY_HOVER = '#1E1429';
    const CODX_GRAY_SELECTED = 'rgba(255, 255, 255, 0.08)';
    const CODX_GREY_SEPARATOR = '#EDEBF033';
    const CODX_DARK_GREY_BKGD = '#E9E5ED';
    const CODX_PURE_WHITE = '#0E0617';
    const CODX_GREY_OVERLAY = '#0E0617';
    const CODX_ICON_BLUE = '#FFA497';
    const CODX_GREYISH_BLUE = '#1E1429';
    const CODX_GREY_BORDER = '#EDEBF052';
    const CODX_RED_ERROR = '#CF5F6A';
    const CODX_GREY_MENU_ITEM_HOVER = '#2E233A';
    const CODX_GREY_MENU_ITEM_FOCUS = '#39263B'; //rgba(229, 142, 166, 0.12)';
    const CODX_RED_LIGHT_ERROR = '#E81762';
    const CODX_HIGHLIGHT_TEXT = '#F2BC5C';
    const CODX_INPUT_FOCUS = '#FFA497';
    const CODX_PURPLE_LIGHT = '#FFF0EE5C';
    const CODX_FOOTER_GRAY = '#FFF0EE66';
    const CODX_DARK_BACKGROUND = '#0E0617';
    const CODX_LOGO_PEACH = '#FFA497';
    // const CODX_PINK_HIGHLIGHT = '#9ECBFFCC';
    const CODX_ICON_CONTRAST = '#FFF0EE';
    const CODX_MODULE_BUTTON = '#693985';
    const CODX_MODULE_BTN_TEXT = '#FFA497';
    const CODX_MODEL_BACKGROUND = '#251C2E';
    const CODX_CLOSE_ICON = '#FFA497';
    const CODX_PEACH_TEXT = '#FFA497';
    const CODX_INPUT_BORDER_FOCUS = '#FFA497CC';
    const CODX_INPUT_BORDER_HOVER = '#EDEBF099';
    const CODX_DATE_SELECTED = '#FFA497';
    const CODX_PURPLE_TEXT = '#220047';
    const CODX_DATE_PICKER_BG = '#180D24';
    const LOGIN_INP_BORDER = '#EDEBF0';
    const LOGIN_SEPRATOR = '#FFF0EE26';
    const CODX_SSO_BTN_BORDER = '#FFF0EE26';
    const CODX_LOGIN_SEPRATOR = '#FFF0EE26';
    const CODX_UTILS_BG = '#0E0617';
    const CODX_HOVER_ICON_COLOR = '#FFF0EE';
    const CODX_BTN_DISABLED_COLOR = '#80524C';
    const SUCCESS_DARK = '#2DB183';
    const CODX_FILTER_VERTICAL_LINE = '#FFF0EE40';
    const CODX_OULINE_BTN_HOVER = '#352048';
    const CODX_BTN_TEXT_COLOR_DARK = '#220047';
    const CODX_AI_INSIGHT_OVERLAY = '#0B001833';
    const CODX_PURPLE_TAUPE = '#4C3D52';
    const CODX_DEEP_TURQUOISE = '#22393F';
    const CODX_REDDISH_PINK = '#FB5B66';
    const CODX_PALE_PINK = '#F6ECEB';
    const CODX_DYNAMIC_FROM_SCROLL = 'rgba(191, 153, 189, 0.60)';
    const CODX_TOOLTIP_TEXT_COLOR = '#FFF0EECC';
    const CODX_APP_HOME_BANNER = '#31365052';
    const CODX_POPOVER_BORDER = '#322937';
    const CODX_SILVER_PINK = '#C2BABE';
    const CODX_WARM_IVORY = '#FAE4BE';
    const CODX_BREADCRUMB_SCREEN = '#fff';
    const CODX_PROFILE_HOVER = '#BC99D1';
    const FIELD_DISABLED_BG = '#251C2E';
    const DISABLED_LABEL = '#806694';
    const CODX_PROGRESS_NON_ACTIVE = '#999999';
    const CODX_BLUE = '#21182CF2';
    const CODX_BLUE_BACKGROUND = '#1B1027';
    const CODX_BORDER_BLUE = '#3A2B40';
    const CODX_TITLE_BORDER_GREY = '#3A2B4099';
    const CODX_ROW_FREEZING = '#4C3D52';
    const CODX_TEXT_LABEL_BLACK="#ffffff"

    const commonThemeConfig = getCommonThemeConfig({
        fontFamily,
        fontWeight,
        textTransform,
        fontSize,
        opacity,
        letterSpacing,
        color,
        lineHeight
    });

    let materialTheme = createTheme(commonThemeConfig);
    materialTheme = createTheme(materialTheme, {
        palette: {
            primary: {
                main: '#1E1429',
                light: CODX_BLUE_LIGHT,
                dark: CODX_DARK_BACKGROUND,
                contrastText: CODX_CYAN,
                alternateLightBg: CODX_ALTERNATE_LIGHT_BG,
                tooltip: CODX_TOOLTIP_BACKGROUND,
                contrastTextLight: CODX_CYAN_LIGHT,
                highlight: CODX_NILE_BLUE,
                purpleLight: CODX_PURPLE_LIGHT
            },
            error: {
                main: '#CF5F6A'
            },
            background: {
                paper: CODX_DARK_BACKGROUND,
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
                dialogTitle: CODX_PURE_WHITE,
                dialogBody: CODX_PURE_WHITE,
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
                prodEnvLabel: '#AA7EF0',
                tableHeader: CODX_BLUE_LIGHTER,
                tableHover: CODX_GREY_HOVER,
                tableSelcted: CODX_GRAY_SELECTED,
                navLinkBackground: '#E58EA61F',
                simulatorRail: '#D3CCDA',
                filterToolTip: '#4E336C',
                darkGrey: CODX_DARK_GREY_BKGD,
                pureWhite: CODX_PURE_WHITE,
                overlay: CODX_GREY_OVERLAY,
                greyishBlue: CODX_GREYISH_BLUE,
                menuItemHover: CODX_GREY_MENU_ITEM_HOVER,
                menuItemFocus: CODX_GREY_MENU_ITEM_FOCUS,
                highlightText: CODX_HIGHLIGHT_TEXT,
                connTabBack: '#E3EDFA',
                connProgressBar: '#2ECDAA',
                white: '#FFFFFF',
                connBoxShadow: '#A5CCFC25',
                connQueryInput: '#B5AAC2',
                insightSuccess: '#2DB183',
                insightFailure: 'rgba(207, 95, 106, 1)',
                insightNeutral: '#C8BE87',
                insightBorder: 'rgba(255, 240, 238, 0.12)',
                customSwitchBg: 'rgba(119, 119, 119, 1)',
                progressBarBg: '#D9D9D9',
                filterCategories: CODX_BLUE_LIGHTER,
                filterCategorySelected: '#2E233A',
                moduleBtn: CODX_MODULE_BUTTON,
                modelBackground: CODX_MODEL_BACKGROUND,
                infoBgDark: INFO_BG_DARK,
                dateSelected: CODX_DATE_SELECTED,
                datePickerBg: CODX_DATE_PICKER_BG,
                utilsBackground: CODX_UTILS_BG,
                overviewSelected: 'rgba(229, 142, 166, 0.12)',
                overviewTabBg: '#322937',
                uploadBg: '#21182C',
                successDark: SUCCESS_DARK,
                plainBtnBg: CODX_OULINE_BTN_HOVER,
                aiInsightOverlay: CODX_AI_INSIGHT_OVERLAY,
                chipRevampBg: CODX_PURPLE_TAUPE,
                infoSuccess: CODX_DEEP_TURQUOISE,
                infoError: CODX_INDICATOR_RED,
                tooltipBg: CODX_PURPLE_TAUPE,
                cardItemFocus: CODX_PEACH_TEXT,
                cardItemHover: CODX_PALE_PINK,
                orchestratorBg: '#4C3D52',
                warningBg: '#C8BE87',
                infoBg: '#6B4D82',
                drawerRemoveIcon: '#7C879566',
                lightHover: 'rgba(53, 32, 72, 1)',
                tooltipBackground: '#4A4F69',
                appHomeBanner: CODX_APP_HOME_BANNER,
                timelineDot: CODX_PURPLE_TAUPE,
                markdownHighlight: '#C8BE87',
                profileHover: CODX_PROFILE_HOVER,
                field_disabled_bg: FIELD_DISABLED_BG,
                freezeCol: CODX_ROW_FREEZING,
                dataStoryBar: CODX_WHITE,
                progressNonActive: CODX_PROGRESS_NON_ACTIVE,
                blueBg: CODX_BLUE,
                cardBg: CODX_BLUE_BACKGROUND,
                buttonBg: CODX_BLUE
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
                inlineCode: CODX_DATE_SELECTED,
                codxDefault: CODX_WHITE_TEXT,
                categoryText: '#D28B1F',
                unsavedText: '#e66e19',
                white: CODX_WHITE,
                black: '#000000',
                indicatorGreenText: CODX_INDICATOR_GREEN_TEXT,
                table: CODX_GREY_DARK,
                peachText: CODX_PEACH_TEXT,
                revamp: '#FFF0EECC',
                error: CODX_RED_ERROR,
                filtersError: CODX_RED_LIGHT_ERROR,
                connSystemSubProcess: '#8F7A64',
                connLegendColor: '#0E1F38',
                connProjectionText: '#00A582',
                connHighlight: '#478BDB',
                connNucliosBorder: '#5F005925',
                footerVersion: CODX_FOOTER_GRAY,
                sidebarSelected: CODX_LOGO_PEACH,
                hightlightFilter: INFO_BG_DARK,
                moduleBtnText: CODX_MODULE_BTN_TEXT,
                purpleText: CODX_PURPLE_TEXT,
                chooseFileText: INFO_BG_DARK,
                secondaryText: CODX_PEACH_TEXT,
                overviewTabText: 'rgba(255, 240, 238, 0.8)',
                btnTextColor: CODX_BTN_TEXT_COLOR_DARK,
                tooltipTextColor: CODX_TOOLTIP_TEXT_COLOR,
                breadcrumbScreen: CODX_BREADCRUMB_SCREEN,
                profileText: '#51236B',
                disabledLabel: DISABLED_LABEL,
                title: CODX_HOVER_ICON_COLOR,
                dataStoryText: CODX_PURPLE_TEXT,
                labeltext:CODX_TEXT_LABEL_BLACK
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
                toolBar: '#617890',
                grey: CODX_GREY_BORDER,
                inputFocus: CODX_INPUT_FOCUS,
                loginGrid: '#FFF0EE26',
                categoriesRight: '#FFF0EE26',
                themeToggle: '#8046A180',
                inputOnFoucs: CODX_INPUT_BORDER_FOCUS,
                inputOnHover: CODX_INPUT_BORDER_HOVER,
                LoginInpBorder: LOGIN_INP_BORDER,
                ssoBtnBorder: CODX_SSO_BTN_BORDER,
                loginSeprator: CODX_LOGIN_SEPRATOR,
                overViewUploadBorder: 'rgba(237, 235, 240, 0.32)',
                filterVerticalBorder: CODX_FILTER_VERTICAL_LINE,
                industryLight: LOGIN_SEPRATOR,
                dynamicFormScrollBar: CODX_DYNAMIC_FROM_SCROLL,
                popOverBorder: CODX_POPOVER_BORDER,
                tableDivider: CODX_CYAN,
                timelineDot: CODX_SILVER_PINK,
                markdownHighlight: CODX_WARM_IVORY,
                navSelectionBorder: CODX_CYAN,
                cardBorder: CODX_BORDER_BLUE,
                titleBorder: CODX_TITLE_BORDER_GREY,
                buttonBorder: CODX_LOGO_PEACH,
                dataStoryIcon: '#220047',
                widgetFilterIcon: CODX_ICON_CONTRAST
            },
            icons: {
                color: CODX_BLUE_DARK,
                border: CODX_YELLOW_LIGHT,
                background: CODX_BLUE_DARK,
                backgroundColorWithOpacity: CODX_BLUE_NORMAL,
                nofile: CODX_WHITE,
                indicatorRed: CODX_INDICATOR_RED,
                indicatorGreen: CODX_INDICATOR_GREEN,
                selectedBlue: CODX_ICON_BLUE,
                ratingColor: 'rgba(242, 188, 92, 1)',
                topNav: CODX_GREY_TEXT,
                contrast: CODX_ICON_CONTRAST,
                darkTheme: '#220047',
                closeIcon: CODX_CLOSE_ICON,
                iconHoverColor: CODX_HOVER_ICON_COLOR,
                uploadIcon: CODX_PEACH_TEXT,
                successIconFill: SUCCESS_DARK,
                errorIconFill: CODX_REDDISH_PINK,
                minusIcon: CODX_WHITE,
                grey: '#7C8795'
            },
            action: {
                disabled: CODX_BLUE_DARK,
                disabledBackground: CODX_CYAN_LIGHT
            },
            font: {
                roboto: 'Roboto'
            },
            logo: {
                hover: '#CCCCCC',
                nuclios: CODX_LOGO_PEACH
            },
            shadow: {
                dark: 'rgba(5, 22, 43, 0.5)',
                ssoButton: '#B9D9FF'
            },
            separator: {
                grey: CODX_GREY,
                tableContent: CODX_GREY_SEPARATOR,
                loginSeprator: LOGIN_SEPRATOR
            }
        },
        typography: {
            color: CODX_GREY_TEXT,
            fonts: GLOBAL_FONT_FAMILY_ARRAY
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    '*::-webkit-scrollbar': {
                        width: convertPxToRem(8.5),
                        height: '0.8rem'
                    },
                    '*::-webkit-scrollbar-track': {
                        borderRadius: `${6 / 10.368}rem`
                    },
                    '*::-webkit-scrollbar-thumb': {
                        border: '0.5px solid ' + 'rgba(191, 153, 189, 0.60)',
                        borderRadius: `${6 / 10.368}rem`,
                        backdropFilter: `blur(${5 / 10.368}rem)`
                    }
                }
            },
            MuiSvgIcon: {
                root: {
                    color: CODX_PEACH_TEXT,
                    willChange: 'transform'
                }
            },
            MuiFormControlLabel: {
                label: {
                    color: CODX_GREY_TEXT
                }
            },
            MuiSwitch: {
                sizeSmall: {
                    width: '5.2rem',
                    height: '2.4rem',
                    padding: 0,
                    margin: '0.8rem',
                    '& .Mui-checked .MuiSwitch-thumb': {
                        backgroundColor: CODX_PURPLE_TEXT + ' !important',
                        opacity: 1
                    },
                    '& $switchBase': {
                        padding: 0,
                        left: '0.3rem',
                        top: '0.2rem',
                        '&$checked': {
                            transform: `translateX(2.6rem)`,
                            '& + $track': {
                                backgroundColor: CODX_PEACH_TEXT + '!important',
                                opacity: 1,
                                border: 'none'
                            }
                        }
                    },
                    '& $thumb': {
                        backgroundColor: CODX_PEACH_TEXT,
                        width: '2rem',
                        height: '2rem'
                    },
                    '& $track': {
                        backgroundColor: 'transparent' + ' !important',
                        opacity: 1,
                        border: '1px solid' + CODX_PEACH_TEXT,
                        borderRadius: 24 / 2
                    }
                },
                thumb: {
                    backgroundColor: CODX_PEACH_TEXT
                },
                root: {
                    '& span.Mui-checked + span.MuiSwitch-track': {
                        backgroundColor: CODX_PEACH_TEXT + ' !important',
                        opacity: 1
                    },
                    '& .Mui-checked .MuiSwitch-thumb': {
                        backgroundColor: CODX_PURPLE_TEXT + ' !important',
                        opacity: 1
                    }
                },
                track: {
                    backgroundColor: 'transparent' + ' !important',
                    opacity: 1,
                    border: '1px solid' + CODX_PEACH_TEXT
                }
            },
            MuiTabs: {
                root: {},
                indicator: {
                    backgroundColor: '#FFF0EECC'
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
            MuiTouchRipple: {
                root: {
                    display: 'none'
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
                    },
                    textTransform: 'capitalize',
                    borderRadius: '0.4rem'
                },
                contained: {
                    color: CODX_BLUE_DARK,
                    backgroundColor: CODX_CYAN,
                    fontSize: '1.5rem',
                    '&$disabled': {
                        backgroundColor: CODX_BTN_DISABLED_COLOR,
                        color: CODX_PURPLE_TEXT,
                        '& svg': { fill: CODX_PURPLE_TEXT }
                    },
                    '&:hover': {
                        opacity: 1,
                        color: CODX_BLUE_DARK,
                        backgroundColor: CODX_CYAN,
                        boxShadow: '1px 1px 4px 0px rgba(255, 164, 151, 0.70)'
                    },
                    '& svg': {
                        color: CODX_BLUE_DARK
                    },
                    '&:active': {
                        '&:after': {
                            display: 'none'
                        }
                    },
                    '&:focus': {
                        position: 'relative',
                        outline: '1px solid #FFA497',
                        borderRadius: '2px',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            borderRadius: '2px',
                            border: '3px solid #220047'
                        }
                    },
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                outlined: {
                    backgroundColor: 'transparent',
                    border: '0.5px solid ' + `${CODX_CYAN}99`,
                    color: CODX_CYAN,
                    fontSize: '1.5rem',
                    '&$disabled': {
                        border: `.5px solid ${CODX_BTN_DISABLED_COLOR}`,
                        color: CODX_BTN_DISABLED_COLOR,
                        '& svg': { fill: CODX_BTN_DISABLED_COLOR }
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                        opacity: 1,
                        border: '0.5px solid ' + CODX_CYAN + '!important',
                        color: CODX_CYAN,
                        boxShadow: '1px 1px 4px 0px rgba(255, 164, 151, 0.60)'
                    },
                    '&:active': {
                        backgroundColor: 'transparent',
                        opacity: 1,
                        border: '0.5px solid ' + CODX_CYAN + '!important',
                        color: CODX_CYAN,
                        '&:after': {
                            display: 'none'
                        }
                    },
                    '&:focus': {
                        outline: '.5px solid #FFA497',
                        borderRadius: '2px',
                        border: '3px solid #0E0617 !important',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            borderRadius: '2px',
                            border: '0.5px solid ' + `${CODX_CYAN}99`
                        }
                    },
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                containedSizeSmall: {
                    fontSize: '1.5rem',
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem',
                    '&$disabled': {
                        color: '#220047',
                        backgroundColor: CODX_BTN_DISABLED_COLOR,
                        '& svg': { fill: CODX_PURPLE_TEXT }
                    }
                },
                outlinedSizeSmall: {
                    fontSize: '1.5rem',
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem',
                    '&$disabled': {
                        border: `.5px solid ${CODX_BTN_DISABLED_COLOR}`,
                        color: CODX_BTN_DISABLED_COLOR,
                        '& svg': { fill: CODX_BTN_DISABLED_COLOR }
                    },
                    '&:hover': {
                        backgroundColor: 'transparent',
                        opacity: 1,
                        border: '0.5px solid ' + CODX_CYAN + '!important',
                        color: CODX_CYAN,
                        boxShadow: '1px 1px 4px 0px rgba(255, 164, 151, 0.60)'
                    }
                },
                text: {
                    color: CODX_CYAN,
                    textTransform: 'capitalize',
                    letterSpacing: '1.5px',
                    '&:hover': {
                        backgroundColor: CODX_OULINE_BTN_HOVER,
                        color: CODX_CYAN,
                        opacity: 1
                    },
                    '&$disabled': {
                        color: CODX_BTN_DISABLED_COLOR,
                        '& svg': { fill: CODX_BTN_DISABLED_COLOR }
                    }
                },
                label: {
                    fontFamily: 'Graphik',
                    textTransform: 'capitalize',
                    fontSize: convertPxToRem(16),
                    fontWeight: 500,
                    letterSpacing: convertPxToRem(0.5)
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
                        margin: 0,
                        backgroundColor: CODX_GREY_MENU_ITEM_HOVER
                    }
                }
            },
            MuiAccordionSummary: {
                root: {
                    '&$expanded': {
                        margin: 0,
                        minHeight: 'auto',
                        color: CODX_PEACH_TEXT,
                        '& svg': {
                            fill: CODX_CYAN
                        }
                    }
                },
                content: {
                    '&$expanded': {
                        margin: 0,
                        color: CODX_PEACH_TEXT
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
                    background: CODX_MODEL_BACKGROUND,
                    backdropFilter: 'blur(2rem)'
                }
            },
            MuiDialogTitle: {
                root: {
                    '& .MuiTypography-caption': {
                        fontSize: '1.75rem'
                    },
                    background: CODX_MODEL_BACKGROUND,
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
                    borderTopColor: LOGIN_SEPRATOR,
                    borderBottomColor: LOGIN_SEPRATOR
                }
            },
            MuiDialogContentText: {
                root: {
                    color: CODX_WHITE,
                    fontSize: '1.75rem'
                }
            },
            MuiPaper: {
                rounded: {
                    borderRadius: '0'
                }
            },
            MuiChip: {
                root: {
                    color: CODX_WHITE,
                    fontSize: '1.2em'
                }
            },
            MuiFormLabel: {
                asterisk: {
                    color: '#CF5F6A',
                    marginLeft: '.5rem'
                }
            },
            MuiListSubheader: {
                sticky: {
                    backgroundColor: CODX_BLUE_LIGHTER
                }
            },
            MuiFilledInput: {
                root: {
                    backgroundColor: CODX_GRAY_SELECTED,
                    '&:hover': {
                        backgroundColor: CODX_GRAY_SELECTED
                    }
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
                edgeOne: '#FFA497',
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
                highlightedText: '#FFA497',
                nodeBackground: '#091F3A',
                nodeBorder: '#FFA49790',
                highlightedBackground: '#173554',
                headingColor: '#FFFFFF80',
                headingBackground: '#193554',
                baseBackground: 'linear-gradient(131deg, #0B121B 0%, rgba(11, 18, 27, 0.00) 100%)',
                baseColor: '#FFFFFF',
                nodeBottom: '#FFFFFF80',
                secondHeading: '#FFA497',
                iconA: '#FFFFFF60',
                iconB: '#FFA49790',
                boxShadow: 'none'
            },
            kpiCard: {
                boxShadow: '0px 0px 11px 0px rgba(0, 0, 0, 0.40)',
                upArrow: '#81D290',
                downArrow: '#E1004B',
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
            },
            processCardBackground: '#DDE7F750',
            selectedProcessBackground: '#EAE3D730',
            progressBlockUnfill: '#B0CBC5',
            connectedSystemPositive: '#BFECE1',
            connectedSystemNegative: '#F6C7CF',
            blockerTextColor: '#FB5B66',
            avatarGreen: CODX_INDICATOR_GREEN_TEXT,
            avatarBlue: INFO_BG_DARK,
            avatarNormal: '#22004750',
            interactionGreen: '#65CAAB',
            interactionBlue: '#5594DD',
            interactionText: '#0D58AF',
            interactionTabBackgroundGreen: '#7DD2B990',
            interactionTabBackgroundBlue: '#478BDB90'
        },
        IndustryDashboard: {
            background: {
                color: 'radial-gradient(75% 75% at 0% 100%, #642e3c -50%, transparent 100%), radial-gradient(55% 100% at 100% 100%, #312e35 50%, transparent 100%), radial-gradient(45% 70% at 30% 0%, #2c2e44 30%, transparent 90%)',
                backdropFilter: 'blur(50px)',
                cardHover: '#2E233A'
            },
            border: {
                light: '#FFF0EE26'
            }
        },
        FunctionDashboard: {
            background: {
                cardHover: '#2E233A',
                logoWrapperColor:
                    'linear-gradient(80deg, #35125B -9.98%, rgba(215, 80, 128, 0.67) 92.04%, #DCBA43 213.57%)'
            }
        },
        ApplicationDashboard: {
            background: {
                bgColor: '#1E1429',
                cardHover: '#2E233A',
                selectedItemBg: 'linear-gradient(to right, #330F43 0%, #8E3BB1 50%, #F6909C 100%)',
                searchInputBg: 'rgba(255, 255, 255, 0.08)',
                iconHover:
                    'linear-gradient(80deg, #35125B -9.98%, rgba(215, 80, 128, 0.67) 92.04%, #DCBA43 213.57%)'
            }
        },
        Nofilesfiller: {
            icon: CODX_WHITE + 30,
            text: CODX_WHITE + 80
        }
    });

    const kpiFontBase = {
        fontFamily: fontFamily.kpiTitle,
        letterSpacing: letterSpacing.kpiLetterSpacing,
        opacity: opacity.kpiOpacity,
        textTransform: textTransform.kpiCase
    };

    materialTheme = createTheme(materialTheme, {
        overrides: {
            MuiTypography: {
                root: {
                    '&[data-variant="k1"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k1,
                        fontSize: fontSize.k1,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k1
                        }
                    },
                    '&[data-variant="k2"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k1,
                        fontSize: fontSize.k2,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k2
                        }
                    },
                    '&[data-variant="k3"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k1,
                        fontSize: fontSize.k3,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k3
                        }
                    },
                    '&[data-variant="k4"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k1,
                        fontSize: fontSize.k4,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k4
                        }
                    },
                    '&[data-variant="k5"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k1,
                        fontSize: fontSize.k5,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k5
                        }
                    },
                    '&[data-variant="k6"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k6,
                        fontSize: fontSize.k6,
                        lineHeight: lineHeight.k6,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k6
                        }
                    },
                    '&[data-variant="k7"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k7,
                        fontSize: fontSize.k7,
                        whiteSpace: 'nowrap',
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k7
                        }
                    },
                    '&[data-variant="k8"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k8,
                        fontSize: fontSize.k8,
                        lineHeight: fontWeight.k8,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k8
                        }
                    },
                    '&[data-variant="k9"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k9,
                        fontSize: fontSize.k9,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k9
                        }
                    },
                    '&[data-variant="k10"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k10,
                        fontSize: fontSize.k10,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k10
                        }
                    },
                    '&[data-variant="k11"]': {
                        ...kpiFontBase,
                        fontWeight: fontWeight.k11,
                        fontSize: fontSize.k11,
                        fontFamily: fontFamily.k11,
                        letterSpacing: letterSpacing.k11,
                        lineHeight: lineHeight.k11,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k11
                        }
                    },
                    '&[data-variant="k12"]': {
                        ...kpiFontBase,
                        textTransform: 'none',
                        fontWeight: fontWeight.k8,
                        fontSize: fontSize.k8,
                        lineHeight: fontWeight.k8,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k8
                        }
                    },
                    '&[data-variant="k13"]': {
                        ...kpiFontBase,
                        textTransform: 'none',
                        fontWeight: fontWeight.k9,
                        fontSize: fontSize.k9,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.k9
                        }
                    },
                    '&[data-variant="h1"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h1,
                        opacity: opacity.h1,
                        textTransform: textTransform.h1,
                        fontWeight: fontWeight.h1,
                        fontSize: fontSize.h1,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h1
                        }
                    },
                    '&[data-variant="h2"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h2,
                        opacity: opacity.h2,
                        textTransform: textTransform.h2,
                        fontWeight: fontWeight.h2,
                        fontSize: fontSize.h2,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h2
                        }
                    },
                    '&[data-variant="h3"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h3,
                        opacity: opacity.h3,
                        textTransform: textTransform.h3,
                        fontWeight: fontWeight.h3,
                        fontSize: fontSize.h3,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h3
                        }
                    },
                    '&[data-variant="h4"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h4,
                        opacity: opacity.h4,
                        textTransform: textTransform.h4,
                        fontWeight: fontWeight.h4,
                        fontSize: fontSize.h4,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h4
                        }
                    },
                    '&[data-variant="h5"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h5,
                        opacity: opacity.h5,
                        textTransform: textTransform.h5,
                        fontWeight: fontWeight.h5,
                        fontSize: fontSize.h5,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h5
                        }
                    },
                    '&[data-variant="h6"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h6,
                        opacity: opacity.h6,
                        textTransform: textTransform.h6,
                        fontWeight: fontWeight.h6,
                        fontSize: fontSize.h6,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h6
                        }
                    },
                    '&[data-variant="h7"]': {
                        fontFamily: fontFamily.heading,
                        letterSpacing: letterSpacing.h7,
                        opacity: opacity.h7,
                        textTransform: textTransform.h7,
                        fontWeight: fontWeight.h7,
                        fontSize: fontSize.h7,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h7
                        }
                    },
                    '&[data-variant="h8"]': {
                        fontFamily: fontFamily.body,
                        letterSpacing: letterSpacing.h8,
                        opacity: opacity.h8,
                        textTransform: textTransform.h8,
                        fontWeight: fontWeight.h8,
                        fontSize: fontSize.h8,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h8
                        }
                    },
                    '&[data-variant="h9"]': {
                        fontFamily: fontFamily.body,
                        letterSpacing: letterSpacing.h8,
                        opacity: opacity.h8,
                        fontWeight: fontWeight.h8,
                        fontSize: fontSize.h8,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.h8
                        }
                    },
                    '&[data-variant="b1"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b1,
                        fontSize: fontSize.b1,
                        letterSpacing: letterSpacing.b1,
                        opacity: opacity.b1,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b1
                        }
                    },
                    '&[data-variant="b2"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b2,
                        fontSize: fontSize.b2,
                        letterSpacing: letterSpacing.b2,
                        opacity: opacity.b2,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b2
                        }
                    },
                    '&[data-variant="b3"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b3,
                        fontSize: fontSize.b3,
                        letterSpacing: letterSpacing.b3,
                        opacity: opacity.b3,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b3
                        }
                    },
                    '&[data-variant="b4"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b4,
                        fontSize: fontSize.b4,
                        letterSpacing: letterSpacing.b4,
                        opacity: opacity.b4,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b4
                        }
                    },
                    '&[data-variant="b5"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b5,
                        fontSize: fontSize.b5,
                        letterSpacing: letterSpacing.b5,
                        opacity: opacity.b5,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b5
                        }
                    },
                    '&[data-variant="b6"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b6,
                        fontSize: fontSize.b6,
                        letterSpacing: letterSpacing.b6,
                        opacity: opacity.b6,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b6
                        }
                    },
                    '&[data-variant="b7"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b7,
                        fontSize: fontSize.b7,
                        letterSpacing: letterSpacing.b7,
                        opacity: opacity.b7,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b7
                        }
                    },
                    '&[data-variant="b8"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b8,
                        fontSize: fontSize.b8,
                        letterSpacing: letterSpacing.b8,
                        opacity: opacity.b8,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b8
                        }
                    },
                    '&[data-variant="b9"]': {
                        fontFamily: fontFamily.body,
                        fontWeight: fontWeight.b9,
                        fontSize: fontSize.b9,
                        letterSpacing: letterSpacing.b9,
                        opacity: opacity.b9,
                        textTransform: textTransform.body,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.b9
                        }
                    },
                    '&[data-variant="f1"]': {
                        fontFamily: fontFamily.filter,
                        fontWeight: fontWeight.filter,
                        fontSize: fontSize.filterF1,
                        letterSpacing: letterSpacing.filterF1,
                        opacity: opacity.filterF1,
                        textTransform: textTransform.filterCase,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.filterF1
                        }
                    },
                    '&[data-variant="f2"]': {
                        fontFamily: fontFamily.filter,
                        fontWeight: fontWeight.filter,
                        fontSize: fontSize.filterF2,
                        letterSpacing: letterSpacing.filterF2,
                        opacity: opacity.filterF2,
                        textTransform: textTransform.filterCase,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.filterF2
                        }
                    },
                    '&[data-variant="bu1"]': {
                        fontFamily: fontFamily.button,
                        fontWeight: fontWeight.button,
                        fontSize: fontSize.BU1,
                        letterSpacing: letterSpacing.BU1,
                        opacity: opacity.BU1,
                        textTransform: textTransform.BU1,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.BU1
                        }
                    },
                    '&[data-variant="bu2"]': {
                        fontFamily: fontFamily.button,
                        fontWeight: fontWeight.button,
                        fontSize: fontSize.BU2,
                        letterSpacing: letterSpacing.BU2,
                        opacity: opacity.BU2,
                        textTransform: textTransform.BU2,
                        [materialTheme.breakpoints.down(
                            materialTheme.breakpoints.values.desktop_sm
                        )]: {
                            fontSize: fontSize.breakpoints.desktop_sm.BU2
                        }
                    }
                }
            }
        }
    });

    materialTheme = responsiveFontSizes(materialTheme);

    const chartTheme = createChartTheme(
        chartColors,
        CODX_WHITE,
        CODX_BLUE_DARK,
        CODX_BLUE_LIGHT,
        contrast_color
    );

    return { materialTheme, chartTheme };
}
