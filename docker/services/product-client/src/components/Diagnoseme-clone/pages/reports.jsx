import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { postComment } from '../services/services';
import '../diagnoseme.css';
import { makeStyles } from '@material-ui/core/styles';
import medical_department2 from 'assets/img/medical_department2.png';
import medical_department3 from 'assets/img/medical_department3.png';
import medicine4 from 'assets/img/medicine4.png';
import { ReactComponent as Calender } from 'assets/img/connCalender.svg';
import RightFullScreenPopup from './reportPopup';
import { ReactComponent as LabTest } from 'assets/img/lab-test.svg';
import Divider from '@material-ui/core/Divider';
import CustomSnackbar from '../../CustomSnackbar';

const useStyles = makeStyles((theme) => ({
    headingLayout: {
        width: '517px',
        height: '28px',
        top: '404px',
        left: '430px'
    },
    heading: {
        fontSize: '3.25rem',
        fontWeight: '500',
        lineHeight: '28px',
        letterSpacing: '1px',
        textAlign: 'left',
        textTransform: 'CAPITALIZE',
        color: theme.palette.text.headingText
    },
    btnWrapper: {
        borderRadius: '3px',
        border: '1px solid #1373E5',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        height: '4rem',
        cursor: 'pointer'
    },
    textLabel: {
        color: '#1373E5',
        fontSize: '1.75rem',
        fontWeight: '400',
        letterSpacing: 0.1,
        wordWrap: 'break-word',
        display: 'inline-block',
        paddingLeft: '5px'
    },
    tagDiv: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '1.5em',
        paddingBottom: '0px'
    },
    tagStyle: {
        width: 'auto',
        height: '31px',
        flexShrink: 0,
        borderRadius: '34px',
        background: '#efefef',
        alignItems: 'center',
        padding: '5px 20px 5px 20px',
        display: 'flex'
    },
    tagFonts: {
        fontSize: '1.5rem'
    },
    leftHeading: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '15px'
    },
    subHeading: {
        fontSize: '3rem',
        fontWeight: '400',
        lineHeight: '28px',
        letterSpacing: '0px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    infoText: {
        fontSize: '2rem',
        fontWeight: '400',
        lineHeight: '21px',
        letterSpacing: '0em',
        textAlign: 'left'
    },
    infoListText: {
        fontSize: '2rem',
        fontWeight: '400',
        lineHeight: '2.5rem',
        letterSpacing: '0.09599373489618301px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    infoList: {
        fontSize: '1.75rem',
        fontWeight: '400',
        fontStyle: 'normal',
        letterSpacing: '0.0.1px',
        textAlign: 'left'
    },
    reportLayout: {
        height: '4rem',
        width: '100%'
    },
    reportText: {
        fontSize: '1.5rem',
        fontWeight: '500',
        lineHeight: '18px',
        letterSpacing: '1px'
    },
    cardWrapper: {},
    cardContent: {
        display: 'flex',
        padding: '1rem',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: '20vh',
        marginBottom: '0px !important',
        paddingBottom: '15px !important'
    },
    marginRight3: {
        marginRight: '2rem'
    },
    dangerText: {
        color: '#CD6A4B'
    },
    normalText: {
        color: '#1C8C00'
    },
    iconColor: {
        fill: '#1373E5'
    },
    moreInfo: {
        display: 'flex',
        alignItems: 'end'
    },
    textArea: {
        width: '97%',
        height: '60px',
        borderRadius: '12px',
        border: 'solid 1px #FCCECE',
        fontSize: '16px'
    }
}));

export default function Reports(props) {
    const classes = useStyles();
    const { step1, step2 } = useSelector((state) => state.diagnosisFormData || []);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState(false);
    const [notification, setNotification] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        if (props.dataValues.message) {
            setMessage(true);
        }
    }, [props.dataValues]);

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    const mapObj = [
        { id: 1, text: 'Blood Test' },
        { id: 2, text: 'Haemogram' },
        { id: 3, text: 'bright light' },
        { id: 4, text: 'Fasting Test' },
        { id: 5, text: 'CT Scan or MRI' },
        { id: 6, text: 'Endoscopic Ultrasound' }
    ];

    const handleComment = (value) => {
        const requestValues = {
            results_tag: value,
            feedback: comment
        };

        postComment(requestValues)
            .then((data) => {
                if (data.status !== 200) {
                    setNotification({
                        message: data.message,
                        severity: 'error'
                    });
                } else {
                    setNotification({
                        message: 'Comment added successfully',
                        severity: 'success'
                    });
                }
                setNotificationOpen(true);
            })
            .catch(() => {
                setNotification({
                    message: 'Error posting comment',
                    severity: 'error'
                });
                setNotificationOpen(true);
            });
    };

    return (
        <React.Fragment>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                className="layoutSize textCenterAlign"
            >
                <Grid item xs={12} className="layoutSize2">
                    <div className={classes.reportLayout}>
                        <div className="marginTop4">
                            <Typography className={classes.reportText}>FINAL REPORT</Typography>
                        </div>
                    </div>
                </Grid>
                <Divider className="siderbar-divider" style={{ top: '4%' }} />
                <Grid item xs={12} className="layoutSize8">
                    <div className="layoutSize">
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="flex-start"
                            className="layoutSize2 textAlignLeft"
                        >
                            <Grid item xs={6} style={{ padding: '5rem' }}>
                                <div marginBottom2>
                                    <Typography className={classes.heading} variant="h3">
                                        {step1.name}, {step1.gender}, {step1.age}
                                    </Typography>
                                    <div className="divStyle1 marginTop7">
                                        <div>
                                            <Typography className={classes.infoListText}>
                                                Symptoms:
                                            </Typography>
                                        </div>
                                        {step2.symptoms.map((elem) => {
                                            return (
                                                <div className="" key={elem}>
                                                    {' '}
                                                    <Typography className={classes.infoList}>
                                                        {elem}
                                                        {','}
                                                    </Typography>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="marginBottom1 marginTop3">
                                    <Typography className={classes.infoText}>
                                        Thank you for answering all the questions. Based on the
                                        information you have provided, these are the most likely and
                                        less likely diagnosis.
                                    </Typography>
                                    {message === true ? (
                                        <div className="marginTop1">
                                            <Typography className={classes.infoListText}>
                                                Note:
                                            </Typography>
                                            <div className="marginTop3">
                                                <Typography className={classes.note}>
                                                    Either not enough information is provided or the
                                                    disease is currently out of scope.
                                                </Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="marginTop2">
                                                <Typography className={classes.infoListText}>
                                                    Most Likely:
                                                </Typography>
                                            </div>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="center"
                                                alignItems="flex-start"
                                                className="marginTop3"
                                            >
                                                {props.dataValues.predictions.map((elem) => {
                                                    return (
                                                        <Grid item xs={4} key={elem}>
                                                            <Card className="cardLayout leftHeading">
                                                                <CardContent
                                                                    className={classes.cardContent}
                                                                >
                                                                    <div
                                                                        className={
                                                                            classes.cardHeading
                                                                        }
                                                                    >
                                                                        <Typography
                                                                            className={
                                                                                classes.infoList
                                                                            }
                                                                        >
                                                                            {elem[0]}
                                                                        </Typography>
                                                                        <span
                                                                            className={
                                                                                classes.dangerText
                                                                            }
                                                                        >
                                                                            <Typography
                                                                                className={
                                                                                    classes.boxSubHeading
                                                                                }
                                                                            >
                                                                                Seek Medical Advice
                                                                            </Typography>
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <Typography
                                                                            variant="h3"
                                                                            className="marginTop7"
                                                                        >
                                                                            {Intl.NumberFormat(
                                                                                'default',
                                                                                {
                                                                                    style: 'percent',
                                                                                    minimumFractionDigits: 2,
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            ).format(elem[1])}
                                                                        </Typography>
                                                                    </div>
                                                                    <div
                                                                        className={classes.moreInfo}
                                                                    >
                                                                        <button
                                                                            className={
                                                                                classes.btnWrapper
                                                                            }
                                                                            onClick={togglePopup}
                                                                        >
                                                                            {isPopupVisible && (
                                                                                <RightFullScreenPopup
                                                                                    onClose={
                                                                                        togglePopup
                                                                                    }
                                                                                />
                                                                            )}
                                                                            <Typography
                                                                                className={
                                                                                    classes.textLabel
                                                                                }
                                                                            >
                                                                                More Info
                                                                            </Typography>
                                                                        </button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                            <div className="marginTop4">
                                                <textarea
                                                    className={classes.textArea}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div
                                                className={classes.moreInfo}
                                                style={{
                                                    justifyContent: 'space-evenly',
                                                    marginTop: '1rem'
                                                }}
                                            >
                                                <button
                                                    className={classes.btnWrapper}
                                                    onClick={() => handleComment('Correct')}
                                                >
                                                    <Typography className={classes.textLabel}>
                                                        Correct
                                                    </Typography>
                                                </button>
                                                <button
                                                    className={classes.btnWrapper}
                                                    onClick={() => handleComment('Incorrect')}
                                                >
                                                    <Typography className={classes.textLabel}>
                                                        Incorrect
                                                    </Typography>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Grid>
                            <Grid item xs={6} style={{ padding: '3.5rem' }}>
                                <div className={classes.leftHeading}>
                                    <Typography className={classes.infoListText}>
                                        Recommended Lab Tests:
                                    </Typography>
                                </div>
                                <div className={classes.tagDiv}>
                                    {mapObj.map((item) => (
                                        <span className={classes.tagStyle} key={item.id}>
                                            <Typography className={classes.tagFonts}>
                                                {item.text}
                                            </Typography>
                                        </span>
                                    ))}
                                </div>
                                <div className="marginTop3">
                                    <button className={classes.btnWrapper}>
                                        <LabTest />
                                        <Typography className={classes.textLabel}>
                                            Schedule Lab Test
                                        </Typography>
                                    </button>
                                </div>
                                <div className="marginTop3 ">
                                    <div className={classes.leftHeading}>
                                        <Typography className={classes.infoListText}>
                                            Recommended Consultation:
                                        </Typography>
                                        <Typography className={classes.infoList}>
                                            General Practitioner - In Person Visit
                                        </Typography>
                                    </div>

                                    <div className="marginTop3">
                                        <button className={classes.btnWrapper}>
                                            <Calender />
                                            <Typography className={classes.textLabel}>
                                                Schedule Appointment
                                            </Typography>
                                        </button>
                                    </div>

                                    <div className="marginTop3">
                                        <div className={classes.leftHeading}>
                                            <Typography className={classes.infoListText}>
                                                Recommended Medication:
                                            </Typography>
                                        </div>
                                        <div className="marginTop3">
                                            <img src={medical_department2}></img>
                                            <img src={medical_department3}></img>
                                            <img src={medicine4}></img>
                                        </div>
                                    </div>
                                </div>
                                <div className="marginTop3">
                                    <Typography className={classes.subHeading}>
                                        Conclusion
                                    </Typography>
                                    <div className="leftHeading marginTop7">
                                        <Typography className={classes.infoListText}>
                                            People with symptoms similar to yours do not usually
                                            require urgent medical care. You should seek advice from
                                            a doctor though, within the next 2-3 days. If your
                                            symptoms get worse, or if you notice new symptoms, you
                                            may need to consult a doctor sooner.
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <CustomSnackbar
                    open={notificationOpen}
                    autoHideDuration={2000}
                    onClose={() => setNotificationOpen(false)}
                    severity={notification?.severity}
                    message={notification?.message}
                />
            </Grid>
        </React.Fragment>
    );
}
