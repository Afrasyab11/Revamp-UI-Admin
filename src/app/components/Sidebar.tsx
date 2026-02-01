import { useState } from 'react';
import { Bot, Users, LogOut, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'bots-list' | 'bots-users') => void;
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function Sidebar({ currentView, onViewChange, user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10 shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5 text-gray-600" />
          ) : (
            <ChevronLeft className="size-3.5 text-gray-600" />
          )}
        </button>

        <div className="p-6">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="size-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-semibold text-lg whitespace-nowrap">Virtual Assistant</h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Configuration
              </p>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentView === 'bots-list' ? 'secondary' : 'ghost'}
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  onClick={() => onViewChange('bots-list')}
                >
                  <Settings className={`size-4 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && 'Bots Lists'}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Bots Lists</p>
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={currentView === 'bots-users' ? 'secondary' : 'ghost'}
                  className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  onClick={() => onViewChange('bots-users')}
                >
                  <Users className={`size-4 ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && 'Bots Users'}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Bots Users</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-2">
          {/* User Profile Section */}
          <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Avatar className="size-9 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm">
                {getInitials(user.name || 'User')}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>

          <Separator />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 ${
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                }`}
                onClick={onLogout}
              >
                <LogOut className={`size-4 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && 'Logout'}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}