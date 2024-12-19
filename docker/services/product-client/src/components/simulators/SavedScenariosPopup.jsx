import React, { useContext, useEffect, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import SavedScenarioPopupStyle from 'assets/jss/SavedScenarioPopupStyle';
import SavedScenarioAppWidgetTable from './SavedScenariosPopupTable';
import { SavedScenarioContext } from '../AppScreen';
import CommentsDrawer from 'components/Comments/CommentsDrawer';
import { ReactComponent as Collaborator } from 'assets/Icons/collaborator.svg';

const useStyles = makeStyles(SavedScenarioPopupStyle);

const SavedScenariosPopup = ({ SavedScenarioprops, ...props }) => {
    const classes = useStyles();
    const handleClosePopup = () => closeSavedScenarioPopup();
    const [optimizedScenario, setOptimizedScenario] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState([]);
    const [selectedScenarioDetails, setSelectedScenarioDetails] = useState({});
    const { openPopup, closePopup, closeSavedScenarioPopup, isEditing } =
        useContext(SavedScenarioContext);
    const [compare, setCompare] = useState(true);
    const [collaborate, setCollaborate] = useState(false);
    const [selectedScenarios, setSelectedScenarios] = useState([]);
    const [selectedScenariostable, setselectedScenariostable] = useState([])
    const [showDrawer, setShowDrawer] = useState(false);
    const [topSectionData, setTopSectionData] = useState({})

    useEffect(() => {
        const optimizedScenarioData = SavedScenarioprops.find(
            (scenario) => scenario.name === props?.compareScenario
        );
        const RevmapedTableSim = optimizedScenarioData?.scenarios_json?.isRevampedTableSim
        const key = RevmapedTableSim ? 'simulator_inputs' : 'sections'
        if (optimizedScenarioData) {
            setOptimizedScenario(optimizedScenarioData?.scenarios_json?.[key]);
        }
        if (RevmapedTableSim) {
            setTopSectionData({ ...topSectionData, compare: optimizedScenarioData?.scenarios_json?.['toplevel_inputs'] })
        }
        closePopup();
    }, [SavedScenarioprops]);
    useEffect(() => {
        if (props.scenarioDrawerOpen) {
            setShowDrawer(true);
        }
    }, [props.scenarioDrawerOpen])

    useEffect(() => {
        if (isEditing) {
            handleClosePopup();
        }
    }, [isEditing]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = String(date.getFullYear()).slice(-2); // Extract last two digits of the year
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        if (selectedScenario?.length > 0) {
            openPopup({
                compare_scenario: optimizedScenario,
                present_scenario: selectedScenario,
                table_header: selectedScenarioDetails?.name,
                table_description: selectedScenarioDetails?.description,
                savedscenerios: SavedScenarioprops,
                id: selectedScenarioDetails?.id,
                name: selectedScenarioDetails?.name,
                topSectionData,
                version: selectedScenarioDetails?.version,
                created_at: formatDate(selectedScenarioDetails?.createdAt),

            });
        }
    }, [selectedScenarioDetails?.name]);

    const handleClick = (index) => {
        const RevmapedTableSim = SavedScenarioprops[index]?.scenarios_json?.isRevampedTableSim
        const key = RevmapedTableSim ? 'simulator_inputs' : 'sections'
        setSelectedScenario(SavedScenarioprops[index]?.scenarios_json?.[key]);
        if (RevmapedTableSim) {
            setTopSectionData({ ...topSectionData, present: SavedScenarioprops[index]?.scenarios_json?.['toplevel_inputs'] })
        }
        setSelectedScenarioDetails((prevState) => ({
            ...prevState,
            name: SavedScenarioprops[index]?.name,
            description: SavedScenarioprops[index]?.comment,
            id: SavedScenarioprops[index]?.id,
            createdAt: SavedScenarioprops[index]?.createdAt,
            version: SavedScenarioprops[index]?.version,
        }));
        props.shouldOpenLibraryHandler(false, null, null, selectedScenario);
    };

    const tableInputData = {
        table_headers: [
            'Scenario Name',
            'Scenario Description',
            'Version',
            'Created By',
            'Created On',
            'Actions'
        ],
        table_data: SavedScenarioprops.map((scenario) => [
            scenario.name,
            scenario.comment,
            scenario.version,
            '',
            formatDate(scenario.createdAt),
            'View'
        ])
    };

    const handleCollaborationClick = () => {
        props.updateWidgetComment();
        setShowDrawer(true);
    };

    const handleDrawerClose = () => {
        setShowDrawer(false);
    };


    const redirectToTestSim = () => {
        if (props.linkedScreen) {
            closeSavedScenarioPopup();
            let route_var = props.linkedScreen;
            route_var = route_var.toLowerCase().replace(/\s+/g, '-');
            const currentPath = window.location.pathname;
            const lastSlashIndex = currentPath.lastIndexOf('/');
            const newPath = currentPath.substring(0, lastSlashIndex + 1) + route_var;
            props.props.history.push({
                pathname: newPath,
                state: {
                    data: selectedScenarios
                }
            });
        }
    };

    const checkBoxChange = (selectedScenariostable) => {
        selectedScenariostable.length > 1 ? setCompare(true) : setCompare(false);
        selectedScenariostable.length >= 1 ? setCollaborate(true) : setCollaborate(false);
    };

    return (
        <div
        className={classes.SavedScenariosPopupContainer}
            style={{
                width:
                props.top_navbar? showDrawer? '74vw':'98vw':
                    showDrawer
                        ? props.sidebarOpen?'62vw':'74vw'
                        : props.sidebarOpen
                            ? '83vw'
                            : '100%',
            }}
        >
                <div className={classes.savedScenariosNavbar}>
                    <span className={classes.closeButtonIcon} onClick={handleClosePopup}>
                        &lt;
                    </span>
                    <span className={classes.savedPopupTitle}>Scenario Library</span>
                </div>
                <hr className={classes.separatorLine} />
                <div className={classes.savedCompareContainer}></div>
                {showDrawer && (
                    <CommentsDrawer
                        appId={props.app_info.id}
                        screenId={props.screenId}
                        widget_id={props.widget_id}
                        onClose={props.onClose}
                        onCloseDrawer={handleDrawerClose}
                        shouldOpen={props.shouldOpen}
                        shouldOpenHandler={props.shouldOpenHandler}
                        filterWidgetId={props.filterWidgetId}
                        filterCommentId={props.filterCommentId}
                        filterScreenId={props.filterScreenId}
                        linkType={props.linkType}
                        screenName={props.screenName}
                        app_info={props.app_info}
                        selectedScenarios={selectedScenarios}
                        isScenarioLibrary={true}
                        shouldOpenLibraryHandler={props.shouldOpenLibraryHandler}
                        enableHighlight={props.enableHighlight}
                    />
                )}

                <div className={classes.savedScenariosIcons}>
                    <Button
                        className={classes.compareButton}
                        variant="outlined"
                        onClick={redirectToTestSim}
                        disabled={!compare}
                    >
                        Compare
                    </Button>
                    <span className={classes.verticalLine}>|</span>
                    <span
                        className={`${classes.collaborateButton} ${!collaborate ? classes.disabled : ''
                            }`}
                        onClick={collaborate ? handleCollaborationClick : undefined}
                        style={{
                            pointerEvents: collaborate ? 'auto' : 'none',
                            opacity: collaborate ? 1 : 0.2,
                            cursor: collaborate ? 'pointer' : 'not-allowed'
                        }}
                    >
                        <Collaborator />
                    </span>
                </div>
                <div className={classes.savedInput}>
                    <div className={classes.savedInputTable}>
                        <SavedScenarioAppWidgetTable
                            params={tableInputData}
                            handleClick={handleClick}
                            checkBoxChange={checkBoxChange}
                            selectedScenarios={selectedScenarios}
                            setSelectedScenarios={setSelectedScenarios}
                            selectedScenariostable={selectedScenariostable}
                            setselectedScenariostable={setselectedScenariostable}
                        />
                    </div>
                </div>
                <div className={classes.savedScenarioDescription}>
                    <span className={classes.savedCompareDetail}>
                        {'**Note: Select at least 2 scenarios to compare.'}
                    </span>
                </div>
        </div>
    );
};

export default SavedScenariosPopup;
