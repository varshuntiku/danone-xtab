import * as SRD from "storm-react-diagrams";
import { DesignNodeWidget } from "./DesignNodeWidget";
import { DesignNodeModel } from "./DesignNodeModel";
import * as React from "react";

export class DesignNodeFactory extends SRD.AbstractNodeFactory {
	constructor() {
		super("design");
	}

	generateReactWidget(diagramEngine, node) {
		return <DesignNodeWidget node={node} />;
	}

	getNewInstance() {
		return new DesignNodeModel();
	}
}