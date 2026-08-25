import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '@/observability/sentry';

interface Props {
  children: ReactNode;
  fallback: (reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Sentry.ErrorBoundary 를 대신한다. Sentry 를 지연 로딩하면서도 화면이
 * 깨졌을 때는 그대로 잡아 내고, 보고는 Sentry 가 도착한 뒤에 올린다.
 */
export default class RootErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack });
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) return this.props.fallback(this.reset);
    return this.props.children;
  }
}
