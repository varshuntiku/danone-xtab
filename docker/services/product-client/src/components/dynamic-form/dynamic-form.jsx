import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextInput from './inputFields/textInput';
import SimpleSelect from './inputFields/select';
import DatePicker from './inputFields/datepicker';
import CustomLabel from './inputFields/customLabel';
import FileUpload from './inputFields/fileUpload';
import FileUpload2 from './inputFields/fileUpload2';
import GridTable from '../gridTable/GridTable';
import CheckboxesGroup from './inputFields/checkboxgroup';
import CustomCheckbox from './inputFields/checkbox';
import RadioButtonsGroup from './inputFields/radiogroup';
import { TextList } from '../screenActionsComponent/actionComponents/TextList';
import clsx from 'clsx';
import { DownloadLink } from '../screenActionsComponent/actionComponents/DownloadLink';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { amber } from '@material-ui/core/colors';
import AutoSuggest from './inputFields/autoSuggest';
import DateTimePicker from './inputFields/datetimepicker';
import ActionButtons from './inputFields/ActionButtons';
import DownloadWorkBook from '../workbook/downloadWorkBook';
import AppWidgetAssumptions from '../AppWidgetAssumptions';
import Widget from '../Widget';
import { Paper } from '@material-ui/core';
import DynamicFormModal from './inputFields/DynamicFormModal';
import DateRangeSelect from '../AppWidgetMultiSelect/DateRangeSelect';
import InfoPopper from '../porblemDefinitionFramework/create/InfoPopper';
import NumberInput from './inputFields/numberInput';
import CustomSliderInput from './inputFields/CustomSliderInput';
import CustomSwitch from './inputFields/CustomSwitch';
import CustomImage from './inputFields/CustomImage';
import CustomLegends from 'components/custom/CustomLegends';
import CodxCarouselView from '../Experimental/codxComponentCarousel/codxCarouselView';
import AppSystemWidgetInfo from '../AppSystemWidgetInfo';
import CustomTypography from '../Experimental/CustomTypography';
import AppScreenNavigate from '../gridTable/cell-renderer/AppScreenNavigate';
import MobileUpload from './inputFields/mobileUpload';
import Databar from './DataBar';
import ToolBar from 'components/custom/CodxToolBar';
import NavSelection from './NavSelection';
import sanitizeHtml from 'sanitize-html-react';
import CustomCard from 'components/Experimental/CustomCard/index.jsx';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: '0.8rem',
        '& input.Mui-disabled': {
            backgroundColor: theme.palette.background.field_disabled_bg,
            color: theme.palette.text.disabledLabel
        }
    },
    title: {
        '&.MuiTypography-h4': {
            color: theme.palette.text.revamp,
            fontSize: theme.layoutSpacing(20),
            fontWeight: '500',
            fontFamily: theme.title.h1.fontFamily,
            textTransform: 'capitalize',
            lineHeight: theme.layoutSpacing(32)
        },
        paddingBottom: theme.layoutSpacing(40),
        gridArea: 'form-title'
    },
    titleAlignCenter: {
        '&.MuiTypography-h4': {
            textAlign: 'center'
        }
    },
    itemGrid: {
        marginBottom: '1rem'
    },
    itemGridTable: {
        marginBottom: '4rem !important'
    },
    noGutterTop: {
        marginTop: 0 + '!important',
        paddingTop: 0 + '!important'
    },
    noGutterBottom: {
        marginBottom: 0 + '!important',
        paddingBottom: 0 + '!important'
    },
    helperText: {
        fontSize: '1.2rem',
        textAlign: 'justify',
        color: amber['A400'],
        '& svg': {
            color: amber['A400'],
            position: 'relative',
            top: '3px'
        }
    },
    inputComponentError: {
        color: theme.palette.error.main,
        fontSize: '2rem'
    },
    hr: {
        opacity: 0.4
    },
    outlinedGrid: {
        border: `1px solid ${theme.palette.primary.contrastText}`
    },
    infoPopper: {
        display: 'flex',
        alignItems: 'center'
    },
    iconStyles: {
        width: '3rem',
        height: '3rem',
        objectFit: 'contain',
        borderRadius: '50%',
        marginRight: '2rem'
    },
    iconWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    revampedLabel: {
        display: 'flex',
        alignItems: 'center',
        '&.MuiGrid-item': {
            paddingRight: theme.layoutSpacing(19)
        }
    },
    gridItemCustom: {
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'start'
    },
    customRightAlign: {
        justifyContent: 'end'
    }
    // TODO: Remove the following commented code once all the forms are tested and look fine
    // labelCustomAlignStyle: {
    //     justifyContent: 'start'
    // },
    // gridItemLevelOne: {
    //     // Remove important once we fix specificity in a proper way
    //     paddingBottom: `${theme.layoutSpacing(40)}!important`,
    //     paddingTop: `0!important`,
    //     paddingLeft: `0!important`,
    //     paddingRight: `0`,
    //     '& .MuiGrid-item:nth-child(2n-1)': {
    //         padding: `0 ${theme.layoutSpacing(24)} 0 0`,
    //         maxWidth: theme.layoutSpacing(152),
    //         '& p': {
    //             textAlign: 'right'
    //         }
    //     },
    //     '& .MuiGrid-item:nth-child(2)': {
    //         marginRight: theme.layoutSpacing(88)
    //     },
    //     '& > div': {
    //         justifyContent: 'center'
    //     },
    //     '& .MuiGrid-item:last-child': {
    //         paddingTop: theme.layoutSpacing(8)
    //     },
    //     '&:last-child .MuiGrid-item:nth-child(2n-1)': {
    //         maxWidth: 'none',
    //         display: 'grid',
    //         gridTemplateColumns: '2fr 11.3fr',
    //         gridTemplateAreas: `'. form-button'`,
    //         '& > div': {
    //             display: 'unset',
    //             gridArea: 'form-button'
    //         }
    //     }
    // },
    // gridItemLevelOne3Col: {
    //     // Remove important once we fix specificity in a proper way
    //     paddingBottom: `${theme.layoutSpacing(40)}!important`,
    //     paddingTop: `0!important`,
    //     paddingLeft: `0!important`,
    //     paddingRight: `0!important`,
    //     '& .MuiGrid-item:nth-child(2n-1)': {
    //         padding: `0 ${theme.layoutSpacing(24)} 0 0`,
    //         maxWidth: theme.layoutSpacing(90),
    //         '& p': {
    //             textAlign: 'right'
    //         }
    //     },
    //     '& .MuiGrid-item:nth-child(2)': {
    //         marginRight: theme.layoutSpacing(48)
    //     },
    //     '& .MuiGrid-item:nth-child(4)': {
    //         marginRight: theme.layoutSpacing(48)
    //     },
    //     '& > div': {
    //         justifyContent: 'center'
    //     },
    //     '& .MuiGrid-item:last-child': {
    //         paddingTop: theme.layoutSpacing(8)
    //     },
    //     '&:last-child .MuiGrid-item:nth-child(2n-1)': {
    //         maxWidth: 'none',
    //         display: 'grid',
    //         gridTemplateColumns: '1fr 11.3fr',
    //         gridTemplateAreas: `'. form-button'`,
    //         '& > div': {
    //             display: 'unset',
    //             gridArea: 'form-button'
    //         }
    //     }
    // },
    // gridItemLevelOne1Col: {
    //     '& .MuiGrid-item:nth-child(2n-1)': {
    //         maxWidth: theme.layoutSpacing(316)
    //     },
    //     '&:last-child .MuiGrid-item:nth-child(2n-1)': {
    //         gridTemplateColumns: '4fr 8.63fr'
    //     }
    // },
    // gridItemLevelZero: {
    //     padding: `0 ${theme.layoutSpacing(96)}`
    // },
    // formTitle: {
    //     display: 'grid',
    //     gridTemplateColumns: '2fr 11.9fr',
    //     gridTemplateAreas: `'. form-title'`
    // },
    // formTitle3Col: {
    //     gridTemplateColumns: '1fr 11.9fr'
    // },
    // formTitle1Col: {
    //     gridTemplateColumns: '4fr 8.9fr'
    // },
    // allLabelsRow: {
    //     paddingBottom: `${theme.layoutSpacing(8)}!important`,
    //     '& .MuiGrid-item': {
    //         justifyContent: 'start'
    //     }
    // },
    // centerAlign: {
    //     textAlign: 'center'
    // },
    // centerAlignButton: {
    //     '& #action-buttons-wrapper': {
    //         justifyContent: 'center'
    //     }
    // }
}));
// screen_id and app_id is not mandetory
export default function DynamicForm({
    onChange,
    params,
    screen_id,
    app_id,
    extraParamsMapping,
    onValidation,
    onValidateValueChangeInGridTable,
    onGridTableOuterAction,
    onClickActionButton,
    onModalFormAction,
    onFetchFormData,
    onToolBarAction,
    onDrilledData,
    dynamicPayload,
    onFetchDetailData,
    handleWidgetEvent,
    origin,
    onUpload,
    isDynamicForm = false,
    color_nooverride,
    notificationOpen = () => {}
}) {
    const classes = useStyles();
    const [formInputs, setFormInputs] = React.useState(params);
    const handleValueChange = (elemnt, showLoader) => {
        if (elemnt.validator && onValidation) {
            onChange(formInputs);
            onValidation(elemnt.validator, formInputs, showLoader);
        } else {
            onChange(formInputs);
        }
    };
    useEffect(() => {
        if (origin === 'digital-twin') {
            setFormInputs(JSON.parse(JSON.stringify(params)));
        }
    }, [origin === 'digital-twin' && params]);

    const columnsCount = formInputs?.fields.length
        ? formInputs?.fields[0]?.fields?.length
            ? formInputs?.fields[0]?.fields[0]?.fields?.length / 2
            : 3
        : 3;

    return (
        <React.Fragment>
            <CssBaseline />
            <div className={classes.paper}>
                <div
                    className={`${!formInputs?.hideCustomStyles && classes.formTitle}
                        ${columnsCount === 3 ? classes.formTitle3Col : ''}
                        ${columnsCount === 1 ? classes.formTitle1Col : ''}
                        ${
                            formInputs?.titleAndButtonsAlignment === 'center' && classes.centerAlign
                        }`}
                >
                    {formInputs.title ? (
                        <Typography
                            variant="h4"
                            className={`${classes.title} ${
                                formInputs.titleAlign === 'center' && classes.titleAlignCenter
                            }`}
                        >
                            {formInputs.title.toLowerCase()}
                        </Typography>
                    ) : null}
                </div>
                <form className={classes.form} noValidate>
                    <GridFormItem
                        formInput={formInputs}
                        extraParamsMapping={extraParamsMapping}
                        app_id={app_id}
                        classes={classes}
                        handleValueChange={handleValueChange}
                        onClickActionButton={onClickActionButton}
                        onFetchFormData={onFetchFormData}
                        onGridTableOuterAction={onGridTableOuterAction}
                        onModalFormAction={onModalFormAction}
                        onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                        onToolBarAction={onToolBarAction}
                        onDrilledData={onDrilledData}
                        screen_id={screen_id}
                        dynamicPayload={dynamicPayload}
                        onFetchDetailData={onFetchDetailData}
                        onUpload={onUpload}
                        handleWidgetEvent={handleWidgetEvent}
                        columnsCount={columnsCount}
                        isDynamicForm={isDynamicForm}
                        hideCustomStyles={formInputs?.hideCustomStyles}
                        buttonsAlignment={formInputs?.titleAndButtonsAlignment}
                        color_nooverride={color_nooverride}
                        notificationOpen={notificationOpen}
                    />
                </form>
            </div>
        </React.Fragment>
    );
}

export function mapValue(fields) {
    if (!fields?.length) {
        return {};
    }
    return fields.reduce((acc, b) => {
        if (b.fields) {
            acc = { ...acc, ...mapValue(b.fields) };
        } else {
            acc = { ...acc, [b.name]: b.value ?? b?.defaultValue };
            if (
                b?.type === 'modalForm' &&
                b?.withToolBar === true &&
                (acc[b.name] === undefined || acc[b.name] === null)
            ) {
                acc = { ...acc, [b.name]: b };
            }
            if (b.coldefName) {
                acc = { ...acc, [b.coldefName]: b.coldefValue };
            }
        }
        return acc;
    }, {});
}
export function reverseMapValue(fields, rowData) {
    if (!fields?.length) {
        return fields;
    }
    fields.forEach((el) => {
        if (el.fields?.length) {
            reverseMapValue(el.fields, rowData);
        } else {
            el.value = rowData[el.name];
            if (el.coldefName) {
                el.coldefValue = rowData[el.coldefName];
            }
        }
    });
    return fields;
}

const GridFormItem = ({
    formInput,
    extraParamsMapping,
    classes,
    dynamicPayload,
    onToolBarAction,
    iteration = 0,
    columnsCount,
    isDynamicForm,
    hideCustomStyles = false,
    buttonsAlignment,
    color_nooverride,
    notificationOpen,
    ...props
}) => {
    return (
        <Grid container direction="row" spacing={formInput.field_spacing ?? 2}>
            {formInput.fields.map((item, index) => {
                return (
                    <Grid
                        component={item.paperGrid ? Paper : 'div'}
                        item
                        xs={item.grid}
                        key={index + item.id + item.type + item.name}
                        style={{
                            display: item.justifyContent || item.alignItems ? 'grid' : '',
                            justifyContent: item.justifyContent,
                            alignItems: item.alignItems,
                            height: item.gridHeight
                        }}
                        className={clsx({
                            [classes.itemGrid]: true,
                            [classes.noGutterTop]: item.noGutterTop,
                            [classes.noGutterBottom]:
                                item.type !== 'gridTable' &&
                                item.type !== 'tabularForm' &&
                                item.noGutterBottom,
                            [classes.outlinedGrid]: item.outlinedGrid,
                            [classes.infoPopper]: item.infoPopper,
                            [classes.revampedLabel]: item?.type && item.type === 'label',
                            [classes.gridItemCustom]: !hideCustomStyles && isDynamicForm,
                            [classes.itemGridTable]:
                                item?.type &&
                                (item.type === 'gridTable' || item.type === 'tabularForm'),
                            // TODO: Remove the following commented code once all the forms are tested and look fine
                            // [classes.gridItemLevelOne]:
                            //     !hideCustomStyles && iteration === 1 && columnsCount !== 3,
                            // [classes.gridItemLevelZero]:
                            //     !hideCustomStyles && iteration === 0 && columnsCount !== 3,
                            // [classes.gridItemLevelZero3Col]:
                            //     !hideCustomStyles && iteration === 0 && columnsCount === 3,
                            // [classes.gridItemLevelOne3Col]:
                            //     !hideCustomStyles && iteration === 1 && columnsCount === 3,
                            // [classes.gridItemLevelOne1Col]:
                            //     !hideCustomStyles && iteration === 1 && columnsCount === 1,
                            // [classes.allLabelsRow]:
                            //     !hideCustomStyles && isDynamicForm && isLabelsRow,
                            // [classes.centerAlignButton]: buttonsAlignment === 'center',
                            // [classes.labelCustomAlignStyle]:
                            //     (item?.type === 'label' || item?.type === 'checkbox') &&
                            //     item?.labelCustomAlign === 'left',
                            [classes.customRightAlign]: item?.InputLabelProps?.align === 'right'
                        })}
                    >
                        {item.fields ? (
                            <GridFormItem
                                formInput={item}
                                extraParamsMapping={extraParamsMapping}
                                classes={classes}
                                iteration={iteration + 1}
                                columnsCount={columnsCount}
                                isDynamicForm={isDynamicForm}
                                hideCustomStyles={hideCustomStyles}
                                buttonsAlignment={buttonsAlignment}
                                notificationOpen={notificationOpen}
                                {...props}
                            />
                        ) : (
                            <>
                                {/* {renderFields(item, index, extraParamsMapping?.[item.name])} */}
                                <FieldComponent
                                    key={index}
                                    item={item}
                                    fieldIndex={index}
                                    extraParams={extraParamsMapping?.[item.name]}
                                    classes={classes}
                                    dynamicPayload={dynamicPayload}
                                    onToolBarAction={onToolBarAction}
                                    color_nooverride={color_nooverride}
                                    notificationOpen={notificationOpen}
                                    {...props}
                                />
                                {item.infoPopper ? <InfoPopper {...item.infoPopper} /> : null}
                                {extraParamsMapping?.[item.name] ? (
                                    <Typography variant="body1" className={classes.helperText}>
                                        {typeof extraParamsMapping?.[item.name] === 'object'
                                            ? extraParamsMapping?.[item.name]?.info
                                            : extraParamsMapping?.[item.name]}
                                        &nbsp;&nbsp;
                                        <InfoOutlinedIcon color="inherit" />
                                    </Typography>
                                ) : null}
                            </>
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
};

const isValidImageUrl = (url) => {
    const imgRegex = /\.(jpeg|jpg|gif|png|svg)$/;
    return imgRegex.test(url);
};

const FieldComponent = ({
    item,
    extraParams,
    screen_id,
    app_id,
    onClickActionButton,
    onModalFormAction,
    onFetchFormData,
    classes,
    handleValueChange,
    onValidateValueChangeInGridTable,
    onGridTableOuterAction,
    onDrilledData,
    dynamicPayload,
    onToolBarAction,
    onFetchDetailData,
    handleWidgetEvent,
    onUpload,
    notificationOpen,
    color_nooverride
}) => {
    let { type, ...elemntProps } = item;
    if (typeof extraParams === 'object') {
        let { ..._extraParams } = extraParams;
        elemntProps = { ...elemntProps, ..._extraParams };
    }

    switch (type) {
        case 'slider':
            return (
                <CustomSliderInput
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    {...elemntProps}
                ></CustomSliderInput>
            );
        case 'text':
            return (
                <TextInput
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'number':
            return (
                <NumberInput
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'select':
            return (
                <SimpleSelect
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps, false);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'datepicker':
            return (
                <DatePicker
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'datetimepicker':
            return (
                <DateTimePicker
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'upload':
            return (
                <FileUpload
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    handleWidgetEvent={handleWidgetEvent}
                    fieldInfo={elemntProps}
                    app_id={app_id}
                    notificationOpen={notificationOpen}
                />
            );
        case 'upload2':
            return (
                <FileUpload2
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'gridTable':
        case 'tabularForm':
            return (
                <GridTable
                    onRowDataChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    onColdefChange={(v) => {
                        item.coldefValue = v;
                        handleValueChange(elemntProps);
                    }}
                    params={{
                        rowData: elemntProps.value,
                        coldef: elemntProps.coldefValue,
                        ...elemntProps.tableprops
                    }}
                    validateValueChange={onValidateValueChangeInGridTable}
                    onOuterAction={onGridTableOuterAction}
                    dynamicPayload={dynamicPayload}
                />
            );
        case 'checkboxGroup':
            return (
                <CheckboxesGroup
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    params={elemntProps}
                />
            );
        case 'checkbox':
            return (
                <CustomCheckbox
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    params={elemntProps}
                />
            );
        case 'switch':
            return (
                <CustomSwitch
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    params={elemntProps}
                />
            );
        case 'radioGroup':
            return (
                <RadioButtonsGroup
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    params={elemntProps}
                />
            );
        case 'label':
            return <CustomLabel fieldInfo={item} />;
        case 'label2':
            return (
                <TextList
                    params={elemntProps?.value}
                    action_type={elemntProps?.actionType}
                    screen_id={screen_id}
                    app_id={app_id}
                />
            );
        case 'downloadLink':
            return (
                <DownloadLink
                    params={{ text: elemntProps.label, url: elemntProps.value, ...elemntProps }}
                    action_type={elemntProps?.actionType}
                    screen_id={screen_id}
                    app_id={app_id}
                />
            );
        case 'autosuggest':
            return (
                <AutoSuggest
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    fieldInfo={elemntProps}
                />
            );
        case 'actionButtons':
            return (
                <ActionButtons
                    params={elemntProps?.value}
                    onClick={onClickActionButton}
                    align={elemntProps?.align}
                />
            );
        case 'downloadWorkbook':
            return (
                <DownloadWorkBook
                    {...elemntProps}
                    tableData={elemntProps?.value?.tableData}
                    filename={elemntProps?.value?.filename}
                />
            );
        case 'assumption':
            return <AppWidgetAssumptions large={true} params={elemntProps?.value} />;
        case 'widget':
            return (
                <Widget
                    data={elemntProps.value}
                    onDrilledData={onDrilledData}
                    onFetchDetailData={onFetchDetailData}
                    color_nooverride={color_nooverride}
                    titlePosition={elemntProps?.titlePosition}
                    notFromAppWidgetGraph
                />
            );
        case 'modalForm':
            return (
                <DynamicFormModal
                    params={elemntProps.modalForm}
                    onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                    onAction={async (actionType, data) => {
                        item.value = data;
                        handleValueChange(elemntProps);
                        return await onModalFormAction(actionType);
                    }}
                    onFetchFormData={onFetchFormData}
                />
            );
        case 'blank':
            return null;
        case 'hr':
            return <hr className={classes.hr} />;
        case 'daterange':
            return (
                <DateRangeSelect
                    onChangeFilter={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    value={elemntProps?.value}
                    params={elemntProps?.dateRangeParams}
                />
            );
        case 'image':
            return <CustomImage params={elemntProps} />;
        case 'legend':
            return <CustomLegends legends={elemntProps.value} />;
        case 'carousel':
            return (
                <CodxCarouselView
                    params={elemntProps.carouselProps}
                    onEventTrigger={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    onIntialEventTrigger={(v) => {
                        item.value = v;
                    }}
                />
            );
        case 'ToolBar':
            return (
                <ToolBar
                    props={{ ...elemntProps?.value, classes: null }}
                    onAction={async (elementId, value, optionName) => {
                        return await onToolBarAction(elementId, value, optionName);
                    }}
                />
            );
        case 'icon':
            return (
                <div
                    className={classes.iconWrapper}
                    style={{
                        justifyContent: item?.position || undefined,
                        height: item?.size || undefined
                    }}
                >
                    {Boolean(item?.iconUrl) && (
                        <img
                            src={
                                isValidImageUrl(sanitizeHtml(item?.iconUrl || ''))
                                    ? sanitizeHtml(item.iconUrl)
                                    : ''
                            }
                            className={classes.iconStyles}
                            alt={item?.text}
                            style={{
                                width: item?.size || undefined,
                                height: item?.size || undefined
                            }}
                        />
                    )}
                    {Boolean(item?.text) && (
                        <CustomLabel fieldInfo={{ ...item, value: item?.text || '' }} />
                    )}
                </div>
            );
        case 'markdown':
            return <AppSystemWidgetInfo dataProps={elemntProps} isDialog={false} />;
        case 'customTypography':
            return <CustomTypography params={item.content} />;
        case 'appScreenNavigate':
            return <AppScreenNavigate params={elemntProps} />;
        case 'mobileUpload':
            return (
                <MobileUpload
                    params={elemntProps}
                    screen_id={screen_id}
                    app_id={app_id}
                    onChange={(v) => {
                        item.value = v;
                        handleValueChange(elemntProps);
                    }}
                    onUpload={async (action) => {
                        return await onUpload(action);
                    }}
                    onFetchFormData={onFetchFormData}
                />
            );

        case 'dataBar':
            return (
                <>
                    {elemntProps?.value?.length ? (
                        <div style={elemntProps?.containerStyle}>
                            {elemntProps?.value?.map((val, index) => (
                                <Databar
                                    key={`bar-${index}-value-${val.value}`}
                                    value={val?.value}
                                    color={val?.color}
                                    textColor={val?.textColor}
                                    dataBarType={val?.dataBarType}
                                    padding={val?.padding}
                                    maxPercentValue={val}
                                />
                            ))}
                        </div>
                    ) : (
                        <Databar
                            value={elemntProps?.value?.value}
                            color={elemntProps?.value?.color}
                            textColor={elemntProps?.value?.textColor}
                            dataBarType={elemntProps?.value?.dataBarType}
                            padding={elemntProps?.value?.padding}
                            maxPercentValue={elemntProps?.value}
                            textVariant={elemntProps?.value?.textVariant}
                            size={elemntProps?.value?.size}
                        />
                    )}
                </>
            );
        case 'nav_types':
            return (
                <NavSelection
                    item={item}
                    handleValueChange={handleValueChange}
                    elemntProps={elemntProps}
                ></NavSelection>
            );
        case 'customCard':
            return (
                <CustomCard
                    params={item}
                    elemntProps={elemntProps}
                    onValidateValueChangeInGridTable={onValidateValueChangeInGridTable}
                    handleValueChange={handleValueChange}
                    onModalFormAction={onModalFormAction}
                    item={item}
                    onFetchFormData={onFetchFormData}
                    onDynamicFormAction={async (actionType, data) => {
                        item.value = data;
                        handleValueChange(elemntProps);
                        return await onModalFormAction(actionType);
                    }}
                />
            );
        default:
            return <div className={classes.inputComponentError}>Input Component Not found</div>;
    }
};
