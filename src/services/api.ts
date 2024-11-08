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
  }
}; 