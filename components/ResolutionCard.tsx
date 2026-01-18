
import React from 'react';
import { Resolution } from '../types';

interface Props {
  resolution: Resolution;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const ResolutionCard: React.FC<Props> = ({ resolution, onToggle, onDelete, onEdit }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = resolution.lastCompletedDate === today;

  const categoryThemes: Record<string, { bg: string, accent: string, text: string }> = {
    Health: { bg: 'bg-red-50', accent: 'border-red-500', text: 'text-red-700' },
    Coding: { bg: 'bg-blue-50', accent: 'border-blue-500', text: 'text-blue-700' },
    Reading: { bg: 'bg-green-50', accent: 'border-green-500', text: 'text-green-700' },
    Finance: { bg: 'bg-yellow-50', accent: 'border-yellow-500', text: 'text-yellow-700' },
    Other: { bg: 'bg-gray-50', accent: 'border-gray-500', text: 'text-gray-700' }
  };

  const theme = categoryThemes[resolution.category] || categoryThemes.Other;

  return (
    <div className={`p-5 pixel-border-sm relative overflow-hidden transition-all duration-300 ${isCompletedToday ? 'translate-y-1' : ''} ${theme.bg}`}>
      {resolution.streak >= 3 && (
        <div className="absolute -top-1 -right-8 rotate-45 bg-orange-500 text-white px-8 py-1 pixel-font text-[8px] border-b-2 border-black z-10 shadow-sm">
          STREAKING!
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0 pr-4">
          <span className={`text-[10px] pixel-font px-2 py-1 mb-2 inline-block border-2 border-black bg-white ${theme.text}`}>
            {resolution.category.toUpperCase()}
          </span>
          <h3 className="text-2xl font-bold uppercase tracking-tight break-words truncate">{resolution.title}</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 font-bold text-xs"
            title="Edit Quest"
          >
            [EDIT]
          </button>
          <button 
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 font-bold text-xs"
            title="Abandon Quest"
          >
            [X]
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="text-center bg-white px-3 py-1 border-2 border-black">
            <p className="text-[10px] pixel-font">STREAK</p>
            <p className="text-xl font-bold text-orange-600">{resolution.streak}</p>
          </div>
          <div className="text-center bg-white px-3 py-1 border-2 border-black">
            <p className="text-[10px] pixel-font">TOTAL</p>
            <p className="text-xl font-bold">{resolution.totalCompletions}</p>
          </div>
        </div>
        
        <button 
          onClick={onToggle}
          className={`px-6 py-3 pixel-border-sm pixel-button font-bold text-lg min-w-[120px] transition-colors
            ${isCompletedToday 
              ? 'bg-green-500 text-white' 
              : 'bg-white hover:bg-gray-100 text-black'}`}
        >
          {isCompletedToday ? 'COMPLETED' : 'DO IT!'}
        </button>
      </div>

      <div className="mt-6 flex gap-1">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-3 border-2 border-black ${i < (resolution.streak % 8) ? 'bg-black' : 'bg-white/50'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionCard;
