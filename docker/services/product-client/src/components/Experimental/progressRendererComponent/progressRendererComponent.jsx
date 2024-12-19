import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CodexProgressLoader from 'components/POCProgressLoader/CodxProgressLoader';
import CustomLegends from 'components/custom/CustomLegends';

const textRenderer = (value, index) => {
    const useStyles = makeStyles((theme) => ({
        textHolder: {
            color: value?.color || theme.palette.text.default,
            left: value?.left || 'inherit',
            bottom: value?.bottom || 'inherit',
            position: 'absolute',
            fontSize: value?.fontSize || '2rem',
            font: value?.font || 'inherit',
            fontStyle: value?.fontStyle || 'regular',
            backgroundColor: value?.background || 'transparent',
            border: value?.border || '0px',
            width: value?.width || 'auto',
            height: value?.height || '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }
    }));
    const classes = useStyles();
    return (
        <p className={classes.textHolder} key={`${value?.text}-${index}`}>
            {value?.text || ''}
        </p>
    );
};

const legendRenderer = (legends) => {
    const useStyles = makeStyles(() => ({
        legendsHolder: {
            left: legends?.params?.left || 'inherit',
            bottom: legends?.params?.bottom || 'inherit',
            position: 'absolute'
        }
    }));
    const classes = useStyles();
    return (
        <div className={classes.legendsHolder}>
            <CustomLegends legends={legends?.values} props={legends?.props} />
        </div>
    );
};

const CustomProgressRendererComponent = ({ params, style }) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            position: 'relative',
            width: '100%',
            height: '100%',
            color: theme.palette.text.default,
            fontSize: '2rem',
            display: style?.display || 'block',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
        }
    }));
    const classes = useStyles();
    const progressBars = params.elements.components?.progressBars;
    const texts = params.elements.components?.texts;
    const legends = params.elements.components?.legends;

    return (
        <div className={classes.container}>
            {progressBars &&
                progressBars.map((value, key) => (
                    <CodexProgressLoader
                        hasbuffer={false}
                        coldef={null}
                        progress_info={value}
                        key={key}
                    />
                ))}
            {texts && texts.map((value, index) => textRenderer(value, index))}
            {legends && legendRenderer(legends)}
        </div>
    );
};

export default CustomProgressRendererComponent;
