
import React, { useState, useEffect } from 'react';
import { User, Resolution } from '../types';
import { storage } from '../services/storage';
import ResolutionCard from './ResolutionCard';

interface Props {
  user: User;
  onOpenCoach: () => void;
  onUpdateUser: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onOpenCoach, onUpdateUser }) => {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Resolution['category']>('Health');

  useEffect(() => {
    setResolutions(storage.getResolutions(user.id));
  }, [user.id]);

  const openAdd = () => {
    setModalMode('add');
    setTitle('');
    setCategory('Health');
  };

  const openEdit = (res: Resolution) => {
    setModalMode('edit');
    setEditingId(res.id);
    setTitle(res.title);
    setCategory(res.category);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (modalMode === 'add') {
      const added = storage.addResolution(user.id, title, category);
      setResolutions(prev => [...prev, added]);
    } else if (modalMode === 'edit' && editingId) {
      const updated = storage.updateResolution(editingId, title, category);
      if (updated) {
        setResolutions(prev => prev.map(r => r.id === editingId ? updated : r));
      }
    }
    
    setModalMode(null);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Abandon this quest? All progress will be lost!')) {
      storage.deleteResolution(id);
      setResolutions(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleToggle = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { updatedResolution } = storage.toggleCompletion(id, user.id, today);
    if (updatedResolution) {
      setResolutions(prev => prev.map(r => r.id === id ? updatedResolution : r));
      onUpdateUser();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50 p-6 pixel-border-sm">
        <div>
          <h2 className="pixel-font text-lg text-blue-900">YOUR QUEST LOG</h2>
          <p className="text-blue-700 font-bold">Progress through 2026 one day at a time.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={openAdd}
            className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 pixel-border-sm pixel-button font-bold text-sm"
          >
            + NEW QUEST
          </button>
          <button 
            onClick={onOpenCoach}
            className="flex-1 sm:flex-none bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 pixel-border-sm pixel-button font-bold text-sm"
          >
            AI COACH
          </button>
        </div>
      </div>

      {resolutions.length === 0 ? (
        <div className="text-center py-20 bg-white pixel-border-sm opacity-60">
          <p className="pixel-font text-sm mb-4">NO QUESTS ACTIVE</p>
          <p className="text-gray-500">Click "+ NEW QUEST" to begin your journey.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resolutions.map(res => (
            <ResolutionCard 
              key={res.id} 
              resolution={res} 
              onToggle={() => handleToggle(res.id)}
              onDelete={() => handleDelete(res.id)}
              onEdit={() => openEdit(res)}
            />
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 pixel-border max-w-md w-full animate-in fade-in zoom-in duration-200">
            <h3 className="pixel-font text-sm mb-6">{modalMode === 'add' ? 'START NEW QUEST' : 'MODIFY QUEST'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">QUEST TITLE</label>
                <input 
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border-4 border-black focus:outline-none focus:border-green-500"
                  placeholder="e.g. Morning Jog"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">CATEGORY</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Resolution['category'])}
                  className="w-full p-2 border-4 border-black focus:outline-none"
                >
                  <option value="Health">HEALTH</option>
                  <option value="Coding">CODING</option>
                  <option value="Reading">READING</option>
                  <option value="Finance">FINANCE</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white p-3 pixel-border-sm pixel-button font-bold"
                >
                  {modalMode === 'add' ? 'START' : 'UPDATE'}
                </button>
                <button 
                  onClick={() => setModalMode(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 p-3 pixel-border-sm pixel-button font-bold"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
