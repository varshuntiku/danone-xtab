import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import DiagnosisImg from 'assets/img/diagnoseme/DiagnosisImg.svg';
import Female from 'assets/img/diagnoseme/female.svg';
import Male from 'assets/img/diagnoseme/male.svg';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Symptoms from './symptoms/Symptoms';
import NextBackButtonComponent from '../components/NextBackButtonComponent';
import '../diagnoseme.css';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ImagesLayout from '../components/imagesLayout/ImagesLayout';

const useStyles = makeStyles(() => ({
    textFieldLayout: {
        width: '502.05px',
        height: '46.7px',
        border: '0.49px',
        borderColor: '#9C9C9C',
        fontSize: '1.5rem'
    },
    textField: {
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '17px',
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left',
        '&.MuiOutlinedInput-input': {
            fontSize: '2rem'
        }
    },
    textFieldHeading: {
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '17px',
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left'
    }
}));

export default function Diagnosis(props) {
    const classes = useStyles();
    const diagnosisFormDataStep1 = useSelector((state) => state.diagnosisFormData.step1);
    const { activeStep, handleNextStep, handleBackStep, handleChange, steps } = props;
    const symptomsPage = false;
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [ageErrorMessage, setAgeErrorMessage] = useState('');
    const [ageError, setAgeError] = useState(false);
    const [genderError, setGenderError] = useState(false);
    let imgStyle = 'image3';

    const handleNext = () => {
        if (
            diagnosisFormDataStep1?.name &&
            diagnosisFormDataStep1?.age &&
            diagnosisFormDataStep1?.gender
        ) {
            handleNextStep();
        } else {
            if (!diagnosisFormDataStep1?.name) {
                setNameError(true);
                setNameErrorMessage('Please enter the name');
            }
            if (!diagnosisFormDataStep1?.age) {
                setAgeError(true);
                setAgeErrorMessage('Please enter the age');
            }
            if (!diagnosisFormDataStep1?.gender) {
                setGenderError(true);
            }
        }
    };

    const handleNameChange = (e) => {
        const nameRegEx = new RegExp('^[a-zA-Z]+[ ]{0,1}[a-zA-Z]+$');
        nameRegEx.test(e.target.value) === false ? setNameError(true) : setNameError(false);
        nameRegEx.test(e.target.value) === false
            ? setNameErrorMessage('Please entert the valid name')
            : setNameErrorMessage('');
        handleChange('step1', e.target.name, e.target.value);
    };

    const handleAgeChange = (e) => {
        const ageRegEx = new RegExp('^([0-9]|([1-9][0-9])|120)$');
        ageRegEx.test(e.target.value) === false ? setAgeError(true) : setAgeError(false);
        ageRegEx.test(e.target.value) === false
            ? setAgeErrorMessage('Please enter the valid age')
            : setAgeErrorMessage('');
        handleChange('step1', e.target.name, e.target.value);
    };

    return (
        <React.Fragment>
            {symptomsPage === false ? (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className="layoutSize"
                >
                    <Grid item xs={12} className="layoutSize marginTop2">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            className="layoutSize"
                        >
                            <Grid item xs={1}></Grid>
                            <Grid item xs={5} className="layoutSize marginTop2">
                                <div className="layoutSize5">
                                    <div className="layout9">
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-basic"
                                            className={classes.textFieldLayout}
                                            variant="outlined"
                                            error={nameError}
                                            placeholder="Name"
                                            required
                                            name="name"
                                            // label="Name"
                                            value={diagnosisFormDataStep1?.name}
                                            onChange={handleNameChange}
                                            inputProps={{ className: classes.textField }}
                                            InputLabelProps={{
                                                className: 'textFieldInputProp'
                                            }}
                                        />
                                        <div className="marginTop4">
                                            {nameError ? (
                                                <span className="validationMsg">
                                                    {nameErrorMessage}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <div className="layout9">
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-basic"
                                            // label="Age"
                                            placeholder="Age"
                                            type="number"
                                            name="age"
                                            variant="outlined"
                                            className={classes.textFieldLayout}
                                            value={diagnosisFormDataStep1?.age || ''}
                                            required
                                            error={ageError}
                                            onChange={handleAgeChange}
                                            inputProps={{ className: classes.textField }}
                                            InputLabelProps={{
                                                className: 'textFieldInputProp'
                                            }}
                                        />
                                        <div className="marginTop4">
                                            {' '}
                                            {ageError ? (
                                                <span className="validationMsg">
                                                    {ageErrorMessage}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>

                                    <div className="layout9">
                                        <div className="marginBottom2">
                                            <Typography
                                                className={classes.textFieldHeading}
                                                variant="h4"
                                            >
                                                Gender
                                            </Typography>
                                        </div>
                                        <div>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    row
                                                    aria-label="position"
                                                    name="gender"
                                                    defaultValue="top"
                                                    value={diagnosisFormDataStep1?.gender || null}
                                                    required
                                                    error={genderError}
                                                    onChange={(e) => {
                                                        setGenderError(false);
                                                        handleChange(
                                                            'step1',
                                                            e.target.name,
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="male"
                                                        control={
                                                            <Radio
                                                                icon={
                                                                    <img
                                                                        src={Male}
                                                                        alt="Radio Icon"
                                                                        width={'100px'}
                                                                        height={'100px'}
                                                                    />
                                                                }
                                                                checkedIcon={
                                                                    <img
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#E2EFFF'
                                                                        }}
                                                                        src={Male}
                                                                        alt="Radio Icon"
                                                                        width="100px"
                                                                        height="100px"
                                                                    />
                                                                }
                                                            />
                                                        }
                                                        label={<p className="radioLabel">Male</p>}
                                                        labelPlacement="bottom"
                                                    />
                                                    <FormControlLabel
                                                        className="marginLeft2"
                                                        value="female"
                                                        control={
                                                            <Radio
                                                                icon={
                                                                    <img
                                                                        src={Female}
                                                                        alt="Radio Icon"
                                                                        width={'100px'}
                                                                        height={'100px'}
                                                                    />
                                                                }
                                                                checkedIcon={
                                                                    <img
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#E2EFFF'
                                                                        }}
                                                                        src={Female}
                                                                        alt="Radio Icon"
                                                                        width="100px"
                                                                        height="100px"
                                                                    />
                                                                }
                                                            />
                                                        }
                                                        label={<p className="radioLabel">Female</p>}
                                                        labelPlacement="bottom"
                                                    />
                                                </RadioGroup>
                                                <div>
                                                    {genderError ? (
                                                        <span className="validationMsg">
                                                            Please select the gender
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <NextBackButtonComponent
                                        buttonData={[activeStep, handleBackStep, handleNext, steps]}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={5} className="layoutSize marginTop3">
                                <ImagesLayout imgData={[DiagnosisImg, imgStyle]} />
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
                <Symptoms />
            )}
        </React.Fragment>
    );
}
