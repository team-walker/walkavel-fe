'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 선언적 에러 핸들링을 위한 Error Boundary 컴포넌트입니다.
 * 특정 UI 영역(예: 지도, 카드 리스트)에서 발생하는 런타임 에러를 격격하여 전체 앱이 깨지는 것을 방지합니다.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={`bg-walkavel-gray-50 flex flex-col items-center justify-center rounded-2xl p-6 text-center ${this.props.className}`}
        >
          <div className="text-walkavel-gray-500 mb-4">
            <p className="text-walkavel-gray-900 text-sm font-semibold break-keep">
              문제가 발생했습니다
            </p>
            <p className="mt-1 text-xs break-keep">
              {this.state.error?.message || '로드 중 오류가 발생했습니다.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="bg-brand-blue-light text-brand-blue active:bg-brand-blue/10 min-h-10 rounded-full px-4 py-2 text-xs font-bold break-keep transition-colors"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
