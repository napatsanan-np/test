// API Service - สำหรับเชื่อมต่อ Backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============= AUTH APIs =============
export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', 'POST', {
      first_name: userData.firstName,
      last_name: userData.lastName,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      phone_number: userData.tel,
      student_id: userData.studentId || '',
    });
  },

  login: async (username, password) => {
    return apiCall('/auth/login', 'POST', {
      username,
      password,
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', 'POST');
  },
};

// ============= COURTS APIs =============
export const courtsAPI = {
  getCourtsBySport: async (sportType) => {
    return apiCall(`/courts/${sportType}`, 'GET');
  },

  getAllCourts: async () => {
    return apiCall('/courts', 'GET');
  },

  getSportTypes: async () => {
    return apiCall('/sports', 'GET');
  },
};

// ============= SLOTS APIs =============
export const slotsAPI = {
  getAvailableSlots: async (courtId, date) => {
    return apiCall(`/slots/available?court_id=${courtId}&date=${date}`, 'GET');
  },
};

// ============= BOOKING APIs =============
export const bookingsAPI = {
  createBooking: async (courtId, startTime, endTime) => {
    return apiCall('/bookings', 'POST', {
      court_id: courtId,
      booking_date: new Date().toISOString().split('T')[0],
      start_time: startTime,
      end_time: endTime,
    });
  },

  getHistory: async () => {
    return apiCall('/bookings/history', 'GET');
  },

  deleteBooking: async (bookingId) => {
    return apiCall(`/bookings/${bookingId}`, 'DELETE');
  },
};

// ============= USER APIs =============
export const usersAPI = {
  getProfile: async (userId) => {
    return apiCall(`/users/${userId}`, 'GET');
  },
};

// ============= ADMIN APIs =============
export const adminAPI = {
  resetBookings: async () => {
    return apiCall('/admin/bookings/reset', 'POST');
  },
};

export default {
  authAPI,
  courtsAPI,
  slotsAPI,
  bookingsAPI,
  usersAPI,
  adminAPI,
};
