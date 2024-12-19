const fontFamilyConfig = [
    {
        fontName: 'Graphik',
        source: 'local',
        fontConfigs: [
            {
                fontWeight: 300,
                fontPath: '/fonts/Graphik300.woff2',
                display: 'swap',
                style: 'normal'
            },
            {
                fontWeight: 300,
                fontPath: '/fonts/Graphik300I.woff2',
                display: 'swap',
                style: 'italic'
            },
            {
                fontWeight: 400,
                fontPath: '/fonts/Graphik400.woff2',
                display: 'swap',
                style: 'normal'
            },
            {
                fontWeight: 500,
                fontPath: '/fonts/Graphik500.woff2',
                display: 'swap',
                style: 'normal'
            }
        ]
    },
    {
        fontName: 'Graphik Compact',
        source: 'local',
        fontConfigs: [
            {
                fontWeight: 300,
                fontPath: '/fonts/GraphikCompact300.woff2',
                display: 'swap',
                style: 'normal'
            },
            {
                fontWeight: 400,
                fontPath: '/fonts/GraphikCompact400.woff2',
                display: 'swap',
                style: 'normal'
            },
            {
                fontWeight: 500,
                fontPath: '/fonts/GraphikCompact500.woff2',
                display: 'swap',
                style: 'normal'
            }
        ]
    }
];

const defaultFont = 'Arial,sans-serif';

const GLOBAL_FONT_FAMILY = fontFamilyConfig
    .map((font) => font.fontName)
    .concat(defaultFont)
    .join();

const GLOBAL_FONT_FAMILY_ARRAY = {};

fontFamilyConfig.forEach((font, index) => {
    if (index == 0) {
        GLOBAL_FONT_FAMILY_ARRAY['primaryFont'] = font.fontName;
    } else if (index == 1) {
        GLOBAL_FONT_FAMILY_ARRAY['secondaryFont'] = font.fontName;
    } else {
        GLOBAL_FONT_FAMILY_ARRAY[`secondaryFont` + index] = font.fontName;
    }
});

export { fontFamilyConfig, GLOBAL_FONT_FAMILY, GLOBAL_FONT_FAMILY_ARRAY };
