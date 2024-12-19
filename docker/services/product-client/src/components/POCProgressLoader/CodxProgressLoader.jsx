import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Step, Stepper, StepLabel } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import AccessTime from '@material-ui/icons/AccessTime';
import createPlotlyComponent from 'react-plotly.js/factory';

const helperText = (value) => {
    const useStyles = makeStyles((theme) => ({
        helperText: {
            marginLeft: value?.left || '10%',
            marginTop: value?.top || '1%',
            fontSize: value?.fontSize || '2rem',
            color: value?.color || theme.palette.text.default,
            fontStyle: value?.fontStyle || 'regular',
            font: value?.font || 'inherit'
        }
    }));
    const classes = useStyles();
    return <p className={classes.helperText}>{value?.text || ''}</p>;
};

const headingText = (value, index) => {
    const useStyles = makeStyles((theme) => ({
        headingText: {
            marginLeft: value?.left || '20%',
            marginBottom: value?.bottom || '1%',
            fontSize: value?.fontSize || theme.spacing(2),
            color: value?.color || 'inherit',
            fontStyle: value?.fontStyle || 'regular',
            font: value?.font || 'inherit',
            opacity: value?.opacity || 1
        }
    }));
    const classes = useStyles();
    return (
        <p className={classes.headingText} key={`${value?.text}-${index}`}>
            {value?.text || ''}
        </p>
    );
};

function CodxStepperProgress(props) {
    const classes = props.classes;
    const stepsObject = Object.assign({}, props?.steps?.params?.steps);
    const steps = Object.keys(stepsObject);
    const progress = props.progress;
    const coldef = props.coldef;
    const activeStep = () => {
        let totalprogress = 0;
        for (let i = 0; i < steps.length; i++) {
            totalprogress += stepsObject[steps[i]];
            if (progress < totalprogress) {
                return i;
            }
        }
        return steps.length;
    };
    const [activestep, setActivestep] = React.useState(activeStep());

    useEffect(() => {
        let active = activeStep();
        setActivestep(active);
        let await_timer;
        await_timer = props.setTimer(await_timer);
        return () => {
            clearTimeout(await_timer);
        };
    }, [progress]);

    const CancelIcon = () => {
        return (
            <React.Fragment>
                <Cancel className={classes.errorIcon} />
            </React.Fragment>
        );
    };

    const labelProps = { error: false };
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <Stepper
                    className={classes.stepperConnector}
                    activeStep={activestep}
                    alternativeLabel
                >
                    {steps.map((label, key) => {
                        if (
                            (props.steps?.error === true || props.steps?.cancelled === true) &&
                            activestep === key
                        ) {
                            labelProps.error = true;
                            if (props.steps?.cancelled === true) {
                                labelProps.StepIconComponent = CancelIcon;
                            }
                        } else {
                            labelProps.error = false;
                        }

                        return (
                            <Step key={label}>
                                <StepLabel
                                    className={classes.steplabel}
                                    {...labelProps}
                                    classes={
                                        labelProps.error
                                            ? { label: classes.errorLabel }
                                            : { label: classes.label }
                                    }
                                    StepIconProps={{
                                        classes: {
                                            root: classes.icon,
                                            active: classes.active,
                                            text: classes.text,
                                            completed: classes.completed,
                                            error: classes.errorIcon
                                        }
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {props?.delay ? (
                    <Box className={classes.inlineFlex}>
                        {coldef?.cellRendererParams?.await_message ||
                            'Please wait , your code is running'}{' '}
                    </Box>
                ) : props.steps?.message ? (
                    <Box className={classes.inlineFlex}>{props.steps?.message}</Box>
                ) : null}
            </Box>
            {props.steps?.currentProgress ? (
                <Box minWidth={50}>
                    {(props.steps?.error || props.steps?.cancelled ? false : true) ? (
                        <>
                            <Typography variant="body2" className={classes.typography}>
                                <i>
                                    Progress <br />
                                </i>{' '}
                                {`${Math.round(progress)}%`}{' '}
                            </Typography>
                            {props.steps?.executionTime ? (
                                <Box className={classes.inlineFlex}>
                                    <AccessTime /> &nbsp;{props.steps?.executionTime}{' '}
                                </Box>
                            ) : null}
                        </>
                    ) : (props.steps?.cancelled ? true : false) ? (
                        <Typography variant="body2" className={classes.error}>
                            {'Cancelled'}
                        </Typography>
                    ) : (
                        <Typography variant="body2" className={classes.error}>
                            {'Failed'}
                        </Typography>
                    )}
                </Box>
            ) : null}
        </Box>
    );
}

function CodexCircularProgress(props) {
    const classes = props.classes;
    const params = props?.params?.params || null;
    return (
        <Box
            position="relative"
            display="inline-flex"
            style={{ marginLeft: params?.left || '30%', marginTop: params?.top || '0%' }}
        >
            <CircularProgress
                variant="determinate"
                value={props.progress}
                classes={{ colorPrimary: classes.circularIconColor }}
                size={params?.size ? `${params?.size}rem` : '20rem'}
                thickness={params?.thickness || 1}
                data-testis="progress-bar"
            />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {(props.params?.error || props.params?.cancelled ? false : true) ? (
                    <Typography
                        variant="caption"
                        component="div"
                        className={classes.progressText}
                    >{`${Math.round(props.progress)}%`}</Typography>
                ) : (props.params?.cancelled ? true : false) ? (
                    <Typography variant="body2" className={classes.typography}>
                        {'cancelled'}
                    </Typography>
                ) : (
                    <Typography variant="body2" className={classes.typography}>
                        {'Failed'}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function CodexGaugeProgress(props) {
    const Plotly = window.Plotly;
    const Plot = createPlotlyComponent(Plotly);
    const classes = props.classes;
    const params = props?.params?.params || null;
    const colors = params?.colors || ['red', '#F38448', '#F3BD48', '#F3DE48', '#D9F348', '#48F355'];
    const labels = params?.labels || [
        'Very poor',
        'Poor',
        'Average',
        'Good',
        'very Good',
        'Excellent'
    ];
    colors.push('rgba(255, 255, 255, 0)');
    labels.push('');
    let base_chart = {
        values: [10, 10, 10, 10, 10, 10, 40],
        labels: labels,
        marker: {
            colors: colors,
            line: {
                width: 3,
                color: 'transparent'
            }
        },
        name: 'Gauge',
        hole: params?.thickness || 0.65,
        rotation: -108,
        type: 'pie',
        direction: 'clockwise',
        sort: false,
        showlegend: false,
        hoverinfo: params?.labels ? 'label' : 'none',
        textinfo: 'none',
        textposition: 'outside'
    };
    // let degrees = 115, radius = .6;
    // let radians = degrees * Math.PI / 180;
    // let x = -1 * radius * Math.cos(radians);
    // let y = radius * Math.sin(radians);

    let layout = {
        paper_bgcolor: 'transparent',
        autoSize: false,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        height: params?.height || 150,
        width: params?.width || 200
    };
    let data = [base_chart];
    return (
        <Box display="flex" alignItems="center">
            <Box width="auto" mr={1}>
                <div className={classes.gaugeHolder}>
                    {params?.heading_text ? (
                        <div className={classes.headingTextHolder}>
                            {params?.heading_text.map((value, index) => headingText(value, index))}
                        </div>
                    ) : null}
                    <Plot
                        data={data}
                        layout={layout}
                        config={{ displayModeBar: false, responsive: true }}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        useResizeHandler={true}
                    />
                    <div className={classes.needle}></div>

                    {params?.helper_text ? (
                        <div className={classes.textHolder}>
                            {params?.helper_text.map((value) => helperText(value))}
                        </div>
                    ) : null}
                    {params?.showProgress && (
                        <p className={classes.needleText}>{props.progress}%</p>
                    )}
                </div>
            </Box>
        </Box>
    );
}

function CodexLinearProgress(props) {
    const classes = props.classes;
    const coldef = props.coldef;
    const params = props?.params?.params || null;
    useEffect(() => {
        let await_timer;
        await_timer = props.setTimer(await_timer);
        return () => {
            clearTimeout(await_timer);
        };
    }, [props.progress]);
    return (
        <Box display="flex" alignItems="center">
            <Box width="auto" minWidth={'80%'} mr={1}>
                <div className={classes.linearProgressHolder}>
                    {params?.heading_text ? (
                        <div className={classes.headingTextHolder}>
                            {params?.heading_text.map((value, index) => headingText(value, index))}
                        </div>
                    ) : null}
                    <div className={classes.linearProgress}>
                        {params?.center_text ? params?.center_text?.text : ''}
                    </div>
                    {params?.helper_text ? (
                        <div className={classes.textHolder}>
                            {params?.helper_text.map((value) => helperText(value))}
                        </div>
                    ) : null}
                </div>
                {props.params?.executionTime && !props?.delay && !props.params?.message ? (
                    <Box className={classes.inlineFlexLinear}>
                        <AccessTime /> &nbsp;{props.params?.executionTime}
                    </Box>
                ) : null}
                {props?.delay ? (
                    <Box className={classes.inlineFlexLinear}>
                        {coldef?.cellRendererParams?.await_message ||
                            'Please wait , your code is running'}{' '}
                    </Box>
                ) : props.params?.message ? (
                    <Box className={classes.inlineFlexLinear}>{props.params?.message}</Box>
                ) : null}
            </Box>
            {props.params?.currentProgress && params?.showProgress ? (
                <Box minWidth={'20%'} style={{ marginLeft: '1rem' }}>
                    {(props.params?.error || props.params?.cancelled ? false : true) ? (
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.progressText}
                        >
                            <i>
                                Progress <br />
                            </i>
                            {`${Math.round(props.progress)}%`}
                        </Typography>
                    ) : (props.params?.cancelled ? true : false) ? (
                        <Typography variant="body2" className={classes.error}>
                            {'Cancelled'}
                        </Typography>
                    ) : (
                        <Typography variant="body2" className={classes.error}>
                            {'Failed'}
                        </Typography>
                    )}
                </Box>
            ) : null}
        </Box>
    );
}

function CodexLinearBufferedProgress(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress
                    variant="determinate"
                    value={props.progress}
                    valueBuffer={props.bufferProgress}
                />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.progress
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

CodexCircularProgress.propTypes = {
    progress: PropTypes.number.isRequired
};
CodexLinearProgress.propTypes = {
    progress: PropTypes.number.isRequired
};
CodexLinearBufferedProgress.propTypes = {
    progress: PropTypes.number.isRequired,
    bufferProgress: PropTypes.number
};

export default function CodexProgressLoader({ hasbuffer, progress_info, coldef, ...props }) {
    const targetColumn = coldef?.field;
    const progressInfo = progress_info[targetColumn] || progress_info;
    const type = progressInfo?.['params']?.['type'] || 'linear';
    const progress_params = progressInfo?.['params'];
    let currentProgress = progressInfo?.currentProgress || 0;
    const [hasprogress, setHasprogress] = React.useState(currentProgress);
    // eslint-disable-next-line no-unused-vars
    const [buffer, setBuffer] = React.useState(hasbuffer || 0);
    const [delay, setDelay] = useState(false);
    // const app_details = props?.app_details
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%'
        },
        stepperConnector: {
            paddingLeft: '0px',
            '& .MuiStepConnector-alternativeLabel': {
                top: '5px',
                left: 'calc(-100% + 25px)',
                right: 'calc(100% - 5px)',
                position: 'absolute'
            },
            '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
                textAlign: 'left'
            }
        },
        steplabel: {
            alignItems: 'flex-start'
        },
        inlineFlex: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '2px'
        },
        inlineFlexLinear: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '5px',
            marginLeft: '50%'
        },
        typography: {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        error: {
            color: 'red !important',
            fontSize: '1.5rem'
        },
        icon: {
            color: progress_params?.iconColor
                ? `${progress_params.iconColor} !important`
                : 'lightgray !important',
            transform: progress_params?.iconSize ? `scale(${progress_params.iconSize})` : `scale(2)`
        },
        errorIcon: {
            color: 'red !important',
            transform: progress_params?.iconSize ? `scale(${progress_params.iconSize})` : `scale(2)`
        },
        completed: {
            color: progress_params?.completeClor || 'green !important',
            transform: progress_params?.iconSize ? `scale(${progress_params.iconSize})` : `scale(2)`
        },
        active: {
            color: progress_params?.activeIconColor
                ? `${progress_params.activeIconColor} !important`
                : '#FF831C !important',
            transform: progress_params?.iconSize
                ? `scale(${progress_params.iconSize})`
                : `scale(2)`,
            borderRadius: '50%',
            border: progress_params?.activeIconColor
                ? `0.5px solid ${progress_params.activeIconColor}`
                : '0.5px solid #FF831C'
        },
        text: {
            fill: progress_params?.textColor || theme.palette.text.default,
            fontSize: progress_params?.textSize || '2rem'
        },
        label: {
            color: progress_params?.labelColor || theme.palette.text.default + ' !important',
            fontSize: progress_params?.labelSize ? `${progress_params.labelSize}rem` : '12px',
            marginLeft: '-5px'
        },
        errorLabel: {
            color: progress_params?.labelColor || theme.palette.text.default,
            fontSize: progress_params?.labelSize ? `${progress_params.labelSize}rem` : '12px',
            fontWeight: 300,
            marginLeft: '-5px'
        },
        iconColor: {
            backgroundColor: progress_params?.iconColor ? `${progress_params.iconColor}` : '#FF831C'
        },
        circularIconColor: {
            color: progress_params?.color ? `${progress_params.color}` : 'green'
        },
        activeIconColor: {
            backgroundColor: progress_params?.activeIconColor
                ? `${progress_params.activeIconColor}`
                : 'green'
        },
        linearProgress: {
            height: progress_params?.height || '2rem',
            width: progress_params?.width || '100%',
            backgroundColor:
                progress_params?.backgroundColor ||
                'transparent' /* For browsers that do not support gradients */,
            background: `linear-gradient(to right,${
                progress_params?.color || theme.palette.primary.contrastText
            } ${hasprogress}%  , ${
                progress_params?.backgroundColor || theme.palette.background.details
            } ${hasprogress}%)`,
            borderRadius: `${progress_params?.borderRadius || 0}rem`,
            order: progress_params?.helper_text_positiom == ('bottom' || 'right') ? 2 : 3,
            border: `1px solid ${progress_params?.borderColor || theme.palette.background.details}`,
            color: progress_params?.center_text?.color || theme.palette.text.default,
            fontSize: progress_params?.center_text?.fontSize || '1.5rem',
            font: progress_params?.center_text?.font || 'inherit',
            fontStyle: progress_params?.center_text?.fontStyle || 'regular',
            fontWeight: progress_params?.center_text?.fontWeight || 500,
            paddingLeft: progress_params?.center_text?.left || '50%',
            marginRight: progress_params?.marginRight || 0,
            marginLeft: progress_params?.marginLeft || 0,
            paddingTop: progress_params?.center_text?.top || '0rem',
            transition: 'all 2s'
        },
        linearProgressHolder: {
            display: 'flex',
            flexDirection:
                progress_params?.helper_text_position == ('right' || 'left') ? 'row' : 'column',
            flexWrap: 'wrap',
            width: progress_params?.width || '100%',
            marginLeft: progress_params?.left || '0',
            marginTop: progress_params?.top || '0',
            height: 'fit-content'
        },
        textHolder: {
            display: 'flex',
            marginRight: progress_params?.helper_text?.right || 0,
            marginLeft: progress_params?.helper_text?.left || 0,
            order: progress_params?.helper_text_position == ('bottom' || 'right') ? 3 : 2
        },
        headingTextHolder: {
            display: 'flex',
            order: 1
        },
        gaugeHolder: {
            position: 'relative',
            width: 'auto',
            marginLeft: progress_params?.left || 0,
            marginTop: progress_params?.top || 0
        },
        needle: {
            width: '0',
            height: '0',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: `${progress_params?.needle?.height || '6rem'} solid ${
                progress_params?.needle?.color || theme.palette.text.default
            }`,
            borderBottomLeftRadius: progress_params?.needle?.radius || '1rem',
            borderBottomRightRadius: progress_params?.needle?.radius || '1rem',
            left: progress_params?.needle?.left || '48%',
            position: 'absolute',
            bottom: progress_params?.needle?.bottom || '50%',
            transform: `rotate(${-110 + 2.2 * hasprogress}deg)`,
            transformOrigin: 'bottom'
        },
        needleText: {
            position: 'absolute',
            bottom: progress_params?.progress_text?.bottom || '20%',
            left: progress_params?.progress_text?.left || '46%',
            color: progress_params?.progress_text?.color || theme.palette.text.default,
            fontSize: progress_params?.progress_text?.fontSize || '2rem',
            font: progress_params?.progress_text?.font || 'inherit',
            fontStyle: progress_params?.progress_text?.fontStyle || 'regular',
            fontWeight: progress_params?.progress_text?.fontWeight || 500
        },
        progressText: {
            color: progress_params?.progress_text?.color || theme.palette.text.default,
            fontSize: progress_params?.progress_text?.fontSize || '1.5rem',
            font: progress_params?.progress_text?.font || 'inherit',
            fontStyle: progress_params?.progress_text?.fontStyle || 'regular',
            fontWeight: progress_params?.progress_text?.fontWeight || 500,
            paddingLeft: progress_params?.progress_text?.left || '1rem',
            paddingTop: progress_params?.progress_text?.top || '0rem'
        },
        circularProgress: {
            color: progress_params?.progress_text?.color || theme.palette.text.default,
            fontSize: progress_params?.progress_text?.fontSize || '1.5rem',
            font: progress_params?.progress_text?.font || 'inherit',
            fontStyle: progress_params?.progress_text?.fontStyle || 'regular',
            fontWeight: progress_params?.progress_text?.fontWeight || 500,
            paddingLeft: progress_params?.progress_text?.left || '1rem',
            paddingTop: progress_params?.progress_text?.top || '0rem'
        }
    }));
    const classes = useStyles();
    useEffect(() => {
        setHasprogress(currentProgress);
    }, [currentProgress]);

    useEffect(() => {
        progressInfo.currentProgress = hasprogress;
        if (progress_params?.interconnected && hasprogress >= progress_params?.triggerValue) {
            props.onProgress(progressInfo);
        }
    }, [hasprogress]);

    const setTimer = (await_timer) => {
        setDelay(false);
        if (coldef?.cellRendererParams?.await_time && hasprogress != 100) {
            const await_time = coldef?.cellRendererParams?.await_time * 1000 || 30000;
            if (
                progress_params?.last_updated_time &&
                new Date() - progress_params?.last_updated_time >= await_time
            ) {
                setDelay(true);
            } else {
                await_timer = setTimeout(() => {
                    if (
                        !progress_params?.last_updated_time ||
                        new Date() - progress_params?.last_updated_time >= await_time
                    ) {
                        setDelay(true);
                    }
                }, await_time);
            }
        }
        return await_timer;
    };

    const renderCircularLoader = () => {
        return (
            <CodexCircularProgress progress={hasprogress} params={progressInfo} classes={classes} />
        );
    };
    const renderStepperLoader = () => {
        return (
            <CodxStepperProgress
                delay={delay}
                setTimer={setTimer}
                coldef={coldef}
                steps={progressInfo}
                progress={hasprogress}
                classes={classes}
            />
        );
    };
    const renderLinearLoader = () => {
        if (!hasbuffer) {
            return (
                <CodexLinearProgress
                    delay={delay}
                    setTimer={setTimer}
                    coldef={coldef}
                    progress={hasprogress}
                    params={progressInfo}
                    classes={classes}
                />
            );
        } else {
            return <CodexLinearBufferedProgress progress={hasprogress} bufferProgress={buffer} />;
        }
    };
    const renderGaugeLoader = () => {
        if (!hasbuffer) {
            return (
                <CodexGaugeProgress
                    delay={delay}
                    setTimer={setTimer}
                    coldef={coldef}
                    progress={hasprogress}
                    params={progressInfo}
                    classes={classes}
                />
            );
        } else {
            return <CodexLinearBufferedProgress progress={hasprogress} bufferProgress={buffer} />;
        }
    };

    const renderComponent = () => {
        switch (type) {
            case 'linear':
                return renderLinearLoader();
            case 'gauge':
                return renderGaugeLoader();
            case 'stepper':
                return renderStepperLoader();
            case 'circular':
                return renderCircularLoader();
            default:
                return renderLinearLoader();
        }
    };

    return <div className={classes.root}>{renderComponent()}</div>;
}
