import React from 'react';
import AppWidgetPlot from 'components/AppWidgetPlot.jsx';
import AppWidgetTable from 'components/AppWidgetTable.jsx';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

function DSStoreMarkdownRenderer(props) {
    const { classes, tablePreviewData, plotlyPreviewData, modelPreview, showPreview } = props;
    const selected_ds_store_artifact = props.selected_ds_store_artifact;

    const handleDrillDown = () => {};
    const handleFetchPopoverData = () => {};
    const handleFetchDetailData = () => {};
    const handleWidgetEvent = () => {};
    const handlePlotlyDropdownAction = () => {};

    return (
        <div>
            {showPreview ? (
                <>
                    <div className={classes.widgetPreviewContainer}>
                        {selected_ds_store_artifact.type !== 'model' && (
                            <>
                                <Typography
                                    variant="h6"
                                    className={clsx(
                                        classes.widgetInfoHeading,
                                        classes.widgetPreviewTxt
                                    )}
                                >
                                    {`Preview for ${selected_ds_store_artifact.key}`}
                                </Typography>
                            </>
                        )}

                        {selected_ds_store_artifact.type === 'dataframe' && (
                            <>
                                <AppWidgetTable params={tablePreviewData} search={''} />
                            </>
                        )}
                        {selected_ds_store_artifact.type === 'figure' && (
                            <AppWidgetPlot
                                params={plotlyPreviewData}
                                graph_height={'half'}
                                graph_width={'full'}
                                onDrilledData={handleDrillDown}
                                onFetchPopoverData={handleFetchPopoverData}
                                onFetchDetailData={handleFetchDetailData}
                                onPlotClick={handleWidgetEvent}
                                title={''}
                                onDropdownAction={handlePlotlyDropdownAction}
                            />
                        )}
                        {selected_ds_store_artifact.type === 'model' && (
                            <Typography
                                className={clsx(classes.f2, classes.defaultColor)}
                                variant="h3"
                            >
                                {modelPreview}
                            </Typography>
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default DSStoreMarkdownRenderer;
