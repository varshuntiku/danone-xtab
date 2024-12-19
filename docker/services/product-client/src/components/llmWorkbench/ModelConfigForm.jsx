import React from 'react';
import {
    Box,
    Input,
    MenuItem,
    Slider,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
    makeStyles,
    withStyles
} from '@material-ui/core';
import Typography from 'components/elements/typography/typography';
import InfoIcon from '@material-ui/icons/Info';
import CodxCircularLoader from 'components/CodxCircularLoader';
import configureModelStyle from 'assets/jss/llmWorkbench/configureModelStyle';

const useStyles = makeStyles(configureModelStyle);

const getElementByDisplayName = (children, displayName) =>
    React.Children.map(children, (child) =>
        child.type.displayName === displayName ? child : null
    );

export const StyledTableCell = withStyles((theme) => ({
    root: {
        textAlign: 'justify',
        color: theme.palette.text.default,
        fontSize: theme.spacing(1.5),
        border: 'none',
        padding: theme.spacing(2) + ' ' + theme.spacing(4),
        wordBreak: 'break-word',
        width: '50%'
    }
}))(TableCell);

export const AdvancedField = ({
    id,
    type,
    disabled = false,
    onChange = () => {},
    value,
    defaultValue = '',
    required,
    error = {},
    ...props
}) => {
    const classes = useStyles();
    switch (type) {
        case 'toggle': {
            return (
                <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center" gridGap="0.5rem">
                        <Typography variant="h4" className={classes.label}>
                            {props.label}
                            {required && '*'}
                            {'   '}
                            <Tooltip
                                placement="FollowCursor"
                                title={<Typography variant="h4">{props.info}</Typography>}
                            >
                                <InfoIcon />
                            </Tooltip>
                            {'   '}
                        </Typography>
                        <Switch
                            checked={value || false}
                            onChange={(e) => onChange(id, e.target.checked)}
                            disabled={disabled}
                            defaultValue={defaultValue}
                        />
                    </Box>
                    {error[id] && <span className={classes.error}>{error[id]}</span>}
                </Box>
            );
        }
        case 'select': {
            const { options } = props;
            return (
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Typography variant="h4" className={classes.label}>
                        {props.label}
                        {required && '*'}
                        {'   '}
                        <Tooltip
                            placement="FollowCursor"
                            title={<Typography variant="h4">{props.info}</Typography>}
                        >
                            <InfoIcon />
                        </Tooltip>
                    </Typography>
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        onChange={({ target: { value } }) =>
                            onChange(id, value === 'no-value' ? null : value)
                        }
                        InputProps={{
                            classes: {
                                underline: classes.underline,
                                input: classes.input
                            }
                        }}
                        disabled={disabled}
                        value={value || 'no-value'}
                        defaultValue={defaultValue}
                    >
                        {!required && <MenuItem value="no-value">None</MenuItem>}
                        {options.map((option) => (
                            <MenuItem key={option.id} value={option.title}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            );
        }
        case 'slider': {
            const { min, max, step } = props;
            return (
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Typography variant="h4">
                        {props.label}
                        {required && '*'}
                        {'   '}
                        <Tooltip
                            placement="FollowCursor"
                            title={<Typography variant="h4">{props.info}</Typography>}
                        >
                            <InfoIcon />
                        </Tooltip>
                        {'   '}
                        {error[id] && <span className={classes.error}>{error[id]}</span>}
                    </Typography>
                    <Box display="flex" gridGap="2rem">
                        <Slider
                            className={classes.simulatorSliderInput}
                            classes={{
                                root: classes.sliderRoot,
                                markLabel: classes.markLabel,
                                thumb: classes.thumb
                            }}
                            valueLabelDisplay="auto"
                            step={step}
                            min={min}
                            max={max}
                            defaultValue={defaultValue}
                            value={isNaN(value) ? 0 : value}
                            onChange={(_, v) => onChange(id, v)}
                        />
                        <Input
                            onChange={(e) => onChange(id, e.target.value)}
                            value={isNaN(value) ? 0 : value}
                        />
                    </Box>
                </Box>
            );
        }
        case 'text':
        default: {
            return (
                <Box display="flex" flexDirection="column" gridGap="0.5rem">
                    <Typography variant="h4">
                        {props.label}
                        {required && '*'}
                        {'   '}
                        <Tooltip
                            placement="FollowCursor"
                            title={<Typography variant="h4">{props.info}</Typography>}
                        >
                            <InfoIcon />
                        </Tooltip>
                        {'   '}
                        {error[id] && <span className={classes.error}>{error[id]}</span>}
                    </Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        onChange={(e) => onChange(id, e.target.value)}
                        InputProps={{
                            classes: {
                                underline: classes.underline,
                                input: classes.input
                            }
                        }}
                        disabled={disabled}
                        defaultValue={defaultValue}
                        value={value || ''}
                    />
                </Box>
            );
        }
    }
};

const ModelConfigForm = ({ isLoading, children }) => {
    const formHeader = getElementByDisplayName(children, 'FormHeader');
    const formConfig = getElementByDisplayName(children, 'FormConfig');
    const formAdvancedConfig = getElementByDisplayName(children, 'FormAdvancedConfig');
    const formAction = getElementByDisplayName(children, 'FormAction');
    const formVMConfig = getElementByDisplayName(children, 'FormVMConfig');
    const classes = useStyles();
    return (
        <Box
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            className={classes.wrapper}
        >
            <Box display="flex" flexDirection="column" gridGap="2rem">
                {formHeader}
                <Box
                    padding="2rem"
                    minWidth="40rem"
                    display="flex"
                    gridGap="2rem"
                    className={classes.configure}
                >
                    {isLoading ? (
                        <CodxCircularLoader size={40} />
                    ) : (
                        <>
                            {formConfig}
                            {formAdvancedConfig}
                            {formVMConfig}
                        </>
                    )}
                </Box>
                {!isLoading && formAction}
            </Box>
        </Box>
    );
};

const FormHeader = ({ children }) => {
    const classes = useStyles();
    return (
        <Typography variant="h1" style={{ textAlign: 'left' }} className={classes.formHeader}>
            {children}
        </Typography>
    );
};
FormHeader.displayName = 'FormHeader';
ModelConfigForm.FormHeader = FormHeader;

const FormConfig = ({ children }) => {
    return (
        <Box width="40rem" display="flex" gridGap="1.2rem" flexDirection="column">
            {children}
        </Box>
    );
};
FormConfig.displayName = 'FormConfig';
ModelConfigForm.FormConfig = FormConfig;

const FormAdvancedConfig = ({
    options = [],
    onChange = () => {},
    disabled = false,
    show = false,
    values = {},
    error = {}
}) => {
    const classes = useStyles();
    return (
        <Box
            className={classes.advancedConfig}
            display={options.length && show ? 'flex' : 'none'}
            flexDirection="column"
            gridGap="2rem"
            width="40rem"
        >
            <Typography variant="h3" className={classes.label}>
                Advanced options
            </Typography>
            <Box display="flex" flexDirection="column" gridGap="2rem">
                {options.map((option) => (
                    <AdvancedField
                        value={values[option.id]}
                        key={option.label}
                        onChange={onChange}
                        disabled={disabled}
                        error={error}
                        {...option}
                    />
                ))}
            </Box>
        </Box>
    );
};
FormAdvancedConfig.displayName = 'FormAdvancedConfig';
ModelConfigForm.FormAdvancedConfig = FormAdvancedConfig;

const FormVMConfig = ({
    options = [],
    onChange = () => {},
    // disabled = false,
    show = false,
    value = null
}) => {
    const classes = useStyles();
    const selected = options.find((option) => option.id === value);
    return (
        <Box
            className={classes.advancedConfig}
            display={show ? 'flex' : 'none'}
            flexDirection="column"
            gridGap="2rem"
            width="40rem"
        >
            <Typography variant="h3" className={classes.label}>
                VM Configuration
            </Typography>
            <Box display="flex" flexDirection="column" gridGap="0.5rem">
                <Typography variant="h4">Virtual Machine *</Typography>
                <TextField
                    select
                    variant="outlined"
                    size="small"
                    className={classes.textField}
                    InputProps={{
                        classes: {
                            input: classes.input
                        }
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Box>
                <Typography variant="h3">Specifications:-</Typography>
                <Table>
                    <TableBody>
                        {selected?.specifications?.map((specification) => (
                            <TableRow key={specification.id}>
                                <StyledTableCell>{specification.label}</StyledTableCell>
                                <StyledTableCell>{specification.value}</StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};
FormVMConfig.displayName = 'FormVMConfig';
ModelConfigForm.FormVMConfig = FormVMConfig;

const FormAction = ({ children }) => {
    return (
        <Box display="flex" gridGap="2rem" alignItem="flex-start">
            {children}
        </Box>
    );
};
FormAction.displayName = 'FormAction';
ModelConfigForm.FormAction = FormAction;

export default ModelConfigForm;
