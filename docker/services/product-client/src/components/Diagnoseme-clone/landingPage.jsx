import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import LandingBg from 'assets/img/diagnoseme/welcomeImg.svg';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import StepperForm from './components/stepper';
import './diagnoseme.css';
import { resetDiagnosisFormData } from './store/slices/diagnosisFormDataSlice';
import { useDispatch } from 'react-redux';

export default function LandingPageClone() {
    const [startDiagnosis, setStartDiagnosis] = React.useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetDiagnosisFormData());
    }, []);

    const nextPage = () => setStartDiagnosis(true);

    return (
        <React.Fragment>
            {startDiagnosis === true ? (
                <StepperForm />
            ) : (
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className="layoutSize textCenterAlign"
                >
                    <Grid item xs={12} className="layoutSize">
                        <div
                            className="layoutSize"
                            style={{
                                // margin: '1rem',
                                backgroundImage: `url(${LandingBg})`,
                                backgroundPosition: 'right',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                className="layoutSize3 textCenterAlign"
                            >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={6}></Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="flex-start"
                                className="layoutSize2 textAlignLeft"
                            >
                                <Grid item xs={1}></Grid>
                                <Grid item xs={7}>
                                    <div className="landingHeadingLayout">
                                        <Typography variant="h3" className="landingHeadingText">
                                            Welcome to
                                        </Typography>
                                        <Typography variant="h3" className="landingHeadingText">
                                            Diagnoseme
                                        </Typography>
                                    </div>
                                    <div className="landingTextLayout marginTop5">
                                        <Typography className="landingText">
                                            Your self-care solution.
                                        </Typography>
                                        <Typography className="landingText">
                                            Take care of your health with
                                        </Typography>
                                        <Typography className="landingText">
                                            our user-friendly health-care test app,
                                        </Typography>
                                        <Typography variant="h5" className="landingText">
                                            putting wellness in your hands
                                        </Typography>
                                    </div>
                                    <div className="marginTop2">
                                        <Button size="large" variant="contained" onClick={nextPage}>
                                            Start Diagnosis
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                className="fontStyle2 textCenterAlign"
                            >
                                <Grid item xs={6}></Grid>
                                <Grid item xs={6}></Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
}
