# Project File Structure

## 📁 Complete Project Layout

```
virtual-assistant-admin-panel/
│
├── 📚 DOCUMENTATION FILES (Start Here!)
│   ├── README_DEVELOPER.md                 ⭐ START HERE - Developer onboarding
│   ├── ARCHITECTURE.md                     🏗️ System architecture & data flow
│   ├── INTEGRATION_QUICK_REFERENCE.md      📋 Quick lookup of all integration points
│   ├── API_INTEGRATION_GUIDE.md            📝 Detailed step-by-step guide
│   ├── API_INTEGRATION_CHECKLIST.md        ✅ Track your integration progress
│   └── FILE_STRUCTURE.md                   📂 This file - Project navigation
│
├── 📦 CONFIGURATION FILES
│   ├── .env.local                          🔧 Environment variables (create this!)
│   ├── package.json                        📦 Dependencies
│   ├── tsconfig.json                       ⚙️ TypeScript configuration
│   ├── vite.config.ts                      ⚡ Vite configuration
│   └── tailwind.config.js                  🎨 Tailwind CSS config (if needed)
│
├── 🎨 PUBLIC ASSETS
│   └── public/
│       └── (static assets)
│
└── 💻 SOURCE CODE
    └── src/
        │
        ├── 🎯 MAIN ENTRY POINTS
        │   ├── main.tsx                    # React entry point
        │   └── index.css                   # Global styles
        │
        ├── 📊 TYPE DEFINITIONS ⭐ IMPORTANT
        │   └── types/
        │       └── index.ts                # All TypeScript interfaces & types
        │                                   # User, Bot, BotUser, Document, etc.
        │
        ├── 🔌 API SERVICE LAYER ⭐ IMPORTANT
        │   └── services/
        │       └── api.ts                  # Centralized API service
        │                                   # All endpoints organized by module
        │                                   # auth, dashboard, bots, botUsers, etc.
        │
        ├── 🎨 STYLES
        │   └── styles/
        │       ├── theme.css               # Design tokens
        │       └── fonts.css               # Font imports
        │
        └── 📱 APPLICATION COMPONENTS
            └── app/
                │
                ├── App.tsx                 # Main app component & routing logic
                │
                └── components/             # All UI components
                    │
                    ├── 🔐 AUTHENTICATION
                    │   └── Login.tsx                    # Login page
                    │       • Wire: api.auth.login()
                    │
                    ├── 📊 DASHBOARD
                    │   └── Dashboard.tsx                # Main dashboard
                    │       • Wire: api.dashboard.getStats()
                    │
                    ├── 🤖 BOT MANAGEMENT
                    │   ├── BotsList.tsx                 # Bots list & CRUD
                    │   │   • Wire: api.bots.getAll()
                    │   │   • Wire: api.bots.create()
                    │   │   • Wire: api.bots.delete()
                    │   │   • Wire: api.bots.toggleStatus()
                    │   │
                    │   └── BotConfiguration.tsx         # Bot settings (4 tabs)
                    │       • Wire: api.bots.getById()
                    │       • Wire: api.bots.update()
                    │       • Wire: api.knowledgeBase.uploadDocument()
                    │       • Wire: api.knowledgeBase.addUrl()
                    │       • Wire: api.knowledgeBase.deleteDocument()
                    │       • Wire: api.knowledgeBase.deleteUrl()
                    │       • Wire: api.knowledgeBase.reindex()
                    │
                    ├── 👥 USER MANAGEMENT
                    │   ├── BotsUsers.tsx                # Bot users list
                    │   │   • Wire: api.botUsers.getAll()
                    │   │   • Wire: api.botUsers.create()
                    │   │   • Wire: api.botUsers.delete()
                    │   │
                    │   └── EditUser.tsx                 # Edit user & bot assignments
                    │       • Wire: api.botUsers.getById()
                    │       • Wire: api.botUsers.update()
                    │       • Wire: api.botUsers.assignBot()
                    │       • Wire: api.botUsers.unassignBot()
                    │
                    └── 🧩 REUSABLE UI COMPONENTS
                        └── ui/
                            ├── button.tsx               # Button component
                            ├── card.tsx                 # Card component
                            ├── input.tsx                # Input component
                            ├── label.tsx                # Label component
                            ├── textarea.tsx             # Textarea component
                            ├── select.tsx               # Select dropdown
                            ├── switch.tsx               # Toggle switch
                            ├── checkbox.tsx             # Checkbox
                            ├── badge.tsx                # Badge component
                            ├── separator.tsx            # Separator line
                            ├── tabs.tsx                 # Tabs component
                            ├── table.tsx                # Table components
                            ├── alert-dialog.tsx         # Alert dialog
                            └── dialog.tsx               # Modal dialog
```

---

## 🎯 Integration Points by File

### 1️⃣ Start Here
```
/README_DEVELOPER.md
└── Read this first for overview and quick start
```

### 2️⃣ Configuration
```
/.env.local (create this)
└── Add: VITE_API_BASE_URL=http://localhost:3000/api

/src/services/api.ts (line ~30)
└── Add: 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
```

### 3️⃣ Type Definitions Reference
```
/src/types/index.ts
├── User interface
├── Bot interface
├── BotUser interface
├── Document interface
├── IndexedUrl interface
├── KnowledgeBaseSettings interface
├── DashboardStats interface
├── ApiResponse<T> interface
└── PaginatedResponse<T> interface
```

### 4️⃣ API Service Reference
```
/src/services/api.ts
├── api.auth
│   ├── login(email, password)
│   ├── logout()
│   └── getCurrentUser()
│
├── api.dashboard
│   └── getStats()
│
├── api.bots
│   ├── getAll(page, limit, search)
│   ├── getById(id)
│   ├── create(botData)
│   ├── update(id, botData)
│   ├── delete(id)
│   └── toggleStatus(id, status)
│
├── api.botUsers
│   ├── getAll(page, limit, search)
│   ├── getById(id)
│   ├── create(userData)
│   ├── update(id, userData)
│   ├── delete(id)
│   ├── assignBot(userId, botId)
│   └── unassignBot(userId, botId)
│
└── api.knowledgeBase
    ├── getDocuments(botId)
    ├── uploadDocument(botId, file)
    ├── deleteDocument(botId, docId)
    ├── getUrls(botId)
    ├── addUrl(botId, url, scope)
    ├── deleteUrl(botId, urlId)
    ├── getSettings(botId)
    ├── updateSettings(botId, settings)
    └── reindex(botId)
```

### 5️⃣ Components to Wire
```
/src/app/components/
│
├── Login.tsx
│   └── handleLogin() → api.auth.login()
│
├── Dashboard.tsx
│   └── useEffect() → api.dashboard.getStats()
│
├── BotsList.tsx
│   ├── useEffect() → api.bots.getAll()
│   ├── handleCreateBot() → api.bots.create()
│   ├── handleConfirmDelete() → api.bots.delete()
│   └── handleStatusToggle() → api.bots.toggleStatus()
│
├── BotConfiguration.tsx
│   ├── useEffect() → api.bots.getById()
│   ├── handleSaveConfiguration() → api.bots.update()
│   ├── handleFileUpload() → api.knowledgeBase.uploadDocument()
│   ├── handleAddUrl() → api.knowledgeBase.addUrl()
│   ├── handleConfirmDelete() → api.knowledgeBase.delete*()
│   └── handleReindex() → api.knowledgeBase.reindex()
│
├── BotsUsers.tsx
│   ├── useEffect() → api.botUsers.getAll()
│   ├── handleCreateUser() → api.botUsers.create()
│   └── handleDeleteUser() → api.botUsers.delete()
│
└── EditUser.tsx
    ├── useEffect() → api.botUsers.getById()
    ├── handleSave() → api.botUsers.update()
    ├── handleAssignBot() → api.botUsers.assignBot()
    └── handleUnassignBot() → api.botUsers.unassignBot()
```

---

## 🔍 How to Find Things

### Looking for API endpoints?
```
📁 /src/services/api.ts
```

### Looking for type definitions?
```
📁 /src/types/index.ts
```

### Looking for integration instructions?
```
📁 /API_INTEGRATION_GUIDE.md (detailed)
📁 /INTEGRATION_QUICK_REFERENCE.md (quick lookup)
```

### Looking for a specific component?
```
📁 /src/app/components/
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── BotsList.tsx
    ├── BotConfiguration.tsx
    ├── BotsUsers.tsx
    └── EditUser.tsx
```

### Looking for what to do next?
```
📁 /API_INTEGRATION_CHECKLIST.md
```

---

## 📊 Component Hierarchy

```
App.tsx (Main Router)
│
├── Login.tsx
│   └── (Login form)
│
└── Dashboard.tsx (Main Layout)
    ├── Sidebar Navigation
    │
    ├── Overview Tab
    │   └── Stats Cards
    │
    ├── Bots Tab
    │   ├── BotsList.tsx
    │   │   ├── Table with pagination
    │   │   └── Create Bot Dialog
    │   │
    │   └── BotConfiguration.tsx
    │       ├── Tabs Navigation
    │       ├── Basic Settings Tab
    │       ├── Behavior & Prompts Tab
    │       ├── Appearance Tab
    │       ├── Knowledge Base Tab
    │       │   ├── Documents Section
    │       │   ├── URLs Section
    │       │   └── Settings Section
    │       └── Live Preview Panel
    │
    └── Bot Users Tab
        ├── BotsUsers.tsx
        │   ├── Table with pagination
        │   └── Create User Dialog
        │
        └── EditUser.tsx
            ├── Basic Information Section
            ├── Bot Assignment Section
            └── Activity Section
```

---

## 🎯 Integration Workflow

```
Step 1: Setup
├── Create .env.local
├── Add API_BASE_URL
└── Add auth header in api.ts

Step 2: Authentication
├── Open /src/app/components/Login.tsx
├── Find handleLogin function
├── Wire api.auth.login()
└── Test login flow

Step 3: Dashboard
├── Open /src/app/components/Dashboard.tsx
├── Add useEffect hook
├── Wire api.dashboard.getStats()
└── Test data displays

Step 4: Continue with other modules...
├── BotsList.tsx
├── BotConfiguration.tsx
├── BotsUsers.tsx
└── EditUser.tsx

Step 5: Test & Deploy
├── Test all CRUD operations
├── Test edge cases
└── Deploy!
```

---

## 📖 Documentation Reading Order

**For Quick Integration (30 min read):**
1. README_DEVELOPER.md (10 mins)
2. INTEGRATION_QUICK_REFERENCE.md (10 mins)
3. FILE_STRUCTURE.md - this file (5 mins)
4. Start coding! (5 mins setup)

**For Deep Understanding (1 hour read):**
1. README_DEVELOPER.md (10 mins)
2. ARCHITECTURE.md (20 mins)
3. API_INTEGRATION_GUIDE.md (20 mins)
4. INTEGRATION_QUICK_REFERENCE.md (5 mins)
5. API_INTEGRATION_CHECKLIST.md (5 mins)

---

## 🚀 Ready to Code?

### Your Starting Point:
```
1. Open: /README_DEVELOPER.md
2. Follow: Quick Start section
3. Reference: /src/services/api.ts
4. Wire: Components one by one
5. Track: Using API_INTEGRATION_CHECKLIST.md
```

### Most Important Files:
- **📖 README_DEVELOPER.md** - Your guide
- **🔌 /src/services/api.ts** - Your API layer
- **📊 /src/types/index.ts** - Your data contracts
- **✅ API_INTEGRATION_CHECKLIST.md** - Your progress tracker

---

## 💡 Pro Tips

### Quick Navigation Tips:
- Use `Ctrl+P` (VS Code) to quickly find files
- Search for `api.` to find all API calls
- Search for `TODO` to find integration points
- Search for `handleSave` to find save operations

### Integration Tips:
- Start with Login (easiest)
- Then do Dashboard (test connection)
- Then CRUD operations (most common)
- Finally complex features (file uploads)

### Debugging Tips:
- Check Network tab in DevTools
- Add console.logs in api.ts
- Test with Postman first
- Use React DevTools to inspect state

---

**Everything you need is here. Good luck! 🚀**
