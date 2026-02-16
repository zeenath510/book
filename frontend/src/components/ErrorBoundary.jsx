import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-color)" }}>
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page or try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: "0.5rem 1rem", marginTop: "1rem", cursor: "pointer" }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
