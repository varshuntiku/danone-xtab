import { Typography } from '@material-ui/core';
import React from 'react';
import '../popupStyle.css'; // Import your CSS file
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import medical_department1 from 'assets/img/medical_department1.png';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as Calender } from 'assets/img/connCalender.svg';
import { ReactComponent as Stethoscope } from 'assets/img/stethoscope.svg';
import { ReactComponent as LabTest } from 'assets/img/lab-test.svg';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: '3rem',
        fontWeight: '500',
        lineHeight: '28px',
        letterSpacing: '1px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    subHeading: {
        color: '#F47373',
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 'normal'
    },
    btnWrapper: {
        borderRadius: '3px',
        border: '1px solid #1373E5',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        height: '4rem'
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
        gap: '5px',
        marginTop: '1rem'
    },
    tagFonts: {
        color: ' #001327',
        fontSize: '1.5rem',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
        alignItems: 'center',
        display: 'flex'
    },
    tagStyle: {
        width: 'auto',
        height: '31px',
        flexShrink: 0,
        borderRadius: '34px',
        background: '#efefef',
        padding: '5px 20px 5px 20px',
        display: 'flex'
    },
    leftHeading: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left'
    },
    infoListText: {
        fontSize: '2rem',
        fontWeight: '400',
        lineHeight: '21px',
        letterSpacing: '0.09599373489618301px',
        textAlign: 'left',
        color: theme.palette.text.headingText
    },
    btnGroup: {
        display: 'flex',
        gap: '30px',
        marginTop: '7rem'
    },
    infoList: {
        fontSize: '1.5rem'
    },
    btnText: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '1rem'
    }
}));

const RightFullScreenPopup = ({ onClose }) => {
    const mapObj = [
        { id: 1, text: 'Blood Glucose test' },
        { id: 2, text: 'Fasting Test' },
        { id: 3, text: 'C-Peptide Test' },
        { id: 4, text: 'Proinsulin Levels' },
        { id: 5, text: 'CT Scan or MRI' },
        { id: 6, text: 'Endoscopic Ultrasound' },
        { id: 6, text: 'Insulin Antibody test' },
        { id: 6, text: 'Positron Emission Tomography' },
        { id: 6, text: 'Selective Arterial Calcium Stimulation Test (SACST)' }
    ];
    const classes = useStyles();

    return (
        <div className="popup-container">
            <div className="popup-content">
                <IconButton aria-label="close" className="close-button" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <React.Fragment>
                    <Grid item xs={12} container direction="row" className={classes.leftHeading}>
                        {/* <div className=''> */}
                        <div className="">
                            <Typography className={classes.heading}>Insulinoma</Typography>
                        </div>
                        <div>
                            <Typography className={classes.subHeading}>
                                Seek Medical Help
                            </Typography>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Typography className={classes.infoList}>
                                Insulinoma is a rare pancreatic tumor that overproduces insulin,
                                leading to low blood sugar levels (hypoglycemia). Symptoms include
                                dizziness, confusion, and weakness. Treatment involves surgical
                                removal of the tumor, along with potential medication and dietary
                                adjustments. Regular monitoring is crucial for managing this
                                condition effectively.
                            </Typography>
                        </div>
                        <div className={classes.leftHeading}>
                            <Typography className={classes.infoListText}>Department</Typography>
                        </div>
                        <div className="marginTop7">
                            <img src={medical_department1} />
                        </div>
                        <div className={classes.leftHeading}>
                            <Typography className={classes.infoListText}>
                                Supporting Symptoms
                            </Typography>
                        </div>
                        <div className="marginTop7">
                            <Typography className={classes.infoList}>
                                Headache, Blurry vision, Runny None
                            </Typography>
                        </div>
                        <div className={classes.leftHeading}>
                            <Typography className={classes.infoListText}>
                                Recommended Lab Tests for Insulinoma
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
                        <div className={classes.leftHeading}>
                            <Typography className={classes.infoListText}>
                                Recommended Consultation:
                            </Typography>
                        </div>
                        <div className={classes.btnText}>
                            <Stethoscope />{' '}
                            <Typography className={`${classes.subHeading} && marginTop7`}>
                                Dr. Laura Miller, MD (Doctor of Medicine)
                            </Typography>
                        </div>
                        <div className={classes.btnText}>
                            <Stethoscope />{' '}
                            <Typography className={`${classes.subHeading} && marginTop7`}>
                                Dr. Laura Miller, MD (Doctor of Medicine)
                            </Typography>
                        </div>
                        <div className={classes.btnGroup}>
                            <button className={classes.btnWrapper}>
                                <LabTest />
                                <Typography className={classes.textLabel}>
                                    Schedule Lab test
                                </Typography>
                            </button>
                            <button className={classes.btnWrapper}>
                                <Calender className={classes.iconColor} />
                                <Typography className={classes.textLabel}>
                                    Schedule Appointment
                                </Typography>
                            </button>
                        </div>
                    </Grid>
                </React.Fragment>
            </div>
        </div>
    );
};

export default RightFullScreenPopup;
