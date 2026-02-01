import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import BotsList from '@/app/components/BotsList';
import BotsUsers from '@/app/components/BotsUsers';
import BotConfiguration from '@/app/components/BotConfiguration';

type View = 'bots-list' | 'bots-users' | 'bot-config';

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<View>('bots-list');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  const handleConfigureBot = (botId: string) => {
    setSelectedBotId(botId);
    setCurrentPage('bot-config');
  };

  const handleBackToBotsList = () => {
    setSelectedBotId(null);
    setCurrentPage('bots-list');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentPage} onViewChange={setCurrentPage} user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        {currentPage === 'bots-list' && (
          <BotsList onConfigureBot={handleConfigureBot} />
        )}
        {currentPage === 'bots-users' && <BotsUsers />}
        {currentPage === 'bot-config' && selectedBotId && (
          <BotConfiguration botId={selectedBotId} onBack={handleBackToBotsList} />
        )}
      </main>
    </div>
  );
}