/**
 * Performance monitoring utilities for production optimization
 */

// Web Vitals tracking
export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

// Performance observer for Core Web Vitals
export function initWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    if (lastEntry) {
      console.log('LCP:', lastEntry.startTime);
      // In production, send to analytics
      if (import.meta.env.PROD) {
        // sendToAnalytics('LCP', lastEntry.startTime);
      }
    }
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      console.log('FID:', entry.processingStart - entry.startTime);
      // In production, send to analytics
      if (import.meta.env.PROD) {
        // sendToAnalytics('FID', entry.processingStart - entry.startTime);
      }
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    
    console.log('CLS:', clsValue);
    // In production, send to analytics
    if (import.meta.env.PROD) {
      // sendToAnalytics('CLS', clsValue);
    }
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }
}

// Resource loading performance
export function trackResourceLoading() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const resourceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.duration > 1000) { // Log slow resources (>1s)
        console.warn('Slow resource:', entry.name, entry.duration + 'ms');
      }
    });
  });

  try {
    resourceObserver.observe({ entryTypes: ['resource'] });
  } catch (e) {
    // Resource timing not supported
  }
}

// Image loading performance
export function trackImagePerformance(src: string, startTime: number) {
  const loadTime = performance.now() - startTime;
  
  if (loadTime > 2000) { // Log slow images (>2s)
    console.warn('Slow image load:', src, loadTime + 'ms');
  }
  
  // In production, send to analytics
  if (import.meta.env.PROD) {
    // sendToAnalytics('image-load-time', loadTime, { src });
  }
}

// Bundle size monitoring
export function logBundleInfo() {
  if (typeof window === 'undefined') return;
  
  // Log initial bundle size info
  const scripts = document.querySelectorAll('script[src]');
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  
  console.log('Bundle info:', {
    scripts: scripts.length,
    styles: styles.length,
    timestamp: new Date().toISOString()
  });
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('performance' in window) || !('memory' in (window.performance as any))) {
    return;
  }

  const memory = (window.performance as any).memory;
  
  const memoryInfo = {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
  };
  
  console.log('Memory usage:', memoryInfo);
  
  // Warn if memory usage is high
  if (memoryInfo.usedJSHeapSize > 50) { // >50MB
    console.warn('High memory usage detected:', memoryInfo.usedJSHeapSize + 'MB');
  }
  
  return memoryInfo;
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (import.meta.env.DEV) {
    initWebVitals();
    trackResourceLoading();
    logBundleInfo();
    
    // Monitor memory usage every 30 seconds in development
    setInterval(monitorMemoryUsage, 30000);
  }
}