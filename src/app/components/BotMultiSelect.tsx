import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Plus, X } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
}

interface BotMultiSelectProps {
  selectedBots: string[];
  onChange: (selectedBots: string[]) => void;
  availableBots?: Bot[];
  required?: boolean;
}

export default function BotMultiSelect({ 
  selectedBots, 
  onChange, 
  availableBots = [],
  required = false
}: BotMultiSelectProps) {
  // Default bots if none provided
  const bots: Bot[] = availableBots.length > 0 ? availableBots : [
    { id: 'virtual-assistant', name: 'Virtual Assistant' },
    { id: 'customer-support', name: 'Customer Support Bot' },
    { id: 'sales-assistant', name: 'Sales Assistant' },
    { id: 'technical-support', name: 'Technical Support Bot' },
    { id: 'coding-bot-01', name: 'CodingBot 01' },
  ];

  // Separate assigned and available bots
  const assignedBots = bots.filter(bot => selectedBots.includes(bot.id));
  const availableBotsToAssign = bots.filter(bot => !selectedBots.includes(bot.id));

  const handleAssign = (botId: string) => {
    if (!selectedBots.includes(botId)) {
      onChange([...selectedBots, botId]);
    }
  };

  const handleUnassign = (botId: string) => {
    onChange(selectedBots.filter(id => id !== botId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-900">
          Bot Assignments{required && <span className="text-red-500">*</span>}
        </Label>
        <span className="text-xs text-gray-500">
          {assignedBots.length} of {bots.length} bots assigned
        </span>
      </div>

      {/* Assigned Bots Table */}
      {assignedBots.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Assigned Bots</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Bot Name
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-32">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignedBots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-900 font-medium">{bot.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassign(bot.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-1.5"
                      >
                        <X className="size-3.5" />
                        Unassign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Available Bots Table */}
      {availableBotsToAssign.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Available Bots</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Bot Name
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider w-32">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availableBotsToAssign.map((bot) => (
                  <tr key={bot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{bot.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssign(bot.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-1.5"
                      >
                        <Plus className="size-3.5" />
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Bots Assigned Message */}
      {availableBotsToAssign.length === 0 && assignedBots.length > 0 && (
        <div className="text-center py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">All available bots have been assigned to this user.</p>
        </div>
      )}

      {/* No Bots Message */}
      {bots.length === 0 && (
        <div className="text-center py-8 px-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">No bots available</p>
        </div>
      )}
    </div>
  );
}
