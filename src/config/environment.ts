/**
 * Environment configuration utility
 * Centralizes all environment variable access and provides type safety
 */

export interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  
  // Feature Flags
  enableAnalytics: boolean;
  enablePerformanceMonitoring: boolean;
  enableErrorReporting: boolean;
  enableMockData: boolean;
  
  // Development Settings
  mockApiDelay: number;
  
  // Image Configuration
  imageCdnUrl: string;
  imageOptimization: boolean;
  
  // Scanner Configuration
  scannerApiUrl: string;
  enableCameraPermissions: boolean;
  
  // Analytics
  googleAnalyticsId?: string;
  mixpanelToken?: string;
  
  // Error Reporting
  sentryDsn?: string;
  
  // Environment Info
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Helper function to get boolean from string
function getBooleanEnv(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

// Helper function to get number from string
function getNumberEnv(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Create configuration object
export const config: AppConfig = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.postkar.com',
  
  // Feature Flags
  enableAnalytics: getBooleanEnv(import.meta.env.VITE_ENABLE_ANALYTICS, false),
  enablePerformanceMonitoring: getBooleanEnv(import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING, true),
  enableErrorReporting: getBooleanEnv(import.meta.env.VITE_ENABLE_ERROR_REPORTING, false),
  enableMockData: getBooleanEnv(import.meta.env.VITE_ENABLE_MOCK_DATA, true),
  
  // Development Settings
  mockApiDelay: getNumberEnv(import.meta.env.VITE_MOCK_API_DELAY, 500),
  
  // Image Configuration
  imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL || 'https://cdn.postkar.com',
  imageOptimization: getBooleanEnv(import.meta.env.VITE_IMAGE_OPTIMIZATION, true),
  
  // Scanner Configuration
  scannerApiUrl: import.meta.env.VITE_SCANNER_API_URL || 'https://scanner-api.postkar.com',
  enableCameraPermissions: getBooleanEnv(import.meta.env.VITE_ENABLE_CAMERA_PERMISSIONS, false),
  
  // Analytics
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN,
  
  // Error Reporting
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Environment Info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test'
};

// Validation function to ensure required config is present
export function validateConfig(): void {
  const requiredFields: (keyof AppConfig)[] = [
    'apiBaseUrl'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.warn('Missing required configuration fields:', missingFields);
  }
  
  // Log configuration in development
  if (config.isDevelopment) {
    console.log('App Configuration:', {
      ...config,
      // Hide sensitive information
      sentryDsn: config.sentryDsn ? '[HIDDEN]' : undefined,
      googleAnalyticsId: config.googleAnalyticsId ? '[HIDDEN]' : undefined,
      mixpanelToken: config.mixpanelToken ? '[HIDDEN]' : undefined
    });
  }
}

// Initialize configuration validation
validateConfig();