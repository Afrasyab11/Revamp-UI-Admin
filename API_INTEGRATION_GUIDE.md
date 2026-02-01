# API Integration Guide for Virtual Assistant Admin Panel

This guide helps developers quickly integrate the UI with backend APIs.

## 📁 File Structure

```
/src
  /types
    index.ts          # TypeScript type definitions for all data models
  /services
    api.ts            # Centralized API service with all endpoints
  /app
    /components       # UI components that need API integration
```

## 🚀 Quick Start

### 1. Configure API Base URL

Set your API base URL in environment variables:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
```

Or update directly in `/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### 2. Add Authentication Token

Update the `apiCall` helper in `/src/services/api.ts` to include your auth token:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Add this
  ...options?.headers,
},
```

### 3. Import and Use APIs

In any component, import the API service:

```typescript
import api from '@/services/api';

// Example: Fetch all bots
const response = await api.bots.getAll(1, 10);
if (response.success) {
  setBots(response.data);
}
```

## 📋 API Integration Checklist

### ✅ Authentication (Login.tsx)
- [ ] Wire `api.auth.login()` to login form
- [ ] Store JWT token in localStorage/cookies
- [ ] Redirect to dashboard on success

### ✅ Dashboard (Dashboard.tsx)
- [ ] Wire `api.dashboard.getStats()` on component mount
- [ ] Replace mock stats with real data

### ✅ Bots Management (BotsList.tsx)
- [ ] Wire `api.bots.getAll()` for listing bots
- [ ] Wire `api.bots.create()` for bot creation form
- [ ] Wire `api.bots.delete()` for bot deletion
- [ ] Wire `api.bots.toggleStatus()` for status toggle

### ✅ Bot Configuration (BotConfiguration.tsx)
- [ ] Wire `api.bots.getById()` on component mount
- [ ] Wire `api.bots.update()` on save button click
- [ ] See detailed integration points below

### ✅ Bot Users (BotsUsers.tsx)
- [ ] Wire `api.botUsers.getAll()` for listing users
- [ ] Wire `api.botUsers.create()` for user creation
- [ ] Wire `api.botUsers.delete()` for user deletion

### ✅ Edit User (EditUser.tsx)
- [ ] Wire `api.botUsers.getById()` on component mount
- [ ] Wire `api.botUsers.update()` on save
- [ ] Wire `api.botUsers.assignBot()` and `unassignBot()`

### ✅ Knowledge Base
- [ ] Wire `api.knowledgeBase.getDocuments()` on load
- [ ] Wire `api.knowledgeBase.uploadDocument()` for file upload
- [ ] Wire `api.knowledgeBase.deleteDocument()` for deletion
- [ ] Wire `api.knowledgeBase.addUrl()` for URL indexing
- [ ] Wire `api.knowledgeBase.deleteUrl()` for URL deletion
- [ ] Wire `api.knowledgeBase.reindex()` for manual reindex

## 🔌 Detailed Integration Points

### Login Component
**File:** `/src/app/components/Login.tsx`

**Location:** Line ~50 in `handleLogin` function

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // TODO: Replace with API call
    const response = await api.auth.login(email, password);
    
    if (response.success) {
      // Store token
      localStorage.setItem('authToken', response.data.token);
      
      // Redirect to dashboard
      onLoginSuccess();
      toast.success('Login successful!');
    }
  } catch (error) {
    toast.error('Invalid credentials');
  } finally {
    setIsLoading(false);
  }
};
```

---

### Dashboard Component
**File:** `/src/app/components/Dashboard.tsx`

**Location:** Add `useEffect` hook to fetch stats

```typescript
import { useEffect } from 'react';
import api from '@/services/api';

// Inside component, add useEffect:
useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await api.dashboard.getStats();
      if (response.success) {
        // Update state with real data
        // setTotalBots(response.data.totalBots);
        // etc.
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    }
  };
  
  fetchStats();
}, []);
```

---

### Bots List Component
**File:** `/src/app/components/BotsList.tsx`

**Integration Points:**

1. **Fetch Bots on Mount**
```typescript
useEffect(() => {
  const fetchBots = async () => {
    setIsLoading(true);
    try {
      const response = await api.bots.getAll(currentPage, rowsPerPage, searchQuery);
      if (response.success) {
        setBots(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load bots');
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchBots();
}, [currentPage, rowsPerPage, searchQuery]);
```

2. **Create Bot** (Line ~120 in `handleCreateBot`)
```typescript
const handleCreateBot = async () => {
  try {
    const response = await api.bots.create({
      name: newBotName,
      description: newBotDescription,
    });
    
    if (response.success) {
      toast.success('Bot created successfully!');
      setIsCreateDialogOpen(false);
      // Refresh bots list
      fetchBots();
    }
  } catch (error) {
    toast.error('Failed to create bot');
  }
};
```

3. **Delete Bot** (Line ~90 in `handleConfirmDelete`)
```typescript
const handleConfirmDelete = async () => {
  try {
    await api.bots.delete(deleteConfirmation.botId);
    toast.success('Bot deleted successfully');
    // Refresh bots list
    fetchBots();
  } catch (error) {
    toast.error('Failed to delete bot');
  }
};
```

4. **Toggle Status** (Line ~75 in `handleStatusToggle`)
```typescript
const handleStatusToggle = async (botId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  try {
    await api.bots.toggleStatus(botId, newStatus);
    toast.success(`Bot ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    // Refresh bots list
    fetchBots();
  } catch (error) {
    toast.error('Failed to update bot status');
  }
};
```

---

### Bot Configuration Component
**File:** `/src/app/components/BotConfiguration.tsx`

**Integration Points:**

1. **Load Bot Data on Mount**
```typescript
useEffect(() => {
  const fetchBotConfig = async () => {
    try {
      const response = await api.bots.getById(botId);
      if (response.success) {
        const bot = response.data;
        // Update all state with bot data
        setBotName(bot.name || '');
        setWelcomeMessage(bot.welcomeMessage || '');
        setPrimaryColor(bot.primaryColor || '#3B82F6');
        // ... etc for all fields
      }
    } catch (error) {
      toast.error('Failed to load bot configuration');
    }
  };
  
  fetchBotConfig();
}, [botId]);
```

2. **Save Configuration** (Line ~210 in `handleSaveConfiguration`)
```typescript
const handleSaveConfiguration = async () => {
  setIsSaving(true);
  
  try {
    const response = await api.bots.update(botId, {
      name: botName,
      welcomeMessage,
      idleTimeout: parseInt(idleTimeout),
      voiceSearchEnabled,
      feedbackEnabled,
      streamChatEnabled,
      suggestionsEnabled,
      supportedLanguages,
      systemPrompt,
      personaStyle,
      conversationMemory,
      fallbackMessage,
      primaryColor,
      secondaryColor,
      botPosition,
      welcomePopupText,
    });
    
    if (response.success) {
      toast.success('Bot configuration saved successfully!');
    }
  } catch (error) {
    toast.error('Failed to save configuration');
  } finally {
    setIsSaving(false);
  }
};
```

3. **Upload Document** (Line ~115 in `handleFileUpload`)
```typescript
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const response = await api.knowledgeBase.uploadDocument(botId, file);
        if (response.success) {
          setUploadedDocuments(prev => [...prev, response.data]);
          toast.success(`${file.name} uploaded successfully`);
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }
};
```

4. **Delete Document** (Line ~155 in `handleConfirmDelete`)
```typescript
const handleConfirmDelete = async () => {
  const { itemId, itemType } = deleteConfirmation;
  
  try {
    if (itemType === 'document') {
      await api.knowledgeBase.deleteDocument(botId, itemId);
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== itemId));
    } else if (itemType === 'url') {
      await api.knowledgeBase.deleteUrl(botId, itemId);
      setAddedUrls(prev => prev.filter(url => url.id !== itemId));
    }
    toast.success('Deleted successfully');
  } catch (error) {
    toast.error('Failed to delete');
  }
};
```

5. **Add URL** (Line ~145 in `handleAddUrl`)
```typescript
const handleAddUrl = async () => {
  if (!urlInput.trim()) return;
  
  try {
    const response = await api.knowledgeBase.addUrl(botId, urlInput, urlScope);
    if (response.success) {
      setAddedUrls(prev => [...prev, response.data]);
      setUrlInput('');
      toast.success('URL added successfully');
    }
  } catch (error) {
    toast.error('Failed to add URL');
  }
};
```

6. **Reindex Knowledge Base** (Line ~225 in `handleReindex`)
```typescript
const handleReindex = async () => {
  setIsReindexing(true);
  
  try {
    await api.knowledgeBase.reindex(botId);
    toast.success('Re-indexing started. This may take a few minutes.');
  } catch (error) {
    toast.error('Failed to start re-indexing');
  } finally {
    setIsReindexing(false);
  }
};
```

---

### Bot Users Component
**File:** `/src/app/components/BotsUsers.tsx`

**Integration Points:**

1. **Fetch Users**
```typescript
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await api.botUsers.getAll(currentPage, rowsPerPage, searchQuery);
      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load users');
    }
  };
  
  fetchUsers();
}, [currentPage, rowsPerPage, searchQuery]);
```

2. **Create User**
```typescript
const handleCreateUser = async () => {
  try {
    const response = await api.botUsers.create({
      name: newUserName,
      email: newUserEmail,
      assignedBots: [],
    });
    
    if (response.success) {
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      fetchUsers();
    }
  } catch (error) {
    toast.error('Failed to create user');
  }
};
```

3. **Delete User**
```typescript
const handleDeleteUser = async (userId: string) => {
  try {
    await api.botUsers.delete(userId);
    toast.success('User deleted successfully');
    fetchUsers();
  } catch (error) {
    toast.error('Failed to delete user');
  }
};
```

---

### Edit User Component
**File:** `/src/app/components/EditUser.tsx`

**Integration Points:**

1. **Load User Data**
```typescript
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.botUsers.getById(userId);
      if (response.success) {
        setUserName(response.data.name);
        setUserEmail(response.data.email);
        setAssignedBots(response.data.assignedBots);
      }
    } catch (error) {
      toast.error('Failed to load user');
    }
  };
  
  fetchUser();
}, [userId]);
```

2. **Save User**
```typescript
const handleSave = async () => {
  try {
    await api.botUsers.update(userId, {
      name: userName,
      email: userEmail,
      assignedBots,
    });
    toast.success('User updated successfully');
    onBack();
  } catch (error) {
    toast.error('Failed to update user');
  }
};
```

3. **Assign Bot**
```typescript
const handleAssignBot = async (botId: string) => {
  try {
    await api.botUsers.assignBot(userId, botId);
    setAssignedBots(prev => [...prev, botId]);
    toast.success('Bot assigned successfully');
  } catch (error) {
    toast.error('Failed to assign bot');
  }
};
```

4. **Unassign Bot**
```typescript
const handleUnassignBot = async (botId: string) => {
  try {
    await api.botUsers.unassignBot(userId, botId);
    setAssignedBots(prev => prev.filter(id => id !== botId));
    toast.success('Bot unassigned successfully');
  } catch (error) {
    toast.error('Failed to unassign bot');
  }
};
```

---

## 📊 Expected API Response Format

All API endpoints should return responses in this format:

### Success Response
```json
{
  "success": true,
  "data": { /* your data here */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": { /* optional additional info */ }
}
```

## 🔐 Authentication Flow

1. User submits login credentials
2. Call `api.auth.login(email, password)`
3. Store returned JWT token in localStorage
4. Include token in all subsequent API calls (already handled in `apiCall` helper)
5. On logout, call `api.auth.logout()` and clear localStorage

## 📝 Notes

- All API functions are async and return Promises
- All type definitions are in `/src/types/index.ts`
- Error handling is built into the `apiCall` helper
- Toast notifications are used throughout for user feedback
- All TODO comments mark exact integration points

## 🐛 Debugging

Enable API call logging by adding to `/src/services/api.ts`:

```typescript
async function apiCall<T>(endpoint: string, options?: RequestInit) {
  console.log('🔵 API Call:', endpoint, options); // Add this
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      // ... rest of code
    });
    
    console.log('🟢 API Response:', response); // Add this
    return await response.json();
  } catch (error) {
    console.error('🔴 API Error:', error); // Already there
    throw error;
  }
}
```

## ✅ Testing

Test API integration step by step:

1. Start with authentication
2. Then dashboard stats
3. Then CRUD operations (Create, Read, Update, Delete)
4. Finally complex operations (file uploads, bot assignments)

Good luck! 🚀
