const API_BASE = '/api/v1';

// Token helpers
export const getToken = () => localStorage.getItem('tv_token');
export const setToken = (token) => localStorage.setItem('tv_token', token);
export const removeToken = () => {
  localStorage.removeItem('tv_token');
  localStorage.removeItem('tv_user');
};

export const getUser = () => {
  const u = localStorage.getItem('tv_user');
  return u ? JSON.parse(u) : null;
};
export const setUser = (user) => localStorage.setItem('tv_user', JSON.stringify(user));

const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    setToken(json.data.token);
    setUser({
      id: json.data.id,
      fullName: json.data.fullName,
      email: json.data.email,
      role: json.data.role,
      avatarUrl: json.data.avatarUrl,
    });
    return json.data;
  },

  async register(fullName, email, password, phone, role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone, role }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    setToken(json.data.token);
    setUser({
      id: json.data.id,
      fullName: json.data.fullName,
      email: json.data.email,
      role: json.data.role,
      avatarUrl: json.data.avatarUrl,
    });
    return json.data;
  },

  // Tour Packages
  async getPackages(params = {}) {
    const query = new URLSearchParams();
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);

    const res = await fetch(`${API_BASE}/packages?${query.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  async getFeaturedPackages() {
    const res = await fetch(`${API_BASE}/packages/featured`);
    const json = await res.json();
    return json.data || [];
  },

  async getPackageById(id) {
    const res = await fetch(`${API_BASE}/packages/${id}`);
    const json = await res.json();
    return json.data;
  },

  // Destinations
  async getDestinations() {
    const res = await fetch(`${API_BASE}/destinations`);
    const json = await res.json();
    return json.data || [];
  },

  // Coupons
  async validateCoupon(code, baseAmount) {
    const res = await fetch(`${API_BASE}/coupons/validate?code=${encodeURIComponent(code)}&baseAmount=${baseAmount}`);
    const json = await res.json();
    return json.data;
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(bookingData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Booking failed');
    return json.data;
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    return json.data || [];
  },

  async cancelBooking(reference) {
    const res = await fetch(`${API_BASE}/bookings/${reference}/cancel`, {
      method: 'POST',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Cancellation failed');
    return json.data;
  },

  // Payments
  async checkout(paymentData) {
    const res = await fetch(`${API_BASE}/payments/checkout`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(paymentData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Payment checkout failed');
    return json.data;
  },

  // Reviews
  async getReviews(packageId) {
    const res = await fetch(`${API_BASE}/reviews/package/${packageId}`);
    const json = await res.json();
    return json.data || [];
  },

  async getRecentReviews() {
    const res = await fetch(`${API_BASE}/reviews/recent`);
    const json = await res.json();
    return json.data || [];
  },

  async postReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(reviewData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Review submission failed');
    return json.data;
  },

  // Admin
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    return json.data;
  },

  async getAllBookingsAdmin() {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    return json.data || [];
  },

  async updateBookingStatusAdmin(reference, status) {
    const res = await fetch(`${API_BASE}/admin/bookings/${reference}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    return json.data;
  },

  // AI Recommendation
  async getAIRecommendation(preferences) {
    const res = await fetch(`${API_BASE}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const json = await res.json();
    return json.data;
  },
};
