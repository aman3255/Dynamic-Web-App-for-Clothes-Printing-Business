import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/'; // Updated to include API version path

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up error handling for response
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

const api = {
  setAuthToken: (token: string) => {
    localStorage.setItem('token', token);
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    localStorage.removeItem('token');
    delete instance.defaults.headers.common.Authorization;
  },

  // Auth API
  auth: {
    register: (userData: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      addresses?: string[];
    }) => {
      return instance.post('/auth/signup', userData);
    },
    login: (credentials: { email: string; phone: string; password: string }) => {
      return instance.post('/auth/signin', credentials);
    },
    getCurrentUser: () => {
      return instance.get('/auth/me');
    },
  },

  // General API methods
  post: (url: string, data: any) => instance.post(url, data),
  get: (url: string) => instance.get(url),
  put: (url: string, data: any) => instance.put(url, data),
  delete: (url: string) => instance.delete(url),

  // Products API
  getProducts: () => instance.get('/products'),
  getProductsByCategory: (category: string) => instance.get(`/products/retrieve/${category}`),
  getProductById: (id: string) => instance.get(`/products/${id}`),

  // Orders API
  createOrder: (orderData: any) => instance.post('/orders', orderData),
  getOrders: () => instance.get('/orders'),
  getOrderById: (id: string) => instance.get(`/orders/${id}`),
  uploadDesign: (file: File) => {
    const formData = new FormData();
    formData.append('design', file);
    return instance.post('/orders/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Payments API
  createPaymentIntent: (amount: number) =>
    instance.post('/payments/create-payment-intent', { amount }),
};

export default api;