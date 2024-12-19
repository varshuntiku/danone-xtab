import React from "react";
import PropTypes from "prop-types";

const ErrorBoundaryStyles = () => ({
  errorBoundary: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8d7da",
    color: "#721c24",
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    margin: "auto",
    width: "70%",
    boxShadow: "10px 10px 20px",
  },
  errorTitle: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  errorButton: {
    padding: "10px 20px",
    fontSize: "2rem",
    backgroundColor: "#f56565",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  errorButtonHover: {
    backgroundColor: "#c53030",
  },
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isButtonHovered: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error", error, errorInfo);
  }

  handleMouseEnter = () => {
    this.setState({ isButtonHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isButtonHovered: false });
  };

  render() {
    const styles = ErrorBoundaryStyles();
    const buttonStyles = this.state.isButtonHovered
      ? { ...styles.errorButton, ...styles.errorButtonHover }
      : styles.errorButton;

    if (this.state.hasError) {
      return (
        <div style={{ paddingTop: "15%" }}>
          <div style={styles.errorBoundary}>
            <h1 style={styles.errorTitle}>Oops! Something went wrong.</h1>
            <button
              style={buttonStyles}
              onClick={() => window.location.reload()}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
