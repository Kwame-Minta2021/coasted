// Simple in-memory cache for API responses
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 100; // Maximum number of cached items

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // This would need to be tracked separately
    };
  }
}

// Create a singleton instance
export const apiCache = new APICache();

// Clean up expired entries every 5 minutes
setInterval(() => {
  apiCache.cleanup();
}, 5 * 60 * 1000);

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  enrollment: (userId: string) => `enrollment:${userId}`,
  course: (courseId: string) => `course:${courseId}`,
  lessons: (courseId: string) => `lessons:${courseId}`,
  stats: (type: string) => `stats:${type}`,
};

// Cache TTL constants (in milliseconds)
export const cacheTTL = {
  user: 10 * 60 * 1000, // 10 minutes
  enrollment: 5 * 60 * 1000, // 5 minutes
  course: 30 * 60 * 1000, // 30 minutes
  lessons: 15 * 60 * 1000, // 15 minutes
  stats: 5 * 60 * 1000, // 5 minutes
};

// Utility function to create a cached API call
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Check cache first
  const cached = apiCache.get(key);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // Fetch data and cache it
  return fetcher().then(data => {
    apiCache.set(key, data, ttl);
    return data;
  });
}

// Utility function for React Query or SWR integration
export function getCachedData<T>(key: string): T | null {
  return apiCache.get(key);
}

export function setCachedData<T>(key: string, data: T, ttl?: number): void {
  apiCache.set(key, data, ttl);
}
