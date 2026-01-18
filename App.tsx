
import React, { useState, useEffect } from 'react';
import { User, AppView } from './types';
import { storage } from './services/storage';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import AICoach from './components/AICoach';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const session = storage.getCurrentUser();
    if (session) {
      setUser(session);
      setView(AppView.DASHBOARD);
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (username: string) => {
    const loggedInUser = storage.login(username);
    setUser(loggedInUser);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    storage.logout();
    setUser(null);
    setView(AppView.AUTH);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="pixel-font animate-pulse text-2xl">LOADING QUEST...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-10">
      <header className="bg-white border-b-4 border-black p-4 mb-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div 
            className="pixel-font text-lg cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => user && setView(AppView.DASHBOARD)}
          >
            PIXELQUEST 2026
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold">{user.username}</p>
                <p className="text-xs text-blue-600 font-bold">LVL {user.level} | {user.xp} XP</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 pixel-border-sm pixel-button text-xs font-bold"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {view === AppView.AUTH && <AuthScreen onLogin={handleLogin} />}
        {view === AppView.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            onOpenCoach={() => setView(AppView.COACH)} 
            onUpdateUser={() => setUser(storage.getCurrentUser())}
          />
        )}
        {view === AppView.COACH && user && (
          <AICoach 
            user={user} 
            onBack={() => setView(AppView.DASHBOARD)} 
          />
        )}
      </main>
      
      {/* Footer Navigation for Mobile */}
      {user && view !== AppView.AUTH && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-2 flex justify-around sm:hidden z-50">
           <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className={`flex-1 p-2 pixel-font text-[10px] ${view === AppView.DASHBOARD ? 'text-blue-600' : ''}`}
           >
             QUESTS
           </button>
           <button 
            onClick={() => setView(AppView.COACH)}
            className={`flex-1 p-2 pixel-font text-[10px] ${view === AppView.COACH ? 'text-blue-600' : ''}`}
           >
             COACH
           </button>
        </nav>
      )}
    </div>
  );
};

export default App;
