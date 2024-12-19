import { Component, JSX } from "preact";
import "./errorBoundaries.scss"

type ErrorBoundaryProps = {
	children: JSX.Element;
	fallback: string;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<label className="MinervaErrorBoundaries-fallback">{this.props.fallback}</label>
			);
		}
		return this.props.children;
	}
}
