import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Typography } from '@material-ui/core';
import { SavedScenarioContext } from './AppScreen';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        minWidth: 150
    },
    select: {
        fontSize: theme.layoutSpacing(14),
        fontWeight: '500', // Increased font weight
        color: theme.palette.text.titleText,
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            paddingRight: theme.spacing(4),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1)
        },
        '& .MuiSelect-icon': {
            top: '50%',
            transform: 'translateY(-50%)'
        }
    },
    button: {
        marginLeft: 'auto'
    },
    text: {
        fontSize: '1.5rem',
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        marginRight: theme.spacing(1)
    }
}));

const ScenarioSelector = ({ scenario_list, filter_index, handleWidgetFilterTrigger, params }) => {
    const classes = useStyles();
    const [scenario, setScenario] = React.useState(scenario_list[filter_index]);
    const { openPopup } = useContext(SavedScenarioContext) || false;

    const handleChange = (event) => {
        setScenario(event.target.value);
        handleWidgetFilterTrigger(event.target.value);
    };

    const handleSavedScenarioPopup = () => {
        openPopup(params);
    };

    return (
        <div className={classes.container}>
            <Typography className={classes.text}>Select Scenario</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
                {/* <InputLabel shrink={true}>Base suggested</InputLabel> */}
                <Select
                    value={scenario}
                    onChange={handleChange}
                    className={classes.select}
                    IconComponent={ArrowDropDownIcon}
                >
                    {scenario_list.map((val, ind) => (
                        <MenuItem value={val} key={`scenario${ind}`}>
                            {val}
                        </MenuItem>
                    ))}
                    {/* Add more MenuItems as needed */}
                </Select>
            </FormControl>
            <Button variant="text" className={classes.button} onClick={handleSavedScenarioPopup}>
                View Input
            </Button>
        </div>
    );
};

export default ScenarioSelector;
