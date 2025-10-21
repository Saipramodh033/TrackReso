import api from '../components/api';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Request tracking for throttling
const requestTracker = new Map();
const REQUEST_COOLDOWN = 1000; // 1 second between identical requests

// Helper function to create cache key
const createCacheKey = (url, params = {}) => {
  return `${url}${JSON.stringify(params)}`;
};

// Helper function to check if cache is valid
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
};

// Helper function to check request throttling
const shouldThrottleRequest = (key) => {
  const lastRequest = requestTracker.get(key);
  if (lastRequest && (Date.now() - lastRequest) < REQUEST_COOLDOWN) {
    return true;
  }
  requestTracker.set(key, Date.now());
  return false;
};

// Generic cached GET request
const cachedGet = async (url, params = {}) => {
  const cacheKey = createCacheKey(url, params);
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (isCacheValid(cached)) {
    console.log(`Cache hit for ${url}`);
    return cached.data;
  }
  
  // Check throttling
  if (shouldThrottleRequest(cacheKey)) {
    console.log(`Request throttled for ${url}`);
    // Return cached data even if expired, or throw error
    if (cached) {
      return cached.data;
    }
    throw new Error('Request throttled - please wait');
  }
  
  try {
    console.log(`Making API request to ${url}`);
    const response = await api.get(url, { params });
    
    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    // If we have cached data, return it even on error
    if (cached) {
      console.log(`API error, returning cached data for ${url}`);
      return cached.data;
    }
    throw error;
  }
};

// API service methods
export const apiService = {
  // Fetch all dashboard data with intelligent caching
  fetchDashboardData: async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Use Promise.allSettled to prevent one failed request from blocking others
      const results = await Promise.allSettled([
        cachedGet('/topics/'),
        cachedGet('/peers/'),
        cachedGet('/peers/requests/'),
        cachedGet('/shared-topics/')
      ]);
      
      // Process results
      const [topicsResult, peersResult, requestsResult, sharedResult] = results;
      
      return {
        topics: topicsResult.status === 'fulfilled' ? topicsResult.value : [],
        peers: peersResult.status === 'fulfilled' ? peersResult.value : [],
        requests: requestsResult.status === 'fulfilled' ? requestsResult.value : [],
        shared: sharedResult.status === 'fulfilled' ? sharedResult.value : [],
        errors: results.filter(r => r.status === 'rejected').map(r => r.reason)
      };
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      throw error;
    }
  },
  
  // Individual cached endpoints
  getTopics: () => cachedGet('/topics/'),
  getPeers: () => cachedGet('/peers/'),
  getPeerRequests: () => cachedGet('/peers/requests/'),
  getSharedTopics: () => cachedGet('/shared-topics/'),
  getSharedTopic: (id) => cachedGet(`/shared-topics/${id}/`),
  
  // Non-cached POST/PUT/DELETE requests (these modify data)
  createTopic: async (data) => {
    const response = await api.post('/topics/', data);
    // Invalidate topics cache
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  updateTopic: async (id, data) => {
    const response = await api.put(`/topics/${id}/`, data);
    // Invalidate topics cache
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  deleteTopic: async (id) => {
    const response = await api.delete(`/topics/${id}/`);
    // Invalidate topics cache
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  createCard: async (data) => {
    const response = await api.post('/cards/', data);
    // Invalidate topics cache since cards are included
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  updateCard: async (id, data) => {
    const response = await api.put(`/cards/${id}/`, data);
    // Invalidate topics cache
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  deleteCard: async (id) => {
    const response = await api.delete(`/cards/${id}/`);
    // Invalidate topics cache
    cache.delete(createCacheKey('/topics/'));
    return response.data;
  },
  
  sendPeerRequest: async (data) => {
    const response = await api.post('/peers/request/', data);
    // Invalidate peer-related caches
    cache.delete(createCacheKey('/peers/'));
    cache.delete(createCacheKey('/peers/requests/'));
    return response.data;
  },
  
  acceptPeerRequest: async (id) => {
    const response = await api.post(`/peers/${id}/accept/`);
    // Invalidate peer-related caches
    cache.delete(createCacheKey('/peers/'));
    cache.delete(createCacheKey('/peers/requests/'));
    return response.data;
  },
  
  rejectPeerRequest: async (id) => {
    const response = await api.post(`/peers/${id}/reject/`);
    // Invalidate peer requests cache
    cache.delete(createCacheKey('/peers/requests/'));
    return response.data;
  },
  
  removePeer: async (id) => {
    const response = await api.delete(`/peers/${id}/`);
    // Invalidate all peer-related caches
    cache.delete(createCacheKey('/peers/'));
    cache.delete(createCacheKey('/peers/requests/'));
    cache.delete(createCacheKey('/shared-topics/'));
    return response.data;
  },
  
  shareTopic: async (topicId, data) => {
    const response = await api.post(`/topics/${topicId}/share/`, data);
    // Invalidate shared topics cache
    cache.delete(createCacheKey('/shared-topics/'));
    return response.data;
  },
  
  searchUsers: async (query) => {
    // Search requests should be throttled but not cached (results change)
    const cacheKey = `search_${query}`;
    if (shouldThrottleRequest(cacheKey)) {
      console.log(`Search request throttled for query: ${query}`);
      return [];
    }
    const response = await api.post('/peers/search/', { query });
    return response.data;
  },
  
  // Cache management
  clearCache: () => {
    cache.clear();
    requestTracker.clear();
    console.log('API cache cleared');
  },
  
  clearCacheForKey: (url, params = {}) => {
    const key = createCacheKey(url, params);
    cache.delete(key);
    console.log(`Cache cleared for ${url}`);
  }
};

export default apiService;