import { Component } from 'react';
import { reportCrash } from './reportError';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportCrash({
      source: 'react-error-boundary',
      message: error?.message ?? String(error),
      stack: error?.stack ?? '',
      componentStack: info?.componentStack ?? '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-fallback">
          <h3>Something went wrong</h3>
          <p>This error has been reported. Please try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
