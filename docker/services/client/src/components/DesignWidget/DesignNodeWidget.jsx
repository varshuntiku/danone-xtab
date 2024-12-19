import * as React from "react";
import map from "lodash/map";
import { DesignPortLabel } from "./DesignPortLabelWidget";
import { DefaultNodeWidget } from "storm-react-diagrams";

import AttachmentIcon from "@material-ui/icons/AttachFile";
import CommentIcon from "@material-ui/icons/Comment";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ErrorIcon from "@material-ui/icons/Error";

import codex_loader from "assets/img/codex-loader.gif";

export class DesignNodeWidget extends DefaultNodeWidget {
  generatePort(port) {
		return <DesignPortLabel model={port} key={port.id} />;
  }

	render() {
		var container_styles = {
			background: this.props.node.light_color,
			position: 'relative'
		};

		if (this.props.node.extras.node_width) {
			container_styles['width'] = this.props.node.extras.node_width + 'px';
			container_styles['opacity'] = '0.75';
		}


		if (this.props.node.extras.node_height) {
			container_styles['height'] = this.props.node.extras.node_height + 'px';
			container_styles['opacity'] = '0.75';
		}

		if (this.props.node.extras.node_color) {
			container_styles['background'] = this.props.node.extras.node_color;
			container_styles['opacity'] = '0.75';
		}

		if (this.props.node.extras.title_color) {
			container_styles['color'] = this.props.node.extras.title_color;
			container_styles['opacity'] = '0.75';
		}

		return (
      <div {...this.getProps()} style={container_styles}>
				{this.props.node.comments_count > 0 ? (
					<div style={{ position: 'absolute', top: '2px', right: '-14px', zIndex: '-1' }}>
						<CommentIcon color="primary" />
					</div>
				) : (
					''
				)}
				{this.props.node.attachments_count > 0 ? (
					<div style={{ position: 'absolute', top: '-15px', left: '2px', zIndex: '-1' }}>
						<AttachmentIcon color="primary" />
					</div>
				) : (
					''
				)}
				{this.props.node.execution_processing ? (
					<div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: '2', height: '100%', width: '100%' }}>
						<img style={{ position: 'absolute', bottom: '0px', background: 'transparent', left: '30%' }} height="35px" src={codex_loader} alt="Loader" />
					</div>
				) : (
					this.props.node.execution_success ? (
						<div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: '2', height: '100%', width: '100%' }}>
							<CheckBoxIcon className={this.bem("__green")} style={{ position: 'absolute', bottom: '0px', backgroundColor: 'transparent', left: '35%' }} />
						</div>
					) : this.props.node.execution_failure ? (
						<div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: '2', height: '100%', width: '100%' }}>
							<ErrorIcon className={this.bem("__red")} style={{ position: 'absolute', bottom: '0px', backgroundColor: 'transparent', left: '35%' }} />
						</div>
					) : (
						''
					)
				)}
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>
                        {map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
					<div className={this.bem("__out")}>
                        {map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}