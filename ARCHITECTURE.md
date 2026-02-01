# System Architecture & Data Flow

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TypeScript)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     UI Components                         │  │
│  │  - Login.tsx                                             │  │
│  │  - Dashboard.tsx                                         │  │
│  │  - BotsList.tsx                                          │  │
│  │  - BotConfiguration.tsx                                  │  │
│  │  - BotsUsers.tsx                                         │  │
│  │  - EditUser.tsx                                          │  │
│  └───────────────┬──────────────────────────────────────────┘  │
│                  │                                               │
│                  │ import api                                    │
│                  ▼                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Service Layer                            │  │
│  │              /src/services/api.ts                         │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ api.auth          - Authentication                  │  │  │
│  │  │ api.dashboard     - Dashboard stats                 │  │  │
│  │  │ api.bots          - Bot CRUD operations             │  │  │
│  │  │ api.botUsers      - Bot users CRUD                  │  │  │
│  │  │ api.knowledgeBase - Documents & URLs                │  │  │
│  │  │ api.adminUsers    - Admin user management           │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └───────────────┬──────────────────────────────────────────┘  │
│                  │                                               │
└──────────────────┼───────────────────────────────────────────────┘
                   │
                   │ HTTP Requests (JSON)
                   │ Authorization: Bearer {token}
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API SERVER                         │
│                    (Your Implementation)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Endpoints                          │  │
│  │                                                            │  │
│  │  POST   /api/auth/login                                   │  │
│  │  POST   /api/auth/logout                                  │  │
│  │  GET    /api/auth/me                                      │  │
│  │                                                            │  │
│  │  GET    /api/dashboard/stats                              │  │
│  │                                                            │  │
│  │  GET    /api/bots                                         │  │
│  │  POST   /api/bots                                         │  │
│  │  GET    /api/bots/:id                                     │  │
│  │  PUT    /api/bots/:id                                     │  │
│  │  DELETE /api/bots/:id                                     │  │
│  │  PATCH  /api/bots/:id/status                              │  │
│  │                                                            │  │
│  │  GET    /api/bots/:id/documents                           │  │
│  │  POST   /api/bots/:id/documents                           │  │
│  │  DELETE /api/bots/:id/documents/:docId                    │  │
│  │                                                            │  │
│  │  GET    /api/bots/:id/urls                                │  │
│  │  POST   /api/bots/:id/urls                                │  │
│  │  DELETE /api/bots/:id/urls/:urlId                         │  │
│  │                                                            │  │
│  │  GET    /api/bot-users                                    │  │
│  │  POST   /api/bot-users                                    │  │
│  │  GET    /api/bot-users/:id                                │  │
│  │  PUT    /api/bot-users/:id                                │  │
│  │  DELETE /api/bot-users/:id                                │  │
│  │  POST   /api/bot-users/:id/assign-bot                     │  │
│  │  POST   /api/bot-users/:id/unassign-bot                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │     Database     │
                  │  (Your Choice)   │
                  │ - PostgreSQL     │
                  │ - MongoDB        │
                  │ - MySQL          │
                  └──────────────────┘
```

---

## 🔄 Data Flow Examples

### Example 1: User Logs In

```
┌─────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│  User   │────────▶│ Login.tsx│────────▶│ api.ts  │────────▶│  Backend │
└─────────┘         └──────────┘         └─────────┘         └──────────┘
    │                    │                    │                     │
    │ Enter email &      │                    │                     │
    │ password           │                    │                     │
    │                    │                    │                     │
    │               handleLogin()             │                     │
    │                    │──── api.auth.login() ───▶               │
    │                    │                    │                     │
    │                    │                    │    POST /auth/login │
    │                    │                    │ ─────────────────▶  │
    │                    │                    │                     │
    │                    │                    │   Verify credentials│
    │                    │                    │   Generate JWT      │
    │                    │                    │                     │
    │                    │                    │◀─────────────────── │
    │                    │                    │  { token, user }    │
    │                    │◀──── return ───────│                     │
    │                    │                    │                     │
    │         Save token in localStorage      │                     │
    │         Redirect to Dashboard           │                     │
    │◀───────────────────│                    │                     │
```

### Example 2: Load Bots List

```
┌──────────┐      ┌────────────┐      ┌─────────┐      ┌──────────┐
│Component │─────▶│BotsList.tsx│─────▶│ api.ts  │─────▶│  Backend │
└──────────┘      └────────────┘      └─────────┘      └──────────┘
                        │                   │                 │
                   useEffect()              │                 │
                        │──── api.bots.getAll() ────▶         │
                        │                   │                 │
                        │                   │   GET /bots?    │
                        │                   │   page=1&limit=10
                        │                   │ ─────────────▶  │
                        │                   │                 │
                        │                   │   Query database│
                        │                   │                 │
                        │                   │◀─────────────── │
                        │                   │ { data, pagination }
                        │◀──── return ──────│                 │
                        │                   │                 │
                   setBots(data)            │                 │
                   Display in table         │                 │
```

### Example 3: Save Bot Configuration

```
┌─────────┐    ┌──────────────────┐    ┌─────────┐    ┌──────────┐
│  User   │───▶│BotConfiguration  │───▶│ api.ts  │───▶│  Backend │
└─────────┘    └──────────────────┘    └─────────┘    └──────────┘
    │                   │                    │               │
    │ Click Save        │                    │               │
    │                   │                    │               │
    │         handleSaveConfiguration()      │               │
    │                   │                    │               │
    │                   │── api.bots.update() ──▶           │
    │                   │   (botId, config)  │               │
    │                   │                    │               │
    │                   │                    │  PUT /bots/:id│
    │                   │                    │  + config data│
    │                   │                    │ ───────────▶  │
    │                   │                    │               │
    │                   │                    │  Update DB    │
    │                   │                    │               │
    │                   │                    │◀───────────── │
    │                   │                    │  { success }  │
    │                   │◀──── return ───────│               │
    │                   │                    │               │
    │         Show success toast             │               │
    │◀──────────────────│                    │               │
```

### Example 4: Upload Document to Knowledge Base

```
┌─────────┐    ┌──────────────────┐    ┌─────────┐    ┌──────────┐
│  User   │───▶│BotConfiguration  │───▶│ api.ts  │───▶│  Backend │
└─────────┘    └──────────────────┘    └─────────┘    └──────────┘
    │                   │                    │               │
    │ Select file       │                    │               │
    │                   │                    │               │
    │         handleFileUpload()             │               │
    │                   │                    │               │
    │                   │ api.knowledgeBase  │               │
    │                   │   .uploadDocument()│               │
    │                   │   (botId, file)    │               │
    │                   │ ─────────────────▶ │               │
    │                   │                    │               │
    │                   │                    │ POST /bots/:id/
    │                   │                    │    documents  │
    │                   │                    │ FormData + file
    │                   │                    │ ───────────▶  │
    │                   │                    │               │
    │                   │                    │ Save file     │
    │                   │                    │ Process/Index │
    │                   │                    │               │
    │                   │                    │◀───────────── │
    │                   │                    │ { document }  │
    │                   │◀─────────────────  │               │
    │                   │                    │               │
    │         Add to documents list          │               │
    │         Show success toast             │               │
    │◀──────────────────│                    │               │
```

---

## 📦 Data Models

### User
```typescript
{
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
}
```

### Bot
```typescript
{
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  createdBy: string
  createdAt: string
  totalConversations: number
  avgResponseTime: string
  
  // Configuration
  welcomeMessage?: string
  idleTimeout?: number
  voiceSearchEnabled?: boolean
  feedbackEnabled?: boolean
  streamChatEnabled?: boolean
  suggestionsEnabled?: boolean
  supportedLanguages?: string[]
  systemPrompt?: string
  personaStyle?: string
  conversationMemory?: boolean
  fallbackMessage?: string
  primaryColor?: string
  secondaryColor?: string
  botPosition?: string
  welcomePopupText?: string
}
```

### BotUser
```typescript
{
  id: string
  name: string
  email: string
  assignedBots: string[]  // Array of bot IDs
  createdAt: string
  lastActive: string
  totalInteractions: number
}
```

### Document
```typescript
{
  id: string
  name: string
  uploadDate: string
  size: number
  status: 'completed' | 'processing' | 'failed'
  botId: string
}
```

### IndexedUrl
```typescript
{
  id: string
  url: string
  scope: 'entire-site' | 'single-page' | 'second-level-pages'
  addedDate: string
  status: 'completed' | 'processing' | 'failed'
  botId: string
}
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Login   │                                    │  Backend │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /auth/login                          │
     │    { email, password }                        │
     │ ──────────────────────────────────────────▶   │
     │                                                │
     │                         2. Verify credentials │
     │                            Generate JWT token │
     │                                                │
     │  3. { success: true, data: { token, user } }  │
     │ ◀──────────────────────────────────────────   │
     │                                                │
     │  4. Store token in localStorage                │
     │     localStorage.setItem('authToken', token)   │
     │                                                │
     │  5. Redirect to Dashboard                     │
     │                                                │
     ▼                                                │
┌──────────┐                                         │
│Dashboard │                                         │
└────┬─────┘                                         │
     │                                                │
     │  6. GET /dashboard/stats                      │
     │     Headers: {                                │
     │       Authorization: Bearer {token}           │
     │     }                                          │
     │ ──────────────────────────────────────────▶   │
     │                                                │
     │                        7. Verify token        │
     │                           Get stats from DB   │
     │                                                │
     │  8. { success: true, data: { stats } }        │
     │ ◀──────────────────────────────────────────   │
     │                                                │
     │  9. Display stats                             │
     │                                                │
```

---

## 🔄 State Management

```
Component State (useState)
         │
         ├─── Local UI state (forms, modals, etc.)
         │
         └─── Data from API
                  │
                  ├─── Fetched on mount (useEffect)
                  ├─── Updated on user actions
                  └─── Refreshed after mutations
```

### Example State Flow in BotsList:

```
1. Component mounts
   ↓
2. useEffect runs
   ↓
3. Call api.bots.getAll()
   ↓
4. Set loading state: setIsLoading(true)
   ↓
5. Wait for API response
   ↓
6. Update state: setBots(response.data)
   ↓
7. Clear loading: setIsLoading(false)
   ↓
8. Component re-renders with data
   ↓
9. User clicks "Delete"
   ↓
10. Call api.bots.delete(id)
   ↓
11. On success: Update local state
   ↓
12. OR: Refetch entire list
```

---

## 🎯 Key Integration Points Summary

| Location | What to Do | API Method |
|----------|------------|------------|
| Login | Wire authentication | `api.auth.login()` |
| Dashboard | Fetch stats | `api.dashboard.getStats()` |
| BotsList | CRUD operations | `api.bots.*` |
| BotConfiguration | Load & save config | `api.bots.getById()` + `api.bots.update()` |
| Knowledge Base | Manage docs & URLs | `api.knowledgeBase.*` |
| BotsUsers | Manage users | `api.botUsers.*` |
| EditUser | Update & assign bots | `api.botUsers.update()` + `api.botUsers.assignBot()` |

---

## 📚 Additional Resources

- **Type Definitions:** `/src/types/index.ts`
- **API Service:** `/src/services/api.ts`
- **Detailed Guide:** `/API_INTEGRATION_GUIDE.md`
- **Quick Reference:** `/INTEGRATION_QUICK_REFERENCE.md`
- **Checklist:** `/API_INTEGRATION_CHECKLIST.md`

---

**Ready to integrate?** Start with authentication and work your way through each module! 🚀
