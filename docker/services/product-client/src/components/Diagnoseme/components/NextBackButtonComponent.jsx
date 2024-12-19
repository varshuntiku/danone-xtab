import Button from '@material-ui/core/Button';

const NextBackButtonComponent = ({ buttonData }) => {
    const [activeStep, handleBack, handleNext, steps] = buttonData;
    return (
        <div>
            <Button
                disabled={activeStep === 0}
                size="large"
                variant="contained"
                onClick={handleBack}
                className="marginRight"
            >
                Back
            </Button>
            <Button size="large" variant="contained" onClick={handleNext}>
                {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
            </Button>
        </div>
    );
};

export default NextBackButtonComponent;
