import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import minervaWizardStyle from './minervaWizardStyle.jsx';

import clsx from 'clsx';

export default function MinervaStepperAppOverview({
    appData,
    appActions,
    createNewAppFlag,
    ...props
}) {
    const classes = minervaWizardStyle();
    const [appDataObj, setAppDataObj] = useState(appData);
    const [fieldErrors, setFieldErrors] = useState({
        name: createNewAppFlag ? true : false
    });

    useEffect(() => {
        setAppDataObj({ ...appData });
    }, [appData]);

    let onHandleFieldChange = (id, value) => {
        let temp = { ...appDataObj };
        temp[id] = value;
        setAppDataObj(temp);
        if (id === 'name') {
            if (!value || value.trim() === '') {
                setFieldErrors((prevState) => ({
                    ...prevState,
                    name: true
                }));
            } else {
                setFieldErrors((prevState) => ({
                    ...prevState,
                    name: false
                }));
            }
        }
    };

    const handleNextClick = () => {
        if (createNewAppFlag) {
            appActions.createApp({
                name: appDataObj.name,
                description: appDataObj.description || ''
            });
        } else if (
            appData.name !== appDataObj.name ||
            appData.description !== appDataObj.description
        ) {
            appActions.updateApp(appDataObj);
        }
        props.handleNext();
    };

    return (
        <React.Fragment>
            <div className={classes.stepperFormContainer}>
                <Grid
                    key="form-body"
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <Grid item xs={8}>
                        <Typography
                            variant="h6"
                            className={clsx(
                                classes.colorDefault,
                                classes.fontSize1,
                                classes.letterSpacing1
                            )}
                        >
                            Application Name
                        </Typography>
                        <TextField
                            key="name"
                            onChange={(e) => {
                                onHandleFieldChange('name', e.target.value);
                            }}
                            value={appDataObj.name ? appDataObj.name : ''}
                            fullWidth={true}
                            required={true}
                            error={fieldErrors.name}
                            helperText={fieldErrors.name ? 'Invalid Application name' : ''}
                            classes={{ root: classes.inputRoot }}
                            InputLabelProps={{ classes: { root: classes.inputLabel } }}
                            InputProps={{ classes: { input: classes.input } }}
                            id="minerva stepper"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography
                            variant="h6"
                            className={clsx(
                                classes.colorDefault,
                                classes.fontSize1,
                                classes.letterSpacing1
                            )}
                        >
                            Application Description
                        </Typography>
                        <TextField
                            key="description"
                            onChange={(e) => {
                                onHandleFieldChange('description', e.target.value);
                            }}
                            value={appDataObj.description ? appDataObj.description : ''}
                            fullWidth
                            classes={{ root: classes.inputRoot }}
                            InputLabelProps={{ classes: { root: classes.inputLabel } }}
                            InputProps={{
                                classes: { input: classes.input },
                                multiline: true,
                                rows: 3
                            }}
                            id="description"
                        />
                    </Grid>
                </Grid>
            </div>
            <div
                aria-label="sub section header"
                style={{
                    display: 'flex',
                    padding: '2rem 6rem 2rem 2rem',
                    justifyContent: 'flex-end',
                    position: 'relative'
                }}
            >
                <Button
                    key="next"
                    variant="contained"
                    size="small"
                    className={classes.button}
                    disabled={fieldErrors.name}
                    onClick={handleNextClick}
                    aria-label="Next"
                >
                    Next
                </Button>
            </div>
        </React.Fragment>
    );
}
