import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 0, 0, 0.05)', borderRadius: '12px', border: '1px solid var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)' }}>Something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)' }}>The component failed to render. Please try refreshing or contact support.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn" 
            style={{ marginTop: '1rem' }}
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
