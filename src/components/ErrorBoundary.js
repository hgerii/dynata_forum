import React from "react";
import { Alert } from "antd";

// A component to display a fallback page on any uncaught errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {}

    render() {
        if (this.state.hasError) {
            return <Alert type="error" message={this.props.msg} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
