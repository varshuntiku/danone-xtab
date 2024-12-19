import * as React from 'react';
import { DesignPortWidget } from './DesignPortWidget';
import { DefaultPortLabel } from 'storm-react-diagrams';

export class DesignPortLabel extends DefaultPortLabel {
    render() {
        var port = (
            <DesignPortWidget node={this.props.model.getParent()} name={this.props.model.name} />
        );
        var label = <div className={this.bem('--name')}>{this.props.model.label}</div>;

        return (
            <div {...this.getProps()}>
                {this.props.model.in ? port : label}
                {this.props.model.in ? label : port}
            </div>
        );
    }
}
