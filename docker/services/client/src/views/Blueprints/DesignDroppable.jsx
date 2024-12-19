import React from 'react';

const DesignDroppable = ({ widgets, parent_obj }) => {
  return (
    <div style={{ width: '100%', height: '600px' }} onDrop={event => {
        var data = JSON.parse(event.dataTransfer.getData('draggable-chip'));

        if (data && data['type'] === 'widget') {
          parent_obj.onDropWidget(data, event);
          return true;
        } else {
          return false;
        }
    }}
    onDragOver={event => {
      event.preventDefault();
    }}>
      {widgets}
    </div>
  );
}
export default DesignDroppable;