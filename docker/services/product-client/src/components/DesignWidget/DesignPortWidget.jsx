import * as React from 'react';
import { PortWidget } from 'storm-react-diagrams';

export class DesignPortWidget extends PortWidget {
    render() {
        return (
            <div
                aria-label="design-port"
                style={{ backgroundColor: this.props.node.dark_color, zIndex: 15 }}
                {...this.getProps()}
                onMouseEnter={() => {
                    this.setState({ selected: true });
                }}
                onMouseLeave={() => {
                    this.setState({ selected: false });
                }}
                data-name={this.props.name}
                data-nodeid={this.props.node.getID()}
            />
        );
    }
}
