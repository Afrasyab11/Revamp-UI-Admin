import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { Search, Mail, Calendar, UserPlus, Bot } from 'lucide-react';
import CreateUserDialog from '@/app/components/CreateUserDialog';
import EditUser from '@/app/components/EditUser';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  bots: string[]; // Array of bot IDs assigned to user
}

export default function BotsUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [botFilter, setBotFilter] = useState<string>('all');
  
  // Bot mapping for display purposes
  const botNames: Record<string, string> = {
    'virtual-assistant': 'Virtual Assistant',
    'customer-support': 'Customer Support Bot',
    'sales-assistant': 'Sales Assistant',
    'technical-support': 'Technical Support Bot',
    'coding-bot-01': 'CodingBot 01',
  };
  
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      joinedDate: '2024-01-15',
      status: 'active',
      bots: ['virtual-assistant', 'customer-support'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      joinedDate: '2024-02-20',
      status: 'active',
      bots: ['sales-assistant', 'technical-support', 'coding-bot-01'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      role: 'Viewer',
      joinedDate: '2024-03-10',
      status: 'inactive',
      bots: ['virtual-assistant'],
    },
  ]);

  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    
    // Bot filter
    const matchesBot = botFilter === 'all' || user.bots.includes(botFilter);
    
    return matchesSearch && matchesStatus && matchesRole && matchesBot;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleAddNewUser = () => {
    setCreateUserDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setCreateUserDialogOpen(open);
  };

  // If a user is selected for editing, show the edit screen
  if (selectedUser) {
    return <EditUser user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Add User Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Users Management</h1>
            <p className="text-gray-500 mt-1">Manage users who have access to your bots</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-11 px-6"
            onClick={handleAddNewUser}
          >
            <UserPlus className="size-4" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-gray-200"
                />
              </div>
              
              {/* Filters Row */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] md:flex-1 md:min-w-[160px] h-10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] md:flex-1 md:min-w-[160px] h-10">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={botFilter} onValueChange={setBotFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] md:flex-1 md:min-w-[180px] h-10">
                    <SelectValue placeholder="Assigned Bots" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bots</SelectItem>
                    <SelectItem value="virtual-assistant">Virtual Assistant</SelectItem>
                    <SelectItem value="customer-support">Customer Support Bot</SelectItem>
                    <SelectItem value="sales-assistant">Sales Assistant</SelectItem>
                    <SelectItem value="technical-support">Technical Support Bot</SelectItem>
                    <SelectItem value="coding-bot-01">CodingBot 01</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters Button - Only show if any filter is active */}
                {(statusFilter !== 'all' || roleFilter !== 'all' || botFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('all');
                      setRoleFilter('all');
                      setBotFilter('all');
                    }}
                    className="text-gray-600 hover:text-gray-900 h-10 px-4 w-full sm:w-auto"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-4" />
                        Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    
                    {/* Assigned Bots */}
                    {user.bots.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Bot className="size-4" />
                          <span className="font-medium">Assigned Bots:</span>
                        </div>
                        {user.bots.map((botId) => (
                          <Badge
                            key={botId}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200"
                          >
                            {botNames[botId] || botId}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Badge variant="outline" className="whitespace-nowrap">
                    {user.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your search.</p>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <CreateUserDialog 
        open={createUserDialogOpen} 
        onOpenChange={handleDialogClose}
      />
    </div>
  );
}