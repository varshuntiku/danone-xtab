import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { getSymptomsList, getSymptomQuestionsList } from '../../services/services';
import { makeStyles } from '@material-ui/core/styles';
import NextBackButtonComponent from '../../components/NextBackButtonComponent';
import HumanBodyCompenent from 'components/Diagnoseme/components/humanBodySymptoms/HumanBodyComponent';
import { updateDiagnosisFormData } from '../../store/slices/diagnosisFormDataSlice';
import { findKeysBySymptoms } from '../../utils/helper';
import { getCategorySymptomsList } from '../../services/services';
import CustomDropdown from '../../components/forms/CustomDropdown';
import AssociatedSymptoms from './AssociatedSymptoms';
import Symptoms1 from 'assets/img/diagnoseme/TransitionImages/Symptoms1.svg';
import Symptoms2 from 'assets/img/diagnoseme/TransitionImages/Symptoms2.svg';
import Symptoms3 from 'assets/img/diagnoseme/TransitionImages/Symptoms3.svg';
import Symptoms4 from 'assets/img/diagnoseme/TransitionImages/Symptoms4.svg';
import Symptoms5 from 'assets/img/diagnoseme/TransitionImages/Symptoms5.svg';
import Symptoms6 from 'assets/img/diagnoseme/TransitionImages/Symptoms6.svg';
import ImageTransitions from '../../components/imagesLayout/ImageTransitions';
import ImagesLayout from '../../components/imagesLayout/ImagesLayout';
import '../../diagnoseme.css';

const useStyles = makeStyles((theme) => ({
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

export default function Symptoms(props) {
    const { activeStep, steps } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const selectedSymptoms = useSelector((state) => state.diagnosisFormData?.step2.symptoms || []);
    const symptom_details = useSelector(
        (state) => state.diagnosisFormData?.step2.symptom_details || []
    );

    const [symptoms, setSymptoms] = useState([]);
    const [isSymptomList, setIsSymptomList] = useState(true);
    const [resultData, setResultData] = useState(symptom_details || []);
    const [symptomQuestionBank, setSymptomQuestionBank] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [radioValue, setRadioValue] = useState([]);
    const [allSymptomsList, setAllSymptomsList] = useState({});
    const [formError, setFormError] = useState(false);
    const [radioError, setRadioError] = useState(false);
    const [imageLayers, setImageLayers] = useState([]);
    const symptImages = [Symptoms1, Symptoms2, Symptoms3, Symptoms4, Symptoms5, Symptoms6];
    const nestedValues = false;
    const isTrans = true;
    let transType = '';
    let imgStyle = '';

    useEffect(() => {
        getSymptoms();
        getTransitionInfo();
        // Simulate fetching symptoms from an API
        getCategorySymptomsList().then((res) => {
            setAllSymptomsList(res);
        });
    }, []);

    const getSymptoms = () => {
        getSymptomsList().then((re) => {
            setSymptoms(re.symptoms);
        });
    };

    const getSymptomQuestions = () => {
        getSymptomQuestionsList(selectedSymptoms).then((re) => {
            setSymptomQuestionBank(re.symptoms_questions);
            if (re.symptoms_questions.length > 0) {
                setIsSymptomList(!isSymptomList);
            } else {
                nextPage();
            }
        });
    };

    const handleSelectChange = (event, value) => {
        setFormError(false);
        dispatch(
            updateDiagnosisFormData({
                step: 'step2',
                fieldName: 'symptoms',
                value: value
            })
        );

        const keysForSymptom = findKeysBySymptoms(value, allSymptomsList);
        if (value && value?.length > 0 && keysForSymptom) {
            dispatch(
                updateDiagnosisFormData({
                    step: 'step2',
                    fieldName: 'selectedBodyPartWithSymptoms',
                    value: keysForSymptom
                })
            );

            // TODO: Remove objects where 'symptoms' property is 'chest pain'
            // const updatedSymptomDetails = removeObjectsByValue(symptom_details, value);
            // dispatch(
            //     updateDiagnosisFormData({
            //         step: 'step2',
            //         fieldName: 'symptom_details',
            //         value: updatedSymptomDetails
            //     })
            // );
        } else if (!keysForSymptom && value.length === 0) {
            dispatch(
                updateDiagnosisFormData({
                    step: 'step2',
                    fieldName: 'selectedBodyPartWithSymptoms',
                    value: []
                })
            );
            dispatch(
                updateDiagnosisFormData({
                    step: 'step2',
                    fieldName: 'symptom_details',
                    value: []
                })
            );
        }
    };

    const handleAnswerSelectChange = (event, value) => {
        setFormError(false);
        setRadioValue(value);
    };

    const handleIsSymptomList = () => {
        if (selectedSymptoms.length > 0) {
            setFormError(false);
            getSymptomQuestions();
        } else {
            setFormError(true);
            // nextPage();
        }
    };

    const handleNextQuestion = () => {
        const addQusBank = [...resultData];

        if (radioValue.length >= 1) {
            setRadioError(false);
            setFormError(false);
            addQusBank.push({
                quest: symptomQuestionBank[currentQuestion].question,
                ans: typeof radioValue === 'object' ? radioValue : [radioValue],
                symptoms: symptomQuestionBank[currentQuestion].symptoms
            });
            dispatch(
                updateDiagnosisFormData({
                    step: 'step2',
                    fieldName: 'symptom_details',
                    value: addQusBank
                })
            );
            setResultData(addQusBank);
            setRadioValue([]);

            if (currentQuestion + 1 < symptomQuestionBank.length) {
                setCurrentQuestion(currentQuestion + 1);
                setImageLayers((imageLayers) => [...imageLayers, symptImages[currentQuestion]]);
            } else {
                nextPage();
            }
        } else {
            setRadioError(true);
            setFormError(true);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setRadioValue(resultData[currentQuestion - 1].ans[0]);
        } else {
            setIsSymptomList(!isSymptomList);
        }
    };

    const handleRadioValueChange = (event) => {
        setRadioError(false);
        setRadioValue(event.target.value);
    };

    const nextPage = () => {
        let data = {
            Symptoms: selectedSymptoms,
            symptom_details: symptom_details
        };
        props.handleNextStep();
        props.getData(data);
    };

    const backPage = () => {
        props.handleBackStep();
    };

    const getTransitionInfo = (info) => {
        switch (info) {
            case 0:
                transType = 'right-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImageTransitions
                            imgData={[symptImages[currentQuestion], isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 1:
                transType = 'bottom-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImagesLayout imgData={[Symptoms1, imgStyle]} />
                        <ImageTransitions
                            imgData={[symptImages[currentQuestion], isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 2:
                transType = 'bottom-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImagesLayout imgData={[Symptoms1, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms2, imgStyle]} />
                        <ImageTransitions
                            imgData={[
                                symptImages[currentQuestion],
                                isTrans,
                                transType,
                                (imgStyle = 'image1')
                            ]}
                        />
                    </div>
                );
            case 3:
                transType = 'bottom-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImagesLayout imgData={[Symptoms1, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms2, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms3, imgStyle]} />
                        <ImageTransitions
                            imgData={[symptImages[currentQuestion], isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 4:
                transType = 'left-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImagesLayout imgData={[Symptoms1, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms2, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms3, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms4, imgStyle]} />
                        <ImageTransitions
                            imgData={[symptImages[currentQuestion], isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 5:
                transType = 'right-slide';
                imgStyle = 'image1';
                return (
                    <div>
                        <ImagesLayout imgData={[Symptoms1, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms2, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms3, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms4, imgStyle]} />
                        <ImagesLayout imgData={[Symptoms5, imgStyle]} />
                        <ImageTransitions
                            imgData={[symptImages[currentQuestion], isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            default:
                imgStyle = 'image1';
                return (
                    <div>
                        {imageLayers.map((element, index) => {
                            return <ImagesLayout key={index} imgData={[element, imgStyle]} />;
                        })}
                    </div>
                );
        }
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="layoutSize textCenterAlign"
        >
            <Grid item xs={12} className="layoutSize marginTop2">
                <div className="layoutSize">
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-start"
                        className="layoutSize2 textAlignLeft"
                    >
                        <Grid item xs={1}></Grid>
                        {isSymptomList === false && symptomQuestionBank.length > 0 ? (
                            <>
                                <Grid item xs={5} className="layoutSize marginTop2">
                                    <AssociatedSymptoms
                                        associatedSymptData={[
                                            symptomQuestionBank[currentQuestion].question,
                                            symptomQuestionBank[currentQuestion].type,
                                            currentQuestion,
                                            resultData[currentQuestion]?.ans[0],
                                            handleRadioValueChange,
                                            symptomQuestionBank[currentQuestion].answers.split(','),
                                            radioValue,
                                            handleAnswerSelectChange,
                                            nestedValues,
                                            formError,
                                            radioError
                                        ]}
                                    />
                                    <div>
                                        <NextBackButtonComponent
                                            buttonData={[
                                                activeStep,
                                                handlePrevQuestion,
                                                handleNextQuestion,
                                                steps
                                            ]}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={5} className="layoutSize">
                                    {getTransitionInfo(currentQuestion)}
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item xs={5} className=" marginTop2">
                                    <div className="layoutSize5">
                                        <div className="marginBottom3">
                                            <Typography variant="h4" className={classes.heading}>
                                                SYMPTOMS
                                            </Typography>
                                        </div>
                                        <div className="marginBottom2">
                                            <Typography variant="h4" className={classes.subHeading}>
                                                What symptoms are you experiencing right now?
                                            </Typography>
                                        </div>
                                        <div className="marginBottom3">
                                            <Typography
                                                variant="subtitle1"
                                                className={classes.subText}
                                            >
                                                Please describe any physical discomfort or unusual
                                                sensations.
                                            </Typography>
                                        </div>
                                        <div className="marginBottom1">
                                            <CustomDropdown
                                                dropdownData={[
                                                    symptoms,
                                                    selectedSymptoms,
                                                    handleSelectChange,
                                                    nestedValues,
                                                    formError
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <NextBackButtonComponent
                                            buttonData={[
                                                activeStep,
                                                backPage,
                                                handleIsSymptomList,
                                                steps
                                            ]}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={5} className="layoutSize marginTop2">
                                    <div className="layoutSize humanBody">
                                        <HumanBodyCompenent
                                            handleSelectChange={handleSelectChange}
                                            selectedSymptomsValue={selectedSymptoms}
                                            allSymptomsList={allSymptomsList}
                                        />
                                    </div>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={1}></Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    );
}
