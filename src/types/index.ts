// ============================================
// TYPE DEFINITIONS FOR API RESPONSES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  createdBy: string;
  createdAt: string;
  totalConversations: number;
  avgResponseTime: string;
  
  // Configuration fields
  welcomeMessage?: string;
  idleTimeout?: number;
  voiceSearchEnabled?: boolean;
  feedbackEnabled?: boolean;
  streamChatEnabled?: boolean;
  suggestionsEnabled?: boolean;
  supportedLanguages?: string[];
  systemPrompt?: string;
  personaStyle?: string;
  conversationMemory?: boolean;
  fallbackMessage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  botPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomePopupText?: string;
}

export interface BotUser {
  id: string;
  name: string;
  email: string;
  assignedBots: string[]; // Array of bot IDs
  createdAt: string;
  lastActive: string;
  totalInteractions: number;
}

export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
  status: 'completed' | 'processing' | 'failed';
  botId: string;
}

export interface IndexedUrl {
  id: string;
  url: string;
  scope: 'entire-site' | 'single-page' | 'second-level-pages';
  addedDate: string;
  status: 'completed' | 'processing' | 'failed';
  botId: string;
}

export interface KnowledgeBaseSettings {
  autoIndexEnabled: boolean;
  chunkSize: number;
  chunkOverlap: number;
  lastReindexDate?: string;
}

export interface DashboardStats {
  totalBots: number;
  activeBots: number;
  totalUsers: number;
  totalConversations: number;
  avgResponseTime: string;
}

export interface Conversation {
  id: string;
  botId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  messageCount: number;
  status: 'active' | 'closed';
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}
