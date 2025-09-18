const API_URL = 'http://localhost:5000/api';

export const api = {
  authHeader() {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  },

  async test() {
    try {
      const response = await fetch(`${API_URL}/test`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Test Error:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  },

  // Camera endpoints
  async getCameras() {
    const response = await fetch(`${API_URL}/cameras`, {
      headers: this.authHeader(),
    });
    return response.json();
  },

  async addCamera(cameraData: {
    name: string;
    url: string;
    username?: string;
    password?: string;
  }) {
    const response = await fetch(`${API_URL}/cameras`, {
      method: 'POST',
      headers: {
        ...this.authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cameraData),
    });
    return response.json();
  },

  // Recording endpoints
  async getRecordings() {
    const response = await fetch(`${API_URL}/recordings`, {
      headers: this.authHeader(),
    });
    return response.json();
  },

  async getCameraRecordings(cameraId: string) {
    const response = await fetch(`${API_URL}/recordings/camera/${cameraId}`, {
      headers: this.authHeader(),
    });
    return response.json();
  },

  // Alert endpoints
  async getAlerts() {
    const response = await fetch(`${API_URL}/alerts`, {
      headers: this.authHeader(),
    });
    return response.json();
  },

  async createAlert(alertData: {
    type: string;
    camera: string;
    severity: string;
    message: string;
  }) {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: {
        ...this.authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });
    return response.json();
  },

  async resolveAlert(alertId: string) {
    const response = await fetch(`${API_URL}/alerts/${alertId}/resolve`, {
      method: 'PATCH',
      headers: this.authHeader(),
    });
    return response.json();
  },

  async requestPasswordReset(email: string) {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Password Reset Request Error:', error);
      throw error;
    }
  },

  async resetPassword(token: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      return data;
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  },
}; 