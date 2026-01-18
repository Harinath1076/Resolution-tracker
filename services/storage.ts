
import { User, Resolution, DailyLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'pixelquest_users',
  RESOLUTIONS: 'pixelquest_resolutions',
  LOGS: 'pixelquest_logs',
  CURRENT_USER: 'pixelquest_session'
};

export const storage = {
  // Auth
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  login: (username: string): User => {
    const users = storage.getUsers();
    let user = users.find(u => u.username === username);
    if (!user) {
      user = { id: crypto.randomUUID(), username, level: 1, xp: 0 };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  // Resolutions
  getResolutions: (userId: string): Resolution[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESOLUTIONS);
    const all: Resolution[] = data ? JSON.parse(data) : [];
    return all.filter(r => r.userId === userId);
  },

  addResolution: (userId: string, title: string, category: Resolution['category']): Resolution => {
    const resolutions = storage.getAllResolutions();
    const newRes: Resolution = {
      id: crypto.randomUUID(),
      userId,
      title,
      category,
      streak: 0,
      lastCompletedDate: null,
      totalCompletions: 0,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify([...resolutions, newRes]));
    return newRes;
  },

  updateResolution: (id: string, title: string, category: Resolution['category']): Resolution | null => {
    const resolutions = storage.getAllResolutions();
    const idx = resolutions.findIndex(r => r.id === id);
    if (idx === -1) return null;
    
    resolutions[idx] = { ...resolutions[idx], title, category };
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(resolutions));
    return resolutions[idx];
  },

  deleteResolution: (id: string) => {
    const all = storage.getAllResolutions().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(all));
    const logs = storage.getAllLogs().filter(l => l.resolutionId !== id);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  toggleCompletion: (resolutionId: string, userId: string, date: string): { success: boolean, updatedResolution: Resolution | null } => {
    const logs = storage.getAllLogs();
    const resolutions = storage.getAllResolutions();
    const resIndex = resolutions.findIndex(r => r.id === resolutionId);

    if (resIndex === -1) return { success: false, updatedResolution: null };

    const existingLogIndex = logs.findIndex(l => l.resolutionId === resolutionId && l.date === date);
    let updatedRes = { ...resolutions[resIndex] };

    if (existingLogIndex > -1) {
      logs.splice(existingLogIndex, 1);
      updatedRes.totalCompletions = Math.max(0, updatedRes.totalCompletions - 1);
      updatedRes.streak = Math.max(0, updatedRes.streak - 1);
      updatedRes.lastCompletedDate = null;
    } else {
      logs.push({ id: crypto.randomUUID(), resolutionId, userId, date });
      updatedRes.totalCompletions += 1;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (updatedRes.lastCompletedDate === yesterdayStr) {
        updatedRes.streak += 1;
      } else {
        updatedRes.streak = 1;
      }
      updatedRes.lastCompletedDate = date;
    }

    resolutions[resIndex] = updatedRes;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(resolutions));
    
    if (existingLogIndex === -1) {
      storage.addXP(userId, 10);
    }

    return { success: true, updatedResolution: updatedRes };
  },

  addXP: (userId: string, amount: number) => {
    const users = storage.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx > -1) {
      users[idx].xp += amount;
      if (users[idx].xp >= 100) {
        users[idx].level += 1;
        users[idx].xp = users[idx].xp - 100;
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[idx]));
    }
  },

  getAllResolutions: (): Resolution[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RESOLUTIONS);
    return data ? JSON.parse(data) : [];
  },
  getAllLogs: (): DailyLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }
};
