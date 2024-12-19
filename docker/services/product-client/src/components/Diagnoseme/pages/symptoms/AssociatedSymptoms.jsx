import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import '../../diagnoseme.css';
import CustomDropdown from '../../components/forms/CustomDropdown';
import CustomRadioButtons from '../../components/forms/CustomRadioButtons';

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

export default function AssociatedSymptoms({ associatedSymptData }) {
    const [
        symptQuest,
        questType,
        radioKey,
        radioValue,
        handleRadioValueChange,
        valuesList,
        selectedValues,
        handleSelectChange,
        nestedValues,
        formError,
        radioError
    ] = associatedSymptData;
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className="layoutSize5">
                <div className="marginBottom3">
                    <Typography variant="h4" className="static-text">
                        Thank you for confirming. Let&apos;s continue:
                    </Typography>
                </div>
                <div className="marginBottom3">
                    <Typography variant="h4" className={classes.heading}>
                        ASSOCIATED SYMPTOMS
                    </Typography>
                </div>
                <div className="marginBottom2">
                    <Typography variant="h4" className={classes.subHeading}>
                        {symptQuest}
                    </Typography>
                </div>
                <div className="marginBottom3">
                    <Typography variant="subtitle1" className={classes.subText}>
                        Please describe any physical discomfort or unusual sensations.
                    </Typography>
                </div>
                {questType === 'radio' ? (
                    <div className="marginTop5">
                        <CustomRadioButtons
                            radioButtonData={[
                                radioKey,
                                radioValue,
                                handleRadioValueChange,
                                radioError
                            ]}
                        />
                    </div>
                ) : (
                    <div>
                        {questType === 'dropdown' ? (
                            <div className="marginBottom1 marginTop5">
                                <CustomDropdown
                                    dropdownData={[
                                        valuesList,
                                        selectedValues,
                                        handleSelectChange,
                                        nestedValues,
                                        formError
                                    ]}
                                />
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
                {/* <Typography variant="h4" className={classes.linkTest}>
                    Why I am being asked this?
                </Typography> */}
            </div>
        </React.Fragment>
    );
}
