import * as SRD from 'storm-react-diagrams';
import DesignNodeWidget from './DesignNodeWidget';
import { DesignNodeModel } from './DesignNodeModel';
import * as React from 'react';

export class DesignNodeFactory extends SRD.AbstractNodeFactory {
    constructor(props) {
        super('design');
        this.notebook_id = props.notebook_id;
        this.iteration_id = props.iteration_id;
        this.design_obj = props.design_obj;
    }

    generateReactWidget(diagramEngine, node) {
        return (
            <DesignNodeWidget
                node={node}
                notebook_id={this.notebook_id}
                iteration_id={this.iteration_id}
                design_obj={this.design_obj}
            />
        );
    }

    getNewInstance() {
        return new DesignNodeModel();
    }
}
