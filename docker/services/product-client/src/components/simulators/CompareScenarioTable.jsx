import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Button,
    FormControlLabel,
    Switch,
    Typography
} from '@material-ui/core';
import createPlotlyComponent from 'react-plotly.js/factory';
import { SavedScenarioContext } from '../AppScreen';
import BulbIcon from 'assets/img/bulbIcon.svg';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: '100%'
    },
    container: {
        padding: '0rem'
    },
    title: {
        textAlign: 'left',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(18),
        fontWeight: theme.title.h6.fontWeight,
        textTransform: 'Capitalize',
        fontFamily: theme.body.B1.fontFamily,
        marginBottom: '1rem'
    },
    toggleContainer: {
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectInput: {
        width: '20rem',
        fontSize: '1.6rem',
        border: `1px solid ${theme.palette.border.grey}`,
        borderBottom: 'none',
        borderRadius: '2px',
        padding: '0 1rem',
        '& .MuiSelect-icon': {
            right: '1rem'
        },
        '&:hover': {
            borderBottom: 'none'
        }
    },
    filterHolder: {
        display: 'flex',
        gap: '1rem'
    },
    plotContainer: {
        width: 'auto',
        height: '30rem'
    },
    textStyle: {
        padding: theme.spacing(2),
        textAlign: 'left',
        borderBottom: '1px solid #EDEBF0',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        fontWeight: theme.title.h1.fontWeight
    },
    textStyleHeaders: {
        padding: theme.spacing(2),
        textAlign: 'left',
        borderBottom: '1px solid #EDEBF0',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.title.h6.fontWeight,
        textTransform: 'Capitalize',
        fontFamily: theme.title.h1.fontFamily
    },
    headerButton: {
        textTransform: 'none',
        marginLeft: '1rem',
        color: `${theme.palette.text.default}95`,
        fontSize: theme.layoutSpacing(16)
    },
    highlightCheckbox: {
        marginLeft: '1rem'
    },
    formControlLabel: {
        textAlign: 'left',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.title.h6.fontWeight,
        textTransform: 'Capitalize',
        fontFamily: theme.body.B1.fontFamily
    },
    highlightedRow: {
        backgroundColor: theme.palette.background.markdownHighlight
    },
    tableHeaderCell: {
        backgroundColor: theme.palette.background.tableHeader,
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontFamily: theme.title.h1.fontFamily,
        cursor: 'pointer',
        textAlign: 'left',
        padding: theme.layoutSpacing(16),
        lineHeight: theme.layoutSpacing(21),
        letterSpacing: theme.layoutSpacing(0.5),
        textTransform: 'Capitalize'
    },
    menuItem: {
        padding: '1rem 1rem',
        '&:hover': {
            backgroundColor: `${theme.palette.background.wizardBackground}60`
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.wizardBackground}60`
        },
        '&.Mui-selected': {
            backgroundColor: `${theme.palette.background.wizardBackground}`,
            '&:hover': {
                backgroundColor: `${theme.palette.background.wizardBackground}80`
            }
        }
    },
    plot: {
        width: '100%',
        height: '100%'
    },
    bulbIconNeutral: {
        minHeight: '2rem',
        minWidth: '2rem',
        color: theme.palette.text.default
    },
    headerIconHolder: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
    },
    textHeaders: {
        textAlign: 'left',
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(16),
        fontWeight: theme.title.h6.fontWeight,
        textTransform: 'Capitalize',
        fontFamily: theme.title.h1.fontFamily
    },
    filterName: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(14),
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h6.fontWeight
    },
    filterComment: {
        color: theme.palette.text.default,
        fontSize: theme.layoutSpacing(12),
        fontFamily: theme.body.B1.fontFamily,
        fontWeight: theme.title.h1.fontWeight
    }
}));

const CompareScenarioTable = ({
    data,
    getScenarios,
    savedScenarios,
    locationProps,
    handleCompareDataFilterTrigger
}) => {
    const classes = useStyles();
    const { openPopup } = useContext(SavedScenarioContext);
    const Plot = createPlotlyComponent(window.Plotly);
    const [selectedScenarios, setSelectedScenarios] = useState(
        data.scenarios.map((scenario) => scenario.name)
    );
    const [highlightDifference, setHighlightDifference] = useState(false);
    const [optimizedScenario, setOptimizedScenario] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState([]);
    const [selectedScenarioDetails, setSelectedScenarioDetails] = useState({});
    const [selectedFilters, setSelectedFilters] = useState([]);

    // Track data readiness for Plotly
    const [plotReady, setPlotReady] = useState(false);

    useEffect(() => {
        getScenarios();
        if (locationProps?.props?.location?.state?.data) {
            setSelectedFilters(locationProps.props.location.state.data);
            setSelectedScenarios(locationProps.props.location.state.data);
        }
    }, []);

    useEffect(() => {
        if (selectedFilters.length > 0 && savedScenarios.length > 0) {
            const filteredScenarios = savedScenarios.filter((scenario) =>
                selectedFilters.includes(scenario.name)
            );
            handleCompareDataFilterTrigger({
                selected_filter: selectedFilters,
                scenarios: filteredScenarios
            });
        }
    }, [selectedFilters, savedScenarios]);

    useEffect(() => {
        if (savedScenarios.length && optimizedScenario.length === 0) {
            const optimizedScenarioData = savedScenarios.find(
                (scenario) => scenario.name === 'Optimized Scenario'
            );
            if (optimizedScenarioData) {
                setOptimizedScenario(optimizedScenarioData?.scenarios_json?.sections);
            }
        }
    }, [savedScenarios]);

    useEffect(() => {
        if (selectedScenario.length > 0) {
            openPopup({
                compare_scenario: optimizedScenario,
                present_scenario: selectedScenario,
                table_header: selectedScenarioDetails?.name,
                table_description: selectedScenarioDetails?.description
            });
        }
    }, [selectedScenarioDetails?.name]);

    // Handle when scenario changes
    const handleScenarioChange = useCallback(
        (index, newScenarioName) => {
            const updatedScenarios = [...selectedScenarios];
            updatedScenarios[index] = newScenarioName;
            setSelectedScenarios(updatedScenarios);
            setSelectedFilters(updatedScenarios);
        },
        [selectedScenarios]
    );

    // Handle scenario click
    const handleClick = useCallback(
        (selectedScenario) => {
            const selectedScenarioData = savedScenarios.find(
                (scenario) => scenario.name === selectedScenario
            );
            if (selectedScenarioData) {
                setSelectedScenario(selectedScenarioData?.scenarios_json?.sections);
                setSelectedScenarioDetails({
                    name: selectedScenarioData?.name,
                    description: selectedScenarioData?.comment
                });
            }
        },
        [savedScenarios]
    );

    // Memoize scenario keys and headers
    const scenarioKeys =
        data.scenarios.length > 0 ? useMemo(() => Object.keys(data.scenarios[0]), [data]) : [];
    const tableHeaders = useMemo(
        () =>
            scenarioKeys.filter(
                (key) => key !== 'name' && key !== 'plot_data' && key !== 'plot_layout'
            ),
        [scenarioKeys]
    );

    // Check if values are different between scenarios
    const areValuesDifferent = useCallback(
        (header) => {
            const values = selectedScenarios.map((selectedScenario) => {
                const scenario = data.scenarios.find((s) => s.name === selectedScenario);
                return scenario[header];
            });
            return new Set(values).size !== 1;
        },
        [selectedScenarios, data]
    );

    // Ensure data readiness for Plotly
    useEffect(() => {
        const hasPlotData = selectedScenarios.every((selectedScenario) => {
            const scenario = data.scenarios.find((s) => s.name === selectedScenario);
            return scenario?.plot_data && scenario?.plot_layout;
        });
        setPlotReady(hasPlotData);
    }, [selectedScenarios, data]);

    return (
        <div className={classes.container}>
            <div className={classes.title}>Scenario Comparison Outcomes</div>
            <div className={classes.toggleContainer}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={highlightDifference}
                            onChange={(e) => setHighlightDifference(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Highlight Difference"
                    className={classes.highlightCheckbox}
                    classes={{ label: classes.formControlLabel }}
                />
            </div>
            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeaderCell}>
                                Scenario Outcomes
                            </TableCell>
                            {selectedScenarios.map((selectedScenario, index) => (
                                <TableCell key={index} className={classes.tableHeaderCell}>
                                    <div className={classes.filterHolder}>
                                        <Select
                                            value={selectedScenario}
                                            onChange={(e) =>
                                                handleScenarioChange(index, e.target.value)
                                            }
                                            className={classes.selectInput}
                                            renderValue={(selected) => {
                                                // This will render only the scenario name when dropdown is closed
                                                const selectedScenario = savedScenarios.find(
                                                    (scenario) => scenario.name === selected
                                                );
                                                return selectedScenario
                                                    ? selectedScenario.name
                                                    : '';
                                            }}
                                            MenuProps={{
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left'
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left'
                                                },
                                                getContentAnchorEl: null // Ensures the dropdown starts from the bottom
                                            }}
                                        >
                                            {savedScenarios.map((scenario, indexFilter) => (
                                                <MenuItem
                                                    key={indexFilter}
                                                    className={classes.menuItem}
                                                    value={scenario.name}
                                                >
                                                    <span className={classes.filterName}>
                                                        {scenario.name}
                                                        <br />
                                                        <p className={classes.filterComment}>
                                                            {scenario.comment}
                                                        </p>
                                                    </span>
                                                </MenuItem>
                                            ))}
                                        </Select>

                                        <Button
                                            variant="text"
                                            className={classes.headerButton}
                                            onClick={() => handleClick(selectedScenario)}
                                        >
                                            View Input
                                        </Button>
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableHeaders.map((header, rowIndex) => {
                            const shouldHighlight =
                                highlightDifference && areValuesDifferent(header);
                            return (
                                <TableRow
                                    key={rowIndex}
                                    className={shouldHighlight ? classes.highlightedRow : ''}
                                >
                                    <TableCell className={classes.textStyleHeaders}>
                                        <span className={classes.headerIconHolder}>
                                            {shouldHighlight ? (
                                                <img
                                                    src={BulbIcon}
                                                    className={classes.bulbIconNeutral}
                                                    alt="Bulb-Icon"
                                                />
                                            ) : (
                                                ' '
                                            )}
                                            <Typography className={classes.textHeaders}>
                                                {header.replace('_', ' ')}{' '}
                                            </Typography>
                                        </span>
                                    </TableCell>
                                    {selectedScenarios.map((selectedScenario, index) => {
                                        const scenario = data.scenarios.find(
                                            (s) => s.name === selectedScenario
                                        );
                                        return (
                                            scenario && (
                                                <TableCell
                                                    key={index}
                                                    className={classes.textStyle}
                                                >
                                                    {scenario[header]}
                                                </TableCell>
                                            )
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                        {data?.include_plotly && (
                            <TableRow>
                                <TableCell className={classes.textStyleHeaders}>
                                    {data?.plot_header || ''}
                                </TableCell>
                                {selectedScenarios.map((selectedScenario, index) => {
                                    const scenario = data.scenarios.find(
                                        (s) => s.name === selectedScenario
                                    );
                                    return (
                                        scenario &&
                                        plotReady && (
                                            <TableCell key={index} className={classes.textStyle}>
                                                <div className={classes.plotContainer}>
                                                    {scenario.plot_data && scenario.plot_layout && (
                                                        <Plot
                                                            key={`${selectedScenario}-${scenario.plot_data?.length}`}
                                                            data={scenario.plot_data}
                                                            layout={scenario.plot_layout}
                                                            className={classes.plot}
                                                            config={{
                                                                displayModeBar: false,
                                                                responsive: true
                                                            }}
                                                            useResizeHandler={true}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        )
                                    );
                                })}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default CompareScenarioTable;
