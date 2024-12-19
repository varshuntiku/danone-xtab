import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import '../../diagnoseme.css';

export default function CustomRadioButtons({ radioButtonData }) {
    const [radioKey, radioValue, handleRadioValueChange, radioError] = radioButtonData;
    return (
        <React.Fragment>
            <div className="layout9">
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        aria-label="position"
                        name="yesno"
                        defaultValue="top"
                        key={radioKey}
                        value={radioValue}
                        required
                        onChange={handleRadioValueChange}
                    >
                        <FormControlLabel
                            value="Yes"
                            control={<Radio />}
                            label={
                                <div>
                                    <p className="radioLabel">Yes</p>
                                </div>
                            }
                        />
                        <FormControlLabel
                            className="marginLeft2"
                            value="No"
                            control={<Radio />}
                            label={
                                <div>
                                    <p className="radioLabel">No</p>
                                </div>
                            }
                        />
                    </RadioGroup>
                </FormControl>
                <div>
                    {radioError ? (
                        <span className="validationMsg">Please select one option </span>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}
