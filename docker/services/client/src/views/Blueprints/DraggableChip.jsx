import React from 'react';
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

import DraggableItemTypes from 'views/Blueprints/DraggableItemTypes.js';

class DraggableChip extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render () {
    const { classes, label, color, widget_type, widget_id } = this.props;

    const item = { label: label, widget_type: widget_type, widget_id: widget_id, type: DraggableItemTypes.WIDGET }

    return (
      <div
        draggable={true}
        onDragStart={
          event => {
            event.dataTransfer.setData('draggable-chip', JSON.stringify(item));
          }
        }
        className={classes.draggableChip}
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
    );
  }
}

DraggableChip.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  widget_type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  widget_id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default withStyles({
  draggableChip: {
    margin: '5px 15px 5px 5px',
    fontSize: '12px',
    padding: '5px',
    width: '100%',
    color: '#ffffff',
    borderRadius: '5px'
  }
})(DraggableChip);