/**
 * Visit Counter Service
 * Handles API calls for visit tracking and statistics
 */

export interface VisitStats {
  totalVisits: number;
  activeNow: number;
  lastUpdated: string;
}

export interface VisitStatsResponse {
  success: boolean;
  message?: string;
  data?: VisitStats;
}

export interface RecordVisitResponse {
  success: boolean;
  message?: string;
  sessionId?: string;
}

class VisitCounterService {
  private baseURL: string;
  private sessionId: string | null = null;
  private syncInterval: number | null = null;
  private listeners: Set<(stats: VisitStats) => void> = new Set();

  constructor() {
    // Use environment variable for API base URL
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    
    // Try to get existing session ID from sessionStorage
    this.sessionId = sessionStorage.getItem('postkar-visit-session');
  }

  /**
   * Get current visit statistics
   * @returns Promise with visit statistics
   */
  async getStats(): Promise<VisitStatsResponse> {
    try {
      const url = `${this.baseURL}/api/visits/stats`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Notify listeners
      if (data.success && data.data) {
        this.notifyListeners(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch visit stats:', error);
      throw error;
    }
  }

  /**
   * Record a new visit
   * @returns Promise with session ID
   */
  async recordVisit(): Promise<RecordVisitResponse> {
    try {
      const url = `${this.baseURL}/api/visits/record`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store session ID
      if (data.success && data.sessionId) {
        this.sessionId = data.sessionId;
        sessionStorage.setItem('postkar-visit-session', data.sessionId);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to record visit:', error);
      throw error;
    }
  }

  /**
   * Start periodic sync with backend (every 10 seconds)
   * @param callback - Optional callback to receive stats updates
   */
  startPeriodicSync(callback?: (stats: VisitStats) => void): void {
    // Add callback to listeners if provided
    if (callback) {
      this.listeners.add(callback);
    }

    // Clear existing interval if any
    this.stopPeriodicSync();

    // Record initial visit
    this.recordVisit().catch(console.error);

    // Fetch initial stats
    this.getStats().catch(console.error);

    // Set up periodic sync every 10 seconds
    this.syncInterval = window.setInterval(() => {
      this.getStats().catch(console.error);
    }, 10000);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Subscribe to stats updates
   * @param callback - Callback to receive stats updates
   * @returns Unsubscribe function
   */
  subscribe(callback: (stats: VisitStats) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of stats update
   * @param stats - Updated visit statistics
   */
  private notifyListeners(stats: VisitStats): void {
    this.listeners.forEach(listener => {
      try {
        listener(stats);
      } catch (error) {
        console.error('Error in visit stats listener:', error);
      }
    });
  }

  /**
   * Mock implementation for development/testing
   * @returns Promise with mock visit statistics
   */
  async getStatsMock(): Promise<VisitStatsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data with some randomness
    const baseVisits = 635;
    const randomVisits = Math.floor(Math.random() * 50);
    const activeNow = Math.floor(Math.random() * 10) + 1;

    const stats: VisitStats = {
      totalVisits: baseVisits + randomVisits,
      activeNow: activeNow,
      lastUpdated: new Date().toISOString(),
    };

    // Notify listeners
    this.notifyListeners(stats);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Mock implementation for recording a visit
   * @returns Promise with mock session ID
   */
  async recordVisitMock(): Promise<RecordVisitResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sessionId = this.sessionId || 'session-' + Date.now();
    this.sessionId = sessionId;
    sessionStorage.setItem('postkar-visit-session', sessionId);

    return {
      success: true,
      message: 'Visit recorded successfully',
      sessionId: sessionId,
    };
  }

  /**
   * Start periodic sync with mock data (for development)
   * @param callback - Optional callback to receive stats updates
   */
  startPeriodicSyncMock(callback?: (stats: VisitStats) => void): void {
    // Add callback to listeners if provided
    if (callback) {
      this.listeners.add(callback);
    }

    // Clear existing interval if any
    this.stopPeriodicSync();

    // Record initial visit
    this.recordVisitMock().catch(console.error);

    // Fetch initial stats
    this.getStatsMock().catch(console.error);

    // Set up periodic sync every 10 seconds
    this.syncInterval = window.setInterval(() => {
      this.getStatsMock().catch(console.error);
    }, 10000);
  }
}

export const visitCounterService = new VisitCounterService();
export { VisitCounterService };
