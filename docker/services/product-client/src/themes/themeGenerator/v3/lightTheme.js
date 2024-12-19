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
        gridColor,
        secondaryColor,
        textColor,
        fontFamily,
        fontWeight,
        textTransform,
        fontSize,
        opacity,
        letterSpacing,
        color,
        lineHeight
    }
) {
    const CODX_CONTRAST_LIGHT = contrast_color + '25';
    const CODX_CONTRAST = contrast_color;
    const CODX_WHITE = darkColor;
    const CODX_GREY_BKGD = mainColor;
    const CODX_BLUE_LIGHT = lightColor;
    const CODX_BLACK_TEXT = textColor;
    const CODX_GREY = gridColor;
    const INFO_BG_DARK = secondaryColor;
    const CODX_BLACK_LIGHT_TEXT = '#00000050';
    const CODX_BORDER_COLOR = '#4767f5';
    const CODX_GREEN_TEXT = '#67F1C1';
    const CODX_INDICATOR_GREEN_TEXT = '#00A582';
    const CODX_BLACK_HOVER = '#00000007';
    const CODX_BLACK_SELECTED = '#00000012';
    const CODX_BLUE_NORMAL = '#0C2744';
    const CODX_BLUE_OPAQUE = '#E7F4FF';
    const CODX_BLUE_GREY = '#E9F0FD';
    const CODX_SPEECH_BLUE = '#3A54C1';
    const CODX_WILD_BLUE_YONDER = '#7F8CC9';
    const CODX_ROYAL_BLUE = '#4560D7';
    const CODX_MOON_RAKER = '#C5CEF2';
    const CODX_BLACK = '#000000';
    const CODX_BLUE_SKY_LIGHT = '#04B7CF';
    const CODX_LIGHT_GRAY = '#605C5C';
    const CODX_MODEL_LIGHTER = '#F6F6F6';
    const CODX_MODEL_LIGHT = '#4560D722';
    const CODX_MODEL_LIGHT_BG = '#F1F3F4';
    const CODX_CONN_GOAL = '#94B804';
    const CODX_INDICATOR_RED = '#E1004B';
    const CODX_INDICATOR_GREEN = '#B3EEE1';
    const CODX_BLUE_LIGHTER = '#F4F8FD';
    const CODX_GREY_DARK = '#220047';
    const CODX_GREY_HOVER = '#FCFDFD';
    const CODX_GRAY_SELECTED = '#FAFBFB';
    const CODX_GREY_SEPARATOR = '#EDEBF0';
    const INFO_BG_LIGHT = 'rgba(71, 139, 219, 0.04)';
    const SUCCESS_LIGHT = 'rgba(46, 205, 170, 0.04)';
    const SUCCESS_DARK = '#2ECDAA';
    const WARNING_LIGHT = 'rgba(249, 102, 56, 0.04)';
    const WARNING_DARK = '#F96638';
    const CODX_PEACH_TEXT = '#FFA497';
    const CODX_DARK_GREY_BKGD = '#E9E5ED';
    const CODX_PURE_WHITE = '#FFFFFF';
    const CODX_GREY_OVERLAY = '#E8EAEC';
    const CODX_LIGHT_ICON_HOVER = '#EDE9F0';
    const CODX_BG_DISABLED = '#B5AAC2;';
    const CODX_ICON_BLUE = '#4466C6';
    const CODX_GREYISH_BLUE = '#E4EAEA';
    const CODX_GREY_BORDER = '#A8AFB8';
    const CODX_RED_ERROR = '#CF5F6A';
    const CODX_GREY_MENU_ITEM_HOVER = '#F2F5F5';
    const CODX_GREY_MENU_ITEM_FOCUS = '#C9DEF4';
    const CODX_WIZARD_BLUE = '#C9DEF4';
    const CODX_RED_LIGHT_ERROR = '#E81762';
    const CODX_ICON_GREY = '#929BA7';
    const CODX_HIGHLIGHT_TEXT = '#F2BC5C';
    const CODX_INPUT_FOCUS = '#4788D8';
    const CODX_PURPLE_LIGHT = '#472B66';
    const CODX_FOOTER_GRAY = '#7A6691';
    const CODX_TOP_NAV = '#22004795';
    const CODX_MODULE_BUTTON = '#220047';
    const CODX_MODULE_BTN_TEXT = '#ffffff';
    const CODX_MODEL_BACKGROUND = '#FFFFFF';
    const CODX_CLOSE_ICON = '#220047';
    const CODX_INPUT_BORDER_FOCUS = '#478BDB';
    const CODX_INPUT_BORDER_HOVER = '#220047';
    const CODX_DATE_SELECTED = '#478BDB';
    const CODX_PURPLE_TEXT = '#220047';
    const CODX_DATE_PICKER_BG = '#FFFFFF';
    const LOGIN_INP_BORDER = '#220047';
    const LOGIN_SEPRATOR = '#220047';
    const CODX_SSO_BTN_BORDER = '#FFFFFF';
    const CODX_LOGIN_SEPRATOR = '#22004730';
    const CODX_UTILS_BG = '#FFFFFF';
    const CODX_HOVER_ICON_COLOR = '#FFFFFF';
    const CODX_FILTER_VERTICAL_LINE = '#22004740';
    const CODX_OULINE_BTN_HOVER = '#EDE9F0';
    const CODX_BTN_TEXT_COLOR_DARK = '#FFA497';
    const CODX_AI_INSIGHT_OVERLAY = 'transparent';
    const CODX_PALE_BLUE = '#E9F2FB';
    const CODX_TURQUOISE_GREEN = '#6DF0C2';
    const CODX_REDDISH_PINK = '#FB5B66';
    const CODX_PALE_PINK = '#F6ECEB';
    const CODX_DYNAMIC_FROM_SCROLL = '#5F005940';
    const CODX_APP_HOME_BANNER = '#F4F2EF';
    const THEME_INFO_BG = '#E0EEFF';
    const CODX_POPOVER_BORDER = '#E9EEEE';
    const CODX_TABLE_DIVIDER = '#2B70C2';
    const CODX_SILVER_LILAC = '#E2DEE0';
    const CODX_SILVER_PINK = '#C2BABE';
    const CODX_WHITE_BEIGE = '#FAF9EC';
    const CODX_WARM_IVORY = '#FAE4BE';
    const CODX_NAVSELECT = '#220047';
    const CODX_BREADCRUMB_SCREEN = '#696D82';
    const CODX_PROFILE_HOVER = '#E9EEEE';
    const CODX_CUSTOM_ORANGE = '#FF9C7D';
    const CODX_SEARCH_BORDER = '#ACACB1';
    const CODX_PRODUCT_BORDER = '#DCDCDC';
    const CODX_LINK = '#478BDB';
    const FIELD_DISABLED_BG = '#FAFBFB';
    const DISABLED_LABEL = '#BAB9BF';
    const CODX_LIGHT_BLUE = '#C9DEF4E8';
    const CODX_TITLE_BORDER = '#BF99BD';
    const CODX_ATTACHMENT_BACKGROUND = '#F9F8F8';
    const CODX_ROW_FREEZING = '#f0f0f0';
    const CODX_DATASTORY_TEXT = '#FAF0F0';
    const CODX_PROGRESS_NON_ACTIVE = '#999999';
    const CODX_TEXT_LABEL_BLACK="#000000"

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
                main: CODX_GREY_BKGD,
                light: CODX_BLUE_LIGHT,
                dark: CODX_WHITE,
                contrastText: CODX_CONTRAST,
                tooltip: CODX_WHITE,
                contrastTextLight: CODX_CONTRAST_LIGHT,
                highlight: CODX_BLUE_GREY,
                purpleLight: CODX_PURPLE_LIGHT
            },
            error: {
                main: '#CF5F6A'
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
                prodEnvLabel: '#AA7EF0',
                tableHeader: CODX_BLUE_LIGHTER,
                tableHover: CODX_GREY_HOVER,
                tableSelcted: CODX_GRAY_SELECTED,
                navLinkBackground: '#E9F2FB',
                simulatorRail: '#D3CCDA',
                filterToolTip: '#4E336C',
                infoBgLight: INFO_BG_LIGHT,
                infoBgDark: INFO_BG_DARK,
                warningLight: WARNING_LIGHT,
                warningDark: WARNING_DARK,
                sucessLight: SUCCESS_LIGHT,
                successDark: SUCCESS_DARK,
                disabledBg: CODX_BG_DISABLED,
                darkGrey: CODX_DARK_GREY_BKGD,
                pureWhite: CODX_PURE_WHITE,
                overlay: CODX_GREY_OVERLAY,
                greyishBlue: CODX_GREYISH_BLUE,
                selectedScreen: '#ebf2fa',
                wizardBackground: CODX_WIZARD_BLUE,
                menuItemHover: CODX_GREY_MENU_ITEM_HOVER,
                menuItemFocus: CODX_GREY_MENU_ITEM_FOCUS,
                highlightText: CODX_HIGHLIGHT_TEXT,
                connTabBack: '#E3EDFA',
                connProgressBar: '#2ECDAA',
                modelLight: '#F9F7F3',
                white: '#FFFFFF',
                connBoxShadow: '#A5CCFC25',
                connQueryInput: '#B5AAC2',
                insightSuccess: 'rgba(46, 205, 170, 0.4)',
                insightFailure: '#FC9299',
                insightNeutral: 'rgba(242, 188, 92, 0.4)',
                insightBorder: 'rgba(95, 0, 89, 0.08)',
                customSwitchBg: 'rgba(119, 119, 119, 1)',
                progressBarBg: '#D9D9D9',
                filterCategories: CODX_PURE_WHITE,
                filterCategorySelected: '#E9F2FB',
                moduleBtn: CODX_MODULE_BUTTON,
                modelBackground: CODX_MODEL_BACKGROUND,
                dateSelected: CODX_DATE_SELECTED,
                datePickerBg: CODX_DATE_PICKER_BG,
                utilsBackground: CODX_UTILS_BG,
                uploadBg: CODX_GREY_BKGD,
                plainBtnBg: CODX_OULINE_BTN_HOVER,
                aiInsightOverlay: CODX_AI_INSIGHT_OVERLAY,
                chipRevampBg: CODX_PALE_BLUE,
                infoSuccess: CODX_TURQUOISE_GREEN,
                infoError: CODX_PEACH_TEXT,
                tooltipBg: CODX_PURPLE_TEXT,
                cardItemFocus: CODX_PEACH_TEXT,
                cardItemHover: CODX_PALE_PINK,
                orchestratorBg: '#F7F4EF',
                warningBg: '#FBE9CB',
                infoBg: '#EBF5FF',
                drawerRemoveIcon: '#7C879566',
                lightHover: CODX_LIGHT_ICON_HOVER,
                tooltipBackground: '#313650',
                appHomeBanner: CODX_APP_HOME_BANNER,
                themeInfoBg: THEME_INFO_BG,
                timelineDot: CODX_SILVER_LILAC,
                markdownHighlight: CODX_WHITE_BEIGE,
                profileHover: CODX_PROFILE_HOVER,
                field_disabled_bg: FIELD_DISABLED_BG,
                attachment: CODX_ATTACHMENT_BACKGROUND,
                freezeCol: CODX_ROW_FREEZING,
                datastory: CODX_PURE_WHITE,
                dataStoryBar: CODX_BLACK_TEXT,
                progressNonActive: CODX_PROGRESS_NON_ACTIVE,
                activeProgressLine: '#BDB2C8',
                nonActiveProgressLine: '#CCCCCC',
                blueBg: CODX_LIGHT_BLUE,
                cardBg: CODX_PURE_WHITE,
                buttonBg: CODX_PURE_WHITE
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
                white: CODX_WHITE,
                black: '#000000',
                indicatorGreenText: CODX_INDICATOR_GREEN_TEXT,
                table: CODX_GREY_DARK,
                peachText: CODX_PEACH_TEXT,
                revamp: CODX_GREY_DARK,
                error: CODX_RED_ERROR,
                filtersError: CODX_RED_LIGHT_ERROR,
                connSystemSubProcess: '#8F7A64',
                connLegendColor: '#0E1F38',
                connProjectionText: '#00A582',
                connHighlight: '#478BDB',
                connNucliosBorder: '#5F005925',
                footerVersion: CODX_FOOTER_GRAY,
                sidebarSelected: CODX_BLACK_TEXT,
                hightlightFilter: INFO_BG_DARK,
                moduleBtnText: CODX_MODULE_BTN_TEXT,
                purpleText: CODX_PURPLE_TEXT,
                chooseFileText: INFO_BG_DARK,
                secondaryText: CODX_BLACK,
                btnTextColor: CODX_BTN_TEXT_COLOR_DARK,
                breadcrumbScreen: CODX_BREADCRUMB_SCREEN,
                profileText: '#330086',
                headerOrange: CODX_CUSTOM_ORANGE,
                anchorLink: CODX_LINK,
                disabledLabel: DISABLED_LABEL,
                title: CODX_GREY_DARK,
                dataStoryText: CODX_DATASTORY_TEXT,
                labeltext:CODX_TEXT_LABEL_BLACK
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
                toolBar: '#617890',
                grey: CODX_GREY_BORDER,
                greyishBlue: CODX_GREYISH_BLUE,
                inputFocus: CODX_INPUT_FOCUS,
                loginGrid: '#BF99BD',
                categoriesRight: `${CODX_GREY_DARK}26`,
                themeToggle: `${CODX_BLACK_TEXT}30`,
                inputOnFoucs: CODX_INPUT_BORDER_FOCUS,
                inputOnHover: CODX_INPUT_BORDER_HOVER,
                LoginInpBorder: LOGIN_INP_BORDER,
                ssoBtnBorder: CODX_SSO_BTN_BORDER,
                loginSeprator: CODX_LOGIN_SEPRATOR,
                overViewUploadBorder: CODX_GREY_DARK,
                filterVerticalBorder: CODX_FILTER_VERTICAL_LINE,
                industryLight: '#BF99BD99',
                dynamicFormScrollBar: CODX_DYNAMIC_FROM_SCROLL,
                popOverBorder: CODX_POPOVER_BORDER,
                tableDivider: CODX_TABLE_DIVIDER,
                timelineDot: CODX_SILVER_PINK,
                markdownHighlight: CODX_WARM_IVORY,
                navSelectionBorder: CODX_NAVSELECT,
                searchBorder: CODX_SEARCH_BORDER,
                productBorder: CODX_PRODUCT_BORDER,
                cardBorder: 'transparent',
                titleBorder: CODX_TITLE_BORDER,
                buttonBorder: CODX_GREY_DARK,
                dataStoryIcon: CODX_CUSTOM_ORANGE,
                widgetFilterIcon: CODX_BLACK_TEXT
            },
            icons: {
                color: CODX_BLUE_NORMAL,
                border: CODX_SPEECH_BLUE,
                background: CODX_SPEECH_BLUE,
                backgroundColorWithOpacity: 'rgba(58, 84, 193, 0.6)',
                nofile: CODX_BLACK,
                indicatorRed: CODX_INDICATOR_RED,
                indicatorGreen: CODX_INDICATOR_GREEN,
                selectedBlue: CODX_ICON_BLUE,
                tableIconBg: CODX_ICON_GREY,
                ratingColor: 'rgba(242, 188, 92, 1)',
                topNav: CODX_TOP_NAV,
                contrast: CODX_GREY_DARK,
                darkTheme: CODX_BLACK_TEXT,
                closeIcon: CODX_CLOSE_ICON,
                iconHoverColor: CODX_HOVER_ICON_COLOR,
                uploadIcon: CODX_GREY_DARK,
                successIconFill: CODX_INDICATOR_GREEN_TEXT,
                errorIconFill: CODX_REDDISH_PINK,
                minusIcon: '#7C8795',
                grey: '#7C8795'
            },
            action: {
                disabled: CODX_WHITE,
                disabledBackground: CODX_BG_DISABLED
            },
            font: {
                roboto: 'Roboto'
            },
            logo: {
                hover: '#CCCCCC',
                nuclios: CODX_GREY_DARK
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
            color: CODX_BLACK_TEXT,
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
                        backgroundColor: 'transparent'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        borderRadius: `${6 / 10.368}rem`,
                        backdropFilter: `blur(${5 / 10.368}rem)`,
                        border: '0.5px solid ' + '#220047CC'
                    }
                }
            },
            MuiSvgIcon: {
                root: {
                    color: CODX_GREY_DARK,
                    willChange: 'transform'
                }
            },
            MuiFormControlLabel: {
                label: {
                    color: CODX_BLACK_TEXT
                }
            },
            MuiSwitch: {
                sizeSmall: {
                    width: '5.2rem',
                    height: '2.4rem',
                    padding: 0,
                    margin: '0.8rem',
                    '& .Mui-checked .MuiSwitch-thumb': {
                        backgroundColor: CODX_PEACH_TEXT + '!important',
                        opacity: 1
                    },
                    '& $switchBase': {
                        padding: 0,
                        left: '0.3rem',
                        top: '0.2rem',
                        '&$checked': {
                            transform: `translateX(2.6rem)`,
                            '& + $track': {
                                backgroundColor: CODX_GREY_DARK + '!important',
                                opacity: 1,
                                border: 'none'
                            }
                        }
                    },
                    '& $thumb': {
                        backgroundColor: CODX_GREY_DARK,
                        width: '2rem',
                        height: '2rem'
                    },
                    '& $track': {
                        backgroundColor: 'transparent' + ' !important',
                        opacity: 1,
                        border: '1px solid' + CODX_GREY_DARK,
                        borderRadius: 24 / 2
                    }
                },
                thumb: {
                    backgroundColor: CODX_GREY_DARK
                },
                root: {
                    '& span.Mui-checked + span.MuiSwitch-track': {
                        backgroundColor: CODX_GREY_DARK + ' !important',
                        opacity: 1
                    },
                    '& .Mui-checked .MuiSwitch-thumb': {
                        backgroundColor: CODX_PEACH_TEXT + ' !important',
                        opacity: 1
                    },
                    '& .Mui-checked.Mui-disabled .MuiSwitch-thumb': {
                        backgroundColor: '#404040' + ' !important',
                        opacity: 0.5
                    },
                    '& .Mui-checked.Mui-disabled + .MuiSwitch-track': {
                        backgroundColor: '#b0b0b0' + ' !important', // Track color when checked and disabled
                        opacity: 0.5
                    },
                    //  styles for only disbaled but not checked
                    '& .Mui-disabled + .MuiSwitch-track': {
                        backgroundColor: '#fff' + ' !important',
                        borderColor: '1px solid #b0b0b0' + ' !important',
                        opacity: '1 !important'
                    },
                    // Styles for the thumb when the switch is disabled
                    '& .Mui-disabled .MuiSwitch-thumb': {
                        backgroundColor: '#404040' + ' !important',
                        opacity: 0.7
                    }
                },
                track: {
                    backgroundColor: 'transparent' + ' !important',
                    opacity: 1,
                    border: '1px solid' + CODX_GREY_DARK
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
            MuiTouchRipple: {
                root: {
                    display: 'none'
                }
            },
            MuiButton: {
                root: {
                    color: color.applyButton,
                    backgroundColor: 'transparent',
                    fontSize: '1.5rem',
                    '&:hover': {
                        opacity: '0.8',
                        color: color.applyButton,
                        backgroundColor: CODX_GREY_DARK
                    },
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem',
                    textTransform: 'capitalize',
                    borderRadius: '0.4rem'
                },
                contained: {
                    color: color.applyButton,
                    backgroundColor: CODX_GREY_DARK,
                    fontSize: '1.5rem',
                    '&:hover': {
                        opacity: '0.8',
                        color: color.applyButton,
                        backgroundColor: CODX_GREY_DARK,
                        boxShadow: `0.1rem 0.1rem 0.4rem 0rem ${CODX_GREY_DARK}`
                    },
                    '&:active': {
                        '&:after': {
                            display: 'none'
                        }
                    },
                    '&:focus': {
                        position: 'relative',
                        outline: '1px solid #220047',
                        borderRadius: '2px',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            borderRadius: '2px',
                            border: '3px solid #ffffff'
                        }
                    },
                    '&$disabled': { '& svg': { fill: CODX_PURE_WHITE } },
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                outlined: {
                    backgroundColor: 'transparent',
                    border: '1px solid ' + CODX_CONTRAST + '99',
                    color: CODX_CONTRAST,
                    fontSize: '1.5rem',
                    '&$disabled': { color: CODX_BG_DISABLED, '& svg': { fill: CODX_BG_DISABLED } },
                    '&:hover': {
                        opacity: '0.75',
                        backgroundColor: 'transparent',
                        border: '1px solid ' + CODX_CONTRAST,
                        color: CODX_CONTRAST,
                        boxShadow: `1px 1px 4px 0px ${CODX_GREY_DARK}`
                    },
                    '&:active': {
                        backgroundColor: 'transparent',
                        border: '1px solid ' + CODX_CONTRAST + '99',
                        color: CODX_CONTRAST
                    },
                    '&:focus': {
                        outline: '.5px solid #220047',
                        borderRadius: '2px',
                        border: '3px solid #ffffff !important',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            borderRadius: '2px',
                            border: '0.5px solid ' + `${CODX_CONTRAST}99`
                        }
                    },
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                containedSizeSmall: {
                    fontSize: '1.5rem',
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                outlinedSizeSmall: {
                    fontSize: '1.5rem',
                    paddingLeft: '2.4rem',
                    paddingRight: '2.4rem'
                },
                text: {
                    color: CODX_CONTRAST,
                    textTransform: 'capitalize',
                    letterSpacing: '1.5px',
                    '&:hover': {
                        backgroundColor: '#EDE9F0',
                        color: CODX_CONTRAST,
                        opacity: 1
                    },
                    '&$disabled': { color: CODX_BG_DISABLED, '& svg': { fill: CODX_BG_DISABLED } }
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
                        backgroundColor: CODX_LIGHT_ICON_HOVER
                    }
                },
                label: {
                    '& svg': {
                        color: CODX_GREY_DARK,
                        cursor: 'pointer'
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
                        margin: 0,
                        backgroundColor: '#E9F1FA'
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
                        color: CODX_BLACK_TEXT,
                        opacity: '0.8',
                        alignSelf: 'center'
                    }
                }
            },
            MuiDialogContent: {
                dividers: {
                    // borderTop:"none",
                    borderBottomColor: 'rgba(12, 39, 68, 0.2)'
                }
            },
            MuiDialogContentText: {
                root: {
                    color: CODX_BLACK_TEXT,
                    fontSize: '1.75rem'
                }
            },
            MuiPaper: {
                rounded: {
                    borderRadius: '0'
                }
            },
            MuiFormLabel: {
                asterisk: {
                    color: '#FF0000',
                    marginLeft: '.5rem'
                }
            },
            MuiListSubheader: {
                sticky: {
                    backgroundColor: CODX_WHITE
                }
            },
            MuiFilledInput: {
                root: {
                    backgroundColor: CODX_GRAY_SELECTED,
                    '&:hover': {
                        backgroundColor: CODX_GRAY_SELECTED
                    },
                    '& :focus': {
                        backgroundColor: CODX_GRAY_SELECTED
                    }
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
                color: 'linear-gradient(30deg, #FFA497 -44.25%, rgba(255, 255, 255, 0.38) 50.4%, rgba(34, 0, 71, 0.40) 140.68%)',
                backdropFilter: 'blur(50px)',
                cardHover: '#FEF9F9'
            },
            border: {
                light: '#BF99BD'
            }
        },
        FunctionDashboard: {
            background: {
                cardHover: 'rgba(251, 249, 247, 0.20)',
                logoWrapperColor:
                    'linear-gradient(105deg, #330F43 12.04%, #8E3BB1 60%, #F6909C 116.08%)'
            }
        },
        ApplicationDashboard: {
            background: {
                bgColor: 'rgba(251, 249, 247, 1)',
                cardHover: '#fff',
                selectedItemBg: 'linear-gradient(to right, #330F43 0%, #8E3BB1 50%, #F6909C 100%)',
                searchInputBg: 'rgba(34, 0, 71, 0.08)',
                iconHover: 'linear-gradient(105deg, #330F43 12.04%, #8E3BB1 60%, #F6909C 116.08%)'
            }
        },
        Nofilesfiller: {
            icon: CODX_BLACK + 30,
            text: CODX_BLACK + 80
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
        CODX_BLACK_TEXT,
        CODX_WHITE,
        CODX_BLUE_LIGHT,
        contrast_color
    );

    return { materialTheme, chartTheme };
}
