import { GLOBAL_FONT_FAMILY, GLOBAL_FONT_FAMILY_ARRAY } from 'util/fontFamilyConfig';

export const createChartTheme = (
    chartColors,
    CodxTextColor,
    CodxBkgdColor,
    CodxBkgdLightColor,
    CodxContrastColor
) => {
    return {
        chartDefaultColors: chartColors.reduce((acc, color, i) => {
            acc['range-' + (i + 1)] = chartColors.slice(0, i + 1);
            return acc;
        }, {}),
        chartMapColors: [
            [0, chartColors[0]],
            [1, chartColors[2]]
        ],
        CodxTextColor,
        CodxBkgdColor,
        CodxBkgdLightColor,
        CodxContrastColor
    };
};

export const getBreakpoints = () => ({
    desktop_xs: 1024,
    desktop_sm: 1440,
    desktop_md1: 1600,
    desktop_md2: 1680,
    desktop_lg: 1920,
    desktop_xl: 2560
});

export const convertPxToRem = (px) => `${px / 9}rem`;

export const getCommonThemeConfig = ({
    fontFamily,
    fontWeight,
    textTransform,
    fontSize,
    opacity,
    letterSpacing,
    color
}) => ({
    typography: {
        fonts: GLOBAL_FONT_FAMILY_ARRAY,
        fontFamily: GLOBAL_FONT_FAMILY
    },
    breakpoints: {
        values: getBreakpoints()
    },
    kpi: {
        k1: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k1,
            fontSize: fontSize.h1Title,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k2: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k2,
            fontSize: fontSize.k1,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k3: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k3,
            fontSize: fontSize.k2,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k4: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k4,
            fontSize: fontSize.k3,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k5: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k5,
            fontSize: fontSize.k5,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k6: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k6,
            fontSize: fontSize.k6,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k7: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k7,
            fontSize: fontSize.k7,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k8: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k8,
            fontSize: fontSize.k8,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k9: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k9,
            fontSize: fontSize.k9,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k10: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k10,
            fontSize: fontSize.k10,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        },
        k11: {
            fontFamily: fontFamily.kpiTitle,
            fontWeight: fontWeight.k11,
            fontSize: fontSize.k11,
            letterSpacing: letterSpacing.kpiLetterSpacing,
            opacity: opacity.kpiOpacity,
            textTransform: textTransform.kpiCase
        }
    },
    title: {
        h1: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h1,
            fontSize: fontSize.h1,
            letterSpacing: letterSpacing.h1,
            opacity: opacity.h1,
            textTransform: textTransform.h1
        },
        h2: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h2,
            fontSize: fontSize.h2,
            letterSpacing: letterSpacing.h2,
            opacity: opacity.h2,
            textTransform: textTransform.h2
        },
        h3: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h3,
            fontSize: fontSize.h3,
            letterSpacing: letterSpacing.h3,
            opacity: opacity.h3,
            textTransform: textTransform.h3
        },
        h4: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h4,
            fontSize: fontSize.h4,
            letterSpacing: letterSpacing.h4,
            opacity: opacity.h4,
            textTransform: textTransform.h4
        },
        h5: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h5,
            fontSize: fontSize.h5,
            letterSpacing: letterSpacing.h5,
            opacity: opacity.h5,
            textTransform: textTransform.h5
        },
        h6: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h6,
            fontSize: fontSize.h6,
            letterSpacing: letterSpacing.h6,
            opacity: opacity.h6,
            textTransform: textTransform.h6
        },
        h7: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h7,
            fontSize: fontSize.h7,
            letterSpacing: letterSpacing.h7,
            opacity: opacity.h7,
            textTransform: textTransform.h7
        },
        h8: {
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.h8,
            fontSize: fontSize.h8,
            letterSpacing: letterSpacing.h8,
            opacity: opacity.h8,
            textTransform: textTransform.h8
        }
    },
    body: {
        B1: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b1,
            fontSize: fontSize.b1,
            letterSpacing: letterSpacing.b1,
            opacity: opacity.b1,
            textTransform: textTransform.body
        },
        B2: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b2,
            fontSize: fontSize.b2,
            letterSpacing: letterSpacing.b2,
            opacity: opacity.b2,
            textTransform: textTransform.body
        },
        B3: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b3,
            fontSize: fontSize.b3,
            letterSpacing: letterSpacing.b3,
            opacity: opacity.b3,
            textTransform: textTransform.body
        },
        B4: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b4,
            fontSize: fontSize.b4,
            letterSpacing: letterSpacing.b4,
            opacity: opacity.b4,
            textTransform: textTransform.body
        },
        B5: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b5,
            fontSize: fontSize.b5,
            letterSpacing: letterSpacing.b5,
            opacity: opacity.b5,
            textTransform: textTransform.body
        },
        B6: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b6,
            fontSize: fontSize.b6,
            letterSpacing: letterSpacing.b6,
            opacity: opacity.b6,
            textTransform: textTransform.body
        },
        B7: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b7,
            fontSize: fontSize.b7,
            letterSpacing: letterSpacing.b7,
            opacity: opacity.b7,
            textTransform: textTransform.body
        },
        B8: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b8,
            fontSize: fontSize.b8,
            letterSpacing: letterSpacing.b8,
            opacity: opacity.b8,
            textTransform: textTransform.body
        },
        B9: {
            fontFamily: fontFamily.body,
            fontWeight: fontWeight.b9,
            fontSize: fontSize.b9,
            letterSpacing: letterSpacing.b9,
            opacity: opacity.b9,
            textTransform: textTransform.body
        }
    },
    filter: {
        F1: {
            fontFamily: fontFamily.filter,
            fontWeight: fontWeight.filter,
            fontSize: fontSize.filterF1,
            letterSpacing: letterSpacing.filterF1,
            opacity: opacity.filterF1,
            textTransform: textTransform.filterCase
        },
        F2: {
            fontFamily: fontFamily.filter,
            fontWeight: fontWeight.filter,
            fontSize: fontSize.filterF2,
            letterSpacing: letterSpacing.filterF2,
            opacity: opacity.filterF2,
            textTransform: textTransform.filterCase
        }
    },
    button: {
        BU1: {
            fontFamily: fontFamily.button,
            fontWeight: fontWeight.button,
            fontSize: fontSize.BU1,
            letterSpacing: letterSpacing.BU1,
            opacity: opacity.BU1,
            textTransform: textTransform.BU1
        },
        BU2: {
            fontFamily: fontFamily.button,
            fontWeight: fontWeight.button,
            fontSize: fontSize.BU2,
            letterSpacing: letterSpacing.BU2,
            opacity: opacity.BU2,
            textTransform: textTransform.BU2
        },
        applyButton: {
            color: color.applyButton
        }
    },
    Toggle: {
        DarkIconColor: color.DarkIcon,
        DarkIconBg: color.DarkIconBg,
        LightIconBg: color.LightIconBg
    },
    layoutSpacing: (...factor) =>
        factor.map((ele) => (ele === 0 ? 0 : convertPxToRem(ele))).join(' ')
});
