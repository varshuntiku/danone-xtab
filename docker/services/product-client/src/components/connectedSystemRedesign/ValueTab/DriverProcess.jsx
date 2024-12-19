import React, { useState } from 'react';
import {
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as SelectDriverImage } from 'assets/img/SelectDriver.svg';
import { UnfoldMore, Close, Info } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';
import ProcessDecisionFlow from './ProcessDecisionFlow';
import CheckIcon from '@material-ui/icons/Check';
// import ConnSystemsContext from '../ConnectedSystemsContext';
import CodxCircularLoader from 'components/CodxCircularLoader.jsx';
import Skeleton from '@material-ui/lab/Skeleton';
import CustomTextField from 'components/Forms/CustomTextField.jsx';
import {
    getBusinessProcessData,
    getBusinessProcessTemplatesByDriver,
    createBusinessProcessFromTemplate
} from 'services/connectedSystem_v2';

import * as _ from 'underscore';

const useStyles = makeStyles((theme) => ({
    initialData: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    textHeading: {
        fontSize: theme.title.h1.fontSize
    },
    driverProcessList: {
        paddingTop: theme.spacing(10),
        height: '100%'
    },
    driverProcessesContainer: {
        position: 'absolute',
        height: 'calc(100% - ' + theme.spacing(10) + ')',
        overflowY: 'auto'
    },
    driverProcessAddContainer: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(5),
        minWidth: theme.spacing(20)
    },
    dialog: {
        '& .MuiDialog-paperFullWidth': {
            width: '80%',
            height: '80%'
        }
    },
    dialogContainer: {
        height: theme.layoutSpacing(1000),
        border: 'none'
    },
    dialogClose: {
        position: 'absolute',
        top: '1%',
        right: 0
    },
    driverProcessAddFormContainer: {
        margin: theme.spacing(2)
    },
    processSection: {
        // minWidth: theme.layoutSpacing(400),
        minHeight: theme.layoutSpacing(400),
        backgroundColor: theme.ConnectedSystemDashboard.processCardBackground,
        position: 'relative',
        cursor: 'pointer'
    },
    unfold: {
        transform: 'rotate(45deg)',
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        float: 'right',
        cursor: 'pointer',
        position: 'absolute',
        right: '1%',
        top: '1%'
    },
    progressBar: {
        border: `1px solid ${theme.palette.background.successDark}`,
        borderRadius: '50%',
        color: theme.palette.background.successDark
    },
    processData: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: theme.layoutSpacing(300),
        gap: theme.layoutSpacing(20)
    },
    driverName: {
        fontSize: theme.kpi.k4.fontSize,
        letterSpacing: theme.title.h1.letterSpacing,
        fontFamily: theme.title.h1.fontFamily,
        maxWidth: theme.layoutSpacing(380),
        textAlign: 'center',
        fontWeight: theme.kpi.k1.fontWeight,
        color: theme.ConnectedSystemDashboard.text,
        marginRight: theme.spacing(5),
        marginLeft: theme.spacing(2.5)
    },
    dueDateText: {
        color: theme.palette.text.default,
        textAlign: 'center',
        fontSize: theme.title.h3.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.kpi.k1.fontWeight
    },
    foldIcon: {
        fontSize: '3rem'
    },
    progressSection: {
        position: 'relative',
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.layoutSpacing(10)
    },
    progressIndicator: {
        fontSize: theme.title.h1.fontSize,
        fontFamily: theme.title.h1.fontFamily
    },
    driverSection: {
        width: '100%',
        height: '100%'
    },
    selectedProcessBackground: {
        background: theme.ConnectedSystemDashboard.selectedProcessBackground,
        height: 'auto',
        position: 'relative',
        paddingBottom: '1rem'
    },
    closeIcon: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        float: 'right',
        cursor: 'pointer',
        position: 'absolute',
        right: '1%',
        top: '1%'
    },
    heading: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h6.fontWeight,
        letterSpacing: theme.title.h3.letterSpacing,
        paddingTop: '1rem',
        paddingBottom: '1rem',
        marginLeft: '1rem'
    },
    selectedProcessHolder: {
        marginLeft: '2rem',
        marginRight: '2rem'
    },
    processHeading: {
        fontSize: theme.kpi.k5.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.body.B4.fontWeight,
        paddingLeft: '2rem'
    },
    flowHeading: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight,
        paddingLeft: '2rem',
        marginTop: '1rem'
    },
    selectedProcessDetailsHolder: {
        borderBottom: `1px solid ${theme.palette.text.default}15`,
        borderTop: `1px solid ${theme.palette.text.default}15`,
        height: 'auto',
        marginLeft: '2rem',
        marginRight: '2rem',
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem',
        paddingTop: '1rem',
        paddingBottom: '1rem'
    },
    detailsHeading: {
        fontSize: theme.title.h3.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h1.fontWeight
    },
    detailsHighlightHeadingLeft: {
        fontSize: theme.title.h3.fontSize,
        color: theme.ConnectedSystemDashboard.blockerTextColor,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight
    },
    detailsHighlightHeadingRight: {
        fontSize: theme.title.h3.fontSize,
        color: theme.palette.background.successDark,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.title.h6.fontWeight
    },
    detailsDescription: {
        fontSize: theme.title.h1.fontSize,
        color: theme.palette.text.default,
        fontFamily: theme.title.h1.fontFamily,
        letterSpacing: theme.title.h1.letterSpacing,
        fontWeight: theme.kpi.k1.fontWeight
    },
    detailsHolder: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '15%'
    },
    detailsSeparator: {
        marginTop: '2px',
        marginBottom: '2px',
        width: '1px',
        background: `${theme.palette.text.default}15`,
        height: 'auto'
    },
    progressText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    circularProgress: {
        position: 'relative',
        display: 'inline-flex'
    },
    processHeadingHolder: {
        display: 'flex',
        alignItems: 'center',
        gap: '10rem'
    },
    progressHolder: {
        display: 'flex',
        gap: '0.25rem',
        marginRight: '10rem'
    },
    progressBlock: {
        height: theme.layoutSpacing(20),
        width: theme.layoutSpacing(10),
        background: theme.palette.background.successDark
    },
    progressBlockUnfill: {
        height: theme.layoutSpacing(20),
        width: theme.layoutSpacing(10),
        background: theme.ConnectedSystemDashboard.progressBlockUnfill
    },
    infoIcon: {
        fontSize: '2rem',
        fill: theme.palette.background.infoBgDark,
        marginLeft: '1.5rem'
    },
    legendText: {
        fontSize: theme.title.h2.fontSize,
        fontFamily: theme.title.h1.fontFamily,
        color: theme.palette.text.default,
        textAlign: 'center'
    },
    legendIndicator: {
        width: theme.layoutSpacing(20),
        height: theme.layoutSpacing(20),
        border: `1px solid ${theme.palette.text.default}`,
        fontFamily: theme.title.h1.fontFamily,
        borderRadius: '50%'
    },
    legendSection: {
        display: 'flex',
        position: 'absolute',
        bottom: '1%',
        right: '1%',
        gap: '2rem',
        '@media (min-width: 1900px)': {
            top: '92%'
        }
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
    },
    stackHolderCheck: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        gap: theme.layoutSpacing(6),
        cursor: 'pointer'
    },
    checkBoxText: {
        textAlign: 'center',
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight,
        fontSize: theme.title.h2.fontSize,
        color: theme.palette.text.default
    },
    topPart: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: '1%'
    },
    checkbox: {
        width: theme.layoutSpacing(20),
        height: theme.layoutSpacing(20),
        border: `1px solid ${theme.palette.text.default}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkIcon: {
        color: theme.palette.text.default,
        padding: theme.layoutSpacing(3),
        fontSize: '2rem'
    }
}));

function DriverProcess({
    selectedDriver,
    actions,
    setActions,
    selectedProcess,
    setSelectedProcess,
    setSelectedNode,
    fetchDrivers
}) {
    // const connSystemData = useContext(ConnSystemsContext);
    const processDetails = selectedProcess?.process_config;
    const progress = processDetails?.progress ? processDetails.progress : 0;
    const classes = useStyles();
    const [selectedProcessConfig, setSelectedProcessConfig] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addProcess, setAddProcess] = useState(false);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [driverTemplates, setDriverTemplates] = useState([]);
    const [addProcessDetails, setAddProcessDetails] = useState(false);

    const setProcess = (el) => {
        setSelectedProcess(el);
        fetchBusinessProcessFlow(el.id);
    };

    const fetchBusinessProcessFlow = async (connSystemBusinessProcessId) => {
        getBusinessProcessData({
            connSystemBusinessProcessId: connSystemBusinessProcessId,
            callback: onResponseBusinessProcessData
        });
    };

    const onResponseBusinessProcessData = (response) => {
        setSelectedProcessConfig(response.process_config);
        setSelectedProcess(response);
        setLoading(false);
    };

    // const VerticalLinearProgress = (props) => {
    //     return <LinearProgress {...props} className={classes.root} variant="buffer" />;
    // };

    const handleAddProcess = () => {
        setAddProcess(true);
        setLoadingTemplates(true);
        getBusinessProcessTemplatesByDriver({
            connSystemDriverId: selectedDriver.id,
            callback: onResponseBusinessProcessTemplatesByDriver
        });
    };

    const onResponseBusinessProcessTemplatesByDriver = (response) => {
        setDriverTemplates(response);
        setLoadingTemplates(false);
    };

    const onHandleFieldChange = (field_id, field_value) => {
        if (field_id === 'selected_template') {
            setSelectedTemplate(field_value);
            var selected_template = _.find(driverTemplates, function (process_template) {
                return process_template.id === field_value;
            });
            setAddProcessDetails({
                name: selected_template.name,
                is_active: true,
                driver_id: selectedDriver.id,
                order_by:
                    _.max(selectedDriver.business_processes, function (process_item) {
                        return process_item.order_by;
                    }).order_by + 1
            });
        } else {
            setAddProcessDetails({
                ...addProcessDetails,
                [field_id]: field_value
            });
        }
    };

    const handleCloseDialog = () => {
        setAddProcessDetails(false);
        setSelectedTemplate(null);
        setDriverTemplates([]);
        setAddProcess(false);
    };

    const onAddProcess = () => {
        createBusinessProcessFromTemplate({
            connSystemDriverId: addProcessDetails.driver_id,
            payload: {
                ...addProcessDetails,
                template_id: selectedTemplate
            },
            callback: onResponseCreateBusinessProcessFromTemplate
        });
    };

    const onResponseCreateBusinessProcessFromTemplate = () => {
        setAddProcessDetails(false);
        setSelectedTemplate(null);
        setDriverTemplates([]);
        setAddProcess(false);
        if (fetchDrivers) {
            fetchDrivers();
        }
    };

    const renderProcessList = () => {
        return (
            <div className={classes.driverProcessList}>
                <Grid container spacing={2} className={classes.driverProcessesContainer}>
                    {selectedDriver?.business_processes.map((el) => (
                        <Grid
                            item
                            xs={selectedDriver?.business_processes.length > 3 ? 3 : true}
                            key={`grid-${el.name}`}
                        >
                            <div
                                className={classes.processSection}
                                key={`${el.name}`}
                                onClick={() => setProcess(el)}
                            >
                                <div className={classes.unfold}>
                                    <UnfoldMore className={classes.foldIcon} />
                                </div>
                                <div className={classes.processData}>
                                    <Typography className={classes.driverName}>
                                        {el.name}
                                    </Typography>
                                    <div className={classes.progressSection}>
                                        <div className={classes.circularProgress}>
                                            <div className={classes.progressText}>
                                                <Typography
                                                    className={classes.progressIndicator}
                                                >{`${
                                                    el.process_config?.progress
                                                        ? el.process_config?.progress
                                                        : 0
                                                }%`}</Typography>
                                            </div>
                                            <CircularProgress
                                                value={
                                                    el.process_config?.progress
                                                        ? el.process_config?.progress
                                                        : 0
                                                }
                                                size={84}
                                                variant="determinate"
                                                className={classes.progressBar}
                                            />
                                        </div>
                                        <Typography className={classes.dueDateText}>{`Due by ${
                                            el.process_config?.due ? el.process_config?.due : 'TBD'
                                        }`}</Typography>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    };

    return (
        <div className={classes.driverSection}>
            {selectedDriver ? (
                selectedProcess ? (
                    loading ? (
                        <>
                            <Skeleton
                                variant="rect"
                                animation="wave"
                                component="div"
                                width="100%"
                                height="100%"
                                className={classes.skeletonWave}
                            />
                            <CodxCircularLoader center size={60} />
                        </>
                    ) : (
                        <div className={classes.selectedProcessHolder}>
                            <Typography className={classes.heading}>Process</Typography>
                            <div className={classes.selectedProcessBackground}>
                                <div className={classes.processHeadingHolder}>
                                    <Typography className={classes.processHeading}>
                                        {selectedProcess?.name || ''}
                                    </Typography>
                                    <div className={classes.progressHolder}>
                                        {[...Array(Math.floor(progress / 10) * 6)].map(
                                            (i, item_index) => (
                                                <span
                                                    key={`progressBlockGreen${item_index}`}
                                                    className={classes.progressBlock}
                                                ></span>
                                            )
                                        )}
                                        {[...Array(Math.floor((100 - progress) / 10) * 6)].map(
                                            (i, item_index) => (
                                                <span
                                                    key={`progressBlock${item_index}`}
                                                    className={classes.progressBlockUnfill}
                                                ></span>
                                            )
                                        )}
                                        <Info className={classes.infoIcon} />
                                    </div>
                                </div>
                                <div className={classes.selectedProcessDetailsHolder}>
                                    {selectedProcessConfig?.processInfo
                                        ?.slice(0, 5)
                                        .map((val, key) => (
                                            <React.Fragment key={`${val?.heading}`}>
                                                <div className={classes.detailsHolder}>
                                                    <Typography
                                                        className={
                                                            key == 3
                                                                ? classes.detailsHighlightHeadingLeft
                                                                : key == 4
                                                                ? classes.detailsHighlightHeadingRight
                                                                : classes.detailsHeading
                                                        }
                                                    >
                                                        {val?.heading}
                                                    </Typography>
                                                    <Typography
                                                        className={
                                                            key == 3 || key == 4
                                                                ? classes.detailsHeading
                                                                : classes.detailsDescription
                                                        }
                                                    >
                                                        {val?.value}
                                                    </Typography>
                                                </div>
                                                {key != 4 && (
                                                    <span
                                                        className={classes.detailsSeparator}
                                                    ></span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </div>
                                <div className={classes.topPart}>
                                    <Typography className={classes.flowHeading}>
                                        Decision Flow
                                    </Typography>
                                    <div className={classes.stackHolderCheck}>
                                        <div className={classes.checkbox}>
                                            <CheckIcon className={classes.checkIcon} />
                                        </div>
                                        <span className={classes.checkBoxText}>
                                            Show stakeholders in decision flow
                                        </span>
                                    </div>
                                </div>

                                <ProcessDecisionFlow
                                    actions={actions}
                                    setActions={setActions}
                                    selectedProcessConfig={selectedProcessConfig}
                                    setSelectedNode={setSelectedNode}
                                />
                                <div className={classes.closeIcon} onClick={() => setProcess(null)}>
                                    <Close className={classes.foldIcon} />
                                </div>
                                <div className={classes.legendSection}>
                                    {selectedProcessConfig?.legends?.map((el, i) => (
                                        <div className={classes.legend} key={`legend${i}`}>
                                            <div
                                                style={{ backgroundColor: el.color }}
                                                className={classes.legendIndicator}
                                            ></div>
                                            <Typography className={classes.legendText}>
                                                {el.name}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    [
                        selectedDriver.end_user_add &&
                            (addProcess ? (
                                <Dialog
                                    open={true}
                                    fullWidth
                                    maxWidth="md"
                                    className={classes.dialog}
                                >
                                    <DialogTitle>Add process</DialogTitle>
                                    <IconButton
                                        title="Close"
                                        onClick={handleCloseDialog}
                                        className={classes.dialogClose}
                                    >
                                        <Close fontSize="large" />
                                    </IconButton>
                                    <div className={classes.dialogContainer}>
                                        {loadingTemplates ? (
                                            <CodxCircularLoader center size={85} />
                                        ) : (
                                            <div className={classes.driverProcessAddFormContainer}>
                                                <Typography variant="h4">
                                                    Please select a template for the process
                                                </Typography>
                                                <CustomTextField
                                                    field_info={{
                                                        label: 'Template',
                                                        id: 'template_id',
                                                        is_select: true,
                                                        fullWidth: true,
                                                        options: driverTemplates.map((el) => {
                                                            return {
                                                                label: el.name,
                                                                value: el.id
                                                            };
                                                        }),
                                                        value: selectedTemplate,
                                                        onChange: (v) =>
                                                            onHandleFieldChange(
                                                                'selected_template',
                                                                v
                                                            )
                                                    }}
                                                />
                                                {addProcessDetails && (
                                                    <Grid container spacing={4}>
                                                        <Grid item xs={6}>
                                                            <CustomTextField
                                                                field_info={{
                                                                    label: 'Business Process Name',
                                                                    id: 'name',
                                                                    fullWidth: true,
                                                                    value: addProcessDetails.name,
                                                                    onChange: (v) =>
                                                                        onHandleFieldChange(
                                                                            'name',
                                                                            v
                                                                        )
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <CustomTextField
                                                                field_info={{
                                                                    label: 'Order',
                                                                    id: 'order_by',
                                                                    fullWidth: true,
                                                                    value: addProcessDetails.order_by
                                                                        ? addProcessDetails.order_by
                                                                        : 0,
                                                                    helper_text:
                                                                        'Enter any whole number greater than 0',
                                                                    onChange: (v) =>
                                                                        onHandleFieldChange(
                                                                            'order_by',
                                                                            v
                                                                        )
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <DialogActions>
                                        <Button variant="outlined" onClick={handleCloseDialog}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" onClick={onAddProcess}>
                                            Add
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            ) : (
                                <div className={classes.driverProcessAddContainer}>
                                    <Button variant="outlined" onClick={handleAddProcess}>
                                        Add process
                                    </Button>
                                </div>
                            )),
                        renderProcessList()
                    ]
                )
            ) : (
                <div className={classes.initialData}>
                    <SelectDriverImage />
                    <Typography className={classes.textHeading}>
                        Select a driver to view the business process
                    </Typography>
                </div>
            )}
        </div>
    );
}

export default React.memo(DriverProcess);
