import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'sonner';
import BotMultiSelect from '@/app/components/BotMultiSelect';
import { Switch } from '@/app/components/ui/switch';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  bots: string[];
}

interface EditUserProps {
  user: User;
  onBack: () => void;
}

export default function EditUser({ user, onBack }: EditUserProps) {
  const [firstName, setFirstName] = useState(user.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' ') || '');
  const [username, setUsername] = useState(user.email.split('@')[0] || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role.toLowerCase() || '');
  const [bots, setBots] = useState<string[]>(user.bots || []);
  const [isActive, setIsActive] = useState(user.status === 'active');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !username || !email || !role || !bots.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('User updated successfully!');
    onBack();
  };

  const handleCancel = () => {
    onBack();
  };

  const handleBotsChange = (newBots: string[]) => {
    setBots(newBots);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back to Users
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
              <p className="text-sm text-gray-500 mt-1">Update user information and permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Save className="size-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-0.5">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                      Account Status
                    </Label>
                    <p className="text-sm text-gray-500">
                      {isActive ? 'User can access the system' : 'User is blocked from accessing the system'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{isActive ? 'Active' : 'Inactive'}</span>
                    <Switch
                      id="status"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* First Name and Last Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                {/* Username and Email Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-900">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                      Password <span className="text-gray-500 font-normal">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-900">
                      Role <span className="text-red-500">*</span>
                    </Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Bot Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <BotMultiSelect 
                  selectedBots={bots} 
                  onChange={handleBotsChange} 
                  required 
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}