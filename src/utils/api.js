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
    
    // Handle 204 No Content and other responses with no body
    if (response.status === 204 || response.status === 201) {
      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { data: null, status: response.status };
      }
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // If parsing fails, return the text as data
        data = text;
      }
    }
    
    if (!response.ok) {
      throw new Error(data?.message || 'API request failed');
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
    
    // Handle 204 No Content and other responses with no body
    if (response.status === 204 || response.status === 201) {
      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { data: null, status: response.status };
      }
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // If parsing fails, return the text as data
        data = text;
      }
    }
    
    if (!response.ok) {
      // Handle invalid or expired token (401 Unauthorized or 403 Forbidden with token error)
      const isTokenError = (response.status === 401 || response.status === 403) && 
                          data && data.message && 
                          (data.message.toLowerCase().includes('invalid or expired token') || 
                           data.message.toLowerCase().includes('invalid token') ||
                           data.message.toLowerCase().includes('expired token') ||
                           data.message.toLowerCase().includes('token expired'));
      
      if (isTokenError) {
        // Clear invalid token
        localStorage.removeItem('token');
        // Clear user-related data
        localStorage.removeItem('user');
        // Create a custom error that can be caught and handled
        const error = new Error(data.message || 'Invalid or expired token');
        error.isTokenError = true;
        error.status = response.status;
        throw error;
      }
      throw new Error(data?.message || 'API request failed');
    }
    
    return { data, status: response.status };
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.isTokenError) {
      throw error;
    }
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

// Mobile Brand APIs
export const mobileBrandAPI = {
  getAll: async () => {
    const { data } = await apiRequest('/mobile-brands');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/mobile-brands/${id}`);
    return data;
  },
};

// Mobile Model APIs
export const mobileModelAPI = {
  getAll: async () => {
    const { data } = await apiRequest('/mobile-models');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await apiRequest(`/mobile-models/${id}`);
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
    const { data, status } = await apiRequest(`/guest-cart/${guestCartId}/item/${productId}`, {
      method: 'DELETE',
    });
    // 204 No Content is expected for successful delete
    return { success: status === 204 || status === 200, data };
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
    const { data, status } = await apiRequest(`/cart/${productId}`, {
      method: 'DELETE',
    });
    // 204 No Content is expected for successful delete
    return { success: status === 204 || status === 200, data };
  },
  
  clear: async () => {
    const { data, status } = await apiRequest('/cart', {
      method: 'DELETE',
    });
    // 204 No Content is expected for successful delete
    return { success: status === 204 || status === 200, data };
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

  trackOrder: async (orderId) => {
    const { data } = await apiRequest(`/track/${orderId}`);
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

// User Authentication APIs
export const userAuthAPI = {
  signup: async (email, password) => {
    const { data } = await apiRequest('/auth/user/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  signin: async (email, password) => {
    const { data } = await apiRequest('/auth/user/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return data;
  },

  signout: async () => {
    const { data } = await apiRequest('/auth/user/signout', {
      method: 'POST',
    });
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await apiRequest('/auth/user/me');
    return data;
  },

  refreshToken: async () => {
    const { data } = await apiRequest('/auth/user/refresh-token', {
      method: 'POST',
    });
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await apiRequest('/auth/user/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data;
  },

  resetPassword: async (token, newPassword) => {
    const { data } = await apiRequest('/auth/user/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
    return data;
  },
};

// User Profile APIs
export const userAPI = {
  getProfile: async () => {
    const { data } = await apiRequest('/me');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await apiRequest('/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return data;
  },

  deleteAccount: async () => {
    const { data, status } = await apiRequest('/me', {
      method: 'DELETE',
    });
    return { success: status === 204 || status === 200, data };
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

  // Admin Management - CRUD
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

  // Category Management - CRUD
  createCategory: async (categoryData) => {
    const { data } = await adminApiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await adminApiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return data;
  },

  deleteCategory: async (id) => {
    await adminApiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Product Management - CRUD
  createProduct: async (formData) => {
    const token = getAdminToken();
    const url = `${API_BASE_URL}/products`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData for file uploads
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
    return data;
  },

  updateProduct: async (id, formData) => {
    const token = getAdminToken();
    const url = `${API_BASE_URL}/products/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // FormData for file uploads
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }
    return data;
  },

  deleteProduct: async (id) => {
    await adminApiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Mobile Brand Management - CRUD
  createMobileBrand: async (brandData) => {
    const { data } = await adminApiRequest('/mobile-brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
    return data;
  },

  updateMobileBrand: async (id, brandData) => {
    const { data } = await adminApiRequest(`/mobile-brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
    return data;
  },

  deleteMobileBrand: async (id) => {
    await adminApiRequest(`/mobile-brands/${id}`, {
      method: 'DELETE',
    });
  },

  // Mobile Model Management - CRUD
  createMobileModel: async (modelData) => {
    const { data } = await adminApiRequest('/mobile-models', {
      method: 'POST',
      body: JSON.stringify(modelData),
    });
    return data;
  },

  updateMobileModel: async (id, modelData) => {
    const { data } = await adminApiRequest(`/mobile-models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(modelData),
    });
    return data;
  },

  deleteMobileModel: async (id) => {
    await adminApiRequest(`/mobile-models/${id}`, {
      method: 'DELETE',
    });
  },

  // Case Details Management - CRUD
  createCaseDetail: async (caseData) => {
    const { data } = await adminApiRequest('/case-details', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
    return data;
  },

  updateCaseDetail: async (id, caseData) => {
    const { data } = await adminApiRequest(`/case-details/${id}`, {
      method: 'PUT',
      body: JSON.stringify(caseData),
    });
    return data;
  },

  deleteCaseDetail: async (id) => {
    await adminApiRequest(`/case-details/${id}`, {
      method: 'DELETE',
    });
  },

  // User Management (Admin only) - CRUD
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

  updateUser: async (id, userData) => {
    const { data } = await adminApiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return data;
  },

  deleteUser: async (id) => {
    await adminApiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Orders - CRUD
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
  mobileBrandAPI,
  mobileModelAPI,
  guestCartAPI,
  userCartAPI,
  checkoutAPI,
  orderAPI,
  paymentAPI,
  caseDetailsAPI,
  userAuthAPI,
  userAPI,
  adminAPI,
};
