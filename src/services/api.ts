const API_URL = 'http://localhost:5000/api';

export const api = {
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

  // Camera endpoints
  async getCameras() {
    const response = await fetch(`${API_URL}/cameras`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(cameraData),
    });
    return response.json();
  },

  async getCameraFeeds() {
    try {
      const response = await fetch(`${API_URL}/camera-feeds`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Camera Feeds Error:', error);
      throw error;
    }
  },

  // Recording endpoints
  async getRecordings() {
    const response = await fetch(`${API_URL}/recordings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  async getCameraRecordings(cameraId: string) {
    const response = await fetch(`${API_URL}/recordings/camera/${cameraId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  // Alert endpoints
  async getAlerts() {
    const response = await fetch(`${API_URL}/alerts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(alertData),
    });
    return response.json();
  },

  async resolveAlert(alertId: string) {
    const response = await fetch(`${API_URL}/alerts/${alertId}/resolve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
}; 