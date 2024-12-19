import React, { useState, useEffect, useContext } from 'react';
import DynamicFormModal from '../../dynamic-form/inputFields/DynamicFormModal';
import { withRouter } from 'react-router-dom';
import { addApplication } from 'services/app_admin.js';
import CustomSnackbar from '../../CustomSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { getFunctions } from 'store/index';
import { UserInfoContext } from 'context/userInfoContent';

import * as _ from 'underscore';

const AddAppPopup = ({ classes, ...props }) => {
    const [industries, setIndustries] = useState(
        props.match.params.industry ? props.match.params.industry : []
    );
    const [functions, setFunctions] = useState(
        props.match.params.function ? props.match.params.function : []
    );
    const allFunctions = useSelector((st) => st.functionData.list);
    const industryData = useSelector((st) => st.industryData.list);
    const dispatch = useDispatch();
    const emailId = sessionStorage.getItem('user_email');
    const [snackbar, setSnackbar] = React.useState({ open: false });
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedFunction, setSelectedFunction] = useState('');
    const [functionLoadError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const user_id = useContext(UserInfoContext).user_id;
    const { isDsWorkbench, dsAppConfig } = props;

    useEffect(() => {
        if (allFunctions.length === 0) {
            dispatch(getFunctions({}));
        }
    }, []);
    useEffect(() => {
        if (functionLoadError && dialogOpen) {
            setSnackbar({
                open: true,
                severity: 'error',
                message: 'Failed to load functions List, Please Try again!'
            });
        }
    }, [dialogOpen]);

    useEffect(() => {
        var industrylist = _.unique(
            _.map(industryData, function (industry) {
                return `${industry.industry_name} - ${industry.id}`;
            })
        );
        setIndustries(industrylist);

        if (props.match.params.industry) {
            const curIndustry = _.filter(industryData, function (industry) {
                if (industry.industry_name === props.match.params.industry) {
                    return industry;
                }
            });
            setSelectedIndustry(`${curIndustry[0]?.industry_name} - ${curIndustry[0]?.id}`);
        }
    }, [industryData]);

    useEffect(() => {
        if (selectedIndustry) {
            const tempIndustry = prepareFunctionsList(allFunctions, selectedIndustry);
            setFunctions(tempIndustry);
            if (props.match.params.industry && props.match.params.function) {
                const industry_id = selectedIndustry.split(' - ')[1];
                const curFunction = _.filter(allFunctions, function (func) {
                    if (
                        func.function_name === props.match.params.function &&
                        func.industry_id === Number(industry_id)
                    ) {
                        return func;
                    }
                });
                setSelectedFunction(
                    `${curFunction[0]?.function_name} - ${curFunction[0]?.function_id}`
                );
            }
        }
    }, [selectedIndustry, allFunctions]);

    const prepareFunctionsList = (response_data, formData) => {
        return _.compact(
            _.unique(
                _.map(response_data, (item) => {
                    const industryId = formData.split(' - ').map((v) => v.trim())[1];
                    if (item.industry_id === Number(industryId)) {
                        return `${item.function_name} - ${item.function_id}`;
                    }
                })
            )
        );
    };

    const [popup_form_params, setPopupForm] = useState({
        trigger_button: {
            text: 'Add Application',
            variant: 'contained'
        },
        dialog: {
            title: 'Add Application'
        },
        dialog_actions: [
            {
                name: 'cancel',
                text: 'Cancel',
                variant: 'outlined',
                is_cancel: true,
                style: {
                    marginRight: '2.2rem'
                }
            },
            {
                name: 'add',
                text: 'Save & Edit Application',
                variant: 'contained'
            }
        ],
        notifications: {
            time: 30000
        },
        form_config: {
            fields: [
                {
                    id: 'app_name',
                    name: 'app_label',
                    type: 'label',
                    value: 'Application name',
                    asterisk: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'app_name',
                    name: 'app_name',
                    type: 'text',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    value: '',
                    placeholder: 'Enter Application Name',
                    validator: 'application_change'
                },
                {
                    id: 'project_id',
                    name: 'project_id_label',
                    type: 'label',
                    value: 'Project Id',
                    asterisk: false,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    isDsWorkbench: isDsWorkbench === true ? 'yes' : 'no',
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'project_id',
                    name: 'project_id',
                    type: 'text',
                    className: 'disabledField',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: false,
                    value:
                        dsAppConfig?.projectDetailsState?.projectId ||
                        dsAppConfig?.projectDetailsState?.projectData?.id ||
                        '',
                    placeholder: '',
                    disabled: true,
                    isDsWorkbench: isDsWorkbench === true ? 'yes' : 'no'
                },
                {
                    id: 'project_name',
                    name: 'project_name_label',
                    type: 'label',
                    value: 'Project Name',
                    asterisk: false,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    isDsWorkbench: isDsWorkbench === true ? 'yes' : 'no',
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'project_name',
                    name: 'project_name',
                    type: 'text',
                    className: 'disabledField',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: false,
                    placeholder: '',
                    disabled: true,
                    value: dsAppConfig?.projectDetailsState?.projectData?.name || '',
                    isDsWorkbench: isDsWorkbench === true ? 'yes' : 'no'
                },
                {
                    id: 'nac_collaboration',
                    name: 'nac_collaboration_label',
                    type: 'label',
                    value: 'Collaboration on App Configurator',
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'nac_collaboration',
                    name: 'nac_collaboration',
                    type: 'switch',
                    value: false,
                    size: 'small',
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    required: true,
                    grid: 9,
                    noGutterBottom: true
                },
                {
                    id: 'nav_placement',
                    name: 'nav_placement_label',
                    type: 'label',
                    value: 'Choose Navigation Placement',
                    infoPopover: {
                        title: 'Recommendation',
                        info: 'As per design best practices, use top navigation when there are not more than 6 menu items. This enhances user experience and minimizes screen clutter.',
                        icon: 'true'
                    },
                    asterisk: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    grid: 3,
                    style: {
                        padding: '0.8rem',
                        alignSelf: 'start'
                    }
                },
                {
                    id: 'nav_placement',
                    name: 'nav_placement',
                    type: 'nav_types',
                    value: null,
                    grid: 9,
                    validator: 'nav_placement_change'
                },

                {
                    id: 'import_app',
                    name: 'import_external_app_label',
                    type: 'label',
                    grid: 3,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    value: 'Import External App',
                    style: {
                        padding: '0.8rem'
                    },
                    noGutterBottom: true
                },
                {
                    id: 'file',
                    name: 'source_file',
                    type: 'upload',
                    label: 'Source file',
                    preventAutoUpload: true,
                    inputprops: {
                        accept: '.codx'
                    },
                    grid: 9,
                    variant: 'outlined',
                    fullWidth: true,
                    required: true,
                    noGutterBottom: true
                },
                {
                    id: 'Note',
                    name: 'note_label',
                    type: 'label',
                    grid: 3,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    value: 'Note',
                    style: {
                        padding: '0.8rem'
                    }
                },
                {
                    id: 'Note',
                    name: 'note_text',
                    type: 'label',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    style: {
                        padding: '0.8rem 0.8rem 0.8rem 0rem'
                    },
                    value: 'This will create an application in preview mode, which can be modified to be published and produced.'
                },
                {
                    id: '',
                    name: '',
                    type: 'blank',
                    grid: 3,
                    noGutterTop: true
                },
                {
                    id: 'Note',
                    name: 'note_text',
                    type: 'label',
                    grid: 9,
                    fullWidth: true,
                    variant: 'outlined',
                    noGutterBottom: true,
                    required: true,
                    InputLabelProps: {
                        variant: 'h5'
                    },
                    style: {
                        padding: '0.8rem 0.8rem 0.8rem 0rem',
                        marginTop: '-30px'
                    },
                    value: 'The overview details, module settings, linked blueprint and application variables (if any) will not be carried forward to the cloned application.'
                }
            ]
        }
    });

    useEffect(() => {
        setPopupForm((s) => {
            let updatedFields = [];
            s.form_config.fields.forEach((el) => {
                if (el.name === 'industry') {
                    el.options = industries;
                    el.value = selectedIndustry;
                }
                if (el.name === 'function') {
                    el.options = functions;
                    el.value = selectedFunction;
                }
                if (el.name === 'project_id' && el.value === '') {
                    el.value =
                        dsAppConfig?.projectDetailsState?.projectId ||
                        dsAppConfig?.projectDetailsState?.projectData?.id ||
                        '';
                }
                if (el.name === 'project_name' && el.value === '') {
                    el.value = dsAppConfig?.projectDetailsState?.projectData?.name || '';
                }
                if (!el.isDsWorkbench) {
                    updatedFields.push(el);
                } else if (isDsWorkbench && el.isDsWorkbench === 'yes') {
                    updatedFields.push(el);
                }
            });

            s.form_config.fields = updatedFields;
            return { ...s };
        });
    }, [industries, functions, selectedIndustry, selectedFunction, dialogOpen]);

    function ValidateEmail(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }

    const handleValueChange = async (action, data) => {
        data.contact_email = emailId;
        let valid = true;
        if (action === 'add') {
            // call add aplication api
            if (!(data.app_name.trim() && ValidateEmail(data.contact_email))) {
                return;
            }
            try {
                const response = {};
                popup_form_params.form_config.fields.map((item) => {
                    if (item['type'] && item['type'] !== 'label') {
                        if (data[item.name]) {
                            response[item.name] = data[item.name];
                        }
                        if (item.name === 'industry') {
                            const [industry, industry_id] = data[item.name]
                                .split(' - ')
                                .map((v) => v.trim());
                            response[item.name] = industry;
                            response['industry_id'] = parseInt(industry_id);
                        }
                        if (item.name === 'function') {
                            const [func, function_id] = data[item.name]
                                .split(' - ')
                                .map((v) => v.trim());
                            response[item.name] = func;
                            response['function_id'] = parseInt(function_id);
                        }
                        if (item.name == 'nav_placement') {
                            if (data[item.name] === undefined) {
                                valid = false;
                            }
                            response['top_navbar'] = data[item.name];
                        }
                        if (item.name === 'project_id') {
                            response['project_id'] = data[item.name];
                        }
                        if (item.name === 'project_name') {
                            response['project_name'] = data[item.name];
                        }
                    }
                });
                if (!valid) return;
                response['user_id'] = user_id;
                response['contact_email'] = emailId;

                //setting to miscellaneous by default according the the requirements - NCX-1501
                let industry = industryData?.filter((item) =>
                    item['industry_name']?.trim().startsWith('Miscellaneous')
                );
                let funct = allFunctions?.filter(
                    (item) =>
                        item['industry_id'] == industry?.[0]['id'] &&
                        item['function_name']?.trim().startsWith('Miscellaneous')
                );
                if (industry?.[0] && funct?.[0]) {
                    industry = industry?.[0];
                    funct = funct?.[0];
                    response['industry'] = industry['industry_name'];
                    response['industry_id'] = industry['id'];
                    response['function'] = funct['function_name'];
                    response['function_id'] = funct['function_id'];

                    if (
                        !response['industry'] ||
                        !response['industry_id'] ||
                        !response['function'] ||
                        !response['function_id'] ||
                        !emailId
                    )
                        throw new Error("couldn't load industry and function data");
                } else {
                    throw new Error("couldn't load industry and function data");
                }
                const resp = await addApplication({
                    payload: {
                        data: response
                    }
                });
                popup_form_params.error = false;
                setTimeout(() => {
                    if (props.isDsWorkbench) {
                        window.location.reload();
                    } else {
                        props.history.push(resp?.link);
                    }
                }, 2000);
                setSnackbar({ open: true, severity: 'success', message: resp.message });
                return popup_form_params;
            } catch (error) {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.response?.data?.error || 'error'
                });
            }
        }
    };

    const projectScreen = window.location.pathname.startsWith('/projects');

    return (
        <React.Fragment>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
            {!projectScreen && industryData?.length ? (
                <DynamicFormModal
                    key={'add_application_form'}
                    params={popup_form_params}
                    onAction={async (action, data) => await handleValueChange(action, data)}
                    preventDeepCloneOnStateUpdate
                    overrideClasses={{
                        triggerButton: classes.triggerNavButton
                    }}
                    setDialogOpen={setDialogOpen}
                />
            ) : null}
        </React.Fragment>
    );
};

export default withRouter(AddAppPopup);
