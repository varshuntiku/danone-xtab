import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { getHistoryQuestionsList, getPredictionResult } from '../services/services';
import '../diagnoseme.css';
import { makeStyles } from '@material-ui/core/styles';
import NextBackButtonComponent from '../components/NextBackButtonComponent';
import ImagesLayout from '../components/imagesLayout/ImagesLayout';
import CustomDropdown from '../components/forms/CustomDropdown';
import CustomSnackbar from '../../.././components/CustomSnackbar';
import ImageTransitions from '../components/imagesLayout/ImageTransitions';
import Lifestyle1 from 'assets/img/diagnoseme/TransitionImages/Lifestyle1.svg';
import Lifestyle2 from 'assets/img/diagnoseme/TransitionImages/Lifestyle2.svg';
import Lifestyle3 from 'assets/img/diagnoseme/TransitionImages/Lifestyle3.svg';
import MedicalHistory2 from 'assets/img/diagnoseme/TransitionImages/MedicalHistory2.svg';
import MedicalHistory1 from 'assets/img/diagnoseme/TransitionImages/MedicalHistory1.svg';

const useStyles = makeStyles((theme) => ({
    headingLayout: {
        width: '517px',
        height: '28px',
        top: '404px',
        left: '430px'
    },
    heading: {
        fontSize: '24px',
        fontWeight: '500',
        lineHeight: '28px',
        letterSpacing: '1px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    subHeading: {
        fontSize: '24px',
        fontWeight: '400',
        lineHeight: '28px',
        letterSpacing: '0px',
        textAlign: 'left'
    },
    subText: {
        fontSize: '16px',
        fontStyle: 'italic',
        fontWeight: '300',
        lineHeight: '19px',
        letterSpacing: '0.3405405580997467px',
        textAlign: 'left'
    }
}));

export default function MedicalHistory(props) {
    const classes = useStyles();
    const { activeStep, /*handleNextStep, handleBackStep,*/ handleChange, steps } = props;
    const { step1, step2 } = useSelector((state) => state.diagnosisFormData || []);
    const [currentHistory, setCurrentHistory] = useState(0);
    const [historyQuestionBank, setHistoryQuestionBank] = useState([]);
    const [selectedHistoryQuestions, setSelectedHistoryQuestions] = useState([]);
    const currentQuestion = 0;
    const [medicalData, setMedicalData] = useState([]);
    const [familyData, setFamilyData] = useState([]);
    const [personalData, setPersonalData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(0);
    const categories = ['Social History', 'Occupation', 'Living arrangement and Marital Status'];
    const historyTypes = ['medical', 'family', 'personal'];
    const nestedValues = true;
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const isTrans = true;
    let transType = '';
    let imgStyle = '';

    useEffect(() => {
        getHistoryQuestions();
    }, []);

    useEffect(() => {
        const currentType = historyTypes[currentHistory];
        if (currentType === 'personal') {
            if (currentCategory + 1 < categories.length) {
                setCurrentCategory(currentCategory + 1);
                setSelectedHistoryQuestions([]);
            } else {
                nextPage();
            }
        }
    }, [personalData]);

    const getHistoryQuestions = async () => {
        const historyQuestions = await getHistoryQuestionsList();
        if (historyQuestions.status === 'error') {
            setNotificationOpen(true);
            setNotification({
                message: historyQuestions.message,
                severity: 'error'
            });
        }
        setHistoryQuestionBank(historyQuestions);
    };

    const getPrediction = (requestValues) => {
        getPredictionResult(requestValues).then((re) => {
            if (re.status === 'error') {
                setNotificationOpen(true);
                setNotification({
                    message: re.message,
                    severity: 'error'
                });
            } else {
                props.getData(re);
                props.handleNextStep();
            }
        });
    };

    const handleNextHistoryType = () => {
        const currentType = historyTypes[currentHistory];
        const updatedData = selectedHistoryQuestions.map((element) => ({
            quest: element.question,
            ans: ['yes']
        }));

        if (currentType === 'medical') {
            setMedicalData([...medicalData, ...updatedData]);
        } else if (currentType === 'family') {
            setFamilyData([...familyData, ...updatedData]);
        } else {
            setPersonalData((prev) => [...prev, ...updatedData]);
        }

        if (currentHistory + 1 < historyTypes.length) {
            setCurrentHistory(currentHistory + 1);
            setSelectedHistoryQuestions([]);
        }
    };

    const handlePrevHistoryType = () => {
        if (currentQuestion > 0) {
            setCurrentHistory(currentHistory - 1);
        } else {
            props.handleBackStep();
        }
    };

    const nextPage = () => {
        let finalData = {
            Name: step1.name,
            Age: step1.age,
            Gender: step1.gender,
            Symptoms: step2.symptoms,
            symptom_details: step2.symptom_details,
            medical_history: medicalData,
            fam_medical_history: familyData,
            personal_history: personalData
        };
        handleChange('step3', 'medical_history', medicalData);
        handleChange('step3', 'fam_medical_history', familyData);
        handleChange('step3', 'personal_history', personalData);
        getPrediction(finalData);
    };

    const handleSelectChange = (event, value) => {
        setSelectedHistoryQuestions(value);
        if (historyTypes[currentHistory] === 'medical') {
            handleChange('step3', 'medical_history', value);
        }
        if (historyTypes[currentHistory] === 'family') {
            handleChange('step3', 'fam_medical_history', value);
        }
        if (historyTypes[currentHistory] === 'personal') {
            handleChange('step3', 'personal_history', value);
        }
    };

    let historyQuestions = [];
    let history = '';
    let subTitle = '';

    if (historyTypes[currentHistory] === 'medical') {
        history = 'PAST MEDICAL HISTORY';
        subTitle =
            'Please provide the significant past diseases, surgery, including complications, trauma.';
        historyQuestions = historyQuestionBank.medical;
    } else if (historyTypes[currentHistory] === 'family') {
        history = 'FAMILY HISTORY';
        subTitle = 'Please select the list of diseases present in parents, siblings or children.';
        historyQuestions = historyQuestionBank.family_medical;
    } else {
        history = 'PERSONAL HISTORY';
        if (categories[currentCategory] === 'Social History') {
            historyQuestions = historyQuestionBank.personal.filter(
                (i) => i.category === 'Social History'
            );
            subTitle = historyQuestions[0].subtext;
        } else if (categories[currentCategory] === 'Occupation') {
            historyQuestions = historyQuestionBank.personal.filter(
                (i) => i.category === 'Occupation'
            );
            subTitle = historyQuestions[0].subtext;
        } else {
            historyQuestions = historyQuestionBank.personal.filter(
                (i) => i.category === 'Living arrangement and Marital Status'
            );
            subTitle = historyQuestions[0].subtext;
        }
    }

    const getTransitionInfo = (info) => {
        switch (info) {
            case 'medical':
                transType = 'right-slide';
                imgStyle = 'image3';
                return (
                    <div>
                        <ImageTransitions
                            imgData={[MedicalHistory1, isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 'family':
                transType = 'left-slide';
                imgStyle = 'image3';
                return (
                    <div>
                        <ImagesLayout imgData={[MedicalHistory1, imgStyle]} />
                        <ImageTransitions
                            imgData={[MedicalHistory2, isTrans, transType, imgStyle]}
                        />
                    </div>
                );
            case 'Social History':
                transType = 'right-slide';
                imgStyle = 'image3';
                return (
                    <div>
                        <ImageTransitions imgData={[Lifestyle2, isTrans, transType, imgStyle]} />
                    </div>
                );
            case 'Occupation':
                transType = 'left-slide';
                imgStyle = 'image3';
                return (
                    <div>
                        <ImagesLayout imgData={[Lifestyle2, imgStyle]} />
                        <ImageTransitions imgData={[Lifestyle1, isTrans, transType, imgStyle]} />
                    </div>
                );
            case 'Living arrangement and Marital Status':
                transType = 'right-slide';
                imgStyle = 'image3';
                return (
                    <div>
                        <ImagesLayout imgData={[Lifestyle2, imgStyle]} />
                        <ImagesLayout imgData={[Lifestyle1, imgStyle]} />
                        <ImageTransitions imgData={[Lifestyle3, isTrans, transType, imgStyle]} />
                    </div>
                );
            default:
                return 'Unknown step';
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
                    {historyQuestionBank.medical ? (
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            className="layoutSize2 textAlignLeft"
                        >
                            <Grid item xs={1}></Grid>
                            <Grid item xs={5} className="layoutSize marginTop2">
                                <div className="layoutSize5">
                                    <div className="marginBottom3">
                                        <Typography className="static-text">
                                            Thank you for confirming. Let&apos;s continue:
                                        </Typography>
                                    </div>
                                    <div className="marginBottom3">
                                        <Typography className={classes.heading}>
                                            {history}
                                        </Typography>
                                    </div>

                                    <div className="marginBottom3">
                                        <Typography variant="subtitle1" className={classes.subText}>
                                            {subTitle}
                                        </Typography>
                                    </div>
                                    <div className="marginBottom1">
                                        <CustomDropdown
                                            dropdownData={[
                                                historyQuestions,
                                                selectedHistoryQuestions,
                                                handleSelectChange,
                                                nestedValues
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NextBackButtonComponent
                                        buttonData={[
                                            activeStep,
                                            handlePrevHistoryType,
                                            handleNextHistoryType,
                                            steps
                                        ]}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={5} className="layoutSize">
                                {historyTypes[currentHistory] === 'personal' ? (
                                    <span>{getTransitionInfo(categories[currentCategory])}</span>
                                ) : (
                                    <span>{getTransitionInfo(historyTypes[currentHistory])}</span>
                                )}
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    ) : (
                        <div> Loading...</div>
                    )}
                </div>
                <CustomSnackbar
                    open={notificationOpen}
                    autoHideDuration={2000}
                    onClose={() => setNotificationOpen(false)}
                    severity={notification?.severity}
                    message={notification?.message}
                />
            </Grid>
        </Grid>
    );
}
