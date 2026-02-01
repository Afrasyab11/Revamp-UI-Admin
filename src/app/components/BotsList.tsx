import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Badge } from '@/app/components/ui/badge';
import { Search, Plus, Settings, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import CreateBotDialog from '@/app/components/CreateBotDialog';
import { toast } from 'sonner';

interface Bot {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface BotsListProps {
  onConfigureBot: (botId: string) => void;
}

export default function BotsList({ onConfigureBot }: BotsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [bots, setBots] = useState<Bot[]>([
    {
      id: '1',
      name: 'CodingBot 01',
      description: 'A comprehensive coding assistant bot designed to help developers with code completion, debugging, and best practices across multiple programming languages.',
      isActive: true,
    },
    {
      id: '2',
      name: 'Virtual Assistant',
      description: 'A versatile virtual assistant for general inquiries and support tasks.',
      isActive: true,
    },
  ]);

  const toggleBotStatus = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id ? { ...bot, isActive: !bot.isActive } : bot
    ));
  };

  const handleCreateBot = (name: string, description: string) => {
    const newBot: Bot = {
      id: (bots.length + 1).toString(),
      name,
      description,
      isActive: false,
    };
    setBots([...bots, newBot]);
    toast.success('Bot created successfully!');
  };

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Bots Management</h1>
            <p className="text-gray-500 mt-1">Manage and configure your virtual assistants</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="size-4 mr-2" />
            Create Bot
          </Button>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Search by bot name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-gray-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bots Grid */}
        <div className="grid gap-4">
          {filteredBots.map((bot) => (
            <Card key={bot.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                      <Badge variant={bot.isActive ? 'default' : 'secondary'} className={bot.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {bot.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{bot.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status</span>
                      <Switch
                        checked={bot.isActive}
                        onCheckedChange={() => toggleBotStatus(bot.id)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConfigureBot(bot.id)}
                      className="gap-2"
                    >
                      <Settings className="size-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bots found matching your search.</p>
          </div>
        )}
      </div>

      <CreateBotDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateBot={handleCreateBot}
      />
    </div>
  );
}