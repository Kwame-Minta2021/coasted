// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.recordMetric('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.recordMetric('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.recordMetric('fcp', entry.startTime);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported');
      }
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getMetric(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  getAverageMetric(name: string): number {
    const values = this.getMetric(name);
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  getLatestMetric(name: string): number {
    const values = this.getMetric(name);
    return values.length > 0 ? values[values.length - 1] : 0;
  }

  // Measure function execution time
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    this.recordMetric(`function:${name}`, end - start);
    return result;
  }

  // Measure async function execution time
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    this.recordMetric(`async-function:${name}`, end - start);
    return result;
  }

  // Get all metrics
  getAllMetrics(): Record<string, number[]> {
    const result: Record<string, number[]> = {};
    for (const [name, values] of this.metrics.entries()) {
      result[name] = values;
    }
    return result;
  }

  // Get performance report
  getPerformanceReport(): {
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
      fcp: number;
    };
    customMetrics: Record<string, number>;
  } {
    return {
      coreWebVitals: {
        lcp: this.getLatestMetric('lcp'),
        fid: this.getLatestMetric('fid'),
        cls: this.getLatestMetric('cls'),
        fcp: this.getLatestMetric('fcp'),
      },
      customMetrics: {
        // Add any custom metrics here
      }
    };
  }

  // Clean up observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    recordMetric: (name: string, value: number) => monitor.recordMetric(name, value),
    getMetric: (name: string) => monitor.getMetric(name),
    getAverageMetric: (name: string) => monitor.getAverageMetric(name),
    getLatestMetric: (name: string) => monitor.getLatestMetric(name),
    measureFunction: <T>(name: string, fn: () => T) => monitor.measureFunction(name, fn),
    measureAsyncFunction: <T>(name: string, fn: () => Promise<T>) => monitor.measureAsyncFunction(name, fn),
    getPerformanceReport: () => monitor.getPerformanceReport(),
  };
}

// Utility function to measure page load time
export function measurePageLoad(): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      PerformanceMonitor.getInstance().recordMetric('page-load', loadTime);
    });
  }
}

// Utility function to measure API response times
export function measureAPIResponse(url: string, startTime: number): void {
  const endTime = performance.now();
  const responseTime = endTime - startTime;
  PerformanceMonitor.getInstance().recordMetric(`api:${url}`, responseTime);
}

// Utility function to log performance metrics
export function logPerformanceMetrics(): void {
  const monitor = PerformanceMonitor.getInstance();
  const report = monitor.getPerformanceReport();
  
  console.group('🚀 Performance Metrics');
  console.log('Core Web Vitals:', report.coreWebVitals);
  console.log('Custom Metrics:', report.customMetrics);
  console.groupEnd();
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  measurePageLoad();
  
  // Log metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
    }, 2000);
  });
}