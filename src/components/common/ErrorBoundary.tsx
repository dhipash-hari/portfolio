import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090B] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            {this.props.fallbackTitle || 'Component Encountered an Unexpected Issue'}
          </h2>
          <p className="text-xs font-mono text-zinc-400 max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred. The application state has been preserved.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-mono text-xs font-bold hover:bg-[#33ebff] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Experience
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
