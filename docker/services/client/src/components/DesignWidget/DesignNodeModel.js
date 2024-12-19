import merge from "lodash/merge";
import filter from "lodash/filter";
import { NodeModel, DefaultPortModel, Toolkit } from "storm-react-diagrams";

export class DesignNodeModel extends NodeModel {
  constructor(name, dark_color, light_color) {
    super("design");
    this.name = name;
    this.dark_color = dark_color;
    this.light_color = light_color;
  }

  addInPort(label) {
		return this.addPort(new DefaultPortModel(true, Toolkit.UID(), label));
	}

	addOutPort(label) {
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), label));
  }

  deSerialize(object, engine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.dark_color = object.dark_color;
		this.light_color = object.light_color;
	}

	serialize() {
        return merge(super.serialize(), {
			name: this.name,
			dark_color: this.dark_color,
			light_color: this.light_color
		});
	}

	getInPorts() {
        return filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts() {
        return filter(this.ports, portModel => {
			return !portModel.in;
		});
	}
}