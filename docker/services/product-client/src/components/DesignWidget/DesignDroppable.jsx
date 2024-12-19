import React from 'react';
import { Card, CardContent } from '@material-ui/core';

const DesignDroppable = ({ widgets, parent_obj, classes }) => {
    return (
        <Card aria-label="card" className={classes.blueprintContentWrapper}>
            <CardContent
                className={classes.blueprintContentDroppable}
                onDrop={(event) => {
                    var data = JSON.parse(event.dataTransfer.getData('draggable-chip'));

                    if (data && data['type'] === 'widget') {
                        parent_obj.onDropWidget(data, event);
                        return true;
                    } else {
                        return false;
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                }}
            >
                {widgets}
            </CardContent>
        </Card>
    );
};
export default DesignDroppable;
