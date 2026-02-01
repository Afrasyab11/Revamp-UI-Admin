# API Integration Quick Reference

## 🎯 At a Glance - Where to Add API Calls

| Component | File | Function/Location | API Method | What to Wire |
|-----------|------|-------------------|------------|--------------|
| **Login** | Login.tsx | `handleLogin()` ~line 50 | `api.auth.login()` | Login authentication |
| **Dashboard** | Dashboard.tsx | `useEffect()` add new | `api.dashboard.getStats()` | Dashboard statistics |
| **Bots List** | BotsList.tsx | `useEffect()` add new | `api.bots.getAll()` | Fetch bots list |
| | | `handleCreateBot()` ~line 120 | `api.bots.create()` | Create new bot |
| | | `handleConfirmDelete()` ~line 90 | `api.bots.delete()` | Delete bot |
| | | `handleStatusToggle()` ~line 75 | `api.bots.toggleStatus()` | Toggle bot status |
| **Bot Config** | BotConfiguration.tsx | `useEffect()` add new | `api.bots.getById()` | Load bot config |
| | | `handleSaveConfiguration()` ~line 210 | `api.bots.update()` | Save bot config |
| | | `handleFileUpload()` ~line 115 | `api.knowledgeBase.uploadDocument()` | Upload documents |
| | | `handleAddUrl()` ~line 145 | `api.knowledgeBase.addUrl()` | Add URL to index |
| | | `handleConfirmDelete()` ~line 155 | `api.knowledgeBase.deleteDocument/Url()` | Delete doc/URL |
| | | `handleReindex()` ~line 225 | `api.knowledgeBase.reindex()` | Reindex knowledge base |
| **Bot Users** | BotsUsers.tsx | `useEffect()` add new | `api.botUsers.getAll()` | Fetch users list |
| | | `handleCreateUser()` add | `api.botUsers.create()` | Create new user |
| | | `handleDeleteUser()` add | `api.botUsers.delete()` | Delete user |
| **Edit User** | EditUser.tsx | `useEffect()` add new | `api.botUsers.getById()` | Load user data |
| | | `handleSave()` add | `api.botUsers.update()` | Save user changes |
| | | `handleAssignBot()` add | `api.botUsers.assignBot()` | Assign bot to user |
| | | `handleUnassignBot()` add | `api.botUsers.unassignBot()` | Unassign bot from user |

## 📂 Key Files

```
/src/types/index.ts          # All TypeScript types
/src/services/api.ts         # All API endpoints
/API_INTEGRATION_GUIDE.md    # Detailed integration guide
```

## 🚀 3-Step Integration Process

### Step 1: Setup (5 minutes)
```bash
# Add environment variable
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env.local
```

### Step 2: Add Auth Token (2 minutes)
Update `/src/services/api.ts` line 30:
```typescript
'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
```

### Step 3: Wire Each Component (30-60 minutes)
1. Import API: `import api from '@/services/api';`
2. Find the function mentioned in table above
3. Replace mock data/logic with API call
4. Test!

## 💡 Example: Wire Login in 2 Minutes

**File:** `/src/app/components/Login.tsx`

**Find:** `handleLogin` function (~line 50)

**Replace:**
```typescript
// FROM THIS:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  setTimeout(() => {
    if (email === 'admin@example.com' && password === 'admin123') {
      onLoginSuccess();
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials');
    }
    setIsLoading(false);
  }, 1000);
};

// TO THIS:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await api.auth.login(email, password);
    
    if (response.success) {
      localStorage.setItem('authToken', response.data.token);
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

Done! ✅

## 🔍 Search Hints

Use these search terms to find integration points:

| Search For | To Find |
|------------|---------|
| `TODO: Replace with API call` | Integration points in api.ts |
| `handleSave` | Save functions |
| `handleCreate` | Create functions |
| `handleDelete` | Delete functions |
| `useEffect` | Data loading points |
| `setTimeout` | Mock delays to replace |

## 📊 API Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ /* ... */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🎬 Recommended Integration Order

1. ✅ **Authentication** (Login) - Start here
2. ✅ **Dashboard** - Test API connection
3. ✅ **Bots List** - CRUD operations
4. ✅ **Bot Configuration** - Complex updates
5. ✅ **Knowledge Base** - File uploads
6. ✅ **Bot Users** - User management
7. ✅ **Edit User** - Bot assignments

## 🆘 Need Help?

- See `/API_INTEGRATION_GUIDE.md` for detailed code examples
- All types are in `/src/types/index.ts`
- All API functions are in `/src/services/api.ts`
- All functions have JSDoc comments with endpoint details

---

**Total Integration Time:** ~2-3 hours for full application

**Next Steps:** Start with Login → Test → Move to Dashboard → Continue down the list!
