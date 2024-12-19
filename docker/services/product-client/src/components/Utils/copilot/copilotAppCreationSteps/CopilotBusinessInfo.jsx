import { Grid, InputLabel, MenuItem, Select, TextField, makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import React from 'react';
import copilotConfiguratorStyle from '../styles/copilotConfiguratorStyle';
import { requiredField } from '../util';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    formContainer: {
        maxWidth: theme.layoutSpacing(852),
        rowGap: theme.layoutSpacing(52)
    },
    formMetaData: {
        display: 'flex',
        width: '100%',
        padding: theme.layoutSpacing(8.2944),
        columnGap: theme.layoutSpacing(52)
    },
    formSelect: {
        '& .MuiSelect-root': {
            opacity: `var(--opacity, 1)`
        }
    }
}));
export default function CopilotBusinessInfo({ onChange, appData, industryList }) {
    const classes = useStyles();
    const configClasses = copilotConfiguratorStyle();

    const handleConfigChange = (value, key) => {
        const data = {
            ...appData,
            config: {
                ...appData.config,
                [key]: value
            }
        };
        onChange(data);
    };
    const handleChange = (value, key) => {
        const data = {
            ...appData,
            [key]: value
        };
        onChange(data);
    };
    const name = appData?.name;
    const industry = appData?.['config']?.industry;
    const org_name = appData?.['config']?.org_name;
    const business_context = appData?.desc;
    return (
        <div className={classes.root}>
            <form>
                <Grid container spacing={2} className={classes.formContainer}>
                    <Grid item xs={12}>
                        <InputLabel id="copilot-name" className={configClasses.inputLabel}>
                            Name Your Assistant{requiredField}
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            size="small"
                            fullWidth
                            value={name}
                            variant="outlined"
                            onChange={(e) => handleChange(e.target.value, 'name')}
                            required
                            placeholder="Enter Ask NucliOS Application name"
                        />
                    </Grid>
                    <div className={classes.formMetaData}>
                        <Grid item xs={6}>
                            <InputLabel id="industry" className={configClasses.inputLabel}>
                                Industry
                            </InputLabel>
                            <FormControl
                                size="small"
                                variant="outlined"
                                className={configClasses.formControl}
                                fullWidth
                            >
                                <Select
                                    size="small"
                                    labelId="industry"
                                    value={industry}
                                    onChange={(e) => handleConfigChange(e.target.value, 'industry')}
                                    fullWidth
                                    MenuProps={{
                                        MenuListProps: {
                                            classes: {
                                                // root: classes.formMenuListItem
                                                root: configClasses.inputDropdownSelect
                                            }
                                        }
                                    }}
                                    required
                                    displayEmpty={true}
                                    renderValue={(value) =>
                                        value !== '' ? value : 'Select Industry'
                                    }
                                    className={classes.formSelect}
                                >
                                    {industryList?.map((industry) => (
                                        <MenuItem
                                            value={industry.industry_name}
                                            key={industry.industry_name}
                                        >
                                            {industry.industry_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel id="company-name" className={configClasses.inputLabel}>
                                Company Name
                            </InputLabel>
                            <TextField
                                classes={{ root: configClasses.formControl }}
                                size="small"
                                fullWidth
                                value={org_name}
                                variant="outlined"
                                onChange={(e) => handleConfigChange(e.target.value, 'org_name')}
                                required
                                placeholder="Enter Company Name"
                            />
                        </Grid>
                    </div>

                    <Grid item xs={12}>
                        <InputLabel id="business-desc" className={configClasses.inputLabel}>
                            Business Description
                        </InputLabel>
                        <TextField
                            classes={{ root: configClasses.formControl }}
                            size="small"
                            multiline={4}
                            minRows={4}
                            fullWidth
                            value={business_context}
                            variant="outlined"
                            onChange={(e) => handleChange(e.target.value, 'desc')}
                            placeholder="Enter Your Business Description"
                        />
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
