import axios from "axios";

// Create axios instance with base configuration
const API = axios.create({
  baseURL: "https://webhook.wiral.ai/api", // Updated to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens if needed
API.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Client API functions
export const clientAPI = {
  // Get all clients (returns decrypted data from backend)
  getAllClients: () => API.get("/clients"),

  // Get client by ID (returns decrypted data from backend)
  getClientById: (id) => API.get(`/clients/${id}`),

  // Get client with masked API keys for display
  getClientMasked: (id) => API.get(`/clients/${id}/masked`),

  // Create new client (backend handles encryption)
  createClient: (clientData) => API.post("/clients", clientData),

  // Update client (backend handles encryption)
  updateClient: (id, clientData) => API.put(`/clients/${id}`, clientData),

  // Delete client
  deleteClient: (id) => API.delete(`/clients/${id}`),
};

// File Management API functions
export const fileAPI = {
  // Upload file for a client
  uploadFile: (accountId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountId", accountId);

    return API.post("/rags/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get all documents for a client
  getDocuments: (accountId) => API.get(`/rags/documents/${accountId}`),

  // Delete a document
  deleteDocument: (accountId, documentId) =>
    API.delete(`/rags/document/${accountId}/${documentId}`),

  // Process URL for a client
  processURL: (accountId, url) => API.post("/rags/url", { accountId, url }),

  // Get all processed URLs for a client
  getProcessedURLs: (accountId) => API.get(`/rags/urls/${accountId}`),

  // Delete a URL document
  deleteURLDocument: (accountId, url) =>
    API.delete(`/rags/url/${accountId}`, { data: { url } }),

  // Get file access information
  getFileAccess: (accountId, documentId) =>
    API.get(`/rags/file/${accountId}/${documentId}`),

  // Download file through secure proxy
  downloadFile: (accountId, documentId) =>
    API.get(`/rags/download/${accountId}/${documentId}`, {
      responseType: "blob", // Important for file downloads
    }),
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: (credentials) => API.post("/auth/login", credentials),
  
  // Logout user
  logout: () => API.post("/auth/logout"),
  
  // Verify token
  verifyToken: () => API.get("/auth/verify"),
  
  // Get current user info
  getCurrentUser: () => API.get("/auth/me"),
};

export default API;
