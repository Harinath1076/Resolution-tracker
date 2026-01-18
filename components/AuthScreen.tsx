
import React, { useState } from 'react';

interface Props {
  onLogin: (username: string) => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 sm:pt-20">
      <div className="bg-white p-8 pixel-border max-w-md w-full">
        <h1 className="pixel-font text-xl text-center mb-8">START YOUR QUEST</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-2">HERO NAME</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-4 border-black focus:outline-none focus:border-blue-500"
              placeholder="e.g. PixelWarrior99"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 pixel-border pixel-button pixel-font text-sm"
          >
            ENTER 2026
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 italic">
          No password required for this demo. Just choose a unique name to save your progress locally.
        </div>
      </div>

      <div className="mt-12 text-center max-w-sm px-4">
        <div className="mb-4">
          <img 
            src="https://picsum.photos/seed/pixelart/200/150" 
            alt="Pixel Adventure" 
            className="pixel-border mx-auto grayscale hover:grayscale-0 transition-all cursor-pointer"
          />
        </div>
        <p className="font-bold text-gray-600">Prepare for the ultimate 2026 self-improvement adventure.</p>
      </div>
    </div>
  );
};

export default AuthScreen;
