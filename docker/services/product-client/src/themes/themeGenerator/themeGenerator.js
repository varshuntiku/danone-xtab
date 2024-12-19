import v1LightGenerator from './v1/lightTheme';
import v1DarkGenerator from './v1/darkTheme';
import v2LightGenerator from './v2/lightTheme';
import v2DarkGenerator from './v2/darkTheme';
import v3LightGenerator from './v3/lightTheme.js';
import v3DarkGenerator from './v3/darkTheme.js';
import { GLOBAL_FONT_FAMILY_ARRAY } from 'util/fontFamilyConfig';
import { convertPxToRem } from './utils';

const defaultChartColors = [
    '#220047',
    '#FFA497',
    '#C9DEF4',
    '#DCCFBB',
    '#2ECDAA',
    '#FECAD3',
    '#DDC3FE',
    '#DEF3A2',
    '#B3EEE1',
    '#F490C2'
];

const v3Params = {
    light: {
        opacity: {
            kpiOpacity: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 0.8,
            h6: 1,
            h7: 0.8,
            h8: 1,
            b1: 1,
            b2: 0.8,
            b3: 1,
            b4: 1,
            b5: 1,
            b6: 0.8,
            b7: 0.8,
            b8: 0.8,
            b9: 0.8,
            filterF1: 1,
            filterF2: 1,
            BU1: 1,
            BU2: 1
        },
        letterSpacing: {
            kpiLetterSpacing: 0,
            h1: 0,
            h2: '1px',
            h3: '0.5px',
            h4: '0.5px',
            h5: '1px',
            h6: '0.5px',
            h7: '0.35px',
            h8: 0,
            b1: '0.5px',
            b2: '0.5px',
            b3: '0.5px',
            b4: '0.5px',
            b5: '0.5px',
            b6: '0.025rem',
            b7: '0.025rem',
            b8: '0.025rem',
            b9: '0.025rem',
            filterF1: 0,
            filterF2: 0,
            BU1: '1px',
            BU2: '0.1rem',
            k11: convertPxToRem(1)
        },
        fontFamily: {
            button: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont,
            filter: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont,
            body: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            kpiTitle: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            kpiText: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            heading: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont
        },
        fontWeight: {
            normal: 'normal',
            medium: 500,
            lighter: 'lighter',
            button: 500,
            filter: 'normal',
            k1: 'lighter',
            k2: 'lighter',
            k3: 'normal',
            k4: 'normal',
            k5: 'normal',
            k6: 500,
            k7: 'normal',
            k8: 'normal',
            k9: 'normal',
            k10: 500,
            k11: 'normal',
            h1: 'normal',
            h2: 'normal',
            h3: 'normal',
            h4: 'normal',
            h5: 'normal',
            h6: 500,
            h7: 'normal',
            h8: 400,
            b1: 500,
            b2: 'normal',
            b3: 'normal',
            b4: 'lighter',
            b5: 500,
            b6: 'normal',
            b7: 500,
            b8: 'normal',
            b9: 500
        },
        textTransform: {
            kpiCase: 'capitalize',
            filterCase: 'capitalize',
            h1: 'capitalize',
            h2: 'capitalize',
            h3: 'capitalize',
            h4: 'capitalize',
            h5: 'uppercase',
            h6: 'uppercase',
            h7: 'capitalize',
            h8: 'capitalize',
            body: 'capitalize',
            BU1: 'capitalize',
            BU2: 'uppercase'
        },
        fontSize: {
            k1: '4.63rem',
            k2: '4.25rem',
            k3: '3.5rem',
            k4: '3.25rem',
            k5: '3rem',
            k6: convertPxToRem(16),
            k7: '3.86rem',
            k8: convertPxToRem(18),
            k9: '1.93rem',
            k10: '1.45rem',
            k11: convertPxToRem(32),
            h1: convertPxToRem(24),
            h2: '1.8rem',
            h3: '1.6rem',
            h4: '1.6rem',
            h5: '1.3rem',
            h6: '1.6rem',
            h7: '1.3rem',
            h8: convertPxToRem(18),
            b1: '1.6rem',
            b2: '1.6rem',
            b3: '1.6rem',
            b4: '1.6rem',
            b5: '1.6rem',
            b6: '1.3rem',
            b7: '1.2rem',
            b8: '1.1rem',
            b9: '1.1rem',
            filterF1: '1.1rem',
            filterF2: '1.1rem',
            BU1: '1.4rem',
            BU2: '1.4rem',
            breakpoints: {
                desktop_sm: {
                    k1: '4.63rem',
                    k2: '3.5rem',
                    k3: '3.5rem',
                    k4: '2.9rem',
                    k5: '2.5rem',
                    k6: convertPxToRem(14),
                    k7: '3.86rem',
                    k8: convertPxToRem(16),
                    k9: '1.93rem',
                    k10: '1.45rem',
                    k11: convertPxToRem(28),
                    h1: convertPxToRem(20),
                    h2: '1.5rem',
                    h3: '1.3rem',
                    h4: '1.3rem',
                    h5: '1.1rem',
                    h6: '1.1rem',
                    h7: '1.1rem',
                    h8: convertPxToRem(16),
                    b1: '1.3rem',
                    b2: '1.3rem',
                    b3: '1.3rem',
                    b4: '1.3rem',
                    b5: '1.1rem',
                    b6: '1.1rem',
                    b7: '1rem',
                    b8: '1.1rem',
                    b9: '0.9rem',
                    filterF1: '0.9rem',
                    filterF2: '0.9rem',
                    BU1: '1.2rem',
                    BU2: '1.2rem'
                }
            }
        },
        color: {
            DarkIcon: 'rgba(255, 164, 151, 1)',
            DarkIconBg: '#220047',
            LightIconBg: 'transparent',
            applyButton: '#FFA497'
        },
        lineHeight: {
            k6: 'normal',
            k11: convertPxToRem(36)
        }
    },
    dark: {
        opacity: {
            kpiOpacity: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 0.8,
            h6: 1,
            h7: 0.8,
            h8: 1,
            b1: 1,
            b2: 0.8,
            b3: 1,
            b4: 1,
            b5: 1,
            b6: 0.8,
            b7: 0.8,
            b: 0.8,
            b9: 0.8,
            filterF1: 1,
            filterF2: 1,
            BU1: 1,
            BU2: 1
        },
        letterSpacing: {
            kpiLetterSpacing: 0,
            h1: 0,
            h2: '1px',
            h3: '0.5px',
            h4: '0.5px',
            h5: '1px',
            h6: '1px',
            h7: '0.35px',
            h8: 0,
            b1: '0.5px',
            b2: '0.5px',
            b3: '0.5px',
            b4: '0.5px',
            b5: '0.5px',
            b6: '0.025rem',
            b7: '0.025rem',
            b8: '0.025rem',
            b9: '0.025rem',
            filterF1: 0,
            filterF2: 0,
            BU1: '1px',
            BU2: '0.1rem',
            k11: convertPxToRem(1)
        },
        fontFamily: {
            button: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont,
            filter: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont,
            body: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            kpiTitle: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            kpiText: GLOBAL_FONT_FAMILY_ARRAY.primaryFont,
            heading: GLOBAL_FONT_FAMILY_ARRAY.secondaryFont
        },
        fontWeight: {
            normal: 'normal',
            medium: 500,
            lighter: 'lighter',
            button: 500,
            filter: 'normal',
            k1: 'lighter',
            k2: 'lighter',
            k3: 'normal',
            k4: 'normal',
            k5: 'normal',
            k6: 500,
            k7: 'normal',
            k8: 'normal',
            k9: 'normal',
            k10: 500,
            k11: 'normal',
            h1: 'normal',
            h2: 'normal',
            h3: 'normal',
            h4: 'normal',
            h5: 'normal',
            h6: 500,
            h7: 'normal',
            h8: 400,
            b1: 500,
            b2: 'normal',
            b3: 'normal',
            b4: 'lighter',
            b5: 500,
            b6: 'normal',
            b7: 500,
            b8: 'normal',
            b9: 500
        },
        textTransform: {
            kpiCase: 'capitalize',
            filterCase: 'capitalize',
            h1: 'capitalize',
            h2: 'capitalize',
            h3: 'capitalize',
            h4: 'capitalize',
            h5: 'uppercase',
            h6: 'uppercase',
            h7: 'capitalize',
            h8: 'capitalize',
            body: 'capitalize',
            BU1: 'capitalize',
            BU2: 'uppercase'
        },
        fontSize: {
            k1: '4.63rem',
            k2: '4.25rem',
            k3: '3.5rem',
            k4: '3.25rem',
            k5: '3rem',
            k6: convertPxToRem(16),
            k7: '3.86rem',
            k8: convertPxToRem(18),
            k9: '1.93rem',
            k10: '1.45rem',
            k11: convertPxToRem(32),
            h1: convertPxToRem(24),
            h2: '1.8rem',
            h3: '1.6rem',
            h4: '1.6rem',
            h5: '1.3rem',
            h6: '1.6rem',
            h7: '1.3rem',
            h8: convertPxToRem(18),
            b1: '1.6rem',
            b2: '1.6rem',
            b3: '1.3rem',
            b4: '1.3rem',
            b5: '1.6rem',
            b6: '1.3rem',
            b7: '1.2rem',
            b8: '1.1rem',
            b9: '1.1rem',
            filterF1: '1.1rem',
            filterF2: '1.1rem',
            BU1: '1.4rem',
            BU2: '1.4rem',
            breakpoints: {
                desktop_sm: {
                    k1: '4.63rem',
                    k2: '3.5rem',
                    k3: '3.5rem',
                    k4: '2.9rem',
                    k5: '2.5rem',
                    k6: convertPxToRem(14),
                    k7: '3.86rem',
                    k8: convertPxToRem(16),
                    k9: '1.93rem',
                    k10: '1.45rem',
                    k11: convertPxToRem(28),
                    h1: convertPxToRem(20),
                    h2: '1.5rem',
                    h3: '1.3rem',
                    h4: '1.3rem',
                    h5: '1.1rem',
                    h6: '1.1rem',
                    h7: '1.1rem',
                    h8: convertPxToRem(16),
                    b1: '1.3rem',
                    b2: '1.3rem',
                    b3: '1.3rem',
                    b4: '1.3rem',
                    b5: '1.1rem',
                    b6: '1.1rem',
                    b7: '1rem',
                    b8: '1.1rem',
                    b9: '0.9rem',
                    filterF1: '0.9rem',
                    filterF2: '0.9rem',
                    BU1: '1.2rem',
                    BU2: '1.2rem'
                }
            }
        },
        color: {
            DarkIcon: 'rgba(255, 164, 151, 1)',
            DarkIconBg: 'transparent',
            LightIconBg: '#FFA497',
            applyButton: '#0E0617'
        },
        lineHeight: {
            k6: 'normal',
            k11: convertPxToRem(36)
        }
    }
};

export const BgVariantParams = {
    v1: {
        light: {
            mainColor: '#E5E5E5',
            lightColor: '#F5F5F5',
            darkColor: '#FFFFFF',
            textColor: '#000'
        },
        dark: {
            mainColor: '#0C2744',
            lightColor: '#1E3E5F',
            darkColor: '#091F3A',
            textColor: '#fff'
        }
    },
    v2: {
        light: {
            mainColor: '#EDEDED',
            lightColor: '#FFFFFF',
            darkColor: '#F6F6F6',
            textColor: '#000',
            ...v3Params.light
        },
        dark: {
            mainColor: '#0B121B',
            lightColor: '#252F3B',
            darkColor: '#000811',
            textColor: '#fff',
            ...v3Params.dark
        }
    },
    v3: {
        light: {
            mainColor: '#E5E5E5',
            secondaryColor: '#2B70C2',
            gridColor: '#CFB3CD',
            lightColor: '#F5F5F5',
            darkColor: '#FFFFFF',
            textColor: '#220047',
            ...v3Params.light
        },
        dark: {
            mainColor: '#0C2744',
            secondaryColor: '#9ECBFF',
            gridColor: '#3A2B40',
            lightColor: '#1E1429',
            darkColor: '#0E0617',
            textColor: '#FAEFF0',
            ...v3Params.dark
        }
    },
    custom: {
        light: {
            mainColor: '#E5E5E5',
            secondaryColor: '#2B70C2',
            gridColor: '#CFB3CD',
            lightColor: '#F5F5F5',
            darkColor: '#FFFFFF',
            textColor: '#220047',
            ...v3Params.light
        },
        dark: {
            mainColor: '#0C2744',
            secondaryColor: '#9ECBFF',
            gridColor: '#3A2B40',
            lightColor: '#1E1429',
            darkColor: '#0E0617',
            textColor: '#FAEFF0',
            ...v3Params.dark
        }
    }
};

export default function themeGenerator(
    variant = 'v1',
    mode = 'light',
    contrast_color = '#3277B3',
    chartColors = defaultChartColors,
    params = {}
) {
    let _params = { ...params, ...BgVariantParams['v3'][mode] };
    if (variant === 'custom') {
        _params = { ...BgVariantParams[variant][mode], ...params };
    }
    switch (variant + '#' + mode) {
        case 'v1#light':
            return v1LightGenerator(contrast_color, chartColors, _params);
        case 'v1#dark':
            return v1DarkGenerator(contrast_color, chartColors, _params);
        case 'v2#light':
            return v2LightGenerator(contrast_color, chartColors, _params);
        case 'v2#dark':
            return v2DarkGenerator(contrast_color, chartColors, _params);
        case 'v3#light':
            return v3LightGenerator(contrast_color, chartColors, _params);
        case 'v3#dark':
            return v3DarkGenerator(contrast_color, chartColors, _params);
        case 'custom#light':
            return v3LightGenerator(contrast_color, chartColors, _params);
        case 'custom#dark':
            return v3LightGenerator(contrast_color, chartColors, _params);
        default:
            return v3LightGenerator(contrast_color, chartColors, _params);
    }
}
