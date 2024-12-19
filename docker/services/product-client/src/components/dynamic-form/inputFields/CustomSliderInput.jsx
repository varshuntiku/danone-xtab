import React from 'react';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const CustomSliderInput = ({ onChange, ...props }) => {
    const useStylesCustomSliders = makeStyles((theme) => ({
        simulatorSliderLabel: {
            color: theme.palette.text.default,
            fontSize: '1.5rem',
            padding: theme.spacing(1, 0)
        },
        simulatorSliderInput: {
            margin: theme.spacing(0.35, 0),
            color: theme.palette.primary.contrastText
        },
        simulatorSliderInputBox: {
            marginLeft: theme.spacing(2),
            '&&&:before': {
                borderBottom: 'none'
            },
            '& input': {
                // padding: theme.spacing(1),
                backgroundColor: theme.palette.primary.main,
                border: '2px solid ' + theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textAlign: 'right',
                padding: theme.spacing(0.3, 0),
                margin: theme.spacing(0.6, 0),
                fontSize: '1.5rem',
                borderRadius: '5px'
            }
        },
        simulatorSectionHeader: {
            color: theme.palette.text.default,
            fontSize: '2rem',
            fontWeight: 400,
            padding: theme.spacing(2, 0),
            textDecoration: 'underline'
        },
        simulatorOptimizeCellLabel: {
            float: 'left',
            fontSize: '1.5rem',
            padding: theme.spacing(1, 0),
            color: theme.palette.text.default
        },
        simulatorOptimizeCellInput: {
            marginLeft: theme.spacing(2),
            '&&&:before': {
                borderBottom: 'none'
            },
            '& input': {
                // padding: theme.spacing(1),
                float: 'right',
                backgroundColor: theme.palette.primary.main,
                border: '2px solid ' + theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                textAlign: 'right',
                padding: theme.spacing(0.5, 0),
                margin: theme.spacing(0.6, 0),
                fontSize: '1.5rem',
                borderRadius: '5px'
            }
        }
    }));

    const classes = useStylesCustomSliders();
    const [value, setValue] = React.useState(props.value);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        onChange(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        onChange(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < props.min) {
            setValue(props.min);
            onChange(props.min);
        } else if (value > props.max) {
            setValue(props.max);
            onChange(props.max);
        }
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={2}>
                    <Typography
                        id={'input-slider-heading' + props.id}
                        className={classes.simulatorSliderLabel}
                        variant="h5"
                        gutterBottom
                    >
                        {props.label}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Slider
                        className={classes.simulatorSliderInput}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        value={value}
                        step={props.steps || 0.01}
                        max={props.max}
                        min={props.min}
                    />
                </Grid>

                <Grid item xs={4}>
                    <Input
                        className={classes.simulatorSliderInputBox}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: props.steps,
                            min: props.min,
                            max: props.max,
                            type: 'number',
                            'aria-labelledby': 'input-slider'
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default CustomSliderInput;
