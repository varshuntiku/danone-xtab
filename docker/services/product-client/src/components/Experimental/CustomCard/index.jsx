import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { matchPath } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography, Chip, Grid } from '@material-ui/core';
import ActionButtons from 'components/dynamic-form/inputFields/ActionButtons.jsx';
import DynamicFormModal from 'components/dynamic-form/inputFields/DynamicFormModal.jsx';
import DynamicForm, { mapValue } from 'components/dynamic-form/dynamic-form.jsx';

function getAppId() {
    const match = matchPath(window.location.pathname, {
        path: '/app/:app_id'
    });
    return match?.params?.app_id;
}

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

const useStyles = makeStyles((theme) => ({
    root: (rootProps) => ({
        width: rootProps?.width || theme.spacing(64),
        height: rootProps?.height || theme.spacing(32),
        margin: theme.spacing(2),
        padding: theme.spacing(0.5),
        border: '1.5px solid ' + theme.palette.border.color,
        borderRadius: theme.spacing(2),
        boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: `0px 6px 15px rgba(0, 0, 0, 0.2)`
        },
        color: theme.palette.text.default,
        backgroundColor: theme.palette.primary.dark
    }),
    content: {
        padding: theme.spacing(1)
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        rowGap: theme.layoutSpacing(10.5),
        '& .MuiChip-root:not(:last-child)': {
            marginRight: theme.layoutSpacing(12)
        },
        '& .MuiChip-root': {
            backgroundColor: theme.palette.background.chipRevampBg,
            height: theme.layoutSpacing(32),

            '& .MuiChip-label': {
                fontSize: theme.layoutSpacing(14),
                fontWeight: 400,
                lineHeight: theme.layoutSpacing(24),
                color: theme.palette.text.revamp
            }
        }
    },
    header: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(1)
    },
    subHeader: {
        padding: theme.spacing(0.5)
    },
    paragraph: {
        padding: theme.spacing(0.5)
    }
}));

const CustomCard = ({ params, ...props }) => {
    const {
        onValidateValueChangeInGridTable,
        item,
        handleValueChange,
        elemntProps,
        onModalFormAction,
        onFetchFormData,
        onDynamicFormAction,
        history
    } = props;

    const classes = useStyles(elemntProps?.cardStyleProps);

    const { cardData } = params;
    const {
        isChipsEnabled,
        chips,
        isHeader,
        header,
        isSubHeader,
        subHeader,
        isPara,
        paragraph,
        isActionButtons,
        actionButtons,
        isModalForm,
        modalFormdata,
        isDynamicForm,
        dynamicFormdata
    } = cardData;

    const [key, setKey] = useState(0);
    const [dynamicFormState, setDynamicFormState] = useState(
        deepClone(dynamicFormdata?.form_config)
    );
    const [response, setResponse] = useState();
    const [initialParams, setInitialParams] = useState(params);

    const updateFormState = useCallback(
        (d, suppressInitialParamsUpdate) => {
            if (typeof d.error === 'string') {
                setResponse({
                    extraParamsMapping: d.extraParamsMapping,
                    error: true,
                    info: {
                        ...d?.info,
                        list: [{ text: d.error, color: 'error' }, ...(d?.info?.list || [])]
                    }
                });
            } else {
                setResponse({
                    extraParamsMapping: d.extraParamsMapping,
                    error: d.error,
                    info: d.info
                });
            }
            if (d?.form_config) {
                setDynamicFormState(deepClone(d?.form_config));
                setKey((s) => s + 1);
            }
            if (d?.message) {
                if (typeof d.message === 'string') {
                    // setNotification({ message: d.message });
                    // setNotificationOpen(true);
                } else {
                    // setNotification(d.message);
                    // setNotificationOpen(true);
                }
            }
            if (!suppressInitialParamsUpdate) {
                setInitialParams((s) => ({ ...s, ...d }));
            }
            if (d?.navigate?.to) {
                const appId = getAppId();
                history.push('/app/' + appId + '/' + d.navigate.to, {
                    filterState: d?.navigate?.filterState,
                    hideFilter: d?.navigate?.hideFilter
                });
            }
        },
        [history]
    );

    useEffect(() => {
        updateFormState(initialParams, true);
    }, [initialParams, updateFormState]);

    const handleDynamicFormAction = async (el) => {
        setResponse(null);
        const d = mapValue(dynamicFormState?.fields);

        try {
            if (el.callback && el.parent_obj) {
                el.parent_obj[el.callback]({
                    payload: {
                        data: d
                    },
                    callback: (d) => {
                        console.log('callback', d);
                    }
                });
            } else {
                const resp = await onDynamicFormAction(el.name, d);
                updateFormState(resp);
            }
        } catch (error) {
            // console.error(error);
        }
    };

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                {isChipsEnabled && chips?.length && (
                    <Grid
                        className={classes.chips}
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {chips.map((chip) => {
                            return (
                                <Chip
                                    key={chip.id}
                                    label={chip.label}
                                    size={chip.size}
                                    {...chip?.chipProps}
                                />
                            );
                        })}
                    </Grid>
                )}
                {isHeader && (
                    <Grid className={classes.header}>
                        <Typography
                            variant={header.variant}
                            component={header.component}
                            style={header.style}
                            {...header?.typographyProps}
                        >
                            {header.text}
                        </Typography>
                    </Grid>
                )}
                {isSubHeader && (
                    <Grid className={classes.subHeader}>
                        <Typography
                            variant={subHeader.variant}
                            component={subHeader.component}
                            style={subHeader.style}
                            {...subHeader?.typographyProps}
                        >
                            {subHeader.text}
                        </Typography>
                    </Grid>
                )}
                {isPara && (
                    <Grid className={classes.paragraph}>
                        <Typography
                            variant={paragraph.variant}
                            component={paragraph.component}
                            style={paragraph.style}
                            {...paragraph?.typographyProps}
                        >
                            {paragraph.text}
                        </Typography>
                    </Grid>
                )}
                {isDynamicForm && dynamicFormdata && Object.keys(dynamicFormdata)?.length > 0 && (
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                        <DynamicForm
                            key={key}
                            onChange={setDynamicFormState}
                            params={dynamicFormState}
                            extraParamsMapping={response?.extraParamsMapping}
                            onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                            onClickActionButton={(el) => handleDynamicFormAction(el)}
                            onValidation={(actionName) =>
                                handleDynamicFormAction({ name: actionName })
                            }
                        />
                    </Grid>
                )}
            </CardContent>
            <CardActions>
                {isActionButtons && actionButtons?.length > 0 && (
                    <Fragment>
                        {actionButtons.map((action, index) => {
                            return (
                                <ActionButtons
                                    key={index}
                                    params={action?.value}
                                    // onClick={}
                                    align={action?.align}
                                />
                            );
                        })}
                    </Fragment>
                )}
                {isModalForm && modalFormdata && Object.keys(modalFormdata)?.length > 0 && (
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                        <DynamicFormModal
                            params={modalFormdata?.modalForm}
                            onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                            onAction={async (actionType, data) => {
                                item.value = data;
                                handleValueChange(elemntProps);
                                return await onModalFormAction(actionType);
                            }}
                            onFetchFormData={onFetchFormData}
                        />
                    </Grid>
                )}
            </CardActions>
        </Card>
    );
};

export default CustomCard;
