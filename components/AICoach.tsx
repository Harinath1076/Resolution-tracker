
import React, { useState, useEffect } from 'react';
import { User, Resolution } from '../types';
import { storage } from '../services/storage';
import { getAICoachAdvice, getAICoachAvatar } from '../services/gemini';

interface Props {
  user: User;
  onBack: () => void;
}

const AICoach: React.FC<Props> = ({ user, onBack }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const resolutions = storage.getResolutions(user.id);
    
    // Fetch both advice and avatar in parallel
    const [adviceText, avatarUrl] = await Promise.all([
      getAICoachAdvice(user, resolutions),
      getAICoachAvatar()
    ]);
    
    setAdvice(adviceText);
    setAvatar(avatarUrl);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 pixel-border-sm pixel-button font-bold text-sm"
        >
          &lt; MAP
        </button>
        <h2 className="pixel-font text-lg">THE PIXEL CAVE</h2>
      </div>

      <div className="bg-black text-green-400 p-6 sm:p-10 pixel-border crt-screen relative min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="crt-flicker">
          {loading ? (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-green-900/30 pixel-border-sm animate-pulse flex items-center justify-center">
                <span className="text-3xl">?</span>
              </div>
              <p className="pixel-font text-xs animate-bounce">SUMMONING THE MASTER...</p>
            </div>
          ) : (
            <div className="space-y-8 flex flex-col items-center">
              {avatar && (
                <div className="relative">
                  <img 
                    src={avatar} 
                    alt="Pixel Master" 
                    className="w-32 h-32 pixel-border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-black px-2 py-1 text-[10px] pixel-font">
                    MASTER
                  </div>
                </div>
              )}
              
              <div className="max-w-xl">
                <p className="text-2xl sm:text-3xl leading-snug font-bold">
                  "{advice}"
                </p>
              </div>

              <div className="pt-6 border-t-2 border-green-900 w-full flex justify-between items-center opacity-70">
                <span className="pixel-font text-[10px]">LOCKED IN 2026</span>
                <button 
                  onClick={fetchData}
                  className="text-green-400 hover:text-white underline font-bold text-sm"
                >
                  NEW ADVICE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 pixel-border-sm hover:shadow-lg transition-shadow">
          <h4 className="pixel-font text-[10px] text-blue-600 mb-3 underline">CURRENT STATS</h4>
          <div className="space-y-2 font-bold">
            <div className="flex justify-between items-end">
              <span>LEVEL:</span>
              <span className="text-xl text-blue-600">{user.level}</span>
            </div>
            <div className="w-full bg-gray-200 h-4 border-2 border-black">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${user.xp}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-right">{user.xp}/100 XP TO NEXT LEVEL</p>
          </div>
        </div>
        
        <div className="bg-white p-5 pixel-border-sm">
          <h4 className="pixel-font text-[10px] text-purple-600 mb-3 underline">LEGEND</h4>
          <ul className="text-sm space-y-1 font-bold text-gray-700">
            <li>• COMPLETE QUESTS TO GAIN XP</li>
            <li>• STREAKS INCREASE YOUR RANK</li>
            <li>• MASTER ADVICE REFRESHES DAILY</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
