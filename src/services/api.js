// ============================================
// WARDROBE API SERVICE
// Client-side API layer connecting frontend
// to Express + Supabase backend API
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Helper to get stored auth token from localStorage
 */
function getToken() {
  return localStorage.getItem('wardrobe_token') || null;
}

/**
 * Core HTTP client wrapper with automatic auth header and JSON parsing
 */
async function fetchClient(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if we aren't sending FormData (for image uploads)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP Error: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // --- Auth & User Profile ---
  auth: {
    signup: (userData) => fetchClient('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials) => fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    google: (userData) => fetchClient('/auth/google', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    getProfile: () => fetchClient('/auth/profile'),
    updateProfile: (updates) => fetchClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  },

  // --- Digital Closet ---
  closet: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchClient(`/closet${query ? `?${query}` : ''}`);
    },
    getById: (id) => fetchClient(`/closet/${id}`),
    create: (itemData) => fetchClient('/closet', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
    update: (id, updates) => fetchClient(`/closet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    delete: (id) => fetchClient(`/closet/${id}`, {
      method: 'DELETE',
    }),
    getStats: () => fetchClient('/closet/stats/summary'),
  },

  // --- Outfits & Lookbook ---
  outfits: {
    generate: (criteria) => fetchClient('/outfits/generate', {
      method: 'POST',
      body: JSON.stringify(criteria),
    }),
    save: (outfitData) => fetchClient('/outfits', {
      method: 'POST',
      body: JSON.stringify(outfitData),
    }),
    getAll: () => fetchClient('/outfits'),
    delete: (id) => fetchClient(`/outfits/${id}`, {
      method: 'DELETE',
    }),
    getLayeringAdvice: (temp, condition = 'Mild') => fetchClient(`/outfits/layering/${temp}?condition=${encodeURIComponent(condition)}`),
  },

  // --- Travel Planner ---
  travel: {
    planTrip: (tripConfig) => fetchClient('/travel/plan', {
      method: 'POST',
      body: JSON.stringify(tripConfig),
    }),
    getAll: () => fetchClient('/travel'),
    getById: (id) => fetchClient(`/travel/${id}`),
    update: (id, updates) => fetchClient(`/travel/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    delete: (id) => fetchClient(`/travel/${id}`, {
      method: 'DELETE',
    }),
    getClimate: (destination) => fetchClient(`/travel/climate/${encodeURIComponent(destination)}`),
  },

  // --- Smart Shopping List ---
  shopping: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchClient(`/shopping${query ? `?${query}` : ''}`);
    },
    create: (itemData) => fetchClient('/shopping', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
    update: (id, updates) => fetchClient(`/shopping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    delete: (id) => fetchClient(`/shopping/${id}`, {
      method: 'DELETE',
    }),
    trackClick: (id) => fetchClient(`/shopping/${id}/track-click`, {
      method: 'POST',
    }),
  },

  // --- Ingestion (OCR & Image Upload) ---
  ingest: {
    parseReceipt: (text, autoSave = false) => fetchClient('/ingest/receipt', {
      method: 'POST',
      body: JSON.stringify({ text, autoSave }),
    }),
    uploadImage: (imageFile) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      return fetchClient('/ingest/upload', {
        method: 'POST',
        body: formData,
      });
    },
  },
};

export default api;
