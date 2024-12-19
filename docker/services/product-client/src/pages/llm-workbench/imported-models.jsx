import React, { useState } from 'react';
import importedModelsStyle from '../../assets/jss/llmWorkbench/importedModelsStyle';
import { makeStyles } from '@material-ui/core';
import HuggingFaceModels from '../../components/llmWorkbench/HuggingFaceModels';
import CustomModels from '../../components/llmWorkbench/CustomModels';

const useStyles = makeStyles(importedModelsStyle);
const ImportedModels = () => {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState('Hugging Face');
    return (
        <>
            <div className={classes.container}>
                <div className={classes.tabContainer}>
                    <div
                        className={`${classes.tab} ${
                            activeTab == 'Hugging Face' && classes.activeTab
                        }`}
                        onClick={() => setActiveTab('Hugging Face')}
                    >
                        Hugging Face
                    </div>
                    {/* <div
                        className={`${classes.tab} ${
                            activeTab == 'Custom Models' && classes.activeTab
                        }`}
                        onClick={() => setActiveTab('Custom Models')}
                    >
                        Custom Models
                    </div> */}
                </div>
            </div>
            {activeTab === 'Hugging Face' && <HuggingFaceModels />}
            {activeTab === 'Custom Models' && <CustomModels />}
        </>
    );
};

export default ImportedModels;
