import { useState } from 'react';
import LoginScreen from '@/app/components/LoginScreen';
import Dashboard from '@/app/components/Dashboard';
import { Toaster } from '@/app/components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({ name: '', email: '' });

  const handleLogin = (username: string) => {
    setLoggedInUser({
      name: username,
      email: `${username.toLowerCase().replace(' ', '.')}@example.com`
    });
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Dashboard user={loggedInUser} onLogout={() => setIsLoggedIn(false)} />
      <Toaster />
    </>
  );
}