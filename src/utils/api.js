// src/utils/api.js
// API utility functions for backend communication

const API_BASE_URL = 'https://artiststation.co.in/foxecom/api';
const BASE_URL = 'https://artiststation.co.in/foxecom';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get admin auth token
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Helper function for admin API requests (uses adminToken instead of regular token)
const adminApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAdminToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return { data, status: response.status };
  } catch (error) {
    console.error('Admin API Error:', error);
    throw error;
  }
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/product-item1.jpg';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a backend upload path (starts with /uploads/), prepend base URL
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // If it's a local image path (starts with /images/), return as is
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // Default: assume it's a backend upload path
  return `${BASE_URL}/${imagePath}`;
};

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return { data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Product APIs
export const productAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiRequest(endpoint);
    return data.products || [];
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/products/${id}`);
    return data;
  },
  
  search: async (name) => {
    const { data } = await apiRequest(`/products/search?name=${encodeURIComponent(name)}`);
    return data;
  },
};

// Category APIs
export const categoryAPI = {
  getAll: async () => {
    const { data } = await apiRequest('/categories');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/categories/${id}`);
    return data;
  },
};

// Guest Cart APIs
export const guestCartAPI = {
  create: async (guestCartId) => {
    const { data } = await apiRequest('/guest-cart', {
      method: 'POST',
      body: JSON.stringify({ guestCartId }),
    });
    return data;
  },
  
  get: async (guestCartId) => {
    const { data } = await apiRequest(`/guest-cart/${guestCartId}`);
    return data;
  },
  
  addItem: async (guestCartId, productId, quantity = 1) => {
    const { data } = await apiRequest(`/guest-cart/${guestCartId}/add`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return data;
  },
  
  updateItem: async (guestCartId, productId, quantity) => {
    const { data } = await apiRequest(`/guest-cart/${guestCartId}/update`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    return data;
  },
  
  removeItem: async (guestCartId, productId) => {
    await apiRequest(`/guest-cart/${guestCartId}/item/${productId}`, {
      method: 'DELETE',
    });
  },
};

// User Cart APIs (requires authentication)
export const userCartAPI = {
  get: async () => {
    const { data } = await apiRequest('/cart');
    return data;
  },
  
  addItem: async (productId, quantity = 1) => {
    const { data } = await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return data;
  },
  
  updateItem: async (productId, quantity) => {
    const { data } = await apiRequest('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    return data;
  },
  
  removeItem: async (productId) => {
    await apiRequest(`/cart/${productId}`, {
      method: 'DELETE',
    });
  },
  
  clear: async () => {
    await apiRequest('/cart', {
      method: 'DELETE',
    });
  },
  
  mergeGuestCart: async (guestCartId) => {
    const { data } = await apiRequest('/merge-carts', {
      method: 'POST',
      body: JSON.stringify({ guestCartId }),
    });
    return data;
  },
  
  validateCheckout: async () => {
    const { data } = await apiRequest('/cart/validate-checkout');
    return data;
  },
};

// Checkout APIs
export const checkoutAPI = {
  getSummary: async () => {
    const { data } = await apiRequest('/checkout/summary');
    return data;
  },
  
  validateAddress: async (addressData) => {
    const { data } = await apiRequest('/checkout/validate-address', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
    return data;
  },
  
  getPaymentMethods: async () => {
    const { data } = await apiRequest('/checkout/payment-methods');
    return data;
  },
};

// Order APIs
export const orderAPI = {
  create: async (orderData) => {
    const { data } = await apiRequest('/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return data;
  },
  
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/order${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiRequest(endpoint);
    return data;
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/order/${id}`);
    return data;
  },
  
  cancel: async (id) => {
    const { data } = await apiRequest(`/order/${id}/cancel`, {
      method: 'PUT',
    });
    return data;
  },
};

// Payment APIs
export const paymentAPI = {
  createRazorpayOrder: async (orderId) => {
    const { data } = await apiRequest('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
    return data;
  },
  
  verifyPayment: async (paymentData) => {
    const { data } = await apiRequest('/payment/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return data;
  },
};

// Case Details APIs
export const caseDetailsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/case-details${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiRequest(endpoint);
    return data.caseDetails || [];
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/case-details/${id}`);
    return data;
  },
};

// Admin APIs
export const adminAPI = {
  // Admin Authentication (doesn't require admin token since it's login)
  login: async (email, password) => {
    const { data } = await apiRequest('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  // Admin Management
  createAdmin: async (adminData) => {
    const { data } = await adminApiRequest('/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
    return data;
  },

  getAllAdmins: async () => {
    const { data } = await adminApiRequest('/admins');
    return data;
  },

  getAdminById: async (id) => {
    const { data } = await adminApiRequest(`/admins/${id}`);
    return data;
  },

  updateAdmin: async (id, adminData) => {
    const { data } = await adminApiRequest(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
    return data;
  },

  deleteAdmin: async (id) => {
    await adminApiRequest(`/admins/${id}`, {
      method: 'DELETE',
    });
  },

  // Dashboard Statistics
  getDashboardStats: async () => {
    const { data } = await adminApiRequest('/admin/dashboard/stats');
    return data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`;
    const { data } = await adminApiRequest(endpoint);
    return data;
  },

  bulkDeleteProducts: async (productIds) => {
    const { data } = await adminApiRequest('/admin/products/bulk', {
      method: 'DELETE',
      body: JSON.stringify({ productIds }),
    });
    return data;
  },

  // User Management (Admin only)
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
    const { data } = await adminApiRequest(endpoint);
    return data;
  },

  getUserProfile: async (userId) => {
    const { data } = await adminApiRequest(`/admin/users/${userId}`);
    return data;
  },

  getUserOrders: async (userId) => {
    const { data } = await adminApiRequest(`/admin/users/${userId}/orders`);
    return data;
  },

  // Admin Orders
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/orders${queryString ? `?${queryString}` : ''}`;
    const { data } = await adminApiRequest(endpoint);
    return data;
  },

  getOrderById: async (id) => {
    const { data } = await adminApiRequest(`/admin/orders/${id}`);
    return data;
  },
};

export default {
  productAPI,
  categoryAPI,
  guestCartAPI,
  userCartAPI,
  checkoutAPI,
  orderAPI,
  paymentAPI,
  caseDetailsAPI,
  adminAPI,
};
