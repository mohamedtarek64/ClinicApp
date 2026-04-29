import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// إنشاء نسخة Axios مجهزة
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة التوكن تلقائياً لكل الطلبات لو موجود
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/Accounts/login', { 
        UserNameOrEmail: email, 
        Password: password 
      });
      
      const { accessToken, refreshToken } = response.data;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify({ email }));
      }
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      throw error.response?.data || "Login failed. Please check your credentials.";
    }
  },

  register: async (userData) => {
    try {
      // تجهيز بيانات الشخص (تحويل الاسم لمصفوفة)
      const names = userData.username.split(' ');
      const firstName = names[0] || 'Patient';
      const lastName = names.slice(1).join(' ') || 'User';

      const payload = {
        UserName: userData.username.replace(/\s+/g, ''),
        Email: userData.email,
        Password: userData.password,
        PhoneNumber: "0123456789", // قيمة افتراضية
        Person: {
          FirstName: firstName,
          LastName: lastName,
          DateOfBirth: "1990-01-01",
          Gender: 0,
          Address: "Default Address"
        }
      };

      const response = await api.post('/Accounts/patients/register', payload);
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      throw error.response?.data || "Registration failed.";
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    try {
      const response = await api.get('/Accounts/profile');
      return response.data;
    } catch (error) {
      console.error("Profile Fetch Error:", error.response?.data || error.message);
      throw error.response?.data || "Failed to fetch profile.";
    }
  }
};

export const doctorService = {
  getAll: async () => {
    try {
      const response = await api.get('/Doctors');
      return response.data;
    } catch (error) {
      console.error("Fetch Doctors Error:", error.response?.data || error.message);
      throw error.response?.data || "Failed to fetch doctors.";
    }
  }
};

export const appointmentService = {
  create: async (appointmentData) => {
    try {
      const response = await api.post('/Appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      throw error.response?.data || "Failed to book appointment.";
    }
  },
  
  getPatientAppointments: async (patientId) => {
    try {
      const response = await api.get(`/Appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch Appointments Error:", error.response?.data || error.message);
      throw error.response?.data || "Failed to fetch appointments.";
    }
  }
};

export const aiService = {
  predict: async (disease, data) => {
    try {
      const response = await api.post('/Diagnosis/predict', {
        disease,
        data
      });
      return response.data;
    } catch (error) {
      console.error("AI Error:", error.response?.data || error.message);
      throw error.response?.data || "AI Analysis failed.";
    }
  }
};

export default api;
