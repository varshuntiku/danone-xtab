import React, { useContext, useMemo, useState, useEffect } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { AccountCircleOutlined } from '@material-ui/icons';

import SavedScenarioPopupStyle from '../assets/jss/SavedScenarioPopupStyle';
import CloseIcon from '../assets/Icons/CloseBtn';
import SavedScenarioAppWidgetTable from './SavedScenarioPopupTable';
import Tooltip from '@material-ui/core/Tooltip';
import { SavedScenarioContext } from './AppScreen';
import { ReactComponent as EditIcon } from 'assets/Icons/editicon.svg';

const useStyles = makeStyles(SavedScenarioPopupStyle);

const compareScenarios = (presentScenarios = [], compareScenarios = []) => {
    return presentScenarios
        .map((presentScenario, index) => {
            const presentInputs = presentScenario.inputs || [];
            const compareInputs = compareScenarios[index]?.inputs || [];
            const header = presentScenario.header || '';

            return presentInputs.map((presentInput) => {
                const compareInput = compareInputs.find(
                    (input) => input.label === presentInput.label
                ) || { value: 0 };
                const presentValue = presentInput.value.toFixed(2);
                const compareValue = compareInput.value.toFixed(2);
                const difference = (presentInput.value - compareInput.value).toFixed(2);

                return [header, presentInput.label, presentValue, compareValue, difference];
            });
        })
        .flat();
};


const compareScenariosForTable = (presentScenarios = [], compareScenarios = []) => {
    const result = [];
    presentScenarios.forEach((scenario, i) => {
        const filteredScenario = (scenario || []).filter(el => !['min', 'max'].includes(el.label));
        const filteredCompareScenario = (Array.isArray(compareScenarios[i]) ? compareScenarios[i] : [])
            .filter(el => !['min', 'max'].includes(el.label));

        const presentValues = ['Present', ...filteredScenario.map(el => el.value)];
        const compareValues = ['Compare'];
        const difference = [];

        filteredScenario.forEach((el, index) => {
            const presentValue = el.value;
            const compareValue = filteredCompareScenario[index]?.value ??
                (typeof presentValue === 'string' || typeof presentValue === 'boolean' ? presentValue : 0);
            compareValues.push(compareValue);

            if (typeof presentValue === 'number') {
                difference.push(presentValue - (filteredCompareScenario[index]?.value || 0));
            }
        });

        result.push([...presentValues, ...difference]);
        result.push(compareValues);
    });

    return result;
};


let topSectionTableData={}

const SavedScenarioPopup = ({ SavedScenarioprops, updateEditingFields, setIsEditingParent }) => {
    const classes = useStyles();
    const { closePopup } = useContext(SavedScenarioContext);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState([]);
    const handleClosePopup = () => closePopup(isEditing);

    const {
        present_scenario: presentScenarios = [],
        compare_scenario: compareScenariosArray = [],
        table_header,
        id: selectedscenerioid = {},
        description = [],
        savedscenerios: savedscenarios = [],
        name: scenerioname = {},
        version,
        created_at,
        topSectionData
    } = SavedScenarioprops;
    const isRevampedTableSim = savedscenarios?.find(
        (scenario) => scenario.id === selectedscenerioid
    )?.scenarios_json?.isRevampedTableSim

    const comparisonData = useMemo(
        () => !isRevampedTableSim ? compareScenarios(presentScenarios, compareScenariosArray) : null,
        [presentScenarios, compareScenariosArray]
    );

    const comparisonForTableSim = useMemo(
        () => isRevampedTableSim ? compareScenariosForTable(presentScenarios, compareScenariosArray) : null,
        [presentScenarios, compareScenariosArray]
    )

    useEffect(() => {
        updateEditingFields(isEditing, selectedScenario, scenerioname, selectedscenerioid);
    }, [selectedScenario, isEditing, updateEditingFields, scenerioname, selectedscenerioid]);

    useEffect(() => {
        const matchingScenario = savedscenarios.find(
            (scenario) => scenario.id === selectedscenerioid
        );

        if (matchingScenario) {
            setSelectedScenario(matchingScenario.scenarios_json);
        }
    }, [selectedScenario]);

    // const comparisonTableData=comparisonForTableSim
    const comparisonTableData = comparisonForTableSim?.map(el => el.map(item => {
        if (typeof (item) === 'boolean') return `${item}`
        return item
    }))

    const getDifferenceHeader = () => {
        return presentScenarios[0]?.filter(el => typeof el.value === 'number' && el.label !== 'min' && el.label !== 'max')?.map(el => `Difference (${el.label})`)
    }

    const tableInputData = {
        table_headers: !isRevampedTableSim ? ['Header', 'Variables', 'Present Value', 'Compare Value', 'Difference'] : ['Type', ...presentScenarios[0].filter(el => el.label !== 'min' && el.label !== 'max').map(el => el.label), ...getDifferenceHeader()],
        table_data: !isRevampedTableSim ? comparisonData : comparisonTableData
    };

    if (isRevampedTableSim) {
        topSectionTableData = {
            table_headers: ['Type', ...(topSectionData && topSectionData.present ? topSectionData.present.map(el => el.label) : [])],
            table_data: [
                [
                    'Present',
                    ...(topSectionData && topSectionData.present ?
                        topSectionData.present.map(el =>
                            Array.isArray(el?.value) ? (el.value.join(" ") || '----') : el.value)
                        : [])
                ],
                [
                    'Compare',
                    ...(topSectionData && topSectionData.compare ?
                        topSectionData.compare.map(el =>
                            Array.isArray(el?.value) ? (el.value.join(" ") || '----') : el.value)
                        :Array(3).fill('---'))
                ]
            ],
        }
    }

    const handleEditClick = () => {
        handleClosePopup();
        setIsEditing(true);
        if (setIsEditingParent) {
            setIsEditingParent(true);
        }
    };

    return (
        <div className={classes.SavedPopupContainer}>
            <div className={classes.savedNavbar}>
                <span className={classes.savedPopupTitle}>Saved Scenarios</span>

                <IconButton className={classes.closeButton} onClick={handleClosePopup}>
                    <CloseIcon />
                </IconButton>
            </div>

            <hr className={classes.separatorLine} />

            <div className={classes.savedBaseScenario}>
                <span className={classes.savedBaseScenarioTitle}>{table_header}</span>
                <span className={classes.savedBaseScenarioDetail}>
                    {description[0]?.base || ''}
                </span>
            </div>
            <div className={classes.aveddetails}>version {version} <div className={classes.savedline}></div> {created_at}</div>


            <div className={classes.savedScenarioCompareContainer}>
                <div className={classes.savedCompareScenario}>
                    <span className={classes.savedCompareTitle}>Scenario Description</span>
                    <span className={classes.savedCompareDetail}>
                        {description[1]?.scenario || ''}
                    </span>
                </div>

                <div className={classes.savedCompareIcons}>
                    <Tooltip
                        title="Profile"
                        placement="bottom"
                        classes={{ tooltip: classes.visualTooltip }}
                    >
                        <IconButton title="Profile" className={classes.savedcomparebutton}>
                            <AccountCircleOutlined fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <div className={classes.line}></div>
                    <Tooltip
                        arrow
                        title="Edit Scenerio"
                        classes={{ tooltip: classes.visualTooltip }}
                    >
                        <IconButton
                            className={classes.savedcomparebutton}
                            onClick={handleEditClick}
                        >
                            <EditIcon className={classes.editicon} />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className={classes.savedInput}>
                <span className={classes.savedCompareTitle}>Input</span>
                <div className={classes.savedInputTable}>
                    <SavedScenarioAppWidgetTable params={tableInputData} isRevampedTableSim={isRevampedTableSim} />
                </div>
                {isRevampedTableSim ? <div className={classes.tableSimTopSection}>
                    <span className={classes.savedCompareTitle}>Top section</span>
                    <SavedScenarioAppWidgetTable params={topSectionTableData} isRevampedTableSim={isRevampedTableSim} revampedTopSectionData={true} />
                </div> : null}
            </div>
        </div>
    );
};

export default SavedScenarioPopup;
