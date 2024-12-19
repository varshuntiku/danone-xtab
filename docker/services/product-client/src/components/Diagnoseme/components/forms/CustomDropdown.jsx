import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import '../../diagnoseme.css';

const useStyles = makeStyles((theme) => ({
    paper: {
        fontSize: theme.layoutSpacing(15),
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(18),
        letterSpacing: '0.5px',
        textAlign: 'left'
    },
    dropdownLayout: {
        width: '514px',
        height: '48px',
        '& * .MuiIconButton-label svg': {
            fontSize: '2rem'
        }
    },
    textField: {
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '17px',
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left'
    },
    textFieldHeading: {
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '17px',
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left'
    },
    headingLayout: {
        width: '517px',
        height: '28px',
        top: '404px',
        left: '430px'
    },
    heading: {
        fontSize: theme.layoutSpacing(24),
        fontWeight: '500',
        lineHeight: theme.layoutSpacing(28),
        letterSpacing: '1px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    subHeading: {
        fontSize: theme.layoutSpacing(24),
        fontWeight: '400',
        lineHeight: theme.layoutSpacing(28),
        letterSpacing: '0px',
        textAlign: 'left'
    },
    subText: {
        fontSize: theme.layoutSpacing(16),
        fontStyle: 'italic',
        fontWeight: '300',
        lineHeight: theme.layoutSpacing(19),
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left'
    }
}));

const StyledChip = withStyles((theme) => ({
    root: {
        height: theme.layoutSpacing(30),
        fontSize: theme.layoutSpacing(15) + ' !important',
        fontWeight: '400 !important',
        lineHeight: theme.layoutSpacing(18) + ' !important',
        letterSpacing: '0px !important',
        textAlign: 'left !important'
    }
}))(Chip);

const StyledAutocomplete = withStyles({
    input: {
        fontSize: '15px !important'
    }
})(Autocomplete);

export default function CustomDropdown({ dropdownData }) {
    const [valuesList, selectedValues, handleSelectChange, nestedValues, formError] = dropdownData;
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className="layout9">
                <StyledAutocomplete
                    className={classes.dropdownLayout}
                    classes={{ paper: classes.paper }}
                    multiple
                    id="filled"
                    options={valuesList}
                    getOptionLabel={(option) => (nestedValues === true ? option?.question : option)}
                    filterSelectedOptions
                    value={selectedValues}
                    name="Select Values"
                    onChange={handleSelectChange}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <StyledChip
                                key={index}
                                className="fontStyle3"
                                variant="outlined"
                                label={nestedValues === true ? option?.question : option}
                                size="large"
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            className="fontStyle3"
                            {...params}
                            variant="outlined"
                            required
                            error={formError}
                        />
                    )}
                />
                <div className="marginTop4">
                    {formError ? (
                        <span className="validationMsg">Please select atleast one option</span>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
