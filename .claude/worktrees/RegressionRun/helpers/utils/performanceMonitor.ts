import { Page } from '@playwright/test';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fcp: number | null; // First Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay
  tti: number | null; // Time to Interactive

  // Navigation Timing
  domContentLoaded: number;
  loadComplete: number;

  // Resource Metrics
  totalResources: number;
  totalResourceSize: number;

  // Custom Metrics
  timeToFirstByte: number | null;
  pageLoadTime: number;
}

export interface NetworkMetrics {
  totalRequests: number;
  totalResponseSize: number;
  avgResponseTime: number;
  slowestRequest: {
    url: string;
    duration: number;
  } | null;
}

export class PerformanceMonitor {
  private readonly page: Page;
  private startTime: number = 0;
  private readonly networkRequests: Array<{ url: string; duration: number; size: number }> = [];

  constructor(page: Page) {
    this.page = page;
  }

  async startMonitoring(): Promise<void> {
    this.startTime = Date.now();

    // Monitor network requests
    this.page.on('request', (request) => {
      const timing = request.timing();
      this.networkRequests.push({
        url: request.url(),
        duration: timing.responseEnd - timing.requestStart,
        size: 0, // Will be updated on response
      });
    });

    this.page.on('response', (response) => {
      const request = this.networkRequests.find((req) => req.url === response.url());
      if (request && response.headers()['content-length']) {
        request.size = parseInt(response.headers()['content-length'] || '0');
      }
    });

    // Inject performance monitoring script
    await this.page.addInitScript(() => {
      // Monitor Core Web Vitals
      (window as any).performanceMetrics = {
        lcp: null,
        fcp: null,
        cls: null,
        fid: null,
      };

      // LCP Observer
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            (window as any).performanceMetrics.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP observer not supported
        }

        // FCP Observer
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              (window as any).performanceMetrics.fcp = fcpEntry.startTime;
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (e) {
          // FCP observer not supported
        }

        // CLS Observer
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const layoutShift = entry as any;
              if (!layoutShift.hadRecentInput) {
                clsValue += layoutShift.value;
              }
            }
            (window as any).performanceMetrics.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // CLS observer not supported
        }

        // FID Observer
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const firstInput = entries[0] as any;
            if (firstInput) {
              (window as any).performanceMetrics.fid =
                firstInput.processingStart - firstInput.startTime;
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // FID observer not supported
        }
      }
    });
  }

  async getMetrics(): Promise<PerformanceMetrics> {
    // Get Core Web Vitals from injected script
    const webVitals = await this.page.evaluate(() => {
      return (window as any).performanceMetrics || {};
    });

    // Get Navigation Timing using modern API
    const navigationTiming = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        return {
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          timeToFirstByte: navigation.responseStart - navigation.requestStart,
        };
      }
      return {
        domContentLoaded: 0,
        loadComplete: 0,
        timeToFirstByte: 0,
      };
    });

    // Get Resource Timing
    const resourceTiming = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        totalResourceSize: resources.reduce((total: number, resource: any) => {
          return total + (resource.transferSize || 0);
        }, 0),
      };
    });

    // Get TTI (simplified calculation)
    const tti = await this.calculateTTI();

    const pageLoadTime = Date.now() - this.startTime;

    return {
      // Core Web Vitals
      lcp: webVitals.lcp,
      fcp: webVitals.fcp,
      cls: webVitals.cls,
      fid: webVitals.fid,
      tti,

      // Navigation Timing
      domContentLoaded: navigationTiming.domContentLoaded,
      loadComplete: navigationTiming.loadComplete,

      // Resource Metrics
      totalResources: resourceTiming.totalResources,
      totalResourceSize: resourceTiming.totalResourceSize,

      // Custom Metrics
      timeToFirstByte: navigationTiming.timeToFirstByte,
      pageLoadTime,
    };
  }

  async getNetworkMetrics(): Promise<NetworkMetrics> {
    return this.calculateNetworkMetrics();
  }

  private calculateNetworkMetrics(): NetworkMetrics {
    if (this.networkRequests.length === 0) {
      return {
        totalRequests: 0,
        totalResponseSize: 0,
        avgResponseTime: 0,
        slowestRequest: null,
      };
    }

    const totalRequests = this.networkRequests.length;
    const totalResponseSize = this.networkRequests.reduce((sum, req) => sum + req.size, 0);
    const avgResponseTime =
      this.networkRequests.reduce((sum, req) => sum + req.duration, 0) / totalRequests;

    const slowestRequest = this.networkRequests.reduce(
      (slowest, req) => {
        return req.duration > (slowest?.duration || 0) ? req : slowest;
      },
      null as { url: string; duration: number } | null
    );

    return {
      totalRequests,
      totalResponseSize,
      avgResponseTime,
      slowestRequest,
    };
  }

  private async calculateTTI(): Promise<number | null> {
    try {
      // Simplified TTI calculation using modern Navigation API
      return await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          return navigation.domInteractive - navigation.fetchStart;
        }
        return null;
      });
    } catch (e) {
      return null;
    }
  }

  async generateReport(): Promise<string> {
    const metrics = await this.getMetrics();
    const networkMetrics = await this.getNetworkMetrics();

    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      metrics,
      networkMetrics,
      thresholds: {
        lcp: { value: metrics.lcp, threshold: 2500, passed: (metrics.lcp || 0) < 2500 },
        fcp: { value: metrics.fcp, threshold: 1800, passed: (metrics.fcp || 0) < 1800 },
        cls: { value: metrics.cls, threshold: 0.1, passed: (metrics.cls || 0) < 0.1 },
        fid: { value: metrics.fid, threshold: 100, passed: (metrics.fid || 0) < 100 },
      },
    };

    return JSON.stringify(report, null, 2);
  }
}
