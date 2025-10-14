/**
 * Performance Monitoring Utilities
 *
 * Provides tools for measuring and logging component render times,
 * data processing performance, and bundle size impact.
 */

export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  /**
   * Start a performance timer
   */
  static start(label: string): void {
    if (typeof performance === 'undefined') return;

    this.timers.set(label, performance.now());
    console.time(`[Performance] ${label}`);
  }

  /**
   * End a performance timer and log results
   */
  static end(label: string, details?: Record<string, any>): number {
    if (typeof performance === 'undefined') return 0;

    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`[Performance] Timer "${label}" was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.timeEnd(`[Performance] ${label}`);

    const detailsStr = details
      ? ' - ' + Object.entries(details)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      : '';

    console.log(
      `[Performance] ${label} completed in ${duration.toFixed(2)}ms${detailsStr}`
    );

    this.timers.delete(label);
    return duration;
  }

  /**
   * Measure a synchronous function
   */
  static measure<T>(label: string, fn: () => T, details?: Record<string, any>): T {
    this.start(label);
    const result = fn();
    this.end(label, details);
    return result;
  }

  /**
   * Measure an async function
   */
  static async measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
    details?: Record<string, any>
  ): Promise<T> {
    this.start(label);
    const result = await fn();
    this.end(label, details);
    return result;
  }

  /**
   * Get memory usage (if available)
   */
  static getMemoryUsage(): string {
    if (typeof performance === 'undefined' || !(performance as any).memory) {
      return 'Memory API not available';
    }

    const memory = (performance as any).memory;
    const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const totalMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);

    return `${usedMB} MB / ${totalMB} MB`;
  }

  /**
   * Log bundle size impact for code splitting
   */
  static logBundleImpact(componentName: string, estimatedSizeKB: number): void {
    console.log(
      `[Bundle] ${componentName} lazy-loaded (~${estimatedSizeKB}KB) - reducing initial bundle size`
    );
  }

  /**
   * Create a component performance wrapper for React
   */
  static wrapComponent<P extends object>(
    componentName: string,
    Component: React.ComponentType<P>
  ): React.ComponentType<P> {
    return function PerformanceWrappedComponent(props: P) {
      const renderStart = performance.now();

      React.useEffect(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;

        console.log(
          `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`
        );
      }, []);

      return React.createElement(Component, props);
    };
  }
}

/**
 * React Hook for measuring component render times
 */
export function usePerformanceMonitor(componentName: string) {
  const [renderCount, setRenderCount] = React.useState(0);
  const renderStartRef = React.useRef<number>(0);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  React.useEffect(() => {
    renderStartRef.current = performance.now();
  });

  React.useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;

    if (renderCount > 0) {
      console.log(
        `[Performance] ${componentName} render #${renderCount} took ${renderTime.toFixed(2)}ms`
      );
    }
  });

  return { renderCount };
}

// Only import React types, not the actual module
import React from 'react';
