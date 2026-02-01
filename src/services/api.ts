// ============================================
// CENTRALIZED API SERVICE
// ============================================
// This file contains all API endpoints for the Virtual Assistant Admin Panel.
// Replace the mock implementations with actual API calls to your backend.

import type { 
  User, 
  Bot, 
  BotUser, 
  Document, 
  IndexedUrl, 
  KnowledgeBaseSettings,
  DashboardStats,
  ApiResponse,
  PaginatedResponse 
} from '@/types';

// ============================================
// API BASE CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function for making API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add authentication headers here
        // 'Authorization': `Bearer ${getAuthToken()}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call failed:', error);
    throw error;
  }
}

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authApi = {
  /**
   * Login user
   * POST /auth/login
   * Body: { email: string, password: string }
   */
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    // TODO: Replace with actual API call
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall('/auth/logout', { method: 'POST' });
  },

  /**
   * Get current user
   * GET /auth/me
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // TODO: Replace with actual API call
    return apiCall('/auth/me');
  },
};

// ============================================
// DASHBOARD APIs
// ============================================

export const dashboardApi = {
  /**
   * Get dashboard statistics
   * GET /dashboard/stats
   */
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    // TODO: Replace with actual API call
    return apiCall('/dashboard/stats');
  },
};

// ============================================
// BOTS APIs
// ============================================

export const botsApi = {
  /**
   * Get all bots (paginated)
   * GET /bots?page=1&limit=10&search=query
   */
  getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Bot>> => {
    // TODO: Replace with actual API call
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return apiCall(`/bots?${params.toString()}`);
  },

  /**
   * Get single bot by ID
   * GET /bots/:id
   */
  getById: async (id: string): Promise<ApiResponse<Bot>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${id}`);
  },

  /**
   * Create new bot
   * POST /bots
   * Body: Partial<Bot>
   */
  create: async (botData: Partial<Bot>): Promise<ApiResponse<Bot>> => {
    // TODO: Replace with actual API call
    return apiCall('/bots', {
      method: 'POST',
      body: JSON.stringify(botData),
    });
  },

  /**
   * Update bot
   * PUT /bots/:id
   * Body: Partial<Bot>
   */
  update: async (id: string, botData: Partial<Bot>): Promise<ApiResponse<Bot>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(botData),
    });
  },

  /**
   * Delete bot
   * DELETE /bots/:id
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${id}`, { method: 'DELETE' });
  },

  /**
   * Toggle bot status (active/inactive)
   * PATCH /bots/:id/status
   * Body: { status: 'active' | 'inactive' }
   */
  toggleStatus: async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<Bot>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ============================================
// BOT USERS APIs
// ============================================

export const botUsersApi = {
  /**
   * Get all bot users (paginated)
   * GET /bot-users?page=1&limit=10&search=query
   */
  getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<BotUser>> => {
    // TODO: Replace with actual API call
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return apiCall(`/bot-users?${params.toString()}`);
  },

  /**
   * Get single bot user by ID
   * GET /bot-users/:id
   */
  getById: async (id: string): Promise<ApiResponse<BotUser>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bot-users/${id}`);
  },

  /**
   * Create new bot user
   * POST /bot-users
   * Body: { name: string, email: string, assignedBots: string[] }
   */
  create: async (userData: { name: string; email: string; assignedBots: string[] }): Promise<ApiResponse<BotUser>> => {
    // TODO: Replace with actual API call
    return apiCall('/bot-users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update bot user
   * PUT /bot-users/:id
   * Body: Partial<BotUser>
   */
  update: async (id: string, userData: Partial<BotUser>): Promise<ApiResponse<BotUser>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bot-users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete bot user
   * DELETE /bot-users/:id
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bot-users/${id}`, { method: 'DELETE' });
  },

  /**
   * Assign bot to user
   * POST /bot-users/:userId/assign-bot
   * Body: { botId: string }
   */
  assignBot: async (userId: string, botId: string): Promise<ApiResponse<BotUser>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bot-users/${userId}/assign-bot`, {
      method: 'POST',
      body: JSON.stringify({ botId }),
    });
  },

  /**
   * Unassign bot from user
   * POST /bot-users/:userId/unassign-bot
   * Body: { botId: string }
   */
  unassignBot: async (userId: string, botId: string): Promise<ApiResponse<BotUser>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bot-users/${userId}/unassign-bot`, {
      method: 'POST',
      body: JSON.stringify({ botId }),
    });
  },
};

// ============================================
// KNOWLEDGE BASE APIs
// ============================================

export const knowledgeBaseApi = {
  /**
   * Get all documents for a bot
   * GET /bots/:botId/documents
   */
  getDocuments: async (botId: string): Promise<ApiResponse<Document[]>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/documents`);
  },

  /**
   * Upload document
   * POST /bots/:botId/documents
   * Body: FormData with file
   */
  uploadDocument: async (botId: string, file: File): Promise<ApiResponse<Document>> => {
    // TODO: Replace with actual API call using FormData
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_BASE_URL}/bots/${botId}/documents`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    }).then(res => res.json());
  },

  /**
   * Delete document
   * DELETE /bots/:botId/documents/:documentId
   */
  deleteDocument: async (botId: string, documentId: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/documents/${documentId}`, { method: 'DELETE' });
  },

  /**
   * Get all indexed URLs for a bot
   * GET /bots/:botId/urls
   */
  getUrls: async (botId: string): Promise<ApiResponse<IndexedUrl[]>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/urls`);
  },

  /**
   * Add URL to index
   * POST /bots/:botId/urls
   * Body: { url: string, scope: string }
   */
  addUrl: async (botId: string, url: string, scope: string): Promise<ApiResponse<IndexedUrl>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/urls`, {
      method: 'POST',
      body: JSON.stringify({ url, scope }),
    });
  },

  /**
   * Delete indexed URL
   * DELETE /bots/:botId/urls/:urlId
   */
  deleteUrl: async (botId: string, urlId: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/urls/${urlId}`, { method: 'DELETE' });
  },

  /**
   * Get knowledge base settings
   * GET /bots/:botId/knowledge-base/settings
   */
  getSettings: async (botId: string): Promise<ApiResponse<KnowledgeBaseSettings>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/knowledge-base/settings`);
  },

  /**
   * Update knowledge base settings
   * PUT /bots/:botId/knowledge-base/settings
   * Body: Partial<KnowledgeBaseSettings>
   */
  updateSettings: async (botId: string, settings: Partial<KnowledgeBaseSettings>): Promise<ApiResponse<KnowledgeBaseSettings>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/knowledge-base/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  /**
   * Trigger manual re-indexing
   * POST /bots/:botId/knowledge-base/reindex
   */
  reindex: async (botId: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/bots/${botId}/knowledge-base/reindex`, { method: 'POST' });
  },
};

// ============================================
// ADMIN USERS APIs (for user management)
// ============================================

export const adminUsersApi = {
  /**
   * Get all admin users (paginated)
   * GET /admin/users?page=1&limit=10
   */
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
    // TODO: Replace with actual API call
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiCall(`/admin/users?${params.toString()}`);
  },

  /**
   * Create admin user
   * POST /admin/users
   * Body: { name: string, email: string, role: string, password: string }
   */
  create: async (userData: { name: string; email: string; role: string; password: string }): Promise<ApiResponse<User>> => {
    // TODO: Replace with actual API call
    return apiCall('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update admin user
   * PUT /admin/users/:id
   * Body: Partial<User>
   */
  update: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    // TODO: Replace with actual API call
    return apiCall(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete admin user
   * DELETE /admin/users/:id
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    // TODO: Replace with actual API call
    return apiCall(`/admin/users/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// EXPORT ALL APIs
// ============================================

export default {
  auth: authApi,
  dashboard: dashboardApi,
  bots: botsApi,
  botUsers: botUsersApi,
  knowledgeBase: knowledgeBaseApi,
  adminUsers: adminUsersApi,
};
