import React, { useEffect, useState } from 'react';
import CodxCircularLoader from './CodxCircularLoader';
import { fontFamilyConfig, GLOBAL_FONT_FAMILY } from 'util/fontFamilyConfig';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100%',
        background: theme.palette.background.pureWhite
    },
    loaderContainer: {
        height: '100%',
        background: theme.palette.background.pureWhite
    }
}));

const PlotlyLoader = (props) => {
    const [plotlyLoaded, setPlotlyLoaded] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [cdnIndex, setcdnIndex] = useState(0);

    // Loading Fonts Start
    document.querySelector(':root').style.setProperty('--global-font', GLOBAL_FONT_FAMILY);

    fontFamilyConfig.forEach((font) => {
        if (font.source === 'local') {
            font.fontConfigs.forEach((fontConfig) => {
                const newFont = new FontFace(font.fontName, `url(${fontConfig.fontPath})`, {
                    weight: fontConfig.fontWeight,
                    display: fontConfig.display,
                    style: fontConfig.style
                });
                document.fonts.add(newFont);
                newFont.load();
            });
        }
    });

    const GLOBAL_FONT_ARRAY = fontFamilyConfig
        .filter((font) => font.source === 'google')
        .map((font) => {
            if (font.source === 'google') {
                return font.fontName + ':' + font.fontWeights.join(',');
            }
        });

    if (GLOBAL_FONT_ARRAY.length > 0) {
        window.WebFont.load({
            google: {
                families: GLOBAL_FONT_ARRAY
            }
        });
    }

    document.fonts.ready.then(() => {
        setFontsLoaded(true);
    });

    // Loading Fonts End

    const classes = useStyles();

    const cdnUrls = [
        'https://cdn.plot.ly/plotly-2.18.0.min.js',
        'https://codex-plotly.azureedge.net/cdn_plotly-2.18.0.min.js',
        '/plotly-2.18.0.min.js'
    ];

    useEffect(() => {
        if (cdnIndex >= cdnUrls.length) {
            setPlotlyLoaded(true);
        } else {
            addPlotlyCDN(cdnUrls[cdnIndex]);
        }
    }, [cdnIndex]);

    function addPlotlyCDN(url) {
        var script = document.createElement('script');
        script.src = url;

        script.onerror = () => {
            setcdnIndex(cdnIndex + 1);
        };

        script.onload = () => {
            setPlotlyLoaded(true);
        };

        document.head.appendChild(script);
    }

    return (
        <div className={classes.container}>
            {plotlyLoaded && fontsLoaded ? (
                props.children
            ) : (
                <div className={classes.loaderContainer}>
                    <CodxCircularLoader size={60} center />
                </div>
            )}
        </div>
    );
};

export default PlotlyLoader;
