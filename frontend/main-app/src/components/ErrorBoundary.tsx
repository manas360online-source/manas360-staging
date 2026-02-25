import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-red-50 p-4 z-50 overflow-auto">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full border border-red-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                        <div className="mb-4">
                            <p className="text-gray-700 font-semibold mb-2">Error:</p>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-red-800">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <div>
                                <p className="text-gray-700 font-semibold mb-2">Component Stack:</p>
                                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto text-gray-600">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                        <button
                            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
