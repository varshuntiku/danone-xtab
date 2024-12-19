import React, { useCallback, useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SearchBar from '../components/CustomSearchComponent/SearchComponent';
import DynamicForm from '../components/dynamic-form/dynamic-form';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import CustomSnackbar from 'components/CustomSnackbar.jsx';
import { triggerWidgetActionHandler } from 'services/widget.js';
import { GraphInfo } from './graphInfo/GraphInfo';
import { Box } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily
    },
    body: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        backgroundColor: 'tranparent',
        fontFamily: theme.body.B5.fontFamily
    }
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        backgroundColor: 'transparent'
    }
}))(TableRow);

const useStylesCustomSelect = makeStyles((theme) => ({
    formControl: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        '& .MuiSelect-select:focus': {
            backgroundColor: 'transparent',
            borderBottom: 'none'
        },
        '& .MuiSelect-iconOpen': {
            fill: theme.palette.background.infoBgDark
        },
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: 'none'
            },
            '&:after': {
                borderBottom: 'none'
            },
            '&:hover:not($disabled):before': {
                borderBottom: 'none'
            }
        }
    },
    input: {
        '& input': {
            color: theme.palette.text.default,
            fontSize: '1.5rem'
        },
        '&:before': {
            borderColor: `${theme.palette.text.default} !important`
        }
    },
    selectEmpty: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        borderBottom: 'none',
        '& svg': {
            fontSize: '3rem'
        }
    },
    menuItem: {
        color: theme.palette.text.default,
        fontSize: '1.5rem',
        fontFamily: theme.body.B5.fontFamily,
        backgroundColor: theme.palette.background.pureWhite,
        '&:hover': {
            backgroundColor: theme.palette.background.menuItemHover
        }
    },
    selected: {
        backgroundColor: `${theme.palette.background.menuItemFocus} !important`,
        color: theme.palette.text.default,
        fontWeight: 400
    },
    icon: {
        fill: theme.palette.text.default,
        transform: 'scale(2.3)'
    },
    radioText: {
        fontSize: '1.3rem'
    }
}));

const useStyles = makeStyles((theme) => ({
    tableContainerGrid: {
        padding: theme.spacing(1, 0)
    },
    tableContainer: {
        maxHeight: '33vh',
        height: '100%'
    },
    actionButtons: {
        float: 'right',
        padding: theme.spacing(1, 0)
    },
    button: {
        margin: theme.spacing(0, 1, 0, 1)
    },
    downloadSheet: {
        margin: theme.spacing(1, 0, 1, 3)
    },
    hiddenElement: {
        display: 'none'
    },
    displayedElement: {
        display: 'block'
    },
    simulatorSectionHeader: {
        color: theme.palette.text.default,
        fontSize: '2rem',
        fontWeight: 400,
        padding: theme.spacing(2, 0)
    },
    floatingDiv: {
        zIndex: 10
    },
    fullMainTable: {
        maxHeight: '65vh'
    },
    searchContianer: {
        marginTop: '1rem',
        width: theme.layoutSpacing(472)
    }
}));

const dynamicFormStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content'
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120
    },
    formControlLabel: {
        marginTop: theme.spacing(1)
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        '& .MuiTypography-caption': {
            fontSize: '1.75rem'
        }
    },
    title: {
        fontSize: theme.spacing(3.5),
        letterSpacing: '1.5px',
        color: theme.palette.text.titleText,
        opacity: '0.8'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    button: {
        borderRadius: theme.spacing(1.875),
        fontSize: theme.spacing(2.5),
        lineHeight: theme.spacing(2),
        textTransform: 'none',
        fontWeight: '500'
    }
}));

const DialogTitle = (props) => {
    const classes = dynamicFormStyles();
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6" className={classes.title}>
                {children}
            </Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};
/**
 * Simulates a dynamic table by plotting it as a graph
 * @summary Takes the dynamic inputs from the table data and visualises the data as a graph to compare the changes for given SKUs
 * It is used whenever we want to simulate the graphical result based on the SKUs that we change in the table
 * JSON Structure-
 * {
 *   "aux_table": {},
 *   "is_table_simulator": <boolean>,
 *   "main_table": {},
 *   "simulator_options": {},
 *   "form_info": {
 *     "title": <Enter New SKU Details>,
 *     "open_button_name": <button name>,
 *     "dialog_actions": [
 *       {
 *         "is_cancel": <boolean>,
 *         "text": <action name>
 *       }
 *     ],
 *     "form_config": {
 *       "title": <form title>,
 *       "fields": [
 *         {
 *           "id": <field id>,
 *           "name": <field name>,
 *           "label": <field label>,
 *           "type": <field type>,
 *           "value": <field value,
 *           "variant": <field variant>,
 *           "options": [ <field options, can be NPD or NCD>
 *           ],
 *           "margin": <margin value>,
 *           "fullWidth": <boolean>,
 *           "inputprops": {
 *             "type": <type of input>
 *           },
 *           "placeholder": <Enter your Input>,
 *           "grid": <grid value>
 *         }
 *       ]
 *     }
 *   },
 *   "graph_info": {
 *     "grid_config": <grid configuration value>,
 *     "graph_list": <list of graphs>
 *   }
 * }
 * @param {object} props - params
 */
export default function AppWidgetTableSimulator({ params, ...props }) {
    const classes = useStyles();
    const formClasses = dynamicFormStyles();
    const [tableData, setTableData] = useState(params);
    // const [tableData, setTableData] = useState({...params, form_info: FormInfo.form_info});
    const [formData, setformData] = useState({});
    const [temp, settemp] = useState(0);
    const [search, setSearch] = useState('');
    const [formDialogOpen, setformDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false });

    useEffect(() => {
        // TODO
    }, [tableData]);

    const changefunc = () => {
        let rowsToChange = tableData.aux_table.rows;
        for (let row = 0; row < rowsToChange.length; row++) {
            for (let cell = 0; cell < rowsToChange[row].length; cell++) {
                if (rowsToChange[row][cell]['update']) {
                    if (!isNaN(rowsToChange[row][cell]['value'])) {
                        rowsToChange[row][cell]['value'] = Math.floor(Math.random() * 100 + 1);
                    }
                    if (rowsToChange[row][cell]['formatted']) {
                        rowsToChange[row][cell]['value'] = Math.floor(Math.random() * 10000 + 1000);
                    }
                } else continue;
            }
        }
        tableData.aux_table.rows = rowsToChange;
        setTableData(tableData);
        settemp(temp + 1);
    };

    const resetfunc = () => {
        window.location.reload();
    };

    const downloadfunc = () => {
        window.location.href = `${
            import.meta.env['REACT_APP_STATIC_DATA_ASSET']
        }/rgm-data/TableSimulator_Scenario.xlsx`;
    };

    const uploadfunc = () => {
        let inpbutton = document.getElementById('contained-button-file');
        inpbutton.click();
    };

    const submitfunc = () => {
        alert('Submitted!');
    };

    const navigateTofunc = (link) => {
        props.parent_obj.props.parent_obj.props.history.push(link);
    };

    const handleRowValueChange = useCallback(() => {
        setTableData((v) => ({ ...v }));
    }, []);

    const handleActionInvoke = (action_type, formData, successMessage) => {
        setformDialogOpen(false);
        triggerWidgetActionHandler({
            screen_id: props.parent_obj.props.screen_id,
            app_id: props.parent_obj.props.app_id,
            payload: {
                widget_value_id: props.parent_obj.props.data.data.widget_value_id,
                action_type,
                data: tableData,
                formData: formData,
                filters: JSON.parse(
                    sessionStorage.getItem(
                        'app_screen_filter_info_' +
                            props.parent_obj.props.app_id +
                            '_' +
                            props.parent_obj.props.screen_id
                    )
                )
            },
            callback: (d) => {
                setSnackbar({ open: true, severity: 'success', message: successMessage });
                setTableData((v) => ({
                    ...v,
                    ...d
                }));
            }
        });
    };

    const handleFormButtonAction = (button) => {
        if (button.is_cancel) {
            setformDialogOpen(false);
        } else {
            const d = Object.assign(
                {},
                // eslint-disable-next-line no-unsafe-optional-chaining
                ...formData?.fields?.map((el) => ({ [el?.name]: el?.value }))
            );
            // props.parent_obj.handleActionInvoke();
            handleActionInvoke(button.name, d, 'SKU added successfully!');
        }
    };

    const handleActionIconClick = useCallback((action_type, data) => {
        handleActionInvoke(action_type, data, 'SKU removed successfully');
    }, []);

    const handleFormDialogClose = () => {
        setformDialogOpen(false);
    };
    const handleFormDialogOpen = () => {
        setformDialogOpen(true);
    };

    return (
        <React.Fragment>
            <CustomSnackbar
                message={snackbar.message}
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={setSnackbar.bind(null, { ...snackbar, open: false })}
                severity={snackbar.severity}
            />
            <Grid container direction="row">
                <Grid item xs={4}>
                    <div className={classes.hiddenElement}>
                        <input id="contained-button-file" type="file" />
                    </div>
                </Grid>
                <Grid container item xs={8} justifyContent="flex-end">
                    {!tableData.suppress_search && (
                        <Box className={classes.searchContianer}>
                            <SearchBar
                                placeholder={'Search Here!?'}
                                onChangeWithDebounce={setSearch}
                            />
                        </Box>
                    )}
                </Grid>
                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* <CutomButtonGeneration
                        action_buttons={tableData.aux_table.buttons}
                        classes={classes}
                        changefunc={changefunc}
                        resetfunc={resetfunc}
                        submitfunc={submitfunc}
                        uploadfunc={uploadfunc}
                        downloadfunc={downloadfunc}
                        actionfunc={handleActionInvoke}
                    /> */}
                    {/*
                    Here is the code for Table Simulator Form Popup Option
                    */}
                    {tableData.form_info && (
                        <React.Fragment>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={handleFormDialogOpen}
                                className={classes.button}
                                aria-label={tableData?.form_info?.trigger_button?.text}
                            >
                                {tableData?.form_info?.trigger_button?.text}
                            </Button>
                            <Dialog
                                className={formClasses.dialogWrapper}
                                fullWidth={true}
                                maxWidth={'md'}
                                open={formDialogOpen}
                                onClose={handleFormDialogClose}
                                aria-labelledby="max-width-dialog-title"
                                aria-describedby="widget-table-simulator-content"
                            >
                                <DialogTitle
                                    id="max-width-dialog-title"
                                    onClose={handleFormDialogClose}
                                >
                                    {tableData?.form_info?.dialog?.title}
                                </DialogTitle>
                                <DialogContent id="widget-table-simulator-content">
                                    <DynamicForm
                                        onChange={setformData}
                                        params={tableData?.form_info?.form_config}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    {tableData.form_info.dialog_actions?.map((el, i) => (
                                        <Button
                                            key={'dialog_actions' + i}
                                            onClick={handleFormButtonAction.bind(null, el)}
                                            variant={el.variant || 'outlined'}
                                            size="large"
                                            className={formClasses.button}
                                            aria-label={el.text || 'Click'}
                                        >
                                            {el.text || 'Click'}
                                        </Button>
                                    ))}
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    )}
                </Grid>
                <Grid
                    item
                    xs={12}
                    className={clsx(
                        classes.tableContainerGrid,
                        !(tableData.aux_table || tableData.graph_info) && classes.fullMainTable
                    )}
                >
                    <TableContainer
                        component={Paper}
                        className={clsx(
                            classes.tableContainer,
                            !(tableData.aux_table || tableData.graph_info) && classes.fullMainTable
                        )}
                    >
                        <Table stickyHeader aria-label="Main Table">
                            {tableData.main_table.name ? (
                                <caption>tableData.main_table.name</caption>
                            ) : (
                                <React.Fragment />
                            )}
                            <TableHead>
                                <TableRow>
                                    {tableData.main_table.columns.map((col_name, key) => {
                                        return (
                                            <StyledTableCell align="left" key={key}>
                                                {col_name}
                                            </StyledTableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <CustomRowGeneration
                                    onChange={handleRowValueChange}
                                    onAction={handleActionIconClick}
                                    search={search}
                                    rows={tableData.main_table.rows}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.actionButtons}>
                        <CutomButtonGeneration
                            search={search}
                            action_buttons={tableData.main_table.buttons}
                            classes={classes}
                            changefunc={changefunc}
                            resetfunc={resetfunc}
                            submitfunc={submitfunc}
                            uploadfunc={uploadfunc}
                            downloadfunc={downloadfunc}
                            actionfunc={props.parent_obj.handleActionInvoke}
                            navigatefunc={navigateTofunc}
                        />
                    </div>
                </Grid>

                {tableData.aux_table ? (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table stickyHeader aria-label="Aux Table">
                                    {tableData.main_table.name ? (
                                        <caption>tableData.aux_table.name</caption>
                                    ) : (
                                        <React.Fragment />
                                    )}
                                    <TableHead>
                                        <TableRow>
                                            {tableData.aux_table.columns.map((col_name, key) => {
                                                return (
                                                    <StyledTableCell align="left" key={key}>
                                                        {col_name}
                                                    </StyledTableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <CustomRowGeneration rows={tableData.aux_table.rows} />
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </React.Fragment>
                ) : (
                    ''
                )}

                {tableData.graph_info ? (
                    <GraphInfo
                        graphInfo={tableData.graph_info}
                        size_nooverride={true}
                        color_nooverride={true}
                    />
                ) : null}
            </Grid>
        </React.Fragment>
    );
}

const CutomButtonGeneration = ({ ...params }) => {
    const renderer = (button, key) => {
        if (button.action_flag_type) {
            return (
                <Button
                    key={key}
                    variant={button.variant}
                    className={params.classes.button}
                    onClick={() => {
                        params.actionfunc(button.action_flag_type);
                    }}
                    aria-label={button.name}
                >
                    {button.name}
                </Button>
            );
        } else {
            switch (button.action) {
                case 'change':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.changefunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'reset':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.resetfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'submit':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.submitfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'upload':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={params.uploadfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'download':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.downloadSheet}
                            onClick={params.downloadfunc}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                case 'link':
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            onClick={() => {
                                params.navigatefunc(button.link);
                            }}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
                default:
                    return (
                        <Button
                            key={key}
                            variant={button.variant}
                            className={params.classes.button}
                            aria-label={button.name}
                        >
                            {button.name}
                        </Button>
                    );
            }
        }
    };

    return (
        <React.Fragment>
            {params.action_buttons
                ? params.action_buttons.map((button, key) => {
                      return <React.Fragment key={key}>{renderer(button, key)}</React.Fragment>;
                  })
                : ''}
        </React.Fragment>
    );
};

const CustomRowGeneration = ({ search = null, onChange, onAction, ...params }) => {
    const [rows, setRows] = useState(params.rows);
    // () => {
    //     let {rows} = params || {}

    //     if (search) {
    //         rows = rows.filter(row => row.map(el => typeof el === "object" ? el.value : el).join(" ").toLowerCase().includes(search.toLowerCase()))
    //     }
    //     return rows;
    // });

    useEffect(() => {
        let { rows } = params || {};

        if (search) {
            rows = rows.filter((row) =>
                row
                    .map((el) => (typeof el === 'object' ? el.value : el))
                    .join(' ')
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        setRows(rows);
    }, [search]);

    const formatValue = (cell) => {
        const prefix = cell.prefix === undefined || cell.prefix === null ? '' : cell.prefix;
        const suffix = cell.suffix === undefined || cell.suffix === null ? '' : cell.suffix;
        if (cell.formatted) return prefix + parseFloat(cell.value).toLocaleString() + suffix;
        else return prefix + cell.value + suffix;
    };

    const handleChange = useCallback(
        (rowIndex, cellIndex, value) => {
            rows[rowIndex][cellIndex].value = value;
            onChange(rowIndex, cellIndex, value);
        },
        [rows, onChange]
    );

    const handleActionIconClick = useCallback((action_flag_type, row_key, row) => {
        onAction(action_flag_type, { row_key, row });
    }, []);

    const renderer = (cell, cell_key, row_key, row) => {
        switch (cell.indicator) {
            case 'input':
                return (
                    <TextEditor
                        onChange={handleChange.bind(null, row_key, cell_key)}
                        value={cell.value}
                    />
                );
            case 'dropdown':
                return (
                    <CustomSelectList
                        onChange={handleChange.bind(null, row_key, cell_key)}
                        value={cell.value}
                        menu_options={cell.select_values}
                        cell_key={cell_key}
                        row_key={row_key}
                    />
                );
            case 'action-icon':
                return (
                    <CellActionIcon
                        onClick={handleActionIconClick.bind(
                            null,
                            cell.action_flag_type,
                            row_key,
                            row
                        )}
                        type={cell.type}
                        color={cell.icon_color}
                        action_type={cell.action_flag_type}
                        cell_key={cell_key}
                        row_key={row_key}
                    />
                );
            case 'up':
                return <span style={{ color: '#4CAF56' }}>{formatValue(cell)}</span>;

            case 'down':
                return <span style={{ color: '#D91E18' }}>{formatValue(cell)}</span>;
            case 'neutral':
                return <span style={{ color: '#FF9800' }}>{formatValue(cell)}</span>;

            default:
                return formatValue(cell);
        }
    };

    return (
        <React.Fragment>
            {rows
                ? rows.map((row, row_key) => {
                      return (
                          <StyledTableRow key={row_key}>
                              {row.map((cell, cell_key) => {
                                  return (
                                      <StyledTableCell key={cell_key}>
                                          {/* cell.indicator & cell.alt_behaviour will setup the text color */}
                                          {renderer(cell, cell_key, row_key, row)}
                                      </StyledTableCell>
                                  );
                              })}
                          </StyledTableRow>
                      );
                  })
                : ''}
        </React.Fragment>
    );
};

function CustomSelectList({ onChange, ...props }) {
    const classes = useStylesCustomSelect();
    // const [value, setValue] = React.useState(props.value || "");

    const handleChange = (event) => {
        const v = event.target.value;
        // setValue(v);
        onChange(v);
    };
    return (
        <React.Fragment>
            <FormControl fullWidth className={classes.formControl}>
                <Select
                    value={props.value}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'center'
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'center'
                        },
                        getContentAnchorEl: null
                    }}
                >
                    {props.menu_options.map((option, key) => {
                        return (
                            <MenuItem
                                value={option}
                                classes={{ root: classes.menuItem, selected: classes.selected }}
                                key={key}
                            >
                                {option}
                            </MenuItem>
                        );
                    })}
                </Select>
                {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
        </React.Fragment>
    );
}

function TextEditor({ onChange, ...props }) {
    const classes = useStylesCustomSelect();
    const [value, setValue] = React.useState(props.value || '');

    useEffect(() => {
        setValue(props.value);
    }, [props]);

    const handleChange = (event) => {
        const v = event.target.value;
        setValue(v);
        onChange(v);
    };
    return (
        <React.Fragment>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    value={value}
                    onChange={handleChange}
                    displayEmpty
                    InputProps={{
                        className: classes.input
                    }}
                    inputProps={{
                        'aria-label': 'Without label'
                    }}
                    id="app widget text"
                />
            </FormControl>
        </React.Fragment>
    );
}

function CellActionIcon({ onClick, ...props }) {
    // const row_key = props.row_key;
    // const cell_key = props.cell_key;
    const handleOnClick = (type) => {
        onClick(type);
    };

    const renderer = (color, action_type, type) => {
        switch (type) {
            case 'tick':
                return (
                    <IconButton
                        title="tick"
                        onClick={handleOnClick.bind(null, type)}
                        aria-label="Tick"
                        size="large"
                    >
                        <DoneIcon style={{ color: color }} fontSize="inherit" />
                    </IconButton>
                );
            case 'delete':
                return (
                    <IconButton
                        title="delete"
                        onClick={handleOnClick.bind(null, type)}
                        aria-label="delete"
                        size="large"
                    >
                        <DeleteIcon style={{ color: color }} fontSize="inherit" />
                    </IconButton>
                );
            case 'cancel':
                return (
                    <IconButton
                        title="cancel"
                        onClick={handleOnClick.bind(null, type)}
                        aria-label="cancel"
                        size="large"
                    >
                        <CancelIcon style={{ color: color }} fontSize="inherit" />
                    </IconButton>
                );
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            {renderer(
                props.icon_color,
                props.action_type,
                props.type,
                props.cell_key,
                props.row_key
            )}
        </React.Fragment>
    );
}
