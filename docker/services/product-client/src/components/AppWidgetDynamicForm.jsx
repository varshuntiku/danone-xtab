import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import DynamicForm, { mapValue } from './dynamic-form/dynamic-form';
import { TextList } from './screenActionsComponent/actionComponents/TextList';
import { withRouter } from 'react-router-dom';

const deepClone = (d) => d && JSON.parse(JSON.stringify(d));

function AppWidgetDynamicForm({
    params,
    onValidateValueChangeInGridTable,
    onAction,
    onModalFormAction,
    onFetchFormData,
    onDrilledData,
    dynamicPayloadPreset,
    onToolBarAction,
    onFetchDetailData,
    handleWidgetEvent,
    color_nooverride,
    notificationOpen = () => {},
    ...props
}) {
    const [data, setData] = React.useState(deepClone(params.form_config));
    const [initialParams, setInitialParams] = React.useState(params);
    const [response, setResponse] = React.useState();
    const [key, setKey] = React.useState(0);
    if (dynamicPayloadPreset?.payload?.data) {
        dynamicPayloadPreset.payload.data = {
            ...dynamicPayloadPreset.payload.data,
            ...mapValue(data?.fields)
        };
    }
    const [dynamicPayload, setDynamicPayload] = React.useState(dynamicPayloadPreset);
    const updateFormState = React.useCallback((d, suppressInitialParamsUpdate) => {
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
            setResponse({ extraParamsMapping: d.extraParamsMapping, error: d.error, info: d.info });
        }
        if (d?.form_config) {
            setData(deepClone(d?.form_config));
            setKey((s) => s + 1);
        }
        if (!suppressInitialParamsUpdate) {
            setInitialParams((s) => ({ ...s, ...d }));
        }
    }, []);

    useEffect(() => {
        updateFormState(initialParams, true);
    }, [initialParams, updateFormState]);

    useEffect(() => {
        if (dynamicPayloadPreset) {
            dynamicPayloadPreset.payload.data = {
                ...dynamicPayloadPreset.payload.data,
                ...mapValue(data?.fields)
            };
            setDynamicPayload(dynamicPayloadPreset);
        }
    }, [data]);

    const handleAction = async (action_type, data, action_event = {}, showLoader = true) => {
        const d = mapValue(data?.fields);
        try {
            const res = await onAction(action_type, d, { form_config: data }, showLoader);
            if (action_event?.navigate?.to) {
                const DEFAULT_DELAY = 2000;
                const inputDelayInMs = action_event.navigate.delayInMs;
                const delayInMs =
                    inputDelayInMs || inputDelayInMs === 0 ? inputDelayInMs : DEFAULT_DELAY;
                if (action_event.navigate.inAppNavigation) {
                    setTimeout(() => props.history.push(`/${action_event.navigate.to}`), delayInMs);
                } else {
                    setTimeout(
                        () =>
                            window.open(
                                `${window.location.origin}/${action_event.navigate.to}`,
                                '_blank'
                            ),
                        delayInMs
                    );
                }
            }
            updateFormState(res);
        } catch (error) {
            // console.error(error);
        }
    };

    const handleModalFormAction = async (action_type) => {
        const d = mapValue(data?.fields);
        const res = await onModalFormAction(action_type, d, { form_config: data });
        updateFormState(res);
        return res;
    };

    const handleFetchFormData = async (action_type) => {
        const d = mapValue(data?.fields);
        return await onFetchFormData(action_type, d, { form_config: data });
    };
    const handleToolBarAction = async (action_type, value, optionName) => {
        const d = mapValue(data?.fields);
        const res = await onToolBarAction(action_type, value, optionName, d, { form_config: data });
        updateFormState(res);
        return res;
    };

    return (
        <React.Fragment>
            <DynamicForm
                key={key}
                params={data}
                extraParamsMapping={response?.extraParamsMapping}
                onChange={setData}
                onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                onGridTableOuterAction={() => handleAction(params.actionName)}
                onClickActionButton={(e) => handleAction(e.name, e)}
                onValidation={(actionName, data, showLoader) =>
                    handleAction(actionName, data, {}, showLoader)
                }
                onModalFormAction={handleModalFormAction}
                onFetchFormData={handleFetchFormData}
                onToolBarAction={handleToolBarAction}
                onDrilledData={onDrilledData}
                dynamicPayload={dynamicPayload}
                onFetchDetailData={onFetchDetailData}
                onUpload={(e) => handleFetchFormData(e.name)}
                handleWidgetEvent={handleWidgetEvent}
                app_id={props.app_id}
                isDynamicForm={true}
                color_nooverride={color_nooverride}
                data-testid="dynamic-form"
                notificationOpen={notificationOpen}
            />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {response?.info ? (
                    <Box marginRight="5rem">
                        <TextList params={response?.info} data-testid="text-list" />
                    </Box>
                ) : null}
                <div style={{ flex: 1 }}></div>
                {initialParams?.actions?.map((el) => (
                    <Button
                        key={el.text || 'Click'}
                        onClick={() => handleAction(el.name)}
                        variant={el.variant || 'outlined'}
                        size="small"
                        aria-label={el.text || el.name}
                        data-testid={`action-button-${el.name}`}
                    >
                        {el.text || el.name}
                    </Button>
                ))}
            </div>
        </React.Fragment>
    );
}

export default withRouter(AppWidgetDynamicForm);
