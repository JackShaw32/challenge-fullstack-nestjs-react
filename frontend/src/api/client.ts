/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorMessage = isJson ? (data.message || JSON.stringify(data)) : data;
        throw new Error(errorMessage || 'Error en la solicitud');
      }

      return data;
      
    } catch (error: any) {
      console.error("API Error:", error.message);
      throw error;
    }
  },

  get: (endpoint: string) => apiClient.request(endpoint),
  
  post: (endpoint: string, data: unknown) =>
    apiClient.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (endpoint: string, data: unknown) =>
    apiClient.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint: string) =>
    apiClient.request(endpoint, { method: 'DELETE' }),
};